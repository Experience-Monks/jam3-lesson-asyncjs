var Signal = require('signals');

module.exports = function(images) {

  // 1. Export a function which will return an Object
  // 2. This function should take an array of urls to images
  // 3. This object should have 3 signals:
  //    signalProgress - dispatches when one image loads
  //    signalError - dispatches when an image has failed to load
  //    signalComplete - dispatches when all images have been loaded or have failed
  // 4. These signals should always dispatch the following
  //    {
  //      image: image, // HTMLImageElement for the image which was loaded
  //      url: 'someImageUrl.jpg', // url to the image which was loaded
  //      percent: 0.75 // percent progress of the load
  //    }
  var numLoaded = 0;
  var loader = {
    signalProgress: new Signal(),
    signalError: new Signal(),
    signalComplete: new Signal()
  };
  var checkFinished = function(url, image, numLoaded, images) {

    if(numLoaded === images.length) {
      loader.signalComplete.dispatch(getEventDetails(url, image, numLoaded, images));
    }
  };

  images.forEach( function(url) {

    var image = new Image();

    image.onload = function() {
      numLoaded++;

      loader.signalProgress.dispatch(getEventDetails(url, image, numLoaded, images));

      checkFinished(url, image, numLoaded, images);
    };

    image.onerror = function() {
      numLoaded++;

      loader.signalError.dispatch(getEventDetails(url, image, numLoaded, images));

      checkFinished(url, image, numLoaded, images);
    };

    image.src = url;
  });

  return loader;
};

function getEventDetails(url, image, countLoaded, images) {

  return  {
    image: image,
    url: url,
    percent: countLoaded / images.length
  };
}