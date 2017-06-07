'use strict';

/**
 * @ngdoc overview
 * @name stockApp
 * @description
 * # stockApp
 *
 * Main module of the application.
 */
var module = angular.module('stockApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
     'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angular-jwt'
  ]);
  // module.config(function ($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'views/main.html',
  //       controller: 'MainCtrl',
  //       controllerAs: 'main'
  //     })
  //     .when('/about', {
  //       templateUrl: 'views/about.html',
  //       controller: 'AboutCtrl',
  //       controllerAs: 'about'
  //     })
  //     .otherwise({
  //       redirectTo: '/'
  //     });
  // });

  module.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'views/login.html',
        controller : 'LoginController'
      })
      // .state('home', {
      //   url : '/home',
      //   templateUrl : 'views/main.html',
      //   controller : 'MainCtrl'
      // });
      .state('home', {
        url : '/home',
        templateUrl : 'views/dashboard.html',
        controller : 'MainCtrl'
      })
      .state('activateUser', {
        url: '/activateUser',
        templateUrl : 'views/userActivation.html'
      });
  });
