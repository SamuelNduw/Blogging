import os
import json
import firebase_admin
from firebase_admin import credentials, storage

base_dir = os.path.dirname(__file__)
default_path = os.path.join(base_dir, "blogging-firebase-service-account.json")

cred_obj = None

json_env = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
if json_env:
    try:
        cred_obj = credentials.Certificate(json.loads(json_env))
    except Exception:
        cred_obj = None

if cred_obj is None:
    json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", default_path)
    if os.path.exists(json_path):
        cred_obj = credentials.Certificate(json_path)

if not firebase_admin._apps and cred_obj is not None:
    bucket_name = os.getenv('FIREBASE_STORAGE_BUCKET', 'blogging-e5f0c.appspot.com')
    firebase_admin.initialize_app(cred_obj, {
        'storageBucket': bucket_name
    })

def get_bucket():
    return storage.bucket()
