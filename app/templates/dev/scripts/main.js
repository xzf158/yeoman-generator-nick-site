define(['domReady!', "jquery", 'horn.ui/Picture', "analytics", "videoJs", "nanoscroll"], function(doc, $, Picture, Analytics) {
	var $pictures = $('.horn-picture'),
		$window = $(window),
		needLoad = 1,
		$loading = $("#loading"),
		$loadingProgress = $("#value"),
		$postWrapper = $("#post-wrapper"),
		$wrapper = $("#wrapper"),
		isPost = false,
		$body = $("body"),
		$postWrapperContent = $("#post-wrapper .content"),
		defaultTitle = document.title,
		loadedCount = 0;

	$loading.show();
	if (platform.isIE) {
		$body.addClass("isIE");
	}
	if (platform.isIE8) {
		$body.addClass("lt-ie9");
	}

	$window.on("TRACKING", function() {
		Analytics.trackEvent.apply(window, Array.prototype.slice.apply(arguments,[1]));
	});

	$("body").on("click", "a", function() {
		var $this = $(this);
		var path = $this.attr("data-tracking") ? $(this).attr("data-tracking") : $(this).attr("href").replace(/(http:\/\/|https:\/\/|[^A-Za-z0-9])/ig, "");
		var category = $this.attr("data-category") ? $(this).attr("data-category") : "external-link";
		$window.trigger("TRACKING", [category, "click", path]);
	});

	$(".post-footer").append($("footer").clone());
	$("#post-product").append($(".product-content").clone());
	$("#post-product").append($("#product .legal-copy").clone());
	$(".video-content").each(function(i) {
		$(this).attr("id", "video-" + i);
		videojs(this);
	});
	//videojs($this.attr("id"));
	// loadPostPage(checkIsComplete);
	if (location.hash.replace("#", "").length != 0) {
		needLoad++;
	}


	/*$(window).on('hashchange', function(e) {
		if (location.hash.replace("#", "").length == 0) {
			switchPage("index", 400);
			$(".description p").ellipsis();
			document.title = defaultTitle;
		} else {
			PostData.fillPostPage(location.hash.replace("#", ""));
			switchPage("post", 400);
			$(".description p").ellipsis();
			// $postWrapper.nanoScroller({
			// 	scroll: 'top'
			// });
			$postWrapperContent.animate({
				scrollTop: 0
			}, 400);
		}
	});*/

	Picture.options = {
		autoLoad: true,
		rendermode: platform.isIE9 ? 'img' : 'canvas'
	};

	if ($pictures.length !== 0) {
		Picture.sync();
		needLoad += Picture._instances.length, loadedCount = 0;
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
	} else {
		loadedCount = 0
		needLoad = 1;
		checkIsComplete();
	}

	function checkIsComplete() {
		loadedCount++;
		if (loadedCount === needLoad) {
			console.log("complete");
			$loadingProgress.html((loadedCount / needLoad * 100).toFixed(0) + "%");
			setTimeout(function() {
				loadingOut();
			}, 100);
		} else {
			$loadingProgress.html((loadedCount / needLoad * 100).toFixed(0) + "%");
		}
	}

	function loadingOut() {
		if (isPost) {
			PostData.fillPostPage();
			switchPage("post", 0);
		} else {
			switchPage("index", 0);
		}
		$(".nano").nanoScroller({
			iOSNativeScrolling: true
		});
		$loading.hide();
	}

	// function loadPostPage(cb) {
	// 	$.get("post.html").done(function(data) {
	// 		$(".post-wrapper .content").html(data);
	// 		cb();
	// 	}).fail(function() {
	// 		cb();
	// 	});
	// };

	/*function switchPage(page, t) {
		$("video").each(function() {
			if (!this.paused) {
				this.pause();
			}
		});
		if (platform.hasTouch) {
			if (page === "post") {
				$wrapper.css("transform", "translate3d(-100%,0,0)");
				$postWrapper.css("transform", "translate3d(0,0,0)").nanoScroller();
			} else {
				$postWrapper.css("transform", "translate3d(-100%,0,0)");
				$wrapper.css("transform", "translate3d(0,0,0)").nanoScroller();
			}
			return;
		} else if (platform.isIE8) {
			if (page === "post") {
				$wrapper.hide();
				$postWrapper.show().nanoScroller();
			} else {
				$postWrapper.hide();
				$wrapper.show().nanoScroller();
			}
			return;
		}
		if (page === "post") {
			if (t == 0) {
				$wrapper.css("opacity", 0).hide();
				$postWrapper.css("opacity", 1).show();
			} else {
				$wrapper.show().animate({
					"opacity": 0
				}, t, function() {
					$wrapper.hide();
				});
				$postWrapper.show().animate({
					"opacity": 1
				}, t, function() {
					$postWrapper.nanoScroller();
				});
			}
		} else {
			if (t == 0) {
				$wrapper.css("opacity", 1).show();
				$postWrapper.css("opacity", 0).hide();
			} else {
				$wrapper.show().animate({
					"opacity": 1
				}, t, function() {
					$wrapper.nanoScroller();
				});
				$postWrapper.show().animate({
					"opacity": 0
				}, t, function() {
					$postWrapper.hide();
				});
			}
		}
	};*/
});