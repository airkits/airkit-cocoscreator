window.airkit = {};

(function (airkit) {
    class Singleton {
        constructor() {
            let clazz = this["constructor"];
            if (!clazz) {
                airkit.Log.warning("浏览器不支持读取构造函数");
                return;
            }
            if (Singleton.classKeys.indexOf(clazz) != -1) {
                throw new Error(this + " 只允许实例化一次！");
            } else {
                Singleton.classKeys.push(clazz);
                Singleton.classValues.push(this);
            }
        }
    }
    Singleton.classKeys = [];
    Singleton.classValues = [];
    airkit.Singleton = Singleton;
})(airkit || (airkit = {}));

(function (airkit) {
    class Framework extends airkit.Singleton {
        constructor() {
            super();
            this._isStopGame = false;
            this._mainloopHandle = null;
            airkit.Timer.Start();
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new Framework();
            return this.instance;
        }
        setup(root, main_loop, log_level = airkit.LogLevel.INFO, design_width = 750, design_height = 1334, screen_mode = Laya.Stage.SCREEN_VERTICAL, frame = 1) {
            this.printDeviceInfo();
            this._lastTimeMS = airkit.DateUtils.getNowMS();
            this._isStopGame = false;
            this._mainloopHandle = main_loop;
            airkit.Log.LEVEL = log_level;
            Laya.timer.frameLoop(frame, this, this.mainLoop);
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            airkit.LayerManager.setup(root);
            airkit.TimerManager.Instance.setup();
            airkit.UIManager.Instance.setup();
            airkit.ResourceManager.Instance.setup();
            airkit.DataProvider.Instance.setup();
            airkit.LangManager.Instance.init();
            airkit.SceneManager.Instance.setup();
            airkit.Mediator.Instance.setup();
            airkit.LoaderManager.Instance.setup();
        }
        destroy() {
            Laya.timer.clearAll(this);
            airkit.Mediator.Instance.destroy();
            airkit.LoaderManager.Instance.destroy();
            airkit.TimerManager.Instance.destroy();
            airkit.UIManager.Instance.destroy();
            airkit.SceneManager.Instance.destroy();
            airkit.ResourceManager.Instance.destroy();
            airkit.DataProvider.Instance.destroy();
            airkit.LayerManager.destroy();
            airkit.LangManager.Instance.destory();
        }
        mainLoop() {
            if (!this._isStopGame) {
                let currentMS = airkit.DateUtils.getNowMS();
                let dt = currentMS - this._lastTimeMS;
                this._lastTimeMS = currentMS;
                this.preTick(dt);
                this.tick(dt);
                this.endTick(dt);
            }
        }
        preTick(dt) {
            airkit.TimerManager.Instance.update(dt);
            airkit.UIManager.Instance.update(dt);
            airkit.ResourceManager.Instance.update(dt);
            airkit.Mediator.Instance.update(dt);
            airkit.SceneManager.Instance.update(dt);
        }
        tick(dt) {
            if (this._mainloopHandle) {
                this._mainloopHandle.runWith([dt]);
            }
        }
        endTick(dt) {}
        pauseGame() {
            this._isStopGame = true;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, true);
        }
        resumeGame() {
            this._isStopGame = false;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, false);
        }
        get isStopGame() {
            return this._isStopGame;
        }
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
                    device = infos[2];
                    let system_info = infos[1].split(" ");
                    if (system_info.length >= 2) {
                        system = system_info[1];
                        version = system_info[2];
                    }
                } else if (infos.length == 2) {
                    system = infos[0];
                    device = infos[0];
                    version = infos[1];
                } else {
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

(function (airkit) {
    class AudioManager extends airkit.Singleton {
        constructor() {
            super();
            this.effectChannelDic = new airkit.SDictionary();
            this.effectChannelNumDic = new airkit.SDictionary();
            this._effectSwitch = true;
            this._musicSwitch = true;
            Laya.SoundManager.useAudioMusic = false;
            Laya.SoundManager.autoReleaseSound = false;
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new AudioManager();
            return this.instance;
        }
        registerMusic(obj) {
            if (this.musicsConfig == null) {
                this.musicsConfig = new airkit.NDictionary();
            }
            this.musicsConfig.add(obj.id, obj);
        }
        registerEffect(obj) {
            if (this.effectConfig == null) {
                this.effectConfig = new airkit.NDictionary();
            }
            this.setEffectVolume(0.3, obj.url);
            this.effectConfig.add(obj.id, obj);
        }
        set musicSwitch(v) {
            if (this._musicSwitch != v) {
                if (!v) {
                    this.stopMusic();
                }
                this._musicSwitch = v;
            }
        }
        set effectSwitch(v) {
            if (this._effectSwitch != v) {
                if (!v) {
                    this.stopAllEffect();
                }
                this._effectSwitch = v;
            }
        }
        playMusic(url, loops = 0, complete = null, startTime = 0) {
            if (!this._musicSwitch)
                return;
            Laya.SoundManager.playMusic(url, loops, complete, startTime);
            Laya.SoundManager.setMusicVolume(0.5);
        }
        playEffect(url, loops = 1, complete = null, soundClass = null, startTime = 0) {
            if (!this._effectSwitch)
                return;
            let num = this.effectChannelNumDic.getValue(url);
            if (num == null) {
                this.effectChannelNumDic.add(url, 1);
            } else {
                this.effectChannelNumDic.set(url, num + 1);
            }
            var soundChannel = this.effectChannelDic.getValue(url);
            if (soundChannel) {
                return;
            }
            num = this.effectChannelNumDic.getValue(url);
            this.effectChannelNumDic.remove(url);
            let scale = airkit.Timer.timeScale;
            if (scale > 1.5)
                scale = 1.5;
            Laya.SoundManager.playbackRate = scale;
            this.effectChannelDic.add(url, Laya.SoundManager.playSound(url, num, Laya.Handler.create(null, () => {
                this.effectChannelDic.remove(url);
            }), soundClass, startTime));
            Laya.SoundManager.setSoundVolume(0.5, url);
        }
        setMusicVolume(volume) {
            Laya.SoundManager.setMusicVolume(volume);
        }
        setEffectVolume(volume, url = null) {
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        stopAll() {
            Laya.SoundManager.stopAll();
        }
        stopAllEffect() {
            this.effectChannelDic.foreach((url, channel) => {
                if (channel != null)
                    channel.stop();
                this.removeChannel(url, channel);
                return true;
            });
            this.effectChannelNumDic.clear();
        }
        stopMusic() {
            Laya.SoundManager.stopMusic();
        }
        removeChannel(url, channel) {
            this.effectChannelDic.remove(url);
            Laya.SoundManager.removeChannel(channel);
        }
        playMusicByID(eId, loops = 0, complete = null, startTime = 0) {
            var config = this.musicsConfig.getValue(eId);
            this.playMusic(config.url, loops, complete, startTime);
        }
        playEffectByID(eId, loops = 1, complete = null, startTime = 0) {
            var config = this.effectConfig.getValue(eId);
            this.playEffect(config.url, loops, complete, startTime);
        }
    }
    AudioManager.instance = null;
    airkit.AudioManager = AudioManager;
})(airkit || (airkit = {}));

(function (airkit) {
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

(function (airkit) {
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

(function (airkit) {
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

(function (airkit) {
    class LinkList {
        constructor() {
            this._linkHead = null;
            this._size = 0;
            this._linkHead = {
                Data: null,
                Prev: null,
                Next: null
            };
            this._linkHead.Prev = this._linkHead;
            this._linkHead.Next = this._linkHead;
            this._size = 0;
        }
        add(t) {
            this.append(this._size, t);
        }
        insert(index, t) {
            if (this._size < 1 || index >= this._size)
                airkit.Log.exception("没有可插入的点或者索引溢出了");
            if (index == 0)
                this.append(this._size, t);
            else {
                let inode = this.getNode(index);
                let tnode = {
                    Data: t,
                    Prev: inode.Prev,
                    Next: inode
                };
                inode.Prev.Next = tnode;
                inode.Prev = tnode;
                this._size++;
            }
        }
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
            let tnode = {
                Data: t,
                Prev: inode,
                Next: inode.Next
            };
            inode.Next.Prev = tnode;
            inode.Next = tnode;
            this._size++;
        }
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
        getNode(index) {
            if (index < 0 || index >= this._size) {
                airkit.Log.exception("索引溢出或者链表为空");
            }
            if (index < this._size / 2) {
                let node = this._linkHead.Next;
                for (let i = 0; i < index; i++)
                    node = node.Next;
                return node;
            }
            let rnode = this._linkHead.Prev;
            let rindex = this._size - index - 1;
            for (let i = 0; i < rindex; i++)
                rnode = rnode.Prev;
            return rnode;
        }
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

(function (airkit) {
    class ObjectPools {
        static get(classDef) {
            let sign = classDef["objectKey"];
            if (sign == null) {
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
                    } else if (obj.displayObject["parent"] != null) {
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

(function (airkit) {
    class Queue {
        constructor() {
            this._list = [];
        }
        enqueue(item) {
            this._list.push(item);
        }
        dequeue() {
            return this._list.shift();
        }
        peek() {
            if (this._list.length == 0)
                return null;
            return this._list[0];
        }
        seek(index) {
            if (this._list.length < index)
                return null;
            return this._list[index];
        }
        toArray() {
            return this._list.slice(0, this._list.length);
        }
        contains(item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        }
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
    class Stack {
        constructor() {
            this._list = [];
        }
        push(item) {
            this._list.push(item);
        }
        pop() {
            return this._list.pop();
        }
        peek() {
            if (this._list.length == 0)
                return null;
            return this._list[this._list.length - 1];
        }
        toArray() {
            return this._list.slice(0, this._list.length);
        }
        contains(item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        }
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
    airkit.LOADVIEW_TYPE_NONE = 0;
    let eUIQueueType;
    (function (eUIQueueType) {
        eUIQueueType[eUIQueueType["POPUP"] = 1] = "POPUP";
        eUIQueueType[eUIQueueType["ALERT"] = 2] = "ALERT";
    })(eUIQueueType = airkit.eUIQueueType || (airkit.eUIQueueType = {}));
    let ePopupAnim;
    (function (ePopupAnim) {})(ePopupAnim = airkit.ePopupAnim || (airkit.ePopupAnim = {}));
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
        ePopupButton[ePopupButton["Ok"] = 2] = "Ok";
    })(ePopupButton = airkit.ePopupButton || (airkit.ePopupButton = {}));
})(airkit || (airkit = {}));

(function (airkit) {
    class ConfigItem {
        constructor(url, name, key) {
            this.url = url;
            this.name = name;
            this.key = key;
        }
    }
    airkit.ConfigItem = ConfigItem;
})(airkit || (airkit = {}));

(function (airkit) {
    class ConfigManger extends airkit.Singleton {
        static get Instance() {
            if (!this.instance)
                this.instance = new ConfigManger();
            return this.instance;
        }
        init(keys, zipPath = null) {
            if (zipPath != null)
                ConfigManger.zipUrl = zipPath;
            this._listTables = [];
            let c = keys;
            for (let k in c) {
                this._listTables.push(new airkit.ConfigItem(k, k, c[k]));
            }
        }
        release() {
            if (!this._listTables)
                return;
            for (let info of this._listTables) {
                airkit.DataProvider.Instance.unload(info.url);
            }
            airkit.ArrayUtils.clear(this._listTables);
            this._listTables = null;
        }
        loadAll() {
            if (this._listTables.length > 0) {
                airkit.DataProvider.Instance.enableZip();
                return airkit.DataProvider.Instance.loadZip(ConfigManger.zipUrl, this._listTables);
            }
        }
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
        get listTables() {
            return this._listTables;
        }
    }
    ConfigManger.instance = null;
    ConfigManger.zipUrl = "res/config.zip";
    airkit.ConfigManger = ConfigManger;
})(airkit || (airkit = {}));

(function (airkit) {
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
        }
        loadZip(url, list) {
            return new Promise((resolve, reject) => {
                airkit.ResourceManager.Instance.loadRes(url, Laya.Loader.BUFFER).then(v => {
                    let ab = airkit.ResourceManager.Instance.getRes(url);
                    airkit.ZipUtils.unzip(ab)
                        .then(v => {
                            for (let i = 0; i < list.length; i++) {
                                let template = list[i];
                                this._dicTemplate.add(list[i].url, template);
                                airkit.Log.info("Load config {0}", template.url);
                                let json_res = JSON.parse(v[template.url]);
                                if (airkit.StringUtils.isNullOrEmpty(template.key)) {
                                    this._dicData.add(template.name, json_res);
                                } else {
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
                                        } else {
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
                        .catch(e => {
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
                        assets.push({
                            url: list[i].url,
                            type: Laya.Loader.JSON
                        });
                        this._dicTemplate.add(list[i].url, list[i]);
                    }
                }
                if (assets.length == 0) {
                    resolve([]);
                    return;
                }
                airkit.ResourceManager.Instance.loadArrayRes(assets, null, null, null, null, airkit.ResourceManager.SystemGroup)
                    .then(v => {
                        for (let i = 0; i < v.length; i++) {
                            this.onLoadComplete(v[i]);
                            resolve(v);
                        }
                    })
                    .catch(e => {
                        reject(e);
                    });
            });
        }
        unload(url) {
            let template = this._dicTemplate.getValue(url);
            if (template) {
                this._dicData.remove(template.name);
            }
            if (this._zip) {} else {
                airkit.ResourceManager.Instance.clearRes(url);
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
        getConfig(table) {
            let data = this._dicData.getValue(table);
            return data;
        }
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
                } else {
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
                } else {
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
                        } else {
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

    function stringToArrayBuffer(s) {
        var buffer = new ArrayBuffer(s.length);
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < s.length; ++i) {
            bytes[i] = s.charCodeAt(i);
        }
        return buffer;
    }
    airkit.stringToArrayBuffer = stringToArrayBuffer;
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
            while (index + 2 < array.byteLength) {
                quantum =
                    (array[index] << 16) | (array[index + 1] << 8) | array[index + 2];
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
            if (index + 1 === array.byteLength) {
                quantum = array[index] << 4;
                value = (quantum >> 6) & 0x3f;
                base64.push(this.alphabet[value]);
                value = quantum & 0x3f;
                base64.push(this.alphabet[value]);
                base64.push("==");
            } else if (index + 2 === array.byteLength) {
                quantum = (array[index] << 10) | (array[index + 1] << 2);
                value = (quantum >> 12) & 0x3f;
                base64.push(this.alphabet[value]);
                value = (quantum >> 6) & 0x3f;
                base64.push(this.alphabet[value]);
                value = quantum & 0x3f;
                base64.push(this.alphabet[value]);
                base64.push("=");
            }
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
                size -= 4;
            }
            while (index < size) {
                quantum = 0;
                for (let i = 0; i < 4; ++i) {
                    quantum = (quantum << 6) | this.values[string.charAt(index + i)];
                }
                buffer[bufferIndex++] = (quantum >> 16) & 0xff;
                buffer[bufferIndex++] = (quantum >> 8) & 0xff;
                buffer[bufferIndex++] = quantum & 0xff;
                index += 4;
            }
            if (numPad > 0) {
                quantum = 0;
                for (let i = 0; i < 4 - numPad; ++i) {
                    quantum = (quantum << 6) | this.values[string.charAt(index + i)];
                }
                if (numPad === 1) {
                    quantum = quantum >> 2;
                    buffer[bufferIndex++] = (quantum >> 8) & 0xff;
                    buffer[bufferIndex++] = quantum & 0xff;
                } else {
                    quantum = quantum >> 4;
                    buffer[bufferIndex++] = quantum & 0xff;
                }
            }
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
            this.hexcase = 0;
            this.b64pad = "";
        }
        hex_md5(s) {
            return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
        }
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
        md5_vm_test() {
            return (this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72");
        }
        rstr_md5(s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        }
        rstr_hmac_md5(key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5c5c5c5c;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        }
        rstr2hex(input) {
            try {
                this.hexcase;
            } catch (e) {
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
        rstr2b64(input) {
            try {
                this.b64pad;
            } catch (e) {
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
        rstr2any(input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] =
                    (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
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
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        }
        str2rstr_utf8(input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
                    x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
                    i++;
                }
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
        rstr2binl(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
            return output;
        }
        binl2rstr(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
            return output;
        }
        binl_md5(x, len) {
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
        safe_add(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }
        bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
    }
    airkit.MD5 = MD5;
})(airkit || (airkit = {}));

(function (airkit) {
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

(function (airkit) {
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
        static addEventListener(type, caller, fun) {
            EventCenter.Instance._event.addEventListener(type, caller, fun);
        }
        static removeEventListener(type, caller, fun) {
            EventCenter.Instance._event.removeEventListener(type, caller, fun);
        }
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

(function (airkit) {
    class EventDispatcher {
        constructor() {
            this._dicFuns = {};
            this._evtArgs = null;
            this._evtArgs = new airkit.EventArgs();
        }
        addEventListener(type, caller, fun) {
            if (!this._dicFuns[type]) {
                this._dicFuns[type] = [];
                this._dicFuns[type].push(Laya.Handler.create(caller, fun, null, false));
            } else {
                let arr = this._dicFuns[type];
                for (let item of arr) {
                    if (item.caller == caller && item.method == fun)
                        return;
                }
                arr.push(Laya.Handler.create(caller, fun, null, false));
            }
        }
        removeEventListener(type, caller, fun) {
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
        dispatchEvent(type, args) {
            args.type = type;
            let arr = this._dicFuns[type];
            if (!arr)
                return;
            for (let item of arr) {
                item.runWith(args);
            }
        }
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
    class EventID {}
    EventID.BEGIN_GAME = "BEGIN_GAME";
    EventID.RESTART_GAEM = "RESTART_GAME";
    EventID.STOP_GAME = "STOP_GAME";
    EventID.PAUSE_GAME = "PAUSE_GAME";
    EventID.ON_SHOW = "ON_SHOW";
    EventID.ON_HIDE = "ON_HIDE";
    EventID.CHANGE_SCENE = "CHANGE_SCENE";
    EventID.BEGIN_MODULE = "BEGIN_MODULE";
    EventID.END_MODULE = "END_MODULE";
    EventID.UI_OPEN = "UI_OPEN";
    EventID.UI_CLOSE = "UI_CLOSE";
    EventID.UI_LANG = "UI_LANG";
    airkit.EventID = EventID;
    class LoaderEventID {}
    LoaderEventID.RESOURCE_LOAD_COMPLATE = "RESOURCE_LOAD_COMPLATE";
    LoaderEventID.RESOURCE_LOAD_PROGRESS = "RESOURCE_LOAD_PROGRESS";
    LoaderEventID.RESOURCE_LOAD_FAILED = "RESOURCE_LOAD_FAILED";
    LoaderEventID.LOADVIEW_OPEN = "LOADVIEW_OPEN";
    LoaderEventID.LOADVIEW_COMPLATE = "LOADVIEW_COMPLATE";
    LoaderEventID.LOADVIEW_PROGRESS = "LOADVIEW_PROGRESS";
    airkit.LoaderEventID = LoaderEventID;
})(airkit || (airkit = {}));

(function (airkit) {
    class Signal {
        constructor() {}
        destory() {
            this._listener && this._listener.destory();
            this._listener = null;
        }
        dispatch(arg) {
            if (this._listener)
                this._listener.execute(arg);
        }
        has(caller) {
            if (this._listener == null)
                return false;
            return this._listener.has(caller);
        }
        on(caller, method, ...args) {
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, false);
        }
        once(caller, method, ...args) {
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, true);
        }
        off(caller, method) {
            if (this._listener)
                this._listener.off(caller, method);
        }
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
            let handler = new Laya.Handler(caller, method, args, once);
            this.handlers.push(handler);
            return handler;
        }
        off(caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            let tempHandlers = [];
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                if (handler.caller === caller && handler.method === method) {
                    handler.recover();
                    break;
                } else {
                    tempHandlers.push(handler);
                }
            }
            ++i;
            for (; i < this.handlers.length; ++i) {
                tempHandlers.push(this.handlers[i]);
            }
            this.handlers = tempHandlers;
        }
        offAll(caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            let temp = [];
            let handlers = this.handlers;
            let len = handlers.length;
            for (var i = 0; i < len; ++i) {
                if (caller !== handlers[i].caller || method !== handlers[i].method) {
                    temp.push(handlers[i]);
                } else {
                    handlers[i].recover();
                }
            }
            this.handlers = temp;
        }
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

(function (airkit) {
    function L(key, ...args) {
        let str = LangManager.Instance.getText(LangManager.Instance.curLang, key);
        if (str == null)
            return "unknown key:" + key;
        return airkit.StringUtils.format(str, ...args);
    }
    airkit.L = L;
    class LangManager extends airkit.Singleton {
        static get Instance() {
            if (!this.instance)
                this.instance = new LangManager();
            return this.instance;
        }
        init() {
            this._curLang = null;
        }
        destory() {}
        changeLang(lang) {
            return new Promise((resolve, reject) => {
                if (lang == this._curLang) {
                    resolve(lang);
                    return;
                }
                let data = airkit.ConfigManger.Instance.getList(this._curLang);
                if (data) {
                    if (airkit.DataProvider.Instance.getConfig(lang)) {
                        this._curLang = lang;
                        airkit.EventCenter.dispatchEvent(airkit.EventID.UI_LANG, this._curLang);
                        resolve(lang);
                    }
                } else {
                    airkit.Log.error("no lang package {0} ", lang);
                    reject("no lang package " + lang);
                }
            });
        }
        getText(lang, key) {
            let info = airkit.DataProvider.Instance.getInfo(lang, key);
            if (info) {
                return info["name"];
            } else {
                airkit.Log.error("cant get lang key", key);
                return "";
            }
        }
        get curLang() {
            return this._curLang;
        }
    }
    LangManager.instance = null;
    airkit.LangManager = LangManager;
})(airkit || (airkit = {}));

(function (airkit) {
    class LoaderManager extends airkit.Singleton {
        static registerLoadingView(view_type, className, cls) {
            this.loaders.add(view_type, className);
            Laya.ClassUtils.regClass(className, cls);
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
        }
        registerEvent() {
            airkit.EventCenter.addEventListener(airkit.LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
            airkit.EventCenter.addEventListener(airkit.LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
            airkit.EventCenter.addEventListener(airkit.LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
        }
        unRegisterEvent() {
            airkit.EventCenter.removeEventListener(airkit.LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
            airkit.EventCenter.removeEventListener(airkit.LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
            airkit.EventCenter.removeEventListener(airkit.LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
        }
        onLoadViewEvt(args) {
            let type = args.type;
            let viewType = args.get(0);
            switch (type) {
                case airkit.LoaderEventID.LOADVIEW_OPEN: {
                    airkit.Log.debug("显示加载界面");
                    let total = args.get(1);
                    let tips = args.get(2);
                    this.show(viewType, total, tips);
                }
                break;
            case airkit.LoaderEventID.LOADVIEW_PROGRESS: {
                let cur = args.get(1);
                let total = args.get(2);
                this.setProgress(viewType, cur, total);
            }
            break;
            case airkit.LoaderEventID.LOADVIEW_COMPLATE: {
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
                if (className.length > 0) {
                    view = Laya.ClassUtils.getInstance(className);
                    if (view == null)
                        return;
                    view.setup([]);
                    let clas = Laya.ClassUtils.getClass(className);
                    view.loadResource(airkit.ResourceManager.SystemGroup, clas).then(() => {
                        airkit.LayerManager.loadingLayer.addChild(view);
                        this._dicLoadView.add(type, view);
                        this.updateView(view, total, tips);
                    });
                } else {
                    airkit.Log.error("Must set loadingview first type= {0}", type);
                }
            } else {
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
        }
    }
    LoaderManager.loaders = new airkit.NDictionary();
    LoaderManager.instance = null;
    airkit.LoaderManager = LoaderManager;
})(airkit || (airkit = {}));

(function (airkit) {
    airkit.FONT_SIZE_4 = 18;
    airkit.FONT_SIZE_5 = 22;
    airkit.FONT_SIZE_6 = 25;
    airkit.FONT_SIZE_7 = 29;
    class ResourceManager extends airkit.Singleton {
        constructor() {
            super(...arguments);
            this._dicLoaderUrl = null;
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new ResourceManager();
            return this.instance;
        }
        setup() {
            this._dicLoaderUrl = new airkit.SDictionary();
            this._spineDic = new airkit.SDictionary();
            this._minLoaderTime = 1000;
            this._aniAnimDic = new airkit.SDictionary();
            this.onAniResUpdateSignal = new airkit.Signal();
        }
        static asyncLoad(url, progress, type, priority, cache, group, ignoreCache) {
            return new Promise((resolve, reject) => {
                let errFunc = function (v) {
                    Laya.loader.off(Laya.Event.ERROR, null, errFunc);
                    reject(url);
                };
                Laya.loader.load(url, Laya.Handler.create(this, v => {
                    Laya.loader.off(Laya.Event.ERROR, null, errFunc);
                    resolve(url);
                }), progress, type, priority, cache, group, ignoreCache);
                Laya.loader.on(Laya.Event.ERROR, null, errFunc);
            });
        }
        destroy() {
            if (this._dicLoaderUrl) {
                this._dicLoaderUrl.clear();
                this._dicLoaderUrl = null;
            }
        }
        update(dt) {}
        getRes(url) {
            this.refreshResourceTime(url, null, false);
            return Laya.loader.getRes(url);
        }
        loadRes(url, type = "", viewType = airkit.LOADVIEW_TYPE_NONE, priority = 1, cache = true, group = "default", ignoreCache = false) {
            this.refreshResourceTime(url, group, true);
            if (viewType == null)
                viewType = airkit.LOADVIEW_TYPE_NONE;
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                if (Laya.loader.getRes(url))
                    viewType = airkit.LOADVIEW_TYPE_NONE;
            }
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_OPEN, viewType, 1);
            }
            return new Promise((resolve, reject) => {
                ResourceManager.asyncLoad(url, Laya.Handler.create(this, this.onLoadProgress, [viewType, 1], false), type, priority, cache, group, ignoreCache)
                    .then(v => {
                        this.onLoadComplete(viewType, [url]);
                        resolve(url);
                    })
                    .catch(e => {
                        reject(e);
                    });
            });
        }
        loadArrayRes(arr_res, viewType = airkit.LOADVIEW_TYPE_NONE, tips = null, priority = 1, cache = true, group = "default", ignoreCache = false) {
            let has_unload = false;
            let assets = [];
            let urls = [];
            Laya.loader.maxLoader = 4;
            if (viewType == null)
                viewType = airkit.LOADVIEW_TYPE_NONE;
            if (priority == null)
                priority = 1;
            if (cache == null)
                cache = true;
            for (let res of arr_res) {
                assets.push({
                    url: res.url,
                    type: res.type
                });
                urls.push(res.url);
                if (!has_unload && !Laya.loader.getRes(res.url))
                    has_unload = true;
                this.refreshResourceTime(res.url, group, true);
            }
            if (!has_unload && viewType != airkit.LOADVIEW_TYPE_NONE) {
                viewType = airkit.LOADVIEW_TYPE_NONE;
            }
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_OPEN, viewType, assets.length, tips);
            }
            return new Promise((resolve, reject) => {
                ResourceManager.asyncLoad(assets, Laya.Handler.create(this, this.onLoadProgress, [viewType, assets.length, tips], false), undefined, priority, cache, group, ignoreCache)
                    .then(v => {
                        if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                            airkit.TimerManager.Instance.addOnce(this._minLoaderTime, null, v => {
                                this.onLoadComplete(viewType, urls, tips);
                                resolve(urls);
                            });
                        } else {
                            this.onLoadComplete(viewType, urls, tips);
                            resolve(urls);
                        }
                    })
                    .catch(e => {
                        reject(e);
                    });
            });
        }
        onLoadComplete(viewType, ...args) {
            if (args) {
                let arr = args[0];
                for (let url of arr) {
                    airkit.Log.debug("[load]加载完成url:" + url);
                    var i = url.lastIndexOf(".bin");
                    if (i > 0) {
                        let pkg = url.substr(0, i);
                        fgui.UIPackage.addPackage(pkg);
                        airkit.Log.info("add Package :" + pkg);
                    }
                    let loader_info = this._dicLoaderUrl.getValue(url);
                    if (loader_info) {
                        loader_info.updateStatus(eLoaderStatus.LOADED);
                    }
                }
            }
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_COMPLATE, viewType);
            }
        }
        onLoadProgress(viewType, total, tips, progress) {
            let cur = airkit.NumberUtils.toInt(Math.floor(progress * total));
            airkit.Log.debug("[load]进度: current={0} total={1}", cur, total);
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_PROGRESS, viewType, cur, total, tips);
            }
        }
        refreshResourceTime(url, group, is_create) {
            if (is_create) {
                let loader_info = this._dicLoaderUrl.getValue(url);
                if (!loader_info) {
                    loader_info = new LoaderConfig(url, group);
                    this._dicLoaderUrl.add(url, loader_info);
                    loader_info.updateStatus(eLoaderStatus.LOADING);
                } else {
                    loader_info.ctime = airkit.Timer.timeSinceStartup;
                }
            } else {
                let loader_info = this._dicLoaderUrl.getValue(url);
                if (loader_info) {
                    loader_info.utime = airkit.Timer.timeSinceStartup;
                }
            }
        }
        clearRes(url) {
            this._dicLoaderUrl.remove(url);
            Laya.loader.clearRes(url);
            var i = url.lastIndexOf(".bin");
            if (i > 0) {
                let offset = url.lastIndexOf("/");
                let pkg = url.substr(offset + 1, i - offset - 1);
                fgui.UIPackage.removePackage(pkg);
                airkit.Log.info("remove Package :" + pkg);
            }
            airkit.Log.info("[res]释放资源:" + url);
        }
        cleanTexture(group) {
            this._dicLoaderUrl.foreach((k, v) => {
                if (v.group == group) {
                    airkit.Log.info("清理texture资源 {0}", k);
                    this.clearRes(k);
                }
                return true;
            });
        }
        setAniAnim(ani, atlas, group) {
            let value = this._aniAnimDic.getValue(ani);
            if (value == null) {
                this._aniAnimDic.add(ani, [atlas, 1, group]);
            } else {
                value[1] += 1;
            }
        }
        createSpineAnim(skUrl, aniMode, group = "default") {
            return new Promise((resolve, reject) => {
                let t = this._spineDic.getValue(skUrl);
                if (t) {
                    resolve(t[0].buildArmature(aniMode));
                } else {
                    airkit.DisplayUtils.createSkeletonAni(skUrl, aniMode)
                        .then(v => {
                            this._spineDic.add(skUrl, [v[0], group]);
                            resolve(v[1]);
                        })
                        .catch(e => {
                            reject(e);
                        });
                }
            });
        }
        removeSpineAnim(sk) {
            sk.offAll();
            sk.removeSelf();
            sk.destroy();
            sk = null;
        }
        removeSpineTemplet(skUrl) {
            let v = this._spineDic.getValue(skUrl);
            if (v == null) {
                return;
            }
            for (let k in v[0].subTextureDic) {
                let t = v[0].subTextureDic[k];
                t.disposeBitmap();
                delete v[0].subTextureDic[k];
                t = null;
            }
            ResourceManager.Instance.clearRes(skUrl);
            this._spineDic.remove(skUrl);
            v[0].destroy();
            airkit.ArrayUtils.clear(v);
            v = null;
        }
        removeSpineTempletGroup(group) {
            this._spineDic.foreach((k, v) => {
                if (v[1] == group) {
                    this.removeSpineTemplet(k);
                }
                return true;
            });
        }
        createAniAnim(ani, atlas, group = "default") {
            return new Promise((resolve, reject) => {
                airkit.DisplayUtils.createAsyncAnimation(ani, atlas)
                    .then((v) => {
                        this.setAniAnim(ani, atlas, group);
                        this.onAniResUpdateSignal.dispatch(ani);
                        resolve(v);
                    })
                    .catch(e => {
                        reject(e);
                    });
            });
        }
        createFrameAnim(name, urls, atlas, group = "default") {
            return new Promise((resolve, reject) => {
                let res = ResourceManager.Instance.getRes(atlas);
                let anim = new Laya.Animation();
                anim.loadAtlas(atlas, Laya.Handler.create(null, v => {
                    Laya.Animation.createFrames(urls, name);
                    resolve(anim);
                }));
            });
        }
        createFuiAnim(pkgName, resName, path, group = "default") {
            return new Promise((resolve, reject) => {
                let atlas = path + "_atlas0.png";
                let bin = path + ".bin";
                let res = ResourceManager.Instance.getRes(atlas);
                if (res == null) {
                    ResourceManager.Instance.loadArrayRes([{
                                url: atlas,
                                type: Laya.Loader.IMAGE
                            },
                            {
                                url: bin,
                                type: Laya.Loader.BUFFER
                            }
                        ], null, null, 0, true, group)
                        .then(v => {
                            let obj = fgui.UIPackage.createObject(pkgName, resName);
                            resolve(obj.asCom);
                        })
                        .catch(e => {
                            reject(e);
                        });
                } else {
                    let obj = fgui.UIPackage.createObject(pkgName, resName);
                    resolve(obj.asCom);
                }
            });
        }
        removeAniAnim(ani) {
            let v = this._aniAnimDic.getValue(ani);
            if (v == null) {
                return;
            }
            ResourceManager.Instance.clearRes(ani);
            for (let k in Laya.Animation.framesMap) {
                if (airkit.StringUtils.beginsWith(k, ani)) {
                    let obj = Laya.Animation.framesMap[k];
                    delete Laya.Animation.framesMap[k];
                    if (obj.frames && obj.frames.length > 0) {
                        let len = obj.frames.length;
                        for (let i = 0; i < len; i++) {
                            let g = obj.frames.shift();
                            g.autoDestroy = true;
                            g.destroy(true);
                            g = null;
                        }
                        obj.frames = null;
                    }
                    obj = null;
                }
            }
            this._aniAnimDic.remove(ani);
        }
        removeAllAniAnim(group = "default") {
            this._aniAnimDic.foreach((k, v) => {
                if (v[2] == group) {
                    airkit.Log.info("clean {0} {1}", k, v[0]);
                    this.removeAniAnim(k);
                }
                return true;
            });
        }
        static imageProxy(image, skin, proxy, atlas) {
            return new Promise((resolve, reject) => {
                let texture = ResourceManager.Instance.getRes(skin);
                if (texture != null) {
                    image.url = skin;
                } else {
                    let res = skin;
                    if (atlas != null) {
                        res = atlas;
                    }
                    if (proxy) {
                        image.url = proxy;
                    }
                    airkit.Log.info("imageProxy start load {0} ", res);
                    ResourceManager.Instance.loadRes(res)
                        .then(v => {
                            image.url = skin;
                            image.alpha = 0.1;
                            airkit.TweenUtils.get(image).to({
                                alpha: 1.0
                            }, 0.3);
                            airkit.Log.info("imageProxy start load done {0} ", res);
                        })
                        .catch(e => airkit.Log.error(e));
                }
            });
        }
    }
    ResourceManager.FONT_Yuanti = "Yuanti SC Regular";
    ResourceManager.Font_Helvetica = "Helvetica";
    ResourceManager.FONT_DEFAULT = Laya.Text.defaultFont;
    ResourceManager.FONT_DEFAULT_SIZE = airkit.FONT_SIZE_5;
    ResourceManager.DefaultGroup = "airkit";
    ResourceManager.SystemGroup = "system";
    ResourceManager.instance = null;
    airkit.ResourceManager = ResourceManager;
    let eLoaderStatus;
    (function (eLoaderStatus) {
        eLoaderStatus[eLoaderStatus["READY"] = 0] = "READY";
        eLoaderStatus[eLoaderStatus["LOADING"] = 1] = "LOADING";
        eLoaderStatus[eLoaderStatus["LOADED"] = 2] = "LOADED";
    })(eLoaderStatus || (eLoaderStatus = {}));
    class LoaderConfig {
        constructor(url, group) {
            this.url = url;
            this.group = group;
            this.ctime = airkit.Timer.timeSinceStartup;
            this.utime = airkit.Timer.timeSinceStartup;
            this.status = eLoaderStatus.READY;
        }
        updateStatus(status) {
            this.status = status;
        }
    }
})(airkit || (airkit = {}));

(function (airkit) {
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
                    } else {
                        arr.push(JSON.stringify(arg, null, 4));
                    }
                }
                let content = airkit.StringUtils.format(format, ...arr);
                return content;
            } else {
                if (typeof format == "object" && format.message) {
                    return format.message;
                } else {
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
                } catch (error) {
                    console.error(error);
                }
            }
            console.log(airkit.DateUtils.currentYMDHMS(), "[Dump]", value);
        }
    }
    Log.LEVEL = airkit.LogLevel.INFO;
    airkit.Log = Log;
})(airkit || (airkit = {}));

(function (airkit) {
    class BaseModule extends Laya.EventDispatcher {
        constructor() {
            super();
        }
        setup(args) {
            this.event(airkit.EventID.BEGIN_MODULE, this.name);
            this.registerEvent();
        }
        start() {}
        update(dt) {}
        registerEvent() {
            this.registerSignalEvent();
        }
        unRegisterEvent() {
            this.unregisterSignalEvent();
        }
        static res() {
            return null;
        }
        static loaderTips() {
            return "资源加载中";
        }
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
            this.event(airkit.EventID.END_MODULE, this.name);
            this.unRegisterEvent();
        }
    }
    airkit.BaseModule = BaseModule;
})(airkit || (airkit = {}));

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
        static register(name, cls) {
            Laya.ClassUtils.regClass(name, cls);
        }
        static call(name, funcName, ...args) {
            return new Promise((resolve, reject) => {
                let m = this.modules.getValue(name);
                if (m == null) {
                    m = Laya.ClassUtils.getInstance(name);
                    let clas = Laya.ClassUtils.getClass(name);
                    if (m == null) {
                        airkit.Log.warning("Cant find module {0}", name);
                        reject("Cant find module" + name);
                    }
                    this.modules.add(name, m);
                    m.name = name;
                    this.loadResource(m, clas)
                        .then(v => {
                            var onInitModuleOver = m => {
                                m.off(airkit.EventID.BEGIN_MODULE, null, onInitModuleOver);
                                m.start();
                                if (funcName == null) {
                                    resolve(m);
                                } else {
                                    let result = this.callFunc(m, funcName, args);
                                    resolve(result);
                                }
                            };
                            m.on(airkit.EventID.BEGIN_MODULE, null, onInitModuleOver, [m]);
                            m.setup(null);
                        })
                        .catch(e => {
                            airkit.Log.warning("Load module Resource Failed {0}", name);
                            reject("Load module Resource Failed " + name);
                        });
                } else {
                    if (funcName == null) {
                        resolve(m);
                    } else {
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
                } else {
                    result = func.apply(m);
                }
            } else {
                airkit.Log.error("cant find funcName {0} from Module:{1}", funcName, m.name);
            }
            return result;
        }
        static loadResource(m, clas) {
            let assets = [];
            let res_map = clas.res();
            if (res_map && res_map.length > 0) {
                for (let i = 0; i < res_map.length; ++i) {
                    let res = res_map[i];
                    if (!airkit.ResourceManager.Instance.getRes(res[0])) {
                        assets.push({
                            url: res[0],
                            type: res[1]
                        });
                    }
                }
            }
            return new Promise((resolve, reject) => {
                if (assets.length > 0) {
                    let load_view = clas.loaderType();
                    let tips = clas.loaderTips();
                    airkit.ResourceManager.Instance.loadArrayRes(assets, load_view, tips, 1, true, airkit.ResourceManager.DefaultGroup)
                        .then(v => {
                            resolve(v);
                        })
                        .catch(e => {
                            reject(e);
                        });
                } else {
                    resolve([]);
                }
            });
        }
        destroy() {
            this.unRegisterEvent();
            this.clear();
        }
        clear() {
            if (Mediator.modules) {
                Mediator.modules.foreach((k, v) => {
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
        registerEvent() {}
        unRegisterEvent() {}
    }
    Mediator.modules = new airkit.SDictionary();
    Mediator.instance = null;
    airkit.Mediator = Mediator;
})(airkit || (airkit = {}));

(function (airkit) {
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
    airkit.CONTENT_TYPE_PB = "application/octet-stream";
    airkit.RESPONSE_TYPE_TEXT = "text";
    airkit.RESPONSE_TYPE_JSON = "json";
    airkit.RESPONSE_TYPE_XML = "xml";
    airkit.RESPONSE_TYPE_BYTE = "arraybuffer";
    airkit.HTTP_REQUEST_TIMEOUT = 10000;
    class Http {
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
                var request = new Laya.HttpRequest();
                request.http.timeout = airkit.HTTP_REQUEST_TIMEOUT;
                request.http.ontimeout = function () {
                    airkit.Log.error("request timeout {0}", url);
                    request.offAll();
                    Http.currentRequsts--;
                    reject("timeout");
                };
                request.once(Laya.Event.COMPLETE, this, function (event) {
                    let data;
                    switch (responseType) {
                        case airkit.RESPONSE_TYPE_TEXT:
                            data = request.data;
                            break;
                        case airkit.RESPONSE_TYPE_JSON:
                            data = request.data;
                            break;
                        case airkit.RESPONSE_TYPE_BYTE:
                            var bytes = new Laya.Byte(request.data);
                            bytes.endian = Laya.Socket.BIG_ENDIAN;
                            var body = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos);
                            data = body;
                            break;
                        default:
                            data = request.data;
                    }
                    request.offAll();
                    Http.currentRequsts--;
                    resolve(data);
                });
                request.once(Laya.Event.ERROR, this, function (event) {
                    airkit.Log.error("req:{0} error:{1}", url, event);
                    request.offAll();
                    Http.currentRequsts--;
                    reject(event);
                });
                request.on(Laya.Event.PROGRESS, this, function (event) {});
                if (method == airkit.GET) {
                    request.send(url, null, method, responseType, header);
                } else {
                    request.send(url, data, method, responseType, header);
                }
            });
        }
        static get(url, reqType, header, responseType) {
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            if (responseType == undefined) {
                responseType = airkit.RESPONSE_TYPE_TEXT;
            }
            return this.request(url, airkit.GET, reqType, header, null, responseType);
        }
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
    class BaseView extends fgui.GComponent {
        constructor() {
            super();
            this._isOpen = false;
            this._UIID = 0;
            this.objectData = null;
            this._destory = false;
            this._viewID = BaseView.__ViewIDSeq++;
        }
        createPanel(pkgName, resName) {
            let v = fgui.UIPackage.createObjectFromURL("ui://" + pkgName + "/" + resName);
            if (v == null)
                return;
            this._view = v.asCom;
            this._view.setSize(this.width, this.height);
            this._view.addRelation(this, fgui.RelationType.Width);
            this._view.addRelation(this, fgui.RelationType.Height);
            this.addChild(this._view);
        }
        debug() {
            let bgColor = "#4aa7a688";
        }
        setup(args) {
            this._isOpen = true;
            this.onLangChange();
            this.onCreate(args);
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_OPEN, this._UIID);
            airkit.EventCenter.addEventListener(airkit.EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
        }
        dispose() {
            if (this._destory)
                return;
            this._destory = true;
            this.onDestroy();
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_CLOSE, this._UIID);
            airkit.EventCenter.removeEventListener(airkit.EventID.UI_LANG, this, this.onLangChange);
            super.dispose();
        }
        isDestory() {
            return this._destory;
        }
        panel() {
            let panel = this.getGObject("panel");
            if (panel != null)
                return panel.asCom;
            return null;
        }
        bg() {
            let view = this.getGObject("bg");
            if (view != null)
                return view.asCom;
            return null;
        }
        setVisible(bVisible) {
            let old = this.visible;
            this.visible = bVisible;
        }
        setUIID(id) {
            this._UIID = id;
        }
        get UIID() {
            return this._UIID;
        }
        get viewID() {
            return this._viewID;
        }
        onCreate(args) {}
        onDestroy() {}
        update(dt) {
            return true;
        }
        getGObject(name) {
            return this._view.getChild(name);
        }
        onEnter() {}
        onLangChange() {}
        static res() {
            return null;
        }
        static loaderTips() {
            return "资源加载中";
        }
        static loaderType() {
            return airkit.LOADVIEW_TYPE_NONE;
        }
        signalMap() {
            return null;
        }
        eventMap() {
            return null;
        }
        registerEvent() {}
        unRegisterEvent() {}
        staticCacheUI() {
            return null;
        }
        loadResource(group, clas) {
            return new Promise((resolve, reject) => {
                let assets = [];
                let res_map = clas.res();
                if (res_map && res_map.length > 0) {
                    for (let i = 0; i < res_map.length; ++i) {
                        let res = res_map[i];
                        if (!airkit.ResourceManager.Instance.getRes(res[0])) {
                            assets.push({
                                url: res[0],
                                type: res[1]
                            });
                        }
                    }
                }
                if (assets.length > 0) {
                    let tips = clas.loaderTips();
                    let loaderType = clas.loaderType();
                    airkit.ResourceManager.Instance.loadArrayRes(assets, loaderType, tips, 1, true, group)
                        .then(v => {
                            this.onAssetLoaded();
                            resolve(this);
                            this.onEnter();
                        })
                        .catch(e => {
                            airkit.Log.error(e);
                            reject(e);
                        });
                } else {
                    this.onAssetLoaded();
                    resolve(this);
                    this.onEnter();
                }
            });
        }
        onAssetLoaded() {
            if (!this._isOpen)
                return;
            let staticCacheUI = this.staticCacheUI();
            if (staticCacheUI) {
                for (let i = 0; i < staticCacheUI.length; ++i) {
                    let ui = staticCacheUI[i];
                    ui.cacheAs = "bitmap";
                }
            }
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
        registeGUIEvent() {
            let event_list = this.eventMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let gui_control = item[0];
                gui_control.on(item[1], this, item[2], item.slice(3));
            }
        }
        unregisteGUIEvent() {
            let event_list = this.eventMap();
            if (!event_list)
                return;
            for (let item of event_list) {
                let gui_control = item[0];
                gui_control.off(item[1], this, item[2]);
            }
        }
        doClose() {
            if (this._isOpen === false) {
                airkit.Log.error("连续点击");
                return false;
            }
            this._isOpen = false;
            airkit.UIManager.Instance.close(this.UIID, airkit.eCloseAnim.CLOSE_CENTER);
            return true;
        }
    }
    BaseView.__ViewIDSeq = 0;
    airkit.BaseView = BaseView;
})(airkit || (airkit = {}));

(function (airkit) {
    class ColorView extends airkit.BaseView {
        constructor() {
            super();
            this.bgColorTweener = new Laya.Tween();
            this.bgColorChannels = {
                r: 99,
                g: 0,
                b: 0xff
            };
            this.gradientInterval = 5000;
            this.displayObject.blendMode = "lighter";
        }
        setup(args) {
            super.setup(args);
            this.alpha = 0.3;
            if (args && args.blend) {
                this.displayObject.blendMode = args.blend;
            }
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            this.evalBgColor();
            this.sprite = fgui.UIPackage.createObjectFromURL("ui://Game/Light").asCom;
            this.addChild(this.sprite);
            this.sprite.displayObject.blendMode = "multiply";
            this.sprite.setSize(this.width, this.height);
            this.sprite.getTransition("t1").timeScale = 0.3;
            this.sprite.alpha = 0.8;
            this.renderBg();
        }
        destroy(destroyChild) {
            this.sprite.removeFromParent();
            this.sprite.dispose();
            this.sprite = null;
            this.bgColorTweener.clear();
            this.bgColorTweener = null;
            super.dispose();
        }
        evalBgColor() {
            var color = Math.random() * 0xffffff;
            var channels = this.getColorChannals(color);
            this.bgColorTweener.to(this.bgColorChannels, {
                r: channels[0],
                g: channels[1],
                b: channels[2],
                a: 0.2
            }, this.gradientInterval, null, Laya.Handler.create(this, this.onTweenComplete));
        }
        getColorChannals(color) {
            var result = [];
            result.push(color >> 16);
            result.push((color >> 8) & 0xff);
            result.push(color & 0xff);
            return result;
        }
        onTweenComplete() {
            this.evalBgColor();
        }
        debug() {
            let bgColor = "#f4e1e1";
            this.displayObject.graphics.clear();
            this.displayObject.graphics.drawRect(0, 0, this.width, this.height, bgColor);
            this.alpha = 0.4;
        }
        renderBg() {
            this.displayObject.graphics.clear();
            this.displayObject.graphics.drawRect(0, 0, this.width, this.height, this.getHexColorString());
        }
        getHexColorString() {
            this.bgColorChannels.r = Math.floor(this.bgColorChannels.r);
            this.bgColorChannels.g = Math.floor(this.bgColorChannels.g);
            this.bgColorChannels.b = Math.floor(this.bgColorChannels.b);
            var r = this.bgColorChannels.r.toString(16);
            r = r.length == 2 ? r : "0" + r;
            var g = this.bgColorChannels.g.toString(16);
            g = g.length == 2 ? g : "0" + g;
            var b = this.bgColorChannels.b.toString(16);
            b = b.length == 2 ? b : "0" + b;
            return "#" + r + g + b;
        }
        update(dt) {
            super.update(dt);
            this.renderBg();
            return true;
        }
    }
    airkit.ColorView = ColorView;
})(airkit || (airkit = {}));

(function (airkit) {
    class RichImage extends airkit.BaseView {
        get img() {
            if (this._img == null) {
                this._img = new fgui.GLoader();
                this.addChild(this._img);
            }
            return this._img;
        }
        debug() {
            this.displayObject.graphics.clear();
            this.displayObject.graphics.drawRect(0, 0, this.width, this.height, "#00ff00");
        }
        setImage(v, attrs) {
            Object.assign(this.img, attrs);
            let w = attrs.fixedWidth ? attrs.fixedWidth : attrs.width;
            this.setSize(w, this.height);
            this.img.url = v;
        }
        dispose() {
            airkit.DisplayUtils.removeAllChild(this);
            super.dispose();
        }
    }
    airkit.RichImage = RichImage;
})(airkit || (airkit = {}));

(function (airkit) {
    class RichLabel extends fgui.GComponent {
        get label() {
            if (this._label == null) {
                this._label = new fgui.GBasicTextField();
                this.addChild(this._label);
            }
            return this._label;
        }
        setText(v, attrs) {
            Object.assign(this.label, attrs);
            this._text = v;
            this.label.text = v;
            let w = Laya.Browser.measureText(v, attrs.font + " " + attrs.fontSize);
            this._label.setSize(w.width, parseInt(attrs.fontSize));
            this.setSize(this.label.width, this.height);
            this.label.y = (this.height - this.label.height) / 2.0;
        }
        dispose() {
            airkit.DisplayUtils.removeAllChild(this);
            super.dispose();
        }
    }
    airkit.RichLabel = RichLabel;
})(airkit || (airkit = {}));

(function (airkit) {
    let eRichTextType;
    (function (eRichTextType) {
        eRichTextType[eRichTextType["RICH_UNKNOWN"] = 0] = "RICH_UNKNOWN";
        eRichTextType[eRichTextType["RICH_LABEL"] = 1] = "RICH_LABEL";
        eRichTextType[eRichTextType["RICH_IMAGE"] = 2] = "RICH_IMAGE";
        eRichTextType[eRichTextType["RICH_ANIM"] = 3] = "RICH_ANIM";
        eRichTextType[eRichTextType["RICH_BR"] = 4] = "RICH_BR";
    })(eRichTextType = airkit.eRichTextType || (airkit.eRichTextType = {}));
    class RichText extends fgui.GComponent {
        constructor() {
            super(...arguments);
            this.container = [];
            this.texts = [];
            this.lineHeight = 28;
            this.font = airkit.ResourceManager.FONT_DEFAULT;
            this.fontSize = 22;
            this.color = "#ffffff";
            this.pointAtX = 0;
            this.pointAtY = 0;
        }
        debug() {
            this.displayObject.graphics.clear();
            this.displayObject.graphics.drawRect(0, 0, this.width, this.height, "#000000");
        }
        parseHtml(content) {
            let reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>([^>]*?<\/(img|p|font|anim)>)?/gi;
            return content.match(reg);
        }
        convertTagType(tag) {
            if (tag == "p" || tag == "font") {
                return eRichTextType.RICH_LABEL;
            }
            if (tag == "img") {
                return eRichTextType.RICH_IMAGE;
            }
            if (tag == "anim") {
                return eRichTextType.RICH_ANIM;
            }
            if (tag == "br") {
                return eRichTextType.RICH_BR;
            }
            return eRichTextType.RICH_UNKNOWN;
        }
        praseTag(tag) {
            let dic = {
                tag: "",
                type: eRichTextType.RICH_UNKNOWN,
                src: "",
                attrs: {}
            };
            let reg = /<\/?(img|p|font|anim|br)\b([^>]*?)\/?>/;
            let match = tag.match(reg);
            dic.tag = match[1];
            dic.type = this.convertTagType(dic.tag);
            switch (dic.type) {
                case eRichTextType.RICH_BR: {
                    return dic;
                }
            }
            let startAttrsPos = tag.indexOf(" ") + 1;
            let endAttrsPos = tag.indexOf(">");
            let text = tag.substr(startAttrsPos, endAttrsPos - startAttrsPos);
            if (text) {
                let arrs = text.split(" ");
                if (arrs && arrs.length > 0) {
                    for (let i = 0; i < arrs.length; i++) {
                        let v = arrs[i].split("=");
                        if (v && v.length > 1) {
                            dic.attrs[v[0]] = v[1].replace(/('|")/g, "");
                        }
                    }
                }
            }
            let defaults = ["font", "fontSize", "color"];
            for (let k = 0; k < defaults.length; k++) {
                let key = defaults[k];
                if (dic.attrs[key] == null) {
                    dic.attrs[key] = this[key];
                }
            }
            if (dic.type == eRichTextType.RICH_LABEL) {
                let startSrcPos = tag.indexOf(">") + 1;
                let endSrcPos = tag.lastIndexOf("</");
                dic.src = tag.substr(startSrcPos, endSrcPos - startSrcPos);
            } else if (dic.type == eRichTextType.RICH_IMAGE) {
                dic.src = dic.attrs["src"];
            }
            return dic;
        }
        cleanText() {
            for (let i = this.container.length - 1; i >= 0; i--) {
                let child = this.container[i];
                this.removeChild(child);
                child.dispose();
            }
            this.container = [];
            this.texts = [];
            this.pointAtX = 0;
            this.pointAtY = 0;
        }
        setText(content) {
            if (content == null)
                return;
            this.cleanText();
            this.appendText(content);
        }
        processSplitLine(dic) {
            switch (dic.type) {
                case eRichTextType.RICH_LABEL: {
                    return this.processSplitLabel(dic);
                }
                case eRichTextType.RICH_BR: {
                    return this.processSplitBR(dic);
                }
                case eRichTextType.RICH_IMAGE: {
                    return this.processSplitImage(dic);
                }
            }
        }
        processSplitImage(dic) {
            let w = parseInt(dic.attrs.width);
            if (dic.attrs.fixedWidth) {
                w = parseInt(dic.attrs.fixedWidth);
            }
            if (this.pointAtX + w <= this.width) {
                dic.x = this.pointAtX;
                dic.y = this.pointAtY;
                this.pointAtX += w;
            } else {
                this.pointAtX = w;
                this.pointAtY += this.lineHeight;
                dic.x = 0;
                dic.y = this.pointAtY;
            }
            return [dic];
        }
        processSplitBR(dic) {
            this.pointAtX = 0;
            this.pointAtY += this.lineHeight;
            return [];
        }
        processSplitLabel(dic) {
            let ret = [];
            let fontStr = dic.attrs.fontSize + "px " + dic.attrs.font;
            let tm = Laya.Browser.measureText(dic.src, fontStr);
            if (this.pointAtX + tm.width <= this.width) {
                dic.x = this.pointAtX;
                dic.y = this.pointAtY;
                ret.push(dic);
                this.pointAtX += tm.width;
                return ret;
            } else {
                let txt = dic.src;
                let _pointAtX = this.pointAtX;
                let _pointAtY = this.pointAtY;
                let pos = 0;
                for (var i = 0, n = txt.length; i < n; i++) {
                    let stm = Laya.Browser.measureText(txt.charAt(i), fontStr);
                    if (this.pointAtX + stm.width > this.width) {
                        let temp = airkit.ClassUtils.copyObject(dic);
                        temp.src = txt.substr(pos, i - pos);
                        temp.x = _pointAtX;
                        temp.y = _pointAtY;
                        ret.push(temp);
                        this.pointAtX = stm.width;
                        this.pointAtY += this.lineHeight;
                        _pointAtX = 0;
                        _pointAtY = this.pointAtY;
                        pos = i;
                    } else {
                        this.pointAtX += stm.width;
                    }
                }
                if (pos <= txt.length - 1) {
                    let temp = airkit.ClassUtils.copyObject(dic);
                    temp.src = txt.substr(pos);
                    temp.x = _pointAtX;
                    temp.y = _pointAtY;
                    ret.push(temp);
                }
            }
            return ret;
        }
        addTag(tag) {
            let dic = this.praseTag(tag);
            let arr = this.processSplitLine(dic);
            switch (dic.type) {
                case eRichTextType.RICH_LABEL: {
                    for (let i = 0; i < arr.length; i++) {
                        let label = new airkit.RichLabel();
                        label.height = this.lineHeight;
                        this.addChild(label);
                        let attrs = this.convertAttrs(arr[i].attrs);
                        label.setText(arr[i].src, attrs);
                        label.x = arr[i].x;
                        label.y = arr[i].y;
                        this.container.push(label);
                    }
                    break;
                }
                case eRichTextType.RICH_IMAGE: {
                    for (let i = 0; i < arr.length; i++) {
                        let img = new airkit.RichImage();
                        img.height = this.lineHeight;
                        this.addChild(img);
                        let attrs = this.convertAttrs(arr[i].attrs);
                        img.setImage(arr[i].src, attrs);
                        img.x = arr[i].x;
                        img.y = arr[i].y;
                        this.container.push(img);
                    }
                    break;
                }
                case eRichTextType.RICH_BR: {
                    break;
                }
            }
        }
        convertAttrs(attrs) {
            let intVs = ["centerX", "centerY", "width", "height", "fixedHeight"];
            for (let i = 0; i < intVs.length; i++) {
                let key = intVs[i];
                if (attrs[key]) {
                    attrs[key] = parseFloat(attrs[key]);
                }
            }
            return attrs;
        }
        appendText(content) {
            if (this.width <= 0) {
                airkit.Log.warning("must set RichText width first");
                return;
            }
            let tags = this.parseHtml(content);
            if (tags && tags.length > 0) {
                for (let i = 0; i < tags.length; i++) {
                    this.addTag(tags[i]);
                }
            }
        }
    }
    airkit.RichText = RichText;
})(airkit || (airkit = {}));

(function (airkit) {
    class TextFormat {
        constructor() {}
    }
    airkit.TextFormat = TextFormat;
})(airkit || (airkit = {}));

(function (airkit) {
    class State {
        constructor(entity, status) {
            this._owner = null;
            this._status = 0;
            this._times = 0;
            this._tick = 0;
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
                payload: JSON.stringify(this.data)
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
            this.receiveByte = new Laya.Byte();
            this.receiveByte.endian = Laya.Byte.LITTLE_ENDIAN;
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
                let data = new Laya.Byte();
                data.writeArrayBuffer(this.receiveByte, 4, len);
                return true;
            }
            return false;
        }
        encode(endian) {
            let msg = new Laya.Byte();
            msg.endian = Laya.Byte.LITTLE_ENDIAN;
            msg.pos = 0;
            return msg;
        }
    }
    airkit.PBMsg = PBMsg;
})(airkit || (airkit = {}));

(function (airkit) {
    class SocketStatus {}
    SocketStatus.SOCKET_CONNECT = "1";
    SocketStatus.SOCKET_RECONNECT = "2";
    SocketStatus.SOCKET_START_RECONNECT = "3";
    SocketStatus.SOCKET_CLOSE = "4";
    SocketStatus.SOCKET_NOCONNECT = "5";
    SocketStatus.SOCKET_DATA = "6";
    airkit.SocketStatus = SocketStatus;
    let eSocketMsgType;
    (function (eSocketMsgType) {
        eSocketMsgType[eSocketMsgType["MTRequest"] = 1] = "MTRequest";
        eSocketMsgType[eSocketMsgType["MTResponse"] = 2] = "MTResponse";
        eSocketMsgType[eSocketMsgType["MTNotify"] = 3] = "MTNotify";
        eSocketMsgType[eSocketMsgType["MTBroadcast"] = 4] = "MTBroadcast";
    })(eSocketMsgType = airkit.eSocketMsgType || (airkit.eSocketMsgType = {}));
    class WebSocket extends Laya.EventDispatcher {
        constructor() {
            super();
            this.mSocket = null;
            this._needReconnect = false;
            this._maxReconnectCount = 10;
            this._reconnectCount = 0;
            this._requestTimeout = 10 * 1000;
        }
        initServer(host, port, msgCls, endian = Laya.Byte.BIG_ENDIAN) {
            this.mHost = host;
            this.mPort = port;
            this.mEndian = endian;
            this._handers = new airkit.NDictionary();
            this._clsName = "message";
            Laya.ClassUtils.regClass(this._clsName, msgCls);
            this.connect();
        }
        connect() {
            this.mSocket = new Laya.Socket();
            this.mSocket.endian = this.mEndian;
            this.addEvents();
            this.mSocket.connect(this.mHost, this.mPort);
        }
        addEvents() {
            this.mSocket.on(Laya.Event.OPEN, this, this.onSocketOpen);
            this.mSocket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
            this.mSocket.on(Laya.Event.CLOSE, this, this.onSocketClose);
            this.mSocket.on(Laya.Event.ERROR, this, this.onSocketError);
        }
        removeEvents() {
            this.mSocket.off(Laya.Event.OPEN, this, this.onSocketOpen);
            this.mSocket.off(Laya.Event.MESSAGE, this, this.onReceiveMessage);
            this.mSocket.off(Laya.Event.CLOSE, this, this.onSocketClose);
            this.mSocket.off(Laya.Event.ERROR, this, this.onSocketError);
        }
        onSocketOpen(event = null) {
            this._reconnectCount = 0;
            this._isConnecting = true;
            if (this._connectFlag && this._needReconnect) {
                this.event(SocketStatus.SOCKET_RECONNECT);
            } else {
                this.event(SocketStatus.SOCKET_CONNECT);
            }
            this._connectFlag = true;
        }
        onSocketClose(e = null) {
            this._isConnecting = false;
            if (this._needReconnect) {
                this.event(SocketStatus.SOCKET_START_RECONNECT);
                this.reconnect();
            } else {
                this.event(SocketStatus.SOCKET_CLOSE);
            }
        }
        onSocketError(e = null) {
            if (this._needReconnect) {
                this.reconnect();
            } else {
                this.event(SocketStatus.SOCKET_NOCONNECT);
            }
            this._isConnecting = false;
        }
        reconnect() {
            this.closeCurrentSocket();
            this._reconnectCount++;
            if (this._reconnectCount < this._maxReconnectCount) {
                this.connect();
            } else {
                this._reconnectCount = 0;
            }
        }
        onReceiveMessage(msg = null) {
            let clas = Laya.ClassUtils.getClass(this._clsName);
            let obj = new clas();
            if (!obj.decode(msg, this.mEndian)) {
                airkit.Log.error("decode msg faild {0}", msg);
                return;
            }
            let hander = this._handers.getValue(obj.getID());
            if (hander) {
                hander(obj);
            } else {
                this.event(SocketStatus.SOCKET_DATA, obj);
            }
        }
        request(req) {
            return new Promise((resolve, reject) => {
                var buf = req.encode(this.mEndian);
                let handerID = req.getID();
                if (buf) {
                    let id = airkit.TimerManager.Instance.addOnce(this._requestTimeout, null, () => {
                        this._handers.remove(handerID);
                        reject("timeout");
                    });
                    this._handers.add(handerID, (resp) => {
                        airkit.TimerManager.Instance.removeTimer(id);
                        resolve(resp);
                    });
                    airkit.Log.info("start request ws {0}", buf);
                    this.mSocket.send(buf);
                }
            });
        }
        close() {
            this._connectFlag = false;
            this._handers.clear();
            this.closeCurrentSocket();
        }
        closeCurrentSocket() {
            this.removeEvents();
            this.mSocket.close();
            this.mSocket = null;
            this._isConnecting = false;
        }
        isConnecting() {
            return this._isConnecting;
        }
    }
    airkit.WebSocket = WebSocket;
})(airkit || (airkit = {}));

(function (airkit) {
    class Layer extends fgui.GComponent {
        constructor() {
            super();
        }
        debug() {
            let bgColor = "#f4e1e188";
        }
    }
    airkit.Layer = Layer;
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
                case airkit.eUILayer.POPUP:
                    layer = this.popupLayer;
                    break;
                case airkit.eUILayer.TOOLTIP:
                    layer = this.tooltipLayer;
                    break;
                case airkit.eUILayer.SYSTEM:
                    layer = this.systemLayer;
                    break;
                case airkit.eUILayer.LOADING:
                    layer = this.loadingLayer;
                    break;
                case airkit.eUILayer.TOP:
                    layer = this.topLayer;
                    break;
            }
            if (displayWidth() != layer.width ||
                displayHeight() != layer.height) {
                layer.width = displayWidth();
                layer.height = displayHeight();
            }
            return layer;
        }
        static setup(root) {
            this._root = root;
            this._bgLayer = new Layer();
            this._bgLayer.displayObject.name = "bgLayer";
            this._bgLayer.touchable = true;
            this._root.addChild(this._bgLayer);
            this._bgLayer.sortingOrder = 0;
            this._mainLayer = new Layer();
            this._mainLayer.displayObject.name = "mainLayer";
            this._mainLayer.touchable = true;
            this._root.addChild(this._mainLayer);
            this._mainLayer.sortingOrder = 2;
            this._tooltipLayer = new Layer();
            this._tooltipLayer.displayObject.name = "tooltipLayer";
            this._tooltipLayer.touchable = false;
            this._root.addChild(this._tooltipLayer);
            this._tooltipLayer.sortingOrder = 3;
            this._uiLayer = new Layer();
            this._uiLayer.displayObject.name = "uiLayer";
            this._uiLayer.touchable = true;
            this._root.addChild(this._uiLayer);
            this._uiLayer.sortingOrder = 4;
            this._popupLayer = new Layer();
            this._popupLayer.displayObject.name = "popupLayer";
            this._popupLayer.touchable = true;
            this._root.addChild(this._popupLayer);
            this._popupLayer.sortingOrder = 5;
            this._systemLayer = new Layer();
            this._systemLayer.displayObject.name = "systemLayer";
            this._systemLayer.touchable = true;
            this._root.addChild(this._systemLayer);
            this._systemLayer.sortingOrder = 6;
            this._loadingLayer = new Layer();
            this._loadingLayer.displayObject.name = "loadingLayer";
            this._loadingLayer.touchable = true;
            this._root.addChild(this._loadingLayer);
            this._loadingLayer.sortingOrder = 1001;
            this._topLayer = new Layer();
            this._topLayer.displayObject.name = "topLayer";
            this._topLayer.touchable = true;
            this._root.addChild(this._topLayer);
            this._topLayer.sortingOrder = 1002;
            this.layers = [
                this._bgLayer,
                this._mainLayer,
                this._uiLayer,
                this._popupLayer,
                this._tooltipLayer,
                this._systemLayer,
                this._loadingLayer,
                this._topLayer
            ];
            this.registerEvent();
            this.resize(null);
        }
        static registerEvent() {
            Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
        }
        static unRegisterEvent() {
            Laya.stage.off(Laya.Event.RESIZE, this, this.resize);
        }
        static resize(e) {
            airkit.Log.info("LayerManager Receive Resize {0} {1}", displayWidth(), displayHeight());
            var i;
            var l;
            let w = displayWidth();
            let h = displayHeight();
            fgui.GRoot.inst.setSize(w, h);
            for (i = 0, l = this.layers.length; i < l; i++) {
                this.layers[i].setSize(w, h);
            }
            if (this._bgLayer.numChildren) {
                var bg = this._bgLayer.getChildAt(0);
                let x = (w - LayerManager.BG_WIDTH) >> 1;
                let y = h - LayerManager.BG_HEIGHT;
                bg.setXY(x, y);
            }
            fgui.GRoot.inst.setSize(w, h);
            let needUpChilds = [
                this._uiLayer,
                this._popupLayer,
                this._systemLayer,
                this._topLayer,
                this._loadingLayer
            ];
            for (let i = 0; i < needUpChilds.length; i++) {
                let layer = needUpChilds[i];
                for (let j = 0, l = layer.numChildren; j < l; j++) {
                    var child = layer.getChildAt(j);
                    child.setSize(w, h);
                }
            }
        }
        static destroy() {
            LayerManager.removeAll();
            airkit.DisplayUtils.removeAllChild(this._topLayer);
            airkit.DisplayUtils.removeAllChild(this._root);
            this._topLayer = null;
            this._loadingLayer = null;
            this._systemLayer = null;
            this._tooltipLayer = null;
            this._popupLayer = null;
            this._uiLayer = null;
            this._mainLayer = null;
            this._bgLayer = null;
        }
        static removeAll() {
            airkit.DisplayUtils.removeAllChild(this._bgLayer);
            airkit.DisplayUtils.removeAllChild(this._mainLayer);
            airkit.DisplayUtils.removeAllChild(this._uiLayer);
            airkit.DisplayUtils.removeAllChild(this._popupLayer);
            airkit.DisplayUtils.removeAllChild(this._tooltipLayer);
            airkit.DisplayUtils.removeAllChild(this._systemLayer);
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
                child.x = (displayWidth() - LayerManager.BG_WIDTH) >> 1;
                child.y = displayHeight() - LayerManager.BG_HEIGHT;
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
        static get popupLayer() {
            return this._popupLayer;
        }
        static get tooltipLayer() {
            return this._tooltipLayer;
        }
        static get systemLayer() {
            return this._systemLayer;
        }
        static get loadingLayer() {
            return this._loadingLayer;
        }
        static get topLayer() {
            return this._topLayer;
        }
    }
    LayerManager.BG_WIDTH = 750;
    LayerManager.BG_HEIGHT = 1650;
    airkit.LayerManager = LayerManager;
})(airkit || (airkit = {}));

(function (airkit) {
    class PopupView extends airkit.BaseView {
        constructor() {
            super();
            this.bgTouch = true;
        }
        update(dt) {
            return super.update(dt);
        }
        setup(args) {
            super.setup(args);
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        }
        onEnter() {
            super.onEnter();
            this.createPanel(this.pkgName, this.resName);
            let panel = this.panel();
            if (panel) {
                airkit.DisplayUtils.popup(panel, Laya.Handler.create(this, this.onOpen));
                this.closeBtn = this.closeButton();
                if (this.closeBtn) {
                    this.closeBtn.visible = false;
                }
            }
            airkit.TimerManager.Instance.addOnce(250, this, this.setupTouchClose);
        }
        onOpen() {}
        closeButton() {
            let btn = this.panel().getChild("closeBtn");
            if (btn != null)
                return btn.asButton;
            return null;
        }
        setupTouchClose() {
            let bg = this.bg();
            if (bg && this.bgTouch) {
                bg.touchable = true;
                bg.onClick(this, this.onClose);
            }
            if (this.closeBtn) {
                this.closeBtn.visible = true;
                this.closeBtn.onClick(this, this.pressClose);
            }
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
        loadResource(group, clas) {
            return super.loadResource(group, clas);
        }
    }
    airkit.PopupView = PopupView;
})(airkit || (airkit = {}));

(function (airkit) {
    class SceneManager {
        static registerScene(scene_type, name, cls) {
            SceneManager.scenes.add(scene_type, name);
            Laya.ClassUtils.regClass(name, cls);
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
            if (this._curScene) {
                this._curScene.update(dt);
            }
        }
        registerEvent() {
            airkit.EventCenter.addEventListener(airkit.EventID.CHANGE_SCENE, this, this.onChangeScene);
            Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
        }
        unRegisterEvent() {
            airkit.EventCenter.removeEventListener(airkit.EventID.CHANGE_SCENE, this, this.onChangeScene);
            Laya.stage.off(Laya.Event.RESIZE, this, this.resize);
        }
        resize(e) {
            airkit.Log.info("SceneManager Receive Resize {0} {1}", displayWidth(), displayHeight());
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
        onComplete(v) {
            this._curScene = v;
        }
        gotoScene(scene_type, args) {
            this.exitScene();
            let sceneName = SceneManager.scenes.getValue(scene_type);
            let clas = Laya.ClassUtils.getClass(sceneName);
            let scene = new clas();
            scene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            scene.setup(args);
            scene
                .loadResource(airkit.ResourceManager.DefaultGroup, clas)
                .then(v => {
                    this.onComplete(v);
                })
                .catch(e => {
                    airkit.Log.error(e);
                });
            airkit.LayerManager.mainLayer.addChild(scene);
        }
        exitScene() {
            if (this._curScene) {
                this._curScene.removeFromParent();
                this._curScene.dispose();
                this._curScene = null;
                airkit.UIManager.Instance.closeAll();
                airkit.ResourceManager.Instance.removeAllAniAnim();
                airkit.ObjectPools.clearAll();
                airkit.ResourceManager.Instance.cleanTexture(airkit.ResourceManager.DefaultGroup);
                airkit.ResourceManager.Instance.removeAllAniAnim("default");
                airkit.ResourceManager.Instance.removeSpineTempletGroup("default");
                Laya.Scene.gc();
            }
        }
    }
    SceneManager.scenes = new airkit.NDictionary();
    SceneManager.instance = null;
    airkit.SceneManager = SceneManager;
})(airkit || (airkit = {}));

(function (airkit) {
    class UIManager extends airkit.Singleton {
        constructor() {
            super();
            this._dicConfig = null;
            this._dicUIView = null;
            this._UIQueues = null;
            this._dicConfig = new airkit.NDictionary();
            this._dicUIView = new airkit.NDictionary();
            this._UIQueues = new airkit.NDictionary();
            this._UIQueues.add(airkit.eUIQueueType.POPUP, new UIQueue());
            this._UIQueues.add(airkit.eUIQueueType.ALERT, new UIQueue());
        }
        static get Instance() {
            if (!this.instance)
                this.instance = new UIManager();
            return this.instance;
        }
        empty() {
            let queue = this._UIQueues.getValue(airkit.eUIQueueType.POPUP);
            if (!queue.empty())
                return false;
            if (this._dicUIView.length > 0)
                return false;
            return true;
        }
        show(id, ...args) {
            return new Promise((resolve, reject) => {
                airkit.Log.info("show panel {0}", id);
                let obj = this._dicUIView.getValue(id);
                if (obj != null) {
                    if (obj["displayObject"] == null) {
                        this._dicUIView.remove(id);
                        obj = null;
                    } else {
                        obj.setVisible(true);
                        resolve(obj);
                        return;
                    }
                }
                let conf = this._dicConfig.getValue(id);
                airkit.assert(conf != null, "UIManager::Show - not find id:" + conf.mID);
                let params = args.slice(0);
                let clas = Laya.ClassUtils.getClass(conf.name);
                let v = new clas();
                airkit.assert(v != null, "UIManager::Show - cannot create ui:" + id);
                v.setUIID(id);
                v.setup(params);
                v.loadResource(airkit.ResourceManager.DefaultGroup, clas)
                    .then(p => {
                        let layer = airkit.LayerManager.getLayer(conf.mLayer);
                        layer.addChild(p);
                        this._dicUIView.add(id, p);
                        resolve(p);
                    })
                    .catch(e => {
                        airkit.Log.error(e);
                    });
            });
        }
        close(id, animType = 0) {
            return new Promise((resolve, reject) => {
                airkit.Log.info("close panel {0}", id);
                let loader_info = this._dicConfig.getValue(id);
                airkit.assert(loader_info != null, "UIManager::Close - not find id:" + loader_info.mID);
                let panel = this._dicUIView.getValue(id);
                if (!panel)
                    return;
                if (animType == 0) {
                    let result = this.clearPanel(id, panel, loader_info);
                    resolve([id, result]);
                } else {
                    airkit.DisplayUtils.hide(panel, Laya.Handler.create(null, v => {
                        let result = this.clearPanel(id, panel, loader_info);
                        resolve([id, result]);
                    }));
                }
            });
        }
        clearPanel(id, panel, loader_info) {
            if (loader_info.mHideDestroy) {
                this._dicUIView.remove(id);
                airkit.Log.info("clear panel {0}", id);
                panel.removeFromParent();
                panel.dispose();
                return true;
            } else {
                panel.setVisible(false);
                return false;
            }
        }
        closeAll(exclude_list = null) {
            this._dicUIView.foreach(function (key, value) {
                if (exclude_list && airkit.ArrayUtils.containsValue(exclude_list, key))
                    return true;
                UIManager.Instance.close(key);
                return true;
            });
        }
        popup(id, ...args) {
            this._UIQueues.getValue(airkit.eUIQueueType.POPUP).show(id, args);
        }
        alert(id, ...args) {
            this._UIQueues.getValue(airkit.eUIQueueType.ALERT).show(id, args);
        }
        findPanel(id) {
            let panel = this._dicUIView.getValue(id);
            return panel;
        }
        isPanelOpen(id) {
            let panel = this._dicUIView.getValue(id);
            if (panel)
                return true;
            else
                return false;
        }
        tipsPopup(toastLayer, target, view, duration = 0.5, fromProps = null, toProps = null, usePool = true) {
            return new Promise((resolve, reject) => {
                toastLayer.addChild(view);
                view.setScale(0.1, 0.1);
                let point = target.localToGlobal(target.width / 2.0 - target.pivotX * target.width, target.height * 0.382 - target.pivotY * target.height);
                let localPoint = toastLayer.globalToLocal(point.x, point.y);
                let start = 0;
                let offset = 600;
                let type = fgui.EaseType.BounceOut;
                if (duration > 1.5) {
                    start = toastLayer.height + 600;
                    offset = -600;
                    type = fgui.EaseType.QuadOut;
                    view.setXY(localPoint.x, start);
                } else {
                    view.setXY(localPoint.x, start - 200);
                }
                airkit.TweenUtils.get(view)
                    .delay(1.5)
                    .to({
                        scaleX: 1.0,
                        scaleY: 1.0,
                        alpha: 1.0,
                        x: localPoint.x,
                        y: localPoint.y
                    }, duration, type)
                    .delay(0.5)
                    .to({
                        x: localPoint.x,
                        y: start - offset
                    }, duration, fgui.EaseType.ExpoOut, Laya.Handler.create(null, () => {
                        view.removeFromParent();
                        resolve();
                    }));
            });
        }
        singleToast(toastLayer, target, view, duration = 0.5, speedUp, usePool = true, x = null, y = null) {
            return new Promise((resolve, reject) => {
                let key = "_single_toast";
                if (target[key] == null) {
                    target[key] = [];
                }
                let inEase = fgui.EaseType.QuadOut;
                let outEase = fgui.EaseType.QuadIn;
                toastLayer.addChild(view);
                let k = airkit.ClassUtils.classKey(view);
                for (var i in target[key]) {
                    let o = target[key][i];
                    if (o) {
                        o["toY"] -= o.height + 5;
                        if (airkit.ClassUtils.classKey(o) == k) {
                            o.visible = false;
                        }
                    }
                }
                target[key].push(view);
                view.visible = true;
                view.setScale(0.1, 0.1);
                if (x == null)
                    x = target.width / 2.0 - target.pivotX * target.width;
                if (y == null)
                    y = target.height * 0.382 - target.pivotY * target.height;
                let point = target.localToGlobal(x, y);
                let localPoint = toastLayer.globalToLocal(point.x, point.y);
                view.setXY(localPoint.x, localPoint.y);
                view["toY"] = view.y;
                let tu = airkit.TweenUtils.get(view);
                tu.setOnUpdate((gt) => {
                    let toY = view["toY"];
                    if (toY < view.y) {
                        let offset = (toY - view.y) * 0.4;
                        let limit = -5 - Math.ceil(view.height / 50);
                        if (offset < limit)
                            offset = limit;
                        view.y += offset;
                    }
                });
                let scale = 1.0;
                tu.to({
                    scaleX: scale,
                    scaleY: scale,
                    alpha: 1.0
                }, duration, inEase).to({
                    alpha: 0.4
                }, duration * 0.7, outEase, Laya.Handler.create(this, () => {
                    target[key].splice(target[key].indexOf(view), 1);
                    if (target && view && view["parent"]) {
                        view.removeFromParent();
                        tu.clear();
                    }
                    if (usePool) {
                        airkit.ObjectPools.recover(view);
                    } else {
                        view.dispose();
                    }
                    resolve();
                }));
            });
        }
        toast(toastLayer, target, view, duration = 0.5, speedUp, usePool = true, x = null, y = null) {
            return new Promise((resolve, reject) => {
                if (target["_toastList"] == null) {
                    target["_toastList"] = [];
                }
                let inEase = fgui.EaseType.QuadOut;
                let outEase = fgui.EaseType.QuadIn;
                toastLayer.addChild(view);
                if (speedUp) {
                    for (var i in target["_toastList"]) {
                        if (target["_toastList"][i]) {
                            target["_toastList"][i]["toY"] -= target["_toastList"][i].height + 8;
                            target["_toastList"][i].visible = false;
                        }
                    }
                    duration = duration;
                    inEase = fgui.EaseType.BounceOut;
                    outEase = fgui.EaseType.BounceIn;
                } else {
                    for (var i in target["_toastList"]) {
                        if (target["_toastList"][i]) {
                            target["_toastList"][i]["toY"] -= target["_toastList"][i].height + 8;
                        }
                    }
                }
                target["_toastList"].push(view);
                view.setScale(0.1, 0.1);
                if (x == null)
                    x = target.width / 2.0 - target.pivotX * target.width;
                if (y == null)
                    y = target.height * 0.382 - target.pivotY * target.height;
                let point = target.localToGlobal(x, y);
                let localPoint = toastLayer.globalToLocal(point.x, point.y);
                view.setXY(localPoint.x, localPoint.y);
                view["toY"] = view.y;
                let tu = airkit.TweenUtils.get(view);
                tu.setOnUpdate((gt) => {
                    let toY = view["toY"];
                    if (toY < view.y) {
                        let offset = (toY - view.y) * 0.4;
                        let limit = -8 - Math.ceil(view.height / 50);
                        if (offset < limit)
                            offset = limit;
                        view.y += offset;
                    }
                });
                let scale = speedUp ? 1.0 : 1.0;
                tu.to({
                    scaleX: scale,
                    scaleY: scale,
                    alpha: 1.0
                }, duration, inEase).to({
                    alpha: 0.4
                }, duration * 0.7, outEase, Laya.Handler.create(this, () => {
                    target["_toastList"].splice(target["_toastList"].indexOf(view), 1);
                    if (target && view && view["parent"]) {
                        view.removeFromParent();
                        tu.clear();
                    }
                    if (usePool) {
                        airkit.ObjectPools.recover(view);
                    } else {
                        view.dispose();
                    }
                    resolve();
                }));
            });
        }
        setup() {}
        destroy() {
            this.closeAll();
            this.clearUIConfig();
        }
        update(dt) {
            this._dicUIView.foreach(function (key, value) {
                value.update(dt);
                return true;
            });
        }
        addUIConfig(info) {
            if (this._dicConfig.containsKey(info.mID)) {
                airkit.Log.error("UIManager::Push UIConfig - same id is register:" + info.mID);
                return;
            }
            this._dicConfig.add(info.mID, info);
            Laya.ClassUtils.regClass(info.name, info.cls);
        }
        clearUIConfig() {
            this._dicConfig.clear();
        }
        getUIConfig(id) {
            return this._dicConfig.getValue(id);
        }
        getUILayerID(id) {
            let info = this._dicConfig.getValue(id);
            if (!info) {
                return -1;
            }
            return info.mLayer;
        }
    }
    UIManager.instance = null;
    airkit.UIManager = UIManager;
    class AlertInfo {
        constructor(callback, title = "", content, tips = "", buttons = {}, param = null) {
            this.title = "";
            this.tips = "";
            this.buttons = [];
            this.param = null;
            this.callback = callback;
            this.title = title;
            this.content = content;
            this.tips = tips;
            this.buttons = buttons;
            this.param = param;
        }
    }
    airkit.AlertInfo = AlertInfo;
    class UIConfig {
        constructor(id, name, cls, layer, destroy, alige) {
            this.mID = id;
            this.name = name;
            this.cls = cls;
            this.mLayer = layer;
            this.mHideDestroy = destroy;
            this.mAlige = alige;
        }
    }
    airkit.UIConfig = UIConfig;
    class UIQueue {
        constructor() {
            this._currentUI = 0;
            this._currentUI = 0;
            this._listPanels = new airkit.Queue();
        }
        show(id, args) {
            let info = [id, args];
            this._listPanels.enqueue(info);
            this.checkAlertNext();
        }
        empty() {
            if (this._currentUI > 0 || this._listPanels.length > 0)
                return false;
            return true;
        }
        checkAlertNext() {
            if (this._currentUI > 0 || this._listPanels.length <= 0)
                return;
            let info = this._listPanels.dequeue();
            this.registerEvent();
            this._currentUI = info[0];
            UIManager.Instance.show(info[0], ...info[1]);
        }
        registerEvent() {
            airkit.EventCenter.addEventListener(airkit.EventID.UI_CLOSE, this, this.onUIEvent);
        }
        unRegisterEvent() {
            airkit.EventCenter.removeEventListener(airkit.EventID.UI_CLOSE, this, this.onUIEvent);
        }
        onUIEvent(args) {
            switch (args.type) {
                case airkit.EventID.UI_CLOSE:
                    let id = args.get(0);
                    if (this._currentUI > 0 && this._currentUI == id) {
                        this._currentUI = 0;
                        this.unRegisterEvent();
                        this.checkAlertNext();
                    }
                    break;
            }
        }
    }
})(airkit || (airkit = {}));

(function (airkit) {
    class LocalDB {
        static setGlobalKey(key) {
            this._globalKey = key;
        }
        static has(key) {
            return Laya.LocalStorage.getItem(this.getFullKey(key)) != null;
        }
        static getInt(key) {
            return parseInt(Laya.LocalStorage.getItem(this.getFullKey(key)));
        }
        static setInt(key, value) {
            Laya.LocalStorage.setItem(this.getFullKey(key), value.toString());
        }
        static getFloat(key) {
            return parseInt(Laya.LocalStorage.getItem(this.getFullKey(key)));
        }
        static setFloat(key, value) {
            Laya.LocalStorage.setItem(this.getFullKey(key), value.toString());
        }
        static getString(key) {
            return Laya.LocalStorage.getItem(this.getFullKey(key));
        }
        static setString(key, value) {
            Laya.LocalStorage.setItem(this.getFullKey(key), value);
        }
        static remove(key) {
            Laya.LocalStorage.removeItem(this.getFullKey(key));
        }
        static clear() {
            Laya.LocalStorage.clear();
        }
        static getFullKey(key) {
            return this._globalKey + "_" + key;
        }
    }
    LocalDB._globalKey = "";
    airkit.LocalDB = LocalDB;
})(airkit || (airkit = {}));

(function (airkit) {
    class IntervalTimer {
        constructor() {
            this._nowTime = 0;
        }
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

(function (airkit) {
    class Timer {
        static Start() {
            this._startTime = Laya.timer.currTimer;
        }
        static get deltaTimeMS() {
            return Laya.timer.delta;
        }
        static get fixedDeltaTime() {
            return 0;
        }
        static get time() {
            return Laya.timer.currTimer;
        }
        static get timeSinceStartup() {
            return Laya.timer.currTimer - this._startTime;
        }
        static get frameCount() {
            return Laya.timer.currFrame;
        }
        static get timeScale() {
            return Laya.timer.scale;
        }
        static set timeScale(scale) {
            Laya.timer.scale = scale;
        }
    }
    Timer._startTime = 0;
    airkit.Timer = Timer;
})(airkit || (airkit = {}));

(function (airkit) {
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
        addLoop(rate, ticks, caller, method, args = null) {
            if (ticks <= 0)
                ticks = 0;
            let timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            if (args != null)
                airkit.ArrayUtils.insert(args, this._idCounter, 0);
            let handler = Laya.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, ticks, handler);
            this._timers.push(timer);
            return timer.id;
        }
        addOnce(rate, caller, method, args = null) {
            let timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            if (args != null)
                airkit.ArrayUtils.insert(args, this._idCounter, 0);
            let handler = Laya.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, 1, handler);
            this._timers.push(timer);
            return timer.id;
        }
        removeTimer(timerId) {
            this._removalPending.push(timerId);
        }
        remove() {
            let t;
            if (this._removalPending.length > 0) {
                for (let id of this._removalPending) {
                    for (let i = 0; i < this._timers.length; i++) {
                        t = this._timers[i];
                        if (t.id == id) {
                            t.clear();
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
        init() {}
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
            if (this.isActive && this.mTime.update(airkit.Timer.deltaTimeMS)) {
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
    let eArraySortOrder;
    (function (eArraySortOrder) {
        eArraySortOrder[eArraySortOrder["ASCENDING"] = 0] = "ASCENDING";
        eArraySortOrder[eArraySortOrder["DESCENDING"] = 1] = "DESCENDING";
    })(eArraySortOrder = airkit.eArraySortOrder || (airkit.eArraySortOrder = {}));
    class ArrayUtils {
        static insert(arr, value, index) {
            if (index > arr.length - 1) {
                arr.push(value);
            } else {
                arr.splice(index, 0, value);
            }
        }
        static isArray(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }
        static equip(arr, v) {
            if (!arr || !v)
                return false;
            if (arr.length != v.length)
                return false;
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] instanceof Array && v[i] instanceof Array) {
                    if (!arr[i].equals(v[i]))
                        return false;
                } else if (arr[i] != v[i]) {
                    return false;
                }
            }
            return true;
        }
        static removeValue(arr, v) {
            if (Array.isArray(v)) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (this.equip(arr[i], v)) {
                        arr.splice(i, 1);
                    }
                }
            } else {
                let i = arr.indexOf(v);
                if (i != -1) {
                    arr.splice(i, 1);
                }
            }
        }
        static removeAllValue(arr, v) {
            let i = arr.indexOf(v);
            while (i >= 0) {
                arr.splice(i, 1);
                i = arr.indexOf(v);
            }
        }
        static containsValue(arr, v) {
            return arr.length > 0 ? arr.indexOf(v) != -1 : false;
        }
        static copy(arr) {
            return JSON.parse(JSON.stringify(arr));
        }
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
        static clear(arr) {
            let i = 0;
            let len = arr.length;
            for (i = 0; i < len; ++i) {
                arr[i] = null;
            }
            arr.splice(0);
        }
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
    function bytes2Uint8Array(data, endian) {
        var bytes = new Laya.Byte(data);
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

(function (airkit) {
    class ClassUtils {
        static copyObject(obj) {
            let js = JSON.stringify(obj);
            return JSON.parse(js);
        }
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
                } else {
                    result = func.apply(obj, args);
                }
            } else {
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
    airkit.ClassUtils = ClassUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    class DateUtils {
        static setServerTime(time) {
            this.serverTime = time;
            this.serverTimeDiff = Date.now() - time;
        }
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
            } else {
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
            } else {
                format = format.replace(":", "’");
                return airkit.StringUtils.format(format, M, S);
            }
        }
    }
    DateUtils.serverTimeDiff = 0;
    DateUtils.serverTime = 0;
    airkit.DateUtils = DateUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    class DicUtils {
        static getKeys(d) {
            let a = [];
            for (let key in d) {
                a.push(key);
            }
            return a;
        }
        static getValues(d) {
            let a = [];
            for (let key in d) {
                a.push(d[key]);
            }
            return a;
        }
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

(function (airkit) {
    class DisplayUtils {
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
                    } else {
                        node.removeFromParent();
                        node.dispose();
                    }
                    cons = null;
                }
                node = null;
            }
        }
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
            } else {
                x = panel.x;
                y = panel.y;
            }
            panel.pos(x, 0);
            Laya.Tween.clearTween(panel);
            let time = 500;
            Laya.Tween.to(panel, {
                scaleX: 1,
                scaleY: 1,
                x: x,
                y: y
            }, time, Laya.Ease.backOut, handler);
            if (panel.parent && panel.parent.bg) {
                panel.parent.bg.alpha = 0;
                airkit.TweenUtils.get(panel.parent.bg).to({
                    alpha: 1.0
                }, time, fgui.EaseType.QuadOut);
            }
        }
        static popup(view, handler, ignoreAnchor) {
            view.setScale(0.85, 0.85);
            let x = displayWidth() >> 1;
            let y = displayHeight() >> 1;
            if (ignoreAnchor == null || !ignoreAnchor) {
                view.setPivot(0.5, 0.5, true);
            } else {
                x = view.x;
                y = view.y;
            }
            view.setXY(x, y);
            let time = 0.25;
            airkit.TweenUtils.get(view).to({
                scaleX: 1,
                scaleY: 1
            }, time, fgui.EaseType.QuadOut, handler);
            if (view.parent && view.parent.getChild("bg")) {
                let bg = view.parent.getChild("bg");
                bg.alpha = 0;
                airkit.TweenUtils.get(bg).to({
                    alpha: 1.0
                }, 0.25, fgui.EaseType.QuadOut);
            }
        }
        static hide(panel, handler) {
            let time = 0.2;
            let view = panel.panel();
            let bg = panel.bg();
            if (view == null) {
                if (handler) {
                    handler.run();
                }
            } else {
                airkit.TweenUtils.get(view).to({
                    scaleX: 0.5,
                    scaleY: 0.5
                }, time, fgui.EaseType.BackIn, handler);
                if (bg) {
                    airkit.TweenUtils.get(bg).to({
                        alpha: 0
                    }, 0.2, fgui.EaseType.QuadOut);
                }
            }
        }
        static createAsyncAnimation(ani, atlas) {
            return new Promise((resolve, reject) => {
                let anim = new Laya.Animation();
                anim.loadAnimation(ani, Laya.Handler.create(null, v => {
                    resolve(anim);
                }), atlas);
            });
        }
        static createSkeletonAni(skUrl, aniMode) {
            return new Promise((resolve, reject) => {
                let templet = new Laya.Templet();
                templet.on(Laya.Event.COMPLETE, null, (t) => {
                    var skeleton = t.buildArmature(aniMode);
                    t.offAll();
                    resolve([t, skeleton]);
                }, [templet]);
                templet.on(Laya.Event.ERROR, null, e => {
                    reject(e);
                });
                templet.loadAni(skUrl);
            });
        }
    }
    airkit.DisplayUtils = DisplayUtils;
})(airkit || (airkit = {}));

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
        static randRange(param1, param2) {
            let loc = Math.random() * (param2 - param1) + param1;
            return loc;
        }
        static randRange_Int(param1, param2) {
            let loc = Math.random() * (param2 - param1 + 1) + param1;
            return Math.floor(loc);
        }
        static randRange_Array(arr) {
            if (arr.length == 0)
                return null;
            let loc = arr[MathUtils.randRange_Int(0, arr.length - 1)];
            return loc;
        }
        static clampDegrees(degrees) {
            while (degrees < 0)
                degrees = degrees + 360;
            while (degrees >= 360)
                degrees = degrees - 360;
            return degrees;
        }
        static clampRadians(radians) {
            while (radians < 0)
                radians = radians + 2 * Math.PI;
            while (radians >= 2 * Math.PI)
                radians = radians - 2 * Math.PI;
            return radians;
        }
        static getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
        }
        static getSquareDistance(x1, y1, x2, y2) {
            return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2);
        }
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
        static toDegree(radian) {
            return radian * (180.0 / Math.PI);
        }
        static toRadian(degree) {
            return degree * (Math.PI / 180.0);
        }
        static moveTowards(current, target, maxDelta) {
            if (Math.abs(target - current) <= maxDelta) {
                return target;
            }
            return current + MathUtils.sign(target - current) * maxDelta;
        }
        static radians4point(ax, ay, bx, by) {
            return Math.atan2(ay - by, bx - ax);
        }
        static pointAtCircle(px, py, radians, radius) {
            return new cc.Vec2(px + Math.cos(radians) * radius, py - Math.sin(radians) * radius);
        }
        static getPos(pts, t, type) {
            if (pts.length == 0)
                return null;
            if (pts.length == 1)
                return pts[0];
            t = Math.min(t, 1);
            let target = new cc.Vec2();
            let count = pts.length;
            if (type == OrbitType.Line) {
                let unitTime = 1 / (count - 1);
                let index = Math.floor(t / unitTime);
                if (index + 1 < count) {
                    let start = pts[index];
                    let end = pts[index + 1];
                    let time = (t - index * unitTime) / unitTime;
                    target.x = start.x + (end.x - start.x) * time;
                    target.y = start.y + (end.y - start.y) * time;
                } else {
                    target.x = pts[pts.length - 1].x;
                    target.y = pts[pts.length - 1].y;
                }
            } else if (type == OrbitType.Curve) {
                target = this.getBezierat(pts, t);
            }
            return target;
        }
        static getRotation(startX, startY, endX, endY) {
            let deltaX = endX - startX;
            let deltaY = endY - startY;
            let angle = (Math.atan(deltaY / deltaX) * 180) / Math.PI;
            if (deltaX >= 0) {
                angle += 90;
            } else {
                angle += 270;
            }
            return angle;
        }
        static getBezierat(pts, t) {
            let target = new cc.Vec2();
            if (pts.length == 3) {
                target.x = Math.pow(1 - t, 2) * pts[0].x + 2 * t * (1 - t) * pts[1].x + Math.pow(t, 2) * pts[2].x;
                target.y = Math.pow(1 - t, 2) * pts[0].y + 2 * t * (1 - t) * pts[1].y + Math.pow(t, 2) * pts[2].y;
            } else if (pts.length == 4) {
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
        static getDirection(angle) {
            let dir = new cc.Vec2();
            if (angle == 0 || angle == 180) {
                dir.x = 0;
                dir.y = angle == 0 ? -1 : 1;
            } else if (angle == 90 || angle == 270) {
                dir.y = 0;
                dir.x = angle == 90 ? 1 : -1;
            } else {
                let idx = Math.floor(angle / 90);
                let rad = ((90 - angle) * Math.PI) / 180;
                if (idx == 0 || idx == 1)
                    dir.x = 1;
                else
                    dir.x = -1;
                if (idx == 1 || idx == 2) {
                    dir.y = Math.abs(Math.tan(rad));
                } else {
                    dir.y = -Math.abs(Math.tan(rad));
                }
                dir = this.normalize(dir);
            }
            return dir;
        }
        static normalize(vec) {
            let k = vec.y / vec.x;
            let x = Math.sqrt(1 / (k * k + 1));
            let y = Math.abs(k * x);
            vec.x = vec.x > 0 ? x : -x;
            vec.y = vec.y > 0 ? y : -y;
            return vec;
        }
        static distance(startX, startY, endX, endY) {
            return Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
        }
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
        static getCtrlPoint(start, end, raise = 100, xOffset = 50, yOffset = 50) {
            let ctrlPoint = this.getVerticalVector(start, end, raise);
            ctrlPoint.x += xOffset;
            ctrlPoint.y += yOffset;
            return ctrlPoint;
        }
        static getDefaultPoints(start, end, xOffset = 150, yOffset = 150, raise = 150) {
            if (start.x > displayWidth() / 2) {
                xOffset = -xOffset;
            }
            if (start.y > end.y) {
                yOffset = -yOffset;
            }
            let ctrlPt1 = this.getCtrlPoint(start, end, raise, xOffset, yOffset);
            return [start, ctrlPt1, end];
        }
    }
    MathUtils.BYTE_TO_M = 1 / (1024 * 1024);
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
        [-127, 74]
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
        [-127, 74]
    ];
    airkit.MathUtils = MathUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    class NumberUtils {
        static toFixed(value, p) {
            return airkit.StringUtils.toNumber(value.toFixed(p));
        }
        static toInt(value) {
            return Math.floor(value);
        }
        static isInt(value) {
            return Math.ceil(value) != value ? false : true;
        }
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
        static reserveNumberWithZero(num, size) {
            let str = String(num);
            let l = str.length;
            let p_index = str.indexOf(".");
            if (p_index < 0) {
                str += ".";
                for (let i = 0; i < size; ++i)
                    str += "0";
                return str;
            }
            let ret = str.slice(0, p_index + 1);
            let lastNum = l - p_index - 1;
            if (lastNum > size) {
                lastNum = size;
                let lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
                return ret + lastStr;
            } else if (lastNum < size) {
                let diff = size - lastNum;
                for (let i = 0; i < diff; ++i)
                    str += "0";
                return str;
            } else {
                return str;
            }
        }
    }
    airkit.NumberUtils = NumberUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    class StringUtils {
        static get empty() {
            return "";
        }
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
        static getNumBytes(str) {
            let realLength = 0,
                len = str.length,
                charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLength += 1;
                else
                    realLength += 2;
            }
            return realLength;
        }
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
        static isString(obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        }
        static trim(input) {
            if (input == null) {
                return "";
            }
            return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
        }
        static trimLeft(input) {
            if (input == null) {
                return "";
            }
            return input.replace(/^\s+""^\s+/, "");
        }
        static trimRight(input) {
            if (input == null) {
                return "";
            }
            return input.replace(/\s+$""\s+$/, "");
        }
        static minuteFormat(seconds) {
            let min = Math.floor(seconds / 60);
            let sec = Math.floor(seconds % 60);
            let min_str = min < 10 ? "0" + min.toString() : min.toString();
            let sec_str = sec < 10 ? "0" + sec.toString() : sec.toString();
            return min_str + ":" + sec_str;
        }
        static hourFormat(seconds) {
            let hour = Math.floor(seconds / 3600);
            let hour_str = hour < 10 ? "0" + hour.toString() : hour.toString();
            return hour_str + ":" + StringUtils.minuteFormat(seconds % 3600);
        }
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
        static beginsWith(input, prefix) {
            return prefix == input.substring(0, prefix.length);
        }
        static endsWith(input, suffix) {
            return suffix == input.substring(input.length - suffix.length);
        }
        static getGUIDString() {
            let d = Date.now();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now();
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
        static touchBreak(view) {
            view.on(Laya.Event.CLICK, view, (e) => {
                e.stopPropagation();
            });
        }
        static mouseBreak(view) {
            view.on(Laya.Event.MOUSE_DOWN, view, (e) => {
                e.stopPropagation();
            });
        }
    }
    airkit.TouchUtils = TouchUtils;
})(airkit || (airkit = {}));

(function (airkit) {
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
        to(props, duration, ease = fgui.EaseType.QuadOut, complete = null, delay = 0) {
            this._steps.push({
                props,
                duration,
                ease,
                complete,
                delay
            });
            this.trigger();
            return this;
        }
        delay(delay) {
            this._steps.push({
                delay
            });
            return this;
        }
        trigger() {
            if (!this._isPlaying) {
                if (this._steps && this._steps.length) {
                    var step = this._steps.shift();
                    if (step.hasOwnProperty("props")) {
                        this._isPlaying = true;
                        if (step.props["x"] != null || step.props["y"] != null) {
                            let x = step.props["x"] != null ? step.props.x : this._target.x;
                            let y = step.props["y"] != null ? step.props.y : this._target.y;
                            fgui.GTween.to2(this._target.x, this._target.y, x, y, step.duration)
                                .setTarget(this._target, this._target.setXY)
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
                            fgui.GTween.to(this._target.rotation, rotation, step.duration)
                                .setTarget(this._target, "rotation")
                                .setEase(step.ease);
                        }
                        if (step.props["color"] != null) {
                            let color = step.props["color"] != null ? step.props.color : 0xffffff;
                            var redMat = [
                                1,
                                0,
                                0,
                                0.3,
                                0.3,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                1,
                                0
                            ];
                            var redFilter = new Laya.ColorFilter(redMat);
                            this._target.filters = [redFilter];
                        }
                        if (step.props["alpha"] != null) {
                            if (step.props.pts) {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate((gt) => {
                                        let point = airkit.MathUtils.getPos(step.props.pts, gt.normalizedTime, airkit.OrbitType.Curve);
                                        this._target.setXY(point.x, point.y);
                                        this.onUpdate(gt);
                                    }, null);
                            } else {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate((gt) => {
                                        this.onUpdate(gt);
                                    }, null);
                            }
                        }
                        Laya.timer.once((step.duration + step.delay) * 1000, this, this.onStepComplete, [step.complete]);
                    } else if (step.hasOwnProperty("delay")) {
                        this._isPlaying = true;
                        Laya.timer.once(step.delay * 1000, this, this.onStepComplete, [step.complete]);
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
            this.get(view)
                .to({
                    scaleX: 0.8,
                    scaleY: 0.8
                }, 0.05, fgui.EaseType.QuadIn)
                .to({
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 0.05, fgui.EaseType.QuadIn);
        }
        static appear(view) {
            view.setScale(0, 0);
            this.get(view)
                .to({
                    scaleX: 1.2,
                    scaleY: 1.2
                }, 0.4, fgui.EaseType.QuadOut)
                .to({
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 0.2, fgui.EaseType.QuadOut);
        }
        static shake(node) {
            Laya.Tween.to(node, {
                y: node.y + 100
            }, 100, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, {
                    y: node.y - 100
                }, 1000, Laya.Ease.elasticOut);
            }));
        }
        static stageShake(view, times = 2, offset = 12, speed = 32, caller, callBack) {
            if (view["isShake"]) {
                return;
            }
            view["isShake"] = true;
            var num = 0;
            var offsetArr = [0, 0];
            var point = new cc.Vec2(view.x, view.y);
            Laya.stage.timerLoop(speed, this, shakeObject);

            function shakeObject(args = null, frameNum = 1, frameTime = 0) {
                var count = num++ % 4;
                offsetArr[num % 2] = count < 2 ? 0 : offset;
                view.x = offsetArr[0] + point.x;
                view.y = offsetArr[1] + point.y;
                if (num > times * 4 + 1) {
                    Laya.stage.clearTimer(this, shakeObject);
                    num = 0;
                    view["isShake"] = false;
                    if (callBack != null) {
                        callBack.call(caller);
                    }
                }
            }
        }
    }
    TweenUtils.EaseBezier = 9999;
    airkit.TweenUtils = TweenUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    class UrlUtils {
        static getFileExte(url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            let idx = url.lastIndexOf(".");
            if (idx >= 0) {
                return url.substr(idx + 1);
            }
            return airkit.StringUtils.empty;
        }
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

(function (airkit) {
    class Utils {
        static openURL(url) {
            Laya.Browser.window.location.href = url;
        }
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
        static gray(obj, enabled) {
            if (enabled) {
                var grayFilter = new Laya.ColorFilter();
                obj.filters = [grayFilter.gray()];
            } else {
                obj.filters = [];
            }
        }
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
                if ((!ignoreMethod || typeof value != "function") &&
                    (!ignoreNull || value != null)) {
                    if (callback) {
                        callback(target, key, value);
                    } else {
                        target[key] = value;
                    }
                }
            }
            return result;
        }
    }
    airkit.Utils = Utils;
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

    function assert(condition, msg) {
        if (!condition) {
            throw msg || "assert";
        }
    }
    airkit.assert = assert;

    function assertNullOrNil(condition, msg) {
        if (condition == null ||
            condition === null ||
            typeof condition === "undefined") {
            assert(false, msg);
        }
    }
    airkit.assertNullOrNil = assertNullOrNil;

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

(function (airkit) {
    class ZipUtils {
        static unzip(ab) {
            return new Promise((resolve, reject) => {
                let resultDic = {};
                ZipUtils.parseZip(ab)
                    .then(zip => {
                        let jszip = zip.jszip;
                        let filelist = zip.filelist;
                        if (jszip && filelist) {
                            let count = 0;
                            for (let i = 0; i < filelist.length; i++) {
                                ZipUtils.parseZipFile(jszip, filelist[i])
                                    .then(content => {
                                        count++;
                                        resultDic[filelist[i]] = content;
                                        if (count == filelist.length) {
                                            zip = null;
                                            jszip = null;
                                            filelist = null;
                                            resolve(resultDic);
                                        }
                                    })
                                    .catch(e => {
                                        airkit.Log.error(e);
                                        reject(e);
                                    });
                            }
                        }
                    })
                    .catch(e => {
                        airkit.Log.error(e);
                        reject(e);
                    });
            });
        }
        static parseZip(ab) {
            return new Promise((resolve, reject) => {
                let dic = new airkit.SDictionary();
                let fileNameArr = new Array();
                Laya.Browser.window.JSZip.loadAsync(ab)
                    .then(jszip => {
                        for (var fileName in jszip.files) {
                            fileNameArr.push(fileName);
                        }
                        resolve({
                            jszip: jszip,
                            filelist: fileNameArr
                        });
                    })
                    .catch(e => {
                        airkit.Log.error(e);
                    });
            });
        }
        static parseZipFile(jszip, filename) {
            return new Promise((resolve, reject) => {
                jszip
                    .file(filename)
                    .async("text")
                    .then(content => {
                        resolve(content);
                    })
                    .catch(e => {
                        reject(e);
                        airkit.Log.error(e);
                    });
            });
        }
    }
    airkit.ZipUtils = ZipUtils;
})(airkit || (airkit = {}));