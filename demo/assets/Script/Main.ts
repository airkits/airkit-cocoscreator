import { Platform, isWX, GetPlatform } from "./game/platform/Platform";
import { ePlatform } from "./game/platform/PlatfromType";
import M from './game/gen/M';
import LoginScene from "./game/module/login/LoginScene";
import { eSceneType } from './game/common/SceneType';
import LoaderBinder from './game/gen/ui/Loader/LoaderBinder';
import HomeBinder from './game/gen/ui/Home/HomeBinder';
import BattleScene from './game/module/battle/BattleScene';
import HomeScene from './game/module/home/HomeScene';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
 
    onLoad() {
        LoaderBinder.bindAll();
        HomeBinder.bindAll();
        fgui.GRoot.create();
        ak.Framework.Instance.setup(fgui.GRoot.inst, ak.LogLevel.DEBUG, cc.winSize.width, cc.winSize.height);
        M.register();
        ak.SceneManager.getClass = (name:string) => {
            switch(name){
                case eSceneType.LOGIN:
                    return LoginScene;
                case eSceneType.HOME:
                    return HomeScene;
                case eSceneType.BATTLE:
                    return BattleScene;
            }
        }
        // ak.SceneManager.register(eSceneType.LOGIN,LoginScene);
        // ak.SceneManager.register(eSceneType.BATTLE, BattleScene);
        // ak.SceneManager.register(eSceneType.HOME, HomeScene)
        M.login().then(v=>{     
            v.enterScene();
        })
      
    }
    update(dt:number):void {
        ak.Framework.Instance.update(dt);
    }

    start() { }
}
