//Sarah Stander
//WSPig
//WEB 4200
//4/19/2017

"use strict";
angular.module('WSPig').service('PigService', [function () {
	var onMessageCallback;
	var socket = undefined;

	var onJoin = function (playerName) {
		socket = new WebSocket('ws://localhost:8080');

		socket.onopen = function () {
			var obj = {};
			obj.action = "introduce";
			obj.playerName = playerName;
			socket.send(JSON.stringify(obj));
		};

		socket.onmessage = function (event) {
			console.log("Message received:", event.data);
			if (onMessageCallback) {
				onMessageCallback(event.data);
			};
		};
	};

	var onMessage = function (callback) {
		onMessageCallback = callback;
	};

	var sendMessage = function (message) {
		if(socket) {
			socket.send(message);
		};
	};

	return {
		onMessage: onMessage,
		sendMessage: sendMessage,
		onJoin: onJoin
	};
}]);
