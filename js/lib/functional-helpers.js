(function (exports) {
    
    var api = {};
   
    api.curry = function curry (fn) {
        
        if (fn) {
            
            var arity = fn.length;

            return function f1() {

                var args = [].slice.call(arguments, 0);

                if (args.length >= arity) {
                    return fn.apply(null, args);

                } else {
                    return function f2 () {
                        // Recursive partial application
                        var args2 = [].slice.call(arguments, 0);
                        return f1.apply(null, args.concat(args2));
                    };
                }            
            };            
        }
                
    };
    
    if (typeof compose !== 'undefined') {
        compose(exports, api);
    }
        
}(window));                                                                                     