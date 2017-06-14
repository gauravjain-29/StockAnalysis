angular.module('stockApp').directive('homePage', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/home.html',
        controller: function($scope, $cookies, jwtHelper, $http, blockui) {
            var baseURL = 'https://django-qa.herokuapp.com/';


            $scope.isCollapsed = true;
            $scope.jwtToken = $cookies.get('jwtOAuthToken');

            if ($scope.jwtToken == undefined || jwtHelper.isTokenExpired($scope.jwtToken)) {
                $state.transitionTo('login');
                return;
            }

            $scope.pageToDisplay = 'home';
            $scope.pageTitle = 'Home';

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

            }, function errorCallback(response) {
                $state.transitionTo('login');
                blockui.unblockUICall();
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $scope.scripCode = '';


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
                        for (var i = 0; i < tickerData.length; i++) {
                            tickerData[i].Date = new Date(tickerData[i].Date * 1000).toISOString().slice(0, 10);
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
                        blockui.unblockUICall();

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
            }

            $scope.setScrip = function(scripSelected) {
                console.log('Working' + scripSelected);
                $scope.msg = 'Test';
                $scope.scripCode = scripSelected;
                $scope.dismissSearch = true;
            }


        }
    };
});
