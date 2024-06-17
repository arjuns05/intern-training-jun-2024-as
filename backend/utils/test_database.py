from database import get_prompt_guides_from_db


class MockPromptGuide:
    def to_dict(self):
        return {"a": 1}


class MockFirestore:
    def collection(self, _):
        return self

    def stream(self):
        return [MockPromptGuide(), MockPromptGuide()]


def test_get_prompt_guides_from_db():
    actual = get_prompt_guides_from_db(mock_db=MockFirestore())
    expected = [{"a": 1}, {"a": 1}]
    assert actual == expected
