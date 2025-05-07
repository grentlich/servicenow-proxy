# ServiceNow Proxy Function

A Google Cloud Function that serves as a proxy for ServiceNow API requests.

## Features

- Forwards search requests to ServiceNow API
- Handles authentication via token
- Configurable table and fields
- CORS support

## Usage

Send a POST request to the function URL with the following JSON body:

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