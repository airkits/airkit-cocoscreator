import { exit } from 'process';
import * as XLSX from 'xlsx';
import { saveZip, writeJSONData } from './write_file';
import JSZip = require('jszip');
import fs = require("fs");
import { codeDir, distDir } from './config';
import { toHump } from './parse';

//const { read, utils: { sheet_to_json } } = XLSX;

// export function readFirstSheet(data: any, options: XLSX.ParsingOptions): any[][] {
//     const wb: XLSX.WorkBook = read(data, options);
//     const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
//     return sheet_to_json(ws, { header: 1, raw: true });
// }
// let data = readFirstSheet("a,b,c\n1,2,3\n4,5,6", { type: "binary" });
// console.log(data);
export interface ITableData {
    Client: any[];
    Server: any[];
    CT:{[key:string]:string[]};
    ST:{[key:string]:string[]};
}
export enum eCodeType {
    BOTH = "both",
    CLIENT = "client",
    SERVER = "server"
}
export enum eDataType {
    INT = "int",
    STRING = "string"
}

export function isEmptyDic(dic: Object): boolean {
    if (dic == null) return true;

    for (let key in dic) {
        return false;
    }
    return true;
}

export function parseConfig(wb: XLSX.WorkBook): any[] {
    let sheetName = "导出配置";
    let list = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
    list.shift();
    return list;
}
export function parseConfigTable(wb: XLSX.WorkBook, sheetName: string): ITableData {
    let list = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
    if (list && list.length < 5) {
        console.error("table " + sheetName + "format error!")
        return null;
    }
    let types = list[1];
    let names = list[2];
    let sides = list[3];
    let headers = list[4];

    let client = [];
    let server = [];
    let side = null;
    let header = null;
    let type = null;
    let ct = {};
    let st = {};
    for (let i = 5; i < list.length; i++) {
        let row = (<any[]>list[i]);
        let cellLen = row.length;
        let cData = {};
        let sData = {};
        
        
        for (let j = 0; j < cellLen; j++) {
            if (!sides[j] || !headers[j] || !types[j]) {
                continue;
            }
            side = (<string>sides[j]).toLowerCase();
            type = (<string>types[j]).toLowerCase();
            header = (<string>headers[j]);
            let value = type == eDataType.INT ? +row[j] : row[j] + ""
            if (side == eCodeType.BOTH || side == eCodeType.CLIENT) {
                cData[header] = value;
                ct[header] = [type == eDataType.INT ? "number" : "string",names[j]];
            }
            if (side == eCodeType.BOTH || side == eCodeType.SERVER) {
                sData[header] = value;
                st[header] = [type == eDataType.INT ? "number" : "string",names[j]];
            }
        }
        if (!isEmptyDic(cData)) {
            client.push(cData);
        }
        if (!isEmptyDic(sData)) {
            server.push(sData);
        }
    }
    return { Client: client, Server: server,CT:ct,ST:st };
}
let wb = XLSX.readFile("excel/config.xlsx");
let confList = parseConfig(wb);
var zip = new JSZip();
var interfaceContent = "";
confList.forEach(element => {
    if (+element[2] == 1) {
        let data = parseConfigTable(wb, element[0]);
        console.log(element);
        if(data.Client && data.Client.length > 0){
            writeJSONData(element[1], "data/client", data.Client);
            zip.file(element[1]+".json",JSON.stringify(data.Client));

            let name = element[1].charAt(0).toUpperCase() + toHump(element[1].slice(1))
            interfaceContent += `//${element[0]}\nexport interface C${name} {\n`;
            
            for(let k in data.CT){
                interfaceContent += `    ${k} : ${data.CT[k][0]} ;// ${data.CT[k][1]}\n`;
            }
            interfaceContent += "}; \n";
        }
        if(data.Server && data.Server.length > 0)
            writeJSONData(element[1], "data/server", data.Server);
        
    }
});
fs.writeFileSync(codeDir("config.ts"),interfaceContent);

wb = XLSX.readFile("excel/lang.xlsx");
confList = parseConfig(wb);

confList.forEach(element => {
    if (+element[2] == 1) {
        console.log(element);
    }
});
saveZip(zip,distDir("config1.bin"));

