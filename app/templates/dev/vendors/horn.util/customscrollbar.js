/**
 * @author Terry
 * @date 2013-07-09
 */

define(["jquery", "horn.util/screen", "horn.util/mousewheel", 'domReady!'], function($, Screen, Mousewheel) {
     //@formatter:off
    var scheme = {
        updateVthumbPosition : updateVthumbPosition
    },  customScrollerUsed = false, 
        isDraggingThumb = false,
        $scroller,
        $vthumb,
        vthumbDragIntervalId,
        scrollPageIntervalId,
        isThumbDragEffected = false,
        $window = $(window), 
        $document = $(document),
        $body = $("body"),
        vthumbHeight = -1,
        screen;
        
     //@formatter:on
    function _setupCustomScrollBar() {
        customScrollerUsed = true;
        isDraggingThumb = false;

        $body.addClass('state-custom-scroll-used');
        $scroller = $('<div id="page-scroller"><div id="page-scroll-vthumb"></div></div>').appendTo($body);
        $vthumb = $('#page-scroll-vthumb');
        vthumbHeight = $vthumb.height();
        $scroller.mousedown(function(e) {
            if (e.currentTarget == e.target) {
                var ratio = rangeRatio((e.clientY - vthumbHeight / 2) / (Screen.winHeight - vthumbHeight));
                Mousewheel.scrollPage(ratio);
            }
        });
        $vthumb.mousedown(function(e) {
            isDraggingThumb = true;
            var startTop = $vthumb.position().top;
            var startY = e.clientY, currentY = startY, previousY = startY;
            if (platform.isIE) {//for ie 8
                $document.on('mousemove', moveHandler);
                $document.one('mouseup', upHandler);
            } else {
                $window.on('mousemove', moveHandler);
                $window.one('mouseup', upHandler);
            }
            window.cancelAnimationFrame(scrollPageIntervalId);

            function update() {
                if (previousY != currentY) {
                    var top = startTop + (currentY - startY);
                    $vthumb.css('top', rangeVthumbScrollTop(top));
                    isThumbDragEffected = true;
                    Mousewheel.scrollPage(rangeRatio((currentY - vthumbHeight / 2) / (Screen.winHeight - vthumbHeight)));
                    previousY = currentY;
                }
                vthumbDragIntervalId = undefined;
            }

            function moveHandler(e) {
                currentY = e.clientY;
                //console.log('startTop:', startTop, '   startY:', startY, 'currentY:',e.clientY)
                if (vthumbDragIntervalId == undefined) {
                    vthumbDragIntervalId = window.requestAnimationFrame(update);
                }
                return false;
            };

            function upHandler(e) {
                if (platform.isIE) {
                    $document.off('mousemove', moveHandler);
                } else {
                    $window.off('mousemove', moveHandler);
                }
                isDraggingThumb = false;
                window.cancelAnimationFrame(vthumbDragIntervalId);
                vthumbDragIntervalId = undefined;
            };
            return false;
        });
    }

    function rangeVthumbScrollTop(scrollTop) {
        return Math.min(Math.max(0, scrollTop), Screen.winHeight - vthumbHeight);
    }

    function rangeRatio(ratio) {
        return Math.min(Math.max(0, ratio), 1);
    }

    function updateVthumbPosition(ratio) {
        if ($vthumb == null || isDraggingThumb)
            return;
        $vthumb.css({
            top : rangeVthumbScrollTop(ratio * (Screen.winHeight - vthumbHeight))
        });
    }

    function rangeVthumbScrollTop(scrollTop) {
        return Math.min(Math.max(0, scrollTop), Screen.winHeight - vthumbHeight);
    }
    
    function resizeHandler(_screen) {
        screen = _screen;
    }

    if (!platform.hasTouch) {
        _setupCustomScrollBar();
    }
    return scheme;
});
