
# Project: Intelligent Data Transformation Service

## Overview
This project is a web-based application that allows users to upload datasets, perform transformations, and interact through a chatbot interface. The application supports predefined dataset transformation commands and metadata queries.

The project consists of the following major components:

1. **Frontend**: React-based web interface for user interaction.
2. **Backend**: Flask API for handling data processing, transformations, and storage interactions.
3. **Cloud Storage**: Google Cloud Storage (GCS) for storing datasets.
4. **Google Cloud Deployment**: Google Cloud Virtual Machines (VMs) for deploying and managing the application.

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
- Deployed on Google Cloud VMs for public accessibility.

---

## Setup Instructions

### 1. Prerequisites
Ensure the following tools are installed on your system:
- Python 3.9 or above
- Node.js (for frontend)
- Google Cloud SDK (for managing GCP resources)

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

 2.	Create a virtual environment:
    ```bash
    python3 -m venv venv
    ```
 3.	Activate the virtual environment:
    ```bash
    source venv/bin/activate
    ```
 4.	Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
 5.	Configure the .env file:
    - Set SECRET_KEY for Flask.
    - Add your Google Cloud credentials as GOOGLE_APPLICATION_CREDENTIALS.

---
   
### 4. Frontend Setup
 1.	Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
 2.	Install the required Node.js packages:
    ```bash
    npm install
    ```
 3.	Update the `axios.config.js` file:
    - Set the baseURL to the external IP of the **backend VM**.

---

### 5. Google Cloud Setup
 1.	Create a Google Cloud project.
    
 2.	Enable the following APIs:
    - Compute Engine API
    - Cloud Storage API
      
 3.	Create a service account and download the JSON key.
    
 4.	Upload the JSON key to the **backend VM**.

---

### 6. Google Cloud Deployment
 **Automated Deployment**:
 1.	Use the provided `deployment.py` script to deploy the VMs:
    - Backend VM (e2-medium instance with Ubuntu 22.04) and Frontend VM (e2-medium instance with Ubuntu 22.04) will be created.
    - Static IPs for both VMs will be reserved and assigned automatically.
    - Firewall rules will be configured to allow HTTP/HTTPS traffic on required ports (3000 for frontend, 5000 for backend).
      
 2.	Run the deployment script:
    ```bash
    python3 deployment.py
    ```
 
 **Manual Configuration (if needed)**:
 1. Reserve static IPs for the VMs.
    
 2. Update the IPs in the code:
    - `frontend/src/components/utils/axios.config.js` - Update the baseURL to the backend IP.
    - `backend/app.py` - Update the frontend IP for CORS.

---

### Access the Application:
   Once deployed:
   -  Access the application by visiting http://**Frontend-VM-ExternalIP**:3000.

---

### Local Testing:
   1. Frontend:
      ```bash
      cd frontend
      npm start
      ```

   2. Backend:
      ```bash
      cd backend
      python3 app.py
      ```

---

### Future Enhancements:
   - Add support for more transformation commands.
   - User-defined transformations.
   - Support for additional dataset formats.

---

## Contributors
- [Abdul Rafay Ahmed Khan](https://github.com/rafayak1)
- [Minal Pawar](https://github.com/Minalspawar)





   
