declare namespace airkit {
    class Singleton extends cc.Node {
        private static classKeys;
        private static classValues;
        constructor();
    }
}
declare namespace airkit {
    class Framework extends Singleton {
        private _isStopGame;
        private _mainloopHandle;
        private _lastTimeMS;
        private static instance;
        static get Instance(): Framework;
        constructor();
        setup(root: fgui.GComponent, log_level?: LogLevel, design_width?: number, design_height?: number, screen_mode?: string, frame?: number): void;
        destroy(): boolean;
        update(dt: number): void;
        preTick(dt: number): void;
        tick(dt: number): void;
        endTick(dt: number): void;
        pauseGame(): void;
        resumeGame(): void;
        get isStopGame(): boolean;
        private printDeviceInfo;
    }
}
declare namespace airkit {
    class Color {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        set(new_r: number, new_g: number, new_b: number, new_a: number): void;
        static add(a: Color, b: Color): Color;
        add(a: Color): Color;
        static sub(a: Color, b: Color): Color;
        sub(a: Color): Color;
        static mul(a: Color, d: number): Color;
        mul(d: number): Color;
        static div(a: Color, d: number): Color;
        div(d: number): Color;
        equals(other: Color): boolean;
        static lerp(from: Color, to: Color, t: number): Color;
        static get zero(): Color;
        static get one(): Color;
        static get red(): Color;
        static get green(): Color;
        static get blue(): Color;
        static get white(): Color;
        static get black(): Color;
        static get yellow(): Color;
        static get cyan(): Color;
        static get magenta(): Color;
        static get gray(): Color;
        static get grey(): Color;
        static get clear(): Color;
        toString(): string;
    }
}
declare namespace airkit {
    class NDictionary<TValue> {
        private _dic;
        add(key: number, value: TValue): boolean;
        remove(key: number): void;
        set(key: number, value: TValue): void;
        containsKey(key: number): boolean;
        getValue(key: number): TValue;
        clear(): void;
        getkeys(): Array<number>;
        getValues(): Array<TValue>;
        foreach(compareFn: (key: number, value: TValue) => boolean): void;
        get length(): number;
    }
    class SDictionary<TValue> {
        private _dic;
        add(key: string, value: TValue): boolean;
        set(key: string, value: TValue): void;
        remove(key: string): void;
        containsKey(key: string): boolean;
        getValue(key: string): TValue;
        getkeys(): Array<string>;
        getValues(): Array<TValue>;
        clear(): void;
        foreach(compareFn: (key: string, value: TValue) => boolean): void;
        get length(): number;
    }
}
declare namespace airkit {
    class DoubleArray {
        private _array;
        constructor(rows: number, cols: number, value: any);
        set(row: number, col: number, value: any): void;
        get(row: number, col: number): any;
        clear(): void;
    }
}
declare namespace airkit {
    interface IPoolsObject {
        init(): any;
    }
}
declare namespace airkit {
    class LinkList<T> {
        private _linkHead;
        private _size;
        constructor();
        add(t: T): void;
        insert(index: number, t: T): void;
        append(index: number, t: T): void;
        del(index: number): void;
        delFirst(): void;
        delLast(): void;
        get(index: number): T;
        getFirst(): T;
        getLast(): T;
        private getNode;
        foreach(compareFn: (value: T) => boolean): void;
        isEmpty(): boolean;
        get length(): number;
    }
}
declare namespace airkit {
    class ObjectPools {
        private static poolsMap;
        static get(classDef: any): any;
        static recover(obj: any): void;
        static clearAll(): void;
        static clear(sign: string): void;
    }
}
declare namespace airkit {
    class Queue<T> {
        private _list;
        enqueue(item: T): void;
        dequeue(): T;
        peek(): T;
        seek(index: number): T;
        toArray(): Array<T>;
        contains(item: T): boolean;
        clear(): void;
        get length(): number;
        foreach(compareFn: (a: T) => boolean): void;
    }
}
declare namespace airkit {
    class Size {
        private _width;
        private _height;
        constructor(w?: number, h?: number);
        set(w: number, h: number): void;
        get width(): number;
        get height(): number;
    }
}
declare namespace airkit {
    class Stack<T> {
        private _list;
        push(item: T): void;
        pop(): T;
        peek(): T;
        toArray(): Array<T>;
        contains(item: T): boolean;
        clear(): void;
        get length(): number;
        foreach(compareFn: (a: T) => boolean): void;
    }
}
declare namespace airkit {
    const LOADVIEW_TYPE_NONE: number;
    enum eUIQueueType {
        POPUP = 1,
        ALERT = 2
    }
    enum ePopupAnim {
    }
    enum eCloseAnim {
        CLOSE_CENTER = 1
    }
    enum eAligeType {
        NONE = 0,
        RIGHT = 1,
        RIGHT_BOTTOM = 2,
        BOTTOM = 3,
        LEFT_BOTTOM = 4,
        LEFT = 5,
        LEFT_TOP = 6,
        TOP = 7,
        RIGHT_TOP = 8,
        MID = 9
    }
    enum eUILayer {
        BG = 0,
        MAIN = 1,
        GUI = 2,
        POPUP = 3,
        TOOLTIP = 4,
        SYSTEM = 5,
        LOADING = 6,
        TOP = 7,
        MAX = 8
    }
    enum LogLevel {
        DEBUG = 7,
        INFO = 6,
        WARNING = 5,
        ERROR = 4,
        EXCEPTION = 3
    }
    enum ePopupButton {
        Close = 0,
        Cancel = 1,
        Ok = 2
    }
}
declare namespace airkit {
    class ConfigItem {
        url: string;
        name: string;
        key: any;
        constructor(url: string, name: string, key: any);
    }
}
declare namespace airkit {
    class ConfigManger extends Singleton {
        private _listTables;
        private static instance;
        static zipUrl: string;
        static get Instance(): ConfigManger;
        init(keys: any, zipPath?: string): void;
        release(): void;
        loadAll(): Promise<any>;
        getList(table: string, filter?: Array<any>): Array<any>;
        getInfo(table: string, key: any): any;
        get listTables(): Array<ConfigItem>;
    }
}
declare namespace airkit {
    class DataProvider extends Singleton {
        private _dicTemplate;
        private _dicData;
        _zip: boolean;
        private static instance;
        static get Instance(): DataProvider;
        enableZip(): void;
        setup(): void;
        destroy(): boolean;
        loadZip(url: string, list: ConfigItem[]): Promise<any>;
        load(list: ConfigItem[]): Promise<any>;
        unload(url: string): void;
        unloadAll(): void;
        getConfig(table: string): any;
        getInfo(table: string, key: any): any;
        private getRes;
        private onLoadComplete;
    }
}
declare namespace airkit {
    function base64_encode(data: string): string;
    function stringToArrayBuffer(s: string): ArrayBuffer;
    class Base64 {
        alphabet: string[];
        values: {};
        constructor();
        encode(bytes: ArrayBuffer): string;
        decode(string: string): Uint8Array;
    }
}
declare namespace airkit {
    function md5_encrypt(data: string): string;
    class MD5 {
        constructor();
        private hexcase;
        private b64pad;
        hex_md5(s: any): string;
        b64_md5(s: any): string;
        any_md5(s: any, e: any): string;
        hex_hmac_md5(k: any, d: any): string;
        private b64_hmac_md5;
        private any_hmac_md5;
        md5_vm_test(): boolean;
        rstr_md5(s: any): string;
        rstr_hmac_md5(key: any, data: any): string;
        rstr2hex(input: any): string;
        rstr2b64(input: any): string;
        rstr2any(input: any, encoding: any): string;
        str2rstr_utf8(input: any): string;
        str2rstr_utf16le(input: any): string;
        str2rstr_utf16be(input: any): string;
        rstr2binl(input: any): any[];
        binl2rstr(input: any): string;
        binl_md5(x: any, len: any): number[];
        md5_cmn(q: any, a: any, b: any, x: any, s: any, t: any): number;
        md5_ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        md5_gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        md5_hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        md5_ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        safe_add(x: any, y: any): number;
        bit_rol(num: any, cnt: any): number;
    }
}
declare namespace airkit {
    class EventArgs {
        private _type;
        private _data;
        constructor(...args: any[]);
        init(...args: any[]): void;
        get(index: number): any;
        get type(): string;
        set type(t: string);
    }
}
declare namespace airkit {
    class EventCenter extends Singleton {
        private _event;
        private _evtArgs;
        private static instance;
        static get Instance(): EventCenter;
        constructor();
        static on(type: string, caller: any, fun: Function): void;
        static off(type: string, caller: any, fun: Function): void;
        static dispatchEvent(type: string, ...args: any[]): void;
        static clear(): void;
    }
}
declare namespace airkit {
    class EventDispatcher {
        private _dicFuns;
        private _evtArgs;
        constructor();
        on(type: string, caller: any, fun: Function): void;
        off(type: string, caller: any, fun: Function): void;
        dispatchEvent(type: string, args: EventArgs): void;
        dispatch(type: string, ...args: any[]): void;
        clear(): void;
    }
}
declare namespace airkit {
    class Event {
        static PROGRESS: string;
        static COMPLETE: string;
        static ERROR: string;
    }
    class EventID {
        static BEGIN_GAME: string;
        static RESTART_GAEM: string;
        static STOP_GAME: string;
        static PAUSE_GAME: string;
        static ON_SHOW: string;
        static ON_HIDE: string;
        static CHANGE_SCENE: string;
        static RESIZE: string;
        static BEGIN_MODULE: string;
        static END_MODULE: string;
        static UI_OPEN: string;
        static UI_CLOSE: string;
        static UI_LANG: string;
    }
    class LoaderEventID {
        static RESOURCE_LOAD_COMPLATE: string;
        static RESOURCE_LOAD_PROGRESS: string;
        static RESOURCE_LOAD_FAILED: string;
        static LOADVIEW_OPEN: string;
        static LOADVIEW_COMPLATE: string;
        static LOADVIEW_PROGRESS: string;
    }
}
declare namespace airkit {
    interface ISignal {
        dispatch(arg: any): any;
        on(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[]): any;
        once(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[]): any;
        off(caller: any, method: (arg: any, ...args: any[]) => any): any;
        destory(): any;
    }
}
declare namespace airkit {
    class Signal<T> implements ISignal {
        private _listener;
        constructor();
        destory(): void;
        dispatch(arg?: T): void;
        has(caller: any): boolean;
        on(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]): void;
        once(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]): void;
        off(caller: any, method: (arg: T, ...args: any[]) => any): void;
        private makeSureListenerManager;
    }
    class SignalListener {
        private handlers;
        private stopped;
        constructor();
        destory(): void;
        has(caller: any): boolean;
        on(caller: any, method: Function, args: any[], once?: boolean): Handler;
        off(caller: any, method: Function): void;
        offAll(caller: any, method: Function): void;
        clear(): void;
        stop(): void;
        execute(...args: any[]): void;
    }
}
declare namespace airkit {
    function L(key: string, ...args: any[]): string;
    class LangManager extends Singleton {
        private _curLang;
        private static instance;
        static get Instance(): LangManager;
        init(): void;
        destory(): void;
        changeLang(lang: string): Promise<any>;
        getText(lang: string, key: string): string;
        get curLang(): string;
    }
}
declare namespace airkit {
    interface ILoadingView {
        onOpen(total: number): void;
        setTips(s: string): void;
        setProgress(cur: number, total: number): void;
        onClose(): void;
    }
}
declare namespace airkit {
    class LoaderManager extends Singleton {
        _dicLoadView: NDictionary<ILoadingView>;
        static loaders: NDictionary<string>;
        static registerLoadingView(view_type: number, className: string, cls: any): void;
        private static instance;
        static get Instance(): LoaderManager;
        setup(): void;
        destroy(): boolean;
        private registerEvent;
        private unRegisterEvent;
        private onLoadViewEvt;
        private show;
        updateView(view: any, total: number, tips: string): void;
        private setProgress;
        private close;
    }
}
declare namespace airkit {
    const FONT_SIZE_4 = 18;
    const FONT_SIZE_5 = 22;
    const FONT_SIZE_6 = 25;
    const FONT_SIZE_7 = 29;
    class ResourceManager extends Singleton {
        static FONT_Yuanti: string;
        static Font_Helvetica: string;
        static FONT_DEFAULT: string;
        static FONT_DEFAULT_SIZE: number;
        private _dicLoaderUrl;
        private _minLoaderTime;
        static DefaultGroup: string;
        static SystemGroup: string;
        private _aniAnimDic;
        onAniResUpdateSignal: Signal<string>;
        private static instance;
        static get Instance(): ResourceManager;
        setup(): void;
        protected static asyncLoad(url: string | string[], progress?: Handler, type?: typeof cc.Asset, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean): Promise<any>;
        destroy(): boolean;
        update(dt: number): void;
        getRes(url: string): any;
        loadRes(url: string, type?: typeof cc.Asset, viewType?: number, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean): Promise<any>;
        loadArrayRes(arr_res: Array<{
            url: string;
            type: typeof cc.Asset;
        }>, viewType?: number, tips?: string, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean): Promise<any>;
        onLoadComplete(viewType: number, ...args: any[]): void;
        onLoadProgress(viewType: number, total: number, tips: string, progress: number): void;
        private refreshResourceTime;
        clearRes(url: string): any;
        cleanTexture(group: string): void;
        setAniAnim(ani: string, atlas: string, group: string): void;
        createFuiAnim(pkgName: string, resName: string, path: string, group?: string): Promise<any>;
        static imageProxy(image: fgui.GLoader, skin: string, proxy?: string, atlas?: string): Promise<any>;
    }
}
declare namespace airkit {
    class Log {
        static LEVEL: LogLevel;
        static format(format: any, ...args: any[]): string;
        static debug(format: any, ...args: any[]): string;
        static info(format: any, ...args: any[]): string;
        static warning(format: any, ...args: any[]): string;
        static error(format: any, ...args: any[]): string;
        static exception(format: any, ...args: any[]): string;
        static dump(value: any): void;
    }
}
declare namespace airkit {
    class BaseModule extends cc.Node {
        name: string;
        constructor();
        setup(args: number): void;
        start(): void;
        update(dt: number): void;
        protected registerEvent(): void;
        protected unRegisterEvent(): void;
        static res(): Array<any>;
        static loaderTips(): string;
        static loaderType(): number;
        private registerSignalEvent;
        private unregisterSignalEvent;
        protected signalMap(): any;
        dispose(): void;
    }
}
declare namespace airkit {
    class Mediator {
        static modules: SDictionary<BaseModule>;
        private static instance;
        static get Instance(): Mediator;
        setup(): void;
        static register(name: string, cls: any): void;
        static call(name: string, funcName?: string, ...args: any[]): Promise<any>;
        protected static callFunc(m: BaseModule, funcName: string, args: any[]): any;
        protected static loadResource(m: BaseModule, clas: any): Promise<any>;
        destroy(): void;
        clear(): void;
        update(dt: number): void;
        private registerEvent;
        private unRegisterEvent;
    }
}
declare namespace airkit {
    enum eHttpRequestType {
        TypeText = 0,
        TypeJson = 1,
        TypePB = 2
    }
    const POST = "POST";
    const GET = "GET";
    const CONTENT_TYPE_TEXT = "application/x-www-form-urlencoded";
    const CONTENT_TYPE_JSON = "application/json";
    const CONTENT_TYPE_PB = "application/octet-stream";
    const RESPONSE_TYPE_TEXT = "text";
    const RESPONSE_TYPE_JSON = "json";
    const RESPONSE_TYPE_XML = "xml";
    const RESPONSE_TYPE_BYTE = "arraybuffer";
    const HTTP_REQUEST_TIMEOUT = 10000;
    class Http {
        static currentRequsts: number;
        static maxRequest: number;
        static request(url: string, method: string, reqType: eHttpRequestType, header: any[], data?: any, responseType?: string): Promise<any>;
        static get(url: string, reqType?: eHttpRequestType, header?: any, responseType?: string): Promise<any>;
        static post(url: string, params: any, reqType?: eHttpRequestType, header?: any, responseType?: string): Promise<any>;
    }
}
declare namespace airkit {
    class HttpRequest extends cc.Node {
        protected _http: XMLHttpRequest;
        private static _urlEncode;
        protected _responseType: string;
        protected _data: any;
        protected _url: string;
        send(url: string, data?: any, method?: string, responseType?: string, headers?: any[] | null): void;
        protected _onProgress(e: any): void;
        protected _onAbort(e: any): void;
        protected _onError(e: any): void;
        protected _onLoad(e: any): void;
        protected error(message: string): void;
        protected complete(): void;
        protected clear(): void;
        get url(): string;
        get data(): any;
        get http(): any;
    }
}
declare namespace airkit {
    class State<T> {
        _owner: StateMachine<T>;
        _entity: T;
        _status: number;
        protected _times: number;
        protected _tick: number;
        constructor(entity: T, status: number);
        enter(): void;
        update(dt: number): void;
        exit(): void;
    }
}
declare namespace airkit {
    class StateMachine<T> {
        _currentState: State<T>;
        _previousState: State<T>;
        _globalState: State<T>;
        constructor();
        update(dt: number): void;
        changeState(_state: any): void;
        setCurrentState(_state: any): void;
        setGlobalState(_state: any): void;
        clearAllState(): void;
        get currentState(): State<T>;
        get previousState(): State<T>;
        get globalState(): State<T>;
    }
}
declare namespace airkit {
    interface WSMessage {
        decode(msg: any, endian: string): boolean;
        encode(endian: string): any;
        getID(): number;
    }
    class JSONMsg implements WSMessage {
        private static REQ_ID;
        private ID;
        uid: string;
        cmd: string;
        msgType: number;
        data: any;
        private static getSeq;
        decode(msg: any, endian: string): boolean;
        encode(endian: string): any;
        getID(): number;
    }
    class PBMsg implements WSMessage {
        private receiveByte;
        private ID;
        constructor();
        getID(): number;
        decode(msg: any, endian: string): boolean;
        encode(endian: string): any;
    }
}
declare namespace airkit {
    class BaseView extends fgui.GComponent implements IUIPanel {
        protected _isOpen: boolean;
        protected _UIID: number;
        objectData: any;
        pkgName: string;
        resName: string;
        _view: fgui.GComponent;
        private _destory;
        private _viewID;
        private static __ViewIDSeq;
        constructor();
        createPanel(pkgName: string, resName: string): void;
        debug(): void;
        setup(args: any): void;
        dispose(): void;
        isDestory(): boolean;
        panel(): fgui.GComponent;
        bg(): fgui.GComponent;
        setVisible(bVisible: boolean): void;
        setUIID(id: number): void;
        get UIID(): number;
        get viewID(): number;
        onCreate(args: any): void;
        onDestroy(): void;
        update(dt: number): boolean;
        getGObject(name: string): fgui.GObject;
        onEnter(): void;
        onLangChange(): void;
        static res(): Array<any>;
        static loaderTips(): string;
        static loaderType(): number;
        protected signalMap(): Array<any>;
        protected eventMap(): Array<any>;
        protected registerEvent(): void;
        protected unRegisterEvent(): void;
        protected staticCacheUI(): any[];
        loadResource(group: string, clas: any): Promise<any>;
        onAssetLoaded(): void;
        private registerSignalEvent;
        private unregisterSignalEvent;
        private registeGUIEvent;
        private unregisteGUIEvent;
        doClose(): boolean;
    }
}
declare namespace airkit {
    interface IPopupDelegate {
        onPopupClick(tag: string, btnType: ePopupButton): void;
    }
}
declare namespace airkit {
    interface IUIPanel {
        setup(...args: any[]): void;
        dispose(): void;
        setVisible(bVisible: boolean): void;
        setUIID(id: number): void;
        update(dt: number): boolean;
        loadResource(group: string, clas: any): Promise<any>;
        removeFromParent(): void;
        panel(): fgui.GComponent;
        bg(): fgui.GComponent;
    }
}
declare namespace airkit {
    class Layer extends fgui.GComponent {
        constructor();
        debug(): void;
    }
    class LayerManager extends Singleton {
        static BG_WIDTH: number;
        static BG_HEIGHT: number;
        private static _root;
        private static _topLayer;
        private static _loadingLayer;
        private static _systemLayer;
        private static _tooltipLayer;
        private static _popupLayer;
        private static _uiLayer;
        private static _mainLayer;
        private static _bgLayer;
        private static layers;
        static get stage(): fgui.GComponent;
        static getLayer(t: eUILayer): fgui.GComponent;
        static setup(root: fgui.GComponent): void;
        protected static registerEvent(): void;
        protected static unRegisterEvent(): void;
        static resize(): void;
        static destroy(): void;
        static removeAll(): void;
        static get root(): fgui.GComponent;
        static get bgLayer(): fgui.GComponent;
        static addBg(url: string): fgui.GLoader;
        static get mainLayer(): fgui.GComponent;
        static get uiLayer(): fgui.GComponent;
        static get popupLayer(): fgui.GComponent;
        static get tooltipLayer(): fgui.GComponent;
        static get systemLayer(): fgui.GComponent;
        static get loadingLayer(): fgui.GComponent;
        static get topLayer(): fgui.GComponent;
    }
}
declare namespace airkit {
    class PopupView extends BaseView implements IUIPanel {
        callback: Function;
        closeBtn: fgui.GButton;
        bgTouch: boolean;
        constructor();
        update(dt: number): boolean;
        setup(args: any): void;
        onEnter(): void;
        onOpen(): void;
        closeButton(): fgui.GButton;
        setupTouchClose(): void;
        pressClose(): void;
        onClose(): void;
        dispose(): void;
        loadResource(group: string, clas: any): Promise<any>;
    }
}
declare namespace airkit {
    class SceneManager {
        static scenes: NDictionary<string>;
        static registerScene(scene_type: number, name: string, cls: any): any;
        private _curScene;
        private static instance;
        static get Instance(): SceneManager;
        setup(): void;
        destroy(): void;
        update(dt: number): void;
        private registerEvent;
        private unRegisterEvent;
        private resize;
        private onChangeScene;
        private onComplete;
        gotoScene(scene_type: number, args?: any): void;
        private exitScene;
    }
}
declare namespace airkit {
    class UIManager extends Singleton {
        private _dicConfig;
        private _dicUIView;
        private _UIQueues;
        private static instance;
        static get Instance(): UIManager;
        constructor();
        empty(): boolean;
        show(id: number, ...args: any[]): Promise<any>;
        close(id: number, animType?: number): Promise<any>;
        clearPanel(id: number, panel: IUIPanel, loader_info: any): boolean;
        closeAll(exclude_list?: Array<number>): void;
        popup(id: number, ...args: any[]): void;
        alert(id: number, ...args: any[]): void;
        findPanel(id: number): IUIPanel;
        isPanelOpen(id: number): boolean;
        tipsPopup(toastLayer: fgui.GComponent, target: fgui.GComponent, view: fgui.GComponent, duration?: number, fromProps?: any, toProps?: any, usePool?: boolean): Promise<any>;
        singleToast(toastLayer: fgui.GComponent, target: fgui.GComponent, view: fgui.GComponent, duration: number, speedUp: boolean, usePool?: boolean, x?: number, y?: number): Promise<any>;
        toast(toastLayer: fgui.GComponent, target: fgui.GComponent, view: fgui.GComponent, duration: number, speedUp: boolean, usePool?: boolean, x?: number, y?: number): Promise<any>;
        setup(): void;
        destroy(): boolean;
        update(dt: number): void;
        addUIConfig(info: UIConfig): void;
        clearUIConfig(): void;
        getUIConfig(id: number): UIConfig;
        getUILayerID(id: number): number;
    }
    class AlertInfo {
        callback: Function;
        title: string;
        content: string;
        tips: string;
        buttons: any;
        param: any;
        constructor(callback: Function, title: string, content: string, tips?: string, buttons?: any, param?: any);
    }
    class UIConfig {
        mID: number;
        name: string;
        cls: any;
        mLayer: number;
        mHideDestroy: boolean;
        mAlige: eAligeType;
        constructor(id: number, name: string, cls: any, layer: number, destroy: boolean, alige: eAligeType);
    }
}
declare namespace airkit {
    class LocalDB {
        private static _globalKey;
        static setGlobalKey(key: string): void;
        static has(key: string): boolean;
        static getInt(key: string): number;
        static setInt(key: string, value: number): void;
        static getFloat(key: string): number;
        static setFloat(key: string, value: number): void;
        static getString(key: string): string;
        static setString(key: string, value: string): void;
        static remove(key: string): void;
        static clear(): void;
        private static getFullKey;
    }
}
declare namespace airkit {
    class IntervalTimer {
        private _intervalTime;
        private _nowTime;
        constructor();
        init(interval: number, firstFrame: boolean): void;
        reset(): void;
        update(elapseTime: number): boolean;
    }
}
declare namespace airkit {
    class Timer {
        static Start(): void;
        static get deltaTimeMS(): number;
        static get fixedDeltaTime(): number;
        static get frameCount(): number;
        static get timeScale(): number;
        static set timeScale(scale: number);
    }
}
declare namespace airkit {
    class TimerManager extends Singleton {
        private _idCounter;
        private _removalPending;
        private _timers;
        static TIMER_OBJECT: string;
        private static instance;
        static get Instance(): TimerManager;
        setup(): void;
        destroy(): boolean;
        update(dt: number): void;
        addLoop(rate: number, ticks: number, caller: any, method: Function, args?: Array<any>): number;
        addOnce(rate: number, caller: any, method: Function, args?: Array<any>): number;
        removeTimer(timerId: number): void;
        private remove;
    }
    class TimerObject implements IPoolsObject {
        static objectKey: string;
        id: number;
        isActive: boolean;
        mRate: number;
        mTicks: number;
        mTicksElapsed: number;
        handle: Handler;
        mTime: IntervalTimer;
        constructor();
        init(): void;
        clear(): void;
        set(id: number, rate: number, ticks: number, handle: Handler): void;
        update(dt: number): void;
    }
}
declare namespace airkit {
    enum eArraySortOrder {
        ASCENDING = 0,
        DESCENDING = 1
    }
    class ArrayUtils {
        static insert(arr: any[], value: any, index: number): void;
        static isArray(obj: any): boolean;
        static equip(arr: any[], v: any[]): boolean;
        static removeValue(arr: any[], v: any): void;
        static removeAllValue(arr: any[], v: any): void;
        static containsValue(arr: any[], v: any): boolean;
        static copy(arr: any[]): any[];
        static sort(arr: any[], key: string, order?: eArraySortOrder): void;
        static clear(arr: any[]): void;
        static isEmpty(arr: any[]): Boolean;
    }
}
declare namespace airkit {
    class Byte {
        static BIG_ENDIAN: string;
        static LITTLE_ENDIAN: string;
        private static _sysEndian;
        protected _xd_: boolean;
        private _allocated_;
        protected _d_: any;
        protected _u8d_: any;
        protected _pos_: number;
        protected _length: number;
        static getSystemEndian(): string;
        constructor(data?: any);
        get buffer(): ArrayBuffer;
        get endian(): string;
        set endian(value: string);
        set length(value: number);
        get length(): number;
        private _resizeBuffer;
        getString(): string;
        readString(): string;
        getFloat32Array(start: number, len: number): any;
        readFloat32Array(start: number, len: number): any;
        getUint8Array(start: number, len: number): Uint8Array;
        readUint8Array(start: number, len: number): Uint8Array;
        getInt16Array(start: number, len: number): any;
        readInt16Array(start: number, len: number): any;
        getFloat32(): number;
        readFloat32(): number;
        getFloat64(): number;
        readFloat64(): number;
        writeFloat32(value: number): void;
        writeFloat64(value: number): void;
        getInt32(): number;
        readInt32(): number;
        getUint32(): number;
        readUint32(): number;
        writeInt32(value: number): void;
        writeUint32(value: number): void;
        getInt16(): number;
        readInt16(): number;
        getUint16(): number;
        readUint16(): number;
        writeUint16(value: number): void;
        writeInt16(value: number): void;
        getUint8(): number;
        readUint8(): number;
        writeUint8(value: number): void;
        _getUInt8(pos: number): number;
        _readUInt8(pos: number): number;
        _getUint16(pos: number): number;
        _readUint16(pos: number): number;
        private _rUTF;
        getCustomString(len: number): string;
        readCustomString(len: number): string;
        get pos(): number;
        set pos(value: number);
        get bytesAvailable(): number;
        clear(): void;
        __getBuffer(): ArrayBuffer;
        writeUTFBytes(value: string): void;
        writeUTFString(value: string): void;
        readUTFString(): string;
        getUTFString(): string;
        readUTFBytes(len?: number): string;
        getUTFBytes(len?: number): string;
        writeByte(value: number): void;
        readByte(): number;
        getByte(): number;
        _ensureWrite(lengthToEnsure: number): void;
        writeArrayBuffer(arraybuffer: any, offset?: number, length?: number): void;
        readArrayBuffer(length: number): ArrayBuffer;
    }
}
declare namespace airkit {
    function bytes2Uint8Array(data: any, endian: string): Uint8Array;
    function bytes2String(data: any, endian: string): string;
    function string2ArrayBuffer(s: string): ArrayBuffer;
    function string2Uint8Array(str: any): Uint8Array;
    function uint8Array2String(fileData: any): string;
}
declare namespace airkit {
    class ClassUtils {
        private static _classMap;
        static regClass(className: string, classDef: any): void;
        static regShortClassName(classes: any[]): void;
        static getRegClass(className: string): any;
        static getClass(className: string): any;
        static getInstance(className: string): any;
        static copyObject(obj: any): any;
        static getObjectValue(obj: any, key: string, defVal?: any): any;
        static callFunc(obj: any, funcName: string, args?: any[]): any;
        static classKey(obj: any): string;
    }
}
declare namespace airkit {
    class DateUtils {
        static serverTimeDiff: number;
        static serverTime: number;
        static setServerTime(time: number): void;
        static getNow(): number;
        static getNowMS(): number;
        static isTheSameMonth(nTime: number, nSecond: number): boolean;
        static isTheSameDayByNow(nTime: number, nSecond: number): boolean;
        static passedDays(nTime1: number, nTime2: number, nSecondOffset?: number): number;
        static currentYMDHMS(): string;
        static currentHour(): number;
        static formatDateTime(timeValue: any): string;
        static countdown(time: number, format?: string): string;
        static formatTime(time: number, format?: string): string;
        static format2Time(time: number): string;
        static format2Time2(time: number): string;
    }
}
declare namespace airkit {
    class DicUtils {
        static getKeys(d: Object): any[];
        static getValues(d: Object): any[];
        static clearDic(dic: Object): void;
        static foreach(dic: Object, compareFn: (key: any, value: any) => boolean): void;
        static isEmpty(dic: Object): Boolean;
        static getLength(dic: Object): number;
        static assign(obj: any, dic: any): void;
    }
}
declare namespace airkit {
    function displayWidth(): number;
    function displayHeight(): number;
    class DisplayUtils {
        static removeAllChild(container: fgui.GComponent): void;
        static colorBG(color: cc.Color, w: number, h: number): fgui.GGraph;
        static popupDown(panel: any, handler?: Handler, ignoreAnchor?: boolean): void;
        static popup(view: fgui.GComponent, handler?: Handler, ignoreAnchor?: boolean): void;
        static hide(panel: IUIPanel, handler?: Handler): void;
    }
}
declare namespace airkit {
    class Handler {
        protected static _pool: Handler[];
        private static _gid;
        caller: Object | null;
        method: Function | null;
        args: any[] | null;
        once: boolean;
        protected _id: number;
        constructor(caller?: Object | null, method?: Function | null, args?: any[] | null, once?: boolean);
        setTo(caller: any, method: Function | null, args: any[] | null, once?: boolean): Handler;
        run(): any;
        runWith(data: any): any;
        clear(): Handler;
        recover(): void;
        static create(caller: any, method: Function | null, args?: any[] | null, once?: boolean): Handler;
    }
}
declare namespace airkit {
    enum OrbitType {
        Line = 3,
        Curve = 2
    }
    class MathUtils {
        static BYTE_TO_M: number;
        static BYTE_TO_K: number;
        static Deg2Rad: number;
        static Rad2Deg: number;
        static Cycle8Points: Array<[number, number]>;
        static Cycle9Points: Array<[number, number]>;
        static sign(n: number): number;
        static clamp(n: number, min: number, max: number): number;
        static clamp01(value: number): number;
        static lerp(from: number, to: number, t: number): number;
        static lerpAngle(a: number, b: number, t: number): number;
        static repeat(t: number, length: number): number;
        static randRange(param1: number, param2: number): number;
        static randRange_Int(param1: number, param2: number): number;
        static randRange_Array<T>(arr: Array<T>): T;
        static clampDegrees(degrees: number): number;
        static clampRadians(radians: number): number;
        static getDistance(x1: number, y1: number, x2: number, y2: number): number;
        static getSquareDistance(x1: number, y1: number, x2: number, y2: number): number;
        static getLineRadians(x1: number, y1: number, x2: number, y2: number): number;
        static getLineDegree(x1: number, y1: number, x2: number, y2: number): number;
        static getPointRadians(x: number, y: number): number;
        static getPointDegree(x: number, y: number): number;
        static toDegree(radian: number): number;
        static toRadian(degree: number): number;
        static moveTowards(current: number, target: number, maxDelta: number): number;
        static radians4point(ax: any, ay: any, bx: any, by: any): number;
        static pointAtCircle(px: any, py: any, radians: any, radius: any): cc.Vec2;
        static getPos(pts: cc.Vec2[], t: number, type: OrbitType): cc.Vec2;
        static getRotation(startX: number, startY: number, endX: number, endY: number): number;
        static getBezierat(pts: cc.Vec2[], t: number): cc.Vec2;
        static getDirection(angle: number): cc.Vec2;
        static normalize(vec: cc.Vec2): cc.Vec2;
        static distance(startX: number, startY: number, endX: number, endY: number): number;
        private static getVerticalVector;
        static getCtrlPoint(start: cc.Vec2, end: cc.Vec2, raise?: number, xOffset?: number, yOffset?: number): cc.Vec2;
        static getDefaultPoints(start: cc.Vec2, end: cc.Vec2, xOffset?: number, yOffset?: number, raise?: number): Array<cc.Vec2>;
    }
}
declare namespace airkit {
    class NumberUtils {
        static toFixed(value: number, p: number): number;
        static toInt(value: number): number;
        static isInt(value: number): boolean;
        static reserveNumber(num: number, size: number): number;
        static reserveNumberWithZero(num: number, size: number): string;
    }
}
declare namespace airkit {
    class StringUtils {
        static get empty(): string;
        static isNullOrEmpty(s: string): boolean;
        static toInt(str: string): number;
        static toNumber(str: string): number;
        static stringCut(str: string, len: number, fill?: string): string;
        static getNumBytes(str: string): number;
        static addZero(str: string, len: number, dir?: number): string;
        static isString(obj: any): boolean;
        static trim(input: string): string;
        static trimLeft(input: string): string;
        static trimRight(input: string): string;
        static minuteFormat(seconds: number): string;
        static hourFormat(seconds: number): string;
        static format(str: string, ...args: any[]): string;
        static formatWithDic(str: string, dic: any): string;
        static beginsWith(input: string, prefix: string): boolean;
        static endsWith(input: string, suffix: string): boolean;
        static getGUIDString(): string;
    }
}
declare namespace airkit {
    class TouchUtils {
    }
}
declare namespace airkit {
    class TweenUtils {
        static EaseBezier: number;
        constructor(target: fgui.GObject);
        private _target;
        private _steps;
        private _isPlaying;
        private _updateFunc;
        static get(target: fgui.GObject): TweenUtils;
        get target(): fgui.GObject;
        setOnUpdate(callback: Function): void;
        onUpdate(gt: fgui.GTweener): void;
        to(props: any, duration: number, ease?: number, complete?: Handler, delay?: number): TweenUtils;
        delay(delay: number): TweenUtils;
        private trigger;
        private onStepComplete;
        clear(): void;
        static scale(view: fgui.GObject): void;
        static appear(view: fgui.GObject): void;
    }
}
declare namespace airkit {
    class UrlUtils {
        static getFileExte(url: string): string;
        static getPathWithNoExtend(url: string): string;
    }
}
declare namespace airkit {
    class Utils {
        static openURL(url: string): void;
        static getLocationParams(): SDictionary<string>;
        static obj2query(obj: any): string;
        static injectProp(target: Object, data?: Object, callback?: Function, ignoreMethod?: boolean, ignoreNull?: boolean, keyBefore?: string): boolean;
        static parseXMLFromString: Function;
    }
    class FlagUtils {
        static hasFlag(a: number, b: number): boolean;
        static insertFlag(a: number, b: number): number;
        static removeFlag(a: number, b: number): number;
    }
    function assert(condition: any, msg?: string): void;
    function assertNullOrNil(condition: any, msg?: string): void;
    function checkNullOrNil(x: any): boolean;
    function checkEmptyDic(x: any): boolean;
}
declare namespace airkit {
    class ZipUtils {
        static unzip(ab: ArrayBuffer): Promise<any>;
        static parseZip(ab: ArrayBuffer): Promise<any>;
        static parseZipFile(jszip: any, filename: string): Promise<any>;
    }
}
import ak = airkit;