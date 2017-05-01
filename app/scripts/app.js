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
    'ngTouch'
  ]);
  module.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
