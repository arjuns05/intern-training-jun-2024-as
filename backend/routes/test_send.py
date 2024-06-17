from send import create_message


def test_create_message():
    sample = {"prompts": [{"tag": "Hello", "value": "World"}]}
    sample = {
        "prompts": [
            {"tag": "Hello", "value": "World"},
            {"tag": "Hello2", "value": "World2"},
        ]
    }

    assert create_message(sample) == "<Hello> World </Hello><Hello2> World2 </Hello2>"
