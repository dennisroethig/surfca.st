'use strict';

surfcast.filter('windClass', function () {
    return function (model, offshoreDirection) {

        var className,
            goodRange = getRange( offshoreDirection, 45 ),
            sideshoreGoodRange = getRange( offshoreDirection, 90 ),
            sideshoreBadRange = getRange( offshoreDirection, 135 ),
            rotation = model.winddirDegree;

        function getRange (dir, offset) {

            var rangeA, rangeB;

            dir = parseInt(dir, 10);

            if (dir - offset < 0) {
                rangeA = dir - offset + 360;
            } else {
                rangeA = dir - offset;
            }

            if (dir + offset > 360) {
                rangeB = dir + offset - 360;
            } else {
                rangeB = dir + offset;
            }

            return [rangeA, rangeB];
        }

        function isInRange (dir, range) {

            dir = parseInt(dir, 10);

            if (range[0] < range[1]) {
                if (dir >= range[0] && dir <= range[1]) {
                    return true;
                }
            } else {
                if (dir >= range[0] && dir <= 360) {
                    return true;
                } else if (dir <= range[1] && dir >= 0) {
                    return true;
                }
            }

            return false;
        }

        if (isInRange(rotation, goodRange)) {
            className = 'offshore';
        } else if (isInRange(rotation, sideshoreGoodRange)) {
            className = 'sideshore-good';
        } else if (isInRange(rotation, sideshoreBadRange)) {
            className = 'sideshore-bad';
        } else {
            className = 'onshore';
        }

        return className;
    };
});