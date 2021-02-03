"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const dust_1 = require("./dust");
console.log(config_1.workspace());
dust_1.loadDustTemplate('class');
dust_1.loadDustTemplate('func');
dust_1.loadDustTemplate('manager');
