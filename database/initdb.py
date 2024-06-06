from google.cloud import firestore

db = firestore.Client()

doc_ref = db.collection("aas._users").document("alovelace")
doc_ref.set({"first": "Ada", "last": "Lovelace", "born": 1815})

DATABASE_NAME = "aas_prompt_guides"

doc_ref = db.collection(DATABASE_NAME).document("123")
doc_ref.set(
    {
        "id": "123",
        "name": "Event Planner",
        "prompts": [
            {
                "title": "Event Type",
                "tag": "EventType",
                "description": "What type of event are you planning?",
                "type": "select",
                "choices": "Wedding,Birthday party,Corporate conference",
            },
            {
                "title": "Guest Number",
                "tag": "EventType",
                "description": "How many guests are you expecting?",
                "type": "text",
            },
            {
                "title": "Theme",
                "tag": "Theme",
                "description": "Describe the theme of the event.",
                "type": "long text",
            },
        ],
    }
)
