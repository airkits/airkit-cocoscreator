"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkSync = exports.walk = void 0;
const path = require("path");
var fs = require('fs-extra');
function walk(dir, needDir, recursive, callback) {
    fs.readdir(dir, function (err, files) {
        if (err)
            throw err;
        files.forEach(function (file) {
            var filepath = path.join(dir, file);
            fs.stat(filepath, function (err, stats) {
                if (stats.isDirectory()) {
                    if (recursive)
                        walk(filepath, needDir, recursive, callback);
                    if (needDir) {
                        callback(filepath, file, stats);
                    }
                }
                else if (stats.isFile()) {
                    if (!needDir) {
                        callback(filepath, file, stats);
                    }
                }
            });
        });
    });
}
exports.walk = walk;
function walkSync(dir, needDir, recursive, out) {
    let files = fs.readdirSync(dir);
    files.forEach(function (file) {
        var filepath = path.join(dir, file);
        let stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            if (recursive)
                walkSync(filepath, needDir, recursive, out);
            if (needDir) {
                out.push([filepath, file]);
            }
        }
        else if (stats.isFile()) {
            if (!needDir) {
                out.push([filepath, file]);
            }
        }
    });
}
exports.walkSync = walkSync;
