angular.module('stockApp').directive('admin', function() {
	return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/admin.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui) {
            //var baseURL = 'https://django-qa.herokuapp.com/';
            var baseURL = 'https://django-prod.herokuapp.com/';
        	$scope.updateFavoriteStocks = function()
            {
                blockui.blockUICall();
                $http({
                    method: 'PUT',
                    url: baseURL + 'userInterests/',
                    headers: { Authorization: 'JWT ' + $scope.jwtToken, 'Content-Type': 'application/json' },
                    data: $scope.userInterests

                }).then(function successCallback(response) {
                    blockui.unblockUICall();
                    $.notify({
                        icon: 'ti-face-smile',
                        message: "Preferences Updated."

                    }, {
                        type: 'success',
                        timer: 3000,
                        placement: {
                            from: 'top',
                            align: 'right'
                        }
                    });
                }, function errorCallback(response) {
                    $.notify({
                        icon: 'ti-face-sad',
                        message: "An error occured. Please try again in some time."

                    }, {
                        type: 'danger',
                        timer: 3000
                    });
                    blockui.unblockUICall();
                });
            }
        }
    }
});