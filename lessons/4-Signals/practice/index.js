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
  
};