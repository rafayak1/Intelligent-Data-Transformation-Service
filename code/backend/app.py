from flask import Flask, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from google.cloud import firestore, storage
import os
from dotenv import load_dotenv
import re
import pandas as pd
from io import BytesIO
import jwt
import datetime
from functools import wraps
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
load_dotenv()
app.secret_key = os.getenv("SECRET_KEY")
if not app.secret_key:
    raise ValueError("SECRET_KEY is not set. Please ensure it's in your .env file.")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gcp-key.json"
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# Initialize Firestore and Cloud Storage
firestore_client = firestore.Client()
storage_client = storage.Client()

def sanitize_bucket_name(name):
    sanitized_name = re.sub(r'[^a-z0-9-]', '-', name.lower().strip('-'))[:63]
    return sanitized_name

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            token = token.split(" ")[1]  # Remove "Bearer" prefix
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            request.user_id = data['user_id']  # Attach `user_id` to the `request` object
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid"}), 401
        except Exception as e:
            return jsonify({"message": f"An error occurred: {str(e)}"}), 401

        return f(*args, **kwargs)

    return decorated

# User model
class User(UserMixin):
    def __init__(self, id, email):
        self.id = id
        self.email = email
        
    def get_id(self):
        return str(self.id)

@login_manager.user_loader
def load_user(user_id):
    user_doc = firestore_client.collection('users').document(user_id).get()
    if user_doc.exists:
        data = user_doc.to_dict()
        return User(id=user_id, email=data['email'])
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "User is not authenticated"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name, email, password = data.get('name'), data.get('email'), data.get('password')
    users_ref = firestore_client.collection('users')
    if users_ref.where('email', '==', email).get():
        return jsonify({"message": "User already exists"}), 400
    sanitized_bucket_name = sanitize_bucket_name(f"{name}-bucket")
    # Check if user already exists
    users_ref = firestore_client.collection('users')
    existing_user = users_ref.where('email', '==', email).get()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400
    
    user_doc = users_ref.document()
    user_id = user_doc.id
    user_doc.set({'name': name, 'email': email, 'password': password, 'bucket': sanitized_bucket_name, 'id': user_id})
    try:
        bucket = storage_client.create_bucket(sanitized_bucket_name)
        bucket.storage_class = "STANDARD"
        bucket.update()
        print(f"{sanitized_bucket_name} created.")
    except Exception as e:
        print(f"Error creating bucket: {e}")
        return jsonify({"message": "Failed to create bucket"}), 500
    return jsonify({"message": "User registered successfully", "bucket": sanitized_bucket_name}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email, password = data.get('email'), data.get('password')
    user_doc = firestore_client.collection('users').where('email', '==', email).get()
    if user_doc:
        user_data = user_doc[0].to_dict()
        if user_data['password'] == password:
            token = jwt.encode(
                {"user_id": user_doc[0].id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                app.secret_key, algorithm="HS256")
            print(token)
            return jsonify({"message": "Login successful", "token": token}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Logout route
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/upload', methods=['POST'])
@token_required
def upload_dataset():
    if 'file' not in request.files or 'file_type' not in request.form:
        return jsonify({"message": "File and file type are required"}), 400
    file, file_type = request.files['file'], request.form.get('file_type').lower()
    user_ref = firestore_client.collection('users').document(request.user_id)
    user_data = user_ref.get().to_dict()
    user_bucket_name = user_data.get('bucket')
    if not user_bucket_name:
        return jsonify({"message": "User bucket not found"}), 400
    filename = file.filename
    try:
        bucket = storage_client.get_bucket(user_bucket_name)
        blob = bucket.blob(filename)
        blob.upload_from_file(file)
        file_path = f"/tmp/{filename}"
        blob.download_to_filename(file_path)
        delimiter = ',' if file_type == 'csv' else '\t'
        pd.read_csv(file_path, delimiter=delimiter, nrows=5)
        user_ref.update({'dataset': filename, 'file_type': file_type})
        return jsonify({"message": "File uploaded successfully", "dataset": filename}), 201
    except Exception as e:
        print(f"Error uploading file: {e}")
        return jsonify({"message": f"Failed to upload dataset: {e}"}), 500

def load_dataset(bucket_name, dataset_name, delimiter=','):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(dataset_name)
    file_path = f"/tmp/{dataset_name}"
    blob.download_to_filename(file_path)
    return pd.read_csv(file_path, delimiter=delimiter)

def save_dataset(bucket_name, dataset_name, dataframe):
    bucket = storage_client.bucket(bucket_name)
    file_path = f"/tmp/{dataset_name}"
    dataframe.to_csv(file_path, index=False)
    blob = bucket.blob(dataset_name)
    blob.upload_from_filename(file_path)

@app.route('/transform', methods=['POST'])
@token_required
def transform_dataset():
    try:
        # Extract data from the request
        user_id = request.user_id
        data = request.json
        command = data.get("command")
        if not command:
            return jsonify({"message": "No command provided"}), 400

        # Retrieve user details
        user_ref = firestore_client.collection('users').document(user_id)
        user_data = user_ref.get().to_dict()
        bucket_name = user_data.get('bucket')
        dataset_name = user_data.get('dataset')
        file_type = user_data.get('file_type', 'csv')

        # Load dataset
        delimiter = ',' if file_type == 'csv' else '\t'
        df = load_dataset(bucket_name, dataset_name, delimiter=delimiter)

        # Predefined transformations
        transformed_df = apply_predefined_transformation(df, command)

        # Save transformed dataset to GCS
        transformed_filename = "transformed_" + dataset_name
        save_dataset(bucket_name, transformed_filename, transformed_df)

        # Return preview of the transformed dataset
        return jsonify({
            "message": "Transformation applied successfully",
            "preview": transformed_df.head(10).to_dict(),  # Fixed to_dict() call for preview
        }), 200

    except Exception as e:
        print(f"Error in transform_dataset: {e}")
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route('/chat', methods=['GET'])
@token_required
def chat_welcome():
    try:
        # Retrieve user details
        user_ref = firestore_client.collection('users').document(request.user_id)
        user_data = user_ref.get().to_dict()
        bucket_name = user_data.get('bucket')
        dataset_name = user_data.get('dataset')
        file_type = user_data.get('file_type', 'csv')

        if not dataset_name:
            return jsonify({
                "message": "Welcome to Intelligent Service! Upload your dataset and perform transformations effortlessly.",
                "preview": None
            }), 200

        # Load dataset
        delimiter = ',' if file_type == 'csv' else '\t'
        df = load_dataset(bucket_name, dataset_name, delimiter=delimiter)

        # Return welcome message and dataset preview
        return jsonify({
            "message": "Welcome to Intelligent Service! Your uploaded dataset is ready for transformations.",
            "preview": df.head(5).to_dict()  # Send first 5 rows as preview
        }), 200

    except Exception as e:
        print(f"Error in chat_welcome: {e}")
        return jsonify({"message": f"Error: {str(e)}"}), 500
    
def apply_predefined_transformation(df, command):
    if command.startswith("remove column"):
        column = command.split("remove column")[-1].strip()
        if column in df.columns:
            df = df.drop(columns=[column])
        else:
            raise ValueError(f"Column '{column}' does not exist in the dataset.")
    elif command.startswith("rename column"):
        parts = command.split("rename column")[-1].strip().split("to")
        if len(parts) == 2:
            old_name, new_name = parts[0].strip(), parts[1].strip()
            if old_name in df.columns:
                df = df.rename(columns={old_name: new_name})
            else:
                raise ValueError(f"Column '{old_name}' does not exist in the dataset.")
        else:
            raise ValueError("Invalid rename command. Use 'rename column <old_name> to <new_name>'.")
    elif command.startswith("filter rows where"):
        condition = command.split("filter rows where")[-1].strip()
        try:
            df = df.query(condition)
        except Exception as e:
            raise ValueError(f"Error in filter condition: {e}")
    else:
        raise ValueError("Unsupported command.")
    return df

if __name__ == '__main__':
    app.run(debug=True)