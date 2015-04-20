var usersExport = require('usersExport');
var test = require('tape');
var browserLessons = require('browser-lessons/test-out');
var EventEmitter = require('events').EventEmitter;

test('3-Node Events', function(t) {

  t.timeoutAfter(3000);
  
  var loader = new usersExport(['images/other.jpg', 'images/nujji.png']);
  var numLoaded = 0;

  if(loader.signalProgress) {
    loader.signalProgress.add( function(info) {

      numLoaded++;

      checkInfo(t, 'signalProgress', info);

      t.equal(info.url, 'images/nujji.png', 'loaded image was correct');
      t.equal(info.percent, numLoaded / 2, 'percent loaded was correct');

      if(info.image && info.image instanceof HTMLImageElement) {
        var message = document.createElement('h1');
        message.innerHTML = 'Yay this image loaded:';

        document.body.appendChild(message);
        document.body.appendChild(info.image);
      }
    });
  } else {
    t.fail('Your image loader does not have signalProgress');
    t.end();
  }

  if(loader.signalComplete) {
    loader.signalComplete.add( function(info) {

      checkInfo(t, 'signalComplete', info);

      t.equal(info.percent, 1, 'percent loaded was correct');

      t.end();
    });
  } else {
    t.fail('Your image loader does not have signalComplete');
    t.end();
  }

  if(loader.signalError) {
    loader.signalError.add( function(info) {

      numLoaded++;
      
      checkInfo(t, 'signalError', info);

      t.equal(info.percent, numLoaded / 2, 'percent loaded was correct');
      t.equal(info.url, 'images/other.jpg', 'failing image was correct');
    });
  } else {
    t.fail('Your image loader does not have signalError');
    t.end();
  }
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