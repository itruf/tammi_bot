var express = require('express')
var app = express()
var https = require('https');

var hostTelgram = "api.telegram.org"
var telegramPathBasic = "/bot122550858:AAGfRzH0ikp6YqLCXr4hQ-yWEUtfu1NfN-M/"

//Basic URL's
/*
	https://api.telegram.org/bot122550858:AAGfRzH0ikp6YqLCXr4hQ-yWEUtfu1NfN-M/sendMessage?chat_id=159371&text=eee
	
*/

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/hook', function(request, response) {
	https.get({
        host: 'api.telegram.org',
        path: telegramPathBasic + 'sendMessage?chat_id=159371&text=eee'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback({
                email: parsed.email,
                password: parsed.pass
            });
        });
    });
    
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
