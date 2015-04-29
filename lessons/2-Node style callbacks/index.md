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

  image.src = url;
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

  image.src = url;
}
```

They have some specific characteristics:

- Your async `loadImage` method should take a `callback` as its last parameter
- If an error occurs, pass a new `Error` object to the first parametr (not a string!)
- If the operation succeeds, the first parameter must be `null`, and the second parameter contains the resolved data
- The `callback` is not called more than once

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
When using node style callbacks you should always check if an error was returned and handle it somehow. In this case we're throwing the `Error` which was returned. If you decide not to throw an `Error` but instead handle it another way ensure that you call `return`. For instance let's say if the image failed to load and we loaded a 404 images instead it would look like this:
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

The Async Module [lives here](https://www.npmjs.com/package/async) and has many nice methods for dealing with asynchronous code. Using our Node-style `loadImage` method, the above could be changed to this:

```javascript
var async = require('async');

var paths = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
async.map(paths, loadImage, function(err, images) {
  if (err) {
    console.error("Error loading an image", err);
    return;
  }

  console.log("Loaded images:", images);
});
```

### Method 3: Promises

Promises will be discussed in more detail shortly. With Promises and our earlier Node-style `loadImage`, the code can look like this:

```javascript
var Promise = require('bluebird');
var loadImageAsync = Promise.promisify(loadImage);

var paths = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];

Promise.all(paths.map(loadImageAsync))
  .then(function(images) {
    console.log("Loaded images: ", images)
  }, function(err) {
    console.error("Error loading an image", err)
  })
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
  callback(null, [ image1, image2 ]);
}
```


### Sometimes Asynchronous Callbacks

This is a big gotcha that might take a long time to debug. You're callbacks should ALWAYS be asynchronous. Let's take a slightly obscure example to show this issue:
```javascript
var a = 0;

laterSetAToBe1( function() {
  console.log('YAY a is 1');
});

if( a === 1) {
  throw new Error('a should never be 1 only after callback should it be 1');
}

function laterSetAToBe1(callback) {
  if(Math.random() > 0.5) {
    a = 1;
    callback(null);
  } else {
    setTimeout(function() {
      a = 1;
    }, 100);
  }
}
```

The above example is very obscure but it's there to prove the point. Callbacks should always be deferred or called later. In this case theres a 50% chance that an Error would be thrown. Since developers expect callbacks to be always processed at a later time you might write code inadvertedly which may cause bugs. 

In this example we wrote code as if we were expecting `a` to be `1` at a later time. But clearly that would happen only 50% of the time.

To make your callbacks always be deffered you can use node's [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback). [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback) is implemented into Browserify so it also works on the frontend. It basically just ensures something will be run in the next frame of processing.

To fix our obscure example we'd do the following:
```javascript
var a = 0;

laterSetAToBe1( function() {
  console.log('YAY a is 1');
});

if( a === 1) {
  throw new Error('a should never be 1 only after callback');
}

function laterSetAToBe1(callback) {
  if(Math.random() > 0.5) {
    a = 1;
    process.nextTick(callback.bind(undefined, null));
  } else {
    setTimeout(function() {
      a = 1;
    }, 100);
  }
}
```

Now the callback will always be called at later time. Go ahead and start working on `2-Node style callbacks/practice/index.js`. There you'll work on loading images and calling a callback.