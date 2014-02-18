define(function () {
    var horn = {}, objs = {};
    horn.version = "0.4";
    horn.fetch = function (sign) {
        return objs[sign];
    };
    horn.register = function (sign, obj) {
        objs[sign] = obj;
        console
    };
    horn.inherit = function (sign, ascent) {
        if (typeof sign != "string") {
            ascent = sign;
            sign = null;
        }

        var extend = function (a, b) {
            for (var i in b) {
                if (a[i] === undefined) {
                    a[i] = b[i];
                }
            }
            return a;
        },
        process = function (descent) {
            var ascent = descent.ascent;
            if (ascent) {
                if (!ascent.processed) {
                    process(ascent);
                }
                extend(descent, ascent);
                for (var i in descent) {
                    if (typeof descent[i] == 'function') {
                        descent[i]._scheme = descent;
                        //                        descent[i]._ascent = ascent;
                        descent[i]._name = i;
                    }
                }
                if (descent.prototype) {
                    for (var i in descent.prototype) {
                        if (typeof descent.prototype[i] == 'function') {
                            descent.prototype[i]._scheme = descent;
                            //                            descent.prototype[i]._ascent = ascent;
                            descent.prototype[i]._name = i;
                        }
                    }
                }
            }
            if (descent.init && typeof descent.init == 'function') {
                descent.init.apply(descent);
            }
            descent.processed = true;
        };

        var descent = null;
        if (typeof ascent == 'function') {
            descent = function () {
                if (!descent.processed) {
                    process(descent);
                }
                if (descent.prototype.init) {
                    descent.prototype.init.apply(this, arguments);
                }
            };
            var proto = function () { };
            proto.prototype = ascent.prototype;
            descent.prototype = extend(new proto(), descent.prototype);
            descent.prototype.constructor = descent;
            descent.prototype.sign = sign;
            descent.prototype.ascent = ascent;
            descent.uber = ascent.prototype;
        } else {
            descent = {};
            extend(descent, ascent);
            //extend(descent.prototype, ascent.prototype);
        }

        if (sign != null && sign != "") objs[sign] = descent;

        descent.processed = false;
        descent.sign = sign;
        descent.ascent = ascent;
        //        descent.scheme = descent;
        return descent;
    };

    horn.properties = function (obj, props) {
        for (var i = 0, il = props.length; i < il; i++) {
            horn.property(obj, props[i]);
        }
        return obj;
    }
    horn.property = function (obj, prop) {
        if (typeof prop == 'string') {
            prop = { name: prop, getter: true, setter: true };
        }
        prop.getter = (prop.getter === undefined ? true : prop.getter);
        prop.setter = (prop.setter === undefined ? true : prop.setter);

        var propName = prop.name;

        var n = prop.name.charAt(0).toUpperCase() + prop.name.substr(1);
        var field = "_" + propName;
        obj[field] = prop.value;

        if (prop.getter) {
            var getfun = "get" + n;
            if (obj[getfun] === undefined) {
                obj[getfun] = function () {
                    return this[field];
                }
            }
            prop['get'] = function () {
                return this[getfun]();
            };
        }
        if (prop.setter) {
            var setfun = "set" + n;
            if (obj[setfun] === undefined) {
                obj[setfun] = function (value) {
                    this[field] = value;
                }
            }
            prop['set'] = function (value) {
                if (this[setfun] !== value) {
                    this[setfun](value);
                }
            };
        }
        delete prop.name, delete prop.getter, delete prop.setter, delete prop.value;
        try{
            Object.defineProperty(obj, propName, prop);
        } catch (e) {
            if (window.console && window.console.warn) {
                // window.console.warn("can not create property[name:" + propName + '], please use get set function instead!');
            }
        }
        return obj;
    };

    //http://www.alloyteam.com/2012/12/4304/
    horn.curry = function (fn) {
        var __args = [];
        return function () {
            if (arguments.length === 0) {
                fn.apply(this, __args);
                __args.length = 0;
            }
            [].push.apply(__args, arguments);
            return arguments.callee;
        }
    };
    //http://www.alloyteam.com/2012/11/javascript-throttle/#prettyPhoto
    horn.throttle = function (fn, delay, mustRunDelay) {
        var timer = null;
        var t_start;
        return function () {
            var context = this, args = arguments, t_curr = +new Date();
            clearTimeout(timer);
            if (!t_start) {
                t_start = t_curr;
            }
            if (t_curr - t_start >= mustRunDelay) {
                fn.apply(context, args);
                t_start = t_curr;
            }
            else {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }
        };
    };

    return window.horn = horn;
});