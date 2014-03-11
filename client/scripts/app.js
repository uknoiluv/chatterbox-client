// YOUR CODE HERE:
/* global $, _ */

var app = function(){
	this.user = window.location.search.slice(10);
	this.friends = {};
	this.message = {
		'username': 'Chef',
		'text': 'hello Children',
		'roomname': 'lurker'
	};



};

// message template
app.prototype.messageTemplate = function(user, text, room){
	var userSpan = '<a href="#" class="'+user+'">'+user+'</a>';
	var textSpan = '<span class="'+text+'">'+text+'</span>';
	var roomSpan = '<span class="'+room+'">'+room+'</span>';
	var message = $('<p>' + userSpan +': ' + textSpan + ' - ' + roomSpan +  '</p>');
	return message;
};

// sanitize input string
app.prototype.sanitize = function(string){
	return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

//create list of rooms to select from
app.prototype.listRooms = function(rooms){
	for (var key in rooms){
		$('#rooms').append('<option value="'+key+'">'+key+'</option>');
		$('#selectRoom').append('<option value="'+key+'">'+key+'</option>');
	}
};

// store friends
app.prototype.storeFriends = function(friend){
	this.friends[friend] = friend;
};

// filter by room
app.prototype.filterRoom = function(roomName){
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
app.prototype.retrieveOnSuccess = function(resultData){
	var that = this;
	var rooms = {};
	resultData = _.sortBy(resultData, 'createdAt');
	_.each(resultData, function(item) {
		var room = $('<span>'+item.roomname+'</span>').text();
		room = that.sanitize(room);
		rooms[room] = room;
		var text = $('<span>'+item.text+'</span>').text();
		text = that.sanitize(text);
		var user = $('<span>'+item.username+'</span>').text();
		user = that.sanitize(user);
		var message = that.messageTemplate(user, text, room);
		$('#messagesDiv').prepend(message);
	});
	that.listRooms(rooms);
};


// retrieve messages
app.prototype.retrieve = function(){
	var that = this;
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		data: {'order':'-createdAt'},
		contentType: 'application/json',
		success: function(data){
			that.retrieveOnSuccess(data.results);
			if ($('#rooms').val() !== 'All Rooms') {
				that.filterRoom($('#rooms').val());
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
app.prototype.send = function(message) {
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
	var application = new app();
	application.retrieve();

	// refresh on click
	$('#refresh').on('click',function(){
		application.retrieve();
  });

	// send message on click on send
  $('#sendMsg').on('click',function(){
		var msg = {
			'username': application.user,
			'text': $('#textMsg').val(),
			'roomname': $('#selectRoom').val()
		};
    application.send(msg);
  });

  // filter friends only on click
  $('#friendsFilter').on('click',function(){
		$.each($('p'), function(){
			var friend = $(this).find('a').html();
			if (!application.friends[friend]) {
				$(this).hide();
			}
		});
  });

  //make friends bold
  $('body').on('click', 'a', function(e){
		e.preventDefault();
		application.storeFriends($(this).html());
		$.each($('p'), function(){
			var friend = $(this).find('a').html();
			if (application.friends[friend]) {
				$(this).children().css({
					'font-weight': 'bold'
				});
			}
		});
  });

  // change rooms on selection
	$('#rooms').on('change', function(){
		var roomName = $(this).val();
		roomName === 'All Rooms' ? $('p').show() : application.filterRoom(roomName);
	});
});




