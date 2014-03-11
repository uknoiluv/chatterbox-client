// YOUR CODE HERE:
/* global $, _ */

var user = window.location.search.slice(10);
var friends = {};
console.log(user);

var message = {
  'username': 'Chef',
  'text': 'hello Children',
  'roomname': 'lurker'
};

// message template
var messageTemplate = function(user, text, room){
	var userSpan = '<a href="#" class="'+user+'">'+user+'</a>';
	var textSpan = '<span class="'+text+'">'+text+'</span>';
	var roomSpan = '<span class="'+room+'">'+room+'</span>';
	var message = $('<p>' + userSpan +': ' + textSpan + ' - ' + roomSpan +  '</p>');
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
		$('#selectRoom').append('<option value="'+key+'">'+key+'</option>');
	}
};

// store friends
var storeFriends = function(friend){
	friends[friend] = friend;
};

// filter by room
var filterRoom = function(roomName){
	var spanArray = $('p');
	$.each(spanArray, function(){
		if (!$(this).find('span').hasClass(roomName)) {
			$(this).fadeOut('fast');
		} else {
			$(this).fadeIn();
		}
	});
};


// function to call on successful retreival of data
var retrieveOnSuccess = function(resultData){
	var rooms = {};
	resultData = _.sortBy(resultData, 'createdAt');
	_.each(resultData, function(item) {
		var room = $('<span>'+item.roomname+'</span>').text();
		room = sanitize(room);
		rooms[room] = room;
		var text = $('<span>'+item.text+'</span>').text();
		text = sanitize(text);
		var user = $('<span>'+item.username+'</span>').text();
		user = sanitize(user);
		var message = messageTemplate(user, text, room);
		$('#messagesDiv').prepend(message);
	});
	listRooms(rooms);
};


// retrieve messages
var retrieve = function(){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		data: {'order':'-createdAt'},
		contentType: 'application/json',
		success: function(data){
			retrieveOnSuccess(data.results);
			if ($('#rooms').val() !== 'All Rooms') {
				filterRoom($('#rooms').val());
			} else {
				$('p').show();
			}
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
		retrieve();
  });

  $('#sendMsg').on('click',function(){
		var msg = {
			'username': user,
			'text': $('#textMsg').val(),
			'roomname': $('#selectRoom').val()
		};
    send(msg);
  });

  $('#friendsFilter').on('click',function(){
		$.each($('p'), function(){
			var friend = $(this).find('a').html();
			if (!friends[friend]) {
				$(this).hide();
			}
		});
  });

  $('body').on('click', 'a', function(e){
		e.preventDefault();
		storeFriends($(this).html());
	  $.each($('p'), function(){
			var friend = $(this).find('a').html();
			if (friends[friend]) {
				$(this).children().css({
					'font-weight': 'bold'
				});
			}
	  });
  });


	$('#rooms').on('change', function(){
		var roomName = $(this).val();
		roomName === 'All Rooms' ? $('p').show() : filterRoom(roomName);
	});
});




retrieve();
