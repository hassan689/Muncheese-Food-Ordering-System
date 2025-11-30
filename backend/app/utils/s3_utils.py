import boto3
from flask import current_app
from botocore.exceptions import NoCredentialsError

def get_r2_client():
    """Create the connection to Cloudflare"""
    # --- DEBUG PRINTS ---
    print("DEBUG: Access Key:", current_app.config.get('R2_ACCESS_KEY_ID'))
    print("DEBUG: Secret Key:", current_app.config.get('R2_SECRET_ACCESS_KEY'))
    # --------------------
    return boto3.client(
        's3',
        endpoint_url=current_app.config['R2_ENDPOINT_URL'],
        aws_access_key_id=current_app.config['R2_ACCESS_KEY_ID'],
        aws_secret_access_key=current_app.config['R2_SECRET_ACCESS_KEY']
    )

def upload_file_to_r2(file_obj, filename, content_type):
    """
    Uploads a file to R2 and returns the Public URL.
    """
    s3_client = get_r2_client()
    bucket_name = current_app.config['R2_BUCKET_NAME']
    domain = current_app.config['R2_PUBLIC_DOMAIN']

    try:
        # Upload the file
        s3_client.upload_fileobj(
            file_obj,
            bucket_name,
            filename,
            ExtraArgs={'ContentType': content_type}
        )
        
        # Return the Public URL
        # Format: https://pub-xxxx.r2.dev/filename
        return f"{domain}/{filename}"

    except NoCredentialsError:
        raise ValueError("Cloudflare Credentials missing")
    except Exception as e:
        raise ValueError(f"Upload Failed: {str(e)}")