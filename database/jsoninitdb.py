import json

from google.cloud import firestore

db = firestore.Client()


DATABASE_NAME = "aas_prompt_guides"
with open("prompt_guides.json", "r") as jsonfile:
    data = json.load(jsonfile)
    for entry in data:
        doc_ref = db.collection(DATABASE_NAME).document(entry["id"])
        doc_ref.set(entry)
