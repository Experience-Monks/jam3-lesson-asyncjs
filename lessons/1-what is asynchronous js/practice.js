var usersExport = require('usersExport');
var test = require('tape');
var browserLessons = require('browser-lessons/test-out');

var button = document.createElement('button');
button.innerHTML = 'Don\'t worry you dont have to touch me';
button.style.position = 'absolute';
button.style.marginLeft = '-100px';
button.style.marginTop = '-20px';
button.style.left = '50%';
button.style.top = '50%';
button.style.width = '200px';
button.style.height = '40px';
document.body.appendChild(button);

test('Added and removed events', function(t) {

	var didRollOver = false;
	var didRollOut = false;
	var didClick = false;

	var onTestRollOver = function() {
		didRollOver = true;	
	};

	var onTestRollOut = function() {
		didRollOut = true;
	};

	var onTestClick = function() {
		didClick = true;
	};

	usersExport(button, onTestRollOver, onTestRollOut, onTestClick);

	button.dispatchEvent(new MouseEvent('mouseover'));
	button.dispatchEvent(new MouseEvent('click'));
	button.dispatchEvent(new MouseEvent('mouseout'));

	if(didRollOver) {
		

		if(button.onmouseover == onTestRollOver) {
			t.fail('event listener was added through onmouseover instead of addEventListener');
		} else {
			t.pass('added onTestRollOver to "mouseover"');
		}
	} else {
		t.fail('you should add onTestRollOver to "mouseover"');	
	}

	if(didClick) {
		if(button.onclick == onTestRollOver) {
			t.fail('event listener was added through onclick instead of addEventListener');
		} else {
			t.pass('added onTestClick to "click"');		
		}
	} else {
		t.fail('you should add onTestClick to "click"');	
	}

	if(didRollOut) {
		t.fail('you should remove onTestRollOut to "mouseout"');
	} else {
		t.pass('removed onTestRollOut from "mouseout"');
	}

	t.end();
});