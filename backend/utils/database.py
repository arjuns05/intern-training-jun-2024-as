import json

from google.cloud import firestore

db = firestore.Client()

DATABASE_NAME = "aas_prompt_guides"


def get_prompt_guides_from_db():
    prompt_guides_ref = db.collection(DATABASE_NAME)
    prompt_guides_out = prompt_guides_ref.stream()
    prompt_guides_arr = []
    for pg in prompt_guides_out:
        pg_dict = pg.to_dict()
        prompt_guides_arr.append(pg_dict)

    return prompt_guides_arr


def get_prompt_guide_db(id):
    doc_ref = db.collection(DATABASE_NAME).document(id)
    pg = doc_ref.get()

    if pg.exists:
        return pg.to_dict()
    else:
        return {}

    # prompt_guides_ref = db.collection(DATABASE_NAME)
    # prompt_guides_out = prompt_guides_ref.stream()
    # prompt_guides_arr = []
    # for pg in prompt_guides_out:
    #     pg_dict = pg.to_dict()
    #     prompt_guides_arr.append(pg_dict)

    # for entry in prompt_guides_arr:
    #     print(entry.keys())
    #     if entry[id] == id:
    #         temp_dict = entry.to_dict()
    #         correct_entries.append(temp_dict)


def update_record_or_add(prompt_guide):
    id = prompt_guide.get("id") if prompt_guide.get("id") else None
    doc_ref = db.collection(DATABASE_NAME).document(id)
    print(doc_ref.id, prompt_guide)

    prompt_guide["id"] = doc_ref.id
    doc_ref.set(prompt_guide)
    return doc_ref.id
    db.collection(DATABASE_NAME).document("{id}").set(prompt_guide)
