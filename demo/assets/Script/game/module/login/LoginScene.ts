import { eDialogUIID } from '../../common/DialogType';
import { LK } from '../../gen/data/LK';
import M from '../../gen/M';
import UIAlertDlg from '../../gen/ui/Loader/UIAlertDlg';
import UILoginScene from '../../gen/ui/Loader/UILoginScene';
import { AlertDlg } from './AlertDlg';
import VideoSprite from '../../render/VideoSprite';
import BrightSaturaContrastAssembler from '../../render/BrightSaturaContrastAssembler';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class LoginScene extends UILoginScene{

   
    constructor() {
        super()
        
    }
	public static createInstance():LoginScene {
		return <LoginScene>(fgui.UIPackage.createObject(this.PkgName, this.ResName));
	}
    
    onEnable(): void {
        super.onEnable();
        airkit.Log.info("login scene onEnable");
        console.log(ak.L(LK.format_h_m_s,"2011","3",4));
        let node = new cc.Node();
        const sprite = node.addComponent(VideoSprite);
        cc.loader.loadRes("material/BrightSaturaContrastAssembler", cc.Material, function(err, res) {
                var material = cc.MaterialVariant.create(res,sprite);
                sprite.setMaterial(0, material)
            })

       cc.loader.loadRes("ui/Loader_atlas_mdb81w", cc.Asset, function(err, v) {
        let asset = <cc.Texture2D>cc.loader.getRes("ui/Loader_atlas_mdb81w")
        sprite.spriteFrame = new cc.SpriteFrame(asset);
        sprite.brightness = 0.3;
        sprite.constrast = 0.2;
    });

       
        this.node.addChild(node);
        node.setPosition(300,-300);
        // let scene = cc.director.getScene();
        // let comp = scene.getChildByName("girl2");
        
        // comp.parent = this.imgBg.node
        // comp.setPosition(300,500);
        // console.log(this);
       

    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UILoginScene.ResMap);
    }
   
    public static loaderType(): number {
        
       return ak.eLoaderType.FULL_SCREEN
    }
    public static loaderTips(): string {
        return "动画资源加载"
    }
    protected eventMap(): Array<any> {
        return [
          [this.btnStart,fgui.Event.CLICK,this.onBtnStart],
          [this.btnShowDlg,fgui.Event.CLICK,this.onBtnShowDlg],
        ]
  
    }
    protected signalMap():Array<any> {
        return [
           
        ]
    }
    public onBtnShowDlg():void {
       
      // ak.UIManager.show(eDialogUIID.ALERT);
     //  ak.UIManager.show(eDialogUIID.ALERT);
      ak.UIManager.showQ(eDialogUIID.ALERT,{clickMaskClose:false}).then(v=>{
        if(v){  
            console.log("showQ dlg ="+v.viewID);
            v.wait().then(result=>{
                console.log("result wait ");
                console.log(result);
            });
        }
      });
       ak.UIManager.showQ(eDialogUIID.ALERT,{clickMaskClose:true}).then(v=>{
        if(v){  
            console.log("showQ dlg ="+v.viewID);
            v.wait().then(result=>{
                console.log("result wait ");
                console.log(result);
            });
        }
    });
      //  ak.UIManager.popup(eDialogUIID.ALERT);
      //  ak.UIManager.popup(eDialogUIID.ALERT);
   //   ak.LoaderManager.Instance.show(ak.eLoaderType.CUSTOM_1)
    }
    public onBtnStart():void {
        console.log("start btn");
        M.home().then(v=>{
            v.enterScene();
        })
    }
    public onDestroy(): void {
        super.onDestroy()
        console.log("on destory");
    }



    onDisable(): void {
        super.onDisable();
        ak.Log.info("login scene onDisable")

    }

    public update(dt: number): boolean {

        return super.update(dt)
    }

    public resize(): void {

        this.setSize(this.width, this.height)
    }

}
