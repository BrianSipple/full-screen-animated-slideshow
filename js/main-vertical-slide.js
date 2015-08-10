var app = (function (exports) {
    
    var
        SELECTORS = {
            slideTabSelectors: '.tab-selectors'
        },
        
        DURATIONS = {
            
        },
        
        EASINGS = {
            
        },
        
        slideTabSelectorsContainer = document.querySelector(SELECTORS.slideTabSelectors),
        
        slideTabSelectors = 
            slideTabSelectorsContainer.querySelectorAll(SELECTORS.slideTabSelectors),
        
        
        
        
        masterTL,
        
        activeSlideElem = slideTabSelectors.item(0);
    
    
    
    
    
    function wireUpEventListenters () {
        
        [].forEach.call(slideTabSelectors, function (selectorElem) {           
            selectorElem.addEventListener(
               'click', handleSlideTabSelection.bind(selectorElem), false
           );
        });
    }
                    
    
    function init () {
        wireUpEventListenters();
    }
        
        
    

    
    return {
        init: init
    };
    
}(window));


window.addEventListener('DOMContentLoaded', app.init, false);