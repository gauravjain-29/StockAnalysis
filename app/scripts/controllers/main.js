'use strict';

/**
 * @ngdoc function
 * @name stockApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stockApp
 */

angular.module('stockApp').run(function($rootScope, $location, $state, LoginService) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            console.log('Changed state to: ' + toState);
            console.log(toState);
        });

    if (!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
    }
});

angular.module('stockApp')
    .controller('MainCtrl', function($scope, $http) {

        // $http({
        //     method: 'GET',
        //     url: '/data/NSE-datasets-codes.csv'
        // }).then(function successCallback(response) {
        //     var rawData = Papa.parse(response.data);
        //     for (var i in rawData.data) {
        //         rawData.data[i][0] = rawData.data[i][0].substring(4);
        //     }
        //     $scope.nseCodesArray = rawData;
        //     console.log(rawData);
        // }, function errorCallback(response) {
        //     // called asynchronously if an error occurs
        //     // or server returns response with an error status.
        // });

        $scope.blockUICall = function() {
            $.blockUI({
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

        $scope.blockUICall();
        $scope.isCollapsed = true;
        $http({
            method: 'GET',
            url: 'https://django-backend.herokuapp.com/stocks/'
        }).then(function successCallback(response) {
            var rawData = response;
            for (var i in rawData.data) {
                rawData.data[i][0] = rawData.data[i][0];
            }
            $scope.nseCodesArray = rawData;
            $scope.unblockUICall();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });



        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

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

        $scope.draw = function(shareData) {
            var formattedData = [];
            //var shareData = $scope.data.dataset.data;
            for (var item in shareData) {
                var itemData = shareData[item];
                var itemObj = { x: new Date(itemData.Date), y: [itemData.Open, itemData.High, itemData.Low, itemData.Close] };
                formattedData.push(itemObj);
            }

            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "Candlestick Chart",
                },
                exportEnabled: true,
                axisY: {
                    includeZero: false,
                    prefix: "₹",
                },
                axisX: {
                    valueFormatString: "DD-MMM",
                },
                data: [{
                    type: "candlestick",
                    dataPoints: formattedData
                }]
            });
            chart.render();
        }

        $scope.getTicker = function() {
            $scope.history = false;
            $scope.ticker = true;
            //$scope.data = '';
            $scope.errorCode = '';
            $scope.errorMessage = '';
            $scope.dismissSearch = true;
            //$scope.blockUICall();

            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();

            var todaysDate = year+'-'+month+'-'+day;
            var previousYearDate = (year-1)+'-'+month+'-'+day;
            if(!$scope.startDate && !$scope.endDate)
            {
                $scope.startDate = previousYearDate;
                $scope.endDate = todaysDate;
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
                url: ('https://django-backend.herokuapp.com/stock/'),
                dataType: 'json',
                type: 'post',
                data: postdata,
                success: function(response) {
                    console.log(response);
                    $scope.draw(response);
                    $scope.tickerData = response.reverse();
                    $scope.$digest();
                },
                error: function(response) {
                    console.log(response);
                    $scope.errorCode = response.status;
                    //if (response.status == 404) {
                        $scope.errorMessage = response.responseText;
                    //}
                    $scope.$digest();
                    $scope.unblockUICall();
                }
            });

            var tickerPostData = {}
            tickerPostData.ticker = $scope.scripCode;
            $.ajax({
                url: ('https://django-backend.herokuapp.com/pointers/'),
                dataType: 'json',
                type: 'post',
                data: tickerPostData,
                success: function(response) {
                    $scope.pointers = response;
                    $scope.$digest();
                    $scope.unblockUICall();
                },
                error: function(response) {
                    console.log(response);
                    $scope.errorCode = response.status;
                    //if (response.status == 404) {
                        $scope.errorMessage = response.responseText;
                    //}
                    $scope.$digest();
                    $scope.unblockUICall();
                }
            });
        }

        $scope.setScrip = function(scripSelected) {
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

angular.module('stockApp').controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {

    $scope.formSubmit = function() {
        if (LoginService.login($scope.username, $scope.password)) {
            $scope.error = '';
            $scope.username = '';
            $scope.password = '';
            $state.transitionTo('home');
        } else {
            $scope.error = "Incorrect username/password !";
        }
    };

});

angular.module('stockApp').factory('LoginService', function() {
    var admin = 'admin';
    var pass = 'admin123';
    var isAuthenticated = false;

    return {
        login: function(username, password) {
            isAuthenticated = username === admin && password === pass;
            return isAuthenticated;
        },
        isAuthenticated: function() {
            return isAuthenticated;
        }
    };

});
