define(['jquery', 'horn.ui/Picture', 'domReady!'], function($, Picture) {
    var scheme = {
	        LOAD_PROGRESS: "LoadProgress",
	        LOAD_COMPLETED: "LoadCompleted"
	    },
        $window = $(window),
        $pictures = $('.horn-picture'),
        needLoad = 0,
        loaded = 0;
    /*
	EventName: LoadProgress, Parameter: progress
	EventName: LoadComplete
	*/
    scheme.load = function() {
        Picture.options = {
            autoLoad: true,
            rendermode: platform.isIE ? 'img' : 'canvas'
        };
        if ($pictures.length !== 0) {
            Picture.sync();
            needLoad += Picture._instances.length;
            for (var i = 0, il = Picture._instances.length; i < il; i++) {
                var pic = Picture._instances[i];
                if (pic._loaded) {
                    checkIsComplete();
                } else {
                    $(pic).on('loaded error', function() {
                        checkIsComplete();
                    });
                }
            }
        } else if(needLoad === 0){
            loaded = 0
            needLoad = 1;
            checkIsComplete();
        }
    };

    scheme.addAssets = function(count) {
        if (count == undefined) {
            count = 1;
        }
        needLoad += count;
        return scheme;
    };

    scheme.assetLoaded = checkIsComplete;

    function checkIsComplete() {
        loaded++;
        $window.trigger($.Event(scheme.LOAD_PROGRESS, {
            "progress": parseInt((loaded / needLoad * 100).toFixed(0))
        }));
        if (loaded === needLoad) {
            $window.trigger(scheme.LOAD_COMPLETED);
        }
    }
    return scheme;
});