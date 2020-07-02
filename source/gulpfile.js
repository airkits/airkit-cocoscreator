"use strict"
const gulp = require("gulp")
const minify = require("gulp-minify")
const inject = require("gulp-inject-string")
const ts = require("gulp-typescript")
const tsProject = ts.createProject("tsconfig.json")

gulp.task("buildJs", () => {
    return tsProject
        .src()
        .pipe(tsProject())
        .js.pipe(inject.replace("var airkit;", ""))
        .pipe(inject.prepend("window.airkit = {};\n"))
        .pipe(inject.replace("var __extends", "window.__extends"))
        .pipe(
            minify({
                ext: {
                    min: ".min.js"
                }
            })
        )
        .pipe(gulp.dest("./bin"))
})

gulp.task("buildDts", ["buildJs"], () => {
    return tsProject
        .src()
        .pipe(tsProject())
        .dts.pipe(gulp.dest("./bin"))
})

gulp.task("copyJs", ["buildDts"], () => {
    return gulp.src("bin/*.js").pipe(gulp.dest("../test/bin/three/"))
})

gulp.task("build", ["copyJs"], () => {
    return gulp.src("bin/*.ts").pipe(gulp.dest("../test/libs/"))
})

gulp.task("copyTs", () => {
    return gulp.src("bin/airkit.d.ts").pipe(gulp.dest("../demo/assets/Script/lib"))
})

gulp.task("copy", ["copyTs"], () => {
    return gulp.src("bin/airkit.js").pipe(gulp.dest("../demo/assets/Script/lib"))
})