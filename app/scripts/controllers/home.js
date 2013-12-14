'use strict';

surfcast.controller('HomeCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

	// track
	gauges('nearby');

	// set view status to 'navigation' while loading details
    $scope.applicationStatus.showing = 'content';

	// set local variables
	var distanceToSpots = {},
		allSpots = $scope.spots,
		numberOfSpotsToShow = 6;

	// set default scope-variables
	$scope.$parent.currentTitle = 'Nearest spots';
	$scope.spotsToShow = false;


	// set the permission initially to false
	$scope.locationPermissions = false;

	// watch for updated spots, get geolocation and expose spots for homescreen
	$scope.$watch('spots', function(updatedSpots, oldSpots) {

		if (updatedSpots.length > 0) {

			navigator.geolocation.getCurrentPosition( function(position){

				// success fetching geolocation
				getDistanceToSpotAndScope( position );

			}, function(error){

				// error fetching geolocation
				if(error.PERMISSION_DENIED){
					console.log('error PERMISSION_DENIED');
				} else if (error.POSITION_UNAVAILABLE) {
					console.log('error POSITION_UNAVAILABLE');
				} else if (error.TIMEOUT) {
					console.log('error TIMEOUT');
				}

				// using default values
				if (error) {
					console.log('using default coordinates');
					getDistanceToSpotAndScope({
						coords: {
							latitude: -33,
							longitude: 151
						}
					});
				}

			}, {'enableHighAccuracy':true,'timeout':10000,'maximumAge':0});
		}

	});


	// change of locationPermissions
	$scope.$watch('locationPermissions', function(newValue, oldValue) {

		if (newValue !== oldValue) {
			console.log('locationPermissions changed to:', newValue);
			console.log('locationPermissions was before:', oldValue);
		}

	});


	function getDistanceToSpotAndScope( location ) {

		console.log('location', location);

		// get distance between user and spot for each spot
		angular.forEach($scope.spots, function(spot, index){

			// call distance calculator
			var distance = calculateDistance( location.coords.latitude, location.coords.longitude, spot.latitude, spot.longitude);

			// update spot information for each spot in $scope.spots
			spot.distance = distance;
			spot.distanceRounded = parseInt(distance, 10);
		});


		// sort spots by distance, limit to the number which should be shown and make them available to $scope
		$scope.spotsToShow = _.first(
			_.sortBy($scope.spots, function(spot, identifier){
				return spot.distance;
			}),
			numberOfSpotsToShow
		);

		// perform safe apply to update $scope
		$scope.locationPermissions = true;
		$scope.safeApply();

		// calculate distance between points
		function calculateDistance(lat1, lon1, lat2, lon2) {
			var R = 6371;
			var dLat = (lat2-lat1).toRad();
			var dLon = (lon2-lon1).toRad();
			lat1 = lat1.toRad();
			lat2 = lat2.toRad();
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c;
			return d;
		}

	}


}]);