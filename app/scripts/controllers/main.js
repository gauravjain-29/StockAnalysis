'use strict';

/**
 * @ngdoc function
 * @name stockApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stockApp
 */

angular.module('stockApp').run(function($rootScope, $location, $state) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            console.log('Changed state to: ' + toState);
            console.log(toState);
        });

    // if (!LoginService.isAuthenticated()) {
    //     $state.transitionTo('login');
    // }
});

angular.module('stockApp')
    .controller('MainCtrl', function($scope, $http, $cookies, jwtHelper, $state, blockui) {

        $scope.jwtToken = $cookies.get('jwtOAuthToken');

        if ($scope.jwtToken == undefined || jwtHelper.isTokenExpired($scope.jwtToken)) {
            $state.transitionTo('login');
            return;
        }

        $scope.pageToDisplay = 'home';
        $scope.pageTitle = 'Home';
        $scope.userProfileFunction = function() {
            $scope.pageToDisplay = 'profile';
            $scope.pageTitle = 'User Profile';
            $scope.$digest();
        }

        $scope.homeFunction = function() {
            $scope.pageTitle = 'Home';
            $scope.pageToDisplay = 'home';
            $scope.$digest();
        }

        $scope.logout = function() {
            console.log('Logging out');
            $cookies.remove('jwtOAuthToken');
            $state.transitionTo('login');
        }

    });

angular.module('stockApp').directive('datePicker', function() {
    var link = function(scope, element, attrs) {
        var modelName = attrs['datePicker'];
        $(element).datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function(dateText) {
                scope[modelName] = dateText;
                scope.$apply();
            }
        });
    };
    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    }
});
