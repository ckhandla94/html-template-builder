// require("./includes/circle-progress");
// require("./includes/jquery.barfiller");
// require("./includes/jquery.collapsible");
// require("./includes/jquery.countdown");
// require("./includes/jquery.countTo");
// require("./includes/swiper");
// require("./includes/custom");



$(document).ready(function(){
	var wow = new WOW(
	  {
	    boxClass:     'wow',      // animated element css class (default is wow)
	    animateClass: 'animated', // animation css class (default is animated)
	    offset:       0,          // distance to the element when triggering the animation (default is 0)
	    mobile:       true,       // trigger animations on mobile devices (default is true)
	    live:         true,       // act on asynchronously loaded content (default is true)
	    callback:     function(box) {
	      // the callback is fired every time an animation is started
	      // the argument that is passed in is the DOM node being animated
	    },
	    scrollContainer: null // optional scroll container selector, otherwise use window
	  }
	);
	wow.init();
})
