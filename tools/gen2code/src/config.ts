
import path = require("path")

export const WORKSPACE = "../../../demo";
export const APP_DIR = "assets/Script/app";
export const GEN_CODE_DIR = "assets/Script/app/gen";

export function getFilePath(filename) {
    let outPath = path.join(__dirname, filename)
    return outPath
}

export function workspace():string {
    return getFilePath(WORKSPACE)
}
export function appDir():string {
    return path.join(workspace(), APP_DIR);
}
export function genDir():string {
    return path.join(workspace(), APP_DIR);
}