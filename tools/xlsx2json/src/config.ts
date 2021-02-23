
import path = require("path")

export const WORKSPACE = "../../../demo";
export const APP_DIST_DIR = "assets/resources/config";
export const CONFIG_SRC_DIR = "../data/client"
export function getFilePath(filename) {
    let outPath = path.join(__dirname, filename)
    return outPath
}

export function workspace():string {
    return getFilePath(WORKSPACE)
}
export function distDir(filename:string):string {
    return path.join(workspace(), APP_DIST_DIR,filename);
}

export function srcDir():string {
    return getFilePath(CONFIG_SRC_DIR)
}

export const GEN_CODE_DIR = "assets/Script/game/gen/data";


export function codeDir(file:string):string {
    return path.join(workspace(), GEN_CODE_DIR,file);
}