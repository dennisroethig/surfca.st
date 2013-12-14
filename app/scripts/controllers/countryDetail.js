'use strict';

surfcast.controller('CountryDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    console.log('CountryDetailCtrl');

    $scope.contentTemplate = $scope.templates.countryDetailTemplate;

    var continentName = $routeParams.continent,
		countryName = $routeParams.country;

    $scope.continentName = continentName;
    $scope.countryName = countryName;

    // track
	gauges(continentName + ', ' + countryName);

	$scope.$watch('spots', function(newSpots, oldSpots) {

		if (newSpots.length > 0) {
			$scope.spotsByCountry = _.filter(newSpots, function(spot){
				return spot.country === countryName;
			});
		}

	});

}]);