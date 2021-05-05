import M from './game/gen/M';
import { ConfigTable } from "./game/gen/data/ConfigTable";
import { CTask } from './game/gen/data/Config';
import RegisterHelper from './game/common/RegisterHelper';
const { ccclass, property } = cc._decorator;



@ccclass
export default class Main extends cc.Component {
    onLoad() {
        console.log("onLoad")
        console.time && console.time('load_game_cost');
        RegisterHelper.init();
        
        fgui.UIConfig.modalLayerColor = new cc.Color(0x0, 0x0, 0x0, 196);
        fgui.GRoot.create();
        ak.Framework.Instance.setup(fgui.GRoot.inst, ak.LogLevel.DEBUG, cc.winSize.width, cc.winSize.height);
        ak.ConfigManger.Instance.init(ConfigTable.keys(),"config/config");
        Promise.all([ M.preloadModule(),ak.ConfigManger.Instance.loadAll()]).then(v=>{
            console.timeEnd && console.timeEnd('load_game_cost');
            M.login().then(v=>{     
                ak.fixedModalLayer("ui://Loader/mask_bg");
                v.enterScene();

                let result = ak.queryCInfo<CTask>(ConfigTable.TASK,[["id","1620000"]])
                console.log(result);
            })
        })
        
    }
    update(dt:number):void {
        ak.Framework.Instance.update(dt);
    }

    start() { }
}





