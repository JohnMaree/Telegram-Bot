# Telegram-Bot
Testing for developing a Telegram Bot

## **Documentation:**

* The Official API: https://core.telegram.org/api --> Only concerned with the bot API
* Bots API: https://core.telegram.org/bots/api
* Bots Info: https://core.telegram.org/bots
* Python BASIC bot: https://djangostars.com/blog/how-to-create-and-deploy-a-telegram-bot/



## **Useful Tools:**

* Ngrok: https://ngrok.com/download --> A temporary HTTPS tunnelling solution for the Telegram API to have access to local PC
* For windows - BASH (very helpful & easy, its a UNIX shell)
* Linux and macOS are ideal as servers mainly use them



## **Good to know:**

There are different methods to interfacing with telegram, mainly through [Webhooks](https://webhooks.pbworks.com/w/page/13385124/FrontPage), and standard HTTPS requests. To put it plainly, Webhooks carry a lot more customisation, access to data and more extensive options with regards to interfacing/accessing the API, however they carry with them the annoyance of requiring a HTTPS web-server for the secure handshakes which becomes annoying for small devs without access to an SSL certified HTTPS address. This is where the HTTP request method comes in handy as you require no servers etc. to access some information (its limited though and most likely will not be the way the majority of bots are implemented), it is however handy when just wanting test your connection to the bot...


Easy commands to test your connection to the bot:

```
https://api.telegram.org/bot<token>/getUpdates --> Basic status
https://api.telegram.org/bot<your-token>/sendMessage?chat_id=&text=<your-text> --> Basic send message
https://api.telegram.org/bot<your-token>/setWebhook?url=<some-url> --> Set Webhook URL
```

The stuff after the `/` are commands sent to the [Telegram Bots API](https://core.telegram.org/bots/api) which will return a JSON back.

A typical JSON response looks like this:
```
{"ok":true,"result":[{"update_id":523349956, "message":{"message_id":51,"from":{"id":303262877,"first_name":"YourName"},"chat":{"id":303262877,"first_name":"YourName","type":"private"},"date":1486829360,"text":"Hello"}}]}
```

The JSON can easily be explored as its _message_ structure resembles:
```
.message
├── message_id
├── from
│   ├── id
│   └── first_name
├── chat
│   ├── id
│   ├── first_name
│   └── type
├── date
└── text
```

This means that accessing say, the chat id (with python) is as simple as `chat = jsonData['message']['chat']['id']`.


## **TODO:**

- [x] Rope Nic into your crazy project
- [x] Make readme
- [x] Basic python Webhook
- [ ] Look into python-telegram API/libraries
- [ ] More advanced python bot
- [ ] Consider C++ implementation/
- [ ] Create website
- [ ] SSL (wildcard) the website
- [ ] Forward the website to server
- [ ] World domination
