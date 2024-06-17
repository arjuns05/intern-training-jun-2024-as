from fastapi import APIRouter

# from utils.ai import send_ai_message

router = APIRouter()


@router.post("/api/send")
def message(myDict: dict):
    message = ""
    for i in range(len(myDict["prompts"])):
        message += conversion(myDict["prompts"][i])
    ai_message = send_ai_message(message)
    return {"ai_response": ai_message}
    # myAnswer = []
    # toQuery = myDict["prompts"]
    # for dictionary in toQuery:
    #     myAnswer.append(conversion(dictionary))

    # return {"messages": myAnswer}


def conversion(state: dict):
    s = ""
    tag = state["tag"]
    value = state["value"]
    s = f"<{tag}> {value} </{tag}>"

    return s


def create_message(state):
    prompts = state.get("prompts")
    output = ""
    for prompt in prompts:
        output += (
            "<"
            + prompt.get("tag")
            + "> "
            + prompt.get("value")
            + " </"
            + prompt.get("tag")
            + ">"
        )

    # a slightly cleaner approach
    # for prompt in prompts:
    #     output += f"<{prompt.get('tag')}> {prompt.get('value')} </{prompt.get('tag')}>"

    return output
