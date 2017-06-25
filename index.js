'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// my vars and functions
const secret = require('./config/secret');          // secret vars
const vars = require('./config/vars');        // vars vars
const lib = require('./lib/lib2');               // function lib

const app = express();
app.set('port', (process.env.PORT || 5000));

// Allow us to process the data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes
app.get('/', function(req, res){
    res.send('Hi I am a facebookbot');
});


// Facebook
app.get('/webhook/', function(req, res){
    if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === secret.verify_token){
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']); // good
    }
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403).send("Wrong token ~~~~~");
});

// Here bot reply message to sender on facebook/messager
app.post('/webhook/', (req, res)=>{
    var data = req.body;

    if(data.object === 'page'){
        data.entry.forEach((entry)=>{
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.message.forEach((event)=>{
                if(evevent.message){ lib.receivedMessage(event);}
                else{ console.log("Webhook received unknown event: ", event); }
            });
        });

        res.sendStatus(200);
    }

    ///////////////
/*
    let messaging_events = req.body.entry[0].messaging;
    for(let i=0; i< messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;

        if(event.message && event.message.text){
            lib.decideMessage(sender, event.message.text, false);
        }

        if(event.postback){
            let text = JSON.stringify(event.postback.payload);
            lib.decideMessage(sender, text, true);
        }
        
    }
    res.sendStatus(200);
*/
});




app.listen(app.get('port'), ()=>{
    console.log("running: port", app.get('port'));
});