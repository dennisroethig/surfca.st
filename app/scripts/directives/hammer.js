'use strict';

// HAMMER.JS Directives
angular.forEach('hmTap:ontap hmDoubletap:ondoubletap hmHold:onhold hmTransformstart:ontransformstart hmTransform:ontransform hmTransforend:ontransformend hmDragstart:ondragstart hmDrag:ondrag hmDragend:ondragend hmSwipe:onswipe hmRelease:onrelease'.split(' '), function(name) {

    var directive = name.split(':'),
        directiveName = directive[0],
        eventName = directive[1];

    angular.module('surfcast').directive(directiveName,

    ['$parse', function($parse) {

        return function(scope, element, attr) {

            var fn = $parse(attr[directiveName]),
                opts = {
                    prevent_default: false,
                    drag_vertical: false,
                    swipe: false
                },
                hammer = new Hammer(element[0], opts);

            hammer[eventName] = function(e) {

                scope.$apply(function() {
                    fn(scope, {
                        $event: e
                    });
                });

            };
        };
    }]);
});