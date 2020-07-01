// import { IUIPanel } from "./IUIPanel";
// import { EventCenter } from "../event/EventCenter";
// import { EventID, LoaderEventID } from "../event/EventID";

// import { ResourceManager } from "../loader/ResourceManager";
// import { Log } from "../log/Log";
// import { ISignal } from "../event/ISignal";
// import { TimerManager } from "../timer/TimerManager";
// import { LOADVIEW_TYPE_NONE, eCloseAnim } from "../common/Constant";
// import { UIManager } from "./UIManager";
namespace airkit {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */

    export class BaseView extends fgui.GComponent implements IUIPanel {
        protected _isOpen: boolean = false;
        protected _UIID: number = 0;
        public objectData: any = null;
        public pkgName: string;
        public resName: string;
        public _view: fgui.GComponent;
        private _destory: boolean;
        private _viewID: number;
        private static __ViewIDSeq: number = 0;

        constructor() {
            super();
            this._destory = false;
            this._viewID = BaseView.__ViewIDSeq++;
        }

        public createPanel(pkgName: string, resName: string): void {
            let v = fgui.UIPackage.createObjectFromURL("ui://" + pkgName + "/" + resName);
            if (v == null) return;
            this._view = v.asCom; // fgui.UIPackage.createObject(pkgName, resName).asCom
            this._view.setSize(this.width, this.height);
            this._view.addRelation(this, fgui.RelationType.Width);
            this._view.addRelation(this, fgui.RelationType.Height);

            this.addChild(this._view);

            //fgui.GRoot.inst.addChild(this._view)
        }

        public debug(): void {
            let bgColor: string = "#4aa7a688";
            // this.graphics.clear()
            // this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        public setup(args: any): void {
            this._isOpen = true;

            this.onLangChange();
            this.onCreate(args);

            EventCenter.dispatchEvent(EventID.UI_OPEN, this._UIID);
            EventCenter.on(EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
        }
        /**关闭*/
        public dispose(): void {
            if (this._destory) return;
            this._destory = true;
            this.onDestroy();
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            EventCenter.dispatchEvent(EventID.UI_CLOSE, this._UIID);
            EventCenter.off(EventID.UI_LANG, this, this.onLangChange);
            super.dispose();
        }
        public isDestory(): boolean {
            return this._destory;
        }
        public panel(): fgui.GComponent {
            let panel = this.getGObject("panel");
            if (panel != null) return panel.asCom;
            return null;
        }
        public bg(): fgui.GComponent {
            let view = this.getGObject("bg");
            if (view != null) return view.asCom;
            return null;
        }

        /**是否可见*/
        public setVisible(bVisible: boolean): void {
            let old: boolean = this.visible;
            this.visible = bVisible;
            // if (old != bVisible) {
            //     if (bVisible)
            //     else
            //         this.onDisable()
            // }
        }
        /**设置界面唯一id，只在UIManager设置，其他地方不要再次设置*/
        public setUIID(id: number): void {
            this._UIID = id;
        }
        public get UIID(): number {
            return this._UIID;
        }
        public get viewID(): number {
            return this._viewID;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        public onCreate(args: any): void {}
        /**销毁*/
        public onDestroy(): void {}
        /**每帧循环：如果覆盖，必须调用super.update()*/
        public update(dt: number): boolean {
            return true;
        }
        public getGObject(name: string): fgui.GObject {
            return this._view.getChild(name);
        }
        /**资源加载结束*/
        public onEnter(): void {}

        /**多语言初始化，或语音设定改变时触发*/
        public onLangChange(): void {}

        /**需要提前加载的资源
     * 例:
     *  return [
            ["res/image/1.png", Laya.Loader.IMAGE],
            ["res/image/2.png", Laya.Loader.IMAGE],
            ["res/image/3.png", Laya.Loader.IMAGE],
        ]
    */
        public static res(): Array<any> {
            return null;
        }

        public static loaderTips(): string {
            return "资源加载中";
        }

        //显示加载界面 默认不显示
        public static loaderType(): number {
            return LOADVIEW_TYPE_NONE;
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

        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        public loadResource(group: string, clas: any): Promise<any> {
            return new Promise((resolve, reject) => {
                let assets = [];
                let res_map = clas.res();
                if (res_map && res_map.length > 0) {
                    for (let i = 0; i < res_map.length; ++i) {
                        let res = res_map[i];
                        if (!ResourceManager.Instance.getRes(res[0])) {
                            assets.push({ url: res[0], type: res[1] });
                        }
                    }
                }
                if (assets.length > 0) {
                    let tips = clas.loaderTips();
                    let loaderType = clas.loaderType();
                    ResourceManager.Instance.loadArrayRes(assets, loaderType, tips, 1, true, group)
                        .then((v) => {
                            this.onAssetLoaded();
                            resolve(this);

                            this.onEnter();
                        })
                        .catch((e) => {
                            Log.error(e);
                            reject(e);
                        });
                } else {
                    this.onAssetLoaded();
                    resolve(this);
                    this.onEnter();
                }
            });
        }
        public onAssetLoaded(): void {
            if (!this._isOpen) return;
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
        public doClose(): boolean {
            if (this._isOpen === false) {
                Log.error("连续点击");
                return false; //避免连续点击关闭
            }
            this._isOpen = false;
            UIManager.Instance.close(this.UIID, eCloseAnim.CLOSE_CENTER);
            return true;
        }
    }
}
