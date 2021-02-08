import M from '../../gen/M';
import UILoginScene from '../../gen/ui/Loader/UILoginScene';





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
        return this.buildRes(UILoginScene.ResMap);
    }
   
    //public loaderType(): number {
        
       // return eLoaderType.FULLSCREEN
    // }
    public loaderTips(): string {
        return "动画资源加载"
    }
    protected eventMap(): Array<any> {
        return [
          [this.btnStart,fgui.Event.CLICK,this.onBtnStart]
        ]
  
    }
    protected signalMap():Array<any> {
        return [
           
        ]
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
