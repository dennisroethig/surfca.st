'use strict';

surfcast.controller('ConfigurationCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    // track
    gauges('settings');

    // set view status to 'navigation' while loading details
    $scope.applicationStatus.showing = 'content';

    $scope.$parent.currentTitle = 'Settings';


    $scope.changedConfig = function(target, value) {

        var surfcastConfiguration = depot('surfcastConfiguration').find()[0];

        if (target === 'swell') {
            surfcastConfiguration.waveHeight = value;
            $scope.$parent.sharedFunctions.saveStorage( surfcastConfiguration );
        }

        if (target === 'wind') {
            surfcastConfiguration.windSpeed = value;
            $scope.$parent.sharedFunctions.saveStorage( surfcastConfiguration );
        }

    };

    $scope.checkedElement = function(target, value) {

        var surfcastConfiguration = depot('surfcastConfiguration').find()[0],
            waveConfig = surfcastConfiguration.waveHeight,
            windConfig = surfcastConfiguration.windSpeed;

        if (target === 'swell' && waveConfig === value) {
            return 'checked';
        }

        if (target === 'wind' && windConfig === value) {
            return 'checked';
        }
    };

}]);





