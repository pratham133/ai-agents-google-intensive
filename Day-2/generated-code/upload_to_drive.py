import os
import sys
import mimetypes
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

# Scopes required to upload files to Google Drive.
# Using the least-privilege scope 'drive.file' which allows creating and
# modifying files/folders that were created or opened by this application.
SCOPES = ["https://www.googleapis.com/auth/drive.file"]

def authenticate():
    """Authenticates the user and returns the Drive API service credentials."""
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception:
                # If refresh fails (e.g. token revoked/expired), trigger new login
                creds = None
        
        if not creds:
            if not os.path.exists("credentials.json"):
                print("Error: 'credentials.json' file not found in the current directory.")
                print("Please download it from the Google Cloud Console (APIs & Services -> Credentials) and place it here.")
                sys.exit(1)
                
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
            
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())
            
    return creds

def upload_file(file_path):
    """Uploads a file to Google Drive.
    
    Args:
        file_path (str): The local path to the file to upload.
    Returns:
        str: The ID of the uploaded file if successful, otherwise None.
    """
    if not os.path.exists(file_path):
        print(f"Error: Local file '{file_path}' does not exist.")
        return None
        
    creds = authenticate()
    
    try:
        # Create Drive API client
        service = build("drive", "v3", credentials=creds)
        
        # Get filename and guess MIME type
        file_name = os.path.basename(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = "application/octet-stream"
            
        print(f"Uploading '{file_name}' ({mime_type})...")
        
        # File metadata and media definition
        file_metadata = {"name": file_name}
        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
        
        # Call the Drive API to create the file
        file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id, name, webViewLink")
            .execute()
        )
        
        print(f"Success! File uploaded successfully.")
        print(f"File Name: {file.get('name')}")
        print(f"File ID: {file.get('id')}")
        print(f"Link: {file.get('webViewLink')}")
        return file.get("id")
        
    except HttpError as error:
        print(f"An API error occurred: {error}")
        return None
    except Exception as error:
        print(f"An unexpected error occurred: {error}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        local_file = sys.argv[1]
    else:
        # Prompt user for file path if none was passed via command line
        local_file = input("Enter the path to the local file to upload: ").strip()
        # Remove surrounding quotes if user dragged and dropped the file
        local_file = local_file.strip('\'"')
        
    if local_file:
        upload_file(local_file)
    else:
        print("No file specified. Exiting.")
