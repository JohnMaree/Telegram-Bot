var express = require('express')
var app = express()
const axios = require('axios')
var SonarrAPI = require('sonarr-api');

BOT_URL = 'https://api.telegram.org/bot763429199:AAGCFRePEp7Hcl5Ij4Wlx5_UW_pCwzO4rP4'
var sonarrCallbackCache = []

//Date stuff
var today = new Date();
var b4yesterday = new Date(today.getFullYear(), today.getMonth(), (today.getDate()-2));
var yesterday = new Date(today.getFullYear(), today.getMonth(), (today.getDate()-1));
var tomorrow = new Date(today.getFullYear(), today.getMonth(), (today.getDate()+1));
var a4tomorrow = new Date(today.getFullYear(), today.getMonth(), (today.getDate()+2));


app.use(express.json()) // for parsing application/json
app.use(
  express.urlencoded({
    extended: true
  })
)


var sonarr = new SonarrAPI({
		hostname: 'localhost',
		apiKey: '1e11c2747903456ea8f66f4b8b3bffcc',
		port: 8989,
		urlBase: '/'
})


//This is the route the API will call -> the URL endpoint thats attatched to a localhost
app.post('/new-message', function(req, res) {
  const { message } = req.body //gets the json file

  //console.log(message)
  //console.log(req.body.callback_query)
  if (req.body.callback_query) {
      for (i = 0; i < sonarrCallbackCache.length; i++) {
        if (Number(req.body.callback_query.data) == sonarrCallbackCache[i].sonarr.tvdbId) {
          console.log('glorious!')

          sonarr.post("series", sonarrCallbackCache[i].sonarr)
          .then(result => {

            axios
              .post(
                BOT_URL + '/sendPhoto',
                {
                  chat_id: req.body.callback_query.message.chat.id,
                  photo:  sonarrCallbackCache[i].extras.posterURL.toString(),
                  caption: 'Added series ~> ' + sonarrCallbackCache[i].sonarr.title + ' <~'
                }
              )
              .then(response => {
                console.log('Added ' + sonarrCallbackCache[i].sonarr.title)
                res.end('Added ' + sonarrCallbackCache[i].sonarr.title)
                sonarrCallbackCache = [] //clear cache
              })
              .catch(err => {
                console.log('Error: ', err)
                return res.end('Error: ' + err)
              })
          })
          .catch(err => {
            console.log('Error: ' + err)
            res.end('Error: ' + err)
          })
          return res.end('callback')
        }
      }
    }

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if (!message || !message.text || message.sticker) {
    //if theres no json, no msg text or is something we dont understand
    //Return nothing

    return res.end('no msg')
  } else if ((message.text.toLowerCase().indexOf('/search') !== -1) == true) {

    if (!message.text.toLowerCase().slice(8)) {
      //do nothing
      console.log("blank")
      return res.end('blank input')

    } else {

    sonarr.get("series/lookup", { "term": message.text.toLowerCase().slice(8) })
      .then(function (result) { //result of get is a json

      var msgText = "This is what I found:\n"
      var inLineButtonArray = []
      var inLineButtonSubArray = []
      var buttonCounter = 1


      for (var title in result) {

        msgText += ((Number(title) + 1) + ". " + result[title].title + "\n")

        var callbackObj = {
          sonarr: {
            rootFolderPath: '//Users//John_Maree//Downloads//SonarrTest',
            title: result[title].title,
            seasons: result[title].seasons,
            monitored: true,
            tvdbId: result[title].tvdbId,
            titleSlug: result[title].titleSlug,
            qualityProfileId: 1,
            images: []
        },
        extras: {
          posterURL: result[title].remotePoster
        }
        }

        sonarrCallbackCache.push(callbackObj)

        var buttonObj = {
          text: (Number(title) + 1).toString(),
          callback_data: callbackObj.sonarr.tvdbId.toString()
        }

        console.log(buttonObj)
        console.log(callbackObj)


        if (buttonCounter%4 != 0) {
          inLineButtonSubArray.push(buttonObj)
        } else {
          inLineButtonSubArray.push(buttonObj)
          inLineButtonArray.push(inLineButtonSubArray)
          inLineButtonSubArray = []
        }
        buttonCounter++
      }

      inLineButtonArray.push(inLineButtonSubArray)

      console.log(msgText)

      axios
        .post(
          BOT_URL + '/sendMessage',
          {
            chat_id: message.chat.id,
            text: msgText,
            reply_markup: {
              inline_keyboard: inLineButtonArray
            }
          }
        )
        .then(response => {
          console.log('Lookup')
          res.end('lookup')
        })
        .catch(err => {
          console.log('Error :', err)
          res.end('Error :' + err)
        })
    })
    .catch(err => {
      console.log('Error: ', err)
      res.end('error')
    })
  }

} else if ((message.text.toLowerCase().indexOf('/calendar') !== -1) == true) {

  var yesterdayMsg = "Yesterday:\n"
  var todayMsg = "Today:\n"
  var tomorrowMsg = "Tomorrow:\n"

  sonarr.get("calendar", { "start": b4yesterday.toISOString(), "end": a4tomorrow.toISOString() })
  .then(result => {
    if (result) {
      // console.log(result)
      // console.log('yesterday ' + yesterday.getDate())//yesterday.toISOString().slice(8,10))
      // console.log('today ' + today.toISOString().slice(8,10))
      // console.log('tomorrow ' + tomorrow.getDate())

      for (var recent in result) {
        if (result[recent].airDateUtc.slice(8,10) == (yesterday.getDate())) {
          yesterdayMsg += '\u{1F4FA}' + '  ' + result[recent].series.title + ' - ' + result[recent].title + '\n'
        } else if (result[recent].airDateUtc.slice(8,10) == (today.getDate())) {
          todayMsg += '\u{1F4FA}' + '  ' + result[recent].series.title + ' - ' + result[recent].title + '\n'
          console.log(result[recent].airDateUtc.slice(8,10))
        } else if (result[recent].airDateUtc.slice(8,10) == (tomorrow.getDate())) {
          tomorrowMsg += '\u{1F4FA}' + '  ' + result[recent].series.title + ' - ' + result[recent].title + '\n'
          console.log('tomorrow ' + result[recent].airDateUtc.slice(8,10))
        }

      }
      console.log(yesterdayMsg + '\n' + todayMsg + '\n' + tomorrowMsg)

      axios
        .post(
          BOT_URL + '/sendMessage',
          {
            chat_id: message.chat.id,
            text: (yesterdayMsg + '\n\n' + todayMsg + '\n\n' + tomorrowMsg)
          }
        )
        .then(response => {
          res.end('ok')
        })
        .catch(err => {
          console.log('Error :', err)
          return res.end('Error :' + err)
        })

    res.end('ok') //important line
    }
  })
  .catch(err => {
    console.log("Error: " + err)
  })

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
        return res.end('Error :' + err)
      })

  } else if ((message.text.toLowerCase().indexOf('status') !== -1) == true) {
    // get Sonarr Status
    sonarr.get("system/status").then(result => {
     	// result will be json a response
      console.log(result.version);

      axios
        .post(
          BOT_URL + '/sendMessage',
          {
            chat_id: message.chat.id,
            text: result//'Getting status'
          }
        )
        .then(response => {
          console.log('Getting Status')
          res.end('sonarr')
        })
        .catch(err => {
          // ...and here if it was not
          console.log('Error :', err)
          return res.end('Error :' + err)
        })

    }).catch(err => {
    	throw new Error("There was a error processing the request: " + err)
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
