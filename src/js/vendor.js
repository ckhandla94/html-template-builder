
window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js/dist/umd/popper.js'); 
require('bootstrap');


console.log(Popper);


require("owl.carousel");
window.WOW = WOW = require("wowjs").WOW;


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
