'use strict';

surfcast.controller('ApplicationCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {


    // SET API_URL
    // - set to localhost:xxxx for local development
    // - default loads from http://surfca.st
    // $scope.API_URL = document.location.protocol + '//' + document.location.hostname + (document.location.port !== '' ? ':3000' : '' );
    $scope.API_URL = 'http://surfca.st';


    // LOCAL VARIABLES
    var navState = 0,
        transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'transition': 'transitionend'
        };


    // INITIAL SCOPE SETUP
    $scope.spots = $scope.$parent.$root.spots || [];
    $scope.currentTitle = '';
    $scope.contentWrapperStyle = {};
    $scope.contentStyle = {};
    $scope.navigationStyle = {};


    // SET CURRENT APPLICATION STATUS
    $scope.applicationStatus = {
        showing: 'content',
        transition: false,
        detailLoading: false,
        currentTitleStatus: 'show'
    };


    // IF NO SPOTS AVILABLE, GET SOME
    if ($scope.spots.length === 0) {
        getSpots();
    }


    // CREATE / SAVE CONFIGURATION TO LOCAL STORAGE
    saveConfigurationToLocalStorage();


    // MEASURE AND ADJUST SCREENS AS NECESSARY
    fitViewToScreen();
    window.onresize = function(event) { fitViewToScreen(); };


    // DETECT TRANSITION EVENTS TO HANDLE OPEN AND CLOSE OVERLAY
    onTransitionEnd(document.getElementById('outer-wrapper'), transitionHasEnded);


    // IF DETAILS READY EVENT IS FIRED, CLOSE MAIN NAV
    $scope.$on('spotDetailsReady', function() {
        toggleMainNav();
    });



    // SCOPE FUNCTIONS

    $scope.toggleNavStyle = function() {
        event.preventDefault();
        toggleMainNav();
    };

    $scope.onContentDrag = function(event) {

        // opening navigation
        if ($scope.applicationStatus.showing === 'content') {

            if (event.distanceX <= 262 && event.distanceX >= 0) {
                $scope.contentWrapperStyle.marginLeft = event.distanceX + 'px';
            } else if (event.distanceX > 262) {
                $scope.contentWrapperStyle.marginLeft = '262px';
            }

        }

        // closing navigation
        else {

            if (event.distanceX >= -262 && event.distanceX <= 0) {
                $scope.contentWrapperStyle.marginLeft = 262 + event.distanceX + 'px';
            } else if (event.distanceX < -262) {
                $scope.contentWrapperStyle.marginLeft = '0';
            }

        }
    };

    $scope.onContentDragStart = function(event) {

        $scope.contentWrapperStyle['-webkit-transition-duration'] = null;
    };

    $scope.onContentDragEnd = function(event) {

        // opening navigation
        if ($scope.applicationStatus.showing === 'content') {
            if (event.distance >= window.innerWidth / 2) {
                $scope.contentWrapperStyle.marginLeft = '262px';
                $scope.applicationStatus.showing = 'navigation';
                $scope.navigationStyle['-webkit-overflow-scrolling'] = 'touch';
            } else {
                $scope.contentWrapperStyle.marginLeft = '0px';
                $scope.navigationStyle['-webkit-overflow-scrolling'] = null;
            }
        }


        // closing navigation
        else {
            if (event.distance >= window.innerWidth / 2) {
                $scope.contentWrapperStyle.marginLeft = '0';
                $scope.applicationStatus.showing = 'content';
                $scope.navigationStyle['-webkit-overflow-scrolling'] = null;
            } else {
                $scope.contentWrapperStyle.marginLeft = '262px';
                $scope.navigationStyle['-webkit-overflow-scrolling'] = 'touch';
            }
        }
    };

    $scope.getNavigationListClass = function(spotId) {

        var loadingId = $scope.applicationStatus.detailLoading;

        if (loadingId) {

            if (spotId === loadingId) {
                return 'loading';
            } else {
                return 'inactive';
            }

        } else {

            var currentSpot = _.filter($scope.spots, function(spot){
                return spot.name === $routeParams.spot;
            })[0];

            if (currentSpot && currentSpot._id === spotId) {
                return 'active';
            }

            return '';
        }
    };

    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.sharedFunctions = {

        saveStorage: function (configuration) {
            saveConfigurationToLocalStorage(configuration);
        }

    };



    // CONTROLLER FUNCTIONS

    function onTransitionEnd (el, callback) {
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                el.addEventListener(transEndEventNames[name], callback);
            }
        }
    }

    function toggleMainNav () {
        $scope.applicationStatus.transition = true;
        $scope.contentWrapperStyle['-webkit-transition-duration'] = '0.3s';
        $scope.contentWrapperStyle.marginLeft = null;

        if ($scope.applicationStatus.showing === 'content') {
            $scope.applicationStatus.showing = 'navigation';
        } else {
            $scope.applicationStatus.showing = 'content';
        }

        $scope.safeApply();
    }

    function transitionHasEnded() {
        if ($scope.applicationStatus.showing === 'navigation') {
            $scope.navigationStyle['-webkit-overflow-scrolling'] = 'touch';
        } else {
            $scope.navigationStyle['-webkit-overflow-scrolling'] = null;
        }

        $scope.applicationStatus.transition = false;
        $scope.safeApply();
    }

    function fitViewToScreen() {

        $scope.bodyStyle = $scope.bodyStyle || {};
        $scope.pageWrapperStyle = $scope.pageWrapperStyle || {};

        $scope.bodyStyle.height = '900px';

        window.scrollTo(0, 0);

        setTimeout(function() {

            $scope.bodyStyle.height = window.innerHeight + 'px';

            $scope.pageWrapperStyle.height = (window.innerHeight - 44) + 'px';

            $scope.contentWrapperStyle.height = (window.innerHeight - 44) + 'px';

            $scope.contentStyle.height = (window.innerHeight - 44) + 'px';

            $scope.safeApply();

        }, 0);
    }

    function saveSpotsToLocalStorage(spotCollection) {

        $scope.surfcastSpots = depot('surfcastSpots');

        angular.forEach(spotCollection, function(spot, index) {
            if ( !$scope.surfcastSpots.find({ '_id': spot._id })[0] ) {
                $scope.surfcastSpots.save( spot );
            }
        });
    }

    function saveConfigurationToLocalStorage(configuration) {

        $scope.surfcastConfiguration = depot('surfcastConfiguration');

        configuration = configuration || $scope.surfcastConfiguration.all()[0];

        if (configuration && configuration !== 'default') {

            // save or update config
            $scope.surfcastConfiguration.destroyAll();
            $scope.surfcastConfiguration.save( configuration );
            console.log('SAVED CONFIGURATION', configuration);

        } else {

            // create default configuration
            $scope.surfcastConfiguration.destroyAll();
            $scope.surfcastConfiguration.save({
                'favorites': {
                    'name': 'spotname'
                },
                'waveHeight': 'm',         // ft or m
                'windSpeed': 'mph',          // kn, miles, or kmh
                'requestedSpots': {
                    // 'name': 'spotname',
                    // 'country': 'spotcountry',
                    // 'status': 'pending'     // pending, fullfilled, denied
                }
            });
            console.log('SAVED CONFIGURATION AS DEFAULT');
        }
    }

    function getSpots() {
        $http({
            method: 'GET',
            url: $scope.API_URL + '/spots',
            headers: {
                'X-Requested-With': null
            }
        }).success(function(response, status) {
            $scope.msg = 'success';
            $scope.$root.spots = response;
            $scope.spots = response;

            saveSpotsToLocalStorage( response );
        }).error(function(response, status) {
            console.log('ERROR');
        });
    }

}]);
