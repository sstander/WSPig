//Sarah Stander
//WSPig
//WEB 4200
//4/19/2017

"use strict";
var express = require('express');
var WebSocket = require('ws');
var app = express();
app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));

// EXPRESS routes go here
var server = app.listen(app.get('port'), function () {
	console.log("Server listening on port", app.get('port'));
});

var wss = new WebSocket.Server({ server: server });

// websocket communication goes here
var broadcast = function (message) {
	wss.clients.forEach(function (ws) {
		ws.send(message);
	});
};

var people = [];
var players = 0;

wss.on('connection', function (ws) {
	// This code runs when a new connection is made
	//This connection will persist
	var person = {};

	console.log("client connected");

	ws.on('message', function (message) {
		console.log("Received message from client", message);
		//Sends to just the server
		var obj = JSON.parse(message);
		if (obj.action == "introduce") {
			person.info = obj;
			person.conn = ws;
			players += 1;
			if(players %2 == 1) {
				person.playerNumber = 1
				people.push(person);
			} else {
				person.playerNumber = 2
				people.push(person);
			};
			obj.playerNumber = person.playerNumber;
			var message = JSON.stringify(obj);
			broadcast(message);
		};

		if(people.length >= 2 && obj.action == "introduce") {
			players = 0;

			for (var i = 0; i < people.length; i++) {
				if (people[i].playerNumber == 1) {
					obj.player1Name = people[i].info.playerName;
				};
				if (people[i].playerNumber == 2) {
					obj.player2Name = people[i].info.playerName;
				};
			};

			obj.action = "canStart";
			obj.playerNumber = 1;
			obj.playerName = obj.player1Name;
			obj.currentTurnPoints = 0;
			obj.player1Points = 0;
			obj.player2Points = 0;
			var message = JSON.stringify(obj);
		};

		if(obj.action == "roll") {
			if (obj.roll == 1) {
				if (obj.playerNumber == 1) {
					obj.playerNumber = 2;
				} else {
					obj.playerNumber = 1;
				};
				obj.currentTurnPoints = 0;
	    } else {
	      obj.currentTurnPoints += obj.roll;
	    };
			var message = JSON.stringify(obj);
		};

		if(obj.action == "endTurn") {
			if (obj.playerNumber == 1) {
				obj.player1Points += obj.currentTurnPoints;
				obj.playerNumber = 2;
				obj.currentTurnPoints = 0;
			} else {
				obj.player2Points += obj.currentTurnPoints;
				obj.playerNumber = 1;
				obj.currentTurnPoints = 0;
			}

			if (obj.player1Points > 100 || obj.player2Points > 100) {
				obj.endGame = true;
				if(obj.player1Points > obj.player2Points) {
					obj.winner = "Player 1 Won!";
				} else {
					obj.winner = "Player 2 Won!";
				};
			};
			var message = JSON.stringify(obj);
		};

		broadcast(message);
	});

	ws.on('close', function () {
		//This code runs when this connection is closed
		console.log("Client disconnected " + person.info["playerName"]);
		var index = people.indexOf(person);
		if (index > -1) {
		    people.splice(index, 1);
		};
	});
});
