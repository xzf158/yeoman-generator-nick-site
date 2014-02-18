/**
 * @author Terry
 * @date 2013-07-08
 */

define(["jquery", 'domReady!', "jquery.mousewheel", "jquery.easing"], function($) {
    //@formatter:off
    var scheme,
        scrollCallbacks = [],
        currentScrollRatio = 0,
        targetScrollRatio = 0,
        scrollPageIntervalId,
        isThumbDragEffected,
        customScrollerUsed,
        currentResolution,
        needSkip = false,
        $window = $(window), 
        $document = $(document),
        screen;
    
    //@formatter:on
    function addScrollHandler(callback) {
        scrollCallbacks.push(callback);
    }

    function resizeHandler(_screen) {
        screen = _screen;
    }

    function scrollPage(ratio, duration, easing, force) {
        //console.log('===================call scroll page', ratio, duration)
        startScrollRatio = currentScrollRatio;
        //ie can not get right value if use $document.scrollTop() after click prev or next page times.
        targetScrollRatio = ratio;
        var startTime = new Date().getTime(), needSkip = false;
        function update() {
            var currentTime = Math.min(duration, new Date().getTime() - startTime);
            if (currentScrollRatio != targetScrollRatio || force) {
                autoScrollingPage = true;
                var startScrollTop = startScrollRatio * (screen.docHeight - screen.winHeight), currentScrollTop = currentScrollRatio * (screen.docHeight - screen.winHeight), targetScrollTop = targetScrollRatio * (screen.docHeight - screen.winHeight);
                var scrollTop = duration === undefined ? currentScrollTop + (targetScrollTop - currentScrollTop) * .2 : _getEasingValue(startScrollTop, targetScrollTop, currentTime, duration, easing);
                if (Math.abs(scrollTop - targetScrollTop) < 1) {
                    scrollTop = targetScrollTop;
                    currentScrollRatio = targetScrollRatio;
                    isThumbDragEffected = false;
                } else {
                    currentScrollRatio = scrollTop / (screen.docHeight - screen.winHeight);
                }
                isHistoryAutoScroll = false;
                if (platform.isiPad && needSkip) {//menu in ipad is flashing when scroll page and change css quickly.
                    // seems refresh element and scroll event timer is slower than scroll page.
                } else {
                    $document.scrollTop(scrollTop);
                    _updateScroll(currentScrollRatio, false);
                }
                needSkip = !needSkip;
                force = false;
                scrollPageIntervalId = window.requestAnimationFrame(update);
            } else {
                $document.scrollTop(targetScrollRatio * (screen.docHeight - screen.winHeight));
                _updateScroll(targetScrollRatio, true);
                autoScrollingPage = false;
                window.cancelAnimationFrame(scrollPageIntervalId);
            }
        };
        window.cancelAnimationFrame(scrollPageIntervalId);
        scrollPageIntervalId = window.requestAnimationFrame(update);
    }

    function _setupMouseWheel() {
        //@formatter:off
        var lastMouseWheelTime = new Date().getTime(),
            mouseWheelHandler = function(event, delta, deltaX, deltaY) {
            //@formatter:on
            if (isNaN(deltaY)) {//fix ie8 bug.
                deltaY = delta;
            }
            var currentTime = new Date().getTime(), deltaTime = currentTime - lastMouseWheelTime, absDeltaY = deltaY < 0 ? -deltaY : deltaY;
            absDeltaY = Math.min(absDeltaY * .8, 120);
            if (deltaTime > 16) {
                lastMouseWheelTime = currentTime;
                var deltaRatio = (deltaY > 0 ? 1 : -1) * absDeltaY / (screen.docHeight - screen.winHeight);
                if (currentScrollRatio != targetScrollRatio && autoScrollingPage) {
                    targetScrollRatio = _rangeRatio(targetScrollRatio - deltaRatio);
                } else {
                    scrollPage(_rangeRatio(targetScrollRatio - deltaRatio));
                }
            }
            return false;
        };
        if (platform.isIE) {
            $document.mousewheel(mouseWheelHandler);
        } else {
            $window.mousewheel(mouseWheelHandler);
        }
    }

    function _updateScroll(ratio, isStop) {
        for (var i = 0, il = scrollCallbacks.length; i < il; i++) {
            if (scrollCallbacks[i] && typeof scrollCallbacks[i] === "function") {
                scrollCallbacks[i].call(this, ratio, isStop);
            }
        }
    }

    function _getEasingValue(startVal, endVal, currentTime, totalTime, easing) {
        if (totalTime == 0)
            return endVal;

        var delta = endVal - startVal, percentComplete = currentTime / totalTime;
        easing = easing || "linear";
        var eased = $.easing[easing](percentComplete, currentTime, 0, 1, totalTime);
        return delta * eased + startVal;
    }

    function _rangeRatio(ratio) {
        return Math.min(Math.max(0, ratio), 1);
    }

    _setupMouseWheel();

    scheme = {
        "addScrollHandler" : addScrollHandler,
        "scrollPage" : scrollPage,
        "resizeHandler" : resizeHandler
    }
    return scheme;
});
