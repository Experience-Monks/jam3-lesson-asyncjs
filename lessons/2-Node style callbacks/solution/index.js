module.exports = function(imageURL1, imageURL2, callback) {

  // In the following practice file you should create two
  // new HTMLImageElement's
  // 
  // The first image you create should load the image at imageURL1
  // The second image should load the image at imageURL2
  // 
  // When the an image loads you should pass it back through the
  // node style callback passed to this function
  // 
  // If the image does not load properly you should return an error
  // the node style callback passed to this function. The message of 
  // the error should be the url which failed
  var image1 = new Image();
  var image2 = new Image();

  image1.onload = function() {
    callback(null, image1);
  };

  image1.onerror = function() {
    callback(new Error(image1.src));
  };

  image2.onload = function() {
    callback(null, image2);
  };

  image2.onerror = function() {
    callback(new Error(image2.src));
  };  

  image1.src = imageURL1;
  image2.src = imageURL2;
};