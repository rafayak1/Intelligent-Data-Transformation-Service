import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import bcrypt
from unittest.mock import Mock
import pandas as pd
import jwt
from unittest import TestCase

backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../backend')
sys.path.insert(0, backend_path)

from app import app  

class TestApp(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    @patch("app.firestore_client")  
    @patch("app.storage_client") 
    def test_signup(self, mock_storage_client, mock_firestore_client):
        mock_firestore_client.collection.return_value.where.return_value.get.return_value = []

        mock_user_doc = MagicMock()
        mock_user_doc.id = "test_user_id"
        mock_firestore_client.collection.return_value.document.return_value = mock_user_doc

        mock_bucket = MagicMock()
        mock_storage_client.create_bucket.return_value = mock_bucket

        response = self.client.post(
            "/signup",
            json={"name": "Test User", "email": "test@example.com", "password": "password123"}
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("User registered successfully", response.get_json()["message"])
        mock_storage_client.create_bucket.assert_called_once()

    @patch('app.firestore_client')
    def test_login_successful(self, mock_firestore_client):
        mock_collection = Mock()
        mock_firestore_client.collection.return_value = mock_collection

        hashed_password = bcrypt.hashpw('testpassword'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        mock_user_data = {
            'email': 'test@example.com',
            'password': hashed_password
        }

        mock_document = Mock()
        mock_document.to_dict.return_value = mock_user_data
        mock_document.id = 'test_user_id'  
        mock_collection.where.return_value.get.return_value = [mock_document]

        response = self.client.post(
            '/login',
            json={'email': 'test@example.com', 'password': 'testpassword'}
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('Login successful', response.json['message'])
        
    @patch('app.firestore_client')
    @patch('app.storage_client')
    def test_transform_dataset(self, mock_storage_client, mock_firestore_client):
        mock_user = {
            'email': 'test@example.com',
            'password': bcrypt.hashpw('testpassword'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'bucket': 'test-bucket',
            'dataset': 'test-dataset.csv',
            'file_type': 'csv'
        }
        mock_firestore_client.collection.return_value.document.return_value.get.return_value.to_dict.return_value = mock_user

        mock_blob = Mock()
        mock_bucket = Mock()
        mock_storage_client.get_bucket.return_value = mock_bucket
        mock_bucket.blob.return_value = mock_blob
        mock_blob.download_to_filename.return_value = None

        pd.DataFrame({'col1': [1, 2, 3], 'col2': [4, 5, 6]}).to_csv('/tmp/test-dataset.csv', index=False)
        
        mock_token = jwt.encode({'user_id': 'test-id'}, app.secret_key, algorithm='HS256')

        response = self.client.post(
            '/transform',
            json={'command': 'size'},
            headers={'Authorization': f'Bearer {mock_token}'}
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('Dataset Dimensions', response.get_json()['message'])

    def test_invalid_route(self):
        response = self.client.get("/nonexistent")
        self.assertEqual(response.status_code, 404)

if __name__ == "__main__":
    unittest.main()