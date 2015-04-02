module.exports = function(button, onTestRollOver, onTestRollOut, onTestClick) {

	// This is where you'll code your first practice lesson
	// If you've clicked the practice link in the browser
	// you should see a button on screen that button is
	// passed in to this function above and is called `button`
	// 
	// You should do the following:
	// 1. Setup onTestRollOver to listen to button's 'mouseover' event
	// 2. Setup onTestClick to listen to button's 'click' event
	// 3. Remove onTestRollOut listener from button. It's bound to the 'mouseout' event.
	// 4. Go and click the button ;)
	
	button.addEventListener('mouseover', onTestRollOver);
	button.addEventListener('click', onTestClick);
	button.removeEventListener('mouseout', onTestRollOut);
};