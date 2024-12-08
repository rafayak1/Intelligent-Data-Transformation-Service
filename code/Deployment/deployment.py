#!/usr/bin/env python3

import os
import time
from googleapiclient import discovery
from oauth2client.client import GoogleCredentials

# Function to create a backend VM
def create_backend_vm(compute, project, zone, static_ip_name):
    startup_script = open('backend-startup-script.sh', 'r').read()
    config = {
        'name': 'backend-vm',
        'machineType': f"zones/{zone}/machineTypes/e2-medium",
        'disks': [{
            'boot': True,
            'autoDelete': True,
            'initializeParams': {
                'sourceImage': 'projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts',
            }
        }],
        'networkInterfaces': [{
            'network': 'global/networks/default',
            'accessConfigs': [{
                'type': 'ONE_TO_ONE_NAT',
                'name': 'External NAT',
                'natIP': get_static_ip_address(compute, project, static_ip_name)  # Attach static IP
            }]
        }],
        'metadata': {
            'items': [{'key': 'startup-script', 'value': startup_script}]
        },
        'tags': {'items': ['backend']}
    }
    return compute.instances().insert(project=project, zone=zone, body=config).execute()

# Function to create a frontend VM
def create_frontend_vm(compute, project, zone, static_ip_name):
    startup_script = open('frontend-startup-script.sh', 'r').read()
    config = {
        'name': 'frontend-vm',
        'machineType': f"zones/{zone}/machineTypes/e2-medium",
        'disks': [{
            'boot': True,
            'autoDelete': True,
            'initializeParams': {
                'sourceImage': 'projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts',
            }
        }],
        'networkInterfaces': [{
            'network': 'global/networks/default',
            'accessConfigs': [{
                'type': 'ONE_TO_ONE_NAT',
                'name': 'External NAT',
                'natIP': get_static_ip_address(compute, project, static_ip_name)  # Attach static IP
            }]
        }],
        'metadata': {
            'items': [{'key': 'startup-script', 'value': startup_script}]
        },
        'tags': {'items': ['frontend']}
    }
    return compute.instances().insert(project=project, zone=zone, body=config).execute()

# Function to retrieve the static IP address
def get_static_ip_address(compute, project, static_ip_name):
    response = compute.addresses().get(project=project, region='us-west1', address=static_ip_name).execute()
    return response['address']

# Function to create firewall rules
def create_firewall_rules(compute, project):
    rules = [
        {
            'name': 'allow-frontend',
            'allowed': [{'IPProtocol': 'tcp', 'ports': ['3000']}],
            'direction': 'INGRESS',
            'sourceRanges': ['0.0.0.0/0'],
            'targetTags': ['frontend']
        },
        {
            'name': 'allow-backend',
            'allowed': [{'IPProtocol': 'tcp', 'ports': ['5000']}],
            'direction': 'INGRESS',
            'sourceRanges': ['0.0.0.0/0'],
            'targetTags': ['backend']
        }
    ]
    for rule in rules:
        try:
            compute.firewalls().insert(project=project, body=rule).execute()
            print(f"Firewall rule {rule['name']} created.")
        except Exception as e:
            print(f"Error creating firewall rule {rule['name']}: {e}")

# Wait for operation to complete
def wait_for_operation(compute, project, zone, operation):
    print('Waiting for operation to finish...')
    while True:
        result = compute.zoneOperations().get(
            project=project,
            zone=zone,
            operation=operation
        ).execute()
        if result['status'] == 'DONE':
            print("Operation complete.")
            if 'error' in result:
                raise Exception(result['error'])
            return result
        time.sleep(1)

# Main deployment function
def main():
    project = 'dcsc-project-442612'
    zone = 'us-west1-b'
    backend_static_ip_name = 'backed-ip'  # Replace with your reserved static IP name
    frontend_static_ip_name = 'frontend-ip'  # Replace with your reserved static IP name

    credentials = GoogleCredentials.get_application_default()
    compute = discovery.build('compute', 'v1', credentials=credentials)

    create_firewall_rules(compute, project)

    print("Deploying Backend VM...")
    backend_op = create_backend_vm(compute, project, zone, backend_static_ip_name)
    wait_for_operation(compute, project, zone, backend_op['name'])

    print("Deploying Frontend VM...")
    frontend_op = create_frontend_vm(compute, project, zone, frontend_static_ip_name)
    wait_for_operation(compute, project, zone, frontend_op['name'])

    frontend_instance = compute.instances().get(
        project=project, zone=zone, instance='frontend-vm').execute()
    frontend_ip = frontend_instance['networkInterfaces'][0]['accessConfigs'][0]['natIP']

    print(f"Frontend is accessible at: http://{frontend_ip}:3000")

    backend_instance = compute.instances().get(
    project=project, zone=zone, instance='backend-vm').execute()
    backend_ip = backend_instance['networkInterfaces'][0]['accessConfigs'][0]['natIP']

    print(f"Backend is accessible at: http://{backend_ip}:5000")

    print(f"Backend: http://{backend_static_ip_name}:5000")
    print(f"Frontend: http://{frontend_static_ip_name}:3000")

if __name__ == '__main__':
    main()