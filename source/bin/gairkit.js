window.airkit = {};
window.ak = window.airkit;
//import { Log } from "../log/Log";

(function (airkit) {
    /**
     * 单列
     * @author ankye
     * @time 2018-7-6
     */
    class Singleton {
        constructor() {
            let clazz = this["constructor"];
            //为空时，表示浏览器不支持这样读取构造函数
            if (!clazz) {
                airkit.Log.warning("浏览器不支持读取构造函数");
                return;
            }
            // 防止重复实例化
            if (Singleton.classKeys.indexOf(clazz) != -1) {
                throw new Error(this + " 只允许实例化一次！");
            }
            else {
                Singleton.classKeys.push(clazz);
                Singleton.classValues.push(this);
            }
        }
    }
    Singleton.classKeys = [];
    Singleton.classValues = [];
    airkit.Singleton = Singleton;
})(airkit || (airkit = {}));
/// <reference path="collection/Singleton.ts" />

(function (airkit) {
    /**
     * 框架管理器
     * @author ankye
     * @time 2018-7-6
     */
    class Framework extends airkit.Singleton {
        constructor() {
            super();
            this._isStopGame = false;
            this._mainloopHandle = null;
        }
        static get Instance() {
            if (!this.instance) {
                this.instance = new Framework();
            }
            return this.instance;
        }
        /**
         * 初始化
         * @param	root	根节点，可以是stage
         */
        setup(root, log_level = airkit.LogLevel.INFO, design_width = 750, design_height = 1334, screen_mode = "", frame = 1) {
            this.printDeviceInfo();
            this._isStopGame = false;
            cc.view.setResizeCallback(() => {
                airkit.EventCenter.dispatchEvent(airkit.EventID.RESIZE);
            });
            airkit.Log.LEVEL = log_level;
            airkit.LayerManager.setup(root);
            airkit.Mediator.Instance.setup();
            airkit.TimerManager.Instance.setup();
            // UIManager.Instance.setup();
            airkit.ResourceManager.Instance.setup();
            // DataProvider.Instance.setup();
            // LangManager.Instance.init();
            // SceneManager.Instance.setup();
            // 
            // LoaderManager.Instance.setup();
            // cc.director.getScheduler().scheduleUpdate(this, 0, false);
        }
        destroy() {
            //  Laya.timer.clearAll(this);
            //
            // LoaderManager.Instance.destroy();
            airkit.ResourceManager.Instance.destroy();
            airkit.TimerManager.Instance.destroy();
            airkit.Mediator.Instance.destroy();
            // UIManager.Instance.destroy();
            // SceneManager.Instance.destroy();
            // DataProvider.Instance.destroy();
            airkit.LayerManager.destroy();
            // LangManager.Instance.destory();
            return true;
        }
        /**
         * 游戏主循环
         */
        update(dt) {
            if (!this._isStopGame) {
                let dtMs = dt * 1000;
                this.preTick(dtMs);
                this.tick(dtMs);
                this.endTick(dtMs);
            }
        }
        preTick(dt) {
            airkit.TimerManager.Instance.update(dt);
            // UIManager.Instance.update(dt);
            airkit.ResourceManager.Instance.update(dt);
            airkit.Mediator.Instance.update(dt);
            // SceneManager.Instance.update(dt);
        }
        tick(dt) {
            if (this._mainloopHandle) {
                this._mainloopHandle.runWith([dt]);
            }
        }
        endTick(dt) { }
        /**暂停游戏*/
        pauseGame() {
            this._isStopGame = true;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, true);
        }
        /**结束暂停*/
        resumeGame() {
            this._isStopGame = false;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, false);
        }
        get isStopGame() {
            return this._isStopGame;
        }
        /**打印设备信息*/
        printDeviceInfo() {
            if (navigator) {
                let agentStr = navigator.userAgent;
                let start = agentStr.indexOf("(");
                let end = agentStr.indexOf(")");
                if (start < 0 || end < 0 || end < start) {
                    return;
                }
                let infoStr = agentStr.substring(start + 1, end);
                airkit.Log.info(infoStr);
                let device, system, version;
                let infos = infoStr.split(";");
                if (infos.length == 3) {
                    //如果是三个的话， 可能是android的， 那么第三个是设备号
                    device = infos[2];
                    //第二个是系统号和版本
                    let system_info = infos[1].split(" ");
                    if (system_info.length >= 2) {
                        system = system_info[1];
                        version = system_info[2];
                    }
                }
                else if (infos.length == 2) {
                    system = infos[0];
                    device = infos[0];
                    version = infos[1];
                }
                else {
                    system = navigator.platform;
                    device = navigator.platform;
                    version = infoStr;
                }
                airkit.Log.info("{0},{1},{2}", system, device, version);
            }
        }
    }
    Framework.instance = null;
    airkit.Framework = Framework;
})(airkit || (airkit = {}));
// // import { Singleton } from "../collection/Singleton";
// // import { SDictionary, NDictionary } from "../collection/Dictionary";
// // import { Timer } from "../timer/Timer";
// ///<reference path="../collection/Singleton.ts"/>
// namespace airkit {
//   /*
//    * 声音管理
//    */
//   export class AudioManager extends Singleton {
//     //{
//     //     0:{id:0, "url": "res/sound/bgm.mp3", "desc": "游戏背景" }
//     // }
//     private musicsConfig: NDictionary<{
//       id: number;
//       url: string;
//       desc: string;
//     }>;
//     // {
//     //    0: {id:0, "url": "res/sound/click.mp3", "desc": "点击音效" },
//     // }
//     private effectConfig: NDictionary<{
//       id: number;
//       url: string;
//       desc: string;
//     }>;
//     private effectChannelDic: SDictionary<Laya.SoundChannel>;
//     private effectChannelNumDic: SDictionary<number>;
//     private _effectSwitch: boolean;
//     private _musicSwitch: boolean;
//     constructor() {
//       super();
//       this.effectChannelDic = new SDictionary<Laya.SoundChannel>();
//       this.effectChannelNumDic = new SDictionary<number>();
//       this._effectSwitch = true;
//       this._musicSwitch = true;
//       Laya.SoundManager.useAudioMusic = false;
//       Laya.SoundManager.autoReleaseSound = false;
//     }
//     private static instance: AudioManager = null;
//     public static get Instance(): AudioManager {
//       if (!this.instance) this.instance = new AudioManager();
//       return this.instance;
//     }
//     public registerMusic(obj: { id: number; url: string; desc: string }): void {
//       if (this.musicsConfig == null) {
//         this.musicsConfig = new NDictionary<{
//           id: number;
//           url: string;
//           desc: string;
//         }>();
//       }
//       this.musicsConfig.add(obj.id, obj);
//     }
//     public registerEffect(obj: {
//       id: number;
//       url: string;
//       desc: string;
//     }): void {
//       if (this.effectConfig == null) {
//         this.effectConfig = new NDictionary<{
//           id: number;
//           url: string;
//           desc: string;
//         }>();
//       }
//       this.setEffectVolume(0.3, obj.url);
//       this.effectConfig.add(obj.id, obj);
//     }
//     /**
//      * 设置背景音乐开关，关闭(false)将关闭背景音乐
//      *
//      * @memberof SoundsManager
//      */
//     public set musicSwitch(v: boolean) {
//       if (this._musicSwitch != v) {
//         if (!v) {
//           this.stopMusic();
//         }
//         this._musicSwitch = v;
//       }
//     }
//     /**
//      * 设置音效开关，关闭(false)将关闭所有的音效
//      *
//      * @memberof SoundsManager
//      */
//     public set effectSwitch(v: boolean) {
//       if (this._effectSwitch != v) {
//         if (!v) {
//           this.stopAllEffect();
//         }
//         this._effectSwitch = v;
//       }
//     }
//     /**
//      * 播放背景音乐
//      * @param url
//      * @param loops
//      * @param complete
//      * @param startTime
//      */
//     public playMusic(
//       url: string,
//       loops: number = 0,
//       complete: Laya.Handler = null,
//       startTime: number = 0
//     ): void {
//       if (!this._musicSwitch) return;
//       Laya.SoundManager.playMusic(url, loops, complete, startTime);
//       Laya.SoundManager.setMusicVolume(0.5);
//     }
//     /**
//      * 播放音效
//      * @param url
//      * @param loops
//      * @param complete
//      * @param soundClass
//      * @param startTime
//      */
//     public playEffect(
//       url: string,
//       loops: number = 1,
//       complete: Laya.Handler = null,
//       soundClass: any = null,
//       startTime: number = 0
//     ): void {
//       if (!this._effectSwitch) return;
//       let num = this.effectChannelNumDic.getValue(url);
//       if (num == null) {
//         this.effectChannelNumDic.add(url, 1);
//       } else {
//         this.effectChannelNumDic.set(url, num + 1);
//       }
//       var soundChannel: Laya.SoundChannel = this.effectChannelDic.getValue(url);
//       if (soundChannel) {
//         // soundChannel.stop()
//         // this.removeChannel(url, soundChannel)
//         return;
//       }
//       num = this.effectChannelNumDic.getValue(url);
//       this.effectChannelNumDic.remove(url);
//       // if (num > 3) num = 3
//       let scale = Timer.timeScale;
//       if (scale > 1.5) scale = 1.5;
//       Laya.SoundManager.playbackRate = scale;
//       this.effectChannelDic.add(
//         url,
//         Laya.SoundManager.playSound(
//           url,
//           num,
//           Laya.Handler.create(null, () => {
//             this.effectChannelDic.remove(url);
//           }),
//           soundClass,
//           startTime
//         )
//       );
//       Laya.SoundManager.setSoundVolume(0.5, url);
//       //  Laya.SoundManager.playSound(url, loops, complete, soundClass, startTime)
//     }
//     /**
//      * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
//      * @param volume
//      */
//     public setMusicVolume(volume: number): void {
//       Laya.SoundManager.setMusicVolume(volume);
//     }
//     /**
//      * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
//      * @param volume
//      * @param url
//      */
//     public setEffectVolume(volume: number, url: string = null): void {
//       Laya.SoundManager.setSoundVolume(volume, url);
//     }
//     /**
//      * 停止所有音乐
//      */
//     public stopAll(): void {
//       Laya.SoundManager.stopAll();
//     }
//     /**
//      * 停止播放所有音效（不包括背景音乐）
//      */
//     public stopAllEffect(): void {
//       // Laya.SoundManager.stopAllSound()
//       this.effectChannelDic.foreach((url, channel) => {
//         if (channel != null) channel.stop();
//         this.removeChannel(url, channel);
//         return true;
//       });
//       this.effectChannelNumDic.clear();
//     }
//     /**
//      * 停止播放背景音乐
//      */
//     public stopMusic(): void {
//       Laya.SoundManager.stopMusic();
//     }
//     /**
//      * 移除播放的声音实例。
//      * @param channel
//      */
//     public removeChannel(url: string, channel: Laya.SoundChannel): void {
//       this.effectChannelDic.remove(url);
//       Laya.SoundManager.removeChannel(channel);
//     }
//     /**播放背景音乐 */
//     public playMusicByID(
//       eId: number,
//       loops: number = 0,
//       complete: Laya.Handler = null,
//       startTime: number = 0
//     ): void {
//       var config = this.musicsConfig.getValue(eId);
//       this.playMusic(config.url, loops, complete, startTime);
//     }
//     /**播放音效 */
//     public playEffectByID(
//       eId: number,
//       loops: number = 1,
//       complete: Laya.Handler = null,
//       startTime: number = 0
//     ): void {
//       var config = this.effectConfig.getValue(eId);
//       this.playEffect(config.url, loops, complete, startTime);
//     }
//   }
// }
// import { StringUtils } from "../utils/StringUtils";
// import { MathUtils } from "../utils/MathUtils";

(function (airkit) {
    /**
     * 颜色
     * @author ankye
     * @time 2018-7-3
     */
    class Color {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        set(new_r, new_g, new_b, new_a) {
            this.r = new_r;
            this.g = new_g;
            this.b = new_b;
            this.a = new_a;
        }
        static add(a, b) {
            return new Color(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a);
        }
        add(a) {
            this.set(this.r + a.r, this.g + a.g, this.b + a.b, this.a + a.a);
            return this;
        }
        static sub(a, b) {
            return new Color(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a);
        }
        sub(a) {
            this.set(this.r - a.r, this.g - a.g, this.b - a.b, this.a - a.a);
            return this;
        }
        static mul(a, d) {
            return new Color(a.r * d, a.g * d, a.b * d, a.a * d);
        }
        mul(d) {
            this.set(this.r * d, this.g * d, this.b * d, this.a * d);
            return this;
        }
        static div(a, d) {
            return new Color(a.r / d, a.g / d, a.b / d, a.a / d);
        }
        div(d) {
            this.set(this.r / d, this.g / d, this.b / d, this.a / d);
            return this;
        }
        equals(other) {
            return (this.r == other.r &&
                this.g == other.g &&
                this.b == other.b &&
                this.a == other.a);
        }
        static lerp(from, to, t) {
            t = airkit.MathUtils.clamp(t, 0, 1);
            return new Color(from.r + (to.r - from.r) * t, from.g + (to.g - from.g) * t, from.b + (to.b - from.b) * t + (to.a - from.a) * t);
        }
        static get zero() {
            return new Color(0, 0, 0, 0);
        }
        static get one() {
            return new Color(1, 1, 1, 1);
        }
        static get red() {
            return new Color(1, 0, 0, 1);
        }
        static get green() {
            return new Color(0, 1, 0, 1);
        }
        static get blue() {
            return new Color(0, 0, 1, 1);
        }
        static get white() {
            return new Color(1, 1, 1, 1);
        }
        static get black() {
            return new Color(0, 0, 0, 1);
        }
        static get yellow() {
            return new Color(1, 0.9215686, 0.01568628, 1);
        }
        static get cyan() {
            return new Color(0, 1, 1, 1);
        }
        static get magenta() {
            return new Color(1, 0, 1, 1);
        }
        static get gray() {
            return new Color(0.5, 0.5, 0.5, 1);
        }
        static get grey() {
            return new Color(0.5, 0.5, 0.5, 1);
        }
        static get clear() {
            return new Color(0, 0, 0, 0);
        }
        toString() {
            return airkit.StringUtils.format("({0}, {1}, {2}, {3})", this.r, this.g, this.b, this.a);
        }
    }
    airkit.Color = Color;
})(airkit || (airkit = {}));
// import { Log } from "../log/Log";
// import { StringUtils } from "../utils/StringUtils";
// import { DicUtils } from "../utils/DicUtils";

(function (airkit) {
    /**
     * 字典-键为number
     * TODO:Object的键不支持泛型
     * @author ankye
     * @time 2018-7-6
     */
    class NDictionary {
        constructor() {
            this._dic = {};
        }
        add(key, value) {
            if (this.containsKey(key)) {
                airkit.Log.warning("NDictionary already containsKey ", key.toString());
                return false;
            }
            this._dic[key] = value;
            return true;
        }
        remove(key) {
            delete this._dic[key];
        }
        set(key, value) {
            this._dic[key] = value;
        }
        containsKey(key) {
            return this._dic[key] != null ? true : false;
        }
        getValue(key) {
            if (!this.containsKey(key))
                return null;
            return this._dic[key];
        }
        clear() {
            for (let key in this._dic) {
                delete this._dic[key];
            }
        }
        getkeys() {
            let list = [];
            for (let key in this._dic) {
                list.push(airkit.StringUtils.toNumber(key));
            }
            return list;
        }
        getValues() {
            let list = [];
            for (let key in this._dic) {
                list.push(this._dic[key]);
            }
            return list;
        }
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        foreach(compareFn) {
            for (let key in this._dic) {
                if (!compareFn.call(null, key, this._dic[key]))
                    break;
            }
        }
        get length() {
            return airkit.DicUtils.getLength(this._dic);
        }
    }
    airkit.NDictionary = NDictionary;
    /**
     * 字典-键为string
     * @author ankye
     * @time 2018-7-6
     */
    class SDictionary {
        constructor() {
            this._dic = {};
        }
        add(key, value) {
            if (this.containsKey(key))
                return false;
            this._dic[key] = value;
            return true;
        }
        set(key, value) {
            this._dic[key] = value;
        }
        remove(key) {
            delete this._dic[key];
        }
        containsKey(key) {
            return this._dic[key] != null ? true : false;
        }
        getValue(key) {
            if (!this.containsKey(key))
                return null;
            return this._dic[key];
        }
        getkeys() {
            let list = [];
            for (let key in this._dic) {
                list.push(key);
            }
            return list;
        }
        getValues() {
            let list = [];
            for (let key in this._dic) {
                list.push(this._dic[key]);
            }
            return list;
        }
        clear() {
            for (let key in this._dic) {
                delete this._dic[key];
            }
        }
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        foreach(compareFn) {
            for (let key in this._dic) {
                if (!compareFn.call(null, key, this._dic[key]))
                    break;
            }
        }
        get length() {
            return airkit.DicUtils.getLength(this._dic);
        }
    }
    airkit.SDictionary = SDictionary;
})(airkit || (airkit = {}));
//import { ArrayUtils } from "../utils/ArrayUtils";

(function (airkit) {
    /**
     * 二维数组
     * @author ankye
     * @time 2018-7-8
     */
    class DoubleArray {
        constructor(rows, cols, value) {
            this._array = [];
            if (rows > 0 && cols > 0) {
                for (let row = 0; row < rows; ++row) {
                    for (let col = 0; col < cols; ++col) {
                        this.set(row, col, value);
                    }
                }
            }
        }
        set(row, col, value) {
            if (!this._array[row])
                this._array[row] = [];
            this._array[row][col] = value;
        }
        get(row, col) {
            if (!this._array[row])
                return null;
            return this._array[row][col];
        }
        clear() {
            airkit.ArrayUtils.clear(this._array);
        }
    }
    airkit.DoubleArray = DoubleArray;
})(airkit || (airkit = {}));
//import { Log } from "../log/Log";

(function (airkit) {
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
    class LinkList {
        constructor() {
            /**表头*/
            this._linkHead = null;
            /**节点个数*/
            this._size = 0;
            this._linkHead = { Data: null, Prev: null, Next: null }; //双向链表 表头为空
            this._linkHead.Prev = this._linkHead;
            this._linkHead.Next = this._linkHead;
            this._size = 0;
        }
        /**在链表末尾添加*/
        add(t) {
            this.append(this._size, t);
        }
        /**将节点插入到第index位置之前*/
        insert(index, t) {
            if (this._size < 1 || index >= this._size)
                airkit.Log.exception("没有可插入的点或者索引溢出了");
            if (index == 0)
                this.append(this._size, t);
            else {
                let inode = this.getNode(index);
                let tnode = { Data: t, Prev: inode.Prev, Next: inode };
                inode.Prev.Next = tnode;
                inode.Prev = tnode;
                this._size++;
            }
        }
        /**追加到index位置之后*/
        append(index, t) {
            let inode;
            if (index == 0)
                inode = this._linkHead;
            else {
                index = index - 1;
                if (index < 0)
                    airkit.Log.exception("位置不存在");
                inode = this.getNode(index);
            }
            let tnode = { Data: t, Prev: inode, Next: inode.Next };
            inode.Next.Prev = tnode;
            inode.Next = tnode;
            this._size++;
        }
        /**
         * 删除节点，有效节点索引为[0,_size-1]
         */
        del(index) {
            let inode = this.getNode(index);
            inode.Prev.Next = inode.Next;
            inode.Next.Prev = inode.Prev;
            this._size--;
        }
        delFirst() {
            this.del(0);
        }
        delLast() {
            this.del(this._size - 1);
        }
        get(index) {
            return this.getNode(index).Data;
        }
        getFirst() {
            return this.getNode(0).Data;
        }
        getLast() {
            return this.getNode(this._size - 1).Data;
        }
        /**通过索引查找*/
        getNode(index) {
            if (index < 0 || index >= this._size) {
                airkit.Log.exception("索引溢出或者链表为空");
            }
            if (index < this._size / 2) {
                //正向查找
                let node = this._linkHead.Next;
                for (let i = 0; i < index; i++)
                    node = node.Next;
                return node;
            }
            //反向查找
            let rnode = this._linkHead.Prev;
            let rindex = this._size - index - 1;
            for (let i = 0; i < rindex; i++)
                rnode = rnode.Prev;
            return rnode;
        }
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        foreach(compareFn) {
            let node = this._linkHead.Next;
            if (!node)
                return;
            do {
                if (!compareFn.call(null, node.Data))
                    break;
                node = node.Next;
            } while (node != this._linkHead);
        }
        isEmpty() {
            return this._size == 0;
        }
        get length() {
            return this._size;
        }
    }
    airkit.LinkList = LinkList;
})(airkit || (airkit = {}));
// import { Log } from "../log/Log";
// import { DicUtils } from "../utils/DicUtils";

(function (airkit) {
    /**
     * 对象缓存
     * 1.如果继承IPoolsObject，并实现init接口函数；创建时会自动调用init函数
     * @author ankye
     * @time 2018-7-11
     */
    class ObjectPools {
        /**
         * 获取一个对象，不存在则创建,classDef必须要有 objectKey的static变量
         * @param classDef  类名
         */
        static get(classDef) {
            let sign = classDef["objectKey"];
            if (sign == null) {
                //直接通过classDef.name获取sign,在混淆的情况下会出错
                airkit.Log.error("static objectKey must set in {0} ", classDef.name);
            }
            let pool = this.poolsMap[sign];
            if (pool == null) {
                pool = new Array();
                this.poolsMap[sign] = pool;
            }
            let obj = pool.pop();
            if (obj == null) {
                obj = new classDef();
            }
            if (obj && obj["init"])
                obj.init();
            return obj;
        }
        /**
         * 回收对象
         * @param obj  对象实例
         */
        static recover(obj) {
            if (!obj)
                return;
            if (obj["parent"] != null) {
                obj.removeFromParent();
            }
            if (obj["dispose"] && obj["displayObject"] == null) {
                obj.dispose();
                return;
            }
            let proto = Object.getPrototypeOf(obj);
            let clazz = proto["constructor"];
            let sign = clazz["objectKey"];
            let pool = this.poolsMap[sign];
            if (pool != null) {
                if (obj["visible"] !== null && obj["visible"] === false) {
                    obj.visible = true;
                }
                pool.push(obj);
            }
        }
        static clearAll() {
            airkit.DicUtils.foreach(this.poolsMap, (k, v) => {
                this.clear(k);
                return true;
            });
        }
        static clear(sign) {
            let pool = this.poolsMap[sign];
            airkit.Log.info("max object count {0}", pool.length);
            while (pool.length > 0) {
                let obj = pool.pop();
                if (obj && obj["dispose"]) {
                    if (obj["parent"] != null) {
                        obj.removeFromParent();
                    }
                    else if (obj.displayObject["parent"] != null) {
                        obj.displayObject.removeFromParent();
                    }
                    obj.dispose();
                }
            }
        }
    }
    ObjectPools.poolsMap = {};
    airkit.ObjectPools = ObjectPools;
})(airkit || (airkit = {}));
/**
 * 队列：先入先出
 * @author ankye
 * @time 2018-7-6
 */

(function (airkit) {
    class Queue {
        constructor() {
            this._list = [];
        }
        /**添加到队列尾*/
        enqueue(item) {
            this._list.push(item);
        }
        /**获取队列头，并删除*/
        dequeue() {
            return this._list.shift();
        }
        /**获取队列头，并不删除*/
        peek() {
            if (this._list.length == 0)
                return null;
            return this._list[0];
        }
        /**查询某个元素，并不删除*/
        seek(index) {
            if (this._list.length < index)
                return null;
            return this._list[index];
        }
        /**转换成标准数组*/
        toArray() {
            return this._list.slice(0, this._list.length);
        }
        /**是否包含指定元素*/
        contains(item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        }
        /**清空*/
        clear() {
            this._list.length = 0;
        }
        get length() {
            return this._list.length;
        }
        foreach(compareFn) {
            for (let item of this._list) {
                if (!compareFn.call(null, item))
                    break;
            }
        }
    }
    airkit.Queue = Queue;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * Size大小 宽高
     * @author ankye
     * @time 2018-7-3
     */
    class Size {
        constructor(w = 0, h = 0) {
            this._width = w;
            this._height = h;
        }
        set(w, h) {
            this._width = w;
            this._height = h;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
    }
    airkit.Size = Size;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 栈：后入先出
     * @author ankye
     * @time 2018-7-6
     */
    class Stack {
        constructor() {
            this._list = [];
        }
        /**添加数据*/
        push(item) {
            this._list.push(item);
        }
        /**获取栈顶元素，并删除*/
        pop() {
            return this._list.pop();
        }
        /**获取栈顶元素，并不删除*/
        peek() {
            if (this._list.length == 0)
                return null;
            return this._list[this._list.length - 1];
        }
        /**转换成标准数组*/
        toArray() {
            return this._list.slice(0, this._list.length);
        }
        /**是否包含指定元素*/
        contains(item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        }
        /**清空*/
        clear() {
            this._list.length = 0;
        }
        get length() {
            return this._list.length;
        }
        foreach(compareFn) {
            for (let item of this._list) {
                if (!compareFn.call(null, item))
                    break;
            }
        }
    }
    airkit.Stack = Stack;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 预留id=0，不显示加载界面
     */
    airkit.LOADVIEW_TYPE_NONE = 0;
    let eUIQueueType;
    (function (eUIQueueType) {
        eUIQueueType[eUIQueueType["POPUP"] = 0] = "POPUP";
        eUIQueueType[eUIQueueType["ALERT"] = 1] = "ALERT";
    })(eUIQueueType = airkit.eUIQueueType || (airkit.eUIQueueType = {}));
    let ePopupAnim;
    (function (ePopupAnim) {
    })(ePopupAnim = airkit.ePopupAnim || (airkit.ePopupAnim = {}));
    let eCloseAnim;
    (function (eCloseAnim) {
        eCloseAnim[eCloseAnim["CLOSE_CENTER"] = 1] = "CLOSE_CENTER";
    })(eCloseAnim = airkit.eCloseAnim || (airkit.eCloseAnim = {}));
    let eAligeType;
    (function (eAligeType) {
        eAligeType[eAligeType["NONE"] = 0] = "NONE";
        eAligeType[eAligeType["RIGHT"] = 1] = "RIGHT";
        eAligeType[eAligeType["RIGHT_BOTTOM"] = 2] = "RIGHT_BOTTOM";
        eAligeType[eAligeType["BOTTOM"] = 3] = "BOTTOM";
        eAligeType[eAligeType["LEFT_BOTTOM"] = 4] = "LEFT_BOTTOM";
        eAligeType[eAligeType["LEFT"] = 5] = "LEFT";
        eAligeType[eAligeType["LEFT_TOP"] = 6] = "LEFT_TOP";
        eAligeType[eAligeType["TOP"] = 7] = "TOP";
        eAligeType[eAligeType["RIGHT_TOP"] = 8] = "RIGHT_TOP";
        eAligeType[eAligeType["MID"] = 9] = "MID";
    })(eAligeType = airkit.eAligeType || (airkit.eAligeType = {}));
    /**
     * UI层级
     */
    let eUILayer;
    (function (eUILayer) {
        eUILayer[eUILayer["BG"] = 0] = "BG";
        eUILayer[eUILayer["MAIN"] = 1] = "MAIN";
        eUILayer[eUILayer["GUI"] = 2] = "GUI";
        eUILayer[eUILayer["POPUP"] = 3] = "POPUP";
        eUILayer[eUILayer["TOOLTIP"] = 4] = "TOOLTIP";
        eUILayer[eUILayer["SYSTEM"] = 5] = "SYSTEM";
        eUILayer[eUILayer["LOADING"] = 6] = "LOADING";
        eUILayer[eUILayer["TOP"] = 7] = "TOP";
        eUILayer[eUILayer["MAX"] = 8] = "MAX";
    })(eUILayer = airkit.eUILayer || (airkit.eUILayer = {}));
    let LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
        LogLevel[LogLevel["INFO"] = 6] = "INFO";
        LogLevel[LogLevel["WARNING"] = 5] = "WARNING";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["EXCEPTION"] = 3] = "EXCEPTION";
    })(LogLevel = airkit.LogLevel || (airkit.LogLevel = {}));
    let ePopupButton;
    (function (ePopupButton) {
        ePopupButton[ePopupButton["Close"] = 0] = "Close";
        ePopupButton[ePopupButton["Cancel"] = 1] = "Cancel";
        ePopupButton[ePopupButton["Ok"] = 2] = "Ok"; //确定按钮
    })(ePopupButton = airkit.ePopupButton || (airkit.ePopupButton = {}));
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 配置表
     * @author ankye
     * @time 2018-7-11
     */
    class ConfigItem {
        constructor(url, name, key) {
            this.url = url;
            this.name = name;
            this.key = key;
        }
    }
    airkit.ConfigItem = ConfigItem;
})(airkit || (airkit = {}));
// import { Singleton } from "../collection/Singleton";
// import { ConfigItem } from "./ConfigItem";
// import { DataProvider } from "./DataProvider";
// import { ArrayUtils } from "../utils/ArrayUtils";

(function (airkit) {
    /**
     * 配置表管理器
     * @author ankye
     * @time 2017-7-9
     */
    class ConfigManger extends airkit.Singleton {
        static get Instance() {
            if (!this.instance)
                this.instance = new ConfigManger();
            return this.instance;
        }
        /**初始化数据*/
        init(keys, zipPath = null) {
            if (zipPath != null)
                ConfigManger.zipUrl = zipPath;
            this._listTables = [];
            let c = keys;
            for (let k in c) {
                this._listTables.push(new airkit.ConfigItem(k, k, c[k]));
            }
        }
        /**释放数据*/
        release() {
            if (!this._listTables)
                return;
            for (let info of this._listTables) {
                airkit.DataProvider.Instance.unload(info.url);
            }
            airkit.ArrayUtils.clear(this._listTables);
            this._listTables = null;
        }
        /**开始加载*/
        loadAll() {
            if (this._listTables.length > 0) {
                airkit.DataProvider.Instance.enableZip();
                return airkit.DataProvider.Instance.loadZip(ConfigManger.zipUrl, this._listTables);
            }
            //return DataProvider.Instance.load(this._listTables)
        }
        /**
         * 获取列表，fiter用于过滤,可以有多个值，格式为 [{k:"id",v:this.id},{k:"aaa",v:"bbb"}]
         * @param table
         * @param filter 目前只实现了绝对值匹配
         */
        getList(table, filter) {
            let dic = airkit.DataProvider.Instance.getConfig(table);
            if (dic == null)
                return [];
            if (filter == null)
                filter = [];
            let result = [];
            for (let key in dic) {
                let val = dic[key];
                let flag = true;
                for (let j = 0; j < filter.length; j++) {
                    let k = filter[j]["k"];
                    let v = filter[j]["v"];
                    if (val[k] != v) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    result.push(val);
                }
            }
            return result;
        }
        getInfo(table, key) {
            let info = airkit.DataProvider.Instance.getInfo(table, key);
            return info;
        }
        /**定义需要前期加载的资源*/
        // public get preLoadRes(): Array<[string, string]> {
        //     let c = TableConfig.keys()
        //     let res = []
        //     for (let k in c) {
        //         res.push(["res/config/" + k, laya.net.Loader.JSON])
        //     }
        //     return res
        // }
        get listTables() {
            return this._listTables;
        }
    }
    ConfigManger.instance = null;
    ConfigManger.zipUrl = "res/config.zip";
    airkit.ConfigManger = ConfigManger;
})(airkit || (airkit = {}));
// import { assertNullOrNil } from "../utils/Utils";
// import { StringUtils } from "../utils/StringUtils";
// import { ResourceManager } from "../loader/ResourceManager";
// import { Log } from "../log/Log";
// import { SDictionary } from "../collection/Dictionary";
// import { Singleton } from "../collection/Singleton";
// import { ConfigItem } from "./ConfigItem";
// import ZipUtils from "../utils/ZipUtils";

(function (airkit) {
    /**
     * json配置表
     * @author ankye
     * @time 2018-7-11
     */
    class DataProvider extends airkit.Singleton {
        constructor() {
            super(...arguments);
            this._dicTemplate = null;
            this._dicData = null;
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new DataProvider();
            return this.instance;
        }
        enableZip() {
            this._zip = true;
        }
        setup() {
            this._dicTemplate = new airkit.SDictionary();
            this._dicData = new airkit.SDictionary();
            this._zip = false;
        }
        destroy() {
            this.unloadAll();
            if (this._dicTemplate) {
                this._dicTemplate.clear();
                this._dicTemplate = null;
            }
            if (this._dicData) {
                this._dicData.clear();
                this._dicData = null;
            }
            return true;
        }
        loadZip(url, list) {
            return new Promise((resolve, reject) => {
                airkit.ResourceManager.Instance.loadRes(url, cc.BufferAsset).then((v) => {
                    let ab = airkit.ResourceManager.Instance.getRes(url);
                    airkit.ZipUtils.unzip(ab)
                        .then((v) => {
                        for (let i = 0; i < list.length; i++) {
                            let template = list[i];
                            this._dicTemplate.add(list[i].url, template);
                            airkit.Log.info("Load config {0}", template.url);
                            let json_res = JSON.parse(v[template.url]);
                            if (airkit.StringUtils.isNullOrEmpty(template.key)) {
                                this._dicData.add(template.name, json_res);
                            }
                            else {
                                let map = {};
                                let sValue;
                                let sData;
                                let i = 0;
                                let isArrayKey = Array.isArray(template.key);
                                while (json_res[i]) {
                                    sData = json_res[i];
                                    if (isArrayKey) {
                                        sValue = sData[template.key[0]];
                                        for (let i = 1; i < template.key.length; i++) {
                                            sValue += "_" + sData[template.key[i]];
                                        }
                                    }
                                    else {
                                        sValue = sData[template.key];
                                    }
                                    airkit.assertNullOrNil(sValue, "配置表解析错误:" + template.url);
                                    map[sValue] = sData;
                                    i++;
                                }
                                this._dicData.add(template.name, map);
                            }
                        }
                        resolve(v);
                    })
                        .catch((e) => {
                        airkit.Log.error(e);
                        reject(e);
                    });
                });
            });
        }
        load(list) {
            return new Promise((resolve, reject) => {
                let assets = [];
                for (let i = 0; i < list.length; i++) {
                    if (!airkit.ResourceManager.Instance.getRes(list[i].url)) {
                        assets.push({ url: list[i].url, type: cc.JsonAsset });
                        this._dicTemplate.add(list[i].url, list[i]);
                    }
                }
                if (assets.length == 0) {
                    resolve([]);
                    return;
                }
                airkit.ResourceManager.Instance.loadArrayRes(assets)
                    .then((v) => {
                    for (let i = 0; i < v.length; i++) {
                        this.onLoadComplete(v[i]);
                        resolve(v);
                    }
                })
                    .catch((e) => {
                    reject(e);
                });
            });
        }
        unload(url) {
            let template = this._dicTemplate.getValue(url);
            if (template) {
                this._dicData.remove(template.name);
            }
            if (this._zip) {
            }
            else {
                airkit.ResourceManager.Instance.clearRes(url, 1);
            }
            this._dicTemplate.remove(url);
        }
        unloadAll() {
            if (!this._dicTemplate)
                return;
            this._dicTemplate.foreach(function (key, value) {
                this.Unload(key);
                return true;
            });
            this._dicData.clear();
            this._dicTemplate.clear();
        }
        /**返回表*/
        getConfig(table) {
            let data = this._dicData.getValue(table);
            return data;
        }
        /**返回一行*/
        getInfo(table, key) {
            let data = this._dicData.getValue(table);
            if (data) {
                let isArrayKey = Array.isArray(key);
                let sValue;
                if (isArrayKey) {
                    sValue = key[0];
                    for (let i = 1; i < key.length; i++) {
                        sValue += "_" + key[i];
                    }
                }
                else {
                    sValue = key;
                }
                let info = data[sValue];
                return info;
            }
            return null;
        }
        getRes(url) {
            airkit.Log.debug("[load]加载配置表:" + url);
            let template = this._dicTemplate.getValue(url);
            if (template) {
                let json_res = airkit.ResourceManager.Instance.getRes(url);
                if (airkit.StringUtils.isNullOrEmpty(template.key)) {
                    this._dicData.add(template.name, json_res);
                }
                else {
                    let map = {};
                    let sValue;
                    let sData;
                    let i = 0;
                    let isArrayKey = Array.isArray(template.key);
                    while (json_res[i]) {
                        sData = json_res[i];
                        if (isArrayKey) {
                            sValue = sData[template.key[0]];
                            for (let i = 1; i < template.key.length; i++) {
                                sValue += "_" + sData[template.key[i]];
                            }
                        }
                        else {
                            sValue = sData[template.key];
                        }
                        airkit.assertNullOrNil(sValue, "配置表解析错误:" + template.url);
                        map[sValue] = sData;
                        i++;
                    }
                    this._dicData.add(template.name, map);
                }
            }
        }
        onLoadComplete(url) {
            this.getRes(url);
        }
    }
    DataProvider.instance = null;
    airkit.DataProvider = DataProvider;
})(airkit || (airkit = {}));

(function (airkit) {
    function base64_encode(data) {
        let base = new Base64();
        let buffer = stringToArrayBuffer(data);
        let str = base.encode(buffer);
        return str;
    }
    airkit.base64_encode = base64_encode;
    // Converts a string to an ArrayBuffer.
    function stringToArrayBuffer(s) {
        var buffer = new ArrayBuffer(s.length);
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < s.length; ++i) {
            bytes[i] = s.charCodeAt(i);
        }
        return buffer;
    }
    airkit.stringToArrayBuffer = stringToArrayBuffer;
    // For the base64 encoding pieces.
    class Base64 {
        constructor() {
            this.alphabet = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "+",
                "/"
            ];
            this.values = {};
            for (let i = 0; i < 64; ++i) {
                this.values[this.alphabet[i]] = i;
            }
        }
        encode(bytes) {
            const array = new Uint8Array(bytes);
            const base64 = [];
            let index = 0;
            let quantum;
            let value;
            /* tslint:disable:no-bitwise */
            // Grab as many sets of 3 bytes as we can, that form 24 bits.
            while (index + 2 < array.byteLength) {
                quantum =
                    (array[index] << 16) | (array[index + 1] << 8) | array[index + 2];
                // 24 bits will become 4 base64 chars.
                value = (quantum >> 18) & 0x3f;
                base64.push(this.alphabet[value]);
                value = (quantum >> 12) & 0x3f;
                base64.push(this.alphabet[value]);
                value = (quantum >> 6) & 0x3f;
                base64.push(this.alphabet[value]);
                value = quantum & 0x3f;
                base64.push(this.alphabet[value]);
                index += 3;
            }
            // At this point, there are 0, 1 or 2 bytes left.
            if (index + 1 === array.byteLength) {
                // 8 bits; shift by 4 to pad on the right with 0s to make 12 bits total.
                quantum = array[index] << 4;
                value = (quantum >> 6) & 0x3f;
                base64.push(this.alphabet[value]);
                value = quantum & 0x3f;
                base64.push(this.alphabet[value]);
                base64.push("==");
            }
            else if (index + 2 === array.byteLength) {
                // 16 bits; shift by 2 to pad on the right with 0s to make 18 bits total.
                quantum = (array[index] << 10) | (array[index + 1] << 2);
                value = (quantum >> 12) & 0x3f;
                base64.push(this.alphabet[value]);
                value = (quantum >> 6) & 0x3f;
                base64.push(this.alphabet[value]);
                value = quantum & 0x3f;
                base64.push(this.alphabet[value]);
                base64.push("=");
            }
            /* tslint:enable:no-bitwise */
            return base64.join("");
        }
        decode(string) {
            let size = string.length;
            if (size === 0) {
                return new Uint8Array(new ArrayBuffer(0));
            }
            if (size % 4 !== 0) {
                throw new Error("Bad length: " + size);
            }
            if (!string.match(/^[a-zA-Z0-9+/]+={0,2}$/)) {
                throw new Error("Invalid base64 encoded value");
            }
            // Every 4 base64 chars = 24 bits = 3 bytes. But, we also need to figure out
            // padding, if any.
            let bytes = 3 * (size / 4);
            let numPad = 0;
            if (string.charAt(size - 1) === "=") {
                numPad++;
                bytes--;
            }
            if (string.charAt(size - 2) === "=") {
                numPad++;
                bytes--;
            }
            const buffer = new Uint8Array(new ArrayBuffer(bytes));
            let index = 0;
            let bufferIndex = 0;
            let quantum;
            if (numPad > 0) {
                size -= 4; // handle the last one specially
            }
            /* tslint:disable:no-bitwise */
            while (index < size) {
                quantum = 0;
                for (let i = 0; i < 4; ++i) {
                    quantum = (quantum << 6) | this.values[string.charAt(index + i)];
                }
                // quantum is now a 24-bit value.
                buffer[bufferIndex++] = (quantum >> 16) & 0xff;
                buffer[bufferIndex++] = (quantum >> 8) & 0xff;
                buffer[bufferIndex++] = quantum & 0xff;
                index += 4;
            }
            if (numPad > 0) {
                // if numPad == 1, there is one =, and we have 18 bits with 2 0s at end.
                // if numPad == 2, there is two ==, and we have 12 bits with 4 0s at end.
                // First, grab my quantum.
                quantum = 0;
                for (let i = 0; i < 4 - numPad; ++i) {
                    quantum = (quantum << 6) | this.values[string.charAt(index + i)];
                }
                if (numPad === 1) {
                    // quantum is 18 bits, but really represents two bytes.
                    quantum = quantum >> 2;
                    buffer[bufferIndex++] = (quantum >> 8) & 0xff;
                    buffer[bufferIndex++] = quantum & 0xff;
                }
                else {
                    // quantum is 12 bits, but really represents only one byte.
                    quantum = quantum >> 4;
                    buffer[bufferIndex++] = quantum & 0xff;
                }
            }
            /* tslint:enable:no-bitwise */
            return buffer;
        }
    }
    airkit.Base64 = Base64;
})(airkit || (airkit = {}));

(function (airkit) {
    function md5_encrypt(data) {
        let base = new MD5();
        return base.hex_md5(data);
    }
    airkit.md5_encrypt = md5_encrypt;
    class MD5 {
        constructor() {
            this.hexcase = 0; /* hex output format. 0 - lowercase 1 - uppercase        */
            this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
        }
        /*
         * These are the privates you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        hex_md5(s) {
            return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
        } //这个函数就行了，
        b64_md5(s) {
            return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s)));
        }
        any_md5(s, e) {
            return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e);
        }
        hex_hmac_md5(k, d) {
            return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
        }
        b64_hmac_md5(k, d) {
            return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
        }
        any_hmac_md5(k, d, e) {
            return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e);
        }
        /*
         * Perform a simple self-test to see if the VM is working
         */
        md5_vm_test() {
            return (this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72");
        }
        /*
         * Calculate the MD5 of a raw string
         */
        rstr_md5(s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        }
        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        rstr_hmac_md5(key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5c5c5c5c;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        }
        /*
         * Convert a raw string to a hex string
         */
        rstr2hex(input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
            }
            return output;
        }
        /*
         * Convert a raw string to a base-64 string
         */
        rstr2b64(input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = "";
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) |
                    (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
                    (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
                }
            }
            return output;
        }
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        rstr2any(input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] =
                    (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil((input.length * 8) / (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }
            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        }
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        str2rstr_utf8(input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
                    x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
                    i++;
                }
                /* Encode output as utf-8 */
                if (x <= 0x7f)
                    output += String.fromCharCode(x);
                else if (x <= 0x7ff)
                    output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
                else if (x <= 0xffff)
                    output += String.fromCharCode(0xe0 | ((x >>> 12) & 0x0f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
                else if (x <= 0x1fffff)
                    output += String.fromCharCode(0xf0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
            }
            return output;
        }
        /*
         * Encode a string as utf-16
         */
        str2rstr_utf16le(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xff, (input.charCodeAt(i) >>> 8) & 0xff);
            return output;
        }
        str2rstr_utf16be(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xff, input.charCodeAt(i) & 0xff);
            return output;
        }
        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        rstr2binl(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
            return output;
        }
        /*
         * Convert an array of little-endian words to a string
         */
        binl2rstr(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
            return output;
        }
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        binl_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << len % 32;
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return [a, b, c, d];
        }
        /*
         * These privates implement the four basic operations the algorithm uses.
         */
        md5_cmn(q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        }
        md5_ff(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | (~b & d), a, b, x, s, t);
        }
        md5_gg(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & ~d), a, b, x, s, t);
        }
        md5_hh(a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        md5_ii(a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        safe_add(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
    }
    airkit.MD5 = MD5;
})(airkit || (airkit = {}));
// import { ArrayUtils } from "../utils/ArrayUtils";

(function (airkit) {
    /**
     * 事件参数
     * @author ankye
     * @time 2018-7-6
     */
    class EventArgs {
        constructor(...args) {
            this._type = "";
            this._data = null;
            if (!args || args.length == 0)
                return;
            if (args instanceof Array)
                this._data = airkit.ArrayUtils.copy(args[0]);
            else
                this._data = airkit.ArrayUtils.copy(args);
        }
        init(...args) {
            if (args.length == 0)
                return;
            if (args instanceof Array)
                this._data = airkit.ArrayUtils.copy(args[0]);
            else
                this._data = airkit.ArrayUtils.copy(args);
        }
        get(index) {
            if (!this._data || this._data.length == 0)
                return null;
            if (index < 0 || index >= this._data.length)
                return null;
            return this._data[index];
        }
        get type() {
            return this._type;
        }
        set type(t) {
            this._type = t;
        }
    }
    airkit.EventArgs = EventArgs;
})(airkit || (airkit = {}));
// import { EventArgs } from "./EventArgs";
// import { EventDispatcher } from "./EventDispatcher";
// import { Singleton } from "../collection/Singleton";

(function (airkit) {
    /**
     * 全局事件
     * @author ankye
     * @time 2018-7-6
     */
    class EventCenter extends airkit.Singleton {
        constructor() {
            super();
            this._event = null;
            this._evtArgs = null;
            this._event = new airkit.EventDispatcher();
            this._evtArgs = new airkit.EventArgs();
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new EventCenter();
            return this.instance;
        }
        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        static on(type, caller, fun) {
            EventCenter.Instance._event.on(type, caller, fun);
        }
        /**
         * 移除监听
         */
        static off(type, caller, fun) {
            EventCenter.Instance._event.off(type, caller, fun);
        }
        /**
         * 派发事件
         */
        static dispatchEvent(type, ...args) {
            EventCenter.Instance._evtArgs.init(args);
            EventCenter.Instance._event.dispatchEvent(type, EventCenter.Instance._evtArgs);
        }
        static clear() {
            EventCenter.Instance._event.clear();
        }
    }
    EventCenter.instance = null;
    airkit.EventCenter = EventCenter;
})(airkit || (airkit = {}));
// import { DicUtils } from "../utils/DicUtils";
// import { EventArgs } from "./EventArgs";

(function (airkit) {
    /**
     * 事件
     * @author ankye
     * @time 2018-7-6
     */
    class EventDispatcher {
        constructor() {
            this._dicFuns = {};
            this._evtArgs = null;
            this._evtArgs = new airkit.EventArgs();
        }
        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        on(type, caller, fun) {
            if (!this._dicFuns[type]) {
                this._dicFuns[type] = [];
                this._dicFuns[type].push(airkit.Handler.create(caller, fun, null, false));
            }
            else {
                let arr = this._dicFuns[type];
                for (let item of arr) {
                    if (item.caller == caller && item.method == fun)
                        return;
                }
                arr.push(airkit.Handler.create(caller, fun, null, false));
            }
        }
        /**
         * 移除监听
         */
        off(type, caller, fun) {
            let arr = this._dicFuns[type];
            if (!arr)
                return;
            for (let i = 0; i < arr.length; ++i) {
                let item = arr[i];
                if (item.caller == caller && item.method == fun) {
                    item.recover();
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        /**
         * 派发事件，注意参数类型为EventArgs
         */
        dispatchEvent(type, args) {
            args.type = type;
            let arr = this._dicFuns[type];
            if (!arr)
                return;
            for (let item of arr) {
                item.runWith(args);
            }
        }
        /**
         * 派发事件
         */
        dispatch(type, ...args) {
            this._evtArgs.init(args);
            this.dispatchEvent(type, this._evtArgs);
        }
        clear() {
            airkit.DicUtils.clearDic(this._dicFuns);
        }
    }
    airkit.EventDispatcher = EventDispatcher;
})(airkit || (airkit = {}));

(function (airkit) {
    class Event {
    }
    Event.PROGRESS = "progress";
    Event.COMPLETE = "complete";
    Event.ERROR = "error";
    airkit.Event = Event;
    class EventID {
    }
    //～～～～～～～～～～～～～～～～～～～～～～～场景~～～～～～～～～～～～～～～～～～～～～～～～//
    //游戏
    EventID.BEGIN_GAME = "BEGIN_GAME";
    EventID.RESTART_GAEM = "RESTART_GAME";
    //暂停游戏-主界面暂停按钮
    EventID.STOP_GAME = "STOP_GAME";
    EventID.PAUSE_GAME = "PAUSE_GAME";
    EventID.ON_SHOW = "ON_SHOW";
    EventID.ON_HIDE = "ON_HIDE";
    //切换场景
    EventID.CHANGE_SCENE = "CHANGE_SCENE";
    EventID.RESIZE = "RESIZE";
    //模块管理事件
    EventID.BEGIN_MODULE = "BEGIN_MODULE";
    EventID.END_MODULE = "END_MODULE";
    EventID.ENTER_MODULE = "ENTER_MODULE";
    EventID.EXIT_MODULE = "EXIT_MODULE";
    EventID.UI_OPEN = "UI_OPEN"; //界面打开
    EventID.UI_CLOSE = "UI_CLOSE"; //界面关闭
    EventID.UI_LANG = "UI_LANG"; //语言设置改变
    airkit.EventID = EventID;
    class LoaderEventID {
    }
    //加载事件
    LoaderEventID.RESOURCE_LOAD_COMPLATE = "RESOURCE_LOAD_COMPLATE"; //资源加载完成
    LoaderEventID.RESOURCE_LOAD_PROGRESS = "RESOURCE_LOAD_PROGRESS"; //资源加载进度
    LoaderEventID.RESOURCE_LOAD_FAILED = "RESOURCE_LOAD_FAILED"; //资源加载失败
    //加载界面事件
    LoaderEventID.LOADVIEW_OPEN = "LOADVIEW_OPEN"; //加载界面打开
    LoaderEventID.LOADVIEW_COMPLATE = "LOADVIEW_COMPLATE"; //加载进度完成
    LoaderEventID.LOADVIEW_PROGRESS = "LOADVIEW_PROGRESS"; //加载进度
    airkit.LoaderEventID = LoaderEventID;
})(airkit || (airkit = {}));
// import { ISignal } from "./ISignal";

(function (airkit) {
    class Signal {
        constructor() { }
        destory() {
            this._listener && this._listener.destory();
            this._listener = null;
        }
        /**
         * 派发信号
         * @param arg
         */
        dispatch(arg) {
            if (this._listener)
                this._listener.execute(arg);
        }
        has(caller) {
            if (this._listener == null)
                return false;
            return this._listener.has(caller);
        }
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        on(caller, method, ...args) {
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, false);
        }
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        once(caller, method, ...args) {
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, true);
        }
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        off(caller, method) {
            if (this._listener)
                this._listener.off(caller, method);
        }
        /**
         * 保证ListenerManager可用
         */
        makeSureListenerManager() {
            if (!this._listener)
                this._listener = new SignalListener();
        }
    }
    airkit.Signal = Signal;
    class SignalListener {
        constructor() {
            this.stopped = false;
        }
        destory() {
            this.stopped = false;
            this.clear();
        }
        has(caller) {
            for (let i = 0; i < this.handlers.length; i++) {
                if (this.handlers[i].caller == caller) {
                    return true;
                }
            }
            return false;
        }
        on(caller, method, args, once = false) {
            if (!this.handlers)
                this.handlers = [];
            let handler = new airkit.Handler(caller, method, args, once);
            this.handlers.push(handler);
            return handler;
        }
        /**
         * 解除回调
         * @param caller
         * @param method
         */
        off(caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            let tempHandlers = [];
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                if (handler.caller === caller && handler.method === method) {
                    handler.recover();
                    break;
                }
                else {
                    tempHandlers.push(handler);
                }
            }
            // 把剩下的放回
            ++i;
            for (; i < this.handlers.length; ++i) {
                tempHandlers.push(this.handlers[i]);
            }
            this.handlers = tempHandlers;
        }
        /**
         * 解除所有回调
         * @param caller
         * @param method
         */
        offAll(caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            let temp = [];
            let handlers = this.handlers;
            let len = handlers.length;
            for (var i = 0; i < len; ++i) {
                if (caller !== handlers[i].caller || method !== handlers[i].method) {
                    temp.push(handlers[i]);
                }
                else {
                    handlers[i].recover();
                }
            }
            this.handlers = temp;
        }
        /**
         * 清除所有回调
         */
        clear() {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                handler.recover();
            }
            this.handlers = null;
        }
        stop() {
            this.stopped = true;
        }
        execute(...args) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            let handlers = this.handlers;
            let len = handlers.length;
            let handler;
            let temp = [];
            let i = 0;
            for (; i < len; ++i) {
                if (this.stopped)
                    break;
                handler = handlers[i];
                handler.runWith(args);
                if (handler.method) {
                    temp.push(handler);
                }
            }
            for (; i < len; ++i) {
                temp.push(handlers[i]);
            }
            this.stopped = false;
            this.handlers = temp;
            handler = null;
            handlers = null;
            temp = null;
        }
    }
    airkit.SignalListener = SignalListener;
})(airkit || (airkit = {}));
// import { DataProvider } from "../config/DataProvider";
// import { Log } from "../log/Log";
// import { EventCenter } from "../event/EventCenter";
// import { Singleton } from "../collection/Singleton";
// import { ConfigItem } from "../config/ConfigItem";
// import { ArrayUtils } from "../utils/ArrayUtils";
// import { EventID } from "../event/EventID";
// import { SDictionary } from "../collection/Dictionary";
// import { StringUtils } from "../utils/StringUtils";
// import { ConfigManger } from "../config/ConfigManager";

(function (airkit) {
    /**
     * 提供简易获取语言包的方式,配合语言导出脚本
     * @param key LK.xxx  {0},{1}..{n}.表示参数占位符
     * @param args
     */
    function L(key, ...args) {
        let str = LangManager.Instance.getText(LangManager.Instance.curLang, key);
        if (str == null)
            return "unknown key:" + key;
        return airkit.StringUtils.format(str, ...args);
    }
    airkit.L = L;
    /**
     * 多语言
     * @author ankye
     * @time 2017-7-9
     */
    class LangManager extends airkit.Singleton {
        static get Instance() {
            if (!this.instance)
                this.instance = new LangManager();
            return this.instance;
        }
        init() {
            //this._langs = new SDictionary<LangConfig>()
            //  this._listTables = []
            this._curLang = null;
        }
        // public addLangPack(conf: LangConfig): void {
        //     // this._listTables.push(new ConfigItem(conf.url, conf.name, "id"))
        //     this._langs.add(conf.name, conf)
        // }
        destory() {
            // if (!this._listTables) return
            // for (let info of this._listTables) {
            //     DataProvider.Instance.unload(info.url)
            // }
            // ArrayUtils.clear(this._listTables)
            // this._listTables = null
            // this._langs.clear()
        }
        /**开始加载*/
        // public loadAll(): void {
        //     DataProvider.Instance.load(this._listTables)
        // }
        // public get listTables(): Array<Config> {
        //     return this._listTables
        // }
        /**
         * 切换语言
         * @param type  语言类型
         */
        changeLang(lang) {
            return new Promise((resolve, reject) => {
                if (lang == this._curLang) {
                    resolve(lang);
                    return;
                }
                let data = airkit.ConfigManger.Instance.getList(this._curLang);
                // for (let i = 0; i < this._listTables.length; i++) {
                //     if (this._listTables[i].name == lang) {
                //         data = this._listTables[i]
                //         break
                //     }
                // }
                if (data) {
                    if (airkit.DataProvider.Instance.getConfig(lang)) {
                        this._curLang = lang;
                        airkit.EventCenter.dispatchEvent(airkit.EventID.UI_LANG, this._curLang);
                        resolve(lang);
                    }
                }
                else {
                    airkit.Log.error("no lang package {0} ", lang);
                    reject("no lang package " + lang);
                }
            });
        }
        /**
         * 获取语言包
         * @param key     位置
         */
        getText(lang, key) {
            let info = airkit.DataProvider.Instance.getInfo(lang, key);
            if (info) {
                return info["name"];
            }
            else {
                airkit.Log.error("cant get lang key", key);
                return "";
            }
        }
        /**当前语言类型*/
        get curLang() {
            return this._curLang;
        }
    }
    //public _langs: SDictionary<LangConfig>
    // private _listTables: Array<ConfigItem>
    LangManager.instance = null;
    airkit.LangManager = LangManager;
    // export class LangConfig {
    //     public name: string
    //     public url: string
    //     constructor(name: string, url: string) {
    //         this.name = name
    //         this.url = url
    //     }
    // }
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 加载界面管理器
     * @author ankye
     * @time 2017-7-25
     */
    class LoaderManager extends airkit.Singleton {
        /**
         * 注册加载类，存放场景id和url的对应关系
         * @param view_type
         * @param className
         */
        static registerLoadingView(view_type, className, cls) {
            this.loaders.add(view_type, className);
            airkit.ClassUtils.regClass(className, cls);
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new LoaderManager();
            return this.instance;
        }
        setup() {
            this.registerEvent();
            this._dicLoadView = new airkit.NDictionary();
        }
        destroy() {
            this.unRegisterEvent();
            if (this._dicLoadView) {
                let view = null;
                this._dicLoadView.foreach(function (key, value) {
                    view = value;
                    view.close();
                    return true;
                });
                this._dicLoadView.clear();
                this._dicLoadView = null;
            }
            return true;
        }
        registerEvent() {
            airkit.EventCenter.on(airkit.LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
            airkit.EventCenter.on(airkit.LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
            airkit.EventCenter.on(airkit.LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
        }
        unRegisterEvent() {
            airkit.EventCenter.off(airkit.LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
            airkit.EventCenter.off(airkit.LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
            airkit.EventCenter.off(airkit.LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
        }
        /**加载进度事件*/
        onLoadViewEvt(args) {
            let type = args.type;
            let viewType = args.get(0);
            switch (type) {
                case airkit.LoaderEventID.LOADVIEW_OPEN:
                    {
                        airkit.Log.debug("显示加载界面");
                        let total = args.get(1);
                        let tips = args.get(2);
                        this.show(viewType, total, tips);
                    }
                    break;
                case airkit.LoaderEventID.LOADVIEW_PROGRESS:
                    {
                        //Log.debug("加载界面进度")
                        let cur = args.get(1);
                        let total = args.get(2);
                        this.setProgress(viewType, cur, total);
                    }
                    break;
                case airkit.LoaderEventID.LOADVIEW_COMPLATE:
                    {
                        airkit.Log.debug("加载界面关闭");
                        this.close(viewType);
                    }
                    break;
            }
        }
        show(type, total, tips) {
            if (type == null || type == airkit.LOADVIEW_TYPE_NONE)
                return;
            let view = this._dicLoadView.getValue(type);
            if (!view) {
                let className = LoaderManager.loaders.getValue(type);
                //切换
                if (className.length > 0) {
                    view = airkit.ClassUtils.getInstance(className);
                    if (view == null)
                        return;
                    view.setup([]);
                    let clas = airkit.ClassUtils.getClass(className);
                    view.loadResource(() => {
                        airkit.LayerManager.loadingLayer.addChild(view);
                        this._dicLoadView.add(type, view);
                        this.updateView(view, total, tips);
                    });
                }
                else {
                    airkit.Log.error("Must set loadingview first type= {0}", type);
                }
            }
            else {
                this.updateView(view, total, tips);
            }
        }
        updateView(view, total, tips) {
            if (!view.parent) {
                airkit.LayerManager.loadingLayer.addChild(view);
            }
            view.onOpen(total);
            view.setTips(tips);
            view.setVisible(true);
        }
        setProgress(type, cur, total) {
            let view = this._dicLoadView.getValue(type);
            if (!view) {
                return;
            }
            view.setProgress(cur, total);
        }
        close(type) {
            let view = this._dicLoadView.getValue(type);
            if (!view) {
                return;
            }
            view.setVisible(false);
            view.onClose();
            this._dicLoadView.remove(type);
            view = null;
            // TweenUtils.get(view).to({ alpha: 0 }, 500, Laya.Ease.bounceIn, LayaHandler.create(null, v => {
            // 	view.setVisible(false)
            // }))
        }
    }
    LoaderManager.loaders = new airkit.NDictionary();
    LoaderManager.instance = null;
    airkit.LoaderManager = LoaderManager;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 资源管理
     * @author ankye
     * @time 2018-7-10
     */
    airkit.FONT_SIZE_4 = 18;
    airkit.FONT_SIZE_5 = 22;
    airkit.FONT_SIZE_6 = 25;
    airkit.FONT_SIZE_7 = 29;
    class FguiAsset extends cc.BufferAsset {
    }
    airkit.FguiAsset = FguiAsset;
    class FguiAtlas extends cc.BufferAsset {
    }
    airkit.FguiAtlas = FguiAtlas;
    class ResourceManager extends airkit.Singleton {
        constructor() {
            super(...arguments);
            this._dicResInfo = null; //加载过的信息，方便资源释放
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new ResourceManager();
            return this.instance;
        }
        setup() {
            this._dicResInfo = new airkit.SDictionary();
            this._minLoaderTime = 1000;
        }
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
        destroy() {
            if (this._dicResInfo) {
                this._dicResInfo.foreach((k, v) => {
                    ResourceManager.Instance.clearRes(k, v.ref);
                    return true;
                });
                this._dicResInfo.clear();
                this._dicResInfo = null;
            }
            return true;
        }
        update(dt) { }
        /**获取资源*/
        getRes(url) {
            //修改访问时间
            return cc.resources.get(url);
        }
        dump() {
            this._dicResInfo.foreach((k, v) => {
                console.log("url:" + k + " refCount=" + v.ref + "\n");
                return true;
            });
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～加载～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
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
        loadRes(url, type, refCount = 1, viewType = airkit.LOADVIEW_TYPE_NONE, priority = 1, cache = true, pkg = "", ignoreCache = false) {
            //添加到加载目录
            if (viewType == null)
                viewType = airkit.LOADVIEW_TYPE_NONE;
            //判断是否需要显示加载界面
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                if (cc.resources.get(url))
                    viewType = airkit.LOADVIEW_TYPE_NONE;
            }
            //显示加载界面
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_OPEN, viewType, 1);
            }
            let resInfo = this._dicResInfo.getValue(url);
            if (!resInfo) {
                resInfo = new ResInfo(url, type, refCount, pkg);
                this._dicResInfo.set(url, resInfo);
                resInfo.updateStatus(eLoaderStatus.LOADING);
            }
            else {
                resInfo.incRef(refCount);
            }
            return new Promise((resolve, reject) => {
                cc.resources.load(url, type, (completedCount, totalCount, item) => {
                    this.onLoadProgress(viewType, totalCount, "", completedCount / totalCount);
                }, (error, resource) => {
                    if (error) {
                        resInfo.updateStatus(eLoaderStatus.READY);
                        resInfo.decRef(refCount);
                        reject(url);
                        return;
                    }
                    resInfo.updateStatus(eLoaderStatus.LOADED);
                    this.onLoadComplete(viewType, [url], [{ url: url, type: type, refCount: 1, pkg: pkg }], "");
                    resolve(url);
                });
            });
        }
        /**
         * 批量加载资源，如果所有资源在此之前已经加载过，则当前帧会调用complete
         * @param	arr_res 	需要加载的资源数组
         * @param	viewType 	加载界面
         * @param   tips		提示文字
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @return 	结束回调(参数：Array<string>，加载的url数组)
         */
        loadArrayRes(arr_res, viewType = airkit.LOADVIEW_TYPE_NONE, tips = null, priority = 1, cache = true) {
            let has_unload = false;
            let urls = [];
            let resArr = [];
            if (viewType == null)
                viewType = airkit.LOADVIEW_TYPE_NONE;
            if (priority == null)
                priority = 1;
            if (cache == null)
                cache = true;
            for (let i = 0; i < arr_res.length; i++) {
                let res = arr_res[i];
                if (!this.getRes(res.url)) {
                    urls.push(res.url);
                    resArr.push(res);
                    has_unload = true;
                }
                let resInfo = this._dicResInfo.getValue(res.url);
                if (!resInfo) {
                    resInfo = new ResInfo(res.url, res.type, res.refCount, res.pkg);
                    this._dicResInfo.set(res.url, resInfo);
                }
                else {
                    resInfo.incRef(res.refCount);
                    resInfo.updateStatus(eLoaderStatus.LOADING);
                }
            }
            //判断是否需要显示加载界面
            if (!has_unload && viewType != airkit.LOADVIEW_TYPE_NONE) {
                viewType = airkit.LOADVIEW_TYPE_NONE;
            }
            //显示加载界面
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_OPEN, viewType, urls.length, tips);
            }
            return new Promise((resolve, reject) => {
                cc.resources.load(urls, (completedCount, totalCount, item) => {
                    this.onLoadProgress(viewType, totalCount, tips, completedCount / totalCount);
                }, (error, resource) => {
                    if (error) {
                        for (let i = 0; i < urls.length; i++) {
                            let resInfo = this._dicResInfo.getValue(urls[i]);
                            if (resInfo) {
                                resInfo.decRef(arr_res[i].refCount);
                                resInfo.updateStatus(eLoaderStatus.READY);
                            }
                        }
                        reject(urls);
                        return;
                    }
                    for (let i = 0; i < urls.length; i++) {
                        let resInfo = this._dicResInfo.getValue(urls[i]);
                        if (resInfo) {
                            resInfo.updateStatus(eLoaderStatus.READY);
                        }
                    }
                    if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                        airkit.TimerManager.Instance.addOnce(this._minLoaderTime, null, (v) => {
                            this.onLoadComplete(viewType, urls, resArr, tips);
                            resolve(urls);
                        });
                    }
                    else {
                        this.onLoadComplete(viewType, urls, resArr, tips);
                        resolve(urls);
                    }
                });
            });
        }
        /**
         * 加载完成
         * @param	viewType	显示的加载界面类型
         * @param 	handle 		加载时，传入的回调函数
         * @param 	args		第一个参数为加载的资源url列表；第二个参数为是否加载成功
         */
        onLoadComplete(viewType, urls, arr_res, tips) {
            //显示加载日志
            if (urls) {
                let arr = urls;
                for (let i = 0; i < urls.length; i++) {
                    if (arr_res[i].type == airkit.FguiAsset) {
                        fgui.UIPackage.addPackage(urls[i]);
                        // }else if(arr_res[i].type == airkit.FguiAtlas){
                        //     console.log(arr_res[i].url);
                        //     let arr = arr_res[i].url.split("_");
                        //     if( Array.isArray(arr) && arr.length > 0){
                        //         let pkg = fgui.UIPackage.getByName(arr_res[i].pkg);
                        //         for (var j = 0; j < pkg["_items"].length; j++) {
                        //             var pi = pkg["_items"][j];
                        //             if(pi.file == arr_res[i].url){
                        //                 if(pi["asset"] &&  pi["asset"]["nativeUrl"] == ""){
                        //                     pi.decoded = false;
                        //                     pkg.getItemAsset(pi);
                        //                 }
                        //             }
                        //         }
                        //     }
                    }
                }
            }
            //关闭加载界面
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_COMPLATE, viewType);
            }
        }
        /**
         * 加载进度
         * @param	viewType	显示的加载界面类型
         * @param	total		总共需要加载的资源数量
         * @param	progress	已经加载的数量，百分比；注意，有可能相同进度会下发多次
         */
        onLoadProgress(viewType, total, tips, progress) {
            let cur = airkit.NumberUtils.toInt(Math.floor(progress * total));
            airkit.Log.debug("[load]进度: current={0} total={1} precent = {2}", cur, total, progress);
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_PROGRESS, viewType, cur, total, tips);
            }
        }
        /**
         * 释放指定资源
         * @param	url	资源路径
         */
        clearRes(url, refCount) {
            let res = this._dicResInfo.getValue(url);
            if (res) {
                res.decRef(refCount);
            }
        }
        releaseRes(url) {
            this._dicResInfo.remove(url);
            cc.resources.release(url);
            airkit.Log.info("[res]释放资源:" + url);
        }
        /**
         * 图片代理，可以远程加载图片显示
         * @param image
         * @param skin
         * @param proxy
         * @param atlas
         */
        static imageProxy(image, skin, proxy, atlas) {
            return new Promise((resolve, reject) => {
                let texture = ResourceManager.Instance.getRes(skin);
                if (texture != null) {
                    image.url = skin;
                }
                else {
                    let res = skin;
                    if (atlas != null) {
                        res = atlas;
                    }
                    if (proxy) {
                        image.url = proxy;
                    }
                    airkit.Log.info("imageProxy start load {0} ", res);
                    ResourceManager.Instance.loadRes(res)
                        .then((v) => {
                        image.url = skin;
                        image.alpha = 0.1;
                        airkit.TweenUtils.get(image).to({ alpha: 1.0 }, 0.3);
                        airkit.Log.info("imageProxy start load done {0} ", res);
                    })
                        .catch((e) => airkit.Log.error(e));
                }
            });
        }
    }
    ResourceManager.FONT_Yuanti = "Yuanti SC Regular";
    ResourceManager.Font_Helvetica = "Helvetica";
    ResourceManager.FONT_DEFAULT = "";
    ResourceManager.FONT_DEFAULT_SIZE = airkit.FONT_SIZE_5;
    ResourceManager.instance = null;
    airkit.ResourceManager = ResourceManager;
    let eLoaderStatus;
    (function (eLoaderStatus) {
        eLoaderStatus[eLoaderStatus["READY"] = 0] = "READY";
        eLoaderStatus[eLoaderStatus["LOADING"] = 1] = "LOADING";
        eLoaderStatus[eLoaderStatus["LOADED"] = 2] = "LOADED";
    })(eLoaderStatus || (eLoaderStatus = {}));
    /**
     * 保存加载过的url
     */
    class ResInfo extends airkit.EventDispatcher {
        constructor(url, type, refCount, pkg) {
            super();
            this.url = url;
            this.ref = refCount;
            this.type = type;
            this.pkg = pkg;
            this.status = eLoaderStatus.READY;
        }
        updateStatus(status) {
            this.status = status;
        }
        incRef(v = 1) {
            this.ref += v;
        }
        decRef(v = 1) {
            this.ref -= v;
            if (this.ref <= 0) {
                if (this.type == FguiAsset) {
                    fgui.UIPackage.removePackage(this.url);
                    console.log("remove package" + this.url);
                    ResourceManager.Instance.releaseRes(this.url);
                }
                else if (this.type == FguiAtlas) {
                    //do nothing
                }
                else {
                    ResourceManager.Instance.releaseRes(this.url);
                }
            }
        }
    }
})(airkit || (airkit = {}));
// import { StringUtils } from "../utils/StringUtils";
// import { DateUtils } from "../utils/DateUtils";
// import { LogLevel } from "../common/Constant";

(function (airkit) {
    /**
     * 日志类处理
     * @author ankye
     * @time 2018-7-8
     */
    class Log {
        static format(format, ...args) {
            if (format == null)
                return "null";
            if (airkit.StringUtils.isString(format)) {
                let arr = [];
                for (let i = 0; i < args.length; i++) {
                    let arg = args[i];
                    if (airkit.StringUtils.isString(arg)) {
                        arr.push(arg);
                    }
                    else {
                        arr.push(JSON.stringify(arg, null, 4));
                    }
                }
                let content = airkit.StringUtils.format(format, ...arr);
                return content;
            }
            else {
                if (typeof format == "object" && format.message) {
                    return format.message;
                }
                else {
                    return JSON.stringify(format, null, 4);
                }
            }
        }
        static debug(format, ...args) {
            if (this.LEVEL < airkit.LogLevel.DEBUG)
                return;
            let content = this.format(format, ...args);
            console.log(airkit.DateUtils.currentYMDHMS(), "[debug]", content);
            return content;
        }
        static info(format, ...args) {
            if (this.LEVEL < airkit.LogLevel.INFO)
                return;
            let content = this.format(format, ...args);
            console.log(airkit.DateUtils.currentYMDHMS(), "[info]", content);
            return content;
        }
        static warning(format, ...args) {
            if (this.LEVEL < airkit.LogLevel.WARNING)
                return;
            let content = this.format(format, ...args);
            console.warn(airkit.DateUtils.currentYMDHMS(), "[warn]", content);
            return content;
        }
        static error(format, ...args) {
            if (this.LEVEL < airkit.LogLevel.ERROR)
                return;
            let content = this.format(format, ...args);
            console.error(airkit.DateUtils.currentYMDHMS(), "[error]", content);
            return content;
        }
        static exception(format, ...args) {
            if (this.LEVEL < airkit.LogLevel.EXCEPTION)
                return;
            let content = this.format(format, ...args);
            console.exception(airkit.DateUtils.currentYMDHMS(), "[exce]", content);
            return content;
        }
        static dump(value) {
            if (this.LEVEL < airkit.LogLevel.INFO)
                return;
            if (value instanceof Object) {
                try {
                    value = JSON.stringify(value, null, 4);
                }
                catch (error) {
                    console.error(error);
                }
            }
            console.log(airkit.DateUtils.currentYMDHMS(), "[Dump]", value);
        }
    }
    Log.LEVEL = airkit.LogLevel.INFO;
    airkit.Log = Log;
})(airkit || (airkit = {}));
// import { ISignal } from "../event/ISignal";
// import { EventID } from "../event/EventID";
// import { LOADVIEW_TYPE_NONE } from "../common/Constant";

(function (airkit) {
    class BaseModule extends cc.Node {
        constructor() {
            super();
        }
        setup(args) {
            this.emit(airkit.EventID.BEGIN_MODULE, this.name);
            this.registerEvent();
        }
        enter() {
            this.emit(airkit.EventID.ENTER_MODULE, this.name);
        }
        exit() {
            this.emit(airkit.EventID.EXIT_MODULE, this.name);
        }
        update(dt) { }
        registerEvent() {
            this.registerSignalEvent();
        }
        unRegisterEvent() {
            this.unregisterSignalEvent();
        }
        //需要提前加载的资源
        static res() {
            return null;
        }
        static loaderTips() {
            return "资源加载中";
        }
        /**是否显示加载界面*/
        static loaderType() {
            return airkit.LOADVIEW_TYPE_NONE;
        }
        registerSignalEvent() {
            let event_list = this.signalMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let signal = item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        }
        unregisterSignalEvent() {
            let event_list = this.signalMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let signal = item[0];
                signal.off(item[1], item[2]);
            }
        }
        signalMap() {
            return null;
        }
        dispose() {
            this.emit(airkit.EventID.END_MODULE, this.name);
            this.unRegisterEvent();
        }
    }
    airkit.BaseModule = BaseModule;
})(airkit || (airkit = {}));
// import { ResourceManager } from "../loader/ResourceManager";
// import { SDictionary } from "../collection/Dictionary";
// import { BaseModule } from "./BaseModule";
// import { Log } from "../log/Log";
// import { EventID } from "../event/EventID";

(function (airkit) {
    class Mediator {
        static get Instance() {
            if (!this.instance)
                this.instance = new Mediator();
            return this.instance;
        }
        setup() {
            this.registerEvent();
        }
        /**
         * 注册模块
         * @param name
         * @param cls
         */
        static register(name, cls) {
            airkit.ClassUtils.regClass(name, cls);
        }
        //远程调用
        static call(name, funcName, ...args) {
            return new Promise((resolve, reject) => {
                let m = this.modules.getValue(name);
                if (m == null) {
                    m = airkit.ClassUtils.getInstance(name);
                    let clas = airkit.ClassUtils.getClass(name);
                    if (m == null) {
                        airkit.Log.warning("Cant find module {0}", name);
                        reject("Cant find module" + name);
                    }
                    this.modules.add(name, m);
                    m.name = name;
                    var onInitModuleOver = () => {
                        m.enter();
                        if (funcName == null) {
                            resolve(m);
                        }
                        else {
                            let result = this.callFunc(m, funcName, args);
                            resolve(result);
                        }
                    };
                    m.once(airkit.EventID.BEGIN_MODULE, onInitModuleOver, null);
                    if (clas.res() && clas.res().length > 0) {
                        this.loadResource(m, clas).then(v => {
                            m.setup(null);
                        }).catch(e => {
                            airkit.Log.warning("Load module Resource Failed {0}", name);
                            reject("Load module Resource Failed " + name);
                        });
                    }
                    else {
                        m.setup(null);
                    }
                }
                else {
                    if (funcName == null) {
                        resolve(m);
                    }
                    else {
                        let result = this.callFunc(m, funcName, args);
                        resolve(result);
                    }
                }
            });
        }
        static callFunc(m, funcName, args) {
            if (funcName == null) {
                return;
            }
            var func = m[funcName];
            let result = null;
            if (func) {
                if (args) {
                    result = func.apply(m, args);
                }
                else {
                    result = func.apply(m);
                }
            }
            else {
                airkit.Log.error("cant find funcName {0} from Module:{1}", funcName, m.name);
            }
            return result;
        }
        /**处理需要提前加载的资源*/
        static loadResource(m, clas) {
            let res_map = clas.res();
            let load_view = clas.loaderType();
            let tips = clas.loaderTips();
            return airkit.ResourceManager.Instance.loadArrayRes(res_map, load_view, tips, 1, true);
        }
        destroy() {
            this.unRegisterEvent();
            this.clear();
        }
        clear() {
            if (Mediator.modules) {
                Mediator.modules.foreach((k, v) => {
                    v.exit();
                    v.dispose();
                    return true;
                });
                Mediator.modules.clear();
            }
        }
        update(dt) {
            Mediator.modules.foreach((k, v) => {
                v.update(dt);
                return true;
            });
        }
        registerEvent() { }
        unRegisterEvent() { }
    }
    Mediator.modules = new airkit.SDictionary();
    Mediator.instance = null;
    airkit.Mediator = Mediator;
})(airkit || (airkit = {}));
// import { Log } from "../../log/Log";
// import { Utils } from "../../utils/Utils";

(function (airkit) {
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
    let eHttpRequestType;
    (function (eHttpRequestType) {
        eHttpRequestType[eHttpRequestType["TypeText"] = 0] = "TypeText";
        eHttpRequestType[eHttpRequestType["TypeJson"] = 1] = "TypeJson";
        eHttpRequestType[eHttpRequestType["TypePB"] = 2] = "TypePB";
    })(eHttpRequestType = airkit.eHttpRequestType || (airkit.eHttpRequestType = {}));
    airkit.POST = "POST";
    airkit.GET = "GET";
    airkit.CONTENT_TYPE_TEXT = "application/x-www-form-urlencoded";
    airkit.CONTENT_TYPE_JSON = "application/json";
    airkit.CONTENT_TYPE_PB = "application/octet-stream"; // "application/x-protobuf"  //
    //responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
    airkit.RESPONSE_TYPE_TEXT = "text";
    airkit.RESPONSE_TYPE_JSON = "json";
    airkit.RESPONSE_TYPE_XML = "xml";
    airkit.RESPONSE_TYPE_BYTE = "arraybuffer";
    airkit.HTTP_REQUEST_TIMEOUT = 10000; //设置超时时间
    class Http {
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
        static request(url, method, reqType, header, data, responseType) {
            return new Promise((resolve, reject) => {
                if (Http.currentRequsts > Http.maxRequest) {
                    airkit.Log.error("reached max request {0}", Http.currentRequsts);
                }
                if (Http.currentRequsts < 0)
                    Http.currentRequsts = 0;
                Http.currentRequsts++;
                if (responseType == undefined) {
                    responseType = "text";
                }
                if (method != airkit.POST && method != airkit.GET) {
                    Http.currentRequsts--;
                    reject("method error");
                }
                if (!header)
                    header = [];
                let key = "Content-Type";
                switch (reqType) {
                    case eHttpRequestType.TypeText:
                        header.push(key, airkit.CONTENT_TYPE_TEXT);
                        break;
                    case eHttpRequestType.TypeJson:
                        header.push(key, airkit.CONTENT_TYPE_JSON);
                        break;
                    case eHttpRequestType.TypePB:
                        header.push(key, airkit.CONTENT_TYPE_PB);
                        break;
                    default:
                        header.push(key, airkit.CONTENT_TYPE_TEXT);
                }
                // header.push("Accept-Encoding","gzip, deflate, br")
                var request = new airkit.HttpRequest();
                request.http.timeout = airkit.HTTP_REQUEST_TIMEOUT;
                request.http.ontimeout = function () {
                    airkit.Log.error("request timeout {0}", url);
                    request.targetOff(request);
                    Http.currentRequsts--;
                    reject("timeout");
                };
                request.once(airkit.Event.COMPLETE, this, function (event) {
                    let data;
                    switch (responseType) {
                        case airkit.RESPONSE_TYPE_TEXT:
                            data = request.data;
                            break;
                        case airkit.RESPONSE_TYPE_JSON:
                            //  data = JSON.parse(request.data)
                            data = request.data;
                            break;
                        case airkit.RESPONSE_TYPE_BYTE:
                            var bytes = new airkit.Byte(request.data);
                            bytes.endian = airkit.Byte.BIG_ENDIAN;
                            var body = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos);
                            data = body;
                            break;
                        default:
                            data = request.data;
                    }
                    request.targetOff(request);
                    Http.currentRequsts--;
                    resolve(data);
                });
                request.once(airkit.Event.ERROR, this, function (event) {
                    airkit.Log.error("req:{0} error:{1}", url, event);
                    request.targetOff(request);
                    Http.currentRequsts--;
                    reject(event);
                });
                request.on(airkit.Event.PROGRESS, this, function (event) { });
                if (method == airkit.GET) {
                    request.send(url, null, method, responseType, header);
                }
                else {
                    request.send(url, data, method, responseType, header);
                }
            });
        }
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
        static get(url, reqType, header, responseType) {
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            if (responseType == undefined) {
                responseType = airkit.RESPONSE_TYPE_TEXT;
            }
            return this.request(url, airkit.GET, reqType, header, null, responseType);
        }
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
        static post(url, params, reqType, header, responseType) {
            var data = null;
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            switch (reqType) {
                case eHttpRequestType.TypeText:
                    if (params)
                        data = airkit.Utils.obj2query(params);
                    break;
                case eHttpRequestType.TypeJson:
                    if (params)
                        data = JSON.stringify(params);
                    break;
                case eHttpRequestType.TypePB:
                    if (params)
                        data = params;
            }
            if (responseType == undefined) {
                responseType = airkit.RESPONSE_TYPE_TEXT;
            }
            return this.request(url, airkit.POST, reqType, header, data, responseType);
        }
    }
    Http.currentRequsts = 0;
    Http.maxRequest = 6;
    airkit.Http = Http;
})(airkit || (airkit = {}));

(function (airkit) {
    class HttpRequest extends cc.Node {
        constructor() {
            super(...arguments);
            /**@private */
            this._http = new XMLHttpRequest();
        }
        /**
         * 发送 HTTP 请求。
         * @param	url				请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
         * @param	data			(default = null)发送的数据。
         * @param	method			(default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
         * @param	responseType	(default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @param	headers			(default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         */
        send(url, data = null, method = "get", responseType = "text", headers = null) {
            this._responseType = responseType;
            this._data = null;
            this._url = url;
            var _this = this;
            var http = this._http;
            http.open(method, url, true);
            let isJson = false;
            if (headers) {
                for (var i = 0; i < headers.length; i++) {
                    http.setRequestHeader(headers[i++], headers[i]);
                }
            }
            else if (!window.conch) {
                if (!data || typeof data == "string")
                    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                else {
                    http.setRequestHeader("Content-Type", "application/json");
                    isJson = true;
                }
            }
            let restype = responseType !== "arraybuffer" ? "text" : "arraybuffer";
            http.responseType = restype;
            if (http.dataType) {
                //for Ali
                http.dataType = restype;
            }
            http.onerror = function (e) {
                _this._onError(e);
            };
            http.onabort = function (e) {
                _this._onAbort(e);
            };
            http.onprogress = function (e) {
                _this._onProgress(e);
            };
            http.onload = function (e) {
                _this._onLoad(e);
            };
            http.send(isJson ? JSON.stringify(data) : data);
        }
        /**
         * @private
         * 请求进度的侦听处理函数。
         * @param	e 事件对象。
         */
        _onProgress(e) {
            if (e && e.lengthComputable)
                this.emit(airkit.Event.PROGRESS, e.loaded / e.total);
        }
        /**
         * @private
         * 请求中断的侦听处理函数。
         * @param	e 事件对象。
         */
        _onAbort(e) {
            this.error("Request was aborted by user");
        }
        /**
         * @private
         * 请求出错侦的听处理函数。
         * @param	e 事件对象。
         */
        _onError(e) {
            this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText);
        }
        /**
         * @private
         * 请求消息返回的侦听处理函数。
         * @param	e 事件对象。
         */
        _onLoad(e) {
            var http = this._http;
            var status = http.status !== undefined ? http.status : 200;
            if (status === 200 || status === 204 || status === 0) {
                this.complete();
            }
            else {
                this.error("[" + http.status + "]" + http.statusText + ":" + http.responseURL);
            }
        }
        /**
         * @private
         * 请求错误的处理函数。
         * @param	message 错误信息。
         */
        error(message) {
            this.clear();
            console.warn(this.url, message);
            this.emit(airkit.Event.ERROR, message);
        }
        /**
         * @private
         * 请求成功完成的处理函数。
         */
        complete() {
            this.clear();
            var flag = true;
            try {
                if (this._responseType === "json") {
                    this._data = JSON.parse(this._http.responseText);
                }
                else if (this._responseType === "xml") {
                    this._data = airkit.Utils.parseXMLFromString(this._http.responseText);
                }
                else {
                    this._data = this._http.response || this._http.responseText;
                }
            }
            catch (e) {
                flag = false;
                this.error(e.message);
            }
            flag && this.emit(airkit.Event.COMPLETE, this._data instanceof Array ? [this._data] : this._data);
        }
        /**
         * @private
         * 清除当前请求。
         */
        clear() {
            var http = this._http;
            http.onerror = http.onabort = http.onprogress = http.onload = null;
        }
        /** 请求的地址。*/
        get url() {
            return this._url;
        }
        /** 返回的数据。*/
        get data() {
            return this._data;
        }
        /**
         * 本对象所封装的原生 XMLHttpRequest 引用。
         */
        get http() {
            return this._http;
        }
    }
    /**@private */
    HttpRequest._urlEncode = encodeURI;
    airkit.HttpRequest = HttpRequest;
})(airkit || (airkit = {}));
// import { StateMachine } from "./StateMachine";
// import { Log } from "../../log/Log";

(function (airkit) {
    class State {
        constructor(entity, status) {
            this._owner = null;
            this._status = 0;
            //帧数统计,每帧update的时候+1,每次enter和exit的时候清零,用于处理一些定时事件,比较通用
            //所以抽离到基础属性里面了，有需要的需要自己在状态里面进行加减重置等操作，基类只提供属性字段
            this._times = 0;
            this._tick = 0; //用于计数
            this._entity = entity;
            this._status = status;
        }
        enter() {
            airkit.Log.info("you must overwrite the func state.enter !");
        }
        update(dt) {
            airkit.Log.info("you must overwrite the func state.update !");
        }
        exit() {
            airkit.Log.info("you must overwrite the func state.exit !");
        }
    }
    airkit.State = State;
})(airkit || (airkit = {}));
// import { State } from "./State";

(function (airkit) {
    class StateMachine {
        constructor() {
            this._currentState = null;
            this._previousState = null;
            this._globalState = null;
        }
        update(dt) {
            if (this._globalState) {
                this._globalState.update(dt);
            }
            if (this._currentState) {
                this._currentState.update(dt);
            }
        }
        changeState(_state) {
            this._previousState = this._currentState;
            this._currentState = _state;
            this._currentState._owner = this;
            if (this._previousState)
                this._previousState.exit();
            this._currentState.enter();
        }
        setCurrentState(_state) {
            if (this._currentState) {
                this._currentState.exit();
            }
            this._currentState = _state;
            this._currentState._owner = this;
            this._currentState.enter();
        }
        setGlobalState(_state) {
            if (this._globalState) {
                this._globalState.exit();
            }
            this._globalState = _state;
            this._globalState._owner = this;
            this._globalState.enter();
        }
        clearAllState() {
            if (this._globalState) {
                this._globalState.exit();
                this._globalState = null;
            }
            if (this._currentState) {
                this._currentState.exit();
                this._currentState = null;
            }
            this._previousState = null;
        }
        get currentState() {
            return this._currentState;
        }
        get previousState() {
            return this._previousState;
        }
        get globalState() {
            return this._globalState;
        }
    }
    airkit.StateMachine = StateMachine;
})(airkit || (airkit = {}));

(function (airkit) {
    //header
    // uid string
    // cmd string
    // seq int
    // msgType int
    // userdata int
    // payload string
    class JSONMsg {
        static getSeq() {
            return JSONMsg.REQ_ID++;
        }
        decode(msg, endian) {
            let str = airkit.bytes2String(msg, endian);
            let m = JSON.parse(str);
            if (m && m.payload) {
                this.uid = m.uid;
                this.cmd = m.cmd;
                this.msgType = m.msgType;
                this.ID = m.userdata;
                this.data = JSON.parse(m.payload);
                return true;
            }
            str = null;
            return false;
        }
        encode(endian) {
            this.ID = JSONMsg.getSeq();
            let msg = {
                uid: this.uid,
                cmd: this.cmd,
                msgType: this.msgType,
                seq: this.ID,
                userdata: this.ID,
                payload: JSON.stringify(this.data),
            };
            return JSON.stringify(msg);
        }
        getID() {
            return this.ID;
        }
    }
    JSONMsg.REQ_ID = 1;
    airkit.JSONMsg = JSONMsg;
    class PBMsg {
        constructor() {
            this.receiveByte = new airkit.Byte();
            this.receiveByte.endian = airkit.Byte.LITTLE_ENDIAN;
        }
        getID() {
            return this.ID;
        }
        decode(msg, endian) {
            this.receiveByte.clear();
            this.receiveByte.writeArrayBuffer(msg);
            this.receiveByte.pos = 0;
            var len = this.receiveByte.getInt16();
            var id = this.receiveByte.getInt16();
            if (this.receiveByte.bytesAvailable >= len) {
                let data = new airkit.Byte();
                data.writeArrayBuffer(this.receiveByte, 4, len);
                return true;
            }
            return false;
        }
        encode(endian) {
            let msg = new airkit.Byte();
            msg.endian = airkit.Byte.LITTLE_ENDIAN;
            // msg.writeUint16(data.length + 4)
            // msg.writeUint16(id)
            // msg.writeArrayBuffer(data)
            msg.pos = 0;
            return msg;
        }
    }
    airkit.PBMsg = PBMsg;
})(airkit || (airkit = {}));
// namespace airkit {
//     export class SocketStatus {
//         static SOCKET_CONNECT: string = "1";
//         static SOCKET_RECONNECT: string = "2";
//         static SOCKET_START_RECONNECT: string = "3";
//         static SOCKET_CLOSE: string = "4";
//         static SOCKET_NOCONNECT: string = "5";
//         static SOCKET_DATA: string = "6";
//     }
//     export enum eSocketMsgType {
//         // MTRequest request =1
//         MTRequest = 1,
//         // MTResponse response = 2
//         MTResponse = 2,
//         // MTNotify notify = 3
//         MTNotify = 3,
//         // MTBroadcast broadcast = 4
//         MTBroadcast = 4,
//     }
//     export class WebSocketEx extends cc.Node {
//         private mSocket: WebSocket = null;
//         private mHost: string;
//         private mPort: any;
//         private mEndian: string;
//         private _needReconnect: boolean = false;
//         private _maxReconnectCount = 10;
//         private _reconnectCount: number = 0;
//         private _connectFlag: boolean;
//         private _isConnecting: boolean;
//         private _handers: NDictionary<any>;
//         private _requestTimeout: number = 10 * 1000; //10s
//         private _clsName: string;
//         private _remoteAddress: string;
//         constructor() {
//             super();
//         }
//         public initServer(host: string, port: any, msgCls: any, endian: string = Byte.BIG_ENDIAN): void {
//             this.mHost = host;
//             this.mPort = port;
//             //ws://192.168.0.127:8080
//             this._remoteAddress = `ws://${host}:${port}`;
//             this.mEndian = endian;
//             this._handers = new NDictionary<any>();
//             this._clsName = "message";
//             ClassUtils.regClass(this._clsName, msgCls);
//             this.connect();
//         }
//         public connect(): void {
//             this.mSocket = new WebSocket(this._remoteAddress);
//             // this.mSocket.binaryType = this.mEndian;
//             this.addEvents();
//             this.mSocket.connect(this._remoteAddress);
//         }
//         private addEvents() {
//             this.mSocket.onSocketOpen = this.onSocketOpen.bind(this);
//             this.mSocket.onSocketClose = this.onSocketClose.bind(this);
//             this.mSocket.onSocketError = this.onSocketError.bind(this);
//             this.mSocket.onReceiveMessage = this.onReceiveMessage.bind(this);
//         }
//         private removeEvents(): void {}
//         private onSocketOpen(event: any = null): void {
//             this._reconnectCount = 0;
//             this._isConnecting = true;
//             if (this._connectFlag && this._needReconnect) {
//                 this.emit(SocketStatus.SOCKET_RECONNECT);
//             } else {
//                 this.emit(SocketStatus.SOCKET_CONNECT);
//             }
//             this._connectFlag = true;
//         }
//         private onSocketClose(e: any = null): void {
//             this._isConnecting = false;
//             if (this._needReconnect) {
//                 this.emit(SocketStatus.SOCKET_START_RECONNECT);
//                 this.reconnect();
//             } else {
//                 this.emit(SocketStatus.SOCKET_CLOSE);
//             }
//         }
//         private onSocketError(e: any = null): void {
//             if (this._needReconnect) {
//                 this.reconnect();
//             } else {
//                 this.emit(SocketStatus.SOCKET_NOCONNECT);
//             }
//             this._isConnecting = false;
//         }
//         private reconnect(): void {
//             this.closeCurrentSocket();
//             this._reconnectCount++;
//             if (this._reconnectCount < this._maxReconnectCount) {
//                 this.connect();
//             } else {
//                 this._reconnectCount = 0;
//             }
//         }
//         private onReceiveMessage(msg: any = null): void {
//             let clas = ClassUtils.getClass(this._clsName);
//             let obj = new clas() as WSMessage;
//             if (!obj.decode(msg, this.mEndian)) {
//                 Log.error("decode msg faild {0}", msg);
//                 return;
//             }
//             let hander = this._handers.getValue(obj.getID());
//             if (hander) {
//                 hander(obj);
//             } else {
//                 this.emit(SocketStatus.SOCKET_DATA, obj);
//             }
//         }
//         public request(req: WSMessage): Promise<any> {
//             return new Promise((resolve, reject) => {
//                 var buf: any = req.encode(this.mEndian);
//                 let handerID = req.getID();
//                 if (buf) {
//                     let id = TimerManager.Instance.addOnce(this._requestTimeout, null, () => {
//                         this._handers.remove(handerID);
//                         reject("timeout");
//                     });
//                     this._handers.add(handerID, (resp: WSMessage) => {
//                         TimerManager.Instance.removeTimer(id);
//                         resolve(resp);
//                     });
//                     Log.info("start request ws {0}", buf);
//                     this.mSocket.send(buf);
//                 }
//             });
//         }
//         public close(): void {
//             this._connectFlag = false;
//             this._handers.clear();
//             this.closeCurrentSocket();
//         }
//         private closeCurrentSocket() {
//             this.removeEvents();
//             this.mSocket.close();
//             this.mSocket = null;
//             this._isConnecting = false;
//         }
//         public isConnecting(): boolean {
//             return this._isConnecting;
//         }
//     }
// }
// import { IUIPanel } from "./IUIPanel";
// import { EventCenter } from "../event/EventCenter";
// import { EventID, LoaderEventID } from "../event/EventID";
// import { ResourceManager } from "../loader/ResourceManager";
// import { Log } from "../log/Log";
// import { ISignal } from "../event/ISignal";
// import { TimerManager } from "../timer/TimerManager";
// import { LOADVIEW_TYPE_NONE, eCloseAnim } from "../common/Constant";
// import { UIManager } from "./UIManager";

(function (airkit) {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */
    airkit.ViewIDSeq = 0;
    function genViewIDSeq() {
        return airkit.ViewIDSeq++;
    }
    airkit.genViewIDSeq = genViewIDSeq;
    class BaseView extends fgui.GComponent {
        constructor() {
            super();
            this._isOpen = false;
            this._UIID = null;
            this.objectData = null;
            this._destory = false;
            this._viewID = genViewIDSeq();
        }
        setName(name) {
            this.name = name;
        }
        getName() {
            return this.name;
        }
        debug() {
            let bgColor = "#4aa7a688";
            // this.graphics.clear()
            // this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        setup(args) {
            this._isOpen = true;
            this.onLangChange();
            this.onCreate(args);
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_OPEN, this._UIID);
            airkit.EventCenter.on(airkit.EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
        }
        /**关闭*/
        dispose() {
            if (this._destory)
                return;
            this._destory = true;
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_CLOSE, this._UIID);
            airkit.EventCenter.off(airkit.EventID.UI_LANG, this, this.onLangChange);
            super.dispose();
            console.log(this.name + " dispose");
        }
        isDestory() {
            return this._destory;
        }
        /**是否可见*/
        setVisible(bVisible) {
            let old = this.visible;
            this.visible = bVisible;
        }
        /**设置界面唯一id，只在UIManager设置，其他地方不要再次设置*/
        setUIID(id) {
            this._UIID = id;
        }
        get UIID() {
            return this._UIID;
        }
        get viewID() {
            return this._viewID;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        onCreate(args) {
        }
        /**销毁*/
        onDestroy() {
            super.onDestroy();
        }
        /**每帧循环：如果覆盖，必须调用super.update()*/
        update(dt) {
            return true;
        }
        /**资源加载结束*/
        onEnable() {
            super.onEnable();
        }
        //资源卸载前
        onDisable() {
            super.onDisable();
        }
        /**多语言初始化，或语音设定改变时触发*/
        onLangChange() { }
        //framework需要提前加载的资源
        static res() {
            return null;
        }
        static unres() {
            let arr = this.res();
            if (arr && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    airkit.ResourceManager.Instance.clearRes(arr[i].url, arr[i].refCount);
                }
            }
        }
        static loaderTips() {
            return "资源加载中";
        }
        //显示加载界面 默认不显示
        static loaderType() {
            return airkit.LOADVIEW_TYPE_NONE;
        }
        //信号事件注册，适合单体物件事件传递
        // return [
        //     [me.updateSignal, this, this.refreshUser],
        // ]
        //   public refreshUser(val: any, result: [model.eUserAttr, number]): void
        signalMap() {
            return null;
        }
        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        eventMap() {
            return null;
        }
        /**自定义事件注册，用于EventCenter派发的事件*/
        registerEvent() { }
        unRegisterEvent() { }
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        staticCacheUI() {
            return null;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        static loadResource(onAssetLoaded) {
            let tips = this.loaderTips();
            let loaderType = this.loaderType();
            airkit.ResourceManager.Instance.loadArrayRes(this.res(), loaderType, tips, 1, true)
                .then((v) => {
                onAssetLoaded(true);
            })
                .catch((e) => {
                airkit.Log.error(e);
                onAssetLoaded(false);
            });
        }
        registerSignalEvent() {
            let event_list = this.signalMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let signal = item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        }
        unregisterSignalEvent() {
            let event_list = this.signalMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let signal = item[0];
                signal.off(item[1], item[2]);
            }
        }
        /**注册界面事件*/
        registeGUIEvent() {
            let event_list = this.eventMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let gui_control = item[0];
                gui_control.on(item[1], item[2], this);
            }
        }
        unregisteGUIEvent() {
            let event_list = this.eventMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let gui_control = item[0];
                gui_control.off(item[1], item[2], this);
            }
        }
        static buildRes(resMap) {
            let res = [];
            for (let k in resMap) {
                res.push({ url: "ui/" + k, type: airkit.FguiAsset, refCount: 1, pkg: k });
                for (let k2 in resMap[k]) {
                    res.push({ url: "ui/" + k2, type: airkit.FguiAtlas, refCount: resMap[k][k2], pkg: k });
                }
            }
            return res;
        }
        doClose() {
            if (this._isOpen === false) {
                airkit.Log.error("连续点击");
                return false; //避免连续点击关闭
            }
            this._isOpen = false;
            airkit.UIManager.Instance.close(this.UIID, airkit.eCloseAnim.CLOSE_CENTER);
            return true;
        }
    }
    airkit.BaseView = BaseView;
})(airkit || (airkit = {}));
/// <reference path="./BaseView.ts" />

(function (airkit) {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */
    class Dialog extends fgui.Window {
        constructor() {
            super();
            this._isOpen = false;
            this._UIID = null;
            this.objectData = null;
            this._destory = false;
            this._viewID = airkit.genViewIDSeq();
        }
        setName(name) {
            this.name = name;
        }
        getName() {
            return this.name;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        setup(args) {
            this._isOpen = true;
            this.onLangChange();
            this.onCreate(args);
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_OPEN, this._UIID);
            airkit.EventCenter.on(airkit.EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
        }
        /**关闭*/
        dispose() {
            if (this._destory)
                return;
            this._destory = true;
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_CLOSE, this._UIID);
            airkit.EventCenter.off(airkit.EventID.UI_LANG, this, this.onLangChange);
            super.dispose();
            console.log(this.name + " dispose");
        }
        isDestory() {
            return this._destory;
        }
        /**是否可见*/
        setVisible(bVisible) {
            let old = this.visible;
            this.visible = bVisible;
        }
        /**设置界面唯一id，只在UIManager设置，其他地方不要再次设置*/
        setUIID(id) {
            this._UIID = id;
        }
        get UIID() {
            return this._UIID;
        }
        get viewID() {
            return this._viewID;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        onCreate(args) {
        }
        /**销毁*/
        onDestroy() {
            super.onDestroy();
        }
        /**每帧循环：如果覆盖，必须调用super.update()*/
        update(dt) {
            return true;
        }
        /**资源加载结束*/
        onEnable() {
            super.onEnable();
        }
        //资源卸载前
        onDisable() {
            super.onDisable();
        }
        /**多语言初始化，或语音设定改变时触发*/
        onLangChange() { }
        //framework需要提前加载的资源
        static res() {
            return null;
        }
        static unres() {
            let arr = this.res();
            if (arr && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    airkit.ResourceManager.Instance.clearRes(arr[i].url, arr[i].refCount);
                }
            }
        }
        static loaderTips() {
            return "资源加载中";
        }
        //显示加载界面 默认不显示
        static loaderType() {
            return airkit.LOADVIEW_TYPE_NONE;
        }
        //信号事件注册，适合单体物件事件传递
        // return [
        //     [me.updateSignal, this, this.refreshUser],
        // ]
        //   public refreshUser(val: any, result: [model.eUserAttr, number]): void
        signalMap() {
            return null;
        }
        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        eventMap() {
            return null;
        }
        /**自定义事件注册，用于EventCenter派发的事件*/
        registerEvent() { }
        unRegisterEvent() { }
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        staticCacheUI() {
            return null;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        static loadResource(onAssetLoaded) {
            let tips = this.loaderTips();
            let loaderType = this.loaderType();
            airkit.ResourceManager.Instance.loadArrayRes(this.res(), loaderType, tips, 1, true)
                .then((v) => {
                onAssetLoaded(true);
            })
                .catch((e) => {
                airkit.Log.error(e);
                onAssetLoaded(false);
            });
        }
        registerSignalEvent() {
            let event_list = this.signalMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let signal = item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        }
        unregisterSignalEvent() {
            let event_list = this.signalMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let signal = item[0];
                signal.off(item[1], item[2]);
            }
        }
        /**注册界面事件*/
        registeGUIEvent() {
            let event_list = this.eventMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let gui_control = item[0];
                gui_control.on(item[1], item[2], this);
            }
        }
        unregisteGUIEvent() {
            let event_list = this.eventMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let gui_control = item[0];
                gui_control.off(item[1], item[2], this);
            }
        }
        static buildRes(resMap) {
            let res = [];
            for (let k in resMap) {
                res.push({ url: "ui/" + k, type: airkit.FguiAsset, refCount: 1, pkg: k });
                for (let k2 in resMap[k]) {
                    res.push({ url: "ui/" + k2, type: airkit.FguiAtlas, refCount: resMap[k][k2], pkg: k });
                }
            }
            return res;
        }
        doClose() {
            if (this._isOpen === false) {
                airkit.Log.error("连续点击");
                return false; //避免连续点击关闭
            }
            this._isOpen = false;
            airkit.UIManager.Instance.close(this.UIID, airkit.eCloseAnim.CLOSE_CENTER);
            return true;
        }
    }
    airkit.Dialog = Dialog;
})(airkit || (airkit = {}));
// import { Singleton } from "../collection/Singleton";
// import { DisplayUtils, displayWidth } from '../utils/DisplayUtils';
// import { Log } from "../log/Log";
// import { eUILayer } from "../common/Constant";
/**
 * 层级管理
 */

(function (airkit) {
    /**
     * 声音事件
     */
    //调试方便，封装一次fgui.GComponent
    class Layer extends fgui.GComponent {
        constructor() {
            super();
        }
        debug() {
            let bgColor = "#f4e1e188";
            //	this.graphics.clear()
            //	this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        }
    }
    airkit.Layer = Layer;
    /**
     * 场景层级
     * @author ankye
     * @time 2017-7-13
     */
    class LayerManager extends airkit.Singleton {
        static get stage() {
            return this._root;
        }
        static getLayer(t) {
            let layer = null;
            switch (t) {
                case airkit.eUILayer.BG:
                    layer = this.bgLayer;
                    break;
                case airkit.eUILayer.MAIN:
                    layer = this.mainLayer;
                    break;
                case airkit.eUILayer.GUI:
                    layer = this.uiLayer;
                    break;
                // case eUILayer.POPUP:
                //     layer = this.popupLayer;
                //     break;
                // case eUILayer.TOOLTIP:
                //     layer = this.tooltipLayer;
                //     break;
                // case eUILayer.SYSTEM:
                //     layer = this.systemLayer;
                //     break;
                case airkit.eUILayer.LOADING:
                    layer = this.loadingLayer;
                    break;
                // case eUILayer.TOP:
                //     layer = this.topLayer;
                //     break;
            }
            if (cc.winSize.width != layer.width ||
                cc.winSize.height != layer.height) {
                layer.width = cc.winSize.width;
                layer.height = cc.winSize.height;
            }
            //layer.debug()
            return layer;
        }
        static setup(root) {
            this._root = new Layer();
            root.addChild(this._root);
            this._bgLayer = new Layer();
            this._bgLayer.node.name = "bgLayer";
            this._bgLayer.touchable = true;
            this._root.addChild(this._bgLayer);
            this._bgLayer.sortingOrder = 0;
            this._mainLayer = new Layer();
            this._mainLayer.node.name = "mainLayer";
            this._mainLayer.touchable = true;
            this._root.addChild(this._mainLayer);
            this._mainLayer.sortingOrder = 1;
            // this._tooltipLayer = new Layer();
            // this._tooltipLayer.node.name = "tooltipLayer";
            // this._tooltipLayer.touchable = false;
            // this._root.addChild(this._tooltipLayer);
            // this._tooltipLayer.sortingOrder = 3;
            this._uiLayer = new Layer();
            this._uiLayer.node.name = "uiLayer";
            this._uiLayer.touchable = true;
            this._root.addChild(this._uiLayer);
            this._uiLayer.sortingOrder = 2;
            // this._popupLayer = new Layer();
            // this._popupLayer.node.name = "popupLayer";
            // this._popupLayer.touchable = true;
            // this._root.addChild(this._popupLayer);
            // this._popupLayer.sortingOrder = 5;
            // this._systemLayer = new Layer();
            // this._systemLayer.node.name = "systemLayer";
            // this._systemLayer.touchable = true;
            // this._root.addChild(this._systemLayer);
            // this._systemLayer.sortingOrder = 6;
            this._loadingLayer = new Layer();
            this._loadingLayer.node.name = "loadingLayer";
            this._loadingLayer.touchable = true;
            this._root.addChild(this._loadingLayer);
            this._loadingLayer.sortingOrder = 1001;
            // this._topLayer = new Layer();
            // this._topLayer.node.name = "topLayer";
            // this._topLayer.touchable = true;
            // this._root.addChild(this._topLayer);
            // this._topLayer.sortingOrder = 1002;
            this.layers = [
                this._bgLayer,
                this._mainLayer,
                this._uiLayer,
                // this._popupLayer,
                // this._tooltipLayer,
                // this._systemLayer,
                this._loadingLayer,
            ];
            this.registerEvent();
            this.resize();
        }
        static registerEvent() {
            airkit.EventCenter.on(airkit.EventID.RESIZE, this, this.resize);
        }
        static unRegisterEvent() {
            airkit.EventCenter.off(airkit.EventID.RESIZE, this, this.resize);
        }
        static resize() {
            airkit.Log.info("LayerManager Receive Resize {0} {1}", cc.winSize.width, cc.winSize.height);
            var i;
            var l;
            let w = cc.winSize.width;
            let h = cc.winSize.height;
            this._root.setSize(w, h);
            for (i = 0, l = this.layers.length; i < l; i++) {
                this.layers[i].setSize(w, h);
                // this.layers[i].touchable = true
                // this.layers[i].opaque = false
            }
            if (this._bgLayer.numChildren) {
                var bg = this._bgLayer.getChildAt(0);
                let x = (w - LayerManager.BG_WIDTH) >> 1;
                let y = h - LayerManager.BG_HEIGHT;
                bg.setPosition(x, y);
            }
            // let obj = this._uiLayer
            // obj.node.graphics.clear()
            // obj.node.graphics.drawRect(0, 0, obj.width, obj.height, "#33333333")
        }
        static destroy() {
            LayerManager.removeAll();
            //   DisplayUtils.removeAllChild(this._topLayer);
            //   this._topLayer = null; //最高层
            this._loadingLayer = null; //loading层
            //    this._systemLayer = null; //system层
            //     this._tooltipLayer = null; //提示层
            //     this._popupLayer = null; //弹出层
            this._uiLayer = null; //ui层		角色信息、快捷菜单、聊天等工具视图
            this._mainLayer = null; //游戏层		游戏主内容
            this._bgLayer = null;
        }
        static removeAll() {
            airkit.DisplayUtils.removeAllChild(this._bgLayer);
            airkit.DisplayUtils.removeAllChild(this._mainLayer);
            airkit.DisplayUtils.removeAllChild(this._uiLayer);
            // DisplayUtils.removeAllChild(this._popupLayer);
            // DisplayUtils.removeAllChild(this._tooltipLayer);
            // DisplayUtils.removeAllChild(this._systemLayer);
            airkit.DisplayUtils.removeAllChild(this._loadingLayer);
        }
        static get root() {
            return this._root;
        }
        static get bgLayer() {
            return this._bgLayer;
        }
        static addBg(url) {
            var child;
            if (this.bgLayer.numChildren)
                child = this.bgLayer.getChildAt(0);
            else {
                child = new fgui.GLoader();
                child.width = LayerManager.BG_WIDTH;
                child.height = LayerManager.BG_HEIGHT;
                child.x = (cc.winSize.width - LayerManager.BG_WIDTH) >> 1;
                child.y = cc.winSize.height - LayerManager.BG_HEIGHT;
                this.bgLayer.addChild(child);
            }
            child.url = url;
            return child;
        }
        static get mainLayer() {
            return this._mainLayer;
        }
        static get uiLayer() {
            return this._uiLayer;
        }
        // public static get popupLayer(): fgui.GComponent {
        //     return this._popupLayer;
        // }
        // public static get tooltipLayer(): fgui.GComponent {
        //     return this._tooltipLayer;
        // }
        // public static get systemLayer(): fgui.GComponent {
        //     return this._systemLayer;
        // }
        static get loadingLayer() {
            return this._loadingLayer;
        }
    }
    //背景宽高,按中下往上扩展图片
    LayerManager.BG_WIDTH = 750;
    LayerManager.BG_HEIGHT = 1650;
    airkit.LayerManager = LayerManager;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */
    class PopupView extends airkit.BaseView {
        constructor() {
            super();
            this.bgTouch = true;
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～重写方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**每帧循环*/
        update(dt) {
            return super.update(dt);
        }
        setup(args) {
            super.setup(args);
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        }
        onEnable() {
            super.onEnable();
            //  this.createPanel(this.pkgName, this.resName);
            // let panel = this.panel();
            // if (panel) {
            //     DisplayUtils.popup(panel, Handler.create(this, this.onOpen));
            //     //  this.panel().displayObject.cacheAs = "bitmap";
            //     this.closeBtn = this.closeButton();
            //     if (this.closeBtn) {
            //         this.closeBtn.visible = false;
            //     }
            // }
            airkit.TimerManager.Instance.addOnce(250, this, this.setupTouchClose);
        }
        onOpen() { }
        closeButton() {
            // let btn = this.panel().getChild("closeBtn");
            // if (btn != null) return btn.asButton;
            return null;
        }
        setupTouchClose() {
            // let bg = this.bg();
            // if (bg && this.bgTouch) {
            //     bg.touchable = true;
            //     bg.onClick(this.onClose, this);
            // }
            // if (this.closeBtn) {
            //     this.closeBtn.visible = true;
            //     this.closeBtn.onClick(this.pressClose, this);
            // }
        }
        pressClose() {
            if (this.closeBtn)
                airkit.TweenUtils.scale(this.closeBtn);
            this.onClose();
        }
        onClose() {
            this.doClose();
        }
        dispose() {
            super.dispose();
            if (this.callback != null)
                this.callback();
        }
        static loadResource(onAssetLoaded) {
            return super.loadResource(onAssetLoaded);
        }
    }
    airkit.PopupView = PopupView;
})(airkit || (airkit = {}));
// import { EventCenter } from "../event/EventCenter";
// import { EventID, LoaderEventID } from "../event/EventID";
// import { EventArgs } from "../event/EventArgs";
// import { LayerManager } from "../scene/LayerManager";
// import { Log } from "../log/Log";
// import BaseView from "../scene/BaseView";
// import { ResourceManager } from "../loader/ResourceManager";
// import { DisplayUtils } from "../utils/DisplayUtils";
// import { NDictionary } from "../collection/Dictionary";
// import { ObjectPools } from "../collection/ObjectPools";
// import { UIManager } from "../scene/UIManager";

(function (airkit) {
    /**
     * 场景管理器
     * @author ankye
     * @time 2017-7-13
     */
    class SceneManager {
        /**
         * 注册场景类，存放场景name和class的对应关系
         * @param name
         * @param cls
         */
        static register(name, cls) {
            if (!this.cache) {
                this.cache = new airkit.SDictionary();
            }
            if (this.cache.containsKey(name)) {
                airkit.Log.error("SceneManager::register scene - same id is register:" + name);
                return;
            }
            this.cache.add(name, cls);
            fgui.UIObjectFactory.setExtension(cls.URL, cls);
            airkit.ClassUtils.regClass(name, cls);
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new SceneManager();
            return this.instance;
        }
        setup() {
            this.registerEvent();
        }
        destroy() {
            this.unRegisterEvent();
        }
        update(dt) {
            //do update
            if (this._curScene) {
                this._curScene.update(dt);
            }
        }
        registerEvent() {
            airkit.EventCenter.on(airkit.EventID.CHANGE_SCENE, this, this.onChangeScene);
            airkit.EventCenter.on(airkit.EventID.RESIZE, this, this.resize);
        }
        unRegisterEvent() {
            airkit.EventCenter.off(airkit.EventID.CHANGE_SCENE, this, this.onChangeScene);
            airkit.EventCenter.off(airkit.EventID.RESIZE, this, this.resize);
        }
        resize() {
            airkit.Log.info("SceneManager Receive Resize {0} {1}", cc.winSize.width, cc.winSize.height);
            if (this._curScene) {
                this._curScene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
                var func = this._curScene["resize"];
                let result = null;
                if (func) {
                    result = func.apply(this._curScene);
                }
            }
        }
        onChangeScene(evt) {
            let info = evt.get(0);
            this.gotoScene(info);
        }
        //～～～～～～～～～～～～～～～～～～～～～～～场景切换~～～～～～～～～～～～～～～～～～～～～～～～//
        /**进入场景*/
        gotoScene(sceneName, args) {
            //切换
            let clas = airkit.ClassUtils.getClass(sceneName);
            let res = clas.res();
            if (res == null || (Array.isArray(res) && res.length == 0)) {
                this.exitScene();
                this.enterScene(sceneName, clas, args);
            }
            else {
                clas.loadResource((v) => {
                    if (v) {
                        this.exitScene();
                        this.enterScene(sceneName, clas, args);
                        //  ResourceManager.Instance.dump();
                    }
                    else {
                        airkit.Log.error("加载场景失败 {1}", sceneName);
                    }
                });
            }
        }
        enterScene(sceneName, clas, args) {
            let scene = clas.createInstance();
            scene.setName(sceneName);
            this._curScene = scene;
            airkit.LayerManager.mainLayer.addChild(scene);
            scene.setup(args);
        }
        exitScene() {
            if (this._curScene) {
                //切换
                let sceneName = this._curScene.getName();
                let clas = airkit.ClassUtils.getClass(sceneName);
                clas.unres();
                this._curScene.removeFromParent();
                this._curScene.dispose();
                this._curScene = null;
            }
        }
    }
    SceneManager.instance = null;
    airkit.SceneManager = SceneManager;
})(airkit || (airkit = {}));
/**
 * UI管理器
 * @author ankye
 * @time 2018-7-3
 */

(function (airkit) {
    class UIManager extends airkit.Singleton {
        constructor() {
            super();
            this._dicUIView = null;
            this._UIQueues = null;
            this._dicUIView = new airkit.SDictionary();
            this._UIQueues = new Array();
            //预创建2个队列,通常情况下都能满足需求了
            this._UIQueues[airkit.eUIQueueType.POPUP] = new UIQueue();
            this._UIQueues[airkit.eUIQueueType.ALERT] = new UIQueue();
        }
        /**
      * 注册ui类，存放uiname和class的对应关系
      * @param name
      * @param cls
      */
        static register(name, cls) {
            if (!this.cache) {
                this.cache = new airkit.SDictionary();
            }
            if (this.cache.containsKey(name)) {
                airkit.Log.error("UIManager::register ui - same id is register:" + name);
                return;
            }
            this.cache.add(name, cls);
            airkit.ClassUtils.regClass(name, cls);
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new UIManager();
            return this.instance;
        }
        getQueue(t) {
            return this._UIQueues[t];
        }
        empty() {
            let queue = this.getQueue(airkit.eUIQueueType.POPUP);
            if (!queue.empty())
                return false;
            if (this._dicUIView.length > 0)
                return false;
            return true;
        }
        //～～～～～～～～～～～～～～～～～～～～～～～显示~～～～～～～～～～～～～～～～～～～～～～～～//
        /**
         * 显示界面
         * @param uiName        界面uiName
         * @param args      参数
         */
        show(uiName, ...args) {
            return new Promise((resolve, reject) => {
                airkit.Log.info("show panel {0}", uiName);
                //从缓存中查找
                let obj = this._dicUIView.getValue(uiName);
                if (obj != null) {
                    if (obj["displayObject"] == null) {
                        this._dicUIView.remove(uiName);
                        obj = null;
                    }
                    else {
                        obj.setVisible(true);
                        resolve(obj);
                        return;
                    }
                }
                //获取数据
                let clas = UIManager.cache.getValue(uiName);
                let res = clas.res();
                if (res == null || (Array.isArray(res) && res.length == 0)) {
                    let ui = this.createView(uiName, clas, args);
                    resolve(ui);
                }
                else {
                    clas.loadResource((v) => {
                        if (v) {
                            let ui = this.createView(uiName, clas, args);
                            resolve(ui);
                        }
                        else {
                            reject("ui load resource failed");
                        }
                    });
                }
            });
        }
        createView(uiName, clas, args) {
            let ui = new clas();
            airkit.assert(ui != null, "UIManager::Show - cannot create ui:" + uiName);
            ui.setUIID(uiName);
            ui.setup(null);
            ui.show();
            this._dicUIView.add(uiName, ui);
            return ui;
        }
        /**
         * 关闭界面
         * @param uiName    界面id
         */
        close(uiName, animType = 0) {
            return new Promise((resolve, reject) => {
                airkit.Log.info("close panel {0}", uiName);
                //获取数据
                // let conf: UIConfig = this._dicConfig.getValue(id);
                // assert(
                //     conf != null,
                //     "UIManager::Close - not find id:" + conf.mID
                // );
                let panel = this._dicUIView.getValue(uiName);
                if (!panel)
                    return;
                //切换
                let clas = airkit.ClassUtils.getClass(uiName);
                clas.unres();
                if (animType == 0) {
                    let result = this.clearPanel(uiName, panel);
                    resolve([uiName, result]);
                }
                else {
                    airkit.DisplayUtils.hide(panel, airkit.Handler.create(null, (v) => {
                        let result = this.clearPanel(uiName, panel);
                        resolve([uiName, result]);
                    }));
                }
            });
        }
        clearPanel(uiName, panel) {
            //销毁或隐藏
            this._dicUIView.remove(uiName);
            airkit.Log.info("clear panel {0}", uiName);
            panel.removeFromParent();
            panel.dispose();
            return true;
        }
        /**
         * 关闭所有界面
         * @param   exclude_list    需要排除关闭的列表
         */
        closeAll(exclude_list = null) {
            this._dicUIView.foreach(function (key, value) {
                if (exclude_list && airkit.ArrayUtils.containsValue(exclude_list, key))
                    return true;
                UIManager.Instance.close(key);
                return true;
            });
        }
        /**
         * 弹窗UI，默认用队列显示
         * @param uiName
         * @param args
         */
        popup(uiName, ...args) {
            this.getQueue(airkit.eUIQueueType.POPUP).show(uiName, args);
        }
        /**
         * alert框，默认队列显示
         *
         * @param {string} uiName
         * @param {...any[]} args
         * @memberof UIManager
         */
        alert(uiName, ...args) {
            this.getQueue(airkit.eUIQueueType.ALERT).show(uiName, args);
        }
        /**查找界面*/
        findPanel(uiName) {
            let panel = this._dicUIView.getValue(uiName);
            return panel;
        }
        /**界面是否打开*/
        isPanelOpen(uiName) {
            let panel = this._dicUIView.getValue(uiName);
            if (panel)
                return true;
            else
                return false;
        }
    }
    UIManager.instance = null;
    airkit.UIManager = UIManager;
    //     //toast
    //     public tipsPopup(
    //         toastLayer: fgui.GComponent,
    //         target: fgui.GComponent,
    //         view: fgui.GComponent,
    //         duration: number = 0.5,
    //         fromProps = null,
    //         toProps = null,
    //         usePool: boolean = true
    //     ): Promise<any> {
    //         return new Promise<void>((resolve, reject) => {
    //             //  target.addChild(view)
    //             toastLayer.addChild(view);
    //             view.setScale(0.1, 0.1);
    //             //fgui坐标转化有问题，临时处理一下
    //             let point = target.localToGlobal(
    //                 target.width / 2.0 - target.pivotX * target.width,
    //                 target.height * 0.382 - target.pivotY * target.height
    //             );
    //             let localPoint = toastLayer.globalToLocal(point.x, point.y);
    //             // view.setXY(target.width / 2.0, target.height * 0.382)
    //             let start = 0;
    //             let offset = 600;
    //             let type = fgui.EaseType.BounceOut;
    //             if (duration > 1.5) {
    //                 start = toastLayer.height + 600;
    //                 offset = -600;
    //                 type = fgui.EaseType.QuadOut;
    //                 view.setPosition(localPoint.x, start);
    //             } else {
    //                 view.setPosition(localPoint.x, start - 200);
    //             }
    //             TweenUtils.get(view)
    //                 .delay(1.5)
    //                 .to(
    //                     {
    //                         scaleX: 1.0,
    //                         scaleY: 1.0,
    //                         alpha: 1.0,
    //                         x: localPoint.x,
    //                         y: localPoint.y,
    //                     },
    //                     duration,
    //                     type
    //                 )
    //                 .delay(0.5)
    //                 .to(
    //                     { x: localPoint.x, y: start - offset },
    //                     duration,
    //                     fgui.EaseType.ExpoOut,
    //                     Handler.create(null, () => {
    //                         view.removeFromParent();
    //                         resolve();
    //                     })
    //                 );
    //         });
    //     }
    //     //tips 单toast，具有排他性
    //     public singleToast(
    //         toastLayer: fgui.GComponent,
    //         target: fgui.GComponent,
    //         view: fgui.GComponent,
    //         duration: number = 0.5,
    //         speedUp: boolean,
    //         usePool: boolean = true,
    //         x: number = null,
    //         y: number = null
    //     ): Promise<any> {
    //         return new Promise<void>((resolve, reject) => {
    //             let key = "_single_toast";
    //             if (target[key] == null) {
    //                 target[key] = [];
    //             }
    //             let inEase = fgui.EaseType.QuadOut;
    //             let outEase = fgui.EaseType.QuadIn;
    //             //  target.addChild(view)
    //             toastLayer.addChild(view);
    //             let k = ClassUtils.classKey(view);
    //             for (var i in target[key]) {
    //                 let o = target[key][i] as fgui.GComponent;
    //                 if (o) {
    //                     o["toY"] -= o.height + 5;
    //                     if (ClassUtils.classKey(o) == k) {
    //                         o.visible = false;
    //                     }
    //                 }
    //             }
    //             target[key].push(view);
    //             view.visible = true;
    //             view.setScale(0.1, 0.1);
    //             //fgui坐标转化有问题，临时处理一下
    //             if (x == null)
    //                 x = target.width / 2.0 - target.pivotX * target.width;
    //             if (y == null)
    //                 y = target.height * 0.382 - target.pivotY * target.height;
    //             let point = target.localToGlobal(x, y);
    //             let localPoint = toastLayer.globalToLocal(point.x, point.y);
    //             // view.setXY(target.width / 2.0, target.height * 0.382)
    //             view.setPosition(localPoint.x, localPoint.y);
    //             view["toY"] = view.y;
    //             let tu = TweenUtils.get(view);
    //             tu.setOnUpdate((gt: fgui.GTweener) => {
    //                 let toY = view["toY"];
    //                 if (toY < view.y) {
    //                     let offset = (toY - view.y) * 0.4;
    //                     let limit = -5 - Math.ceil(view.height / 50);
    //                     if (offset < limit) offset = limit;
    //                     view.y += offset;
    //                 }
    //             });
    //             let scale = 1.0;
    //             tu.to(
    //                 { scaleX: scale, scaleY: scale, alpha: 1.0 },
    //                 duration,
    //                 inEase
    //             ).to(
    //                 { alpha: 0.4 },
    //                 duration * 0.7,
    //                 outEase,
    //                 Handler.create(this, () => {
    //                     target[key].splice(target[key].indexOf(view), 1);
    //                     if (target && view && view["parent"]) {
    //                         view.removeFromParent();
    //                         tu.clear();
    //                     }
    //                     if (usePool) {
    //                         ObjectPools.recover(view);
    //                     } else {
    //                         view.dispose();
    //                     }
    //                     resolve();
    //                 })
    //             );
    //         });
    //     }
    //     //toast
    //     public toast(
    //         toastLayer: fgui.GComponent,
    //         target: fgui.GComponent,
    //         view: fgui.GComponent,
    //         duration: number = 0.5,
    //         speedUp: boolean,
    //         usePool: boolean = true,
    //         x: number = null,
    //         y: number = null
    //     ): Promise<any> {
    //         return new Promise<void>((resolve, reject) => {
    //             if (target["_toastList"] == null) {
    //                 target["_toastList"] = [];
    //             }
    //             let inEase = fgui.EaseType.QuadOut;
    //             let outEase = fgui.EaseType.QuadIn;
    //             //  target.addChild(view)
    //             toastLayer.addChild(view);
    //             if (speedUp) {
    //                 for (var i in target["_toastList"]) {
    //                     if (target["_toastList"][i]) {
    //                         target["_toastList"][i]["toY"] -=
    //                             target["_toastList"][i].height + 8;
    //                         target["_toastList"][i].visible = false;
    //                     }
    //                 }
    //                 duration = duration;
    //                 inEase = fgui.EaseType.BounceOut;
    //                 outEase = fgui.EaseType.BounceIn;
    //             } else {
    //                 for (var i in target["_toastList"]) {
    //                     if (target["_toastList"][i]) {
    //                         target["_toastList"][i]["toY"] -=
    //                             target["_toastList"][i].height + 8;
    //                     }
    //                 }
    //             }
    //             target["_toastList"].push(view);
    //             view.setScale(0.1, 0.1);
    //             //fgui坐标转化有问题，临时处理一下
    //             if (x == null)
    //                 x = target.width / 2.0 - target.pivotX * target.width;
    //             if (y == null)
    //                 y = target.height * 0.382 - target.pivotY * target.height;
    //             let point = target.localToGlobal(x, y);
    //             let localPoint = toastLayer.globalToLocal(point.x, point.y);
    //             // view.setXY(target.width / 2.0, target.height * 0.382)
    //             view.setPosition(localPoint.x, localPoint.y);
    //             view["toY"] = view.y;
    //             let tu = TweenUtils.get(view);
    //             tu.setOnUpdate((gt: fgui.GTweener) => {
    //                 let toY = view["toY"];
    //                 if (toY < view.y) {
    //                     let offset = (toY - view.y) * 0.4;
    //                     let limit = -8 - Math.ceil(view.height / 50);
    //                     if (offset < limit) offset = limit;
    //                     view.y += offset;
    //                 }
    //             });
    //             let scale = speedUp ? 1.0 : 1.0;
    //             tu.to(
    //                 { scaleX: scale, scaleY: scale, alpha: 1.0 },
    //                 duration,
    //                 inEase
    //             ).to(
    //                 { alpha: 0.4 },
    //                 duration * 0.7,
    //                 outEase,
    //                 Handler.create(this, () => {
    //                     target["_toastList"].splice(
    //                         target["_toastList"].indexOf(view),
    //                         1
    //                     );
    //                     if (target && view && view["parent"]) {
    //                         view.removeFromParent();
    //                         tu.clear();
    //                     }
    //                     if (usePool) {
    //                         ObjectPools.recover(view);
    //                     } else {
    //                         view.dispose();
    //                     }
    //                     resolve();
    //                 })
    //             );
    //         });
    //     }
    //     public setup(): void {}
    //     public destroy(): boolean {
    //         this.closeAll();
    //         this.clearUIConfig();
    //         return true;
    //     }
    //     public update(dt: number): void {
    //         this._dicUIView.foreach(function (key, value) {
    //             value.update(dt);
    //             return true;
    //         });
    //     }
    //     //～～～～～～～～～～～～～～～～～～～～～～～加载~～～～～～～～～～～～～～～～～～～～～～～～//
    //     public register(info: UIConfig): void {
    //         if (this._dicConfig.containsKey(info.mID)) {
    //             Log.error(
    //                 "UIManager::Push UIConfig - same id is register:" + info.mID
    //             );
    //             return;
    //         }
    //         this._dicConfig.add(info.mID, info);
    //         ClassUtils.regClass(info.name, info.cls);
    //     }
    //     public clearUIConfig(): void {
    //         this._dicConfig.clear();
    //     }
    //     public getUIConfig(id: number): UIConfig {
    //         return this._dicConfig.getValue(id);
    //     }
    //     public getUILayerID(id: number) {
    //         let info: UIConfig = this._dicConfig.getValue(id);
    //         if (!info) {
    //             return -1;
    //         }
    //         return info.mLayer;
    //     }
    // }
    // /** 
    // 显示弹出框信息
    // @param callback         回调函数
    // @param title            标题，默认是""
    // @param content          提示内容 RICHTEXT样式
    // @param tips             内容文本的一个底部tip文本,RICHTEXT样式,不需要可以传null
    // @param buttons          按钮的label,不需要显示按钮可以传null,确认按钮[{按钮属性k:v依据Label}]
    // @param param            调用方预设的参数，保存在alertView对象中，可以通过getParam方法获取
    // */
    // export class AlertInfo {
    //     public callback: Function;
    //     public title: string = "";
    //     public content: string;
    //     public tips: string = "";
    //     public buttons: any = [];
    //     public param: any = null;
    //     constructor(
    //         callback: Function,
    //         title: string = "",
    //         content: string,
    //         tips: string = "",
    //         buttons: any = {},
    //         param: any = null
    //     ) {
    //         this.callback = callback;
    //         this.title = title;
    //         this.content = content;
    //         this.tips = tips;
    //         this.buttons = buttons;
    //         this.param = param;
    //     }
    // }
    // export class UIConfig {
    //     public mID: number;
    //     /**ui类*/
    //     public name: string;
    //     public cls: any;
    //     /**层级*/
    //     public mLayer: number;
    //     /**隐藏销毁*/
    //     public mHideDestroy: boolean;
    //     /**对齐*/
    //     public mAlige: eAligeType;
    //     constructor(
    //         id: number,
    //         name: string,
    //         cls: any,
    //         layer: number,
    //         destroy: boolean,
    //         alige: eAligeType
    //     ) {
    //         this.mID = id;
    //         this.name = name;
    //         this.cls = cls;
    //         this.mLayer = layer;
    //         this.mHideDestroy = destroy;
    //         this.mAlige = alige;
    //     }
    // }
    class UIQueue {
        constructor() {
            /*～～～～～～～～～～～～～～～～～～～～～队列方式显示界面，上一个界面关闭，才会显示下一个界面～～～～～～～～～～～～～～～～～～～～～*/
            this._currentUI = null;
            this._currentUI = null;
            this._listPanels = new airkit.Queue();
        }
        /**
         * 直接显示界面,注：
         * 1.通过这个接口打开的界面，初始化注册的ui类设定的UIConfig.mHideDestroy必须为true。原因是显示下一个界面是通过上个界面的CLOSE事件触发
         * @param 	id		界面id
         * @param 	args	创建参数，会在界面onCreate时传入
         */
        show(id, args) {
            let info = [id, args];
            this._listPanels.enqueue(info);
            this.checkAlertNext();
        }
        empty() {
            if (this._currentUI != null || this._listPanels.length > 0)
                return false;
            return true;
        }
        /**
         * 判断是否弹出下一个界面
         */
        checkAlertNext() {
            if (this._currentUI != null || this._listPanels.length <= 0)
                return;
            let info = this._listPanels.dequeue();
            this.registerEvent();
            this._currentUI = info[0];
            UIManager.Instance.show(info[0], ...info[1]);
        }
        registerEvent() {
            airkit.EventCenter.on(airkit.EventID.UI_CLOSE, this, this.onUIEvent);
        }
        unRegisterEvent() {
            airkit.EventCenter.off(airkit.EventID.UI_CLOSE, this, this.onUIEvent);
        }
        onUIEvent(args) {
            switch (args.type) {
                case airkit.EventID.UI_CLOSE:
                    let id = args.get(0);
                    if (this._currentUI != null && this._currentUI == id) {
                        this._currentUI = null;
                        this.unRegisterEvent();
                        this.checkAlertNext();
                    }
                    break;
            }
        }
    }
})(airkit || (airkit = {}));
/**
 * 本地数据
 * @author ankye
 * @time 2018-7-15
 */

(function (airkit) {
    class LocalDB {
        /**
         * 设置全局id，用于区分同一个设备的不同玩家
         * @param	key	唯一键，可以使用玩家id
         */
        static setGlobalKey(key) {
            this._globalKey = key;
        }
        static has(key) {
            return cc.sys.localStorage.getItem(this.getFullKey(key)) != null;
        }
        static getInt(key) {
            return parseInt(cc.sys.localStorage.getItem(this.getFullKey(key)));
        }
        static setInt(key, value) {
            cc.sys.localStorage.setItem(this.getFullKey(key), value.toString());
        }
        static getFloat(key) {
            return parseInt(cc.sys.localStorage.getItem(this.getFullKey(key)));
        }
        static setFloat(key, value) {
            cc.sys.localStorage.setItem(this.getFullKey(key), value.toString());
        }
        static getString(key) {
            return cc.sys.localStorage.getItem(this.getFullKey(key));
        }
        static setString(key, value) {
            cc.sys.localStorage.setItem(this.getFullKey(key), value);
        }
        static remove(key) {
            cc.sys.localStorage.removeItem(this.getFullKey(key));
        }
        static clear() {
            cc.sys.localStorage.clear();
        }
        static getFullKey(key) {
            return this._globalKey + "_" + key;
        }
    }
    LocalDB._globalKey = "";
    airkit.LocalDB = LocalDB;
})(airkit || (airkit = {}));
/**
 * 定时执行
 * @author ankye
 * @time 2018-7-11
 */

(function (airkit) {
    class IntervalTimer {
        constructor() {
            this._nowTime = 0;
        }
        /**
         * 初始化定时器
         * @param	interval	触发间隔
         * @param	firstFrame	是否第一帧开始执行
         */
        init(interval, firstFrame) {
            this._intervalTime = interval;
            if (firstFrame)
                this._nowTime = this._intervalTime;
        }
        reset() {
            this._nowTime = 0;
        }
        update(elapseTime) {
            this._nowTime += elapseTime;
            if (this._nowTime >= this._intervalTime) {
                this._nowTime -= this._intervalTime;
                return true;
            }
            return false;
        }
    }
    airkit.IntervalTimer = IntervalTimer;
})(airkit || (airkit = {}));
/**
 * 时间
 * @author ankye
 * @time 2018-7-3
 */

(function (airkit) {
    class Timer {
        //两帧之间的时间间隔,单位毫秒
        static get deltaTimeMS() {
            return cc.director.getDeltaTime() * 1000;
        }
        /**游戏启动后，经过的帧数*/
        static get frameCount() {
            return cc.director.getTotalFrames();
        }
        static get timeScale() {
            return cc.director.getScheduler().getTimeScale();
        }
        static set timeScale(scale) {
            cc.director.getScheduler().setTimeScale(scale);
        }
    }
    airkit.Timer = Timer;
})(airkit || (airkit = {}));
// import { ArrayUtils } from "../utils/ArrayUtils";
// import { ObjectPools } from "../collection/ObjectPools";
// import { Singleton } from "../collection/Singleton";
// import { IPoolsObject } from "../collection/IPoolsObject";
// import { IntervalTimer } from "./IntervalTimer";
// import { Timer } from "./Timer";

(function (airkit) {
    /**
     * 定时器
     * @author ankye
     * @time 2018-7-11
     */
    class TimerManager extends airkit.Singleton {
        constructor() {
            super(...arguments);
            this._idCounter = 0;
            this._removalPending = [];
            this._timers = [];
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new TimerManager();
            return this.instance;
        }
        setup() {
            this._idCounter = 0;
        }
        destroy() {
            airkit.ArrayUtils.clear(this._removalPending);
            airkit.ArrayUtils.clear(this._timers);
            return true;
        }
        update(dt) {
            this.remove();
            for (let i = 0; i < this._timers.length; i++) {
                this._timers[i].update(dt);
                if (this._timers[i].isActive == false) {
                    TimerManager.Instance.removeTimer(this._timers[i].id);
                }
            }
        }
        /**
         * 定时重复执行
         * @param	rate	间隔时间(单位毫秒)。
         * @param	ticks	执行次数
         * @param	caller	执行域(this)。
         * @param	method	定时器回调函数：注意，返回函数第一个参数为定时器id，后面参数依次时传入的参数。例OnTime(timer_id:number, args1:any, args2:any,...):void
         * @param	args	回调参数。
         */
        addLoop(rate, ticks, caller, method, args = null) {
            if (ticks <= 0)
                ticks = 0;
            let timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            if (args != null)
                airkit.ArrayUtils.insert(args, this._idCounter, 0);
            let handler = airkit.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, ticks, handler);
            this._timers.push(timer);
            return timer.id;
        }
        /**
         * 单次执行
         * 间隔时间(单位毫秒)。
         */
        addOnce(rate, caller, method, args = null) {
            let timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            if (args != null)
                airkit.ArrayUtils.insert(args, this._idCounter, 0);
            let handler = airkit.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, 1, handler);
            this._timers.push(timer);
            return timer.id;
        }
        /**
         * 移除定时器
         * @param	timerId	定时器id
         */
        removeTimer(timerId) {
            this._removalPending.push(timerId);
        }
        /**
         * 移除过期定时器
         */
        remove() {
            let t;
            if (this._removalPending.length > 0) {
                for (let id of this._removalPending) {
                    for (let i = 0; i < this._timers.length; i++) {
                        t = this._timers[i];
                        if (t.id == id) {
                            t.clear();
                            // ObjectPools.recover(t)
                            airkit.ObjectPools.recover(t);
                            this._timers.splice(i, 1);
                            break;
                        }
                    }
                }
                airkit.ArrayUtils.clear(this._removalPending);
            }
        }
    }
    TimerManager.TIMER_OBJECT = "timerObject";
    TimerManager.instance = null;
    airkit.TimerManager = TimerManager;
    class TimerObject {
        constructor() {
            this.mTime = new airkit.IntervalTimer();
        }
        init() { }
        clear() {
            if (this.handle != null) {
                this.handle.recover();
                this.handle = null;
            }
        }
        set(id, rate, ticks, handle) {
            this.id = id;
            this.mRate = rate < 0 ? 0 : rate;
            this.mTicks = ticks < 0 ? 0 : ticks;
            this.handle = handle;
            this.mTicksElapsed = 0;
            this.isActive = true;
            this.mTime.init(this.mRate, false);
        }
        update(dt) {
            if (this.isActive && this.mTime.update(dt)) {
                if (this.handle != null)
                    this.handle.run();
                this.mTicksElapsed++;
                if (this.mTicks > 0 && this.mTicks == this.mTicksElapsed) {
                    this.isActive = false;
                }
            }
        }
    }
    TimerObject.objectKey = "TimerObject";
    airkit.TimerObject = TimerObject;
})(airkit || (airkit = {}));

(function (airkit) {
    /**数组排序方式*/
    let eArraySortOrder;
    (function (eArraySortOrder) {
        eArraySortOrder[eArraySortOrder["ASCENDING"] = 0] = "ASCENDING";
        eArraySortOrder[eArraySortOrder["DESCENDING"] = 1] = "DESCENDING";
    })(eArraySortOrder = airkit.eArraySortOrder || (airkit.eArraySortOrder = {}));
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
        static insert(arr, value, index) {
            if (index > arr.length - 1) {
                arr.push(value);
            }
            else {
                arr.splice(index, 0, value);
            }
        }
        /**
         * Checks if the given argument is a Array.
         * @function
         */
        static isArray(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }
        static equip(arr, v) {
            // if the other array is a falsy value, return
            if (!arr || !v)
                return false;
            // compare lengths - can save a lot of time
            if (arr.length != v.length)
                return false;
            for (var i = 0, l = arr.length; i < l; i++) {
                // Check if we have nested arrays
                if (arr[i] instanceof Array && v[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!arr[i].equals(v[i]))
                        return false;
                }
                else if (arr[i] != v[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        }
        /**从数组移除元素*/
        static removeValue(arr, v) {
            if (Array.isArray(v)) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (this.equip(arr[i], v)) {
                        arr.splice(i, 1);
                    }
                }
            }
            else {
                let i = arr.indexOf(v);
                if (i != -1) {
                    arr.splice(i, 1);
                }
            }
        }
        /**移除所有值等于v的元素*/
        static removeAllValue(arr, v) {
            let i = arr.indexOf(v);
            while (i >= 0) {
                arr.splice(i, 1);
                i = arr.indexOf(v);
            }
        }
        /**包含元素*/
        static containsValue(arr, v) {
            return arr.length > 0 ? arr.indexOf(v) != -1 : false;
        }
        /**复制*/
        static copy(arr) {
            // return arr.slice()
            return JSON.parse(JSON.stringify(arr));
        }
        /**
         * 排序
         * @param arr 需要排序的数组
         * @param key 排序字段
         * @param order 排序方式
         */
        static sort(arr, key, order = eArraySortOrder.DESCENDING) {
            if (arr == null)
                return;
            arr.sort(function (info1, info2) {
                switch (order) {
                    case eArraySortOrder.ASCENDING: {
                        if (info1[key] < info2[key])
                            return -1;
                        if (info1[key] > info2[key])
                            return 1;
                        else
                            return 0;
                    }
                    case eArraySortOrder.DESCENDING: {
                        if (info1[key] > info2[key])
                            return -1;
                        if (info1[key] < info2[key])
                            return 1;
                        else
                            return 0;
                    }
                }
            });
        }
        /**清空数组*/
        static clear(arr) {
            let i = 0;
            let len = arr.length;
            for (i = 0; i < len; ++i) {
                arr[i] = null;
            }
            arr.splice(0);
        }
        /**数据是否为空*/
        static isEmpty(arr) {
            if (arr == null || arr.length == 0) {
                return true;
            }
            return false;
        }
    }
    airkit.ArrayUtils = ArrayUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * <p> <code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。</p>
     * <p> <code>Byte</code> 类适用于需要在字节层访问数据的高级开发人员。</p>
     */
    class Byte {
        /**
         * 创建一个 <code>Byte</code> 类的实例。
         * @param	data	用于指定初始化的元素数目，或者用于初始化的TypedArray对象、ArrayBuffer对象。如果为 null ，则预分配一定的内存空间，当可用空间不足时，优先使用这部分内存，如果还不够，则重新分配所需内存。
         */
        constructor(data = null) {
            /**@private 是否为小端数据。*/
            this._xd_ = true;
            /**@private */
            this._allocated_ = 8;
            /**@private */
            this._pos_ = 0;
            /**@private */
            this._length = 0;
            if (data) {
                this._u8d_ = new Uint8Array(data);
                this._d_ = new DataView(this._u8d_.buffer);
                this._length = this._d_.byteLength;
            }
            else {
                this._resizeBuffer(this._allocated_);
            }
        }
        /**
         * <p>获取当前主机的字节序。</p>
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。</p>
         * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
         * <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
         * @return 当前系统的字节序。
         */
        static getSystemEndian() {
            if (!Byte._sysEndian) {
                var buffer = new ArrayBuffer(2);
                new DataView(buffer).setInt16(0, 256, true);
                Byte._sysEndian = new Int16Array(buffer)[0] === 256 ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
            }
            return Byte._sysEndian;
        }
        /**
         * 获取此对象的 ArrayBuffer 数据，数据只包含有效数据部分。
         */
        get buffer() {
            var rstBuffer = this._d_.buffer;
            if (rstBuffer.byteLength === this._length)
                return rstBuffer;
            return rstBuffer.slice(0, this._length);
        }
        /**
         * <p> <code>Byte</code> 实例的字节序。取值为：<code>BIG_ENDIAN</code> 或 <code>BIG_ENDIAN</code> 。</p>
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
         * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
         *  <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
         */
        get endian() {
            return this._xd_ ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
        }
        set endian(value) {
            this._xd_ = value === Byte.LITTLE_ENDIAN;
        }
        /**
         * <p> <code>Byte</code> 对象的长度（以字节为单位）。</p>
         * <p>如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。</p>
         * <p>如果要设置的长度大于当前已分配的内存空间的字节长度，则重新分配内存空间，大小为以下两者较大者：要设置的长度、当前已分配的长度的2倍，并将原有数据拷贝到新的内存空间中；如果要设置的长度小于当前已分配的内存空间的字节长度，也会重新分配内存空间，大小为要设置的长度，并将原有数据从头截断为要设置的长度存入新的内存空间中。</p>
         */
        set length(value) {
            if (this._allocated_ < value)
                this._resizeBuffer((this._allocated_ = Math.floor(Math.max(value, this._allocated_ * 2))));
            else if (this._allocated_ > value)
                this._resizeBuffer((this._allocated_ = value));
            this._length = value;
        }
        get length() {
            return this._length;
        }
        /**@private */
        _resizeBuffer(len) {
            try {
                var newByteView = new Uint8Array(len);
                if (this._u8d_ != null) {
                    if (this._u8d_.length <= len)
                        newByteView.set(this._u8d_);
                    else
                        newByteView.set(this._u8d_.subarray(0, len));
                }
                this._u8d_ = newByteView;
                this._d_ = new DataView(newByteView.buffer);
            }
            catch (err) {
                throw "Invalid typed array length:" + len;
            }
        }
        /**
         * @private
         * <p>常用于解析固定格式的字节流。</p>
         * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
         * @return 读取的字符串。
         */
        getString() {
            return this.readString();
        }
        /**
         * <p>常用于解析固定格式的字节流。</p>
         * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
         * @return 读取的字符串。
         */
        readString() {
            return this._rUTF(this.getUint16());
        }
        /**
         * @private
         * <p>从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。</p>
         * <p><b>注意：</b>返回的 Float32Array 对象，在 JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。</p>
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Float32Array 对象。
         */
        getFloat32Array(start, len) {
            return this.readFloat32Array(start, len);
        }
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Float32Array 对象。
         */
        readFloat32Array(start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Float32Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        }
        /**
         * @private
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        getUint8Array(start, len) {
            return this.readUint8Array(start, len);
        }
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        readUint8Array(start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Uint8Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        }
        /**
         * @private
         * <p>从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。</p>
         * <p><b>注意：</b>返回的 Int16Array 对象，在 JavaScript 环境下，是原生的 HTML5 Int16Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Int16Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。</p>
         * @param	start	开始读取的字节偏移量位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Int16Array 对象。
         */
        getInt16Array(start, len) {
            return this.readInt16Array(start, len);
        }
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。
         * @param	start	开始读取的字节偏移量位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        readInt16Array(start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Int16Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        }
        /**
         * @private
         * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        getFloat32() {
            return this.readFloat32();
        }
        /**
         * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        readFloat32() {
            if (this._pos_ + 4 > this._length)
                throw "getFloat32 error - Out of bounds";
            var v = this._d_.getFloat32(this._pos_, this._xd_);
            this._pos_ += 4;
            return v;
        }
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        getFloat64() {
            return this.readFloat64();
        }
        /**
         * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        readFloat64() {
            if (this._pos_ + 8 > this._length)
                throw "getFloat64 error - Out of bounds";
            var v = this._d_.getFloat64(this._pos_, this._xd_);
            this._pos_ += 8;
            return v;
        }
        /**
         * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
         * @param	value	单精度（32 位）浮点数。
         */
        writeFloat32(value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setFloat32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        }
        /**
         * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 双精度（64 位）浮点数。
         * @param	value	双精度（64 位）浮点数。
         */
        writeFloat64(value) {
            this._ensureWrite(this._pos_ + 8);
            this._d_.setFloat64(this._pos_, value, this._xd_);
            this._pos_ += 8;
        }
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
         * @return Int32 值。
         */
        getInt32() {
            return this.readInt32();
        }
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
         * @return Int32 值。
         */
        readInt32() {
            if (this._pos_ + 4 > this._length)
                throw "getInt32 error - Out of bounds";
            var float = this._d_.getInt32(this._pos_, this._xd_);
            this._pos_ += 4;
            return float;
        }
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
         * @return Uint32 值。
         */
        getUint32() {
            return this.readUint32();
        }
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
         * @return Uint32 值。
         */
        readUint32() {
            if (this._pos_ + 4 > this._length)
                throw "getUint32 error - Out of bounds";
            var v = this._d_.getUint32(this._pos_, this._xd_);
            this._pos_ += 4;
            return v;
        }
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Int32 值。
         * @param	value	需要写入的 Int32 值。
         */
        writeInt32(value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setInt32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        }
        /**
         * 在字节流的当前字节偏移量位置处写入 Uint32 值。
         * @param	value	需要写入的 Uint32 值。
         */
        writeUint32(value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setUint32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        }
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
         * @return Int16 值。
         */
        getInt16() {
            return this.readInt16();
        }
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
         * @return Int16 值。
         */
        readInt16() {
            if (this._pos_ + 2 > this._length)
                throw "getInt16 error - Out of bounds";
            var us = this._d_.getInt16(this._pos_, this._xd_);
            this._pos_ += 2;
            return us;
        }
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
         * @return Uint16 值。
         */
        getUint16() {
            return this.readUint16();
        }
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
         * @return Uint16 值。
         */
        readUint16() {
            if (this._pos_ + 2 > this._length)
                throw "getUint16 error - Out of bounds";
            var us = this._d_.getUint16(this._pos_, this._xd_);
            this._pos_ += 2;
            return us;
        }
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Uint16 值。
         * @param	value	需要写入的Uint16 值。
         */
        writeUint16(value) {
            this._ensureWrite(this._pos_ + 2);
            this._d_.setUint16(this._pos_, value, this._xd_);
            this._pos_ += 2;
        }
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Int16 值。
         * @param	value	需要写入的 Int16 值。
         */
        writeInt16(value) {
            this._ensureWrite(this._pos_ + 2);
            this._d_.setInt16(this._pos_, value, this._xd_);
            this._pos_ += 2;
        }
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
         * @return Uint8 值。
         */
        getUint8() {
            return this.readUint8();
        }
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
         * @return Uint8 值。
         */
        readUint8() {
            if (this._pos_ + 1 > this._length)
                throw "getUint8 error - Out of bounds";
            return this._u8d_[this._pos_++];
        }
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Uint8 值。
         * @param	value	需要写入的 Uint8 值。
         */
        writeUint8(value) {
            this._ensureWrite(this._pos_ + 1);
            this._d_.setUint8(this._pos_, value);
            this._pos_++;
        }
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
         * @param	pos	字节读取位置。
         * @return Uint8 值。
         */
        //TODO:coverage
        _getUInt8(pos) {
            return this._readUInt8(pos);
        }
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
         * @param	pos	字节读取位置。
         * @return Uint8 值。
         */
        //TODO:coverage
        _readUInt8(pos) {
            return this._d_.getUint8(pos);
        }
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
         * @param	pos	字节读取位置。
         * @return Uint16 值。
         */
        //TODO:coverage
        _getUint16(pos) {
            return this._readUint16(pos);
        }
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
         * @param	pos	字节读取位置。
         * @return Uint16 值。
         */
        //TODO:coverage
        _readUint16(pos) {
            return this._d_.getUint16(pos, this._xd_);
        }
        /**
         * @private
         * 读取指定长度的 UTF 型字符串。
         * @param	len 需要读取的长度。
         * @return 读取的字符串。
         */
        _rUTF(len) {
            var v = "", max = this._pos_ + len, c, c2, c3, f = String.fromCharCode;
            var u = this._u8d_, i = 0;
            var strs = [];
            var n = 0;
            strs.length = 1000;
            while (this._pos_ < max) {
                c = u[this._pos_++];
                if (c < 0x80) {
                    if (c != 0)
                        //v += f(c);\
                        strs[n++] = f(c);
                }
                else if (c < 0xe0) {
                    //v += f(((c & 0x3F) << 6) | (u[_pos_++] & 0x7F));
                    strs[n++] = f(((c & 0x3f) << 6) | (u[this._pos_++] & 0x7f));
                }
                else if (c < 0xf0) {
                    c2 = u[this._pos_++];
                    //v += f(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (u[_pos_++] & 0x7F));
                    strs[n++] = f(((c & 0x1f) << 12) | ((c2 & 0x7f) << 6) | (u[this._pos_++] & 0x7f));
                }
                else {
                    c2 = u[this._pos_++];
                    c3 = u[this._pos_++];
                    //v += f(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (u[_pos_++] & 0x7F));
                    const _code = ((c & 0x0f) << 18) | ((c2 & 0x7f) << 12) | ((c3 & 0x7f) << 6) | (u[this._pos_++] & 0x7f);
                    if (_code >= 0x10000) {
                        const _offset = _code - 0x10000;
                        const _lead = 0xd800 | (_offset >> 10);
                        const _trail = 0xdc00 | (_offset & 0x3ff);
                        strs[n++] = f(_lead);
                        strs[n++] = f(_trail);
                    }
                    else {
                        strs[n++] = f(_code);
                    }
                }
                i++;
            }
            strs.length = n;
            return strs.join("");
            //return v;
        }
        /**
         * @private
         * 读取 <code>len</code> 参数指定的长度的字符串。
         * @param	len	要读取的字符串的长度。
         * @return 指定长度的字符串。
         */
        //TODO:coverage
        getCustomString(len) {
            return this.readCustomString(len);
        }
        /**
         * @private
         * 读取 <code>len</code> 参数指定的长度的字符串。
         * @param	len	要读取的字符串的长度。
         * @return 指定长度的字符串。
         */
        //TODO:coverage
        readCustomString(len) {
            var v = "", ulen = 0, c, c2, f = String.fromCharCode;
            var u = this._u8d_, i = 0;
            while (len > 0) {
                c = u[this._pos_];
                if (c < 0x80) {
                    v += f(c);
                    this._pos_++;
                    len--;
                }
                else {
                    ulen = c - 0x80;
                    this._pos_++;
                    len -= ulen;
                    while (ulen > 0) {
                        c = u[this._pos_++];
                        c2 = u[this._pos_++];
                        v += f((c2 << 8) | c);
                        ulen--;
                    }
                }
            }
            return v;
        }
        /**
         * 移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         */
        get pos() {
            return this._pos_;
        }
        set pos(value) {
            this._pos_ = value;
            //$MOD byteOffset是只读的，这里进行赋值没有意义。
            //_d_.byteOffset = value;
        }
        /**
         * 可从字节流的当前位置到末尾读取的数据的字节数。
         */
        get bytesAvailable() {
            return this._length - this._pos_;
        }
        /**
         * 清除字节数组的内容，并将 length 和 pos 属性重置为 0。调用此方法将释放 Byte 实例占用的内存。
         */
        clear() {
            this._pos_ = 0;
            this.length = 0;
        }
        /**
         * @internal
         * 获取此对象的 ArrayBuffer 引用。
         * @return
         */
        __getBuffer() {
            //this._d_.buffer.byteLength = this.length;
            return this._d_.buffer;
        }
        /**
         * <p>将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的字为字符串添加前缀。</p>
         * <p>对应的读取方法为： getUTFBytes 。</p>
         * @param value 要写入的字符串。
         */
        writeUTFBytes(value) {
            // utf8-decode
            value = value + "";
            for (var i = 0, sz = value.length; i < sz; i++) {
                var c = value.charCodeAt(i);
                if (c <= 0x7f) {
                    this.writeByte(c);
                }
                else if (c <= 0x7ff) {
                    //优化为直接写入多个字节，而不必重复调用writeByte，免去额外的调用和逻辑开销。
                    this._ensureWrite(this._pos_ + 2);
                    this._u8d_.set([0xc0 | (c >> 6), 0x80 | (c & 0x3f)], this._pos_);
                    this._pos_ += 2;
                }
                else if (c >= 0xd800 && c <= 0xdbff) {
                    i++;
                    const c2 = value.charCodeAt(i);
                    if (!Number.isNaN(c2) && c2 >= 0xdc00 && c2 <= 0xdfff) {
                        const _p1 = (c & 0x3ff) + 0x40;
                        const _p2 = c2 & 0x3ff;
                        const _b1 = 0xf0 | ((_p1 >> 8) & 0x3f);
                        const _b2 = 0x80 | ((_p1 >> 2) & 0x3f);
                        const _b3 = 0x80 | ((_p1 & 0x3) << 4) | ((_p2 >> 6) & 0xf);
                        const _b4 = 0x80 | (_p2 & 0x3f);
                        this._ensureWrite(this._pos_ + 4);
                        this._u8d_.set([_b1, _b2, _b3, _b4], this._pos_);
                        this._pos_ += 4;
                    }
                }
                else if (c <= 0xffff) {
                    this._ensureWrite(this._pos_ + 3);
                    this._u8d_.set([0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)], this._pos_);
                    this._pos_ += 3;
                }
                else {
                    this._ensureWrite(this._pos_ + 4);
                    this._u8d_.set([0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)], this._pos_);
                    this._pos_ += 4;
                }
            }
        }
        /**
         * <p>将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。</p>
         * <p>对应的读取方法为： getUTFString 。</p>
         * @param	value 要写入的字符串值。
         */
        writeUTFString(value) {
            var tPos = this.pos;
            this.writeUint16(1);
            this.writeUTFBytes(value);
            var dPos = this.pos - tPos - 2;
            //trace("writeLen:",dPos,"pos:",tPos);
            this._d_.setUint16(tPos, dPos, this._xd_);
        }
        /**
         * @private
         * 读取 UTF-8 字符串。
         * @return 读取的字符串。
         */
        readUTFString() {
            //var tPos:int = pos;
            //var len:int = getUint16();
            ////trace("readLen:"+len,"pos,",tPos);
            return this.readUTFBytes(this.getUint16());
        }
        /**
         * <p>从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。</p>
         * <p>对应的写入方法为： writeUTFString 。</p>
         * @return 读取的字符串。
         */
        getUTFString() {
            return this.readUTFString();
        }
        /**
         * @private
         * 读字符串，必须是 writeUTFBytes 方法写入的字符串。
         * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
         * @return 读取的字符串。
         */
        readUTFBytes(len = -1) {
            if (len === 0)
                return "";
            var lastBytes = this.bytesAvailable;
            if (len > lastBytes)
                throw "readUTFBytes error - Out of bounds";
            len = len > 0 ? len : lastBytes;
            return this._rUTF(len);
        }
        /**
         * <p>从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。</p>
         * <p>一般读取的是由 writeUTFBytes 方法写入的字符串。</p>
         * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
         * @return 读取的字符串。
         */
        getUTFBytes(len = -1) {
            return this.readUTFBytes(len);
        }
        /**
         * <p>在字节流中写入一个字节。</p>
         * <p>使用参数的低 8 位。忽略高 24 位。</p>
         * @param	value
         */
        writeByte(value) {
            this._ensureWrite(this._pos_ + 1);
            this._d_.setInt8(this._pos_, value);
            this._pos_ += 1;
        }
        /**
         * <p>从字节流中读取带符号的字节。</p>
         * <p>返回值的范围是从 -128 到 127。</p>
         * @return 介于 -128 和 127 之间的整数。
         */
        readByte() {
            if (this._pos_ + 1 > this._length)
                throw "readByte error - Out of bounds";
            return this._d_.getInt8(this._pos_++);
        }
        /**
         * @private
         * 从字节流中读取带符号的字节。
         */
        getByte() {
            return this.readByte();
        }
        /**
         * @internal
         * <p>保证该字节流的可用长度不小于 <code>lengthToEnsure</code> 参数指定的值。</p>
         * @param	lengthToEnsure	指定的长度。
         */
        _ensureWrite(lengthToEnsure) {
            if (this._length < lengthToEnsure)
                this._length = lengthToEnsure;
            if (this._allocated_ < lengthToEnsure)
                this.length = lengthToEnsure;
        }
        /**
         * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
         * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
         * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
         * @param	arraybuffer	需要写入的 Arraybuffer 对象。
         * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
         * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
         */
        writeArrayBuffer(arraybuffer, offset = 0, length = 0) {
            if (offset < 0 || length < 0)
                throw "writeArrayBuffer error - Out of bounds";
            if (length == 0)
                length = arraybuffer.byteLength - offset;
            this._ensureWrite(this._pos_ + length);
            var uint8array = new Uint8Array(arraybuffer);
            this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
            this._pos_ += length;
        }
        /**
         * 读取ArrayBuffer数据
         * @param	length
         * @return
         */
        readArrayBuffer(length) {
            var rst;
            rst = this._u8d_.buffer.slice(this._pos_, this._pos_ + length);
            this._pos_ = this._pos_ + length;
            return rst;
        }
    }
    /**
     * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
     * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
     * <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
     */
    Byte.BIG_ENDIAN = "bigEndian";
    /**
     * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
     * <p> <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。<br/>
     * <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。</p>
     */
    Byte.LITTLE_ENDIAN = "littleEndian";
    /**@private */
    Byte._sysEndian = null;
    airkit.Byte = Byte;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 字节工具类
     * @author ankye
     * @time 2018-7-7
     */
    function bytes2Uint8Array(data, endian) {
        var bytes = new airkit.Byte(data);
        bytes.endian = endian;
        var body = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos);
        return body;
    }
    airkit.bytes2Uint8Array = bytes2Uint8Array;
    function bytes2String(data, endian) {
        let body = bytes2Uint8Array(data, endian);
        return uint8Array2String(body);
    }
    airkit.bytes2String = bytes2String;
    // Converts a string to an ArrayBuffer.
    function string2ArrayBuffer(s) {
        var buffer = new ArrayBuffer(s.length);
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < s.length; ++i) {
            bytes[i] = s.charCodeAt(i);
        }
        return buffer;
    }
    airkit.string2ArrayBuffer = string2ArrayBuffer;
    function string2Uint8Array(str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array;
    }
    airkit.string2Uint8Array = string2Uint8Array;
    function uint8Array2String(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString;
    }
    airkit.uint8Array2String = uint8Array2String;
})(airkit || (airkit = {}));
// import { Log } from "../log/Log";

(function (airkit) {
    /**
     * 对象工具类
     * @author ankye
     * @time 2018-7-11
     */
    class ClassUtils {
        /**
         * 注册 Class 映射，方便在class反射时获取。
         * @param	className 映射的名字或者别名。
         * @param	classDef 类的全名或者类的引用，全名比如:"cc.Sprite"。
         */
        static regClass(className, classDef) {
            ClassUtils._classMap[className] = classDef;
        }
        /**
         * 根据类名短名字注册类，比如传入[Sprite]，功能同regClass("Sprite",Sprite);
         * @param	classes 类数组
         */
        static regShortClassName(classes) {
            for (var i = 0; i < classes.length; i++) {
                var classDef = classes[i];
                var className = classDef.name;
                ClassUtils._classMap[className] = classDef;
            }
        }
        /**
         * 返回注册的 Class 映射。
         * @param	className 映射的名字。
         */
        static getRegClass(className) {
            return ClassUtils._classMap[className];
        }
        /**
         * 根据名字返回类对象。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return 类对象
         */
        static getClass(className) {
            var classObject = ClassUtils._classMap[className] || ClassUtils._classMap["cc." + className] || className;
            return classObject;
        }
        /**
         * 根据名称创建 Class 实例。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return	返回类的实例。
         */
        static getInstance(className) {
            var compClass = ClassUtils.getClass(className);
            if (compClass)
                return new compClass();
            else
                console.warn("[error] Undefined class:", className);
            return null;
        }
        /**深复制一个对象*/
        static copyObject(obj) {
            let js = JSON.stringify(obj);
            return JSON.parse(js);
        }
        /**获取一个对象里的值*/
        static getObjectValue(obj, key, defVal) {
            if (obj[key]) {
                return obj[key];
            }
            return defVal;
        }
        static callFunc(obj, funcName, args = null) {
            if (funcName == null) {
                return;
            }
            var func = obj[funcName];
            let result = null;
            if (func) {
                if (args == null) {
                    result = func.apply(obj);
                }
                else {
                    result = func.apply(obj, args);
                }
            }
            else {
                airkit.Log.error("cant find funcName {0} from Module:{1}", funcName, obj.name);
            }
            return result;
        }
        static classKey(obj) {
            let proto = Object.getPrototypeOf(obj);
            let clazz = proto["constructor"];
            let sign = clazz["objectKey"];
            return sign;
        }
    }
    /**@private */
    ClassUtils._classMap = {};
    airkit.ClassUtils = ClassUtils;
})(airkit || (airkit = {}));
// import { StringUtils } from "./StringUtils";

(function (airkit) {
    /**
     * 时间
     * @author ankye
     * @time 2018-7-11
     */
    class DateUtils {
        static setServerTime(time) {
            this.serverTime = time;
            this.serverTimeDiff = Date.now() - time;
        }
        /**获取UNIX时间 */
        static getNow() {
            let now = Math.floor((Date.now() - this.serverTimeDiff) / 1000);
            return now;
        }
        static getNowMS() {
            return Date.now() - this.serverTimeDiff;
        }
        static isTheSameMonth(nTime, nSecond) {
            let now = DateUtils.getNow();
            let curTime = now - nSecond;
            let date = new Date(curTime * 1000);
            let defineDate = new Date(date.getFullYear(), date.getMonth(), 1);
            let nextTime = Math.floor(defineDate.getTime() / 1000) + nSecond;
            return nTime >= nextTime;
        }
        static isTheSameDayByNow(nTime, nSecond) {
            let date = new Date();
            let offset = date.getTimezoneOffset() * 60;
            let now = DateUtils.getNow();
            let day1 = (nTime - offset - nSecond) / 86400;
            let day2 = (now - offset - nSecond) / 86400;
            if (Math.floor(day1) === Math.floor(day2)) {
                return true;
            }
            return false;
        }
        /**计算从nTime1到nTime2过去了多少天*/
        static passedDays(nTime1, nTime2, nSecondOffset = 0) {
            let date = new Date();
            let offset = date.getTimezoneOffset() * 60;
            let day1 = (nTime1 - offset - nSecondOffset) / 86400;
            let day2 = (nTime2 - offset - nSecondOffset) / 86400;
            return Math.floor(day2) - Math.floor(day1);
        }
        static currentYMDHMS() {
            return this.formatDateTime(this.getNowMS());
        }
        static currentHour() {
            var date = new Date(this.getNowMS());
            return date.getHours();
        }
        //时间戳转换日期 (yyyy-MM-dd HH:mm:ss)
        static formatDateTime(timeValue) {
            var date = new Date(timeValue);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var M = m < 10 ? "0" + m : m;
            var d = date.getDate();
            var D = d < 10 ? "0" + d : d;
            var h = date.getHours();
            var H = h < 10 ? "0" + h : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var minut = minute < 10 ? "0" + minute : minute;
            var secon = second < 10 ? "0" + second : second;
            return y + "-" + M + "-" + D + " " + H + ":" + minut + ":" + secon;
        }
        //返回时:分:秒
        static countdown(time, format = "D天H时M分S秒") {
            let s = Math.max(0, time / 1000);
            let d = Math.floor(s / 24 / 3600);
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            let f = format.replace(/D/, d.toString());
            f = f.replace(/H/, h.toString());
            f = f.replace(/M/, m.toString());
            f = f.replace(/S/, s.toString());
            return f;
        }
        static formatTime(time, format = "{0}:{1}:{2}") {
            let s = Math.max(0, time);
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            return airkit.StringUtils.format(format, h < 10 ? "0" + h : h, m < 10 ? "0" + m : m, s < 10 ? "0" + s : s);
        }
        static format2Time(time) {
            let format = "{0}:{1}";
            let s = Math.max(0, time);
            let d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return airkit.StringUtils.format("{0}天", d);
            }
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            let M = m < 10 ? "0" + m : m;
            let H = h < 10 ? "0" + h : h;
            let S = s < 10 ? "0" + s : s;
            if (h > 0) {
                return airkit.StringUtils.format(format, H, M);
            }
            else {
                format = format.replace(":", "’");
                return airkit.StringUtils.format(format, M, S);
            }
        }
        static format2Time2(time) {
            let format = "{0}:{1}";
            let s = Math.max(0, time);
            let d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return airkit.StringUtils.format("{0}天", d);
            }
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            let M = m < 10 ? "0" + m : m;
            let H = h < 10 ? "0" + h : h;
            let S = s < 10 ? "0" + s : s;
            if (h > 0) {
                return airkit.StringUtils.format(format, H, M);
            }
            else {
                format = format.replace(":", "’");
                return airkit.StringUtils.format(format, M, S);
            }
        }
    }
    /**服务器时间*/
    DateUtils.serverTimeDiff = 0;
    DateUtils.serverTime = 0;
    airkit.DateUtils = DateUtils;
})(airkit || (airkit = {}));
/**
 * 字典工具类
 * @author ankye
 * @time 2018-7-6
 */

(function (airkit) {
    class DicUtils {
        /**
         * 键列表
         */
        static getKeys(d) {
            let a = [];
            for (let key in d) {
                a.push(key);
            }
            return a;
        }
        /**
         * 值列表
         */
        static getValues(d) {
            let a = [];
            for (let key in d) {
                a.push(d[key]);
            }
            return a;
        }
        /**
         * 清空字典
         */
        static clearDic(dic) {
            let v;
            for (let key in dic) {
                v = dic[key];
                if (v instanceof Object) {
                    DicUtils.clearDic(v);
                }
                delete dic[key];
            }
        }
        /**
         * 全部应用
         */
        static foreach(dic, compareFn) {
            for (let key in dic) {
                if (!compareFn.call(null, key, dic[key]))
                    break;
            }
        }
        static isEmpty(dic) {
            if (dic == null)
                return true;
            for (let key in dic) {
                return false;
            }
            return true;
        }
        static getLength(dic) {
            if (dic == null)
                return 0;
            let count = 0;
            for (let key in dic) {
                ++count;
            }
            return count;
        }
        static assign(obj, dic) {
            Object.assign(obj, dic);
        }
    }
    airkit.DicUtils = DicUtils;
})(airkit || (airkit = {}));
// import { TweenUtils } from "./TweenUtils";
// import { Log } from "../log/Log";
// import { IUIPanel } from "../scene/IUIPanel";

(function (airkit) {
    function displayWidth() {
        return cc.winSize.width;
    }
    airkit.displayWidth = displayWidth;
    function displayHeight() {
        return cc.winSize.height;
    }
    airkit.displayHeight = displayHeight;
    /**
     * 显示对象
     * @author ankye
     * @time 2018-7-13
     */
    class DisplayUtils {
        /**
         * 移除全部子对象
         */
        static removeAllChild(container) {
            if (!container)
                return;
            if (container.numChildren <= 0)
                return;
            while (container.numChildren > 0) {
                let node = container.removeChildAt(0);
                if (node) {
                    let cons = node["constructor"];
                    if (cons["name"] == "Animation") {
                        let ani = node;
                        ani.clear();
                        ani.destroy(true);
                        ani = null;
                    }
                    else {
                        node.removeFromParent();
                        node.dispose();
                    }
                    cons = null;
                }
                node = null;
            }
        }
        // /**获得子节点*/
        // public static getChildByName(parent: laya.display.Node, name: string): laya.display.Node {
        // 	if (!parent) return null
        // 	if (parent.name === name) return parent
        // 	let child: laya.display.Node = null
        // 	let num: number = parent.numChildren
        // 	for (let i = 0; i < num; ++i) {
        // 		child = DisplayUtils.getChildByName(parent.getChildAt(i), name)
        // 		if (child) return child
        // 	}
        // 	return null
        // }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～滤镜～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**
         * 创建发光滤镜
         * @param	color	滤镜的颜色
         * @param	blur	边缘模糊的大小
         * @param	offX	X轴方向的偏移
         * @param	offY	Y轴方向的偏移
         */
        // public static getGlowFilter(color: string, blur?: number, offX?: number, offY?: number): Laya.GlowFilter[] {
        // 	let glow = new Laya.GlowFilter(color, blur, offX, offY)
        // 	return [glow]
        // }
        /**
         * 模糊滤镜
         * @param	strength	模糊滤镜的强度值
         */
        // public static getBlurFilter(strength?: number): Laya.BlurFilter[] {
        // 	let blur = new Laya.BlurFilter(strength)
        // 	return [blur]
        // }
        /**
         * 创建一个 <code>ColorFilter</code> 实例。
         * @param mat	（可选）由 20 个项目（排列成 4 x 5 矩阵）组成的数组，用于颜色转换。
         */
        // public static getColorFilter(mat?: Array<any>): Laya.ColorFilter[] {
        // 	let color = new Laya.ColorFilter(mat)
        // 	return [color]
        // }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～UI组件～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**
         * 创建一个背景层
         */
        static colorBG(color, w, h) {
            let bgSp = new fgui.GGraph();
            bgSp.drawRect(1, color, color);
            bgSp.setSize(w, h);
            bgSp.alpha = 0.7;
            return bgSp;
        }
        static popupDown(panel, handler, ignoreAnchor) {
            panel.scale(0.8, 0.8);
            let x = displayWidth() >> 1;
            let y = displayHeight() >> 1;
            if (ignoreAnchor == null || !ignoreAnchor) {
                panel.anchorX = 0.5;
                panel.anchorY = 0.5;
            }
            else {
                x = panel.x;
                y = panel.y;
            }
            panel.pos(x, 0);
            let time = 500;
            airkit.TweenUtils.get(panel).to({ scaleX: 1, scaleY: 1, x: x, y: y }, time, fgui.EaseType.BackOut, handler);
            if (panel.parent && panel.parent.bg) {
                panel.parent.bg.alpha = 0;
                airkit.TweenUtils.get(panel.parent.bg).to({ alpha: 1.0 }, time, fgui.EaseType.QuadOut);
            }
        }
        static popup(view, handler, ignoreAnchor) {
            view.setScale(0.85, 0.85);
            let x = displayWidth() >> 1;
            let y = displayHeight() >> 1;
            if (ignoreAnchor == null || !ignoreAnchor) {
                view.setPivot(0.5, 0.5, true);
            }
            else {
                x = view.x;
                y = view.y;
            }
            view.setPosition(x, y);
            let time = 0.25;
            airkit.TweenUtils.get(view).to({ scaleX: 1, scaleY: 1 }, time, fgui.EaseType.QuadOut, handler);
            if (view.parent && view.parent.getChild("bg")) {
                let bg = view.parent.getChild("bg");
                bg.alpha = 0;
                airkit.TweenUtils.get(bg).to({ alpha: 1.0 }, 0.25, fgui.EaseType.QuadOut);
            }
        }
        static hide(panel, handler) {
            // let time = 0.2;
            // let view = panel.panel();
            // let bg = panel.bg();
            // if (view == null) {
            //   if (handler) {
            //     handler.run();
            //   }
            // } else {
            //   TweenUtils.get(view).to(
            //     { scaleX: 0.5, scaleY: 0.5 },
            //     time,
            //     fgui.EaseType.BackIn,
            //     handler
            //   );
            //   if (bg) {
            //     TweenUtils.get(bg).to({ alpha: 0 }, 0.2, fgui.EaseType.QuadOut);
            //   }
            // }
        }
    }
    airkit.DisplayUtils = DisplayUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * <p><code>Handler</code> 是事件处理器类。</p>
     * <p>推荐使用 Handler.create() 方法从对象池创建，减少对象创建消耗。创建的 Handler 对象不再使用后，可以使用 Handler.recover() 将其回收到对象池，回收后不要再使用此对象，否则会导致不可预料的错误。</p>
     * <p><b>注意：</b>由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。</p>
     */
    class Handler {
        /**
         * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
         * @param	caller 执行域。
         * @param	method 处理函数。
         * @param	args 函数参数。
         * @param	once 是否只执行一次。
         */
        constructor(caller = null, method = null, args = null, once = false) {
            /** 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
            this.once = false;
            /**@private */
            this._id = 0;
            this.setTo(caller, method, args, once);
        }
        /**
         * 设置此对象的指定属性值。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，执行后执行recover()进行回收。
         * @return  返回 handler 本身。
         */
        setTo(caller, method, args, once = false) {
            this._id = Handler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
            return this;
        }
        /**
         * 执行处理器。
         */
        run() {
            if (this.method == null)
                return null;
            var id = this._id;
            var result = this.method.apply(this.caller, this.args);
            this._id === id && this.once && this.recover();
            return result;
        }
        /**
         * 执行处理器，并携带额外数据。
         * @param	data 附加的回调数据，可以是单数据或者Array(作为多参)。
         */
        runWith(data) {
            if (this.method == null)
                return null;
            var id = this._id;
            if (data == null)
                var result = this.method.apply(this.caller, this.args);
            else if (!this.args && !data.unshift)
                result = this.method.call(this.caller, data);
            else if (this.args)
                result = this.method.apply(this.caller, this.args.concat(data));
            else
                result = this.method.apply(this.caller, data);
            this._id === id && this.once && this.recover();
            return result;
        }
        /**
         * 清理对象引用。
         */
        clear() {
            this.caller = null;
            this.method = null;
            this.args = null;
            return this;
        }
        /**
         * 清理并回收到 Handler 对象池内。
         */
        recover() {
            if (this._id > 0) {
                this._id = 0;
                Handler._pool.push(this.clear());
            }
        }
        /**
         * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
         * @return  返回创建的handler实例。
         */
        static create(caller, method, args = null, once = true) {
            if (Handler._pool.length)
                return Handler._pool.pop().setTo(caller, method, args, once);
            return new Handler(caller, method, args, once);
        }
    }
    /**@private handler对象池*/
    Handler._pool = [];
    /**@private */
    Handler._gid = 1;
    airkit.Handler = Handler;
})(airkit || (airkit = {}));
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

(function (airkit) {
    let OrbitType;
    (function (OrbitType) {
        OrbitType[OrbitType["Line"] = 3] = "Line";
        OrbitType[OrbitType["Curve"] = 2] = "Curve";
    })(OrbitType = airkit.OrbitType || (airkit.OrbitType = {}));
    class MathUtils {
        static sign(n) {
            n = +n;
            if (n === 0 || isNaN(n)) {
                return n;
            }
            return n > 0 ? 1 : -1;
        }
        /**
         * 限制范围
         */
        static clamp(n, min, max) {
            if (min > max) {
                let i = min;
                min = max;
                max = i;
            }
            return n < min ? min : n > max ? max : n;
        }
        static clamp01(value) {
            if (value < 0)
                return 0;
            if (value > 1)
                return 1;
            return value;
        }
        static lerp(from, to, t) {
            return from + (to - from) * MathUtils.clamp01(t);
        }
        static lerpAngle(a, b, t) {
            let num = MathUtils.repeat(b - a, 360);
            if (num > 180)
                num -= 360;
            return a + num * MathUtils.clamp01(t);
        }
        static repeat(t, length) {
            return t - Math.floor(t / length) * length;
        }
        /**
         * 产生随机数
         * 结果：x>=param1 && x<param2
         */
        static randRange(param1, param2) {
            let loc = Math.random() * (param2 - param1) + param1;
            return loc;
        }
        /**
         * 产生随机数
         * 结果：x>=param1 && x<=param2
         */
        static randRange_Int(param1, param2) {
            let loc = Math.random() * (param2 - param1 + 1) + param1;
            return Math.floor(loc);
        }
        /**
         * 从数组中产生随机数[-1,1,2]
         * 结果：-1/1/2中的一个
         */
        static randRange_Array(arr) {
            if (arr.length == 0)
                return null;
            let loc = arr[MathUtils.randRange_Int(0, arr.length - 1)];
            return loc;
        }
        /**
         * 转换为360度角度
         */
        static clampDegrees(degrees) {
            while (degrees < 0)
                degrees = degrees + 360;
            while (degrees >= 360)
                degrees = degrees - 360;
            return degrees;
        }
        /**
         * 转换为360度弧度
         */
        static clampRadians(radians) {
            while (radians < 0)
                radians = radians + 2 * Math.PI;
            while (radians >= 2 * Math.PI)
                radians = radians - 2 * Math.PI;
            return radians;
        }
        /**
         * 两点间的距离
         */
        static getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
        }
        static getSquareDistance(x1, y1, x2, y2) {
            return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2);
        }
        /**
         * 两点间的弧度：x正方形为0，Y轴向下,顺时针为正
         */
        static getLineRadians(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
        static getLineDegree(x1, y1, x2, y2) {
            let degree = MathUtils.toDegree(MathUtils.getLineRadians(x1, y1, x2, y2));
            return MathUtils.clampDegrees(degree);
        }
        static getPointRadians(x, y) {
            return Math.atan2(y, x);
        }
        static getPointDegree(x, y) {
            let degree = MathUtils.toDegree(MathUtils.getPointRadians(x, y));
            return MathUtils.clampDegrees(degree);
        }
        // /**
        //  * 弧度转向量
        //  * @param 	radians 	弧度
        //  */
        // public static GetLineFromRadians(radians:number):Vector2
        // {
        // 	let x:number = Math.cos(radians)
        // 	let y:number = Math.sin(radians)
        // 	let dir:Vector2 = new Vector2(x, y)
        // 	Vec2Normal(dir)
        // 	return dir
        // }
        /**
         * 弧度转化为度
         */
        static toDegree(radian) {
            return radian * (180.0 / Math.PI);
        }
        /**
         * 度转化为弧度
         */
        static toRadian(degree) {
            return degree * (Math.PI / 180.0);
        }
        static moveTowards(current, target, maxDelta) {
            if (Math.abs(target - current) <= maxDelta) {
                return target;
            }
            return current + MathUtils.sign(target - current) * maxDelta;
        }
        //求两点的夹角（弧度）
        static radians4point(ax, ay, bx, by) {
            return Math.atan2(ay - by, bx - ax);
        }
        // 求圆上一个点的位置
        static pointAtCircle(px, py, radians, radius) {
            return new cc.Vec2(px + Math.cos(radians) * radius, py - Math.sin(radians) * radius);
        }
        /**
         * 根据位置数组，轨迹类型和时间进度来返回对应的位置
         * @param pts 位置数组
         * @param t 时间进度[0,1]
         * @param type Line:多点折线移动,Curve:贝塞尔曲线移动
         */
        static getPos(pts, t, type) {
            if (pts.length == 0)
                return null;
            if (pts.length == 1)
                return pts[0];
            t = Math.min(t, 1); //限定时间值范围,最大为1
            let target = new cc.Vec2();
            let count = pts.length;
            if (type == OrbitType.Line) {
                let unitTime = 1 / (count - 1); //每两个顶点之间直线所用的时间
                let index = Math.floor(t / unitTime);
                if (index + 1 < count) {
                    let start = pts[index];
                    let end = pts[index + 1];
                    let time = (t - index * unitTime) / unitTime; //每两点之间曲线移动时间[0,1]
                    target.x = start.x + (end.x - start.x) * time;
                    target.y = start.y + (end.y - start.y) * time;
                }
                else {
                    target.x = pts[pts.length - 1].x;
                    target.y = pts[pts.length - 1].y;
                }
            }
            else if (type == OrbitType.Curve) {
                target = this.getBezierat(pts, t);
            }
            return target;
        }
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
        static getRotation(startX, startY, endX, endY) {
            let deltaX = endX - startX;
            let deltaY = endY - startY;
            let angle = (Math.atan(deltaY / deltaX) * 180) / Math.PI;
            if (deltaX >= 0) {
                angle += 90;
            }
            else {
                angle += 270;
            }
            return angle;
        }
        /**
         * 根据顶点数组来生成贝塞尔曲线(只支持二阶和三阶)，根据t返回对应的曲线位置
         * @param pts 顶点数组：第一个和最后一个点是曲线轨迹的起点和终点，其他点都是控制点，曲线不会经过这些点
         * @param t 整个轨迹的时间[0-1]
         */
        static getBezierat(pts, t) {
            let target = new cc.Vec2();
            if (pts.length == 3) {
                //二阶贝塞尔
                target.x = Math.pow(1 - t, 2) * pts[0].x + 2 * t * (1 - t) * pts[1].x + Math.pow(t, 2) * pts[2].x;
                target.y = Math.pow(1 - t, 2) * pts[0].y + 2 * t * (1 - t) * pts[1].y + Math.pow(t, 2) * pts[2].y;
            }
            else if (pts.length == 4) {
                //三阶贝塞尔
                target.x =
                    Math.pow(1 - t, 3) * pts[0].x +
                        3 * t * Math.pow(1 - t, 2) * pts[1].x +
                        3 * Math.pow(t, 2) * (1 - t) * pts[2].x +
                        Math.pow(t, 3) * pts[3].x;
                target.y =
                    Math.pow(1 - t, 3) * pts[0].y +
                        3 * t * Math.pow(1 - t, 2) * pts[1].y +
                        3 * Math.pow(t, 2) * (1 - t) * pts[2].y +
                        Math.pow(t, 3) * pts[3].y;
            }
            return target;
        }
        /**
         * 根据旋转角度返回二维方向向量(单位化过)
         * @param angle
         */
        static getDirection(angle) {
            let dir = new cc.Vec2();
            if (angle == 0 || angle == 180) {
                dir.x = 0;
                dir.y = angle == 0 ? -1 : 1;
            }
            else if (angle == 90 || angle == 270) {
                dir.y = 0;
                dir.x = angle == 90 ? 1 : -1;
            }
            else {
                let idx = Math.floor(angle / 90);
                let rad = ((90 - angle) * Math.PI) / 180;
                if (idx == 0 || idx == 1)
                    dir.x = 1;
                else
                    dir.x = -1;
                if (idx == 1 || idx == 2) {
                    dir.y = Math.abs(Math.tan(rad));
                }
                else {
                    dir.y = -Math.abs(Math.tan(rad));
                }
                dir = this.normalize(dir);
            }
            return dir;
        }
        /**
         * 单位化向量
         * @param vec
         */
        static normalize(vec) {
            let k = vec.y / vec.x;
            let x = Math.sqrt(1 / (k * k + 1));
            let y = Math.abs(k * x);
            vec.x = vec.x > 0 ? x : -x;
            vec.y = vec.y > 0 ? y : -y;
            return vec;
        }
        /**
         * 求两点之间的距离长度
         */
        static distance(startX, startY, endX, endY) {
            return Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
        }
        /**
         * 根据起始和终点连线方向，计算垂直于其的向量和连线中心点的位置，通过raise来调整远近，越远贝塞尔曲线计算的曲线越弯
         *  @param start 起始点坐标
         *  @param end   终点坐标
         *  @param raise 调整离中心点远近
         *
         */
        static getVerticalVector(start, end, raise) {
            let dir = new cc.Vec2();
            dir.x = end.x - start.x;
            dir.y = end.y - start.y;
            dir.normalize();
            let vertial = new cc.Vec2();
            vertial.x = 1;
            vertial.y = -dir.x / dir.y;
            let target = new cc.Vec2();
            target.x = (start.x + end.x) / 2 + vertial.x * raise;
            target.y = (start.y + end.y) / 2 + vertial.y * raise;
            return target;
        }
        /**
         * 根据起始点和终点获得控制点
         *
         * @param start 起始点坐标
         * @param end 终点坐标
         * @param raise 控制弯曲度,越大越弯曲
         * @param xOffset 控制弯曲X方向偏移量
         * @param yOffset 控制弯曲Y方向偏移量
         */
        static getCtrlPoint(start, end, raise = 100, xOffset = 50, yOffset = 50) {
            let ctrlPoint = this.getVerticalVector(start, end, raise);
            ctrlPoint.x += xOffset;
            ctrlPoint.y += yOffset;
            return ctrlPoint;
        }
        static getDefaultPoints(start, end, xOffset = 150, yOffset = 150, raise = 150) {
            if (start.x > airkit.displayWidth() / 2) {
                xOffset = -xOffset;
            }
            if (start.y > end.y) {
                yOffset = -yOffset;
            }
            let ctrlPt1 = this.getCtrlPoint(start, end, raise, xOffset, yOffset);
            return [start, ctrlPt1, end];
        }
    }
    /**字节转换M*/
    MathUtils.BYTE_TO_M = 1 / (1024 * 1024);
    /**字节转换K*/
    MathUtils.BYTE_TO_K = 1 / 1024;
    MathUtils.Deg2Rad = 0.01745329;
    MathUtils.Rad2Deg = 57.29578;
    MathUtils.Cycle8Points = [
        [-200, 0],
        [-127, -74],
        [0, -100],
        [127, -74],
        [200, 0],
        [127, 74],
        [0, 100],
        [-127, 74],
    ];
    MathUtils.Cycle9Points = [
        [0, 0],
        [-200, 0],
        [-127, -74],
        [0, -100],
        [127, -74],
        [200, 0],
        [127, 74],
        [0, 100],
        [-127, 74],
    ];
    airkit.MathUtils = MathUtils;
})(airkit || (airkit = {}));
// import { StringUtils } from "./StringUtils";

(function (airkit) {
    /**
     * 字符串
     * @author ankye
     * @time 2018-7-8
     */
    class NumberUtils {
        /**
         * 保留小数点后几位
         */
        static toFixed(value, p) {
            return airkit.StringUtils.toNumber(value.toFixed(p));
        }
        static toInt(value) {
            return Math.floor(value);
        }
        static isInt(value) {
            return Math.ceil(value) != value ? false : true;
        }
        /**
         * 保留有效数值
         */
        static reserveNumber(num, size) {
            let str = String(num);
            let l = str.length;
            let p_index = str.indexOf(".");
            if (p_index < 0) {
                return num;
            }
            let ret = str.slice(0, p_index + 1);
            let lastNum = l - p_index;
            if (lastNum > size) {
                lastNum = size;
            }
            let lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
            return airkit.StringUtils.toNumber(ret + lastStr);
        }
        /**
         * 保留有效数值，不够补0；注意返回的是字符串
         */
        static reserveNumberWithZero(num, size) {
            let str = String(num);
            let l = str.length;
            let p_index = str.indexOf(".");
            if (p_index < 0) {
                //是整数
                str += ".";
                for (let i = 0; i < size; ++i)
                    str += "0";
                return str;
            }
            let ret = str.slice(0, p_index + 1);
            let lastNum = l - p_index - 1;
            if (lastNum > size) {
                //超过
                lastNum = size;
                let lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
                return ret + lastStr;
            }
            else if (lastNum < size) {
                //不足补0
                let diff = size - lastNum;
                for (let i = 0; i < diff; ++i)
                    str += "0";
                return str;
            }
            else {
                return str;
            }
        }
    }
    airkit.NumberUtils = NumberUtils;
})(airkit || (airkit = {}));
/**
 * 字符串
 * @author ankye
 * @time 2018-7-8
 */

(function (airkit) {
    class StringUtils {
        static get empty() {
            return "";
        }
        /**
         * 字符串是否有值
         */
        static isNullOrEmpty(s) {
            return s != null && s.length > 0 ? false : true;
        }
        static toInt(str) {
            if (!str || str.length == 0)
                return 0;
            return parseInt(str);
        }
        static toNumber(str) {
            if (!str || str.length == 0)
                return 0;
            return parseFloat(str);
        }
        static stringCut(str, len, fill = "...") {
            var result = str;
            if (str.length > len) {
                result = str.substr(0, len) + fill;
            }
            return result;
        }
        /**
         * 获取字符串真实长度,注：
         * 1.普通数组，字符占1字节；汉子占两个字节
         * 2.如果变成编码，可能计算接口不对
         */
        static getNumBytes(str) {
            let realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLength += 1;
                else
                    realLength += 2;
            }
            return realLength;
        }
        /**
         * 补零
         * @param str
         * @param len
         * @param dir 0-后；1-前
         * @return
         */
        static addZero(str, len, dir = 0) {
            let _str = "";
            let _len = str.length;
            let str_pre_zero = "";
            let str_end_zero = "";
            if (dir == 0)
                str_end_zero = "0";
            else
                str_pre_zero = "0";
            if (_len < len) {
                let i = 0;
                while (i < len - _len) {
                    _str = str_pre_zero + _str + str_end_zero;
                    ++i;
                }
                return _str + str;
            }
            return str;
        }
        /**
         * Checks if the given argument is a string.
         * @function
         */
        static isString(obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        }
        /**
         * 去除左右空格
         * @param input
         * @return
         */
        static trim(input) {
            if (input == null) {
                return "";
            }
            return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
        }
        /**
         * 去除左侧空格
         * @param input
         * @return
         */
        static trimLeft(input) {
            if (input == null) {
                return "";
            }
            return input.replace(/^\s+""^\s+/, "");
        }
        /**
         * 去除右侧空格
         * @param input
         * @return
         */
        static trimRight(input) {
            if (input == null) {
                return "";
            }
            return input.replace(/\s+$""\s+$/, "");
        }
        /**
         * 分钟与秒格式(如-> 40:15)
         * @param seconds 秒数
         * @return
         */
        static minuteFormat(seconds) {
            let min = Math.floor(seconds / 60);
            let sec = Math.floor(seconds % 60);
            let min_str = min < 10 ? "0" + min.toString() : min.toString();
            let sec_str = sec < 10 ? "0" + sec.toString() : sec.toString();
            return min_str + ":" + sec_str;
        }
        /**
         * 时分秒格式(如-> 05:32:20)
         * @param seconds(秒)
         * @return
         */
        static hourFormat(seconds) {
            let hour = Math.floor(seconds / 3600);
            let hour_str = hour < 10 ? "0" + hour.toString() : hour.toString();
            return hour_str + ":" + StringUtils.minuteFormat(seconds % 3600);
        }
        /**
         * 格式化字符串
         * @param str 需要格式化的字符串，【"杰卫，这里有{0}个苹果，和{1}个香蕉！", 5,10】
         * @param args 参数列表
         */
        static format(str, ...args) {
            for (let i = 0; i < args.length; i++) {
                str = str.replace(new RegExp("\\{" + i + "\\}", "gm"), args[i]);
            }
            return str;
        }
        static formatWithDic(str, dic) {
            for (let key in dic) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gm"), dic[key]);
            }
            return str;
        }
        /**
         * 以指定字符开始
         */
        static beginsWith(input, prefix) {
            return prefix == input.substring(0, prefix.length);
        }
        /**
         * 以指定字符结束
         */
        static endsWith(input, suffix) {
            return suffix == input.substring(input.length - suffix.length);
        }
        /**guid*/
        static getGUIDString() {
            let d = Date.now();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            });
        }
    }
    airkit.StringUtils = StringUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    class TouchUtils {
    }
    airkit.TouchUtils = TouchUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    /*
     * @author ankye
     * 连续动画
     */
    class TweenUtils {
        constructor(target) {
            this._target = target;
            this.clear();
        }
        static get(target) {
            return new TweenUtils(target);
        }
        get target() {
            return this._target;
        }
        setOnUpdate(callback) {
            this._updateFunc = callback;
        }
        onUpdate(gt) {
            if (this._updateFunc) {
                this._updateFunc(gt);
            }
        }
        /**
         * 缓动对象的props属性到目标值。
         * @param	target 目标对象(即将更改属性值的对象)。
         * @param	props 变化的属性列表，比如
         * @param	duration 花费的时间，单位秒。
         * @param	ease 缓动类型，默认为匀速运动。
         * @param	complete 结束回调函数。
         * @param	delay 延迟执行时间。
         */
        to(props, duration, ease = fgui.EaseType.QuadOut, complete = null, delay = 0) {
            this._steps.push({ props, duration, ease, complete, delay });
            this.trigger();
            return this;
        }
        delay(delay) {
            this._steps.push({ delay });
            return this;
        }
        trigger() {
            if (!this._isPlaying) {
                if (this._steps && this._steps.length) {
                    var step = this._steps.shift();
                    if (step.hasOwnProperty("props")) {
                        this._isPlaying = true;
                        // Laya.Tween.to(this._target, step.props, step.duration, step.ease, step.complete, step.delay, step.coverBefore, step.autoRecover)
                        if (step.props["x"] != null || step.props["y"] != null) {
                            let x = step.props["x"] != null ? step.props.x : this._target.x;
                            let y = step.props["y"] != null ? step.props.y : this._target.y;
                            fgui.GTween.to2(this._target.x, this._target.y, x, y, step.duration)
                                .setTarget(this._target, this._target.setPosition)
                                .setEase(step.ease);
                        }
                        if (step.props["scaleX"] != null || step.props["scaleY"] != null) {
                            let x = step.props["scaleX"] != null ? step.props.scaleX : this._target.scaleX;
                            let y = step.props["scaleY"] != null ? step.props.scaleY : this._target.scaleY;
                            fgui.GTween.to2(this._target.scaleX, this._target.scaleY, x, y, step.duration)
                                .setTarget(this._target, this._target.setScale)
                                .setEase(step.ease);
                        }
                        if (step.props["rotation"] != null) {
                            let rotation = step.props["rotation"] != null ? step.props.rotation : this._target.rotation;
                            fgui.GTween.to(this._target.rotation, rotation, step.duration).setTarget(this._target, "rotation").setEase(step.ease);
                        }
                        if (step.props["alpha"] != null) {
                            if (step.props.pts) {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate((gt) => {
                                    let point = airkit.MathUtils.getPos(step.props.pts, gt.normalizedTime, airkit.OrbitType.Curve);
                                    this._target.setPosition(point.x, point.y);
                                    this.onUpdate(gt);
                                }, null);
                            }
                            else {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate((gt) => {
                                    this.onUpdate(gt);
                                }, null);
                            }
                        }
                        airkit.TimerManager.Instance.addOnce((step.duration + step.delay) * 1000, this, this.onStepComplete, [step.complete]);
                    }
                    else if (step.hasOwnProperty("delay")) {
                        this._isPlaying = true;
                        airkit.TimerManager.Instance.addOnce(step.delay * 1000, this, this.onStepComplete, [step.complete]);
                    }
                }
            }
        }
        onStepComplete(onFunc) {
            if (onFunc) {
                onFunc.runWith();
            }
            this._isPlaying = false;
            this.trigger();
        }
        clear() {
            this._steps = [];
            this._isPlaying = false;
            fgui.GTween.kill(this._target);
        }
        static scale(view) {
            this.get(view).to({ scaleX: 0.8, scaleY: 0.8 }, 0.05, fgui.EaseType.QuadIn).to({ scaleX: 1.0, scaleY: 1.0 }, 0.05, fgui.EaseType.QuadIn);
        }
        static appear(view) {
            view.setScale(0, 0);
            this.get(view).to({ scaleX: 1.2, scaleY: 1.2 }, 0.4, fgui.EaseType.QuadOut).to({ scaleX: 1.0, scaleY: 1.0 }, 0.2, fgui.EaseType.QuadOut);
        }
    }
    TweenUtils.EaseBezier = 9999;
    airkit.TweenUtils = TweenUtils;
})(airkit || (airkit = {}));
// import { StringUtils } from "./StringUtils";

(function (airkit) {
    /**
     * url工具类
     * @author ankye
     * @time 2018-7-16
     */
    class UrlUtils {
        /**获取文件扩展名*/
        static getFileExte(url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            let idx = url.lastIndexOf(".");
            if (idx >= 0) {
                return url.substr(idx + 1);
            }
            return airkit.StringUtils.empty;
        }
        /**获取不含扩展名的路径*/
        static getPathWithNoExtend(url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            let idx = url.lastIndexOf(".");
            if (idx >= 0) {
                return url.substr(0, idx);
            }
            return airkit.StringUtils.empty;
        }
    }
    airkit.UrlUtils = UrlUtils;
})(airkit || (airkit = {}));
// import { SDictionary } from "../collection/Dictionary";
// import { Log } from "../log/Log";
// import { NumberUtils } from "./NumberUtils";

(function (airkit) {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */
    class Utils {
        /**打开外部链接，如https://ask.laya.ui.Box.com/xxx*/
        static openURL(url) {
            window.location.href = url;
        }
        /**获取当前地址栏参数*/
        static getLocationParams() {
            let url = window.location.href;
            let dic = new airkit.SDictionary();
            let num = url.indexOf("?");
            if (num >= 0) {
                url = url.substr(num + 1);
                let key, value;
                let arr = url.split("&");
                for (let i in arr) {
                    let str = arr[i];
                    num = str.indexOf("=");
                    key = str.substr(0, num);
                    value = str.substr(num + 1);
                    dic.add(key, value);
                }
            }
            return dic;
        }
        /**
         * object转成查询字符串
         * @param obj
         * @returns {string}
         */
        static obj2query(obj) {
            if (!obj) {
                return "";
            }
            var arr = [];
            for (var key in obj) {
                arr.push(key + "=" + obj[key]);
            }
            return arr.join("&");
        }
        static injectProp(target, data = null, callback = null, ignoreMethod = true, ignoreNull = true, keyBefore = "") {
            if (!data) {
                return false;
            }
            let result = true;
            for (let key in data) {
                let value = data[key];
                if ((!ignoreMethod || typeof value != "function") && (!ignoreNull || value != null)) {
                    if (callback) {
                        callback(target, key, value);
                    }
                    else {
                        target[key] = value;
                    }
                }
            }
            return result;
        }
    }
    /**
     * 将字符串解析成 XML 对象。
     * @param value 需要解析的字符串。
     * @return js原生的XML对象。
     */
    Utils.parseXMLFromString = function (value) {
        var rst;
        value = value.replace(/>\s+</g, "><");
        rst = new DOMParser().parseFromString(value, "text/xml");
        if (rst.firstChild.textContent.indexOf("This page contains the following errors") > -1) {
            throw new Error(rst.firstChild.firstChild.textContent);
        }
        return rst;
    };
    airkit.Utils = Utils;
    /**
     * 位操作
     */
    class FlagUtils {
        static hasFlag(a, b) {
            a = airkit.NumberUtils.toInt(a);
            b = airkit.NumberUtils.toInt(b);
            return (a & b) == 0 ? false : true;
        }
        static insertFlag(a, b) {
            a = airkit.NumberUtils.toInt(a);
            b = airkit.NumberUtils.toInt(b);
            a |= b;
            return a;
        }
        static removeFlag(a, b) {
            a = airkit.NumberUtils.toInt(a);
            b = airkit.NumberUtils.toInt(b);
            a ^= b;
            return a;
        }
    }
    airkit.FlagUtils = FlagUtils;
    /**
     * 断言
     */
    function assert(condition, msg) {
        if (!condition) {
            throw msg || "assert";
        }
    }
    airkit.assert = assert;
    function assertNullOrNil(condition, msg) {
        if (condition == null || condition === null || typeof condition === "undefined") {
            assert(false, msg);
        }
    }
    airkit.assertNullOrNil = assertNullOrNil;
    /**
     * 判空
     */
    function checkNullOrNil(x) {
        if (x == null)
            return true;
        if (x === null)
            return true;
        if (typeof x === "undefined")
            return true;
        return false;
    }
    airkit.checkNullOrNil = checkNullOrNil;
    function checkEmptyDic(x) {
        if (checkNullOrNil(x))
            return true;
        if (JSON.stringify(x) == "{}") {
            return true;
        }
        return false;
    }
    airkit.checkEmptyDic = checkEmptyDic;
})(airkit || (airkit = {}));
// import { SDictionary } from "../collection/Dictionary";
// import { Log } from "../log/Log";

(function (airkit) {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */
    class ZipUtils {
        // public static async unzip(ab: ArrayBuffer): Promise<any> {
        //   let resultDic = {};
        //   let zip = await ZipUtils.parseZip(ab);
        //   let jszip = zip.jszip;
        //   let filelist = zip.filelist;
        //   if (jszip && filelist) {
        //     for (let i = 0; i < filelist.length; i++) {
        //       let content = await ZipUtils.parseZipFile(jszip, filelist[i]);
        //       resultDic[filelist[i]] = content;
        //     }
        //   }
        //   zip = null;
        //   jszip = null;
        //   filelist = null;
        //   return resultDic;
        // }
        static unzip(ab) {
            return new Promise((resolve, reject) => {
                let resultDic = {};
                ZipUtils.parseZip(ab)
                    .then((zip) => {
                    let jszip = zip.jszip;
                    let filelist = zip.filelist;
                    if (jszip && filelist) {
                        let count = 0;
                        for (let i = 0; i < filelist.length; i++) {
                            ZipUtils.parseZipFile(jszip, filelist[i])
                                .then((content) => {
                                count++;
                                resultDic[filelist[i]] = content;
                                if (count == filelist.length) {
                                    zip = null;
                                    jszip = null;
                                    filelist = null;
                                    resolve(resultDic);
                                }
                            })
                                .catch((e) => {
                                airkit.Log.error(e);
                                reject(e);
                            });
                        }
                    }
                })
                    .catch((e) => {
                    airkit.Log.error(e);
                    reject(e);
                });
            });
        }
        static parseZip(ab) {
            return new Promise((resolve, reject) => {
                let dic = new airkit.SDictionary();
                let fileNameArr = new Array();
                window.JSZip.loadAsync(ab)
                    .then((jszip) => {
                    for (var fileName in jszip.files) {
                        fileNameArr.push(fileName);
                    }
                    resolve({
                        jszip: jszip,
                        filelist: fileNameArr,
                    });
                })
                    .catch((e) => {
                    airkit.Log.error(e);
                });
            });
        }
        static parseZipFile(jszip, filename) {
            return new Promise((resolve, reject) => {
                jszip
                    .file(filename)
                    .async("text")
                    .then((content) => {
                    resolve(content);
                })
                    .catch((e) => {
                    reject(e);
                    airkit.Log.error(e);
                });
            });
        }
    }
    airkit.ZipUtils = ZipUtils;
})(airkit || (airkit = {}));
