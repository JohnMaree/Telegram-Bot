## https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4/setWebhook?url=

## ECHO REPLY

import requests

from bottle import (
    Bottle, run, post, response, request as bottle_request
)


class message:

    bot_url = ''


    def get_chat_id(self, msgData):
        chat_id = msgData['message']['chat']['id']

        return chat_id

    def get_msg_text(self, msgData):
        text = msgData['message']['text']

        return text

    def send_msg(self, sendData):
        message_url = self.bot_url + 'sendMessage'
        requests.post(message_url, json=sendData)




class processMsg(message, Bottle):

    bot_url = 'https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4/'

    def __init__(self, *args, **kwargs):
        super(processMsg, self).__init__() #super is weird
        self.route('/', callback=self.handle_msg, method="POST") #What it listens to? i donno
        #calls handle message every time it sees a response on the bot


    def process(self, msgData):

        chat_id = self.get_chat_id(msgData)
        messageText = self.get_msg_text(msgData)

        if messageText == "/start":
            sendText = "Welcome to the Sonarr Bot! Type /commands to get started!"
        elif messageText == "/commands":
            sendText = """The following are a list of commands you can use:
            List Shows
            Add Shows
            Upcoming Shows
            """
        elif messageText == "Upcoming Shows":
            #sonarr_url = 'http://localhost:8989/api/calendar?apikey=YourApiKey'
            #requests.post(sonarr_url)
            sendText = "Getting Upcoming Shows..."
            print("Upcoming")


        json_data = {
        "chat_id" : chat_id,
        "text" : sendText,
        }

        return json_data

    def handle_msg(self):
        msgData = bottle_request.json

        #check if its a cmd...
        reply = self.process(msgData)

        self.send_msg(reply)

        return response

if __name__ == '__main__':
    app = processMsg()
    app.run(host='localhost', port=8080)
