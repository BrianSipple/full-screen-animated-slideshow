var app = (function (exports) {
    
    var
        SELECTORS = {
            slideTabSelectors: '.tab-selectors',
            slideTabLink: '.tab__link',
            slidesContainer: '.slides-container',
            slide: '.slide',
            slideBackground: '.slide__background',
            slideHeading: '.slide__title',
            slideDescription: '.slide__description'
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
        
        isSlideAnimating = false,
        
        
        // Wire up DOM references that we'll use to respond to input
        slideTabSelectorsContainer = document.querySelector(SELECTORS.slideTabSelectors),
        
        slideTabSelectorLinks = 
            slideTabSelectorsContainer.querySelectorAll(SELECTORS.slideTabLink),
        
        slidesContainer = document.querySelector(SELECTORS.slidesContainer),
        slideElems = slidesContainer.querySelectorAll(SELECTORS.slide),
        
        // Initialize cache of DOM references to slide components that we'll be animating
        animatedSlideComponents = {
            backgroundFrom: undefined,
            backgroundTo: undefined,
            headingTo: undefined,
            headingFrom: undefined,            
            descriptionTo: undefined,
            descriptionFrom: undefined
        },
        
        
        masterTL,
        downWardTL,
        upwardTL,
        
        // Track the current and previous active classes
        previousActiveSlideClass,
        currentActiveSlideClass,
        
        // Keep a reference to the current active slide element so we can tween it        
        previousActiveSlideElem,
        currentActiveSlideElem;
        
    
    
        
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
        if (ev.target !== currentActiveSlideElem && !isSlideAnimating) {
            
            isSlideAnimating = true;
            
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
    
    
    
    function slideOutUp (slideElem) {        
        if (slideElem) {            
           return TweenMax.to(
                slideElem, 
                DURATIONS.slideInOrOut, 
                { x: '-100%', opacity: 0, ease: EASINGS.slideInOrOut, clearProps: 'all'}
            );
        }
    }
    
    function slideOutDown (slideElem) {
        if (slideElem) {
            return TweenMax.to(
                slideElem, 
                DURATIONS.slideInOrOut, 
                { x: '100%', opacity: 1, ease: EASINGS.slideInOrOut, clearProps: 'all' }
            );
        }
    }
    
    function slideSlideIntoView (slideElem) {
        if (slideElem) {
            return TweenMax.to(
                slideElem, 
                DURATIONS.slideInOrOut,
                { x: '0%', opacity: 1, ease: EASINGS.slideInOrOut }
            );
        }
    }

                   
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
    
    
    /**
     * Glide in the background element at a slower rate than the slide itself, which
     * will create a parralaxing effect.
     * 
     * "clearProps" ensures that the inline property alterations applied are removed once the 
     * new state is reached (i.e: styles default back to stylesheet rules)
     */
    function slowGlideBackgroundUpAndOut (elem) {
        return TweenMax.to(
            elem, 
            DURATIONS.slideInOrOut,
            { y: '30%', ease: EASINGS.slideInOrOut, clearProps: 'all' }
        );        
    }
    
    
    function slowGlideBackgroundInFromBottom (elem) {
        return TweenMax.from(
            elem,
            DURATIONS.slideInOrOut,
            {y: '-30%', ease: EASINGS.slideInOrOut, clearProps: 'all'}
        );        
    }
    
    
    function slowGlideBackgroundDownAndOut (elem) {
        return TweenMax.to(
            elem,
            DURATIONS.slideInOrOut,
            { y: '-30%', ease: EASINGS.slideInOrOut }
        );
    }
    
    function slowGlideBackgroundInFromTop (elem) {
        return TweenMax.from(
            elem,
            DURATIONS.slideInOrOut,
            { y: '30%', ease: EASINGS.slideInOrOut }
        );
    }
    
    function enableSlideAnimation () {
        isSlideAnimating = false;
    }
    
    function animateToLowerSlide(prevSlideElem, newSlideElem) { 
        
        console.log('Animating to lower slide');
        
        downWardTL = new TimelineMax({ onComplete: enableSlideAnimation });
        
        downWardTL.add(slideOutUp(prevSlideElem), '0');
        downWardTL.add(slideSlideIntoView(newSlideElem), '0');
        downWardTL.add(slowGlideBackgroundUpAndOut(animatedSlideComponents.backgroundFrom), '0');
        downWardTL.add(slowGlideBackgroundInFromBottom(animatedSlideComponents.backgroundTo), '0');
        
        downWardTL.from(
            animatedSlideComponents.headingTo,
            0.7,
            {autoAlpha: 0, y: 40, ease: EASINGS.slideInOrOut},
            '-=1'
        );
        
        downWardTL.from(
            animatedSlideComponents.descriptionTo,
            0.7,
            {autoAlpha: 0, y: 40, ease: EASINGS.slideInOrOut},
            '-=0.6'
        );
    }
    
    function animateToHigherSlide (prevSlideElem, newSlideElem) {
        
        console.log('Animating to higher slide');
        
        upwardTL = new TimelineMax({ onComplete: enableSlideAnimation });
        
        // Make sure we're animating from the top
        upwardTL.set(newSlideElem, {y: '-100%'});
        
        upwardTL.add(slideOutDown(prevSlideElem), '0');
        upwardTL.add(slideSlideIntoView(newSlideElem), '0');
        upwardTL.add(slowGlideBackgroundDownAndOut(animatedSlideComponents.backgroundFrom), '0');
        upwardTL.add(slowGlideBackgroundInFromTop(animatedSlideComponents.backgroundTo), '0');
        
        upwardTL.from(
            animatedSlideComponents.headingTo,
            0.7,
            {autoAlpha: 0, y: 40, ease: EASINGS.slideInOrOut},
            '-=1'
        );
        
        upwardTL.from(
            animatedSlideComponents.descriptionTo,
            0.7,
            {autoAlpha: 0, y: 40, ease: EASINGS.slideInOrOut},
            '-=0.6'
        );
    }
                
    
    function performSlideSwitchingAnimations (prevActiveSlideElem, newActiveSlideElem) {
        debugger;
        

        // Wire up references to the the individual slide components that we'll be animating
        animatedSlideComponents.headingTo = newActiveSlideElem.querySelector(SELECTORS.slideHeading);
        animatedSlideComponents.headingFrom = prevActiveSlideElem.querySelector(SELECTORS.slideHeading);

        animatedSlideComponents.descriptionTo = newActiveSlideElem.querySelector(SELECTORS.slideDescription);
        animatedSlideComponents.descriptionFrom = prevActiveSlideElem.querySelector(SELECTORS.slideDescription);

        animatedSlideComponents.backgroundTo = newActiveSlideElem.querySelector(SELECTORS.slideBackground);
        animatedSlideComponents.backgroundFrom = prevActiveSlideElem.querySelector(SELECTORS.slideBackground);


        isNewSlideLower(prevActiveSlideElem, newActiveSlideElem) ? 
            animateToLowerSlide(prevActiveSlideElem, newActiveSlideElem) :  
            animateToHigherSlide(prevActiveSlideElem, newActiveSlideElem);   
               
    }

    
    /**
     * Using the currently selected tab element, update our body tracking of the current active slide class and
     * current active slide element, then finish by triggering the animation
     * to the new slide.
     */
    function syncActiveTabWithSlides (newSlideTabElem) {
        
        previousActiveSlideClass = currentActiveSlideClass;
        currentActiveSlideClass = newSlideTabElem.getAttribute(ATTRIBUTES.slideIdClass);                
        
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
                
        /* 
         * Set initial class values and animate in the first slide
         */        
        currentActiveSlideElem = slideElems.item(0);
        currentActiveSlideClass = currentActiveSlideElem.getAttribute(ATTRIBUTES.slideIdClass);
                
        setActiveSlideTab(activeSlideTabElem);
        setTabSelectorActiveClass(null, currentActiveSlideClass); 
        slideSlideIntoView(currentActiveSlideElem);
        setSlideActiveClass(currentActiveSlideElem);
    }

    return {
        init: init
    };
    
}(window));


window.addEventListener('DOMContentLoaded', app.init, false);