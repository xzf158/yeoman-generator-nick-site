define(['domReady!', 'jquery'], function() {
    var $html = $("html");

    if (platform.isIE) {
        $html.addClass("isIE");
    }
    if (platform.isIE8) {
        $html.addClass("lt-ie9");
    }
    if (platform.isIE8) {
        $html.addClass("lt-ie9");
    }
    if (platform.isMobile) {
        $html.addClass("mobile");
    }
    if (!platform.hasTouch) {
        $html.addClass("no-touch");
    } else {
        $html.addClass("has-touch");
    }
    if (platform.isTablet) {
        $html.addClass("tablet");
    }
    if (platform.isAndroid) {
        $html.addClass("android");
    }
    if (platform.isWebkit) {
		$html.addClass("webkit");
	}
	if(platform.isMac){
		$html.addClass("mac");
	}
});