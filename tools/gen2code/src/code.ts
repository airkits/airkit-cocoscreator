import { loadDustTemplate, renderM } from './dust';
import { walkSync } from './file';
import { appDir, genDir } from './config';
export function genMCode():void {
    loadDustTemplate('MImport');
    loadDustTemplate('MFunc');
    loadDustTemplate('M');
    let moduleItems = [];
    let out = [];
    walkSync(appDir()+"/module",true,false,out);
    out.forEach(file => {
        let str = file[1].toLowerCase();
        moduleItems.push({
            m:str,
            C:str.toUpperCase(),
            M:str.charAt(0).toUpperCase() + str.slice(1)
        });
    });
    renderM(genDir(),moduleItems);
}
