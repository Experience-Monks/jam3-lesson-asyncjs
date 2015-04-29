# Node Style Callbacks

The second time you'll experience asynchronous code or the first time you'll be writing your own asynchronous code you'll probably experience a "callback".

Callbacks are functions you pass in as parameters to a function which will be called at a later time. In the previous lesson we learned about `onclick` this is actually a callback handler.

Using callbacks can look something like this:
```javascript
function loadImage(url, callback) {
  var image = new Image();

  image.onload = function() {
    callback(image);
  };

  image.onerror = function() {
    callback(null);
  };
}
```

In the above example when the `loadImage` function is called it will attempt to load an image from the `url` which was passed and when loading has finished it will call the callback and return the image. If loading fails then `null` will be returned instead.

This concept is something which you'll encounter over and over again in Javascript development. 

To showcase the power of callbacks lets say we wanted to load images and push them to an Array once they're finished we could do this:
```javascript
var imageArray = [];

loadImage('someImage1.jpg', imageArray.push.bind(imageArray));
loadImage('imageThatDoesntExist.jpg', imageArray.push.bind(imageArray));
```

In the above example what would happen is that `imageArray` would look like this once all image loads have resolved:
```javascript
[
  HTMLImageElement, // this would be someImage1.jpg
  null // this would be imageThatDoesntExist.jpg
]
```

One of the issues with callbacks is that you never know what it's going to return. For instance in our example we returned `null` but what if someone created a JSON loader that instead returned `false` or `undefined` or `0` when the load has failed. It would be annoying for the developer to handle all cases all the time.

## Node Convention: Error First Callbacks

To ensure that callbacks all work in a similar fashion the Node community has developed a convention which is called "Error First Callbacks" or "Node Style Callbacks".

If we take our `loadImage` example and refactor it to use node style callbacks it would look like this:
```javascript
function loadImage(url, callback) {
  var image = new Image();

  image.onload = function() {
    callback(null, image);
  };

  image.onerror = function() {
    callback(new Error('Could not load image'));
  };
}
```

So basically an `Error` object is returned if there's an issue while loading the image. If there were no issues then `null` followed by the `HTMLImageElement` is returned via the callback. 

Switching to node style callbacks has some advantages. For instance you can leverage and work with many modules from npm easier and developers you're working with will always know how your callbacks are implemented.

Typically when using Node Style callbacks your code would look like this:
```javascript
loadImage('someImage.jpg', function(err, image) {
  if(err) {
    throw err;
  }

  document.body.appendChild(image);
});
```
When using node style callbacks you should always check if an error was returned and hanlde it somehow. In this case we're throwing the `Error` which was returned. If you decide not to throw an `Error` but instead handle it another way ensure that you call `return`. For instance let's say if the image failed to load and we loaded a 404 images instead it would look like this:
```javascript
loadImage('someImage.jpg', function(err, image) {
  if(err) {
    loadImage('404.jpg', function(err, image) {
      if(err) {
        throw err;
      }

      document.body.appendChild(image);
    });

    return;
  }

  document.body.appendChild(image);
});
```

So it's a bit of a gotcha but if you didn't have the `return` statement what would happen is would start loading `'404.jpg'` and then try to add the broken image anyway. Speaking of gotchas.


## Gotchas

1. [The Christmas Tree](#the-christmas-tree)
2. [Returning A Lot](#returning-a-lot)
3. [Sometimes asynchronous callbacks](#sometimes-asynchronous-callbacks)

### The Christmas Tree

The Christmas tree as it's fondly been named is an effect that happens with your source code if using multiple callbacks. It looks like a Christmas tree:
```javascript
function load4Images(callback) {
  loadImage1( function(err, image1) {
    loadImage2( function(err, image2) {
      loadImage3( function(err, image3) {
        loadImage4( function(err, image4) {
          callback([image1, image2, image3, image4]);
        });
      });
    });
  });
}
```

This is obviously very annoying to read. There are a couple of ways to solve this issue.

#### Method 1: Structure Code Differently

```javascript
function loadImages(callback) {
  var intoArray = [];
  // do image loading
  intoArray.push(image); 
  loadImage2(intoArray, callback);
}

function loadImage2(intoArray, callback) {
  // do image loading
  intoArray.push(image); 
  loadImage2(intoArray, callback);
}

function loadImage3(intoArray, callback) {
  // do image loading
  intoArray.push(image); 
  loadImage2(intoArray, callback);
}

function loadImage4(intoArray, callback) {
  // do image loading
  intoArray.push(image); 
  callback(null, intoArray);
}
```

The above is obviously a lot more readable than the christmas tree.

#### Method 2: Use the Async Module

The Async Module [lives](https://www.npmjs.com/package/async) here and has many nice methods for dealing with asynchronous code. The above example could be changed to this:

```javascript
var async = require('async');

async.map(['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'], loadImage, function(err, intoArray) {

});

function loadImage(callback) {
  // do image loading
  if(image) {
    callback(null, image);  
  } else {
    callback(new Error('could not load image'));
  }
}
```

### Method 3: Promises

Promises will be discussed later on again. But here's how you would implement the example with promises with the simplest way possible. A better way will be discussed later:
```javascript
var promise = require('bluebird');

loadImages()
.then( function(images) {
  // do something all loaded images
});

function loadImages() {

  var allImages = [];

  return new promise( function(resolve, reject) {
    // do image loading for image1.jpg
    if(image) {
      allImages.push(image);
      resolve();
    } else {
      reject('Could not load image1');
    }
  })
  .then( function() {
    return new promise( function(resolve, reject) {
      // do image loading for image2.jpg
      if(image) {
        allImages.push(image);
        resolve();
      } else {
        reject('Could not load image2');
      }
    });
  })
  .then( function() {
    return new promise( function(resolve, reject) {
      // do image loading for image3.jpg
      if(image) {
        allImages.push(image);
        resolve();
      } else {
        reject('Could not load image3');
      }
    });
  })
  .then( function() {
    return new promise( function(resolve, reject) {
      // do image loading for image4.jpg
      if(image) {
        allImages.push(image);
        resolve(allImages);
      } else {
        reject('Could not load image4');
      }
    });
  });
}
```

### Returning A Lot

In the above section we showed a few solutions to fix the christmas tree. In one of those solutions we used the `async` module. In that example everything worked because we were returning one image in the callback after the `Error` our `null`. But if you had to return multiple parameters that example would break. Many modules have been writen that expect one data object to be returned and if you break this convention you can't use those modules.

Let's look at how it would look when you're breaking this convention:
```javascript
function loadTwoImages(callback) {
  // load two images
  callback(null, image1, image2);
}
```

If our callback was structured this way it's breaking general convention for Node Callbacks. This is more of a general convention and not something written in stone as some of Node's core modules break this convention but still you should fix the above to look something like this:
```javascript
function loadTwoImages(callback) {
  // load two images
  callback(null, {
    image1: image1,
    image2: image2
  });
}
```


### Sometimes Asynchronous Callbacks

This is a gotcha that can lead to a lot of headaches in debugging. Methods that use callbacks should be consistent: *always* asynchronous, or *always* synchronous.

Let's say we have this variation of our `loadImage` method that caches repeated loads:

```javascript
var cache = {};

function loadImage(url, callback) {
  if (url in cache) 
    return callback(null, cache[url]);

  var image = new Image();
  image.onload = function() {
    cache[url] = image;
    callback(null, image);
  };
  image.onerror = function() {
    callback(new Error('could not find image '+url))
  };
  image.src = url;
}
```

The above example can *sometimes* be synchronous (i.e. callback triggered immediately). This causes problems with stateful code like this:

```js
var count;
loadImage('image.png', function(err, image) {
  console.log('Count is', count);
})
count = 0;
```

The first time this is run, `loadImage` is asynchronous, so it will print:

```
Count is 0
```

However, the second time around, `loadImage` uses a cache and triggers the callback immediately; so it will print:

```
Count is undefined
```

To make the execution asynchronous you can use Node's [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback). This is implemented into Browserify so it also works on the frontend. It basically just ensures something will be run in the next frame of processing.

To fix our example we'd do the following:

```javascript
var cache = {};

function loadImage(url, callback) {
  if (url in cache) {
    return process.nextTick(function() {
      callback(null, cache[url]);
    });
  }

  var image = new Image();
  image.onload = function() {
    cache[url] = image;
    callback(null, image);
  };
  image.onerror = function() {
    callback(new Error('could not find image '+url))
  };
  image.src = url;
}
```

Now our `loadImage` method is consistent and *always* asynchronous. Go ahead and start working on `2-Node style callbacks/practice/index.js`. There you'll work on loading images and calling a callback.
