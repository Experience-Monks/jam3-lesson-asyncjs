# Promises

Promises are yet another way to handle asynchronous events. It was directly created to solve the issue of callback christmas trees.

In some way it resembles signals in that you instantiate a promise which will fire at a later time. A major difference however is that that one promise can handle success and failure events. Let's go back to our familiar image loader. We might have something like.

With Events:
```javascript
var EventEmitter = require('events').EventEmitter;

module.exports = function imageLoader(url) {

    var emitter = new EventEmitter();
    var image = new Image();

    image.onload = function() {
        emitter.emit('complete', image);
    };

    image.onerror = function() {
        emitter.emit('error', image);
    };

    image.src = url;

    return emitter;
};
```

With Callbacks:
```javascript
module.exports = function imageLoader(url, cb) {

    var image = new Image();

    image.onload = function() {
        cb(null, image);
    };

    image.onerror = function() {
        cb(new Error('There was an error while loading the image'));
    };

    image.src = url;
};
```

With Promises:
```javascript
var promise = require('bluebird');

module.exports = function imageLoader(url) {
    return new promise( function(resolve, reject) {
        var image = new Image();

        image.onload = function() {
            resolve(image);
        };

        image.onerror = function() {
            reject('There was an error while loading the image');
        };

        image.src = url;
    });
};
```

How you would actually use the above example which uses promises:
```javascript
var imageLoader = require('imageloader'); // not a real module but lets pretend

imageLoader(someURL)
.then( function(image) {
    console.log('YES THE IMAGE LOADED', image);
})
.catch( function(error) {
    console.log('OH OH THERE WAS AN ERROR', error);
});
```

Basically with promises you always say. "Do something" and "then do this" unless "catch this".

So you might be wondering how do Promises solve callback christmas trees? Well let's try to load some more images:

```javascript
var imageLoader = require('imageloader'); // not a real module but lets pretend

imageLoader(someURL)
.then( function(someImage) {
    document.body.appendChild(someImage);

    return imageLoader(someURL2);
})
.then( function(someImage2) {
    document.body.appendChild(someImage2);

    return someImage2;
})
.then( function(someImage2) {
    someImage2.style.left = '100px';
    
    return someImage2;
})
.catch( function(error) {
    console.log('OH OH THERE WAS AN ERROR', error);
});
```

As you can see we don't get that christmas tree effect which was mentioned in the [Node Style callbacks section](../2-Node%20style%20callbacks/).

In the above example you'll notice that we do:
```javascript
.then( function(someImage) {
    document.body.appendChild(someImage);

    return imageLoader(someImage2);
})
```

When a `.then` statement returns a promise, which is what the `imageLoader` function does, the next `.then` callback wont be fired until the returned promise resolves.

Later on we do:
```javascript
.then( function(someImage2) {
    document.body.appendChild(someImage2);

    return someImage2;
})
```

In this case obviously a promise is not returned by then `.then` callback but rather just an image. Since it's not a promise the value is simply passed to the next `.then` statement where we set the `left` css property. (there's really no reason to pass an image and set the style but it's here for example).

The `.catch` statement is interesting in that if any of the promises fail in the `.then` chain then the catch statement will be called and the `.then` chain will not proceed.

## Promises "memoize" values they return

Memoization is a design pattern where you store the previously calculated value. For instance:
```javascript
calculateOnce(); // 0.342
calculateOnce(); // 0.342

function calculateOnce() {

    if(this.value === undefined) {
        this.value = Math.random();
    }

    return this.value;
}
```

So if you look at the above example. `Math.random` is only calculated once and after that the stored/memoized value is used. You might want to use this design pattern when a calculation is heavy.

So if we used the example image loader like this:
```javascript
var imagePromise = imageLoader(someURL);

function doSomethingWithImage1(imagePromise) {

    imagePromise.then(function(image) {
        document.body.appendChild(image);

        doSomethingWithImage2(imagePromise);
    });
}

function doSomethingWithImage2(imagePromise) {
    imagePromise.then(function(image) {
        document.body.appendChild(image);
    });
}
```

You'd only have one image in `<body>` this is because the same image would just be appended twice and the `DOM` does not allow for duplicated elements. If the promise performed a load each time a new `<img>` would be placed on the `DOM` twice. It should also be noted if the image load failed the promise would ALWAYS also fail.

This memoization is something you could always write if using callbacks or events or even Signals but since you get it for free with promises it's a reason to choose promises over those other event systems.

## Promisifying

One nice thing about promises is modules like [`bluebird`](https://www.npmjs.com/package/bluebird) implement the ability to convert Node Style callbacks to promises.

Take the following from bluebird's document:
```javascript
var readFile = Promise.promisify(require("fs").readFile);

readFile("myfile.js", "utf8").then(function(contents) {
    return eval(contents);
}).then(function(result) {
    console.log("The result of evaluating myfile.js", result);
}).catch(SyntaxError, function(e) {
    console.log("File had syntax error", e);
//Catch any other error
}).catch(function(e) {
    console.log("Error reading file", e);
});
```

It takes Node's built in `readFile` function which is an asynchronous function which expects a Node Style callback and converts it to a function which will return a promise. Any method which expects a Node Style callbacks can be converted into a funtion which returns a promise.

## Chaining

Let's say you wanted to download a bunch of images you might do something like this:
```javascript
imageLoader('someURL.jpg')
.then( function(image) {
    document.body.appendChild(image);

    return imageLoader('someURL2.jpg');
})
.then( function(image) {
    document.body.appendChild(image);

    return imageLoader('someURL3.jpg');
})
.then( function(image) {

    document.body.appendChild(image);
})
```

But there's a better way to do this:
```javascript
var promise = require('bluebird');

var imageArray = ['someURL.jpg', 'someURL2.jpg', 'someURL3.jpg'];

var imageLoadedOnDOM = (imageArray).reduce( function(promise, currentURL) {

    return imageLoader(currentURL)
    .then( function(image) {
        document.body.appendChild(image);
    });
}, promise.resolve());
```

In the above example we're using [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) to create the promise chain. This makes it so you can load any list of images. Reduce accepts a callback function and an "initial value". We pass in a new promise which always resolves no matter what.

Of course since we'd be using the bluebird module we could do the following:
```javascript
var promise = require('bluebird');

var imageArray = ['someURL.jpg', 'someURL2.jpg', 'someURL3.jpg'];

promise.reduce(imageArray, function(previousURL, currentURL) {
    return imageLoader(currentURL)
});
```