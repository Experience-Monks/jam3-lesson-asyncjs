# Signals

Signals are not "standard" in the Javascript world however they are very powerful which is why it's important to mention them.

At Jam3 we occasionally use:
http://millermedeiros.github.io/js-signals/
On NPM:
https://www.npmjs.com/package/signals

Signals can almost be used as a replacement for a key listener event system.

Let's look at emitting events via Node Events:
```javascript
emitter.emit('complete', true);
```

with Signals the same would look like:
```javascript
signalComplete.dispatch(true);
```

Adding listeners with events:
```javascript
emitter.on('complete', function(isCompleted) {
    console.log('has completed', isCompleted);
});
```

With signals:
```javascript
signalComplete.add( function(isCompleted) {
    console.log('has completed', isCompleted);
});
```

As you can see events and signals are very similar.

As you might remember from the last lesson part on Node Event's we created a prototypical "class" whose prototype was based on Node's EventEmitter. You would NEVER do this with Signals.

The major difference between EventEmitter and Signal is that an EventEmitter will dispatch many events where one Signal is responsible for one Event.

## Signals over Events

Let's say we had an Object which emitted mouse events it might look something like this:
```javascript
var mouseThing = {
    signalMouseOver: new Signal(),
    signalMouseOut: new Signal(),
    signalMouseDown: new Signal()
};
```

One nice thing is let's say the author of this Object decides to remove `signalMouseOver` anyone depending on that Signal will receive a runtime error when running the code.

So for instance if `mouseThing` looked like this:
```javascript
var mouseThing = {
    signalMouseOut: new Signal(),
    signalMouseDown: new Signal()
};
```

And someone was using `mouseThing` like this: 
```javascript
mouseThing.signalMouseOver.add( function() {
    console.log('oh oh');
});
```

When this script runs you'd get a runtime error that `signalMouseOver` is undefined.

Compare this to events if simple the EventEmitter stops emitting an event no one will never know in scope outside of where that EventEmitter was created.

So in theory Signals are superior than Event's when working in teams because if developer A deletes the signals developer B will quickly realize it was deleted.

Here's a great post comparing Signals, Events, Callbacks and Promises:
http://blog.millermedeiros.com/callbacks-promises-signals-and-events/