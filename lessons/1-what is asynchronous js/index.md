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

A click is essentially asynchronous code. You don't know when it's going to happen, but it's likely to happen, and it happens outside of the "main flow". What that basically means is that you might be calculating, parsing, or doing something else and then a user click happens and you react to it via an event.

Other type of assynchronous events could be:

1. Waiting for images or other assets to load
2. Anticipating the browser window to resize
3. Orientation changes in mobile
4. Loosing internet connection
5. etc.

Something that should be noted is that the above example is actually a bad way of implementing a click event. It should be done this way:
```javascript
var el = document.getElementById('#button');

el.addEventListener('click', function(ev) {
    alert("I've been clicked");
});
```

The reason why this is better vs `el.onclick` is that if you're using the `addEventListener` function you can have multiple functions being called when the same event fires for instance with:

```javascript
var el = document.getElementById('#button');

el.onclick = function(ev) {
    alert("I've been clicked 1");
};

el.onclick = function(ev) {
    alert("I've been clicked 2");
};
```

When the user clicks on `el` only `"I've been clicked 2"` would alert because the original event callback which was passed will be overwritten.

Now it's time for you to play around with Browser events. 

Open up your favourite code editor and edit `index.js` which sits inside the folder you just ran `jam3-lesson-assyncjs` at `1-what is assynchronous js/practice/index.js`.

After you have the `index.js` file open in your editor click on the practice link below.