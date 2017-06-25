angular.module('stockApp').directive('profilePage', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/profile.html',
        controller: function($scope, blockui, $http) {
            var baseURL = 'https://django-qa.herokuapp.com/';
            //blockui.blockUICall();

            $http({
                method: 'GET',
                url: baseURL + 'me/',
                headers: { Authorization: 'JWT ' + $scope.jwtToken }

            }).then(function successCallback(response) {
                $scope.userDetails = response.data;
                $.notify({
                    icon: 'ti-user',
                    message: "Welcome " + $scope.userDetails.username

                }, {
                    type: 'success',
                    timer: 4000,
                    placement: {
                        from: 'top',
                        align: 'center'
                    }
                });
            }, function errorCallback(response) {
                //blockui.unblockUICall();
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    };
});
