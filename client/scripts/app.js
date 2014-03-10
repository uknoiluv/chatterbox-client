// YOUR CODE HERE:

var retrieve = function(){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function (data) {
			for (var i = 0; i < data.results.length; i ++){
				chatMessage = data.results[i].text;
				$('#main').append(chatMessage);
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

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

send(message);
var chatMessages = retrieve();

