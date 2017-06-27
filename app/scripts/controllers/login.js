angular.module('stockApp').controller('LoginController', function($scope, $rootScope, $stateParams, $state, $http, $cookies, jwtHelper) {

    $scope.emailCheckStatus = -1;
    $scope.checkEmail = function()
    {
        if($scope.reg_email != null && $scope.reg_email != undefined && $scope.reg_email.includes('@'))
        {
            $scope.emailCheckStatus = 0;
            $http({
            method: 'GET',
            url: baseURL + 'checkEmail/?email='+$scope.reg_email

            }).then(function successCallback(response) {
               if(response.data)
               {
                    $scope.emailCheckStatus = 1;
               }
               else
               {
                    $scope.emailCheckStatus = 2;
               }

            }, function errorCallback(response) {
                
            });
        }
        else
        {
            $scope.emailCheckStatus = -1;
        }
    }

    var jwtToken = $cookies.get('jwtOAuthToken');
    if (jwtToken != undefined && !jwtHelper.isTokenExpired(jwtToken)) {
        $state.transitionTo('home');
        return;
    }

    $.notify({
        icon: 'ti-gift',
        message: "Welcome to Infinv."

    }, {
        type: 'success',
        timer: 4000,
        placement: {
            from: 'top',
            align: 'center'
        }
    });

    var baseURL = 'https://django-qa.herokuapp.com/';
    // $scope.blockUICall = function(message) {
    //     $.blockUI({
    //         message: message,
    //         css: {
    //             border: 'none',
    //             padding: '15px',
    //             backgroundColor: '#000',
    //             '-webkit-border-radius': '10px',
    //             '-moz-border-radius': '10px',
    //             opacity: .5,
    //             color: '#fff'

    //         }
    //     });
    // }

    // $scope.unblockUICall = function() {
    //     $.unblockUI();
    // }

    $scope.showProgressBar = false;
    $scope.login = function() {
        $scope.error = '';
        $scope.showProgressBar = true;
        //$scope.blockUICall('Validating Credentials');
        $http({
            method: 'POST',
            url: baseURL + 'auth/login/',
            data: { username: $scope.username, password: $scope.password }
        }).then(function successCallback(response) {
            $scope.logged = true;
            $scope.jwt = response.data.token;
            $cookies.put('jwtOAuthToken', $scope.jwt);
            //store.set('token', response.token);
            //$scope.unblockUICall();
            var stateBeforeLogin = $cookies.get('stateBeforeLogin')
            if(!stateBeforeLogin)
                stateBeforeLogin = 'home';

            $scope.showProgressBar = false;
            $state.go(stateBeforeLogin);
        }, function errorCallback(response) {
            $scope.logged = false;
            $scope.showProgressBar = false;
            //$scope.error = "Incorrect username/password !";
            $.notify({
                icon: 'ti-lock',
                message: "Invalid Username/Password."

            }, {
                type: 'danger',
                timer: 4000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
            //$scope.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.register = function() {
        //$scope.blockUICall('Registration in progress.');
        $scope.showProgressBar = true;
        $http({
            method: 'POST',
            url: baseURL + 'register/',
            data: { username: $scope.reg_username, password: $scope.reg_password, email: $scope.reg_email }
        }).then(function successCallback(response) {
            //$scope.reg_message = 'Registration successful. Please continue to login.';
            $.notify({
                icon: 'ti-check',
                message: "Registration Successful. An email has been sent with Activation link."

            }, {
                type: 'success',
                timer: 4000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
            //$scope.unblockUICall();
            $scope.showProgressBar = false;
        }, function errorCallback(response) {
            //$scope.reg_message = 'Username already taken.';
            $.notify({
                icon: 'ti-lock',
                message: "Username already taken. Please try a different username."

            }, {
                type: 'danger',
                timer: 4000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
            $scope.showProgressBar = false;
            //$scope.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

});