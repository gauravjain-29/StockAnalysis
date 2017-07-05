'use strict';

/**
 * @ngdoc function
 * @name stockApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stockApp
 */

angular.module('stockApp').run(function($rootScope, $location, $state, $cookies) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'login') {
                $cookies.put('stateBeforeLogin', fromState.name);
                $cookies.put('paramsBeforeLogin', JSON.stringify($location.search()));
            }

        });

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            if (fromState.name == 'login')
                $location.search(JSON.parse($cookies.get('paramsBeforeLogin')));
        }
    );
});

angular.module('stockApp')
    .controller('MainCtrl', function($scope, $http, $cookies, jwtHelper, $state, blockui, $location, $q) {

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
            $(".adminConsoleNav").removeClass("active");
            $(".userProfileNav").addClass("active");
            if (doDigest)
                $scope.$digest();
            $state.go('home.profile');
        }

        $scope.homeFunction = function(doDigest, changeUrl) {
            $scope.pageTitle = 'Home';
            $scope.pageToDisplay = 'home';
            $(".userProfileNav").removeClass("active");
            $(".dashboardNav").removeClass("active");
            $(".adminConsoleNav").removeClass("active");
            $(".homeNav").addClass("active");
            if (doDigest)
                $scope.$digest();
            $state.go('home', {}, { location: changeUrl });
        }

        $scope.dashboardFunction = function(doDigest) {
            $scope.showLoader = true;
            $scope.pageTitle = 'Dashboard';
            $scope.pageToDisplay = 'dashboard';
            $(".userProfileNav").removeClass("active");
            $(".homeNav").removeClass("active");
            $(".adminConsoleNav").removeClass("active");
            $(".dashboardNav").addClass("active");
            if (doDigest)
                $scope.$digest();
            $state.go('home.dashboard');
            $scope.showLoader = false;
        }

        $scope.adminConsoleFunction = function(doDigest) {
            $scope.showLoader = true;
            $scope.pageTitle = 'Admin Console';
            $scope.pageToDisplay = 'adminconsole';
            $(".userProfileNav").removeClass("active");
            $(".homeNav").removeClass("active");
            $(".dashboardNav").removeClass("active");
            $(".adminConsoleNav").addClass("active");
            if (doDigest)
                $scope.$digest();
            $state.go('home.admin');
            $scope.showLoader = false;
        }


        //blockui.blockUICall();
        $scope.pageloadfinished = false;

        var promise1 = $http({
            method: 'GET',
            url: baseURL + 'stocks/',
            headers: { Authorization: 'JWT ' + $scope.jwtToken }

        });

        var getUserInterests = function()
        {
            $http({
            method: 'GET',
            url: baseURL + 'userInterests/',
            headers: { Authorization: 'JWT ' + $scope.jwtToken }

            }).then(function successCallback(response) {
                console.log(response);
                $scope.userInterests = response.data;

            }, function errorCallback(response) {
                
            });
        }

        getUserInterests();

        $q.all([promise1]).then(function(result) {
            console.log(result);
            $scope.nseCodesArray = result[0].data;
            //blockui.unblockUICall();
            $.getScript("assets/js/paper-dashboard.js", function(data, textStatus, jqxhr) {
            });

            if ($state.current.name == 'home') {
                //$scope.homeFunction(false);
            } else if ($state.current.name == 'home.profile') {
                $scope.userProfileFunction(false);
            }
            else if ($state.current.name == 'home.dashboard') {
                $scope.dashboardFunction(false);
            }
            else if ($state.current.name == 'home.admin' && $scope.userDetails.is_superuser) {
                $scope.adminConsoleFunction(false);
            }

            //$scope.pointersData = result[1].data;
            var queryParams = $location.search();
            $scope.scripCode = queryParams.stock;
            if ($scope.scripCode)
                $scope.getTicker();

            $scope.pageloadfinished = true;
        });

        function findScrip(scrip) {
            return scrip.ticker == $scope.scripCode;
        }

        

        $scope.chartLoaded = true;
        $scope.tickerDataLoaded = true;
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

            $scope.chartLoaded = true;

        }

        $scope.frequency = 'D';
        $scope.getTicker = function() {

            $scope.chartLoaded = false;
            $scope.tickerDataLoaded = false;
            $scope.pointersLoaded = false;
            $scope.homeFunction(false, false);
            $location.url('home/?stock=' + $scope.scripCode);
            $scope.history = false;
            $scope.ticker = true;
            //$scope.data = '';
            //$scope.errorCode = '';
            //$scope.errorMessage = '';
            $scope.dismissSearch = true;
            //$scope.blockUICall();
            for (var i = 0; i < $scope.nseCodesArray.length; i++) {
                if ($scope.scripCode == $scope.nseCodesArray[i].Code) {
                    $scope.scripName = $scope.nseCodesArray[i].Name;
                    break;
                }
                if (i == $scope.nseCodesArray.length - 1) {
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

            //blockui.blockUICall();
            var frequency = '';
            if($scope.frequency == 'D')
            {
                frequency = 'daily';
            }
            else if($scope.frequency == 'W')
            {
                frequency = 'weekly';
            }
            else if($scope.frequency == 'M')
            {
                frequency = 'monthly';
            }
            else if($scope.frequency == 'Q')
            {
                frequency = 'quarterly';
            }
            else if($scope.frequency == 'Y')
            {
                frequency = 'yearly';
            }

            var postdata = {}
            postdata.ticker = $scope.scripCode;
            postdata.interval = frequency;
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
                    $scope.tickerDataLoaded = true;
                    $scope.shareData = response.reverse();
                    $scope.draw();
                    for (var i = 0; i < tickerData.length; i++) {
                        tickerData[i].Date = new Date(tickerData[i].Date * 1000).toISOString().slice(0, 10);
                    }
                    $scope.tickerData = tickerData;
                    $scope.$digest();
                    //blockui.unblockUICall();
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
                    //blockui.unblockUICall();

                }
            });

            //find index of seleted scrip in the array of objects
            // var indexOfScrip = $scope.pointersData.findIndex(findScrip);
            // $scope.pointers = $scope.pointersData[indexOfScrip];

            //Fetch pointers
            $http({
                url: baseURL + 'pointers/?ticker='+$scope.scripCode+'&interval='+frequency,
                method: 'GET',
                headers: { Authorization: 'JWT ' + $scope.jwtToken }
            }).then(function successCallback(response) {
                console.log(response);
                $scope.pointers = response.data;
                $scope.pointersLoaded = true;
            }, function errorCallback(response) {
                $scope.pointersLoaded = true;
                $.notify({
                    icon: 'ti-face-sad',
                    message: "An Error Occured while fetching pointers."

                }, {
                    type: 'danger',
                    timer: 4000
                });
                console.log(response.responseText);
                
            });
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
