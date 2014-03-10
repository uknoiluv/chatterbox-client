// YOUR CODE HERE:
/* global $ */

var message = {
  'username': 'TROLL',
  'text': 'hello',
  'roomname': 'Troll Room'
};

var messageTemplate = function(result){
	var userName = result.username.charAt(0).toUpperCase() + result.username.slice(1);
	var resultText = result.text.charAt(0).toUpperCase() + result.text.slice(1);
	var resultRoom = result.roomname.charAt(0).toUpperCase() + result.roomname.slice(1);
	var message = $('<span>' + userName +': ' + resultText + ' - ' + resultRoom +  '</span><br/><br/>');
	return message;
};

var cleanData = function(user, text, room){
	var verdict = true;
	var symbols = ['<','>','-','!','{', '%', '"']
	if (user === undefined || symbols.indexOf(user.slice(0,1)) !== -1){
    verdict = false;
	}
	if (text === undefined || symbols.indexOf(text.slice(0,1)) !== -1 ){
    verdict = false;
	}
  if (room === undefined){
  	verdict = true;
	} else {
		verdict =  symbols.indexOf(room.slice(0,1)) !== -1 ? false : true;
	}
	return verdict;
};

var retrieve = function(room){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		data: {'order':'-createdAt'},
		contentType: 'application/json',
		success: function (data) {
			var rooms = {};
			for (var i = 0; i < data.results.length; i++){
				var result = data.results[i];
				rooms[result.roomname] = result.roomname;
				if(cleanData(result.username, result.text, result.roomname) === true){
					var message = messageTemplate(result);
					$('#main').append(message);
				}
			}
			for (var key in rooms){
				var room = $('<option value="'+key+'">'+key+'</option>');
				$('#rooms').append(room);
			}
		},
		error: function (data) {
			// see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to send message');
		}
	});
};

var send = function(message) {
	$.ajax({
		// always use this url
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function (data) {
			console.log('chatterbox: Message sent');
		},
		error: function (data) {
		// see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to send message');
		}
	});
};



send(message);

retrieve();
