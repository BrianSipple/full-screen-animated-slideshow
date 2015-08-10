// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any helper plugins in here......

// Optional application namespace for bundling all exported modules, which
// would allow us to pass our application object into that wrapper function as a parameter
// called exports...
//var BS = {};

(function (exports) {

    (function (exports) {

        // Object.create polyfill (useful for prototyping objects with shared state)
        if (!Object.create) {
            Object.create = function (obj) {
                if (arguments.length > 1) {
                    throw new Error(
                        'Object.create implementation only accepts the first ' +
                        'parameter.'
                    );
                }

                function F() {
                }

                F.prototype = obj;

                return new F();
            };
        }

        if (!Function.prototype.softBind) {
            Function.prototype.softBind = function (obj) {

                var fn = this,
                    curried = [].slice.call(arguments, 1),
                    bound = function bound () {
                        return fn.apply(
                            (!this ||
                                (typeof window !== 'undefined' &&
                                    this === window) ||
                                (typeof global !== 'undefined' &&
                                    this === global)
                            ) ? obj : this,
                            curried.concat.apply( curried, arguments )
                        );
                    };

                bound.prototype = Object.create( fn.prototype );
                return bound;
            };
        }
        
        
        /**
         * Object Cloning mixin helper
         * Usefull for prototying objects with non-shared state
         */
        exports.compose = function compose (targetObj) {
          
            var 
                // ECMAScript 5+ supported! -- we can clone property
                // descriptions as well
                isDescriptorCloningEnbled = !! (Object.getOwnPropertyDescriptor),  
                objects = [].slice.call(arguments, 1),
                currentObj;
                           
            // Iterate through each object passed in after "targetObj", cloning
            // its properties to "targetObj"            
            if (objects.length) {
                
                for (var i = 0, l = objects.length; i < l; i++) {
                    currentObj = objects[i];
                                        
                    if (isDescriptorCloningEnbled) {
                        
                        // NOTE: Keep in mind that Object.keys() returns only
                        // enumerable properties. If we want to also copy
                        // over nonenumerable properties, we can use
                        // Object.getOwnPropertyNames() instead.                        
                        var descriptor;
                        Object.keys(currentObj).forEach(function (prop) {
                            descriptor = Object
                                .getOwnPropertyDescriptor(currentObj, prop);
                            
                            Object.defineProperty(targetObj, prop, descriptor);
                        });
                        
                    } else {
                        // fallback to cloning properties only
                        for (var prop in currentObj) {
                            if (currentObj.hasOwnProperty(prop)) {
                                targetObj[prop] = currentObj[prop];
                            }
                        }
                    }
                }              
            }
            return targetObj;            
        };

    }((typeof exports === 'undefined') ? window : exports));

}(/*BS*/));
