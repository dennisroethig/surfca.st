'use strict';

surfcast.filter('windRotation', function () {
    return function (model) {
        var cssString = '',
            rotation = model.winddirDegree;

        cssString += '-webkit-transform: rotate(' + rotation + 'deg);';
        cssString += 'transform: rotate(' + rotation + 'deg);';

        return cssString;
    };
});