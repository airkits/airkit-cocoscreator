"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderM = exports.loadDustTemplate = void 0;
const path = require("path");
var fs = require('fs-extra');
var dust = require('dustjs-helpers');
dust.config.whitespace = true;
function loadDustTemplate(name) {
    var template = fs.readFileSync(__dirname + '/../templates/' + name + '.dust', 'UTF8').toString();
    var compiledTemplate = dust.compile(template, name);
    dust.loadSource(compiledTemplate);
}
exports.loadDustTemplate = loadDustTemplate;
function renderM(outpath, moduleItems) {
    let className = "M";
    let data = {
        className: className,
        moduleItems: moduleItems,
    };
    /**{m:"login",C:"LOGIN",M:"Login"},
        {m:"system",C:"SYSTEM",M:"System"},
        {m:"battle",C:"BATTLE",M:"Battle"},
        {m:"home",C:"HOME",M:"Home"} */
    outpath = path.join(outpath, `${className}.ts`);
    if (!fs.existsSync(outpath)) {
        dust.render('M', data, function (err, out) {
            if (err)
                return console.log(err);
            fs.outputFileSync(outpath, out);
        });
    }
    else {
        let classStr = fs.readFileSync(outpath, 'utf8');
        data.moduleItems.forEach(item => {
            let funcName = item.m;
            let nothas = classStr.indexOf(funcName) == -1;
            if (nothas) {
                dust.render('MImport', item, function (err, out) {
                    if (err)
                        return console.log(err);
                    let match = /(import\s[\s\S]*?;)/;
                    classStr = classStr.replace(match, `$1\n${out}`);
                });
                dust.render('MFunc', item, function (err, out) {
                    if (err)
                        return console.log(err);
                    let match = /(\sconstructor\(\)\s\{[\s\S]*?\})\s/g;
                    classStr = classStr.replace(match, `$1\n\t${out}\n`);
                });
                let match = /(register\(\)[\s\S]*?let\s[\s\S]*?\[[\s\S]*?\[)/;
                let out = `[M.${item.C} , ${item.M}Module],`;
                classStr = classStr.replace(match, `$1\n\t\t\t${out}`);
                match = /(public\s[\s\S]*?;)/;
                out = `public static ${item.C}:string = "${item.m}";`;
                classStr = classStr.replace(match, `$1\n\t${out}`);
            }
        });
        fs.writeFileSync(outpath, classStr);
    }
    console.warn(`生成${className} success!`);
}
exports.renderM = renderM;
