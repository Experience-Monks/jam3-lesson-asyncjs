# Node Events

In the first part of this lesson we briefly saw how the DOM implements it's event system. Node's event system is designed in a very similar way with key's and listeners. The difference between Node's event system and the dom's event systen is that it's easier to implement and has more features. Something that should be noted even though this is Node's event system it can be used in Browser using a build system such as [Browserify](http://browserify.org/).

Node's event system is based on [EventEmitter](https://nodejs.org/api/events.html). There are two ways to use EventEmitter.

## Instantiating EventEmitter
The first way is to just simply instantiate an [EventEmitter](https://nodejs.org/api/events.html):

Let's create an image loader which emits progress events and an event when loading is complete:
```javascript
var EventEmitter = require('events').EventEmitter;

module.exports = getLoader;

function getLoader(images) {
    var countLoaded = 0;
    var emitter = new EventEmitter();

    images.forEach( function(image) {

        image.onload = function() {

            countLoaded++;
            emitter.emit('progress', countLoaded / images.length);

            if(countLoaded === images.length) {
                emitter.emit('complete', 1);
            }
        };
    });

    return emitter;
}
```
So in the above example an Array of HTMLImageElement's is passed and a callback is added to the images onload property. Once this callback is fired we increment the number of images loaded and distpatch/emit the event. Whoever is listening to the event will receive it. Let's look at how to "listen" for events.

To use the above example you could do something like this:
```javascript
var info = getLoader(images)

info.on('progress', function(percentage) {
  console.log(percentage * 100 + '% of images loaded');
})
.on('complete', function(percentage) {
  console.log('all images loaded');
});
```

So from the above two examples you may have noticed that a string or key is always associated to a listener/callbacks. When `emitter.emit('progress'` is called then whoever is listening to it via `emitter.on('progress'` will receive it.

You'll notice that we're emitting the percentage value when emit is called. You can emit more than one property via Node's EventEmitter. This feature can be handy sometime. For instance in our case we could emit the url of the image that was loaded and then the image itself.

## Extending EventEmitter

The second way in which you can use EventEmitter is to "extend" EventEmitter. It would look something like this.
```javascript
var EventEmitter = require('events').EventEmitter;

module.exports = Loader;

function Loader(images) {

  // the following will allow for our loader
  // to be instantiated via the new keyword 
  // or by calling as a function
  if(!(this instanceof Loader)) {
    return new Loader(images);
  }

  EventEmitter.call(this);

  this.countLoaded = 0;
  this.images = images || [];
}

Loader.prototype = Object.create(EventEmitter.prototype);

Loader.prototype.addImage = function(image) {
  var _this = this;

  this.images.push(image);

  image.onload = function() {
    _this.countLoaded++;

    _this.emit('progress', _this.countLoaded / _this.images.length);

    if(_this.countLoaded === _this.images.length) {
      _this.emit('complete', 1);
    }
  };
};
```

## Other useful methods on EventEmitter

We've see then the `emit` and `on` methods of `EventEmitter`. Here are a few more useful functions:

### `once`

`once` is equivalent to the `on` method but it's listener will only be called once and only once.

### `removeListener`

You will use `removeListener` to remove a listener it's structured the exact same way as `on`: `removeListener(event, listener)`

### `removeAllListeners`

`removeAllListeners` is very handy but can also be very desctructive. Calling `removeAllListeners` without any parameters will remove all event listeners. For instance with our image loader example it would remove both `'progress'` and `'complete'`. This can be very dangerous because you may not realize or you may expect one listener to still be there. It's better to pass in a parameter such as `emitter.removeAllListeners('progress')` to just remove all listeners of that type.

## Callbacks vs Events

In the previous part we learned about callbacks vs events. You will most likely see callbacks being used more often than events as it's

1. Easier to implement (less verbose)
2. Does not require an extra library

So why use Event's at all? 

1. Multiple Listeners
2. Cancelling Events
3. Readability

## Multiple Listeners

Having the ability to add multiple listeners instead of a single callback is one of the most important distinctions between events and callbacks.

To have multiple listeners initiated from a callback is a lot of work:
```javascript
var otherListeners = [ function() {}, function() {}];

loadImages(images, function() {
  otherListeners.forEach( function(listener) {
    listener();
  });
});
```

The equivalent with events would be:
```javascript
var otherListeners = [ function() {}, function() {}];

otherListeners.forEach( function(listener) {
  loader.on('complete', listener);
});
```

Now granted the only real difference with the above examples is that with events the code is more readable/cleaner however if all `otherListeners` were in another scope the callback code would quickly become very complex. For instance you might need to do something like:

```javascript
var otherListeners = [];

loadImages(images, function() {
  otherListeners.forEach( function(listener) {
    listener();
  });
});

module.exports = {
  loadImages: loadImages,
  addListener: function(listener) {
    otherListeners.push(listener);
  }
};
```

By doing the above you've actually written how EventEmitter works internally. The issue with this is you've done more work than you needed and it's harder for other developers to read through your code.

## Cancelling Events

Event's can be "removed". This might be very important in some cases. For instance if you wanted to not "do something" after all images have loaded with callbacks you may do something like this: 
```javascript
var shouldDoSomething = true;

loadImages(images, function() {
  // will block "doing something"
  if(shouldDoSomething) {
    doSomething();
  }
});
```
This produces very bad error prone code. In this case it's much better to use events:
```javascript
var loader = new Loader(images);
loader.on('complete', doSomething);

//then when you remove the listener
loader.removeEventListener('complete', doSomething);
```

## Readability

Another reason why use events over callbacks is that event's produce more readable code:

```javascript
loadImages(images, function() {});

loadImages(images)
.on('complete', function() {});
```

In the above example you know exactly that the event `'complete'` will fire once images have loaded. In the callback example you don't know the callback will be called on progress or once the load has completed.