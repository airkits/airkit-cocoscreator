import M from '../../gen/M';
import UIBattleScene from '../../gen/ui/Home/UIBattleScene';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class BattleScene extends UIBattleScene{

   
    constructor() {
        super()
        
    }
	public static createInstance():BattleScene {
		return <BattleScene>(fgui.UIPackage.createObject(this.PkgName, this.ResName));
	}
    
    onEnable(): void {
        ak.Log.info("Battle scene onEnable");
        

    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return this.buildRes(UIBattleScene.ResMap);
    }
   
    public onBtnBackClick():void {
        M.login().then(v=>{
            v.enterScene();
        })
    }
    //public loaderType(): number {
        
       // return eLoaderType.FULLSCREEN
    // }
    public loaderTips(): string {
        return "动画资源加载"
    }
    protected eventMap(): Array<any> {
        return [
            [this.btnBack,fgui.Event.CLICK,this.onBtnBackClick],
        ]
  
    }
    protected signalMap():Array<any> {
        return [
           
        ]
    }

    public onDestroy(): void {
        super.onDestroy()

    }



    onDisable(): void {
        ak.Log.info("login scene onDisable")

    }

    public update(dt: number): boolean {


        return super.update(dt)
    }

    public resize(): void {

        this.setSize(this.width, this.height)
    }

}
