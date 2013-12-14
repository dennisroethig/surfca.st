'use strict';

var surfcast = angular.module('surfcast', []);

surfcast.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/settings', {
            templateUrl: 'views/configuration.html',
            controller: 'ConfigurationCtrl'
        })
        .when('/:continent', {
            templateUrl: 'views/continent-detail.html',
            controller: 'ContinentDetailCtrl'
        })
        .when('/:continent/:country', {
            templateUrl: 'views/country-detail.html',
            controller: 'CountryDetailCtrl'
        })
        .when('/:continent/:country/:spot', {
            templateUrl: 'views/spot-detail.html',
            controller: 'SpotDetailCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);