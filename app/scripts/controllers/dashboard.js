angular.module('stockApp').directive('dashboard', function() {
	return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/dashboard.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui) {
            var scripTofind = '';
            $scope.dashboardFrequency = 'Daily';
            var baseURL = 'https://django-qa.herokuapp.com/';
            function findScrip(scrip) {
                return scrip.ticker == scripTofind;
            }

            $scope.getPointersForDashboard = function(scripCode)
            {
                scripTofind = scripCode;
                var indexOfScrip = $scope.pointersData.findIndex(findScrip);
                return $scope.pointersData[indexOfScrip];
            }

            $scope.reloading = false;
            $scope.updatePointers = function() {
                $scope.reloading = true;
                $http({
                    url: baseURL + 'pointers/?interval='+$scope.dashboardFrequency.toLowerCase(),
                    method: 'GET',
                    headers: { Authorization: 'JWT ' + $scope.jwtToken }
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.pointersData = response.data;
                    $scope.reloading = false;

                }, function errorCallback(response) {
                    $scope.reloading = false;
                });
            }
        }
    }
});