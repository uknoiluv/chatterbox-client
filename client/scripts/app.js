// YOUR CODE HERE:
/* global $, _ */

var message = {
  'username': 'Chef',
  'text': 'hello Children',
  'roomname': 'lurker'
};

// message template
var messageTemplate = function(user, text, room){
	var message = $('<span>' + user +': ' + text + ' - ' + room +  '</span><br/><br/>');
	return message;
};

// sanitize input string
var sanitize = function(string){
	return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

//create list of rooms to select from
var listRooms = function(rooms){
	for (var key in rooms){
		$('#rooms').append('<option value="'+key+'">'+key+'</option>');
	}
};

// function to call on successful retreival of data
var retrieveOnSuccess = function(resultData){
	var rooms = {};
	_.each(resultData, function(item) {
		var room = $('<span class="userSpan">'+item.roomname+'</span>').text();
		room = sanitize(room);
		rooms[room] = room;
		var text = $('<span class="textSpan">'+item.text+'</span>').text();
		var user = $('<span class="textSpan">'+item.username+'</span>').text();
		console.log(room, text, user);
		var message = messageTemplate(user, text, room);
		$('#main').append(message);
	});
	listRooms(rooms);
};


// retrieve messages
var retrieve = function(specificRoom){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		data: {'order':'-createdAt'},
		contentType: 'application/json',
		success: function(data){
			retrieveOnSuccess(data.results);
		},
		error: function (data) {
			console.error('chatterbox: Failed to send message');
		}
	});
};

// send messages
var send = function(message) {
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function (data) {
			console.log('chatterbox: Message sent');
		},
		error: function (data) {
			console.error('chatterbox: Failed to send message');
		}
	});
};

// document ready functions/events
$(document).ready(function(){
	$('#refresh').on('click',function(){
		console.log('hello');
		retrieve();
	});

	$('#rooms').on('change', function(item){
		var room = $(this).val();
		// console.log(room);
		$('span, br').remove();

	});
});






send(message);
retrieve();
