//Sarah Stander
//WSPig
//WEB 4200
//4/19/2017

"use strict";
// strings here let angular find them, variables same name for minification. Order before is same as order after
angular.module('WSPig').controller('MainController', ['$scope', 'PigService', function ($scope, PigService) {

	$scope.messages = [];

	PigService.onMessage(function (message) {
		message = JSON.parse(message);
		console.log(message);

		if(message.action == "canStart") {
			$scope.showStart = true;
			$scope.showWaiting = false;
			$scope.player1Name = message.player1Name;
			$scope.player2Name = message.player2Name;
			$scope.playerTurn = message.playerNumber;
			$scope.currentTurnPoints = message.currentTurnPoints;
			$scope.player1Points = message.player1Points;
			$scope.player2Points = message.player2Points;
			$scope.showInstructions = true;
			$scope.showHideInfo = "Hide Instructions";
			$scope.die = "images/waiting.png";
		};

		if(message.action == "start") {
			$scope.showGame = true;
			$scope.hideJoin = true;
			$scope.hideName = true;
			$scope.showStart = false;
		};

		if(message.action == "roll") {
			$scope.die = "images/" + message.roll + ".jpg";
			$scope.currentTurnPoints = message.currentTurnPoints;
			$scope.playerTurn = message.playerNumber;
		};

		if(message.action == "endTurn") {
			$scope.currentTurnPoints = message.currentTurnPoints;
			$scope.playerTurn = message.playerNumber;
			$scope.player1Points = message.player1Points;
			$scope.player2Points = message.player2Points;
			if (message.endGame) {
				$scope.showEndGame = true;
				$scope.showGame = false;
				$scope.winner = message.winner;
			};
		};
		$scope.$apply();
	});

	$scope.join = function () {
		$scope.hideJoin = true;
		$scope.showWaiting = true;
		PigService.onJoin($scope.name);
	};

	$scope.start = function () {
		var obj = {};
		obj.action = "start";
		obj.message = "start";
		PigService.sendMessage(JSON.stringify(obj));
	};

	$scope.infoOnOff = function () {
		if ($scope.showInstructions == true) {
			$scope.showInstructions = false;
			$scope.showHideInfo = "Show Instructions"
		} else {
			$scope.showInstructions = true;
			$scope.showHideInfo = "Hide Instructions"
		};
	};

	$scope.rollDie = function () {
    var roll = Math.floor((Math.random() * 6) + 1);
		var obj = {};
		obj.action = "roll";
		obj.roll = roll;
		obj.currentTurnPoints = $scope.currentTurnPoints;
		obj.playerNumber = $scope.playerTurn;
		PigService.sendMessage(JSON.stringify(obj));
    return roll;
  };

	$scope.endTurn = function () {
		var obj = {};
		obj.action = "endTurn";
		obj.playerNumber = $scope.playerTurn;
		obj.currentTurnPoints = $scope.currentTurnPoints;
		obj.player1Points = $scope.player1Points;
		obj.player2Points = $scope.player2Points;
		PigService.sendMessage(JSON.stringify(obj));
	};
}]);
