angular.module('stockApp').directive('dashboard', function() {
	return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/dashboard.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui) {
        	$scope.stocks200 = [];
        	for (var i = 0; i < 200; i++) {
        		var rowData = {};
        		rowData.code = $scope.nseCodesArray.data[i].Code;
        		rowData.name = $scope.nseCodesArray.data[i].Name;
        		rowData.interested = true;
        		$scope.stocks200[i] = rowData;
        	}
        }
    }
});