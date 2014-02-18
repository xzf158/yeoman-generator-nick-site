define(['domReady!', "jquery", 'horn.ui/assetsLoader', "analytics", "smooth-mousewheel", "videoJs", "nanoscroll"], function(doc, $, AssetsLoader, Analytics, SmoothMousewheel) {
    var scheme = {};

    var $pictures = $('.horn-picture'),
        $window = $(window),
        $loading = $("#loading"),
        $loadingProgress = $("#value"),
        $body = $("body");
    
    scheme.init = function(){
    	initEvent();
    	assetsLoad();
    };

    function assetsLoad() {
        $loading.show();
        AssetsLoader.load();
        $window.trigger("TRACKING", ["/home/"]);
    };

    function assetsLoadCompleted() {
        $loading.remove();
        SmoothMousewheel.enable();
    };

    function initEvent() {
        $window.on("TRACKING", function() {
            Analytics.trackEvent.apply(window, Array.prototype.slice.apply(arguments, [1]));
        }).on(AssetsLoader.LOAD_PROGRESS, function(e) {
            $loadingProgress.html(e.progress + "%");
        }).on(SmoothMousewheel.SMOOTH_SCROLL, function (e){
        	console.log(e.scrollTop);
        });
        
        //init tracking
        $("body").on("click", "a, .tracking", function() {
            var $this = $(this);
            var path = $this.attr("data-tracking") ? $(this).attr("data-tracking") : "/" + $(this).attr("href").replace(/(http:\/\/|https:\/\/|[^A-Za-z0-9])/ig, "");
            if (path != "none") {
                $window.trigger("TRACKING", [path]);
            }
        });
    };

    return scheme;
});