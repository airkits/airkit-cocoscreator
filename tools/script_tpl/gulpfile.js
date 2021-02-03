"use strict";
const gulp = require("gulp");
const minify = require("gulp-minify");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const inject = require("gulp-inject-string");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("build", () => {
    return (
        tsProject
        .src()
        .pipe(tsProject())
        //.pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(gulp.dest("./bin"))
    );
});



gulp.task(
    "build"
);

