"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTable = exports.parseConfig = exports.isEmptyDic = exports.eDataType = exports.eCodeType = void 0;
const XLSX = require("xlsx");
const write_file_1 = require("./write_file");
var eCodeType;
(function (eCodeType) {
    eCodeType["BOTH"] = "both";
    eCodeType["CLIENT"] = "client";
    eCodeType["SERVER"] = "server";
})(eCodeType = exports.eCodeType || (exports.eCodeType = {}));
var eDataType;
(function (eDataType) {
    eDataType["INT"] = "int";
    eDataType["STRING"] = "string";
})(eDataType = exports.eDataType || (exports.eDataType = {}));
function isEmptyDic(dic) {
    if (dic == null)
        return true;
    for (let key in dic) {
        return false;
    }
    return true;
}
exports.isEmptyDic = isEmptyDic;
function parseConfig(wb) {
    let sheetName = "导出配置";
    let list = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
    //let len = list.length;
    list.shift();
    return list;
}
exports.parseConfig = parseConfig;
function parseTable(wb, sheetName) {
    let list = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
    if (list && list.length < 5) {
        console.error("table " + sheetName + "format error!");
        return null;
    }
    let types = list[1];
    let sides = list[3];
    let headers = list[4];
    let client = [];
    let server = [];
    let side = null;
    let header = null;
    let type = null;
    for (let i = 5; i < list.length; i++) {
        let row = list[i];
        let cellLen = row.length;
        let cData = {};
        let sData = {};
        for (let j = 0; j < cellLen; j++) {
            if (!sides[j] || !headers[j] || !types[j]) {
                continue;
            }
            side = sides[j].toLowerCase();
            type = types[j].toLowerCase();
            header = headers[j];
            let value = type == eDataType.INT ? +row[j] : row[j] + "";
            if (side == eCodeType.BOTH || side == eCodeType.CLIENT) {
                cData[header] = value;
            }
            if (side == eCodeType.BOTH || side == eCodeType.SERVER) {
                sData[header] = value;
            }
        }
        if (!isEmptyDic(cData)) {
            client.push(cData);
        }
        if (!isEmptyDic(sData)) {
            server.push(sData);
        }
    }
    return { Client: client, Server: server };
}
exports.parseTable = parseTable;
let wb = XLSX.readFile("excel/config.xlsx");
let confList = parseConfig(wb);
confList.forEach(element => {
    if (+element[2] == 1) {
        let data = parseTable(wb, element[0]);
        console.log(data);
        write_file_1.writeJSONData(element[1], "data/client", data.Client);
        write_file_1.writeJSONData(element[1], "data/server", data.Server);
    }
});
