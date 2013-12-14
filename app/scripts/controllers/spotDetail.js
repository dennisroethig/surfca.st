'use strict';

surfcast.controller('SpotDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    // set local variables
	var spotName = $routeParams.spot,
		countryName = $routeParams.country,
		continentName = $routeParams.continent,
        userSpecificConfiguration = $scope.surfcastConfiguration.all()[0];

    // track
    gauges(continentName + ', ' + countryName + ', ' + spotName);

    // set view status to 'navigation' while loading details
    $scope.applicationStatus.showing = 'navigation';
    $scope.applicationStatus.showSpotDetail = 'hide';

    $scope.$parent.currentTitle = $routeParams.spot;

    $scope.$watch('spots', function(newSpots, oldSpots) {
		if (newSpots.length > 0) {
			$scope.spot = _.filter(newSpots, function(spot){
				return spot.name === spotName;
			})[0];
			getSpotDetails($scope.spot._id);
		}
	});

    $scope.toggleDayDetail = function(day) {

        if (day.date === $scope.applicationStatus.showSpotDetail) {
            $scope.applicationStatus.showSpotDetail = '';
            return;
        } else {
            $scope.applicationStatus.showSpotDetail = day.date;
            return;
        }
    };

    $scope.getHourlyClass = function(day) {

        var clickedHour = $scope.applicationStatus.showSpotDetail;

        if (clickedHour && clickedHour === day.date) {
            return 'open';
        } else {
            return;
        }
    };

    function getSpotDetails(spotId) {

        $scope.applicationStatus.detailLoading = spotId;

        $http({
            method: 'GET',
            url: $scope.API_URL + '/forecasts/' + spotId,
            headers: {
                'X-Requested-With': null
            }
        }).success(function(response, status) {

            $scope.spot = response;
            $scope.offshore = $scope.spot.offShoreDirection;
            $scope.$emit('spotDetailsReady', {});
            $scope.applicationStatus.detailLoading = false;

            $scope.forecastDays = getProcessedSpot( $scope.spot.forecast );


            $scope.currentSwellHeight = getCurrent('swellHeight');
            $scope.currentSwellHeightPrefix = userSpecificConfiguration.waveHeight;
            $scope.currentSwellPeriod = getCurrent('swellPeriod');
            $scope.currentSwellPeriodPrefix = 's';

        });
    }

    function getCurrent(indicator) {

        var currentDate = new Date(),
            thisYear = currentDate.getFullYear(),
            thisMonth = (currentDate.getMonth()+1) < 10 ? '0' + (currentDate.getMonth()+1) : (currentDate.getMonth()+1) ,
            thisDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate(),
            thisHour = currentDate.getHours(),
            dateString = thisYear + '-' + thisMonth + '-' + thisDay,
            filtered, currentData;


        filtered = _.filter($scope.forecastDays[0].hourly, function(hour, index) {
            return hour.time >= thisHour*100;
        });

        if (filtered.length === 0) {
            currentData = $scope.forecastDays[1].hourly[0];
        } else {
            currentData = filtered[0];
        }

        if (indicator === 'swellHeight') {
            if (userSpecificConfiguration.waveHeight === 'ft') {
                return currentData.swellHeight_ft;
            } else {
                return currentData.swellHeight_m;
            }
        } else if (indicator === 'swellPeriod') {
            return currentData.swellPeriod_secs;
        }
    }

    function getProcessedSpot(spotDates) {

        angular.forEach(spotDates, function(date, index){

            angular.forEach(date.hourly, function(hour, index){
                if (userSpecificConfiguration.waveHeight === 'ft') {
                    hour.swellHeightOutput = hour.swellHeight_ft + 'ft';
                } else {
                    hour.swellHeightOutput = hour.swellHeight_m + 'm';
                }
                if (userSpecificConfiguration.windSpeed === 'kmh') {
                    hour.windspeedOutput = hour.windspeedKmph + 'km/h';
                } else {
                    hour.windspeedOutput = hour.windspeedMiles + 'mph';
                }
            });

        });

        return spotDates;
    }

}]);