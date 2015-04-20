var usersExport = require('usersExport');
var test = require('tape');
var browserLessons = require('browser-lessons/test-out');
var promise = require('bluebird');

test('5-Promises', function(t) {

  t.timeoutAfter(3000);

  promise.settle(['images/other.jpg', 'images/nujji.png'].map(usersExport.load))
  .then(function(images) {

    images.forEach(function(imagePromise) {
      var message;

      if(imagePromise.isFulfilled()) {

        if(imagePromise.value() instanceof HTMLImageElement) {
          t.ok(imagePromise.value().src.indexOf('images/nujji.png') !== -1, 'Loaded image url was correct');  

          message = document.createElement('h1');
          message.innerHTML = 'The following images were loaded';

          document.body.appendChild(message);
          document.body.appendChild(imagePromise.value());
        } else {
          t.fail('load should return an image when it resolves succesfully');
        }
      } else {
        t.equal(imagePromise.reason(), 'images/other.jpg', 'Failed image url was correct');
      }
    });
  })
  .then(function() {

    usersExport.loadMany(['images/other.jpg', 'images/nujji.png'])
    .then(function(images) {

      if(Array.isArray(images)) {

        if(images[ 1 ] instanceof HTMLImageElement) {
          document.body.appendChild(images[ 1 ]);
        }

        t.equal(images[ 0 ], null, 'loadMany should return null if the image did not load');
        t.ok(images[ 1 ] instanceof HTMLImageElement, 'when an image is loaded loadMany should return the html image element');  
        t.end();
      } else {
        t.fail('loadMany should return an array when it finishes');
        t.end();
      }
    });
  });
});