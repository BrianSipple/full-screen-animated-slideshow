(function (exports) {

    var 
        docRoot = document.documentElement,
        dummyElement = document.createElement('div'),
        api = {};


    /**
     * Performs feature detection for a property, then
     * adds it to the roo documentElement a la Modernizr
     */
    api.testStylePropSupport = function testStylePropSupport (property) {

        if (property in docRoot.style) {
            docRoot.classList.add(property.toLowerCase());
            return true;
        } else {
            docRoot.classList.add('no-' + property.toLowerCase());
            return false;
        }
    };

    /**
     * Perform feature detection for style property values by setting
     * attaching the property to a dummy element, setting it to the value under test,
     * then checking so see whether the browser retained the value.
     */
    api.testStyleValueSupport = function testStyleValueSupport (id, prop, value) {

        dummyElement.style[prop] = value;

        if (dummyElement.style[prop]) {
            docRoot.classList.add(id);
            return true;
        }

        docRoot.classList.add('no-' + id);
        return false;
    };


    /**
     * Set the filter property for an element, accounting for both
     * 'webkitFilter' and 'filter'
     */
    api.setFilter = function setFilter (path, elem) {
        elem.style.filter = path;
        elem.style.webkitFilter = path;
    };
    
    
    
    // TODO: CURRY THESE!!!!
    api.getPsuedoClassVal = function getPsuedoClassVal(elem, psuedoClass, prop) {
        return window.getComputedStyle(elem, psuedoClass).getPropertyValue(prop);
    };
    
    api.getPseudoAfterVal = function getPseudoAfterVal(elem, prop) {
        return api.getPsuedoClassVal(elem, ':after', prop);
    };
    
    api.getPseudoBeforeVal = function getPseudoBeforeVal(elem, prop) {
        return api.getPsuedoClassVal(elem, ':before', prop);
    }




    compose(exports, api);

}(typeof exports === 'undefined' ? window : exports));



