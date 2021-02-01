"use strict";
const gulp = require("gulp");
const minify = require("gulp-minify");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const inject = require("gulp-inject-string");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("buildJs", () => {
    return (
        tsProject
        .src()
        .pipe(tsProject())
        .js.pipe(inject.replace("var airkit;", ""))
        .pipe(
            inject.prepend(
                "window.airkit = {};\nwindow.ak = window.airkit;\n"
            )
        )
        .pipe(inject.replace("var __extends", "window.__extends"))
        //.pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(gulp.dest("./bin"))
    );
});
gulp.task("buildDebugJs", () => {
    return (
        tsProject
        .src()
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(tsProject())
        .js.pipe(inject.replace("var airkit;", ""))
        .pipe(
            inject.prepend(
                "window.airkit = {};\nwindow.ak = window.airkit;\n"
            )
        )
        .pipe(inject.replace("var __extends", "window.__extends"))
        //.pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(sourcemaps.write(".",{
            sourceRoot: __dirname,
          })) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest("./bin"))
    );
});
gulp.task("buildDts", () => {
    return tsProject
        .src()
        .pipe(tsProject())
        .dts.pipe(inject.append("import ak = airkit;"))
        .pipe(gulp.dest("./bin"));
});

gulp.task("copy", () => {
    return gulp.src("bin/**/*").pipe(gulp.dest("../demo/assets/Script/lib/"));
});

gulp.task(
    "build",
    gulp.series(
        gulp.parallel("buildJs"),
        gulp.parallel("buildDts"),
        gulp.parallel("copy")
    )
);

gulp.task(
    "debug",
    gulp.series(
        gulp.parallel("buildDebugJs"),
        gulp.parallel("buildDts"),
        gulp.parallel("copy")
    )
);