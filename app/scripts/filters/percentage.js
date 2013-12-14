'use strict';

surfcast.filter('percentage', function () {
    return function (value) {
        var maxHeight = 15,
            percent = (value / maxHeight)*100;

        if (percent > 100) {
            percent = 100;
        } else if (percent < 3) {
            percent = 3;
        }

        return parseInt(percent, 10);
    };
});