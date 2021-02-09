import { Platform, isWX, GetPlatform } from "./game/platform/Platform";
import { ePlatform } from "./game/platform/PlatfromType";
import M from './game/gen/M';
import LoginScene from "./game/module/login/LoginScene";
import { eSceneType } from './game/common/SceneType';
import LoaderBinder from './game/gen/ui/Loader/LoaderBinder';
import HomeBinder from './game/gen/ui/Home/HomeBinder';
import BattleScene from './game/module/battle/BattleScene';
import HomeScene from './game/module/home/HomeScene';
import { eDialogType } from './game/common/DialogType';
import { AlertDlg } from './game/module/login/AlertDlg';
import UIAlert from "./game/gen/ui/Loader/UIAlert";
import UIAlertDlg from "./game/gen/ui/Loader/UIAlertDlg";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    private _closeButton: fgui.GObject;
    private _currentDemo: cc.Component;

    onLoad() {
        LoaderBinder.bindAll();
        HomeBinder.bindAll();
        fgui.UIConfig.modalLayerColor = new cc.Color(0x0, 0x0, 0x0, 196);

        fgui.GRoot.create();
        ak.Framework.Instance.setup(fgui.GRoot.inst, ak.LogLevel.DEBUG, cc.winSize.width, cc.winSize.height);
        M.register();
        ak.SceneManager.register(eSceneType.LOGIN,LoginScene);
        ak.SceneManager.register(eSceneType.BATTLE, BattleScene);
        ak.SceneManager.register(eSceneType.HOME, HomeScene)
        ak.UIManager.register(eDialogType.ALERT,AlertDlg)
        M.login().then(v=>{     
            v.enterScene();
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
