import M from '../../gen/M';
import UIBattleScene from '../../gen/ui/Home/UIBattleScene';
import { PBMsg, IProtoData } from '../../manager/PBMsg';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class BattleScene extends UIBattleScene{

    private _ws: airkit.WebSocketEx;
    private _frameIndex: number;
    private _tick: number;

    constructor() {
        super()
        this._tick = 0;
    }
	public static createInstance():BattleScene {
		return <BattleScene>(fgui.UIPackage.createObject(this.PkgName, this.ResName));
	}
    
    onEnable(): void {
        super.onEnable();
        ak.Log.info("Battle scene onEnable");
        let ws = new airkit.WebSocketEx();
        this._frameIndex = 1;
        ws.initServer("ws://localhost:12080?UID=1&token=aaaa",PBMsg).then((result)=>{
           
            ws.request({uid:"1111",msgID:c2s.MessageCmd.JOIN_ROOM,typeUrl:"./c2s.JoinRoomReq",body:{uid:"1111"},msgType:cs.MessageType.Request}).then(v=>{
                console.log(v);
            });
        }).catch(e=>{
            console.log("connect failed");
        })
        this._ws = ws;
        
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
        this._tick++;
        if(this._tick < 3) return;
        this._tick = 0;
        if(this._ws && this._ws.isConnected()){
            let frame = {
                frameIndex : this._frameIndex,
                uid: "1111",
                index: 1,
                cmds: ["run"]
            }
            this._frameIndex++;
            this._ws.request({uid:"1111",msgID:c2s.MessageCmd.FRAME,typeUrl:"./c2s.FrameReq",body:{frame:[frame]},msgType:cs.MessageType.Request}).then(v=>{
           //     console.log(v);
                let i = ((v as PBMsg).body as c2s.FrameResp).frameIndex;
                this.player.setPosition(0, i % 500);
            });
        }
        return super.update(dt)
    }

    public resize(): void {

        this.setSize(this.width, this.height)
    }

}
