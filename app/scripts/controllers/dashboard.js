angular.module('stockApp').directive('dashboard', function() {
	return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/dashboard.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui, $q) {
            var scripTofind = '';
            $scope.dashboardFrequency = 'Daily';
            //var baseURL = 'https://django-qa.herokuapp.com/';
            var baseURL = 'https://django-prod.herokuapp.com/';
            function findScrip(scrip) {
                return scrip.ticker == scripTofind;
            }

            $scope.renderTable = false;
            $scope.getPointersForDashboard = function(scripCode)
            {
                $scope.renderTable = true;
                scripTofind = scripCode;
                var indexOfScrip = $scope.pointersData.findIndex(findScrip);
                //$scope.pointersData[indexOfScrip].cmp = $scope.liveData[scripCode];
                return $scope.pointersData[indexOfScrip];
            }

            $scope.reloading = false;
            $scope.updatePointers = function() {
                $scope.reloading = true;
                var promise1 = $http({
                    url: baseURL + 'pointers/?interval='+$scope.dashboardFrequency.toLowerCase(),
                    method: 'GET',
                    headers: { Authorization: 'JWT ' + $scope.jwtToken }
                })/*.then(function successCallback(response) {
                    console.log(response);
                    $scope.pointersData = response.data;
                    $scope.reloading = false;

                }, function errorCallback(response) {
                    $scope.reloading = false;
                })*/;

                // var promise2 = $http({
                //     url: baseURL + 'getCurrentPrice/',
                //     method: 'GET',
                //     headers: { Authorization: 'JWT ' + $scope.jwtToken }
                // });

                $q.all([promise1]).then(function(response) {
                    $scope.pointersData = response[0].data;
                    //$scope.liveData = response[1].data;
                    $scope.reloading = false;
                }, function(reason) {
                    $scope.reloading = false;
                    console.log(reason);
                });
            }
        }
    }
});