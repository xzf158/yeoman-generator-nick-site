/**
 * @author Terry
 * @date 2013-07-09
 */

define(["jquery", "URI", 'domReady!', "history"], function($, Uri) {
    var scheme = {
        currentUrl : undefined,
        pushState : function(url, _isScroll) {
            if (url !== scheme.currentUrl) {
                isScroll = _isScroll ? true : false;
                History.pushState(null, null, url);
            }
        },
        /**
         * @parameter: callback @type: function
         * @example:
         * function callback(url, isScroll){
         *     @parameter: url @info: current url
         *     @parameter: isScroll @info: is scroll screen trigger changed
         * }
         */
        addStateChangeCallback : function(callback) {
            stateChangeCallbacks.push(callback);
        }
    }, stateChangeCallbacks = [], isScroll = false;
    History.Adapter.bind(window, 'statechange', stateChangeHandler);

    function stateChangeHandler() {
        var uri = new Uri(History.getState().url);
        var url = uri.path();
        for (var i in stateChangeCallbacks) {
            if ( typeof stateChangeCallbacks[i] === "function") {
                stateChangeCallbacks[i].call(this, url, isScroll);
            }
        }
        scheme.currentUrl = url;
        isScroll = false;
    }

    return scheme;
});
