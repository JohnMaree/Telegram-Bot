var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const axios = require('axios')

app.use(bodyParser.json()) // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call -> the URL endpoint thats attatched to a localhost
app.post('/new-message', function(req, res) {
  const { message } = req.body //body-parser


  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if (!message) {

    //Return nothing

    return res.end('no msg')
  } else if ((message.text.toLowerCase().indexOf('/help') !== -1) == true) {
    axios
      .post(
        'https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4/sendMessage',
        {
          chat_id: message.chat.id,
          text: 'Hi, I am a bot...\nWhat can I help you with?'
        }
      )
      return res.end('command')
  } else if ((message.text.toLowerCase().indexOf('marco') !== -1) == false) {
    axios
      .post(
        'https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4/sendMessage',
        {
          chat_id: message.chat.id,
          text: 'Invalid!!'
        }
      )
    return res.end('not ok')
  }

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  //axios.post(URL, JSON)
  axios
    .post(
      'https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4/sendMessage',
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
})

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})
