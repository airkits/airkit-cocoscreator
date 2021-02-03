import path = require("path");
import fs = require("fs");
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
export function writeJSONData(fname: string, directory: string, data: any): string {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
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


export function writeCfgJSONData(fname: string, cfgpath: string, data: any): string {
    if (fs.existsSync(cfgpath)) {
        let datas = fs.readFileSync(cfgpath, "utf8");
        let cfgs = JSON.parse(datas);
        cfgs[fname] = data
        fs.writeFileSync(cfgpath, JSON.stringify(cfgs));
        return cfgpath;
    }
    return null;
}

export function writeStringData(fname: string, directory: string, data: any, suffix: string): string {
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