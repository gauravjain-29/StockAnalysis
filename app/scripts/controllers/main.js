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
    .controller('MainCtrl', function($scope, $http, $cookies, jwtHelper, $state, blockui, $location) {

        $scope.jwtToken = $cookies.get('jwtOAuthToken');
        if ($scope.jwtToken == undefined || jwtHelper.isTokenExpired($scope.jwtToken)) {
            $state.transitionTo('login');
            return;
        }

        var baseURL = 'https://django-qa.herokuapp.com/';

        $scope.userProfileFunction = function(doDigest) {
            $scope.pageToDisplay = 'profile';
            $scope.pageTitle = 'User Profile';
            $(".homeNav").removeClass("active");
            $(".dashboardNav").removeClass("active");
            $(".userProfileNav").addClass("active");
            if(doDigest)
                $scope.$digest();
            $state.transitionTo('home.profile');
        }

        $scope.homeFunction = function(doDigest, changeUrl) {
            $scope.pageTitle = 'Home';
            $scope.pageToDisplay = 'home';
            $(".userProfileNav").removeClass("active");
            $(".dashboardNav").removeClass("active");
            $(".homeNav").addClass("active");
            if(doDigest)
                $scope.$digest();
            $state.go('home',{},{location:changeUrl});
        }

        $scope.dashboardFunction = function(doDigest) {
            $scope.pageTitle = 'Dashboard';
            $scope.pageToDisplay = 'dashboard';
            $(".userProfileNav").removeClass("active");
            $(".homeNav").removeClass("active");
            $(".dashboardNav").addClass("active");
            if(doDigest)
                $scope.$digest();
            $state.transitionTo('home.dashboard');
        }


        blockui.blockUICall();

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
            blockui.unblockUICall();
            $.getScript("assets/js/paper-dashboard.js", function(data, textStatus, jqxhr) {
                console.log(data); // Data returned
                console.log(textStatus); // Success
                console.log(jqxhr.status); // 200
                console.log("Load was performed.");
            });

            if($state.current.name == 'home')
            {
                //$scope.homeFunction(false);
            }
            else if($state.current.name == 'home.profile')
            {
                $scope.userProfileFunction(false);
            }
            if($state.current.name == 'home.dashboard')
            {
                $scope.dashboardFunction(false);
            }

        }, function errorCallback(response) {
            $state.transitionTo('login');
            blockui.unblockUICall();
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        //var tickerPostData = {}
        //tickerPostData.ticker = $scope.scripCode;
        var pointers = [];
        $.ajax({
            url: (baseURL + 'pointers/'),
            dataType: 'json',
            type: 'get',
            //data: tickerPostData,
            headers: { Authorization: 'JWT ' + $scope.jwtToken },
            success: function(response) {
                pointers = response;
                console.log(response);
                //$scope.$digest();
                //blockui.unblockUICall();
                var queryParams = $location.search();
            $scope.scripCode = queryParams.stock;
            if($scope.scripCode)
                $scope.getTicker();
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
                blockui.unblockUICall();
            }
        });

        function findScrip(scrip) {
            return scrip.ticker == $scope.scripCode;
        }

        //$scope.scripCode = '';


        $scope.draw = function() {
            var shareData = $scope.shareData;
            var formattedData = [];
            // //var shareData = $scope.data.dataset.data;
            for (var item in shareData) {
                var itemData = shareData[item];
                //var itemObj = { x: new Date(itemData.Date), y: [itemData.Open, itemData.High, itemData.Low, itemData.Close] };
                var itemArray = [itemData.Date * 1000, itemData.Open, itemData.High, itemData.Low, itemData.Close];

                formattedData.push(itemArray);
            }

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


        }

        $scope.getTicker = function() {

            $scope.homeFunction(false, false);
            $location.url('home/?stock='+$scope.scripCode);
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

            blockui.blockUICall();
            var postdata = {}
            postdata.ticker = $scope.scripCode;
            postdata.interval = 'daily';
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
                    var tickerData = [];
                    angular.copy(response, tickerData);
                    $scope.shareData = response.reverse();
                    $scope.draw();
                    for (var i = 0; i < tickerData.length; i++) {
                        tickerData[i].Date = new Date(tickerData[i].Date * 1000).toISOString().slice(0, 10);
                    }
                    $scope.tickerData = tickerData;
                    $scope.$digest();
                    blockui.unblockUICall();
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
                    blockui.unblockUICall();

                }
            });

            // var tickerPostData = {}
            // tickerPostData.ticker = $scope.scripCode;
            // $.ajax({
            //     url: (baseURL + 'pointers/'),
            //     dataType: 'json',
            //     type: 'post',
            //     data: tickerPostData,
            //     headers: { Authorization: 'JWT ' + $scope.jwtToken },
            //     success: function(response) {
            //         $scope.pointers = response;
            //         console.log($scope.pointers);
            //         $scope.$digest();
            //         blockui.unblockUICall();
            //     },
            //     error: function(response) {
            //         console.log(response);
            //         //$scope.errorCode = response.status;
            //         //if (response.status == 404) {
            //         //$scope.errorMessage = response.responseText;
            //         //$scope.errorMessage = "An error occured";
            //         $.notify({
            //             icon: 'ti-face-sad',
            //             message: "Unable to fetch pointers."

            //         }, {
            //             type: 'danger',
            //             timer: 4000
            //         });
            //         console.log(response.responseText);
            //         //}
            //         //$state.transitionTo('login');
            //         $scope.$digest();
            //         blockui.unblockUICall();
            //     }
            // });
            //find index of seleted scrip in the array of objects
            var indexOfScrip = pointers.findIndex(findScrip);
            $scope.pointers = pointers[indexOfScrip];
            console.log($scope.pointers);

        }

        $scope.setScrip = function(scripSelected) {
            $scope.scripCode = scripSelected;
            $scope.dismissSearch = true;
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
