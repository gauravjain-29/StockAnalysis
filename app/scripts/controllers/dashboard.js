angular.module('stockApp').directive('dashboard', function() {
	return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/dashboard.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui) {
            $(function() {
                $('body').tooltip({ selector: '[data-toggle="tooltip"]' });
            });

            var scripTofind = '';
            function findScrip(scrip) {
                return scrip.ticker == scripTofind;
            }

            $scope.getPointersForDashboard = function(scripCode)
            {
                scripTofind = scripCode;
                var indexOfScrip = $scope.pointersData.findIndex(findScrip);
                return $scope.pointersData[indexOfScrip];
            }
        }
    }
});