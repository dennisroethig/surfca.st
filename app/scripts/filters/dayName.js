'use strict';

surfcast.filter('dayName', function () {
    return function (date) {
        var names = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'],
        day = new Date(date);
        return names[day.getDay()];
    };
});