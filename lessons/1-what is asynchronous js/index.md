# What is asynchronous Javascript

In computer programming, asynchronous events are those occurring independently of the main program flow. Asynchronous actions are actions executed in a non-blocking scheme, allowing the main program flow to continue processing.

That's directly quoting Wikipedia. That might be a bit verbose so lets look at what might be the first time you have to deal with asynchronous code:

```javascript
var el = document.getElementById('#button');

el.onclick = function(ev) {
    alert("I've been clicked 1");
};

el.onclick = function(ev) {
    alert("I've been clicked 2");
};
```

In the above example when a user presses the `#button` element `"I've been clicked 2"` will be alerted `"I've been clicked 1"` does not. 

A click is essentially asynchronous code. You don't know when it's going to happen, but it's likely to happen, and it happens outside of the "main flow". What that basically means is that you might be calculating, parsing, or doing something else and then a users click happens and you react to it via the event.

Other type of assynchronous events could be:

1. Waiting for images or other assets to load (which you'll see a lot of in this lesson)
2. Anticipating the browser window to resize
3. Orientation changes in mobile
4. Loosing internet connection
5. etc.

Something that should be noted is that the above example is actually a bad way of implementing a click event. Like we noted the first click handler never fires. It should be done this way instead:
```javascript
var el = document.getElementById('#button');

el.addEventListener('click', function(ev) {
    alert("I've been clicked 1");
});

el.addEventListener('click', function(ev) {
    alert("I've been clicked 2");
});
```

Both `onclick` and `addEventListener` bind events to listener functions however `addEventListener` is better vs `el.onclick` because there can be multiple listeners listening for the same event.

Open up your favourite code editor and edit `index.js` which sits inside the folder you just ran `jam3-lesson-assyncjs` in. The index file sits at `1-what is assynchronous js/practice/index.js`.

After you have the `index.js` file open in your editor click on the practice link below.