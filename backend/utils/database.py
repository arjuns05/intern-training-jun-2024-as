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
