'use strict';

surfcast.filter('dayName', function () {
    return function (date) {
        var names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        day = new Date(date);
        return names[day.getDay()];
    };
});
