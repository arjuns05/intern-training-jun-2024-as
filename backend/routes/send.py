from fastapi import APIRouter

router = APIRouter()


@router.post("/api/send")
def message(myDict: dict):
    myAnswer = []
    toQuery = myDict["prompts"]
    for dictionary in toQuery:
        myAnswer.append(conversion(dictionary))

    return {"messages": myAnswer}


def conversion(state: dict):
    s = ""
    tag = state["tag"]
    value = state["value"]
    s = f"<{tag}> {value} </{tag}>"

    return s
