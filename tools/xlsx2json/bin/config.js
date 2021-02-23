"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeDir = exports.GEN_CODE_DIR = exports.srcDir = exports.distDir = exports.workspace = exports.getFilePath = exports.CONFIG_SRC_DIR = exports.APP_DIST_DIR = exports.WORKSPACE = void 0;
const path = require("path");
exports.WORKSPACE = "../../../demo";
exports.APP_DIST_DIR = "assets/resources/config";
exports.CONFIG_SRC_DIR = "../data/client";
function getFilePath(filename) {
    let outPath = path.join(__dirname, filename);
    return outPath;
}
exports.getFilePath = getFilePath;
function workspace() {
    return getFilePath(exports.WORKSPACE);
}
exports.workspace = workspace;
function distDir(filename) {
    return path.join(workspace(), exports.APP_DIST_DIR, filename);
}
exports.distDir = distDir;
function srcDir() {
    return getFilePath(exports.CONFIG_SRC_DIR);
}
exports.srcDir = srcDir;
exports.GEN_CODE_DIR = "assets/Script/game/gen/data";
function codeDir(file) {
    return path.join(workspace(), exports.GEN_CODE_DIR, file);
}
exports.codeDir = codeDir;
