var fs = require('fs');
var dust = require('dustjs-helpers');

dust.config.whitespace = true;

export function loadDustTemplate(name) {
    var template = fs.readFileSync(__dirname + '/../templates/' + name + '.dust', 'UTF8').toString();
    var compiledTemplate = dust.compile(template, name);
    dust.loadSource(compiledTemplate);
}