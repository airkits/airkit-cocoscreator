declare namespace airkit {
    /**
     * 单列
     * @author ankye
     * @time 2018-7-6
     */
    class Singleton {
        private static classKeys;
        private static classValues;
        constructor();
    }
}
declare namespace airkit {
    function fixedModalLayer(url: string): void;
    /**
     * 框架管理器
     * @author ankye
     * @time 2018-7-6
     */
    class Framework extends Singleton {
        private _isStopGame;
        private _mainloopHandle;
        private static instance;
        static get Instance(): Framework;
        constructor();
        /**
         * 初始化
         * @param	root	根节点，可以是stage
         */
        setup(root: fgui.GComponent, log_level?: LogLevel, design_width?: number, design_height?: number, screen_mode?: string, frame?: number): void;
        destroy(): boolean;
        /**
         * 游戏主循环
         */
        update(dt: number): void;
        preTick(dt: number): void;
        tick(dt: number): void;
        endTick(dt: number): void;
        /**暂停游戏*/
        pauseGame(): void;
        /**结束暂停*/
        resumeGame(): void;
        get isStopGame(): boolean;
        /**打印设备信息*/
        private printDeviceInfo;
    }
}
declare namespace airkit {
    class AudioManager extends Singleton {
        private _effectSwitch;
        private _musicSwitch;
        /**
         * 背景音乐id，唯一
         */
        private _musicID;
        private _audioIDs;
        constructor();
        private static instance;
        static get Instance(): AudioManager;
        /**
         * 设置背景音乐开关，关闭(false)将关闭背景音乐
         *
         * @memberof SoundsManager
         */
        set musicSwitch(v: boolean);
        /**
         * 设置音效开关，关闭(false)将关闭所有的音效
         *
         * @memberof SoundsManager
         */
        set effectSwitch(v: boolean);
        /**
         * 播放背景音乐
         * @param url
         * @param loopCount default -1 = loop for ever,
         * @param complete
         * @param startTime 设置开始秒
         */
        playMusic(url: string, loopCount?: number, complete?: Handler, startTime?: number): void;
        getAudioClip(url: string): Promise<cc.AudioClip>;
        /**
         * 播放音效
         * @param url
         * @param loopCount default -1 = loop for ever,
         * @param complete
         * @param startTime
         */
        playEffect(url: string, loopCount?: number, complete?: Handler, startTime?: number): void;
        /**
         * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
         * @param volume
         */
        setMusicVolume(volume: number): void;
        /**
         * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
         * @param volume
         * @param url
         */
        setEffectVolume(volume: number, url?: string): void;
        /**
         * 停止所有音乐
         */
        stopAll(): void;
        /**
         * 停止播放所有音效（不包括背景音乐）
         */
        stopAllEffect(): void;
        /**
         * 停止播放背景音乐
         */
        stopMusic(): void;
        /**
         * 暂停背景音乐
         */
        pauseMusic(): void;
        /**
         * 暂停播放音效
         * @param url
         */
        pauseEffect(url?: string): void;
        /**
         * 暂停所有的
         */
        pauseAll(): void;
        /**
         * 恢复背景音乐
         */
        resumeMusic(): void;
        /**
         * 恢复音效
         * @param url
         */
        resumeEffect(url: string): void;
        /**
         * 恢复所有的音乐和音效
         */
        resumeAll(): void;
    }
}
declare namespace airkit {
    /**
     * 颜色
     * @author ankye
     * @time 2018-7-3
     */
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
    /**
     * 字典-键为number
     * TODO:Object的键不支持泛型
     * @author ankye
     * @time 2018-7-6
     */
    class NDictionary<TValue> {
        private _dic;
        add(key: number, value: TValue): boolean;
        remove(key: number): void;
        set(key: number, value: TValue): void;
        has(key: number): boolean;
        getValue(key: number): TValue;
        clear(): void;
        getkeys(): Array<number>;
        getValues(): Array<TValue>;
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        foreach(compareFn: (key: number, value: TValue) => boolean): void;
        get length(): number;
    }
    /**
     * 字典-键为string
     * @author ankye
     * @time 2018-7-6
     */
    class SDictionary<TValue> {
        private _dic;
        add(key: string, value: TValue): boolean;
        set(key: string, value: TValue): void;
        remove(key: string): void;
        has(key: string): boolean;
        getValue(key: string): TValue;
        getkeys(): Array<string>;
        getValues(): Array<TValue>;
        clear(): void;
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        foreach(compareFn: (key: string, value: TValue) => boolean): void;
        get length(): number;
    }
}
declare namespace airkit {
    /**
     * 二维数组
     * @author ankye
     * @time 2018-7-8
     */
    class DoubleArray {
        private _array;
        constructor(rows: number, cols: number, value: any);
        set(row: number, col: number, value: any): void;
        get(row: number, col: number): any;
        clear(): void;
    }
}
declare namespace airkit {
    /**对象池基类*/
    interface IPoolsObject {
        init(): any;
    }
}
declare namespace airkit {
    /**
     * 双向循环链表
     * 实际测试100000增加和删除，发现:
     * 1.如果是在开始位置插入和删除，比Array快；基数越大，差距越大
     * 2.中间位置插入和删除，比Array慢；基数越大，差距越大
     * 3.末端操作，效率差距不大
     * 4.耗时比较多的是GetNode函数
     * @author ankye
     * @time 2018-7-6
     */
    class LinkList<T> {
        /**表头*/
        private _linkHead;
        /**节点个数*/
        private _size;
        constructor();
        /**在链表末尾添加*/
        add(t: T): void;
        /**将节点插入到第index位置之前*/
        insert(index: number, t: T): void;
        /**追加到index位置之后*/
        append(index: number, t: T): void;
        /**
         * 删除节点，有效节点索引为[0,_size-1]
         */
        del(index: number): void;
        delFirst(): void;
        delLast(): void;
        get(index: number): T;
        getFirst(): T;
        getLast(): T;
        /**通过索引查找*/
        private getNode;
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        foreach(compareFn: (value: T) => boolean): void;
        isEmpty(): boolean;
        get length(): number;
    }
}
declare namespace airkit {
    /**
     * 对象缓存
     * 1.如果继承IPoolsObject，并实现init接口函数；创建时会自动调用init函数
     * @author ankye
     * @time 2018-7-11
     */
    class ObjectPools {
        private static poolsMap;
        /**
         * 获取一个对象，不存在则创建,classDef必须要有 objectKey的static变量
         * @param classDef  类名
         */
        static get(classDef: any): any;
        /**
         * 回收对象
         * @param obj  对象实例
         */
        static recover(obj: any): void;
        static clearAll(): void;
        static clear(sign: string): void;
    }
}
/**
 * 队列：先入先出
 * @author ankye
 * @time 2018-7-6
 */
declare namespace airkit {
    class Queue<T> {
        private _list;
        /**添加到队列尾*/
        enqueue(item: T): void;
        /**获取队列头，并删除*/
        dequeue(): T;
        /**获取队列头，并不删除*/
        peek(): T;
        /**查询某个元素，并不删除*/
        seek(index: number): T;
        /**转换成标准数组*/
        toArray(): Array<T>;
        /**是否包含指定元素*/
        has(item: T): boolean;
        /**清空*/
        clear(): void;
        get length(): number;
        foreach(compareFn: (a: T) => boolean): void;
    }
}
declare namespace airkit {
    /**
     * Size大小 宽高
     * @author ankye
     * @time 2018-7-3
     */
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
    /**
     * 栈：后入先出
     * @author ankye
     * @time 2018-7-6
     */
    class Stack<T> {
        private _list;
        /**添加数据*/
        push(item: T): void;
        /**获取栈顶元素，并删除*/
        pop(): T;
        /**获取栈顶元素，并不删除*/
        peek(): T;
        /**转换成标准数组*/
        toArray(): Array<T>;
        /**是否包含指定元素*/
        contains(item: T): boolean;
        /**清空*/
        clear(): void;
        get length(): number;
        foreach(compareFn: (a: T) => boolean): void;
    }
}
declare namespace airkit {
    type Dict<T> = {
        [key: string]: T;
    };
    type Point = cc.Vec2;
    enum eLoaderType {
        NONE = 0,
        VIEW = 1,
        FULL_SCREEN = 2,
        WINDOW = 3,
        NET_LOADING = 4,
        CUSTOM_1 = 5,
        CUSTOM_2 = 6,
        CUSTOM_3 = 7
    }
    enum eUIType {
        SHOW = 0,
        POPUP = 1
    }
    /**
     * UI层级
     */
    enum eUILayer {
        BG = 0,
        MAIN = 1,
        GUI = 2,
        LOADING = 3
    }
    enum LogLevel {
        DEBUG = 7,
        INFO = 6,
        WARNING = 5,
        ERROR = 4,
        EXCEPTION = 3
    }
    enum eDlgResult {
        YES = 1,
        NO = 2
    }
}
declare namespace airkit {
    /**
     * 配置表
     * @author ankye
     * @time 2018-7-11
     */
    class ConfigItem {
        url: string;
        name: string;
        key: any;
        constructor(url: string, name: string, key: any);
    }
}
declare namespace airkit {
    /**
     * 配置表管理器
     * @author ankye
     * @time 2017-7-9
     */
    class ConfigManger extends Singleton {
        private _listTables;
        private static instance;
        static zipUrl: string;
        static get Instance(): ConfigManger;
        /**初始化数据*/
        init(keys: any, zipPath?: string): void;
        /**释放数据*/
        release(): void;
        /**开始加载*/
        loadAll(url?: string): Promise<any>;
        /**
         * 获取列表，fiter用于过滤,可以有多个值，格式为 [["id",this.id],["aaa","bbb"]]
         * @param table
         * @param filter 目前只实现了绝对值匹配
         */
        query(table: string, filter?: Array<any>): Array<any>;
        getInfo(table: string, key: string | string[]): any;
        /**定义需要前期加载的资源*/
        get listTables(): Array<ConfigItem>;
    }
    function getCInfo<TValue>(table: string, key: string | string[]): TValue;
    function getCList<TValue>(table: string, query: Array<[string, number | string]>): Array<TValue>;
    function queryCInfo<TValue>(table: string, query: Array<[string, number | string]>): TValue;
}
declare namespace airkit {
    /**
     * json配置表
     * @author ankye
     * @time 2018-7-11
     */
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
        /**返回表*/
        getConfig(table: string): any;
        /**返回一行*/
        getInfo(table: string, key: string | string[]): any;
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
    /**
     * 事件参数
     * @author ankye
     * @time 2018-7-6
     */
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
    /**
     * 全局事件
     * @author ankye
     * @time 2018-7-6
     */
    class EventCenter extends Singleton {
        private _event;
        private _evtArgs;
        private static instance;
        static get Instance(): EventCenter;
        constructor();
        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        static on(type: string, caller: any, fun: Function): void;
        /**
         * 移除监听
         */
        static off(type: string, caller: any, fun: Function): void;
        /**
         * 派发事件
         */
        static dispatchEvent(type: string, ...args: any[]): void;
        static clear(): void;
    }
}
declare namespace airkit {
    /**
     * 事件
     * @author ankye
     * @time 2018-7-6
     */
    class EventDispatcher {
        private _dicFuns;
        private _evtArgs;
        constructor();
        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        on(type: string, caller: any, fun: Function): void;
        /**
         * 移除监听
         */
        off(type: string, caller: any, fun: Function): void;
        /**
         * 派发事件，注意参数类型为EventArgs
         */
        dispatchEvent(type: string, args: EventArgs): void;
        /**
         * 派发事件
         */
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
        static ENTER_MODULE: string;
        static EXIT_MODULE: string;
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
        /**
         * 派发信号
         * @param arg
         */
        dispatch(arg: any): any;
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        on(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[]): any;
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        once(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[]): any;
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        off(caller: any, method: (arg: any, ...args: any[]) => any): any;
        destory(): any;
    }
}
declare namespace airkit {
    class Signal<T> implements ISignal {
        private _listener;
        constructor();
        destory(): void;
        /**
         * 派发信号
         * @param arg
         */
        dispatch(arg?: T): void;
        has(caller: any): boolean;
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        on(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]): void;
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        once(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]): void;
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        off(caller: any, method: (arg: T, ...args: any[]) => any): void;
        offAll(): void;
        /**
         * 保证ListenerManager可用
         */
        private makeSureListenerManager;
    }
    class SignalListener {
        private handlers;
        private stopped;
        constructor();
        destory(): void;
        has(caller: any): boolean;
        on(caller: any, method: Function, args: any[], once?: boolean): Handler;
        /**
         * 解除回调
         * @param caller
         * @param method
         */
        off(caller: any, method: Function): void;
        /**
         * 解除所有回调
         * @param caller
         * @param method
         */
        offAll(): void;
        /**
         * 清除所有回调
         */
        clear(): void;
        stop(): void;
        execute(...args: any[]): void;
    }
}
declare namespace airkit {
    interface CLang {
        id: string;
        name: string;
    }
    /**
     * 提供简易获取语言包的方式,配合语言导出脚本
     * @param key LK.xxx  %s,%s..%s.表示参数占位符
     * @param args
     */
    function L(key: string, ...args: any[]): string;
    /**
     * 多语言
     * @author ankye
     * @time 2017-7-9
     */
    class LangManager extends Singleton {
        static lang: string;
        static setLang(lang: string): boolean;
    }
}
declare namespace airkit {
    /**
     * 日志类处理
     * @author ankye
     * @time 2018-7-8
     */
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
        enter(): void;
        exit(): void;
        update(dt: number): void;
        protected registerEvent(): void;
        protected unRegisterEvent(): void;
        static res(): Array<Res>;
        static loaderTips(): string;
        /**是否显示加载界面*/
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
        /**
         * 注册模块
         * @param name
         * @param cls
         */
        static register(name: string, cls: any): void;
        static call(name: string, funcName?: string, ...args: any[]): Promise<any>;
        protected static callFunc(m: BaseModule, funcName: string, args: any[]): any;
        /**处理需要提前加载的资源*/
        protected static loadResource(m: BaseModule, clas: any): Promise<any>;
        destroy(): void;
        clear(): void;
        update(dt: number): void;
        private registerEvent;
        private unRegisterEvent;
    }
}
declare namespace airkit {
    /**     HTTP 请求 wapper
     *      for example
     *	    Http.get("https://one.xxx.com/api/user.php?oid=112",null,null,RESPONSE_TYPE_JSON).then(function(data){
     *		    Log.info("Get :")
     *			Log.Dump(data)
     *		 }).catch(function(reason:any){
     *			Log.Dump(reason)
     *		 })
     *		var params = {}
     *		params["uuid"]= "1111111"
     *		params["oid"]="222222"
     *		params["secret"]="cccc"
     *		params["nickname"]="xxx"
     *		Http.post("https://one.xxx.com/api/login.php",params).then(function(data){
     *			Log.info("Post :")
     *			Log.Dump(data)
     *		}).catch(function(reason:any){
     *			Log.Dump(reason)
     *		})
     */
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
        /**
         * 请求request封装
         *
         * @static
         * @param {string} url
         * @param {string} method
         * @param {eHttpRequestType} reqType
         * @param {any[]} header  (default = []) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         * @param {*} [data]
         * @param {string} [responseType]  responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @returns {Promise<any>}
         * @memberof Http
         */
        static request(url: string, method: string, reqType: eHttpRequestType, header: any[], data?: any, responseType?: string): Promise<any>;
        /**
         * Get 请求
         *
         * @static
         * @param {string} url
         * @param {eHttpRequestType} [reqType] (default = []) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         * @param {*} [header]
         * @param {string} [responseType]  responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @returns {Promise<any>}
         * @memberof Http
         */
        static get(url: string, reqType?: eHttpRequestType, header?: any, responseType?: string): Promise<any>;
        /**
         * POST请求
         *
         * @static
         * @param {string} url
         * @param {*} params
         * @param {eHttpRequestType} [reqType]
         * @param {*} [header]
         * @param {string} [responseType]
         * @returns {Promise<any>}
         * @memberof Http
         */
        static post(url: string, params: any, reqType?: eHttpRequestType, header?: any, responseType?: string): Promise<any>;
    }
}
declare namespace airkit {
    class HttpRequest extends cc.Node {
        /**@private */
        protected _http: XMLHttpRequest;
        /**@private */
        private static _urlEncode;
        /**@private */
        protected _responseType: string;
        /**@private */
        protected _data: any;
        /**@private */
        protected _url: string;
        /**
         * 发送 HTTP 请求。
         * @param	url				请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
         * @param	data			(default = null)发送的数据。
         * @param	method			(default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
         * @param	responseType	(default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @param	headers			(default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         */
        send(url: string, data?: any, method?: string, responseType?: string, headers?: any[] | null): void;
        /**
         * @private
         * 请求进度的侦听处理函数。
         * @param	e 事件对象。
         */
        protected _onProgress(e: any): void;
        /**
         * @private
         * 请求中断的侦听处理函数。
         * @param	e 事件对象。
         */
        protected _onAbort(e: any): void;
        /**
         * @private
         * 请求出错侦的听处理函数。
         * @param	e 事件对象。
         */
        protected _onError(e: any): void;
        /**
         * @private
         * 请求消息返回的侦听处理函数。
         * @param	e 事件对象。
         */
        protected _onLoad(e: any): void;
        /**
         * @private
         * 请求错误的处理函数。
         * @param	message 错误信息。
         */
        protected error(message: string): void;
        /**
         * @private
         * 请求成功完成的处理函数。
         */
        protected complete(): void;
        /**
         * @private
         * 清除当前请求。
         */
        clear(): void;
        /** 请求的地址。*/
        get url(): string;
        /** 返回的数据。*/
        get data(): any;
        /**
         * 本对象所封装的原生 XMLHttpRequest 引用。
         */
        get http(): any;
    }
}
declare namespace airkit {
    enum eStateEnum {
        NONE = 1,
        INIT = 2,
        ENTER = 4,
        RUNNING = 8,
        EXIT = 16,
        DESTROY = 32
    }
    class State<T> {
        protected _owner: StateMachine<T>;
        protected _entity: T;
        protected _state: number;
        protected _status: eStateEnum;
        protected _times: number;
        protected _tick: number;
        constructor(entity: T);
        setStatus(v: number): void;
        resetStatus(v: number): void;
        /**
         * hasStatus
         * @param Status
         * @returns boolean
         * 是否存在运行状态,支持多个状态查询
         */
        hasStatus(v: number): boolean;
        set owner(v: StateMachine<T>);
        set entity(v: T);
        set state(v: number);
        enter(): void;
        update(dt: number): void;
        exit(): void;
        destroy(): void;
    }
}
declare namespace airkit {
    class StateMachine<T> {
        protected _currentState: State<T>;
        protected _previousState: State<T>;
        protected _gState: State<T>;
        protected _states: NDictionary<State<T>>;
        protected _stateQueue: Queue<number>;
        changedSignal: Signal<[number, number]>;
        enterSignal: Signal<number>;
        exitSignal: Signal<number>;
        constructor();
        /**
         * 注册状态
         * @param type
         * @param state
         */
        registerState(type: number, state: State<T>): void;
        /**
         * 移除状态
         * @param type
         */
        unregisterState(type: number): void;
        update(dt: number): void;
        /**
         * 切换状态,如果有上一个状态，先退出上一个状态，再切换到该状态
         * @param type
         */
        changeState(type: number): boolean;
        protected doNextState(): boolean;
        private _stateExit;
        private _stateEnter;
        /**
         * 设置下一个状态，如果队列有，追加到最后，如果当前没有运行的状态，直接运行
         * @param type
         * @returns
         */
        setNextState(type: number): boolean;
        setGlobalState(type: number): boolean;
        clearAllState(): void;
        get currentState(): State<T>;
        get previousState(): State<T>;
        get globalState(): State<T>;
        destory(): void;
    }
}
declare namespace airkit {
    interface IWSMessage {
        unpack(msg: ArrayBuffer, endian: string): IWSMessage;
        pack(req: any, endian: string): ArrayBuffer;
        getID(): number;
    }
}
declare namespace airkit {
    class SocketStatus {
        static SOCKET_CONNECT: string;
        static SOCKET_RECONNECT: string;
        static SOCKET_START_RECONNECT: string;
        static SOCKET_CLOSE: string;
        static SOCKET_NOCONNECT: string;
        static SOCKET_DATA: string;
    }
    enum eSocketMsgType {
        MTRequest = 1,
        MTResponse = 2,
        MTNotify = 3,
        MTBroadcast = 4
    }
    class WebSocketEx extends cc.Node {
        private mSocket;
        private mEndian;
        private _needReconnect;
        private _maxReconnectCount;
        private _reconnectCount;
        private _connectFlag;
        private _isConnected;
        private _handers;
        private _requestTimeout;
        private _msgCls;
        private _remoteAddress;
        constructor();
        /**
         *
         * @param address ws://host:port?token=aaaa
         * @param msgCls
         * @param endian
         * @returns
         */
        initServer(address: string, msgCls: any, endian?: string): Promise<boolean>;
        connect(): Promise<boolean>;
        private wait;
        private addEvents;
        private removeEvents;
        private onSocketOpen;
        private onSocketClose;
        private onSocketError;
        private reconnect;
        private onReceiveMessage;
        request(req: any): Promise<any>;
        close(): void;
        private closeCurrentSocket;
        isConnected(): boolean;
    }
}
/**
 * 本地数据
 * @author ankye
 * @time 2018-7-15
 */
declare namespace airkit {
    class LocalDB {
        private static _globalKey;
        /**
         * 设置全局id，用于区分同一个设备的不同玩家
         * @param	key	唯一键，可以使用玩家id
         */
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
/**
 * 定时执行
 * @author ankye
 * @time 2018-7-11
 */
declare namespace airkit {
    class IntervalTimer {
        private _intervalTime;
        private _nowTime;
        constructor();
        /**
         * 初始化定时器
         * @param	interval	触发间隔
         * @param	firstFrame	是否第一帧开始执行
         */
        init(interval: number, firstFrame: boolean): void;
        reset(): void;
        update(elapseTime: number): boolean;
    }
}
/**
 * 时间
 * @author ankye
 * @time 2018-7-3
 */
declare namespace airkit {
    class Timer {
        static get deltaTimeMS(): number;
        /**游戏启动后，经过的帧数*/
        static get frameCount(): number;
        static get timeScale(): number;
        static set timeScale(scale: number);
    }
}
declare namespace airkit {
    /**
     * 定时器
     * @author ankye
     * @time 2018-7-11
     */
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
        /**
         * 定时重复执行
         * @param	rate	间隔时间(单位毫秒)。
         * @param	ticks	执行次数,-1=forever
         * @param	caller	执行域(this)。
         * @param	method	定时器回调函数：注意，返回函数第一个参数为定时器id，后面参数依次时传入的参数。例OnTime(timer_id:number, args1:any, args2:any,...):void
         * @param	args	回调参数。
         */
        addLoop(rate: number, ticks: number, caller: any, method: Function, args?: Array<any>): number;
        /**
         * 单次执行
         * 间隔时间(单位毫秒)。
         */
        addOnce(rate: number, caller: any, method: Function, args?: Array<any>): number;
        /**
         * 移除定时器
         * @param	timerId	定时器id
         */
        removeTimer(timerId: number): void;
        /**
         * 移除过期定时器
         */
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
        forever: boolean;
        constructor();
        init(): void;
        clear(): void;
        set(id: number, rate: number, ticks: number, handle: Handler, forever: boolean): void;
        update(dt: number): void;
    }
}
declare namespace airkit {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */
    var ViewIDSeq: number;
    function genViewIDSeq(): number;
    class BaseView extends fgui.GComponent implements IUIPanel {
        protected _isOpen: boolean;
        protected _UIID: string;
        objectData: any;
        private _destory;
        private _viewID;
        constructor();
        /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
        set UIID(id: string);
        get UIID(): string;
        get viewID(): number;
        set viewID(v: number);
        debug(): void;
        /**打开*/
        setup(args: any): void;
        /**关闭*/
        dispose(): void;
        isDestory(): boolean;
        /**是否可见*/
        setVisible(bVisible: boolean): void;
        /**初始化，和onDestroy是一对*/
        onCreate(args: any): void;
        /**销毁*/
        onDestroy(): void;
        /**每帧循环：如果覆盖，必须调用super.update()*/
        update(dt: number): boolean;
        /**资源加载结束*/
        onEnable(): void;
        onDisable(): void;
        /**多语言初始化，或语音设定改变时触发*/
        onLangChange(): void;
        static res(): Array<Res>;
        static unres(): void;
        static loaderTips(): string;
        static loaderType(): number;
        protected signalMap(): Array<any>;
        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        protected eventMap(): Array<any>;
        /**自定义事件注册，用于EventCenter派发的事件*/
        protected registerEvent(): void;
        protected unRegisterEvent(): void;
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        protected staticCacheUI(): any[];
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        static loadResource(onAssetLoaded: (v: boolean) => void): void;
        private registerSignalEvent;
        private unregisterSignalEvent;
        /**注册界面事件*/
        private registeGUIEvent;
        private unregisteGUIEvent;
    }
}
declare namespace airkit {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */
    interface DialogResultData {
        result: eDlgResult;
        data: any;
    }
    class Dialog extends fgui.Window implements IUIPanel {
        protected _isOpen: boolean;
        protected _UIID: string;
        objectData: any;
        private _destory;
        private _viewID;
        private _resultData;
        private _clickMask;
        constructor();
        wait(): Promise<DialogResultData>;
        setupClickBg(): void;
        /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
        set UIID(id: string);
        get UIID(): string;
        get viewID(): number;
        set viewID(v: number);
        createDlgView(): fgui.GComponent;
        /**打开*/
        setup(args: any): void;
        protected onShown(): void;
        protected onHide(): void;
        close(data?: {
            result: eDlgResult;
            data: any;
        }): void;
        protected doShowAnimation(): void;
        protected doHideAnimation(): void;
        /**关闭*/
        dispose(): void;
        isDestory(): boolean;
        modalShowAnimation(dt?: number, alpha?: number): void;
        modalHideAnimation(dt?: number, alpha?: number): void;
        /**是否可见*/
        setVisible(bVisible: boolean): void;
        /**初始化，和onDestroy是一对*/
        onCreate(args: any): void;
        /**销毁*/
        onDestroy(): void;
        /**每帧循环：如果覆盖，必须调用super.update()*/
        update(dt: number): boolean;
        /**资源加载结束*/
        onEnable(): void;
        onDisable(): void;
        /**多语言初始化，或语音设定改变时触发*/
        onLangChange(): void;
        static res(): Array<Res>;
        static unres(): void;
        static loaderTips(): string;
        static loaderType(): number;
        protected signalMap(): Array<any>;
        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        protected eventMap(): Array<any>;
        /**自定义事件注册，用于EventCenter派发的事件*/
        protected registerEvent(): void;
        protected unRegisterEvent(): void;
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        protected staticCacheUI(): any[];
        resize(): void;
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        static loadResource(onAssetLoaded: (v: boolean) => void): void;
        private registerSignalEvent;
        private unregisterSignalEvent;
        /**注册界面事件*/
        private registeGUIEvent;
        private unregisteGUIEvent;
        protected static buildRes(resMap: {
            [index: string]: {};
        }): Array<Res>;
        onClose(): boolean;
        hideImmediately(): void;
    }
}
/**
 * ui界面接口
 * @author ankye
 * @time 2018-7-19
 */
declare namespace airkit {
    interface ShowParams {
        pos?: Point;
        target?: fgui.GComponent;
        data?: any[];
        single?: boolean;
        clothOther?: boolean;
        resolve?: any;
        clickMaskClose?: boolean;
    }
    interface IUIPanel {
        /**打开*/
        setup(...args: any[]): void;
        /**关闭：如果是用UIManager打开的，则关闭一定要通过UIManager关闭*/
        dispose(): void;
        /**是否可见*/
        setVisible(bVisible: boolean): void;
        /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
        UIID: string;
        viewID: number;
        update(dt: number): boolean;
        removeFromParent(): void;
        hideImmediately?(): void;
        wait?(): Promise<DialogResultData>;
    }
}
/**
 * 层级管理
 */
declare namespace airkit {
    /**
     * 声音事件
     */
    class Layer extends fgui.GComponent {
        constructor();
        debug(): void;
    }
    /**
     * 场景层级
     * @author ankye
     * @time 2017-7-13
     */
    class LayerManager extends Singleton {
        static BG_WIDTH: number;
        static BG_HEIGHT: number;
        private static _root;
        private static _loadingLayer;
        private static _uiLayer;
        private static _mainLayer;
        private static _bgLayer;
        /**
         * 存放要随着屏幕变化而调整自身尺寸的容器
         */
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
        static get loadingLayer(): fgui.GComponent;
    }
}
declare namespace airkit {
    class LoaderDialog extends Dialog {
        type: eLoaderType;
        setup(type: eLoaderType): void;
        /**
         * 打开
         */
        onOpen(total: number): void;
        /**
         * 设置提示
         */
        setTips(s: string): void;
        /**
         * 加载进度
         * @param 	cur		当前加载数量
         * @param	total	总共需要加载的数量
         */
        setProgress(cur: number, total: number): void;
        /**
         * 关闭
         */
        onClose(): boolean;
    }
}
declare namespace airkit {
    /**
     * 加载界面管理器
     * @author ankye
     * @time 2017-7-25
     */
    class LoaderManager extends Singleton {
        _dicLoadView: NDictionary<LoaderDialog>;
        static loaders: NDictionary<string>;
        /**
         * 注册加载类，存放场景id和url的对应关系
         * @param view_type
         * @param className
         */
        static register(view_type: number, className: string, cls: any): void;
        private static instance;
        static get Instance(): LoaderManager;
        setup(): void;
        destroy(): boolean;
        private registerEvent;
        private unRegisterEvent;
        /**加载进度事件*/
        private onLoadViewEvt;
        show(type: number, total?: number, tips?: string): void;
        updateView(view: LoaderDialog, total: number, tips: string): void;
        setProgress(type: eLoaderType, cur: number, total: number): void;
        close(type: eLoaderType): void;
    }
}
declare namespace airkit {
    interface Res {
        url: string;
        type: typeof cc.Asset;
        refCount: number;
        pkg: string;
    }
    /**
     * 资源管理
     * @author ankye
     * @time 2018-7-10
     */
    const FONT_SIZE_4 = 18;
    const FONT_SIZE_5 = 22;
    const FONT_SIZE_6 = 25;
    const FONT_SIZE_7 = 29;
    class FguiAsset extends cc.BufferAsset {
    }
    class FguiAtlas extends cc.BufferAsset {
    }
    class BufferAsset extends cc.BufferAsset {
    }
    class TxtAsset extends cc.TextAsset {
    }
    class ImageAsset extends cc.BufferAsset {
    }
    class ResourceManager extends Singleton {
        static FONT_Yuanti: string;
        static Font_Helvetica: string;
        static FONT_DEFAULT: string;
        static FONT_DEFAULT_SIZE: number;
        private _dicResInfo;
        private _minLoaderTime;
        private static instance;
        static get Instance(): ResourceManager;
        setup(): void;
        static memory(): void;
        /**
         * 异步加载
         * @param    url  要加载的单个资源地址或资源信息数组。比如：简单数组：["a.png","b.png"]；复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]。
         * @param    progress  加载进度
         * @param    type		数组的时候，类型为undefined 资源类型。比如：Loader.IMAGE。
         * @param	priority	(default = 1)加载的优先级，优先级高的优先加载。有0-4共5个优先级，0最高，4最低。
         * @param	cache		是否缓存加载结果。
         * @param	group		分组，方便对资源进行管理。
         * @param    ignoreCache	是否忽略缓存，强制重新加载。
         */
        destroy(): boolean;
        update(dt: number): void;
        /**获取资源*/
        getRes(path: string, type?: typeof cc.Asset): any;
        dump(): void;
        /**
         * 加载资源，如果资源在此之前已经加载过，则当前帧会调用complete
         * @param	url 		单个资源地址
         * @param	type 		资源类型
         * @param	viewType 	加载界面
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @param	group 		分组，方便对资源进行管理。
         * @param	ignoreCache 是否忽略缓存，强制重新加载
         * @return 	结束回调(参数：string 加载的资源url)
         */
        loadRes(url: string, type?: typeof cc.Asset, refCount?: number, viewType?: number, priority?: number, cache?: boolean, pkg?: string, ignoreCache?: boolean): Promise<string>;
        /**
         * 批量加载资源，如果所有资源在此之前已经加载过，则当前帧会调用complete
         * @param	arr_res 	需要加载的资源数组
         * @param	loaderType 	加载界面 eLoaderType
         * @param   tips		提示文字
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @return 	结束回调(参数：Array<string>，加载的url数组)
         */
        loadArrayRes(arr_res: Array<Res>, loaderType?: number, tips?: string, priority?: number, cache?: boolean): Promise<string[]>;
        /**
         * 加载完成
         * @param	loaderType	显示的加载界面类型
         * @param 	handle 		加载时，传入的回调函数
         * @param 	args		第一个参数为加载的资源url列表；第二个参数为是否加载成功
         */
        onLoadComplete(loaderType: eLoaderType, urls: string[], arr_res: Array<Res>, tips: string): void;
        /**
         * 加载进度
         * @param	viewType	显示的加载界面类型
         * @param	total		总共需要加载的资源数量
         * @param	progress	已经加载的数量，百分比；注意，有可能相同进度会下发多次
         */
        onLoadProgress(viewType: number, total: number, tips: string, progress: number): void;
        /**
         * 释放指定资源
         * @param	url	资源路径
         */
        clearRes(url: string, refCount: number): void;
        releaseRes(url: string): void;
        /**
         * 图片代理，可以远程加载图片显示
         * @param image
         * @param skin
         * @param proxy
         * @param atlas
         */
        static imageProxy(image: fgui.GLoader, skin: string, proxy?: string, atlas?: string): Promise<any>;
    }
}
declare namespace airkit {
    /**
     * 场景管理器
     * @author ankye
     * @time 2017-7-13
     */
    class SceneManager {
        static cache: SDictionary<BaseView>;
        private static instance;
        private _curScene;
        /**
         * 注册场景类，存放场景name和class的对应关系
         * @param name
         * @param cls
         */
        static register(name: string, cls: any): any;
        static get Instance(): SceneManager;
        setup(): void;
        destroy(): void;
        update(dt: number): void;
        private registerEvent;
        private unRegisterEvent;
        private resize;
        private onChangeScene;
        /**进入场景*/
        gotoScene(sceneName: string, args?: any): void;
        private enterScene;
        private exitScene;
    }
}
declare namespace airkit {
    class SpineView extends BaseView {
        private _source;
        private _animName;
        private _animRate;
        private _loopCount;
        private _autoPlay;
        private _isLoaded;
        private _completeHandler;
        private _skeletonData;
        private _skeleton;
        private _trackIndex;
        constructor();
        set source(value: string);
        loadSkeleton(source: string, useJson?: boolean): Promise<boolean>;
        get isLoaded(): boolean;
        get source(): string;
        get animName(): string;
        set animName(value: string);
        get aniRate(): number;
        set aniRate(value: number);
        get loopCount(): number;
        set loopCount(value: number);
        get autoPlay(): boolean;
        set autoPlay(value: boolean);
        play(animName: string, loopCount: number, completeHandler: Handler): void;
        dispose(): void;
    }
}
/**
 * UI管理器
 * @author ankye
 * @time 2018-7-3
 */
declare namespace airkit {
    /**
     * UIManager 弹出ui管理类
     * example1:
     * ak.UIManager.showQ(eDialogUIID.ALERT,{clickMaskClose:true}).then(v=>{
     *   if(v){
     *       console.log("showQ dlg ="+v.viewID);
     *       v.wait().then(result=>{
     *           console.log("result wait ");
     *           console.log(result);
     *       });
     *  }
     *});
     */
    export class UIManager extends Singleton {
        static cache: SDictionary<any>;
        /**
         * 注册ui类，存放uiname和class的对应关系
         * @param name
         * @param cls
         */
        static register(name: string, cls: any): any;
        private _cacheViews;
        private _UIQueues;
        private static instance;
        static get Instance(): UIManager;
        static show(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        static showQ(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        static popup(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        static popupQ(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        static closeAll(): void;
        static getTopDlg(): Dialog;
        constructor();
        getQueue(t: eUIType): UIQueue;
        empty(): boolean;
        /**
         * 显示界面
         * @param uiid        界面uiid
         * @param args      参数
         */
        show(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        /**
         * 显示界面
         * @param uiid        界面uiName
         * @param args      参数
         */
        popup(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        protected showUI(type: eUIType, uiid: string, clas: any, params: ShowParams): any;
        /**
         * 关闭界面
         * @param uiid    界面id
         */
        close(uiid: string, vid: number): Promise<any>;
        /**
         * 关闭所有界面
         * @param   exclude_list    需要排除关闭的列表
         */
        closeAll(exclude_list?: Array<string>): void;
        /**
         * 弹窗UI，默认用队列显示
         * @param uiid
         * @param params
         */
        showQ(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        /**
         * popup队列显示
         *
         * @param {string} uiid
         * @param {ShowParams} params
         * @memberof UIManager
         */
        popupQ(uiid: string, params?: ShowParams): Promise<IUIPanel>;
        /**查找界面*/
        findPanel(uiid: string): IUIPanel;
        /**界面是否打开*/
        isDlgOpen(uiid: string): boolean;
    }
    class UIQueue {
        private _currentUIs;
        private _readyUIs;
        private _type;
        constructor(type: eUIType);
        /**
         * 直接显示界面,注：
         * 1.通过这个接口打开的界面，初始化注册的ui类设定的UIConfig.mHideDestroy必须为true。原因是显示下一个界面是通过上个界面的CLOSE事件触发
         * @param 	uiid		界面uiid
         * @param 	params	创建参数，会在界面onCreate时传入
         */
        show(uiid: string, params?: ShowParams): void;
        popup(uiid: string, params?: ShowParams): void;
        empty(): boolean;
        clear(): void;
        /**
         * 判断是否弹出下一个界面
         */
        private checkNextUI;
        private registerEvent;
        private unRegisterEvent;
        private onUIEvent;
    }
    export {};
}
declare namespace airkit {
    /**数组排序方式*/
    enum eArraySortOrder {
        ASCENDING = 0,
        DESCENDING = 1
    }
    /**
     * 数组工具类
     * @author ankye
     * @time 2018-7-6
     */
    class ArrayUtils {
        /** 插入元素
         * @param arr 需要操作的数组
         * @param value 需要插入的元素
         * @param index 插入位置
         */
        static insert(arr: any[], value: any, index: number): void;
        /**
         * Checks if the given argument is a Array.
         * @function
         */
        static isArray(obj: any): boolean;
        static equip(arr: any[], v: any[]): boolean;
        /**从数组移除元素*/
        static removeValue(arr: any[], v: any): void;
        /**移除所有值等于v的元素*/
        static removeAllValue(arr: any[], v: any): void;
        /**包含元素*/
        static containsValue(arr: any[], v: any): boolean;
        /**复制*/
        static copy(arr: any[]): any[];
        /**
         * 排序
         * @param arr 需要排序的数组
         * @param key 排序字段
         * @param order 排序方式
         */
        static sort(arr: any[], key: string, order?: eArraySortOrder): void;
        /**清空数组*/
        static clear(arr: any[]): void;
        /**数据是否为空*/
        static isEmpty(arr: any[]): Boolean;
    }
}
declare namespace airkit {
    /**
     * <p> <code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。</p>
     * <p> <code>Byte</code> 类适用于需要在字节层访问数据的高级开发人员。</p>
     */
    class Byte {
        /**
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
         * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
         * <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
         */
        static BIG_ENDIAN: string;
        /**
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
         * <p> <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。<br/>
         * <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。</p>
         */
        static LITTLE_ENDIAN: string;
        /**@private */
        private static _sysEndian;
        /**@private 是否为小端数据。*/
        protected _xd_: boolean;
        /**@private */
        private _allocated_;
        /**@private 原始数据。*/
        protected _d_: any;
        /**@private DataView*/
        protected _u8d_: any;
        /**@private */
        protected _pos_: number;
        /**@private */
        protected _length: number;
        /**
         * <p>获取当前主机的字节序。</p>
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。</p>
         * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
         * <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
         * @return 当前系统的字节序。
         */
        static getSystemEndian(): string;
        /**
         * 创建一个 <code>Byte</code> 类的实例。
         * @param	data	用于指定初始化的元素数目，或者用于初始化的TypedArray对象、ArrayBuffer对象。如果为 null ，则预分配一定的内存空间，当可用空间不足时，优先使用这部分内存，如果还不够，则重新分配所需内存。
         */
        constructor(data?: any);
        /**
         * 获取此对象的 ArrayBuffer 数据，数据只包含有效数据部分。
         */
        get buffer(): ArrayBuffer;
        /**
         * <p> <code>Byte</code> 实例的字节序。取值为：<code>BIG_ENDIAN</code> 或 <code>BIG_ENDIAN</code> 。</p>
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
         * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
         *  <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
         */
        get endian(): string;
        set endian(value: string);
        /**
         * <p> <code>Byte</code> 对象的长度（以字节为单位）。</p>
         * <p>如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。</p>
         * <p>如果要设置的长度大于当前已分配的内存空间的字节长度，则重新分配内存空间，大小为以下两者较大者：要设置的长度、当前已分配的长度的2倍，并将原有数据拷贝到新的内存空间中；如果要设置的长度小于当前已分配的内存空间的字节长度，也会重新分配内存空间，大小为要设置的长度，并将原有数据从头截断为要设置的长度存入新的内存空间中。</p>
         */
        set length(value: number);
        get length(): number;
        /**@private */
        private _resizeBuffer;
        /**
         * @private
         * <p>常用于解析固定格式的字节流。</p>
         * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
         * @return 读取的字符串。
         */
        getString(): string;
        /**
         * <p>常用于解析固定格式的字节流。</p>
         * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
         * @return 读取的字符串。
         */
        readString(): string;
        /**
         * @private
         * <p>从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。</p>
         * <p><b>注意：</b>返回的 Float32Array 对象，在 JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。</p>
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Float32Array 对象。
         */
        getFloat32Array(start: number, len: number): any;
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Float32Array 对象。
         */
        readFloat32Array(start: number, len: number): any;
        /**
         * @private
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        getUint8Array(start: number, len: number): Uint8Array;
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        readUint8Array(start: number, len: number): Uint8Array;
        /**
         * @private
         * <p>从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。</p>
         * <p><b>注意：</b>返回的 Int16Array 对象，在 JavaScript 环境下，是原生的 HTML5 Int16Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Int16Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。</p>
         * @param	start	开始读取的字节偏移量位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Int16Array 对象。
         */
        getInt16Array(start: number, len: number): any;
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。
         * @param	start	开始读取的字节偏移量位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        readInt16Array(start: number, len: number): any;
        /**
         * @private
         * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        getFloat32(): number;
        /**
         * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        readFloat32(): number;
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        getFloat64(): number;
        /**
         * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        readFloat64(): number;
        /**
         * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
         * @param	value	单精度（32 位）浮点数。
         */
        writeFloat32(value: number): void;
        /**
         * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 双精度（64 位）浮点数。
         * @param	value	双精度（64 位）浮点数。
         */
        writeFloat64(value: number): void;
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
         * @return Int32 值。
         */
        getInt32(): number;
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
         * @return Int32 值。
         */
        readInt32(): number;
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
         * @return Uint32 值。
         */
        getUint32(): number;
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
         * @return Uint32 值。
         */
        readUint32(): number;
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Int32 值。
         * @param	value	需要写入的 Int32 值。
         */
        writeInt32(value: number): void;
        /**
         * 在字节流的当前字节偏移量位置处写入 Uint32 值。
         * @param	value	需要写入的 Uint32 值。
         */
        writeUint32(value: number): void;
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
         * @return Int16 值。
         */
        getInt16(): number;
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
         * @return Int16 值。
         */
        readInt16(): number;
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
         * @return Uint16 值。
         */
        getUint16(): number;
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
         * @return Uint16 值。
         */
        readUint16(): number;
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Uint16 值。
         * @param	value	需要写入的Uint16 值。
         */
        writeUint16(value: number): void;
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Int16 值。
         * @param	value	需要写入的 Int16 值。
         */
        writeInt16(value: number): void;
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
         * @return Uint8 值。
         */
        getUint8(): number;
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
         * @return Uint8 值。
         */
        readUint8(): number;
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Uint8 值。
         * @param	value	需要写入的 Uint8 值。
         */
        writeUint8(value: number): void;
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
         * @param	pos	字节读取位置。
         * @return Uint8 值。
         */
        _getUInt8(pos: number): number;
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
         * @param	pos	字节读取位置。
         * @return Uint8 值。
         */
        _readUInt8(pos: number): number;
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
         * @param	pos	字节读取位置。
         * @return Uint16 值。
         */
        _getUint16(pos: number): number;
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
         * @param	pos	字节读取位置。
         * @return Uint16 值。
         */
        _readUint16(pos: number): number;
        /**
         * @private
         * 读取指定长度的 UTF 型字符串。
         * @param	len 需要读取的长度。
         * @return 读取的字符串。
         */
        private _rUTF;
        /**
         * @private
         * 读取 <code>len</code> 参数指定的长度的字符串。
         * @param	len	要读取的字符串的长度。
         * @return 指定长度的字符串。
         */
        getCustomString(len: number): string;
        /**
         * @private
         * 读取 <code>len</code> 参数指定的长度的字符串。
         * @param	len	要读取的字符串的长度。
         * @return 指定长度的字符串。
         */
        readCustomString(len: number): string;
        /**
         * 移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         */
        get pos(): number;
        set pos(value: number);
        /**
         * 可从字节流的当前位置到末尾读取的数据的字节数。
         */
        get bytesAvailable(): number;
        /**
         * 清除字节数组的内容，并将 length 和 pos 属性重置为 0。调用此方法将释放 Byte 实例占用的内存。
         */
        clear(): void;
        /**
         * @internal
         * 获取此对象的 ArrayBuffer 引用。
         * @return
         */
        __getBuffer(): ArrayBuffer;
        /**
         * <p>将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的字为字符串添加前缀。</p>
         * <p>对应的读取方法为： getUTFBytes 。</p>
         * @param value 要写入的字符串。
         */
        writeUTFBytes(value: string): void;
        /**
         * <p>将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。</p>
         * <p>对应的读取方法为： getUTFString 。</p>
         * @param	value 要写入的字符串值。
         */
        writeUTFString(value: string): void;
        /**
         * @private
         * 读取 UTF-8 字符串。
         * @return 读取的字符串。
         */
        readUTFString(): string;
        /**
         * <p>从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。</p>
         * <p>对应的写入方法为： writeUTFString 。</p>
         * @return 读取的字符串。
         */
        getUTFString(): string;
        /**
         * @private
         * 读字符串，必须是 writeUTFBytes 方法写入的字符串。
         * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
         * @return 读取的字符串。
         */
        readUTFBytes(len?: number): string;
        /**
         * <p>从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。</p>
         * <p>一般读取的是由 writeUTFBytes 方法写入的字符串。</p>
         * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
         * @return 读取的字符串。
         */
        getUTFBytes(len?: number): string;
        /**
         * <p>在字节流中写入一个字节。</p>
         * <p>使用参数的低 8 位。忽略高 24 位。</p>
         * @param	value
         */
        writeByte(value: number): void;
        /**
         * <p>从字节流中读取带符号的字节。</p>
         * <p>返回值的范围是从 -128 到 127。</p>
         * @return 介于 -128 和 127 之间的整数。
         */
        readByte(): number;
        /**
         * @private
         * 从字节流中读取带符号的字节。
         */
        getByte(): number;
        /**
         * @internal
         * <p>保证该字节流的可用长度不小于 <code>lengthToEnsure</code> 参数指定的值。</p>
         * @param	lengthToEnsure	指定的长度。
         */
        _ensureWrite(lengthToEnsure: number): void;
        /**
         * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
         * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
         * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
         * @param	arraybuffer	需要写入的 Arraybuffer 对象。
         * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
         * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
         */
        writeArrayBuffer(arraybuffer: any, offset?: number, length?: number): void;
        /**
         * 读取ArrayBuffer数据
         * @param	length
         * @return
         */
        readArrayBuffer(length: number): ArrayBuffer;
    }
}
declare namespace airkit {
    /**
     * 字节工具类
     * @author ankye
     * @time 2018-7-7
     */
    function bytes2Uint8Array(data: any, endian: string): Uint8Array;
    function bytes2String(data: any, endian: string): string;
    function string2ArrayBuffer(s: string): ArrayBuffer;
    function string2Uint8Array(str: any): Uint8Array;
    function uint8Array2String(fileData: any): string;
}
declare namespace airkit {
    /**
     * 对象工具类
     * @author ankye
     * @time 2018-7-11
     */
    class ClassUtils {
        /**@private */
        private static _classMap;
        /**
         * 注册 Class 映射，方便在class反射时获取。
         * @param	className 映射的名字或者别名。
         * @param	classDef 类的全名或者类的引用，全名比如:"cc.Sprite"。
         */
        static regClass(className: string, classDef: any): void;
        /**
         * 根据类名短名字注册类，比如传入[Sprite]，功能同regClass("Sprite",Sprite);
         * @param	classes 类数组
         */
        static regShortClassName(classes: any[]): void;
        /**
         * 返回注册的 Class 映射。
         * @param	className 映射的名字。
         */
        static getRegClass(className: string): any;
        /**
         * 根据名字返回类对象。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return 类对象
         */
        static getClass(className: string): any;
        /**
         * 根据名称创建 Class 实例。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return	返回类的实例。
         */
        static getInstance(className: string): any;
        /**深复制一个对象*/
        static copyObject(obj: any): any;
        /**获取一个对象里的值*/
        static getObjectValue(obj: any, key: string, defVal?: any): any;
        static callFunc(obj: any, funcName: string, args?: any[]): any;
        static classKey(obj: any): string;
    }
}
declare namespace airkit {
    /**
     * 时间
     * @author ankye
     * @time 2018-7-11
     */
    class DateUtils {
        /**服务器时间*/
        static serverTimeDiff: number;
        static serverTime: number;
        static setServerTime(time: number): void;
        /**获取UNIX时间 */
        static getNow(): number;
        static getNowMS(): number;
        static isTheSameMonth(nTime: number, nSecond: number): boolean;
        static isTheSameDayByNow(nTime: number, nSecond: number): boolean;
        /**计算从nTime1到nTime2过去了多少天*/
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
/**
 * 字典工具类
 * @author ankye
 * @time 2018-7-6
 */
declare namespace airkit {
    class DicUtils {
        /**
         * 键列表
         */
        static getKeys(d: Object): any[];
        /**
         * 值列表
         */
        static getValues(d: Object): any[];
        /**
         * 清空字典
         */
        static clearDic(dic: Object): void;
        /**
         * 全部应用
         */
        static foreach(dic: Object, compareFn: (key: any, value: any) => boolean): void;
        static isEmpty(dic: Object): Boolean;
        static getLength(dic: Object): number;
        static assign(obj: any, dic: any): void;
    }
}
declare namespace airkit {
    function displayWidth(): number;
    function displayHeight(): number;
    /**
     * 显示对象
     * @author ankye
     * @time 2018-7-13
     */
    class DisplayUtils {
        /**
         * 移除全部子对象
         */
        static removeAllChild(container: fgui.GComponent): void;
        /**
         * 创建发光滤镜
         * @param	color	滤镜的颜色
         * @param	blur	边缘模糊的大小
         * @param	offX	X轴方向的偏移
         * @param	offY	Y轴方向的偏移
         */
        /**
         * 模糊滤镜
         * @param	strength	模糊滤镜的强度值
         */
        /**
         * 创建一个 <code>ColorFilter</code> 实例。
         * @param mat	（可选）由 20 个项目（排列成 4 x 5 矩阵）组成的数组，用于颜色转换。
         */
        /**
         * 创建一个背景层
         */
        static colorBG(color: cc.Color, w: number, h: number): fgui.GGraph;
        static popupDown(panel: any, handler?: Handler, ignoreAnchor?: boolean): void;
        static popup(view: fgui.GComponent, handler?: Handler, ignoreAnchor?: boolean): void;
        static hide(panel: IUIPanel, handler?: Handler): void;
    }
}
declare namespace airkit {
    /**
     * <p><code>Handler</code> 是事件处理器类。</p>
     * <p>推荐使用 Handler.create() 方法从对象池创建，减少对象创建消耗。创建的 Handler 对象不再使用后，可以使用 Handler.recover() 将其回收到对象池，回收后不要再使用此对象，否则会导致不可预料的错误。</p>
     * <p><b>注意：</b>由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。</p>
     */
    class Handler {
        /**@private handler对象池*/
        protected static _pool: Handler[];
        /**@private */
        private static _gid;
        /** 执行域(this)。*/
        caller: Object | null;
        /** 处理方法。*/
        method: Function | null;
        /** 参数。*/
        args: any[] | null;
        /** 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
        once: boolean;
        /**@private */
        protected _id: number;
        /**
         * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
         * @param	caller 执行域。
         * @param	method 处理函数。
         * @param	args 函数参数。
         * @param	once 是否只执行一次。
         */
        constructor(caller?: Object | null, method?: Function | null, args?: any[] | null, once?: boolean);
        /**
         * 设置此对象的指定属性值。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，执行后执行recover()进行回收。
         * @return  返回 handler 本身。
         */
        setTo(caller: any, method: Function | null, args: any[] | null, once?: boolean): Handler;
        /**
         * 执行处理器。
         */
        run(): any;
        /**
         * 执行处理器，并携带额外数据。
         * @param	data 附加的回调数据，可以是单数据或者Array(作为多参)。
         */
        runWith(data: any): any;
        /**
         * 清理对象引用。
         */
        clear(): Handler;
        /**
         * 清理并回收到 Handler 对象池内。
         */
        recover(): void;
        /**
         * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
         * @return  返回创建的handler实例。
         */
        static create(caller: any, method: Function | null, args?: any[] | null, once?: boolean): Handler;
    }
}
/**
 * 数学工具类
 * @author ankye
 * @time 2018-7-8
 * 坐标系：y轴向下，顺时针方向
 * 					|
 * 					|
 * 					|
 * -----------------|---------------->x
 *  				|
 * 					|
 * 					|
 * 					y
 */
declare namespace airkit {
    enum OrbitType {
        Line = 3,
        Curve = 2
    }
    class MathUtils {
        /**字节转换M*/
        static BYTE_TO_M: number;
        /**字节转换K*/
        static BYTE_TO_K: number;
        static Deg2Rad: number;
        static Rad2Deg: number;
        static Cycle8Points: Array<[number, number]>;
        static Cycle9Points: Array<[number, number]>;
        static sign(n: number): number;
        /**
         * 限制范围
         */
        static clamp(n: number, min: number, max: number): number;
        static clamp01(value: number): number;
        static lerp(from: number, to: number, t: number): number;
        static lerpAngle(a: number, b: number, t: number): number;
        static repeat(t: number, length: number): number;
        /**
         * 产生随机数
         * 结果：x>=param1 && x<param2
         */
        static randRange(param1: number, param2: number): number;
        /**
         * 产生随机数
         * 结果：x>=param1 && x<=param2
         */
        static randRange_Int(param1: number, param2: number): number;
        /**
         * 从数组中产生随机数[-1,1,2]
         * 结果：-1/1/2中的一个
         */
        static randRange_Array<T>(arr: Array<T>): T;
        /**
         * 转换为360度角度
         */
        static clampDegrees(degrees: number): number;
        /**
         * 转换为360度弧度
         */
        static clampRadians(radians: number): number;
        /**
         * 两点间的距离
         */
        static getDistance(x1: number, y1: number, x2: number, y2: number): number;
        static getSquareDistance(x1: number, y1: number, x2: number, y2: number): number;
        /**
         * 两点间的弧度：x正方形为0，Y轴向下,顺时针为正
         */
        static getLineRadians(x1: number, y1: number, x2: number, y2: number): number;
        static getLineDegree(x1: number, y1: number, x2: number, y2: number): number;
        static getPointRadians(x: number, y: number): number;
        static getPointDegree(x: number, y: number): number;
        /**
         * 弧度转化为度
         */
        static toDegree(radian: number): number;
        /**
         * 度转化为弧度
         */
        static toRadian(degree: number): number;
        static moveTowards(current: number, target: number, maxDelta: number): number;
        static radians4point(ax: any, ay: any, bx: any, by: any): number;
        static pointAtCircle(px: any, py: any, radians: any, radius: any): cc.Vec2;
        /**
         * 根据位置数组，轨迹类型和时间进度来返回对应的位置
         * @param pts 位置数组
         * @param t 时间进度[0,1]
         * @param type Line:多点折线移动,Curve:贝塞尔曲线移动
         */
        static getPos(pts: cc.Vec2[], t: number, type: OrbitType): cc.Vec2;
        /**
         * 获取两点之间连线向量对应的旋转角度
         * 注意: 只适合图片初始方向向上的情况,像鱼资源头都是向上
         *     2  |  1
         *   =====|=====
         *     3  |  4
         * 假设原点是起点
         * 终点在第一象限，顺时针移动，角度[-90,0]
         * 终点在第二象限，顺时针移动，角度[0,90]
         * 终点在第三象限，顺时针移动，角度[-90,0]
         * 终点在第四象限，顺时针移动，角度[0, 90]
         * @param startX 起始点X
         * @param startY 起始点Y
         * @param endX 终点X
         * @param endY 终点Y
         *
         */
        static getRotation(startX: number, startY: number, endX: number, endY: number): number;
        /**
         * 根据顶点数组来生成贝塞尔曲线(只支持二阶和三阶)，根据t返回对应的曲线位置
         * @param pts 顶点数组：第一个和最后一个点是曲线轨迹的起点和终点，其他点都是控制点，曲线不会经过这些点
         * @param t 整个轨迹的时间[0-1]
         */
        static getBezierat(pts: cc.Vec2[], t: number): cc.Vec2;
        /**
         * 根据旋转角度返回二维方向向量(单位化过)
         * @param angle
         */
        static getDirection(angle: number): cc.Vec2;
        /**
         * 单位化向量
         * @param vec
         */
        static normalize(vec: cc.Vec2): cc.Vec2;
        /**
         * 求两点之间的距离长度
         */
        static distance(startX: number, startY: number, endX: number, endY: number): number;
        /**
         * 根据起始和终点连线方向，计算垂直于其的向量和连线中心点的位置，通过raise来调整远近，越远贝塞尔曲线计算的曲线越弯
         *  @param start 起始点坐标
         *  @param end   终点坐标
         *  @param raise 调整离中心点远近
         *
         */
        private static getVerticalVector;
        /**
         * 根据起始点和终点获得控制点
         *
         * @param start 起始点坐标
         * @param end 终点坐标
         * @param raise 控制弯曲度,越大越弯曲
         * @param xOffset 控制弯曲X方向偏移量
         * @param yOffset 控制弯曲Y方向偏移量
         */
        static getCtrlPoint(start: cc.Vec2, end: cc.Vec2, raise?: number, xOffset?: number, yOffset?: number): cc.Vec2;
        static getDefaultPoints(start: cc.Vec2, end: cc.Vec2, xOffset?: number, yOffset?: number, raise?: number): Array<cc.Vec2>;
    }
}
declare namespace airkit {
    /**
     * 字符串
     * @author ankye
     * @time 2018-7-8
     */
    class NumberUtils {
        /**
         * 保留小数点后几位
         */
        static toFixed(value: number, p: number): number;
        static toInt(value: number): number;
        static isInt(value: number): boolean;
        /**
         * 保留有效数值
         */
        static reserveNumber(num: number, size: number): number;
        /**
         * 保留有效数值，不够补0；注意返回的是字符串
         */
        static reserveNumberWithZero(num: number, size: number): string;
    }
}
/**
 * 字符串
 * @author ankye
 * @time 2018-7-8
 */
declare namespace airkit {
    class StringUtils {
        static get empty(): string;
        /**
         * 字符串是否有值
         */
        static isNullOrEmpty(s: string): boolean;
        static toInt(str: string): number;
        static toNumber(str: string): number;
        static stringCut(str: string, len: number, fill?: string): string;
        /**
         * 获取字符串真实长度,注：
         * 1.普通数组，字符占1字节；汉子占两个字节
         * 2.如果变成编码，可能计算接口不对
         */
        static getNumBytes(str: string): number;
        /**
         * 补零
         * @param str
         * @param len
         * @param dir 0-后；1-前
         * @return
         */
        static addZero(str: string, len: number, dir?: number): string;
        /**
         * Checks if the given argument is a string.
         * @function
         */
        static isString(obj: any): boolean;
        /**
         * 去除左右空格
         * @param input
         * @return
         */
        static trim(input: string): string;
        /**
         * 去除左侧空格
         * @param input
         * @return
         */
        static trimLeft(input: string): string;
        /**
         * 去除右侧空格
         * @param input
         * @return
         */
        static trimRight(input: string): string;
        /**
         * 分钟与秒格式(如-> 40:15)
         * @param seconds 秒数
         * @return
         */
        static minuteFormat(seconds: number): string;
        /**
         * 时分秒格式(如-> 05:32:20)
         * @param seconds(秒)
         * @return
         */
        static hourFormat(seconds: number): string;
        /**
         * 格式化字符串
         * @param str 需要格式化的字符串，【"杰卫，这里有%s个苹果，和%s个香蕉！", 5,10】
         * @param args 参数列表
         */
        static format2(str: string, ...args: any[]): string;
        static format(str: string, ...args: any[]): string;
        static formatWithDic(str: string, dic: any): string;
        /**
         * 以指定字符开始
         */
        static beginsWith(input: string, prefix: string): boolean;
        /**
         * 以指定字符结束
         */
        static endsWith(input: string, suffix: string): boolean;
        /**guid*/
        static getGUIDString(): string;
    }
}
declare namespace airkit {
    class TouchUtils {
    }
}
declare namespace airkit {
    /**
     * 动画属性类，可叠加
     */
    interface ITweenProps {
        x?: number;
        y?: number;
        scaleX?: number;
        scaleY?: number;
        rotation?: number;
        alpha?: number;
    }
    class TweenUtils {
        constructor(target: fgui.GObject);
        private _target;
        private _currentTweener;
        private _steps;
        private _isPlaying;
        private _stepCompleteHandler;
        private _updateFunc;
        static get(target: fgui.GObject): TweenUtils;
        get target(): fgui.GObject;
        setOnUpdate(callback: Function): void;
        onUpdate(gt: fgui.GTweener): void;
        /**
         * 缓动对象的props属性到目标值。
         * @param	target 目标对象(即将更改属性值的对象)。
         * @param	props 变化的属性列表，比如
         * @param	duration 花费的时间，单位秒。
         * @param	ease 缓动类型，默认为匀速运动。
         * @param	complete 结束回调函数。
         * @param	delay 延迟执行时间。
         */
        to(props: ITweenProps, duration: number, ease?: number, complete?: Handler, delay?: number): TweenUtils;
        delay(delay: number): TweenUtils;
        private trigger;
        private onStepComplete;
        /**
         * 取消target所有的动画
         */
        clear(): void;
        /**
         * 取消当前运行的tween
         */
        cancel(doComplete?: boolean): void;
        static scale(view: fgui.GObject): void;
        static appear(view: fgui.GObject): void;
    }
}
declare namespace airkit {
    /**
     * url工具类
     * @author ankye
     * @time 2018-7-16
     */
    class UrlUtils {
        /**获取文件扩展名*/
        static getFileExte(url: string): string;
        /**获取不含扩展名的路径*/
        static getPathWithNoExtend(url: string): string;
    }
}
declare namespace airkit {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */
    class Utils {
        static buildRes(resMap: {
            [index: string]: {};
        }): Array<Res>;
        /**打开外部链接，如https://ask.laya.ui.Box.com/xxx*/
        static openURL(url: string): void;
        /**获取当前地址栏参数*/
        static getLocationParams(): SDictionary<string>;
        /**
         * object转成查询字符串
         * @param obj
         * @returns {string}
         */
        static obj2query(obj: any): string;
        static injectProp(target: Object, data?: Object, callback?: Function, ignoreMethod?: boolean, ignoreNull?: boolean, keyBefore?: string): boolean;
        /**
         * 将字符串解析成 XML 对象。
         * @param value 需要解析的字符串。
         * @return js原生的XML对象。
         */
        static parseXMLFromString: Function;
    }
    /**
     * 位操作
     */
    class FlagUtils {
        static hasFlag(a: number, b: number): boolean;
        static insertFlag(a: number, b: number): number;
        static removeFlag(a: number, b: number): number;
    }
    /**
     * 断言
     */
    function assert(condition: any, msg?: string): void;
    function assertNullOrNil(condition: any, msg?: string): void;
    /**
     * 判空
     */
    function checkNullOrNil(x: any): boolean;
    function checkEmptyDic(x: any): boolean;
    function graphAlpha(g: fgui.GGraph, alpha: number): void;
}
declare namespace airkit {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */
    class ZipUtils {
        static unzip(ab: ArrayBuffer): Promise<any>;
        static parseZip(ab: ArrayBuffer): Promise<any>;
        static parseZipFile(jszip: any, filename: string): Promise<[string, any]>;
    }
}
import ak = airkit;