var startLocations = {}
var endLocations = {}
var waitingLocStart = {}

var http = require("http");

var VowTelegramBot = require('vow-telegram-bot'),
    bot = new VowTelegramBot({
        token: '122550858:AAGfRzH0ikp6YqLCXr4hQ-yWEUtfu1NfN-M',
        polling: {
            timeout: 3,
            limit: 100
        }
    });

bot.on('message', function(message) {

    var from = message.from;

    console.log(from.first_name + ' ' + from.last_name + ': ' + message.text);
    
    if (message.text === '/start') {
	    bot.sendMessage({
	        chat_id: message.chat.id,
	        text: 'Привет! Меня зовут Tammi и я умею рассчитать, каким такси дешевле поехать. Просто отправь команду /go, чтобы начать.'
	    }).then(function(message) {
	        console.log('Message sent', message);
	    });
    } else if (message.text === '/go') { //Команда создания поездки (/go)
	    delete startLocations[message.chat.id];
	    delete endLocations[message.chat.id];
	    
	    waitingLocStart[message.chat.id] = 'yes';
	    
	    bot.sendMessage({
	        chat_id: message.chat.id,
	        text: 'Привет! Теперь отправь координаты точки отправления. (Скрепка -> Send Location)'
	    }).then(function(message) {
	        console.log('Message sent', message);
	    });

    } else if (message.location) { //Получена координата
	    if (!startLocations[message.chat.id]) { //Точка старта
		    startLocations[message.chat.id] = message.location;
		    
		    bot.sendMessage({
	        	chat_id: message.chat.id,
				text: 'Точка старта принята. Теперь жду точку назначения.'
		    }).then(function(message) {
		        console.log('Message sent', message);
		    });
	    } else { //Точка финиша
		    endLocations[message.chat.id] = message.location;
		    
			var options = {
			  host: 'http://62.76.45.107',
			  path: '/calculate/path/?start_point=[' + startLocations[message.chat.id].latitude +','+startLocations[message.chat.id].longitude+']&' + 'end_point=[' + endLocations[message.chat.id].latitude +','+endLocations[message.chat.id].longitude + ']&user_id=3228',
			  method: 'GET'
			};
			
			
			callback = function(response) {
			  var str = '';
			
			  //another chunk of data has been recieved, so append it to `str`
			  response.on('data', function (chunk) {
			    str += chunk;
			  });
			
			  //the whole response has been recieved, so we just print it out here
			  response.on('end', function () {
			    var result = JSON.parse(str);
			    
			    var resultMessageText = '';
			    if (result['error']) {
				    resultMessageText = 'К сожалению, по указанным координатам мы не можем посчитать маршрут';
			    } else {
				    resultMessageText = 'По данному маршруту сейчас будет дешевле на ' + result['tariffs'][0]['tariff']['title'] + ' – ' + result['tariffs'][0]['price'] + ' руб. \n\nПоездка займёт ' + ((result['route_info']['duration'])/60).toFixed(0) + ' минут и составит ' + ((result['route_info']['distance'])/1000).toFixed(1) + ' км. в длину \n\nPS: Через моего старшего брата, iOS приложение, можно сразу заказать машину: \nhttps://itunes.apple.com/ru/app/tammi-vygodnyj-zakaz-taksi/id965748727?mt=8';
			    }
			    
			    delete startLocations[message.chat.id];
			    delete endLocations[message.chat.id];
			    delete waitingLocStart[message.chat.id];
			    
			    bot.sendMessage({
			        chat_id: message.chat.id,
			        text: resultMessageText
			    }).then(function(message) {
			        console.log('Message sent', message);
			    });
			  });
			}
			
			http.get(options['host']+options['path'], callback).end();
	    }
	} else { //Иное
		if (waitingLocStart[message.chat.id]) {
			bot.sendMessage({
		        chat_id: message.chat.id,
		        text: "Я жду от тебя координаты, а не текст :)"
		    }).then(function(message) {
		        console.log('Message sent', message);
		    });	
		} else {
		    bot.sendMessage({
		        chat_id: message.chat.id,
		        text: "Пока я умею только считать поездки по команде /go"
		    }).then(function(message) {
		        console.log('Message sent', message);
		    });	
		}
	}
});