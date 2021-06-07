import M from '../../gen/M';
import UIBattleScene from '../../gen/ui/Home/UIBattleScene';
import { API } from '../../manager/API';





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
        super.onEnable();
        ak.Log.info("Battle scene onEnable");
        let ws = new airkit.WebSocketEx();
        ws.setProtoCls(ak.PBMsg,cs.Message);
        ws.initServer("ws://localhost:12080?UID=1&token=aaaa").then((result)=>{
            let msg = new ak.PBMsg(cs.Message);
            msg.setData(API.packetMessage(111,c2s.MessageCmd.JOIN_ROOM,{"uid":"111"}));
            ws.request(msg).then(v=>{
                console.log(v);
            });
        }).catch(e=>{
            console.log("connect failed");
        })
        
    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UIBattleScene.ResMap);
    }
   
    public onBtnBackClick():void {
        M.login().then(v=>{
            v.enterScene();
        })
    }
    public static loaderTips(): string {
        return "美术资源加载中"
    }
    /**是否显示加载界面*/
    public static loaderType(): number {
        return ak.eLoaderType.FULL_SCREEN
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
