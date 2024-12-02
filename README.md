# Project: Intelligent Service for Dataset Transformation

## Overview
This project is a web-based application that allows users to upload datasets, perform transformations, and interact through a chatbot interface. The application supports predefined dataset transformation commands and metadata queries.

The project consists of the following major components:

1. **Frontend**: React-based web interface for user interaction.
2. **Backend**: Flask API for handling data processing, transformations, and storage interactions.
3. **Cloud Storage**: Google Cloud Storage (GCS) for storing datasets.
4. **Kubernetes Deployment**: Minikube is used for deploying and managing the application.

---

## Features
- User Authentication (Sign Up, Login, Logout).
- Dataset Upload with support for CSV and TSV formats.
- Predefined Dataset Transformations:
  - Remove a column.
  - Rename a column.
  - Filter rows based on conditions.
  - View dataset columns.
  - View dataset dimensions.
- Chatbot interface to apply commands and receive results.
- Download transformed datasets.
- Kubernetes deployment for scalable and public accessibility.

---

## Setup Instructions

### 1. Prerequisites
Ensure the following tools are installed on your system:
- [Docker](https://www.docker.com/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- Python 3.9 or above
- Node.js (for frontend)

---

### 2. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

---

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the `.env` file:
   - Set `SECRET_KEY` for Flask.
   - Add your Google Cloud credentials as `GOOGLE_APPLICATION_CREDENTIALS`.

5. Build and tag the Docker image for the backend:
   ```bash
   docker build -t backend-image:latest .
   docker push backend-image:latest
   ```

---

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build and tag the Docker image for the frontend:
   ```bash
   docker build -t frontend-image:latest .
   docker push frontend-image:latest
   ```

---

### 5. Kubernetes Deployment

#### Minikube Setup
1. Start Minikube:
   ```bash
   minikube start
   ```

2. Enable the Minikube Docker daemon:
   ```bash
   eval $(minikube docker-env)
   ```

#### Deploy Backend
1. Apply the backend deployment and service configuration:
   ```bash
   kubectl apply -f kubernetes/backend-deployment.yaml
   kubectl apply -f kubernetes/backend-service.yaml
   ```

#### Deploy Frontend
1. Apply the frontend deployment and service configuration:
   ```bash
   kubectl apply -f kubernetes/frontend-deployment.yaml
   kubectl apply -f kubernetes/frontend-service.yaml
   ```

#### Expose the Application
1. Expose the frontend service as a LoadBalancer:
   ```bash
   kubectl expose deployment frontend-deployment --type=LoadBalancer --name=frontend-service
   ```

2. Get the service URL:
   ```bash
   minikube service frontend-service --url
   ```

---

## Supported Commands
The application supports the following commands in the chatbot interface:

- **remove column `<column_name>`**  
  Example: `remove column Age`
- **rename column `<old_name>` to `<new_name>`**  
  Example: `rename column Age to Years`
- **filter rows where `<condition>`**  
  Example: `filter rows where Age > 25`
- **columns**  
  Example: `columns` (to list all column names)
- **size**  
  Example: `size` (to get the dataset dimensions)

---

## Key Files

### Frontend
- `frontend/src/components/Chat.js`: Handles chat functionality.
- `frontend/src/components/Home.js`: Handles dataset upload and navigation.

### Backend
- `backend/app.py`: Main Flask application.
- `backend/requirements.txt`: Backend dependencies.

### Kubernetes
- `kubernetes/backend-deployment.yaml`: Backend deployment configuration.
- `kubernetes/backend-service.yaml`: Backend service configuration.
- `kubernetes/frontend-deployment.yaml`: Frontend deployment configuration.
- `kubernetes/frontend-service.yaml`: Frontend service configuration.

---

## Testing
1. **Frontend**:
   - Run the frontend locally using:
     ```bash
     npm start
     ```

2. **Backend**:
   - Run the backend locally using:
     ```bash
     flask run
     ```

3. **End-to-End**:
   - Access the application using the Minikube service URL.

---

## Troubleshooting
- **Image Pull BackOff**: Ensure the Docker images are built and pushed correctly.
- **Access Issues**: Verify Minikube services and firewall settings.
- **Dataset Issues**: Check Google Cloud Storage permissions and configurations.

---

## Future Enhancements
- Add support for more transformation commands.
- Improve error handling and logging.
- Implement CI/CD pipelines.
- Migrate to a cloud-hosted Kubernetes platform for production deployment.

---

## Contributors
- **Rafay Khan**
- **[Your Team Members or Contributors Here]**

---

## License
[MIT License](LICENSE)

