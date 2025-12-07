import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:1122@localhost:5432/flask_app'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Cloudflare R2 Configuration
     
    R2_ACCESS_KEY_ID=os.environ.get('R2_ACCESS_KEY_ID')
    R2_SECRET_ACCESS_KEY=os.environ.get('R2_SECRET_ACCESS_KEY')
    R2_BUCKET_NAME=os.environ.get('R2_BUCKET_NAME')
    R2_ENDPOINT_URL=os.environ.get('R2_ENDPOINT_URL')
    R2_PUBLIC_DOMAIN=os.environ.get('R2_PUBLIC_DOMAIN')
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', 'dzcz6psaj')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', '873474233552936')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', 'eAS3HhwepXJHhlIxY1l5U_Vy4u8')
    CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL', 'cloudinary://873474233552936:eAS3HhwepXJHhlIxY1l5U_Vy4u8@dzcz6psaj')