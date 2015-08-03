var express = require('express')
var app = express()

var url = "https://api.telegram.org/bot122550858:AAGfRzH0ikp6YqLCXr4hQ-yWEUtfu1NfN-M/"

//Basic URL's
/*
	https://api.telegram.org/bot122550858:AAGfRzH0ikp6YqLCXr4hQ-yWEUtfu1NfN-M/sendMessage?chat_id=159371&text=eee
	
*/

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/hook', function(request, response) {
	
   var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          response.send('Response: ' + chunk);
      });
  });
})

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
