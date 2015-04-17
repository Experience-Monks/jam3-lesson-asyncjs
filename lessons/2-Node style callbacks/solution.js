var usersExport = require('usersExport');
var test = require('tape');
var browserLessons = require('browser-lessons/test-out');

var URL_PASS = 'images/nujji.png';
var URL_FAIL = 'images/mikko.png';

test('Node Style Callbacks', function(t) {

  t.plan(2);

  var idTimeout = setTimeout( function() {
    t.fail("It doesn't look like you called the callback for both images");
    t.end();
  }, 3000);

  usersExport(URL_PASS, URL_FAIL, callBack);

  function callBack(error, image) {
    
    if(error) {
      if(error.message.indexOf(URL_FAIL) > -1 ) {
        t.pass('imageURL1 returned an Error');
      } else {
        t.fail('imageURL1 should not have failed');
      }
    } else if(image.src.indexOf(URL_PASS)) {
      t.pass('imageURL1 loaded properly');
      document.body.appendChild(image);
    } else if(image.src.indexOf(URL_FAIL)) {
      t.fail('imageURL2 should have failed'); 
    } else if(image === undefined) {
      t.fail('One of the callbacks did not return an error or a url');
    }
  }
});