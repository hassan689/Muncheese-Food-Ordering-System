import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Cloudflare R2 Configuration
     
    R2_ACCESS_KEY_ID=os.environ.get('R2_ACCESS_KEY_ID')
    R2_SECRET_ACCESS_KEY=os.environ.get('R2_SECRET_ACCESS_KEY')
    R2_BUCKET_NAME=os.environ.get('R2_BUCKET_NAME')
    R2_ENDPOINT_URL=os.environ.get('R2_ENDPOINT_URL')
    R2_PUBLIC_DOMAIN=os.environ.get('R2_PUBLIC_DOMAIN')
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
    CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL')