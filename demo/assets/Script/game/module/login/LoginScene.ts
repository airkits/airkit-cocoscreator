import { eDialogUIID } from '../../common/DialogType';
import M from '../../gen/M';
import UIAlertDlg from '../../gen/ui/Loader/UIAlertDlg';
import UILoginScene from '../../gen/ui/Loader/UILoginScene';
import { AlertDlg } from './AlertDlg';





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
