"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMCode = void 0;
const dust_1 = require("./dust");
const file_1 = require("./file");
const config_1 = require("./config");
function genMCode() {
    dust_1.loadDustTemplate('MImport');
    dust_1.loadDustTemplate('MFunc');
    dust_1.loadDustTemplate('M');
    let moduleItems = [];
    let out = [];
    file_1.walkSync(config_1.appDir() + "/module", true, false, out);
    out.forEach(file => {
        let str = file[1].toLowerCase();
        moduleItems.push({
            m: str,
            C: str.toUpperCase(),
            M: str.charAt(0).toUpperCase() + str.slice(1)
        });
    });
    dust_1.renderM(config_1.genDir(), moduleItems);
}
exports.genMCode = genMCode;
