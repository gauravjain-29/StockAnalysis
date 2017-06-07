'use strict';

angular.module('stockApp')
    .controller('activateUserCtrl', function($scope, $http, $location) {
    	var queryParams = $location.search();
    	var uid = queryParams.uid;
    	var token = queryParams.token;
    	var baseURL = 'https://django-qa.herokuapp.com/';
    	$http({
            method: 'POST',
            url: baseURL + 'activate/',
            data: { uid: uid, token: token }
        }).then(function successCallback(response) {
           $scope.activationMessage = 'Activation Successful.';
        }, function errorCallback(response) {
            $scope.activationMessage = 'Activation Failed.';
        });
   });