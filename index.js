#!/usr/bin/env node

var browserLessons = require('browser-lessons');
var fs = require('fs');
var path = require('path');

browserLessons( {

	name: 'Jam3 Lesson: Asynchronous Javascript',
	description: fs.readFileSync(path.join(__dirname, 'description.md'), 'utf8'),
	pathLessons: path.join(__dirname, 'lessons')
});