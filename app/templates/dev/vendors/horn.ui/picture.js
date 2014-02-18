/// <reference path="../jquery/jquery-1.9.1.js" />

define(['horn', 'jquery', "horn.util/loadingprogress"], function(horn, $, Loadingprogress) {
    var scheme = horn.inherit("horn.ui.Picture", function() {
    });
    scheme.options = {
        autoLoad : true,
        rendermode : 'canvas'
    };
    scheme.cssClassName = 'horn-picture';
    scheme._instances = [];
    scheme.sync = function() {
        $('.' + scheme.cssClassName).each(function() {
            if (!scheme.get(this)) {
                new scheme(this);
            }
        });
    };
    scheme.clear = function() {
        for (var i = scheme._instances.length - 1; i >= 0; i--) {
            var instance = scheme._instances[i];
            if (instance.useless()) {
                scheme._instances.splice(i, 1);
                instance.dispose();
                instance = null;
            }
        }
    };
    scheme.get = function(element) {
        for (var i = 0, il = scheme._instances.length; i < il; i++) {
            var instance = scheme._instances[i];
            if (instance._element == element) {
                return instance;
            }
        }
        return null;
    };
    scheme.remove = function(instance) {
        var index = scheme._instances.indexOf(instance);
        if (index >= 0) {
            scheme._instances.splice(index, 1);
        }
    };

    var proto = scheme.prototype;
    horn.properties(proto, [{
        name : 'element',
        getter : true,
        setter : false
    }, {
        name : 'options',
        getter : true,
        setter : false
    }//,
    //{ name: 'loaded', getter: true, setter: false }
    ]);
    proto.init = function(element, options) {
        var instance = scheme.get(element);
        if (instance) {
            return instance;
        }
        scheme._instances.push(this);
        this._element = element;
        this._options = options;

        this.build(options);
    };
    proto.build = function(options) {
        var element = this._element;
        var $element = $(element).attr('data-built', true);
        options = this._options = $.extend({}, scheme.options, $element.data(), options);
        this._rendermode = options.rendermode;
        if (this._rendermode == 'canvas' && (Modernizr && !Modernizr.canvas)) {
            this._rendermode = 'img';
        }
        if (['absolute', 'relative'].indexOf($element.css('position')) < 0 && options.spinner) {
            $element.css('position', 'relative');
        }
        if (options.spinner) {
            $element.html('<div class="horn-spinner"><img src="' + options.spinner + '" alt="loading..." /></div>');
        }
        if (options.autoLoad) {
            this.load();
        }
    }
    proto._textureLoadHandler = function(img) {
        if (this._disposed) {
            return;
        }
        this._loaded = true;

        var $renderer = $(this._element).find('>.horn-renderer');
        if ($renderer.length > 0) {
            this._renderer = $renderer[0];
        } else {
            if (this._rendermode == 'img') {
                this._renderer = $('<img class="horn-renderer" style="visibility:hidden;" alt="">').prependTo(this._element)[0];
            } else if (this._rendermode == 'canvas') {
                this._renderer = $('<canvas class="horn-renderer">').prependTo(this._element)[0];
            }
        }

        $(this._element).attr('data-loaded', true).find('.horn-spinner').remove();
        if (this._texture.width > 0 && this._texture.height > 0) {
            $(this._renderer).attr({
                'data-stage-width' : this._texture.width,
                'data-stage-height' : this._texture.height
            });
        }
        if (this._rendermode == 'img') {
            $(this._renderer).css('visibility', '').attr('src', this._options.source);
        } else if (this._rendermode == 'canvas') {
            this._context = this._renderer.getContext('2d');
            this._renderer.width = this._texture.width;
            this._renderer.height = this._texture.height;
            this._context.drawImage(this._texture, 0, 0, this._texture.width, this._texture.height);
        }
        $(this).trigger('loaded');
    };
    proto.load = function() {
        var self = this;
        this._texture = $('<img>').one('load', function (e) {
        self._texture = this;//fix ie8 error
        self._textureLoadHandler.call(self, this);
        }).error(function () { $(self).trigger('error'); }).attr('src', self._options.source)[0];
        if (this._texture.complete && this._texture.readyState === 4) {
            this._textureLoadHandler.call(this, texture);
        }
    };
    proto.useless = function() {
        return !horn.ui.utils.isInDocument(this._element) || !$(this._element).hasClass(scheme.cssClassName)
    };
    proto.dispose = function() {
        this._disposed = true;
        $(this._element).removeAttr('data-loaded', 'data-built').html('');
        scheme.remove(this);
        $(this._texture).off();
        this._element = null;
        this._options = null;
        this._renderer = null;
        this._context = null;
    };
    return scheme;
}); 