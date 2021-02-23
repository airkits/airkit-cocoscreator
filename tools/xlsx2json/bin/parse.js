"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLine = exports.toHump = void 0;
// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}
exports.toHump = toHump;
// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}
exports.toLine = toLine;
