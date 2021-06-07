#!/bin/bash
echo "start $1 task"
node_modules/gulp/bin/gulp.js --gulpfile gulpfile.js $1
