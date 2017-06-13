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
    .controller('MainCtrl', function($scope, $http, $cookies, jwtHelper, $state) {

        var baseURL = 'https://django-qa.herokuapp.com/';

        $scope.blockUICall = function() {
            $.blockUI({
                message: 'Getting everything ready.',
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                }
            });
        }

        $scope.unblockUICall = function() {
            $.unblockUI();
        }

        $scope.isCollapsed = true;
        $scope.jwtToken = $cookies.get('jwtOAuthToken');

        if ($scope.jwtToken == undefined || jwtHelper.isTokenExpired($scope.jwtToken)) {
            $state.transitionTo('login');
            return;
        }

        $scope.pageToDisplay = 'home';
        $scope.pageTitle = 'Home';
        $scope.userProfileFunction = function()
        {
             $scope.pageToDisplay = 'profile';
             $scope.pageTitle = 'User Profile';
             $scope.$digest();
        }

        $scope.homeFunction = function()
        {
            $scope.pageTitle = 'Home';
             $scope.pageToDisplay = 'home';
             $scope.$digest();
        }

        $scope.blockUICall();

        $http({
            method: 'GET',
            url: baseURL + 'stocks/',
            headers: { Authorization: 'JWT ' + $scope.jwtToken }

        }).then(function successCallback(response) {
            var rawData = response;
            // for (var i in rawData.data) {
            //     rawData.data[i][0] = rawData.data[i][0];
            // }
            $scope.nseCodesArray = rawData;
            $scope.unblockUICall();
            $.getScript( "assets/js/paper-dashboard.js", function( data, textStatus, jqxhr ) {
              console.log( data ); // Data returned
              console.log( textStatus ); // Success
              console.log( jqxhr.status ); // 200
              console.log( "Load was performed." );
            });

        }, function errorCallback(response) {
            $state.transitionTo('login');
            $scope.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

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
            $scope.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        // this.awesomeThings = [
        //     'HTML5 Boilerplate',
        //     'AngularJS',
        //     'Karma'
        // ];

        $scope.scripCode = '';
        // $scope.getData = function(shareData) {
        //     $scope.history = false;
        //     $scope.ticker = true;
        //     $scope.data = '';
        //     $scope.errorCode = '';
        //     $scope.errorMessage = '';
        //     //$scope.blockUICall();

        //     var currentDate = new Date();
        //     var day = currentDate.getDate();
        //     var month = currentDate.getMonth() + 1;
        //     var year = currentDate.getFullYear();

        //     var todaysDate = year+'-'+month+'-'+day;
        //     var previousYearDate = (year-1)+'-'+month+'-'+day;
        //     if(!$scope.startDate && !$scope.endDate)
        //     {
        //         $scope.startDate = previousYearDate;
        //         $scope.endDate = todaysDate;
        //     }

        //     $scope.draw(shareData);

        //     // var startDateParameter = $scope.startDate ? '&start_date=' + $scope.startDate : '';
        //     // var endDateParameter = $scope.endDate ? '&end_date=' + $scope.endDate : '';
        //     // $.ajax({
        //     //     url: ('https://www.quandl.com/api/v3/datasets/NSE/' + $scope.scripCode + '.json?api_key=-Q-zpXxS1SEg8TJQEi1L' + startDateParameter + endDateParameter),
        //     //     dataType: 'json',
        //     //     type: 'get',
        //     //     success: function(response) {
        //     //         console.log(response);
        //     //         $scope.data = response;
        //     //         $scope.unblockUICall();
        //     //         $scope.draw();
        //     //         $scope.$digest();
        //     //     },
        //     //     error: function(response) {
        //     //         console.log(response);
        //     //         $scope.errorCode = response.status;
        //     //         if (response.status == 404) {
        //     //             $scope.errorMessage = 'Invalid Scrip Code';
        //     //         }
        //     //         $scope.unblockUICall();
        //     //         $scope.$digest();
        //     //     }
        //     // });
        // }

        $scope.logout = function() {
            console.log('Logging out');
            $cookies.remove('jwtOAuthToken');
            $state.transitionTo('login');
        }

        $scope.draw = function() {
            var shareData = $scope.shareData;
            var formattedData = [];
            // //var shareData = $scope.data.dataset.data;
            for (var item in shareData) {
                var itemData = shareData[item];
                //var itemObj = { x: new Date(itemData.Date), y: [itemData.Open, itemData.High, itemData.Low, itemData.Close] };
                var itemArray = [itemData.Date*1000, itemData.Open, itemData.High, itemData.Low, itemData.Close];

                formattedData.push(itemArray);
            }

            // var chart = new CanvasJS.Chart("chartContainer", {
            //     title: {
            //         text: "Candlestick Chart",
            //     },
            //     exportEnabled: true,
            //     axisY: {
            //         includeZero: false,
            //         prefix: "₹",
            //     },
            //     axisX: {
            //         valueFormatString: "DD-MMM",
            //     },
            //     data: [{
            //         type: "candlestick",
            //         dataPoints: formattedData
            //     }]
            // });
            // chart.render();


            // $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?a=e&filename=aapl-ohlc.json&callback=?', function (data) {
            //console.log(data);

            // create the chart
            Highcharts.stockChart('chartContainer', {


                rangeSelector: {
                    selected: 1
                },

                title: {
                    text: $scope.scripName
                },

                series: [{
                    type: 'candlestick',
                    name: $scope.scripName,
                    data: formattedData,
                    dataGrouping: {
                        units: [
                            [
                                'week', // unit name
                                [1] // allowed multiples
                            ],
                            [
                                'month', [1, 2, 3, 4, 6]
                            ]
                        ]
                    }
                }]
            });
            // });


        }

        $scope.getTicker = function() {



            $scope.history = false;
            $scope.ticker = true;
            //$scope.data = '';
            //$scope.errorCode = '';
            //$scope.errorMessage = '';
            $scope.dismissSearch = true;
            //$scope.blockUICall();
            for (var i = 0; i < $scope.nseCodesArray.data.length; i++) {
                if ($scope.scripCode == $scope.nseCodesArray.data[i].Code) {
                    $scope.scripName = $scope.nseCodesArray.data[i].Name;
                    break;
                }
                if (i == $scope.nseCodesArray.data.length - 1) {
                    //$scope.errorMessage = 'Invalid Scrip Code';
                    $.notify({
                        icon: 'ti-face-sad',
                        message: "Invalid Scrip Code."

                    }, {
                        type: 'danger',
                        timer: 4000
                    });

                    return;
                }
            }

            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();

            var todaysDate = year + '-' + month + '-' + day;
            var previousYearDate = (year - 1) + '-' + month + '-' + day;
            if (!$scope.startDate && !$scope.endDate) {
                $scope.startDate = previousYearDate;
                $scope.endDate = todaysDate;
            }

            if (jwtHelper.isTokenExpired($scope.jwtToken)) {
                $state.transitionTo('login');
                return;
            }

            $scope.blockUICall();
            var postdata = {}
            postdata.ticker = $scope.scripCode;
            if ($scope.startDate) {
                postdata.start_date = $scope.startDate;
            }
            if ($scope.endDate) {
                postdata.end_date = $scope.endDate;
            }
            $.ajax({
                url: (baseURL + 'stock/'),
                dataType: 'json',
                type: 'post',
                data: postdata,
                headers: { Authorization: 'JWT ' + $scope.jwtToken },
                success: function(response) {
                    $scope.shareData = response;
                    $scope.draw();
                    var tickerData = response.reverse();
                    for(var i=0; i<tickerData.length; i++)
                    {
                        tickerData[i].Date = new Date(tickerData[i].Date*1000).toISOString().slice(0,10);
                    }
                    $scope.tickerData = tickerData;
                    $scope.$digest();
                },
                error: function(response) {
                    console.log(response);
                    //$scope.errorCode = response.status;
                    //if (response.status == 404) {
                    //$scope.errorMessage = response.responseText;
                    //$scope.errorMessage = "An error occured";
                    $.notify({
                        icon: 'ti-face-sad',
                        message: "An Error Occured. This may not be a valid stock."

                    }, {
                        type: 'danger',
                        timer: 4000
                    });
                    console.log(response.responseText);
                    //}
                    //$state.transitionTo('login');
                    $scope.$digest();
                    $scope.unblockUICall();

                }
            });

            var tickerPostData = {}
            tickerPostData.ticker = $scope.scripCode;
            $.ajax({
                url: (baseURL + 'pointers/'),
                dataType: 'json',
                type: 'post',
                data: tickerPostData,
                headers: { Authorization: 'JWT ' + $scope.jwtToken },
                success: function(response) {
                    $scope.pointers = response;
                    console.log($scope.pointers);
                    $scope.$digest();
                    $scope.unblockUICall();
                },
                error: function(response) {
                    console.log(response);
                    //$scope.errorCode = response.status;
                    //if (response.status == 404) {
                    //$scope.errorMessage = response.responseText;
                    //$scope.errorMessage = "An error occured";
                    $.notify({
                        icon: 'ti-face-sad',
                        message: "Unable to fetch pointers."

                    }, {
                        type: 'danger',
                        timer: 4000
                    });
                    console.log(response.responseText);
                    //}
                    //$state.transitionTo('login');
                    $scope.$digest();
                    $scope.unblockUICall();
                }
            });
        }

        $scope.setScrip = function(scripSelected) {
            console.log('Working'+scripSelected);
            $scope.msg = 'Test';
            $scope.scripCode = scripSelected;
            $scope.dismissSearch = true;
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

angular.module('stockApp').controller('LoginController', function($scope, $rootScope, $stateParams, $state, $http, $cookies, jwtHelper) {

    $scope.emailCheckStatus = -1;
    $scope.checkEmail = function()
    {
        console.log('Enetered Here');
        
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
    $scope.blockUICall = function(message) {
        $.blockUI({
            message: message,
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'

            }
        });
    }

    $scope.unblockUICall = function() {
        $.unblockUI();
    }


    $scope.login = function() {
        $scope.error = '';
        $scope.blockUICall('Validating Credentials');
        $http({
            method: 'POST',
            url: baseURL + 'auth/login/',
            data: { username: $scope.username, password: $scope.password }
        }).then(function successCallback(response) {
            $scope.logged = true;
            $scope.jwt = response.data.token;
            $cookies.put('jwtOAuthToken', $scope.jwt);
            //store.set('token', response.token);
            $scope.unblockUICall();
            $state.transitionTo('home');
        }, function errorCallback(response) {
            $scope.logged = false;
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
            $scope.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.register = function() {
        $scope.blockUICall('Registration in progress.');
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
            $scope.unblockUICall();
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
            $scope.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

});

angular.module('stockApp').directive('homePage', function() {
    return {
        templateUrl: 'views/home.html'
    };
});

angular.module('stockApp').directive('profilePage', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/profile.html',
        link: function(scope, element, attrs) {
            scope.$apply();
        }
    };
});
// angular.module('stockApp').factory('LoginService', function($http) {
//     var admin = 'admin';
//     var pass = 'admin123';
//     var isAuthenticated = false;

//   //   function login(username, password)
//   //   {
//   //       var loginURL = $scope.serverURL + 'api-token-auth/';
//   //       $http.post(
//   //       loginURL,
//   //       {'username': $scope.username, 'password': $scope.password})
//   //         .success(function(response) {
//   //             $scope.logged = true;
//   //             $scope.jwt = response.token;
//   //             store.set('token', response.token);
//   //         }).error(function(response, status) {
//   //             $scope.logged = false;
//   // });
//   //   }
//     return {
//         login: function(username, password) {
//             var loginURL = 'https://django-qa.herokuapp.com/api-token-auth/';
//             $http.post(
//                     loginURL, { 'username': username, 'password': password })
//                 .success(function(response) {
//                     console.log(response);
//                     // $scope.logged = true;
//                     // $scope.jwt = response.token;
//                     // store.set('token', response.token);
//                 }).error(function(response, status) {
//                     console.log(response);
//                     //$scope.logged = false;
//                 });

//             // isAuthenticated = username === admin && password === pass;
//             // return isAuthenticated;
//         },
//         isAuthenticated: function() {
//             return isAuthenticated;
//         }
//     };

// });
