var EventEmitter = require('events').EventEmitter;

module.exports = function() {

  // 1. Create and return prototypical class which extends Node's EventEmitter
  // 2. This constructor function should accept an array of images
  // 3. Preload these Images
  // 4. When an image has finished loading emit "progress"
  // 5. When an all images have finished loading emit "complete"
  // 6. If an image fails to load emit "error"
  // 7. All events should emit an Object in the following form
  //    {
  //      image: image, // HTMLImageElement for the image which was loaded
  //      url: 'someImageUrl.jpg', // url to the image which was loaded
  //      percent: 0.75 // percent progress of the load
  //    }
  
  var imageLoader = function(images) {

    // call the constructor
    EventEmitter.call(this);

    var _this = this;
    var numLoaded = 0;
    var checkComplete = function(url, image, numLoaded, images) {
      if(numLoaded === images.length) {

        _this.emit('complete', getEventDetails(url, image, numLoaded, images));          
      }
    };

    images.forEach( function(url) {

      var image = new Image();

      image.onload = function() {

        numLoaded++;

        _this.emit('progress', getEventDetails(url, image, numLoaded, images));

        checkComplete(url, image, numLoaded, images);
      };

      image.onerror = function() {

        numLoaded++;

        _this.emit('error', getEventDetails(url, image, numLoaded, images));

        checkComplete(url, image, numLoaded, images);
      };

      image.src = url;
    });
  };

  imageLoader.prototype = Object.create(EventEmitter.prototype);

  return imageLoader;
};

function getEventDetails(url, image, countLoaded, images) {

  return  {
    image: image,
    url: url,
    percent: countLoaded / images.length
  };
}