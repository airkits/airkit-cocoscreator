import M from './game/gen/M';
import LoginScene from "./game/module/login/LoginScene";
import { eSceneType } from './game/common/SceneType';
import LoaderBinder from './game/gen/ui/Loader/LoaderBinder';
import HomeBinder from './game/gen/ui/Home/HomeBinder';
import BattleScene from './game/module/battle/BattleScene';
import HomeScene from './game/module/home/HomeScene';
import { eDialogUIID } from './game/common/DialogType';
import { AlertDlg } from './game/module/login/AlertDlg';
import { FullScreenLoaderDlg } from "./game/module/system/FullScreenLoaderDlg";
import { NetLoaderDlg } from "./game/module/system/NetLoaderDlg";
import { WindowLoaderDlg } from "./game/module/system/WindowLoaderDlg";
import { NetLoader2Dlg } from './game/module/system/NetLoader2Dlg';
import { ConfigTable } from "./game/common/ConfigTable";
import { CTask } from './game/gen/data/Config';
import UIMaskBg2 from './game/gen/ui/Loader/UIMaskBg2';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
   
   
    onLoad() {
        console.log("onLoad")
        console.time && console.time('load_game_cost');
        LoaderBinder.bindAll();
        HomeBinder.bindAll();
        
        fgui.UIConfig.modalLayerColor = new cc.Color(0x0, 0x0, 0x0, 196);

       fgui.GRoot.create();
       ak.Framework.Instance.setup(fgui.GRoot.inst, ak.LogLevel.DEBUG, cc.winSize.width, cc.winSize.height);
        M.register();
        ak.SceneManager.register(eSceneType.LOGIN,LoginScene);
        ak.SceneManager.register(eSceneType.BATTLE, BattleScene);
        ak.SceneManager.register(eSceneType.HOME, HomeScene)
        ak.UIManager.register(eDialogUIID.ALERT,AlertDlg)
        ak.LoaderManager.register(ak.eLoaderType.FULL_SCREEN,"FullScreenLoaderDlg",FullScreenLoaderDlg);
        ak.LoaderManager.register(ak.eLoaderType.NET_LOADING,"NetLoaderDlg",NetLoaderDlg);
        ak.LoaderManager.register(ak.eLoaderType.WINDOW,"WindowLoaderDlg",WindowLoaderDlg);
        ak.LoaderManager.register(ak.eLoaderType.CUSTOM_1,"NetLoader2Dlg",NetLoader2Dlg);
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

        
      
       
        // if (isWX()) {
        //     Platform.init(ePlatform.WX, "wxec644f0c4e2cb275", "wx");
        //     GetPlatform().createAuthButton(
        //         new cc.Vec2(100, 100),
        //         new cc.Size(100, 100),
        //         (res) => {
        //             console.log(res);
        //         },
        //         (e) => {
        //             console.log(e);
        //         }
        //     );
        // }
    }
    update(dt:number):void {
        ak.Framework.Instance.update(dt);
    }
    // onDemoStart(demo) {
    //     this._currentDemo = demo;
    //     this._closeButton = fgui.UIPackage.createObject(
    //         "MainMenu",
    //         "CloseButton"
    //     );
    //     this._closeButton.setPosition(
    //         fgui.GRoot.inst.width - this._closeButton.width - 10,
    //         fgui.GRoot.inst.height - this._closeButton.height - 10
    //     );
    //     this._closeButton.addRelation(
    //         fgui.GRoot.inst,
    //         fgui.RelationType.Right_Right
    //     );
    //     this._closeButton.addRelation(
    //         fgui.GRoot.inst,
    //         fgui.RelationType.Bottom_Bottom
    //     );
    //     this._closeButton.sortingOrder = 100000;
    //     this._closeButton.onClick(this.onDemoClosed, this);
    //     fgui.GRoot.inst.addChild(this._closeButton);
    // }

    // onDemoClosed() {
    //     fgui.GRoot.inst.removeChildren(0, -1, true);
    //     this.node.removeComponent(this._currentDemo);

    //     this.addComponent(MainMenu);
    // }

    start() { }
}





