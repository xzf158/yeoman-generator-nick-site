define(function() {
    return {
        trackEvent: function(newValue) {
            if (window.pageNameAppend) {
                pageNameAppend(newValue);
            }
            console.log("tracking: " + newValue);
        }
    };
});