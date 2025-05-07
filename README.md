# ServiceNow Proxy Function

## Purpose

This proxy service acts as a middleware between frontend applications and the ServiceNow API. It's specifically designed to overcome CORS limitations when making direct API calls from browser-based applications. 

The primary use case is to enable the LumApps search extension to query ServiceNow knowledge bases. Since browser security restrictions prevent direct cross-origin requests from the frontend to ServiceNow, this proxy handles the authentication and forwards requests to ServiceNow's API, then returns the results to the client.

After deployment, the proxy URL should be configured in the LumApps search extension settings to enable ServiceNow knowledge base integration.

## Features

- Forwards search requests to ServiceNow API
- Handles authentication via token
- Configurable table and fields
- CORS support
- Compatible with multiple cloud platforms (Google Cloud, Azure)

## Usage

Send a POST request to the deployed function URL with the following JSON body:

```json
{
  "query": "search term",
  "table": "kb_knowledge",
  "fields": [
    "title",
    "short_description",
    "article_number",
    "sys_id"
  ],
  "token": "your_servicenow_token",
  "baseUrl": "https://instance.service-now.com"
}
```

# Deployment Options
## Google Cloud Functions
1. Install the Google Cloud SDK
2. Authenticate with your Google account:
   ```plaintext
   gcloud auth login
    ```
3. Set your project:
   ```plaintext
   gcloud config set project YOUR_PROJECT_ID
    ```
4. Deploy the function:
   ```plaintext
   gcloud functions deploy serviceNowProxy --runtime nodejs18 --trigger-http --allow-unauthenticated
    ```
   ```
5. After deployment, you'll receive a URL that can be used in the LumApps search extension
## Azure Functions
1. Install the Azure Functions Core Tools and Azure CLI
2. Login to Azure:
   ```plaintext
   az login
    ```
3. Create a Function App (if you don't have one):
   ```plaintext
   az functionapp create --resource-group YourResourceGroup --consumption-plan-location westus --runtime node --runtime-version 18 --functions-version 4 --name YourFunctionAppName --storage-account YourStorageAccountName
    ```
   ```
4. Initialize your project for Azure Functions:
   ```plaintext
   func init --worker-runtime node
   func new --name serviceNowProxy --template "HTTP trigger"
    ```
5. Update the function code with the proxy implementation
6. Deploy to Azure:
   ```plaintext
   func azure functionapp publish YourFunctionAppName
    ```
7. Configure the resulting function URL in the LumApps search extension

# Configuration
Both deployment options support environment variables for default settings:

- DEFAULT_BASE_URL : Default ServiceNow instance URL
