/**
 * @author Terry
 * @date 2013-07-09
 */

define(function() {
    var scheme = {
        init : function(options) {
            if (options.progress && typeof options.progress === "function") {
                progressCallBack = options.progress;
            }
            if (options.complete && typeof options.complete === "function") {
                completeCallback = options.complete;
            }
        },
        add : function(count) {
            count = count ? count : 1;
            total += count;
        },
        progress : function(count) {
            count = count ? count : 1;
            loaded += count;
            if (progressCallBack) {
                progressCallBack.call(this, Math.round(loaded / total * 100) / 100)
            }
            if (loaded === total) {
                if (completeCallback) {
                    //after all assets load, page need resize, delay 200ms make sure page resize complete
                    setTimeout(function() {
                        completeCallback.call();
                    }, 200);
                }
            }
        }
    }, total = 0, loaded = 0, completeCallback, progressCallBack;
    return scheme;
});
