var express = require('express')
var app = express()
const axios = require('axios')

BOT_URL = 'https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4'

app.use(express.json()) // for parsing application/json
app.use(
  express.urlencoded({
    extended: true
  })
)

//This is the route the API will call -> the URL endpoint thats attatched to a localhost
app.post('/new-message', function(req, res) {
  const { message } = req.body //gets the json file

  console.log(message) //prints the JSON

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if (!message || !message.text || message.sticker) {
    //if theres no json, no msg text or is something we dont understand
    //Return nothing

    return res.end('no msg')
  } else if ((message.text.toLowerCase().indexOf('/help') !== -1) == true) {
    axios
      .post(
        BOT_URL + '/sendMessage',
        {
          chat_id: message.chat.id,
          text: 'Hi, I am a bot...\nWhat can I help you with?'
        }
      )
      .then(response => {
        console.log('Command Posted')
        res.end('cmd')
      })
      .catch(err => {
        // ...and here if it was not
        console.log('Error :', err)
        res.end('Error :' + err)
      })
  } else if ((message.text.toLowerCase().indexOf('marco') !== -1) == false) {
    axios
      .post(
        BOT_URL + '/sendMessage',
        {
          chat_id: message.chat.id,
          text: 'Invalid!!'
        }
      )
    return res.end('not ok')
  } else {

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  //axios.post(URL, JSON)
  axios
    .post(
      BOT_URL + '/sendMessage',
      {
        chat_id: message.chat.id,
        text: 'Polo!!'
      }
    )
    .then(response => {
      // We get here if the message was successfully posted
      console.log('Message posted')
      res.end('ok')
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      res.end('Error :' + err)
    })
  }
})

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})
