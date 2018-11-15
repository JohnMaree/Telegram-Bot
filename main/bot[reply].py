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
        super(processMsg, self).__init__()
        self.route('/', callback=self.handle_msg, method="POST")


    def process(self, msgData):

        chat_id = self.get_chat_id(msgData)
        messageText = self.get_msg_text(msgData)

        json_data = {
        "chat_id" : chat_id,
        "text" : messageText,
        }

        return json_data

    def handle_msg(self):
        msgData = bottle_request.json

        reply = self.process(msgData)

        self.send_msg(reply)

        return response

if __name__ == '__main__':
    app = processMsg()
    app.run(host='localhost', port=8080)
