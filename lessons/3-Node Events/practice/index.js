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

    // the following will call the EventEmitter constructor on "this"
    EventEmitter.call(this);

    // put your loading code here
  };

  // Sets the prototype of imageLoader to be inheriting from EventEmitter.prototype
  imageLoader.prototype = Object.create(EventEmitter.prototype);

  return imageLoader;
};