"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveZip = exports.walkSync = exports.writeStringData = exports.writeCfgJSONData = exports.writeJSONData = void 0;
const path = require("path");
const fs = require("fs");
/**
 * 向文件写入JSON数据
 *
 * @export
 * @param {File} file 拖入的文件
 * @param {string} directory 要存储的文件路径
 * @param {*} data 数据
 * @returns {string}   存储成功返回文件路径<br/>
 *                     存储失败返回null
 */
function writeJSONData(fname, directory, data) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    if (fs.existsSync(directory)) {
        let stat = fs.statSync(directory);
        if (stat.isDirectory()) {
            let outpath = path.join(directory, fname + ".json");
            fs.writeFileSync(outpath, JSON.stringify(data));
            return outpath;
        }
    }
    return null;
}
exports.writeJSONData = writeJSONData;
function writeCfgJSONData(fname, cfgpath, data) {
    if (fs.existsSync(cfgpath)) {
        let datas = fs.readFileSync(cfgpath, "utf8");
        let cfgs = JSON.parse(datas);
        cfgs[fname] = data;
        fs.writeFileSync(cfgpath, JSON.stringify(cfgs));
        return cfgpath;
    }
    return null;
}
exports.writeCfgJSONData = writeCfgJSONData;
function writeStringData(fname, directory, data, suffix) {
    if (fs.existsSync(directory)) {
        let stat = fs.statSync(directory);
        if (stat.isDirectory()) {
            let outpath = path.join(directory, fname + suffix);
            fs.writeFileSync(outpath, data);
            return outpath;
        }
    }
    return null;
}
exports.writeStringData = writeStringData;
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
function saveZip(zip, dist) {
    // 压缩
    zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        // 写入磁盘
        fs.writeFile(dist, content, function (err) {
            if (!err) {
                // 是否删除源文件
            }
            else {
                console.log(dist + '压缩失败');
            }
        });
    });
}
exports.saveZip = saveZip;
