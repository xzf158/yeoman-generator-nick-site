/**
 * @author Terry
 */
(function() {
    if (!window.console) {
        window.console = {};
        window.console.log = function() {};
        window.console.dir = function() {};
    }
})();

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();

(function() {
    Function.prototype.before = function(func) {
        var __self = this;
        return function() {
            var ret = func.apply(this, arguments);
            if (ret) {
                return ret;
            }
            return __self.apply(this, arguments);
        }
    }

    Function.prototype.after = function(func) {
        var __self = this;
        return function() {
            var ret = __self.apply(this, arguments);
            if (ret) {
                return ret;
            }
            return func.apply(this, arguments);
        }
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fn, scope) {
            'use strict';
            var i, len;
            for (i = 0, len = this.length; i < len; ++i) {
                if (i in this) {
                    fn.call(scope, this[i], i, this);
                }
            }
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
            'use strict';
            if (this == null) {
                throw new TypeError();
            }
            var n, k, t = Object(this),
                len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }
            n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }
})();

(function() {
    var ua = window.navigator.userAgent.toLowerCase();
    window.platform = {
        isiPad: ua.match(/ipad/i) !== null,
        isiPhone: ua.match(/iphone/i) !== null,
        isAndroid: ua.match(/android/i) !== null,
        isBustedAndroid: ua.match(/android 2\.[12]/) !== null,
        isIE: window.navigator.appName.indexOf("Microsoft") !== -1 || ua.match(/rv:11.0/) !== null,
        isIE8: ua.match(/msie 8/) !== null,
        isIE9: ua.match(/msie 9/) !== null,
        isChrome: ua.match(/chrome/gi) !== null,
        isFirefox: ua.match(/firefox/gi) !== null,
        isWebkit: ua.match(/webkit/gi) !== null,
        isGecko: ua.match(/gecko/gi) !== null,
        isOpera: ua.match(/opera/gi) !== null,
        isMac: ua.match('mac') !== null,
        hasTouch: ('ontouchstart' in window),
        supportsSvg: !! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    };
    platform.isMobile = ua.match(/android|webos|iphone|ipod|blackberry|iemobile/i) !== null && ua.match(/mobile/i) !== null;
    platform.isTablet = platform.isiPad || (ua.match(/android|webos/i) !== null && ua.match(/mobile/i) === null);
    platform.isDesktop = !(platform.isMobile || platform.isTablet);
})();

require.config({
    baseUrl: "./scripts",
    paths: {
        "domReady": "../vendors/requirejs-domready/domReady",
        "jquery": "../vendors/jquery/jquery",
        "modernizr": "../vendors/modernizr/modernizr",
        "TweenMax": "../vendors/TweenMax.min",
        "videoJs": "../vendors/video-js/video",
        "nanoscroll": "../vendors/jquery.nanoscroller.min",
        "autoellipsis": "../vendors/jquery.autoellipsis",
        "smooth-mousewheel": "../vendors/smooth-mousewheel/dev/smooth_mousewheel",
        "page-parallax": "../vendors/page-parallax/dev/parallax"
    },
    shim: {
        "nanoscroll": ["jquery"],
        "autoellipsis": ["jquery"],
        "page-parallax": ["jquery", "TweenMax"],
        "smooth-mousewheel": ["jquery"]
    },
    waitSeconds: 0,
    packages: [{
        name: 'horn',
        main: 'horn.core',
        location: '../vendors/horn/'
    }, {
        name: 'horn.ui',
        main: '',
        location: '../vendors/horn.ui'
    }, {
        name: 'horn.util',
        main: '',
        location: '../vendors/horn.util'
    }]
});

require(['main', "modernizr", "horn.util/brower.compatible"], function(Main) {
    Main.init();
});