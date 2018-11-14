#Basic python script to analyse the JSON file and act upon it
#This does not send messages back to the bot


from bottle import (
    run, post, response, request as bottle_request
)


def getChat_ID(data):
    chatID = data['message']['chat']['id']

    return chatID

def getMessage(data):
    message = data['message']['text']
    commands(message)

    return message


#Python switch statement that calls functions
def commands(message):
    cmd = {
    '/help' : getHelp,
    '/test' : test,
    }
    cmd.get(message)()

    return

def getHelp():
    print("I'm Helping!")
    return

def test():
    print("Test cmd!")
    return


@post('/')  # endpoint
def main():

    messageData = bottle_request.json
    print(messageData)


    print("ID: ", getChat_ID(messageData), "\nMessage: ", getMessage(messageData))

    return


if __name__ == '__main__':
    run(host='localhost', port=8080, debug=True)
