'use strict';

surfcast.filter('printTimecode', function () {
    return function (timecode) {
        switch (timecode) {
        case '0':
            return '00:00';
        case '300':
            return '03:00';
        case '600':
            return '06:00';
        case '900':
            return '09:00';
        case '1200':
            return '12:00';
        case '1500':
            return '15:00';
        case '1800':
            return '18:00';
        case '2100':
            return '21:00';
        }
    };
});