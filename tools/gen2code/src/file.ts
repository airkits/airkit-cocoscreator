import { appDir } from './config';
import path = require("path");

var fs = require('fs-extra');

export function walk(dir:string,needDir:boolean,recursive:boolean, callback:(path:string,file:string,stats:any)=>void) {
    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            var filepath = path.join(dir, file);
            fs.stat(filepath, function(err,stats) {
                if (stats.isDirectory()) {
                    if(recursive)
                        walk(filepath,needDir,recursive, callback);
                    if(needDir){
                        callback(filepath,file, stats);
                    }
                } else if (stats.isFile()) {
                    if(!needDir){
                        callback(filepath,file, stats);
                    }
                }
            });
        });
    });
}

export function walkSync(dir:string,needDir:boolean,recursive:boolean,out:any[]) {
    let files =  fs.readdirSync(dir) 
    files.forEach(function(file) {
        var filepath = path.join(dir, file);
        let stats =  fs.statSync(filepath) 
        if (stats.isDirectory()) {
            if(recursive)
                walkSync(filepath,needDir,recursive,out);
            if(needDir){
                out.push([filepath,file]);
            }
        } else if (stats.isFile()) {
            if(!needDir){
                out.push([filepath,file]);
            }
        }
    });
    
}
