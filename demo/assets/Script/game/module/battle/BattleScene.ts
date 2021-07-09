import M from '../../gen/M';
import UIBattleScene from '../../gen/ui/Home/UIBattleScene';
import { PBMsg, IProtoData } from '../../manager/PBMsg';
import { me } from '../../model/Player';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class BattleScene extends UIBattleScene{

    private _ws: airkit.WebSocketEx;
    private _frameIndex: number = 0;
    private _sendIndex: number = 0;
    private _tick: number;
    private _isJoinRoom: boolean = false;
    private _roomID: number = 100;
    private _seed: number = 0;
    private _roomIndex: number = -1;
    private _isSending: boolean = false;
    private _uid: number = 1111;
    constructor() {
        super()
        this._tick = 0;
    }
	public static createInstance():BattleScene {
		return <BattleScene>(fgui.UIPackage.createObject(this.PkgName, this.ResName));
	}
    
    onEnable(): void {
        super.onEnable();
        this._uid = me.id;
        ak.Log.info("Battle scene onEnable");
        let ws = new airkit.WebSocketEx();
        ws.initServer("ws://192.168.50.137:12080?UID="+this._uid+"&token=aaaa",PBMsg).then((result)=>{
           
            ws.request({uid:this._uid,msgID:c2s.MessageCmd.JOIN_ROOM,typeUrl:"./c2s.JoinRoomReq",body:{uid:this._uid,roomID:this._roomID},msgType:cs.MessageType.Request}).then(v=>{
                console.log(v);
                if(v && v.body){
                    let resp = (v.body as c2s.JoinRoomResp);
                    if(resp.result.code == 0){
                        this._roomID = resp.roomID;
                        this._frameIndex = resp.frameIndex;
                        this._seed = resp.seed;
                        this._roomIndex = resp.index;
                        this._isJoinRoom = true;
                    }else{
                        console.error(resp.result.msg);
                        this._ws.close();
                        this._ws = null;
                    }
                }
            });
        }).catch(e=>{
            console.log("connect failed");
        })
        this._ws = ws;
        this._ws.on(ak.SocketStatus.SOCKET_DATA,this.onSocketMessage,this);
        
    }
    public onSocketMessage(msg: PBMsg):void {
        console.log(msg);
        if(msg.msgID == c2s.MessageCmd.FRAMES){
            let body = msg.body as c2s.FramesNotify;
            this._frameIndex = body.nextFrame;
        }
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
        if(this._isSending) return;

        this._tick = 0;
        if(this._ws && this._ws.isConnected() && this._isJoinRoom && this._frameIndex > this._sendIndex){
            let frame = {
                frameIndex : this._frameIndex,
                uid: this._uid,
                index: this._roomIndex,
                cmds: ["run"]
            }
            
            this._isSending = true;
            this._ws.request({uid:this._uid,msgID:c2s.MessageCmd.FRAME,typeUrl:"./c2s.FrameReq",body:{roomID:this._roomID,frame:frame},msgType:cs.MessageType.Request}).then(v=>{
                
                if(((v as PBMsg).body as c2s.FrameResp).result.code == 0){
                    this._sendIndex ++;
                }
                this._isSending = false;
             //   let i = ((v as PBMsg).body as c2s.FrameResp).frameIndex;
               // this.player.setPosition(0, i % 500);
            });
        }
        return super.update(dt)
    }

    public resize(): void {

        this.setSize(this.width, this.height)
    }

}
