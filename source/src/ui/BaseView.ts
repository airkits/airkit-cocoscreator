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
    export var ViewIDSeq: number = 0
    export function genViewIDSeq(): number {
        return ViewIDSeq++
    }

    export class BaseView extends fgui.GComponent implements IUIPanel {
        protected _isOpen: boolean = false
        protected _UIID: string = null
        public objectData: any = null
        private _destory: boolean
        private _viewID: number

        constructor() {
            super()
            this._destory = false
            this._viewID = genViewIDSeq()
        }

        /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
        public set UIID(id: string) {
            this._UIID = id
        }
        public get UIID(): string {
            return this._UIID
        }
        public get viewID(): number {
            return this._viewID
        }
        public set viewID(v: number) {
            this._viewID = v
        }

        public debug(): void {
            let bgColor: string = '#4aa7a688'
            // this.graphics.clear()
            // this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        public setup(args: any): void {
            this._isOpen = true

            this.onLangChange()
            this.onCreate(args)

            EventCenter.dispatchEvent(EventID.UI_OPEN, this._UIID)
            EventCenter.on(EventID.UI_LANG, this, this.onLangChange)
            this.registerEvent()
            this.registeGUIEvent()
            this.registerSignalEvent()
        }
        /**关闭*/
        public dispose(): void {
            if (this._destory) return

            this._destory = true

            this.unRegisterEvent()
            this.unregisteGUIEvent()
            this.unregisterSignalEvent()
            this._isOpen = false
            this.objectData = null
            if (this._UIID) EventCenter.dispatchEvent(EventID.UI_CLOSE, this._UIID, this._viewID)
            EventCenter.off(EventID.UI_LANG, this, this.onLangChange)
            if (this.numChildren > 0) {
                this.removeChildren(0, this.numChildren, true)
            }
            super.dispose()
        }

        public isDestory(): boolean {
            return this._destory
        }

        /**是否可见*/
        public setVisible(bVisible: boolean): void {
            let old: boolean = this.visible
            this.visible = bVisible
        }

        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        public onCreate(args: any): void {}
        /**销毁*/
        public onDestroy(): void {
            super.onDestroy()
        }
        /**每帧循环：如果覆盖，必须调用super.update()*/
        public update(dt: number): boolean {
            return true
        }

        /**资源加载结束*/
        public onEnable(): void {
            super.onEnable()
        }
        //资源卸载前
        public onDisable(): void {
            super.onDisable()
        }
        /**多语言初始化，或语音设定改变时触发*/
        public onLangChange(): void {}

        //framework需要提前加载的资源
        public static res(): Array<Res> {
            return null
        }

        public static unres(): void {
            let arr = this.res()
            if (arr && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    ResourceManager.Instance.clearRes(arr[i].url)
                }
            }
        }
        public static loaderTips(): string {
            return '资源加载中'
        }

        //显示加载界面 默认不显示
        public static loaderType(): number {
            return eLoaderType.NONE
        }

        //信号事件注册，适合单体物件事件传递
        // return [
        //     [me.updateSignal, this, this.refreshUser],
        // ]
        //   public refreshUser(val: any, result: [model.eUserAttr, number]): void
        protected signalMap(): Array<any> {
            return null
        }

        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [ 
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        protected eventMap(): Array<any> {
            return null
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
            return null
        }

        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        public static loadResource(onAssetLoaded: (v: boolean) => void): void {
            let tips = this.loaderTips()
            let loaderType = this.loaderType()
            ResourceManager.Instance.loadArrayRes(this.res(), loaderType, tips, 1, true)
                .then((v) => {
                    onAssetLoaded(true)
                })
                .catch((e) => {
                    Log.error(e)
                    onAssetLoaded(false)
                })
        }

        private registerSignalEvent(): void {
            let event_list: Array<any> = this.signalMap()
            if (!event_list) return
            for (let item of event_list) {
                let signal = <ISignal>item[0]
                signal.on(item[1], item[2], item.slice(3))
            }
        }
        private unregisterSignalEvent(): void {
            let event_list: Array<any> = this.signalMap()
            if (!event_list) return

            for (let item of event_list) {
                let signal = <ISignal>item[0]
                signal.off(item[1], item[2])
            }
        }
        /**注册界面事件*/
        private registeGUIEvent(): void {
            let event_list: Array<any> = this.eventMap()
            if (!event_list) return

            for (let item of event_list) {
                let gui_control = <cc.Node>item[0]
                gui_control.on(item[1], item[2], this)
            }
        }
        private unregisteGUIEvent(): void {
            let event_list: Array<any> = this.eventMap()
            if (!event_list) return

            for (let item of event_list) {
                let gui_control = <cc.Node>item[0]
                gui_control.off(item[1], item[2], this)
            }
        }
    }
}
