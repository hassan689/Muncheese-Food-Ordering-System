import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:1122@localhost:5432/flask_app'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
