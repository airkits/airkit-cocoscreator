/// <reference path="./BaseView.ts" />

namespace airkit {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */
    export interface DialogResultData {
        result: eDlgResult;
        data: any;
    }
    export class Dialog extends fgui.Window implements IUIPanel {
        protected _isOpen: boolean = false;
        protected _UIID: string = null;
        public objectData: any = null;
        private _destory: boolean;
        private _viewID: number;
        private _resultData: DialogResultData;
        private _clickMask: fgui.GGraph;

        constructor() {
            super();
            this._destory = false;
            this._viewID = genViewIDSeq();
            this._resultData = {result:eDlgResult.NO,data:null};
        }
        
        wait(): Promise<DialogResultData> {
            return new Promise((resolve: any, reject: any) => {
                this.on(fgui.Event.UNDISPLAY,  () => {
                    resolve({ result: this._resultData.result, data: this._resultData.data });
                },this)
            })
        }
        setupClickBg():void {
            let bg = new fgui.GGraph();
            bg.setSize(fgui.GRoot.inst.width,fgui.GRoot.inst.height);
            bg.onClick(this.close,this);
            bg.drawRect(0, cc.Color.TRANSPARENT, new cc.Color(0x0, 0x0, 0x0,0));
            bg.addRelation(this, fgui.RelationType.Size);
            this.addChildAt(bg,0);
            bg.center();
            this._clickMask = bg;
        }
        /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
        public set UIID(id: string) {
            this._UIID = id;
        }
        public get UIID(): string {
            return this._UIID;
        }
        public get viewID(): number {
            return this._viewID;
        }
        public set viewID(v:number) {
            this._viewID = v;
        }
        public createDlgView():fgui.GComponent {
            return null;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        public setup(args: any): void {
            this._isOpen = true;

            this.onLangChange();
            this.onCreate(args);
            this.contentPane = this.createDlgView();
            EventCenter.dispatchEvent(EventID.UI_OPEN, this._UIID);
            EventCenter.on(EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
           
        }
        protected onShown(): void{
           
        }
        protected onHide(): void{
           
            this.onClose();
        }

        public close(data : {result:eDlgResult,data:any} = {result:eDlgResult.NO,data:null}):void {
            this._resultData = data;
            this.doHideAnimation();

        }
       
        protected doShowAnimation(): void{
            this.onShown();
           

        }
        protected doHideAnimation(): void{
            super.doHideAnimation();
        }
        /**关闭*/
        public dispose(): void {
            
            if (this._destory) return;
            this._destory = true;
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            if(this._clickMask){
                this._clickMask.offClick(this.close,this);
                this._clickMask.removeFromParent();
                this._clickMask = null;
            }
            if(this._UIID)
                EventCenter.dispatchEvent(EventID.UI_CLOSE, this._UIID,this._viewID);
            EventCenter.off(EventID.UI_LANG, this, this.onLangChange);
            
            super.dispose();
            console.log("dialog dispose");
            
        }

        public isDestory(): boolean {
            return this._destory;
        }

        public modalShowAnimation(dt:number = 0.3,alpha:number = 1.0):void {
            let layer = fgui.GRoot.inst.modalLayer;
            layer.alpha = 0;
            TweenUtils.get(layer).to({alpha:alpha},dt,fgui.EaseType.SineIn)
           
        }
        public modalHideAnimation(dt:number = 0.3,alpha:number = 0.0):void {
            let layer = fgui.GRoot.inst.modalLayer;
            TweenUtils.get(layer).to({alpha:alpha},dt,fgui.EaseType.SineOut)

        }

       
        /**是否可见*/
        public setVisible(bVisible: boolean): void {
            let old: boolean = this.visible;
            this.visible = bVisible;
        
        }
 
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        public onCreate(args: any): void {

        }
        /**销毁*/
        public onDestroy(): void {
            super.onDestroy();

        }
        /**每帧循环：如果覆盖，必须调用super.update()*/
        public update(dt: number): boolean {
            return true;
        }
       
        /**资源加载结束*/
        public onEnable(): void {
            super.onEnable();

        }
        //资源卸载前
        public onDisable():void {
            super.onDisable();

        }
        /**多语言初始化，或语音设定改变时触发*/
        public onLangChange(): void {}

        //framework需要提前加载的资源
        public static res():  Array<Res> {
            return null;
        }

        public static unres(): void {
            let arr = this.res();
            if (arr && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    ResourceManager.Instance.clearRes(arr[i].url,arr[i].refCount);
                }
            }
        }
        public static loaderTips(): string {
            return "资源加载中";
        }

        //显示加载界面 默认不显示
        public static loaderType(): number {
            return eLoaderType.NONE;
        }

        //信号事件注册，适合单体物件事件传递
        // return [
        //     [me.updateSignal, this, this.refreshUser],
        // ]
        //   public refreshUser(val: any, result: [model.eUserAttr, number]): void
        protected signalMap(): Array<any> {
            return null;
        }

        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [ 
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        protected eventMap(): Array<any> {
            return null;
        }
        /**自定义事件注册，用于EventCenter派发的事件*/
        protected registerEvent(): void {}
        protected unRegisterEvent(): void {}
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        protected staticCacheUI(): any[] {
            return null;
        }
        resize():void {
            this.center();
            if(this._clickMask){
                this._clickMask.setSize(fgui.GRoot.inst.width,fgui.GRoot.inst.height);
                this._clickMask.center();
            }
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        public static loadResource(onAssetLoaded:(v:boolean)=>void): void {

               
            let tips = this.loaderTips();
            let loaderType = this.loaderType();
            ResourceManager.Instance.loadArrayRes(
                    this.res(),
                        loaderType,
                        tips,
                        1,
                        true
                    )
                        .then((v) => {
                            onAssetLoaded(true);
                          
                        })
                        .catch((e) => {
                            Log.error(e);
                           onAssetLoaded(false);
                        });
                
        }
   
        private registerSignalEvent(): void {
            let event_list: Array<any> = this.signalMap();
            if (!event_list) return;
            for (let item of event_list) {
                let signal = <ISignal>item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        }
        private unregisterSignalEvent(): void {
            let event_list: Array<any> = this.signalMap();
            if (!event_list) return;

            for (let item of event_list) {
                let signal = <ISignal>item[0];
                signal.off(item[1], item[2]);
            }
        }
        /**注册界面事件*/
        private registeGUIEvent(): void {
            let event_list: Array<any> = this.eventMap();
            if (!event_list) return;

            for (let item of event_list) {
                let gui_control = <cc.Node>item[0];
                gui_control.on(item[1], item[2], this);
            }
        }
        private unregisteGUIEvent(): void {
            let event_list: Array<any> = this.eventMap();
            if (!event_list) return;

            for (let item of event_list) {
                let gui_control = <cc.Node>item[0];
                gui_control.off(item[1], item[2], this);
            }
        }
        protected static buildRes(resMap:{ [index: string]: {} }):Array<Res> {
            let res = [];
            for (let k in resMap) {
                res.push({ url: "ui/" + k, type: airkit.FguiAsset,refCount:1,pkg:k });
                for (let k2 in resMap[k]) {
                    res.push({ url: "ui/" + k2, type: airkit.FguiAtlas,refCount:resMap[k][k2],pkg:k });
                }
            }
            return res;
        }
        public onClose(): boolean {

            if (this._isOpen === false) {
                Log.error("连续点击");
                return false; //避免连续点击关闭
            }
            this._isOpen = false;
            UIManager.Instance.close(this.UIID,this.viewID);
            return true;
        }
    

        public hideImmediately():void {
            super.hideImmediately();
            fgui.GRoot.inst.modalLayer.alpha = 1.0;
        }
    }
}