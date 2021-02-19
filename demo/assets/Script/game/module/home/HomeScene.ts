import M from '../../gen/M';
import UIHomeScene from '../../gen/ui/Home/UIHomeScene';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class HomeScene extends UIHomeScene{

   
    constructor() {
        super()
        
    }
	public static createInstance():HomeScene {
		return <HomeScene>(fgui.UIPackage.createObject(this.PkgName, this.ResName));
	}
    

    onEnable(): void {
        super.onEnable();
        ak.Log.info("home scene onEnable");
        

    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UIHomeScene.ResMap);
    }
   
    public static loaderTips(): string {
        return "美术资源加载中"
    }
    /**是否显示加载界面*/
    public static loaderType(): number {
        return ak.eLoaderType.NET_LOADING
    }
    protected eventMap(): Array<any> {
        return [
            [this.btnBack,fgui.Event.CLICK,this.onBtnBackClick],
            [this.btnBattle,fgui.Event.CLICK,this.onBtnBattleClick],
        ]
  
    }
    public onBtnBattleClick():void {
        M.battle().then(v=>{
            v.enterScene();
        })
    }
    public onBtnBackClick():void {
        M.login().then(v=>{
            v.enterScene();
        })
    }
    protected signalMap():Array<any> {
        return [
           
        ]
    }

    public onDestroy(): void {
        super.onDestroy()
        console.log("on destory");
    }



    onDisable(): void {
        super.onDisable();
        airkit.Log.info("login scene onDisable")

    }

    public update(dt: number): boolean {


        return super.update(dt)
    }

    public resize(): void {

        this.setSize(this.width, this.height)
    }

}
