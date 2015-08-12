var app = (function (exports) {
    
    var
        SELECTORS = {
            slideTabSelectors: '.tab-selectors',
            slideTabLink: '.tab__link',
            slidesContainer: '.slides-container',
            slide: '.slide',
        },
        
        CLASSES = {
            activeSlide: 'active',
            activeTabLink: 'active'
        },
        
        ATTRIBUTES = {
            slideIdClass: 'data-slide-id-class',
            slideIndex: 'data-slide-index'
        },
        
        DURATIONS = {
            slideInOrOut: 1.2
        },
        
        EASINGS = {
            slideInOrOut: Power4.easeInOut
        },
        
        slideTabSelectorsContainer = document.querySelector(SELECTORS.slideTabSelectors),
        
        slideTabSelectorLinks = 
            slideTabSelectorsContainer.querySelectorAll(SELECTORS.slideTabLink),
        
        slidesContainer = document.querySelector(SELECTORS.slidesContainer),
        slideElems = slidesContainer.querySelectorAll(SELECTORS.slide),
        
        
        
        
        masterTL,
        downWardTL,
        upwardTL,
        
        // Track the current and previous active classes
        previousActiveSlideClass,
        currentActiveSlideClass,
        
        // Keep a reference to the current active slide element so we can tween it        
        previousActiveSlideElem,
        currentActiveSlideElem;
        
    
    
    // TODO: See if these tweens aren't better off as from-to's
    function slideOutUp (slideElem) {        
        if (slideElem) {            
            TweenMax.fromTo(
                slideElem, 
                DURATIONS.slideInOrOut, 
                { y: '0%', opacity: 1 },
                { y: '-100%', opacity: 0, ease: EASINGS.slideInOrOut }
            );
        }
    }
    
    function slideOutDown (slideElem) {
        if (slideElem) {
            TweenMax.fromTo(
                slideElem, 
                DURATIONS.slideInOrOut, 
                { y: '0%', opacity: 1 },
                { y: '100%', opacity: 0 }
            );
        }
    }
    
    function slideInUp (slideElem) {
        if (slideElem) {
            TweenMax.fromTo(
                slideElem, 
                DURATIONS.slideInOrOut,
                { y: '100%', opacity: 0},
                { y: '0%', opacity: 1, ease: EASINGS.slideInOrOut }
            );
        }
    }
    
    function slideInDown (slideElem) {        
        if (slideElem) {            
            TweenMax.fromTo(
                slideElem, 
                DURATIONS.slideInOrOut, 
                { y: '-100%', opacity: 0 },
                { y: '0%', opacity: 1 }
            );
        }
    }
    
    
    function setActiveSlideTab (activeTabElem) {
        
        [].forEach.call(slideTabSelectorLinks, function (linkElem) {
            linkElem.parentNode.classList.remove(CLASSES.activeTabLink);
            linkElem.classList.remove(CLASSES.activeTabLink);
        });
        
        activeTabElem.parentNode.classList.add(CLASSES.activeTabLink);
        activeTabElem.classList.add(CLASSES.activeTabLink);
    }
    
    function setTabSelectorActiveClass(prevClass, newClass) {
        slideTabSelectorsContainer.classList.remove(prevClass);
        slideTabSelectorsContainer.classList.add(newClass);
    }
    
    

    function cancelDefaultEventBehavior(ev) {
        if ( ev.preventDefault && (typeof ev.preventDefault === 'function') ) {
            ev.preventDefault();    
        } else {
            ev.returnValue = false;
        }   
    }
    
    
    function handleSlideTabSelection (ev) {

        cancelDefaultEventBehavior(ev);
        
        // Only act if the tab selected is different from the active tab
        if (ev.target !== currentActiveSlideElem) {
            setActiveSlideTab(ev.target);
            syncActiveTabWithSlides(ev.target);       
        }
    }
    
    /**
     * Finds the currently selected slide's DOM element
     * @param   {String} slideIdClass the identifying class of the currently-selected element
     */
    function findSelectedSlideElem (slideIdClass) {
        
        var selectedElem;
        
        [].forEach.call(slideElems, function (slideElem) {                
                        
            if ( 
                (slideElem.getAttribute(ATTRIBUTES.slideIdClass)) &&
                (slideElem.getAttribute(ATTRIBUTES.slideIdClass) === slideIdClass) 
            ) {
                selectedElem = slideElem;
            }            
        });
        return selectedElem;
    }
    
    
    function setSlideActiveClass (activeSlideElem) {
        [].forEach.call(slideElems, function (slideElem) {
            slideElem.classList.remove(CLASSES.activeSlide);            
        });
        
        activeSlideElem.classList.add(CLASSES.activeSlide);
    }
    
//    function updateBodySlideClass(prevClass, currentClass) {
//        document.body.classList.remove(prevClass);
//        document.body.classList.add(currentClass);
//    }
        
               
    function isNewSlideLower (prevActiveSlide, currentActiveSlide) {
                
        return (
            // If we don't have a previous, assume that new slide should enter from bottom
            !prevActiveSlide || 
            (
                parseInt(prevActiveSlide.getAttribute(ATTRIBUTES.slideIndex)) < 
                parseInt(currentActiveSlide.getAttribute(ATTRIBUTES.slideIndex))
            )
        );        
    }
    
    
    
    
    function animateToLowerSlide(previousActiveSlideElem, currentActiveSlideElem) {  
        
        
        slideOutUp(previousActiveSlideElem);
        slideInUp(currentActiveSlideElem);
    }
    
    function animateToHigherSlide (previousActiveSlideElem, currentActiveSlideElem) {
        slideOutDown(previousActiveSlideElem);
        slideInDown(currentActiveSlideElem);
    }
    
    
    
    
    
    function performSlideSwitchingAnimations (prevActiveSlideElem, newActiveSlideElem) {

        isNewSlideLower(prevActiveSlideElem, newActiveSlideElem) ? 
            animateToLowerSlide(prevActiveSlideElem, newActiveSlideElem) :
            animateToHigherSlide(prevActiveSlideElem, newActiveSlideElem);
    }

    
    /**
     * Using the currently selected tab element, update our body tracking of the current active slide class and
     * current active slide element, then finish by triggering the animation
     * to the new slide.
     */
    function syncActiveTabWithSlides (newSlideElem) {
        
        previousActiveSlideClass = currentActiveSlideClass;
        currentActiveSlideClass = newSlideElem.getAttribute(ATTRIBUTES.slideIdClass);                
        
        // Using the identifying class, find the element reference
        previousActiveSlideElem = currentActiveSlideElem;
        currentActiveSlideElem = findSelectedSlideElem(currentActiveSlideClass);
        
        setTabSelectorActiveClass(previousActiveSlideClass, currentActiveSlideClass);        
        performSlideSwitchingAnimations(previousActiveSlideElem, currentActiveSlideElem);
            
        //performSlideRemoval(previousActiveSlideClass, previousActiveSlideElem);                            
        //performSlideInsertion(currentActiveSlideClass, currentActiveSlideElem);
        
        setSlideActiveClass(currentActiveSlideElem);
                
    }
    
    
    function wireUpEventListenters () {
        
        /* tab-selectors */  
        slideTabSelectorsContainer
            .addEventListener('click', handleSlideTabSelection, false);
    }
    
    function init () {
        wireUpEventListenters();  
        
        var activeSlideTabElem = slideTabSelectorLinks.item(0);
        
        setActiveSlideTab(activeSlideTabElem);
        syncActiveTabWithSlides(activeSlideTabElem);                
    }

    return {
        init: init
    };
    
}(window));


window.addEventListener('DOMContentLoaded', app.init, false);