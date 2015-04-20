var usersExport = require('usersExport');
var test = require('tape');
var browserLessons = require('browser-lessons/test-out');
var EventEmitter = require('events').EventEmitter;

test('3-Node Events', function(t) {

  t.timeoutAfter(3000);

  var imageLoader = usersExport();
  var loader = new imageLoader(['images/other.jpg', 'images/nujji.png']);
  var numLoaded = 0;

  loader.on('progress', function(info) {

    numLoaded++;

    checkInfo(t, 'progress', info);

    t.equal(info.url, 'images/nujji.png', 'loaded image was correct');
    t.equal(info.percent, numLoaded / 2, 'percent loaded was correct');

    if(info.image && info.image instanceof HTMLImageElement) {
      var message = document.createElement('h1');
      message.innerHTML = 'Yay this image loaded:';

      document.body.appendChild(message);
      document.body.appendChild(info.image);
    }
  });

  loader.on('complete', function(info) {

    numLoaded++;

    checkInfo(t, 'complete', info);

    t.equal(info.percent, 1, 'percent loaded was correct');

    t.end();
  });

  loader.on('error', function(info) {

    numLoaded++;
    
    checkInfo(t, 'error', info);

    t.equal(info.percent, numLoaded / 2, 'percent loaded was correct');
    t.equal(info.url, 'images/other.jpg', 'failing image was correct');
  });

  t.ok(loader instanceof EventEmitter, 'Returned imageLoader is an instance of EventEmitter');
});

function checkInfo(t, eventName, info) {
  // image
  // url
  // percent
  
  if(info) {
    t.ok(info.image instanceof HTMLImageElement, '"' + eventName + '" event info image is an HTMLImageElement');
    t.ok(typeof info.url === 'string', '"' + eventName + '" event info url is a String');
    t.ok(typeof info.percent === 'number', '"' + eventName + '" event info url is a Number');  
  } else {
    t.fail(eventName + 'did not return an info object');
  }
}