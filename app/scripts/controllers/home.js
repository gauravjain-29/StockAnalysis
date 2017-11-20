angular.module('stockApp').directive('homePage', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/home.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui, $state) {
            //var baseURL = 'https://django-qa.herokuapp.com/';
            var baseURL = 'https://django-prod.herokuapp.com/';

            $scope.isCollapsed = true;
            $scope.jwtToken = $cookies.get('jwtOAuthToken');

            if ($scope.jwtToken == undefined || jwtHelper.isTokenExpired($scope.jwtToken)) {
                $state.transitionTo('login');
                return;
            }

            $scope.pageToDisplay = 'home';
            $scope.pageTitle = 'Home';






        }
    };
});
