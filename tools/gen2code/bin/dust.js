"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDustTemplate = void 0;
var fs = require('fs');
var dust = require('dustjs-helpers');
dust.config.whitespace = true;
function loadDustTemplate(name) {
    var template = fs.readFileSync(__dirname + '/../templates/' + name + '.dust', 'UTF8').toString();
    var compiledTemplate = dust.compile(template, name);
    dust.loadSource(compiledTemplate);
}
exports.loadDustTemplate = loadDustTemplate;
