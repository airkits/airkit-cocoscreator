/**
 * UI管理器
 * @author ankye
 * @time 2018-7-3
 */
namespace airkit {
    export class UIManager extends Singleton {
        private _dicConfig: NDictionary<UIConfig> = null;
        private _dicUIView: NDictionary<IUIPanel> = null;
        private _UIQueues: NDictionary<UIQueue> = null;

        private static instance: UIManager = null;
        public static get Instance(): UIManager {
            if (!this.instance) this.instance = new UIManager();
            return this.instance;
        }

        constructor() {
            super();
            this._dicConfig = new NDictionary<UIConfig>();
            this._dicUIView = new NDictionary<IUIPanel>();
            this._UIQueues = new NDictionary<UIQueue>();
            //预创建2个队列,通常情况下都能满足需求了
            this._UIQueues.add(eUIQueueType.POPUP, new UIQueue());
            this._UIQueues.add(eUIQueueType.ALERT, new UIQueue());
        }

        public empty(): boolean {
            let queue = this._UIQueues.getValue(eUIQueueType.POPUP);
            if (!queue.empty()) return false;
            if (this._dicUIView.length > 0) return false;
            return true;
        }
        //～～～～～～～～～～～～～～～～～～～～～～～显示~～～～～～～～～～～～～～～～～～～～～～～～//
        /**
         * 显示界面
         * @param id        界面id
         * @param args      参数
         */
        public show(id: number, ...args: any[]): Promise<any> {
            return new Promise((resolve, reject) => {
                Log.info("show panel {0}", id);
                //从缓存中查找
                let obj: IUIPanel = this._dicUIView.getValue(id);

                if (obj != null) {
                    if (obj["displayObject"] == null) {
                        this._dicUIView.remove(id);
                        obj = null;
                    } else {
                        obj.setVisible(true);
                        // return obj
                        resolve(obj);
                        return;
                    }
                }

                //获取数据
                let conf: UIConfig = this._dicConfig.getValue(id);
                assert(
                    conf != null,
                    "UIManager::Show - not find id:" + conf.mID
                );
                let params = args.slice(0);
                //切换
                let clas = ClassUtils.getClass(conf.name);

                let v = new clas();
                assert(v != null, "UIManager::Show - cannot create ui:" + id);
                v.setUIID(id);
                v.setup(params);
                v.loadResource(ResourceManager.DefaultGroup, clas)
                    .then((p) => {
                        let layer: fgui.GComponent = LayerManager.getLayer(
                            conf.mLayer
                        );
                        layer.addChild(p);

                        this._dicUIView.add(id, p);

                        resolve(p);
                    })
                    .catch((e) => {
                        Log.error(e);
                    });
            });
        }
        /**
         * 关闭界面
         * @param id    界面id
         */
        public close(id: number, animType: number = 0): Promise<any> {
            return new Promise((resolve, reject) => {
                Log.info("close panel {0}", id);
                //获取数据
                let conf: UIConfig = this._dicConfig.getValue(id);
                assert(
                    conf != null,
                    "UIManager::Close - not find id:" + conf.mID
                );

                let panel: IUIPanel = this._dicUIView.getValue(id);
                if (!panel) return;

                //切换
                let clas = ClassUtils.getClass(conf.name);
                clas.unres();
                if (animType == 0) {
                    let result = this.clearPanel(id, panel, conf);
                    resolve([id, result]);
                } else {
                    DisplayUtils.hide(
                        panel,
                        Handler.create(null, (v) => {
                            let result = this.clearPanel(id, panel, conf);
                            resolve([id, result]);
                        })
                    );
                }
            });
        }
        public clearPanel(
            id: number,
            panel: IUIPanel,
            resInfo: UIConfig
        ): boolean {
            //销毁或隐藏
            if (resInfo.mHideDestroy) {
                this._dicUIView.remove(id);
                Log.info("clear panel {0}", id);
                panel.removeFromParent();
                panel.dispose();

                return true;
            } else {
                panel.setVisible(false);
                return false;
            }
        }
        /**
         * 关闭所有界面
         * @param   exclude_list    需要排除关闭的列表
         */
        public closeAll(exclude_list: Array<number> = null): void {
            this._dicUIView.foreach(function (key, value) {
                if (exclude_list && ArrayUtils.containsValue(exclude_list, key))
                    return true;
                UIManager.Instance.close(key);
                return true;
            });
        }

        /**
         * 弹窗UI，默认用队列显示
         * @param id
         * @param args
         */
        public popup(id: number, ...args: any[]): void {
            this._UIQueues.getValue(eUIQueueType.POPUP).show(id, args);
        }
        /**
         * alert框，默认队列显示
         *
         * @param {number} id
         * @param {...any[]} args
         * @memberof UIManager
         */
        public alert(id: number, ...args: any[]): void {
            this._UIQueues.getValue(eUIQueueType.ALERT).show(id, args);
        }

        /**查找界面*/
        public findPanel(id: number): IUIPanel {
            let panel: IUIPanel = this._dicUIView.getValue(id);
            return panel;
        }
        /**界面是否打开*/
        public isPanelOpen(id: number): boolean {
            let panel: IUIPanel = this._dicUIView.getValue(id);
            if (panel) return true;
            else return false;
        }

        //toast
        public tipsPopup(
            toastLayer: fgui.GComponent,
            target: fgui.GComponent,
            view: fgui.GComponent,
            duration: number = 0.5,
            fromProps = null,
            toProps = null,
            usePool: boolean = true
        ): Promise<any> {
            return new Promise<void>((resolve, reject) => {
                //  target.addChild(view)
                toastLayer.addChild(view);
                view.setScale(0.1, 0.1);
                //fgui坐标转化有问题，临时处理一下
                let point = target.localToGlobal(
                    target.width / 2.0 - target.pivotX * target.width,
                    target.height * 0.382 - target.pivotY * target.height
                );
                let localPoint = toastLayer.globalToLocal(point.x, point.y);
                // view.setXY(target.width / 2.0, target.height * 0.382)
                let start = 0;
                let offset = 600;
                let type = fgui.EaseType.BounceOut;
                if (duration > 1.5) {
                    start = toastLayer.height + 600;
                    offset = -600;
                    type = fgui.EaseType.QuadOut;
                    view.setPosition(localPoint.x, start);
                } else {
                    view.setPosition(localPoint.x, start - 200);
                }

                TweenUtils.get(view)
                    .delay(1.5)
                    .to(
                        {
                            scaleX: 1.0,
                            scaleY: 1.0,
                            alpha: 1.0,
                            x: localPoint.x,
                            y: localPoint.y,
                        },
                        duration,
                        type
                    )
                    .delay(0.5)
                    .to(
                        { x: localPoint.x, y: start - offset },
                        duration,
                        fgui.EaseType.ExpoOut,
                        Handler.create(null, () => {
                            view.removeFromParent();
                            resolve();
                        })
                    );
            });
        }

        //tips 单toast，具有排他性
        public singleToast(
            toastLayer: fgui.GComponent,
            target: fgui.GComponent,
            view: fgui.GComponent,
            duration: number = 0.5,
            speedUp: boolean,
            usePool: boolean = true,
            x: number = null,
            y: number = null
        ): Promise<any> {
            return new Promise<void>((resolve, reject) => {
                let key = "_single_toast";
                if (target[key] == null) {
                    target[key] = [];
                }
                let inEase = fgui.EaseType.QuadOut;
                let outEase = fgui.EaseType.QuadIn;
                //  target.addChild(view)
                toastLayer.addChild(view);
                let k = ClassUtils.classKey(view);
                for (var i in target[key]) {
                    let o = target[key][i] as fgui.GComponent;
                    if (o) {
                        o["toY"] -= o.height + 5;
                        if (ClassUtils.classKey(o) == k) {
                            o.visible = false;
                        }
                    }
                }

                target[key].push(view);
                view.visible = true;
                view.setScale(0.1, 0.1);
                //fgui坐标转化有问题，临时处理一下
                if (x == null)
                    x = target.width / 2.0 - target.pivotX * target.width;
                if (y == null)
                    y = target.height * 0.382 - target.pivotY * target.height;
                let point = target.localToGlobal(x, y);
                let localPoint = toastLayer.globalToLocal(point.x, point.y);
                // view.setXY(target.width / 2.0, target.height * 0.382)
                view.setPosition(localPoint.x, localPoint.y);
                view["toY"] = view.y;
                let tu = TweenUtils.get(view);

                tu.setOnUpdate((gt: fgui.GTweener) => {
                    let toY = view["toY"];
                    if (toY < view.y) {
                        let offset = (toY - view.y) * 0.4;
                        let limit = -5 - Math.ceil(view.height / 50);
                        if (offset < limit) offset = limit;
                        view.y += offset;
                    }
                });
                let scale = 1.0;
                tu.to(
                    { scaleX: scale, scaleY: scale, alpha: 1.0 },
                    duration,
                    inEase
                ).to(
                    { alpha: 0.4 },
                    duration * 0.7,
                    outEase,
                    Handler.create(this, () => {
                        target[key].splice(target[key].indexOf(view), 1);
                        if (target && view && view["parent"]) {
                            view.removeFromParent();
                            tu.clear();
                        }
                        if (usePool) {
                            ObjectPools.recover(view);
                        } else {
                            view.dispose();
                        }
                        resolve();
                    })
                );
            });
        }

        //toast
        public toast(
            toastLayer: fgui.GComponent,
            target: fgui.GComponent,
            view: fgui.GComponent,
            duration: number = 0.5,
            speedUp: boolean,
            usePool: boolean = true,
            x: number = null,
            y: number = null
        ): Promise<any> {
            return new Promise<void>((resolve, reject) => {
                if (target["_toastList"] == null) {
                    target["_toastList"] = [];
                }
                let inEase = fgui.EaseType.QuadOut;
                let outEase = fgui.EaseType.QuadIn;
                //  target.addChild(view)
                toastLayer.addChild(view);
                if (speedUp) {
                    for (var i in target["_toastList"]) {
                        if (target["_toastList"][i]) {
                            target["_toastList"][i]["toY"] -=
                                target["_toastList"][i].height + 8;
                            target["_toastList"][i].visible = false;
                        }
                    }
                    duration = duration;
                    inEase = fgui.EaseType.BounceOut;
                    outEase = fgui.EaseType.BounceIn;
                } else {
                    for (var i in target["_toastList"]) {
                        if (target["_toastList"][i]) {
                            target["_toastList"][i]["toY"] -=
                                target["_toastList"][i].height + 8;
                        }
                    }
                }

                target["_toastList"].push(view);

                view.setScale(0.1, 0.1);
                //fgui坐标转化有问题，临时处理一下
                if (x == null)
                    x = target.width / 2.0 - target.pivotX * target.width;
                if (y == null)
                    y = target.height * 0.382 - target.pivotY * target.height;
                let point = target.localToGlobal(x, y);
                let localPoint = toastLayer.globalToLocal(point.x, point.y);
                // view.setXY(target.width / 2.0, target.height * 0.382)
                view.setPosition(localPoint.x, localPoint.y);
                view["toY"] = view.y;
                let tu = TweenUtils.get(view);

                tu.setOnUpdate((gt: fgui.GTweener) => {
                    let toY = view["toY"];
                    if (toY < view.y) {
                        let offset = (toY - view.y) * 0.4;
                        let limit = -8 - Math.ceil(view.height / 50);
                        if (offset < limit) offset = limit;
                        view.y += offset;
                    }
                });
                let scale = speedUp ? 1.0 : 1.0;
                tu.to(
                    { scaleX: scale, scaleY: scale, alpha: 1.0 },
                    duration,
                    inEase
                ).to(
                    { alpha: 0.4 },
                    duration * 0.7,
                    outEase,
                    Handler.create(this, () => {
                        target["_toastList"].splice(
                            target["_toastList"].indexOf(view),
                            1
                        );
                        if (target && view && view["parent"]) {
                            view.removeFromParent();
                            tu.clear();
                        }
                        if (usePool) {
                            ObjectPools.recover(view);
                        } else {
                            view.dispose();
                        }
                        resolve();
                    })
                );
            });
        }

        public setup(): void {}

        public destroy(): boolean {
            this.closeAll();
            this.clearUIConfig();
            return true;
        }

        public update(dt: number): void {
            this._dicUIView.foreach(function (key, value) {
                value.update(dt);
                return true;
            });
        }

        //～～～～～～～～～～～～～～～～～～～～～～～加载~～～～～～～～～～～～～～～～～～～～～～～～//
        public addUIConfig(info: UIConfig): void {
            if (this._dicConfig.containsKey(info.mID)) {
                Log.error(
                    "UIManager::Push UIConfig - same id is register:" + info.mID
                );
                return;
            }
            this._dicConfig.add(info.mID, info);
            ClassUtils.regClass(info.name, info.cls);
        }
        public clearUIConfig(): void {
            this._dicConfig.clear();
        }

        public getUIConfig(id: number): UIConfig {
            return this._dicConfig.getValue(id);
        }

        public getUILayerID(id: number) {
            let info: UIConfig = this._dicConfig.getValue(id);
            if (!info) {
                return -1;
            }
            return info.mLayer;
        }
    }

    /** 
    显示弹出框信息
    @param callback         回调函数
    @param title            标题，默认是""
    @param content          提示内容 RICHTEXT样式
    @param tips             内容文本的一个底部tip文本,RICHTEXT样式,不需要可以传null
    @param buttons          按钮的label,不需要显示按钮可以传null,确认按钮[{按钮属性k:v依据Label}]
    @param param            调用方预设的参数，保存在alertView对象中，可以通过getParam方法获取
    */
    export class AlertInfo {
        public callback: Function;
        public title: string = "";
        public content: string;
        public tips: string = "";
        public buttons: any = [];
        public param: any = null;

        constructor(
            callback: Function,
            title: string = "",
            content: string,
            tips: string = "",
            buttons: any = {},
            param: any = null
        ) {
            this.callback = callback;
            this.title = title;
            this.content = content;
            this.tips = tips;
            this.buttons = buttons;
            this.param = param;
        }
    }
    export class UIConfig {
        public mID: number;
        /**ui类*/
        public name: string;
        public cls: any;
        /**层级*/
        public mLayer: number;
        /**隐藏销毁*/
        public mHideDestroy: boolean;
        /**对齐*/
        public mAlige: eAligeType;

        constructor(
            id: number,
            name: string,
            cls: any,
            layer: number,
            destroy: boolean,
            alige: eAligeType
        ) {
            this.mID = id;

            this.name = name;
            this.cls = cls;
            this.mLayer = layer;
            this.mHideDestroy = destroy;
            this.mAlige = alige;
        }
    }

    class UIQueue {
        /*～～～～～～～～～～～～～～～～～～～～～队列方式显示界面，上一个界面关闭，才会显示下一个界面～～～～～～～～～～～～～～～～～～～～～*/
        private _currentUI: number = 0;
        private _listPanels: Queue<[number, any]>;

        constructor() {
            this._currentUI = 0;
            this._listPanels = new Queue<[number, any]>();
        }
        /**
         * 直接显示界面,注：
         * 1.通过这个接口打开的界面，初始化注册的ui类设定的UIConfig.mHideDestroy必须为true。原因是显示下一个界面是通过上个界面的CLOSE事件触发
         * @param 	id		界面id
         * @param 	args	创建参数，会在界面onCreate时传入
         */
        public show(id: number, args: any[]): void {
            let info: [number, any] = [id, args];
            this._listPanels.enqueue(info);
            this.checkAlertNext();
        }

        public empty(): boolean {
            if (this._currentUI > 0 || this._listPanels.length > 0)
                return false;
            return true;
        }
        /**
         * 判断是否弹出下一个界面
         */
        private checkAlertNext(): void {
            if (this._currentUI > 0 || this._listPanels.length <= 0) return;

            let info: [number, any] = this._listPanels.dequeue();

            this.registerEvent();
            this._currentUI = info[0];
            UIManager.Instance.show(info[0], ...info[1]);
        }

        private registerEvent(): void {
            EventCenter.on(EventID.UI_CLOSE, this, this.onUIEvent);
        }

        private unRegisterEvent(): void {
            EventCenter.off(EventID.UI_CLOSE, this, this.onUIEvent);
        }
        private onUIEvent(args: EventArgs): void {
            switch (args.type) {
                case EventID.UI_CLOSE:
                    let id: number = args.get(0);
                    if (this._currentUI > 0 && this._currentUI == id) {
                        this._currentUI = 0;
                        this.unRegisterEvent();
                        this.checkAlertNext();
                    }
                    break;
            }
        }
    }
}
