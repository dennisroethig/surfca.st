'use strict';

surfcast.controller('ContinentDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    $scope.contentTemplate = $scope.templates.continentDetailTemplate;

    $scope.applicationStatus.showing = 'navigation';


    var continentName = $routeParams.continent;

    $scope.continentName = continentName;

    // track
	gauges(continentName);

	$scope.$watch('spots', function(newSpots, oldSpots) {

		if (newSpots.length > 0) {
			$scope.spotsByContinent = _.filter(newSpots, function(spot){
				return spot.continent === continentName;
			});
		}

	});

}]);