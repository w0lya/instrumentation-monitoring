var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const config = require('./config.json');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  TimeStamp : Date,
  RequestUrl : String, 
  ResponseTime : Number,
  ResponseBodySize: Number
})

var dbUrl = config.MongoDbConnectionString; 

app.get('/messages', (req, res) => {
  
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);    
    var savedMessage = await message.save() // Save to mongodb
    console.log("message saved" + savedMessage);    
   
    io.emit('message', req.body);

    res.sendStatus(200);
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally {
    console.log('Message Posted')
  }
})


io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(dbUrl ,(err) => {
  console.log('mongodb connected',err);
})

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
