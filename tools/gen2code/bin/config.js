"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDir = exports.appDir = exports.workspace = exports.getFilePath = exports.GEN_CODE_DIR = exports.APP_DIR = exports.WORKSPACE = void 0;
const path = require("path");
exports.WORKSPACE = "../../../demo";
exports.APP_DIR = "assets/Script/app";
exports.GEN_CODE_DIR = "assets/Script/app/gen";
function getFilePath(filename) {
    let outPath = path.join(__dirname, filename);
    return outPath;
}
exports.getFilePath = getFilePath;
function workspace() {
    return getFilePath(exports.WORKSPACE);
}
exports.workspace = workspace;
function appDir() {
    return path.join(workspace(), exports.APP_DIR);
}
exports.appDir = appDir;
function genDir() {
    return path.join(workspace(), exports.GEN_CODE_DIR);
}
exports.genDir = genDir;
