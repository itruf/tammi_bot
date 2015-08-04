var Bot = require('telegram-api');
var Message = require('telegram-api/types/Message');
var File = require('telegram-api/types/File');

var bot = new Bot({
  token: '122550858:AAGfRzH0ikp6YqLCXr4hQ-yWEUtfu1NfN-M'
});

bot.start();

bot.get(/Hi|Hey|Hello|Yo/, function(message) {
  var answer = new Message().text('Hello, Sir').to(message.chat.id);

  bot.send(answer);
});

bot.command('start', function(message) {
  var welcome = new File().file('./some_photo.png').caption('Welcome').to(message.chat.id);

  bot.send(welcome);
});

// Arguments, see: https://github.com/mdibaiee/node-telegram-api/wiki/Commands
bot.command('weather <city> [date]', function(message) {
  console.log(message.args.city, message.args.date);
})