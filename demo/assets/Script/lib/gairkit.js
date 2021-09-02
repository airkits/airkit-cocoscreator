window.airkit = {};
window.ak = window.airkit;
window.__extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:42
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/Singleton.ts
 */
//import { Log } from "../log/Log";

(function (airkit) {
    /**
     * 单列
     * @author ankye
     * @time 2018-7-6
     */
    var Singleton = /** @class */ (function () {
        function Singleton() {
            var clazz = this['constructor'];
            //为空时，表示浏览器不支持这样读取构造函数
            if (!clazz) {
                airkit.Log.warning('浏览器不支持读取构造函数');
                return;
            }
            // 防止重复实例化
            if (Singleton.classKeys.indexOf(clazz) != -1) {
                throw new Error(this + ' 只允许实例化一次！');
            }
            else {
                Singleton.classKeys.push(clazz);
                Singleton.classValues.push(this);
            }
        }
        Singleton.classKeys = [];
        Singleton.classValues = [];
        return Singleton;
    }());
    airkit.Singleton = Singleton;
})(airkit || (airkit = {}));
/// <reference path="collection/Singleton.ts" />

(function (airkit) {
    //fixed modallayer 透明度
    function fixedModalLayer(url) {
        var loader = fgui.GRoot.inst.modalLayer.getChildAt(0);
        loader.url = url;
    }
    airkit.fixedModalLayer = fixedModalLayer;
    /**
     * 框架管理器
     * @author ankye
     * @time 2018-7-6
     */
    var Framework = /** @class */ (function (_super) {
        __extends(Framework, _super);
        function Framework() {
            var _this = _super.call(this) || this;
            _this._isStopGame = false;
            _this._mainloopHandle = null;
            return _this;
        }
        Object.defineProperty(Framework, "Instance", {
            get: function () {
                if (!this.instance) {
                    this.instance = new Framework();
                }
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 初始化
         * @param	root	根节点，可以是stage
         */
        Framework.prototype.setup = function (root, log_level, design_width, design_height, screen_mode, frame) {
            if (log_level === void 0) { log_level = airkit.LogLevel.INFO; }
            if (design_width === void 0) { design_width = 750; }
            if (design_height === void 0) { design_height = 1334; }
            if (screen_mode === void 0) { screen_mode = ''; }
            if (frame === void 0) { frame = 1; }
            this.printDeviceInfo();
            this._isStopGame = false;
            cc.view.setResizeCallback(function () {
                airkit.EventCenter.dispatchEvent(airkit.EventID.RESIZE);
            });
            airkit.Log.LEVEL = log_level;
            airkit.LayerManager.setup(root);
            airkit.Mediator.Instance.setup();
            airkit.TimerManager.Instance.setup();
            airkit.ResourceManager.Instance.setup();
            airkit.LoaderManager.Instance.setup();
            airkit.DataProvider.Instance.setup();
            // LangManager.Instance.init();
            airkit.SceneManager.Instance.setup();
            //
            // cc.director.getScheduler().scheduleUpdate(this, 0, false);
        };
        Framework.prototype.destroy = function () {
            airkit.LoaderManager.Instance.destroy();
            airkit.ResourceManager.Instance.destroy();
            airkit.TimerManager.Instance.destroy();
            airkit.Mediator.Instance.destroy();
            airkit.LayerManager.destroy();
            //UIManager.Instance.destroy();
            airkit.SceneManager.Instance.destroy();
            airkit.DataProvider.Instance.destroy();
            // LangManager.Instance.destory();
            return true;
        };
        /**
         * 游戏主循环
         */
        Framework.prototype.update = function (dt) {
            //dt是秒，强制转换成毫秒
            if (!this._isStopGame) {
                var dtMs = dt * 1000;
                this.preTick(dtMs);
                this.tick(dtMs);
                this.endTick(dtMs);
            }
        };
        Framework.prototype.preTick = function (dt) {
            airkit.TimerManager.Instance.update(dt);
            //UIManager.Instance.update(dt);
            airkit.ResourceManager.Instance.update(dt);
            airkit.Mediator.Instance.update(dt);
            airkit.SceneManager.Instance.update(dt);
        };
        Framework.prototype.tick = function (dt) {
            if (this._mainloopHandle) {
                this._mainloopHandle.runWith([dt]);
            }
        };
        Framework.prototype.endTick = function (dt) { };
        /**暂停游戏*/
        Framework.prototype.pauseGame = function () {
            this._isStopGame = true;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, true);
        };
        /**结束暂停*/
        Framework.prototype.resumeGame = function () {
            this._isStopGame = false;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, false);
        };
        Object.defineProperty(Framework.prototype, "isStopGame", {
            get: function () {
                return this._isStopGame;
            },
            enumerable: false,
            configurable: true
        });
        /**打印设备信息*/
        Framework.prototype.printDeviceInfo = function () {
            if (navigator) {
                var agentStr = navigator.userAgent;
                var start = agentStr.indexOf('(');
                var end = agentStr.indexOf(')');
                if (start < 0 || end < 0 || end < start) {
                    return;
                }
                var infoStr = agentStr.substring(start + 1, end);
                airkit.Log.info(infoStr);
                var device = void 0, system = void 0, version = void 0;
                var infos = infoStr.split(';');
                if (infos.length == 3) {
                    //如果是三个的话， 可能是android的， 那么第三个是设备号
                    device = infos[2];
                    //第二个是系统号和版本
                    var system_info = infos[1].split(' ');
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
                airkit.Log.info('%s,%s,%s', system, device, version);
            }
        };
        Framework.instance = null;
        return Framework;
    }(airkit.Singleton));
    airkit.Framework = Framework;
})(airkit || (airkit = {}));
// patch modal layer
;
(function () {
    var _proto;
    /* patch String Object */
    _proto = fgui.GRoot.prototype;
    _proto.createModalLayer = function () {
        var layer = new fgui.GComponent();
        layer.setSize(this.width, this.height);
        var loader = new fgui.GLoader();
        loader.setSize(this.width, this.height);
        loader.addRelation(this, fgui.RelationType.Size);
        loader.fill = fgui.LoaderFillType.ScaleFree;
        layer.addChild(loader);
        layer.addRelation(this, fgui.RelationType.Size);
        return layer;
    };
})();
// // import { Singleton } from "../collection/Singleton";
// // import { SDictionary, NDictionary } from "../collection/Dictionary";
// // import { Timer } from "../timer/Timer";
// ///<reference path="../collection/Singleton.ts"/>

(function (airkit) {
    /*
     * 声音管理
     */
    var AudioManager = /** @class */ (function (_super) {
        __extends(AudioManager, _super);
        function AudioManager() {
            var _this = _super.call(this) || this;
            _this._audioIDs = new airkit.NDictionary();
            _this._musicID = -1;
            _this._effectSwitch = true;
            _this._musicSwitch = true;
            return _this;
        }
        Object.defineProperty(AudioManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new AudioManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AudioManager.prototype, "musicSwitch", {
            /**
             * 设置背景音乐开关，关闭(false)将关闭背景音乐
             *
             * @memberof SoundsManager
             */
            set: function (v) {
                if (this._musicSwitch != v) {
                    if (!v) {
                        this.stopMusic();
                    }
                    this._musicSwitch = v;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AudioManager.prototype, "effectSwitch", {
            /**
             * 设置音效开关，关闭(false)将关闭所有的音效
             *
             * @memberof SoundsManager
             */
            set: function (v) {
                if (this._effectSwitch != v) {
                    if (!v) {
                        this.stopAllEffect();
                    }
                    this._effectSwitch = v;
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 播放背景音乐
         * @param url
         * @param loopCount default -1 = loop for ever,
         * @param complete
         * @param startTime 设置开始秒
         */
        AudioManager.prototype.playMusic = function (url, loopCount, complete, startTime) {
            var _this = this;
            if (loopCount === void 0) { loopCount = -1; }
            if (complete === void 0) { complete = null; }
            if (startTime === void 0) { startTime = 0; }
            if (!this._musicSwitch)
                return;
            this.getAudioClip(url).then(function (clip) {
                if (clip) {
                    var loop = false;
                    if (loopCount == -1) {
                        loop = true;
                    }
                    var audioID_1 = cc.audioEngine.playMusic(clip, loop);
                    _this._musicID = audioID_1;
                    cc.audioEngine.setCurrentTime(audioID_1, startTime);
                    cc.audioEngine.setFinishCallback(audioID_1, function () {
                        complete.runWith(audioID_1);
                        _this._musicID = audioID_1;
                    });
                }
            });
        };
        AudioManager.prototype.getAudioClip = function (url) {
            var clip = airkit.ResourceManager.Instance.getRes(url);
            if (!clip) {
                return airkit.ResourceManager.Instance.loadRes(url, cc.AudioClip).then(function (v) {
                    return airkit.ResourceManager.Instance.getRes(url);
                });
            }
            else {
                return Promise.resolve(clip);
            }
        };
        /**
         * 播放音效
         * @param url
         * @param loopCount default -1 = loop for ever,
         * @param complete
         * @param startTime
         */
        AudioManager.prototype.playEffect = function (url, loopCount, complete, startTime) {
            var _this = this;
            if (loopCount === void 0) { loopCount = 1; }
            if (complete === void 0) { complete = null; }
            if (startTime === void 0) { startTime = 0; }
            if (!this._effectSwitch)
                return;
            this.getAudioClip(url).then(function (clip) {
                if (clip) {
                    var loop = false;
                    if (loopCount == -1) {
                        loop = true;
                    }
                    var audioID_2 = cc.audioEngine.playEffect(clip, loop);
                    _this._audioIDs.add(audioID_2, url);
                    cc.audioEngine.setCurrentTime(audioID_2, startTime);
                    cc.audioEngine.setFinishCallback(audioID_2, function () {
                        complete.runWith(audioID_2);
                        _this._audioIDs.remove(audioID_2);
                    });
                }
            });
        };
        /**
         * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
         * @param volume
         */
        AudioManager.prototype.setMusicVolume = function (volume) {
            cc.audioEngine.setMusicVolume(volume);
        };
        /**
         * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
         * @param volume
         * @param url
         */
        AudioManager.prototype.setEffectVolume = function (volume, url) {
            if (url === void 0) { url = null; }
            if (url != null) {
                this._audioIDs.foreach(function (k, v) {
                    if (v == url) {
                        cc.audioEngine.setVolume(k, volume);
                    }
                    return true;
                });
            }
            else {
                cc.audioEngine.setEffectsVolume(volume);
            }
        };
        /**
         * 停止所有音乐
         */
        AudioManager.prototype.stopAll = function () {
            cc.audioEngine.stopAll();
            this._musicID = -1;
            this._audioIDs.clear();
        };
        /**
         * 停止播放所有音效（不包括背景音乐）
         */
        AudioManager.prototype.stopAllEffect = function () {
            this._audioIDs.foreach(function (k, v) {
                cc.audioEngine.stopEffect(k);
                return true;
            });
            this._audioIDs.clear();
        };
        /**
         * 停止播放背景音乐
         */
        AudioManager.prototype.stopMusic = function () {
            cc.audioEngine.stopMusic();
            this._musicID = -1;
        };
        /**
         * 暂停背景音乐
         */
        AudioManager.prototype.pauseMusic = function () {
            cc.audioEngine.pauseMusic();
        };
        /**
         * 暂停播放音效
         * @param url
         */
        AudioManager.prototype.pauseEffect = function (url) {
            if (url === void 0) { url = null; }
            if (url == null) {
                cc.audioEngine.pauseAllEffects();
            }
            else {
                this._audioIDs.foreach(function (k, v) {
                    if (v == url) {
                        cc.audioEngine.pause(k);
                    }
                    return true;
                });
            }
        };
        /**
         * 暂停所有的
         */
        AudioManager.prototype.pauseAll = function () {
            cc.audioEngine.pauseAll();
        };
        /**
         * 恢复背景音乐
         */
        AudioManager.prototype.resumeMusic = function () {
            cc.audioEngine.resumeMusic();
        };
        /**
         * 恢复音效
         * @param url
         */
        AudioManager.prototype.resumeEffect = function (url) {
            if (url == null) {
                cc.audioEngine.resumeAllEffects();
            }
            else {
                this._audioIDs.foreach(function (k, v) {
                    if (v == url) {
                        cc.audioEngine.resume(k);
                    }
                    return true;
                });
            }
        };
        /**
         * 恢复所有的音乐和音效
         */
        AudioManager.prototype.resumeAll = function () {
            cc.audioEngine.resumeAll();
        };
        AudioManager.instance = null;
        return AudioManager;
    }(airkit.Singleton));
    airkit.AudioManager = AudioManager;
})(airkit || (airkit = {}));
// import { StringUtils } from "../utils/StringUtils";
// import { MathUtils } from "../utils/MathUtils";

(function (airkit) {
    /**
     * 颜色
     * @author ankye
     * @time 2018-7-3
     */
    var Color = /** @class */ (function () {
        function Color(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.prototype.set = function (new_r, new_g, new_b, new_a) {
            this.r = new_r;
            this.g = new_g;
            this.b = new_b;
            this.a = new_a;
        };
        Color.add = function (a, b) {
            return new Color(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a);
        };
        Color.prototype.add = function (a) {
            this.set(this.r + a.r, this.g + a.g, this.b + a.b, this.a + a.a);
            return this;
        };
        Color.sub = function (a, b) {
            return new Color(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a);
        };
        Color.prototype.sub = function (a) {
            this.set(this.r - a.r, this.g - a.g, this.b - a.b, this.a - a.a);
            return this;
        };
        Color.mul = function (a, d) {
            return new Color(a.r * d, a.g * d, a.b * d, a.a * d);
        };
        Color.prototype.mul = function (d) {
            this.set(this.r * d, this.g * d, this.b * d, this.a * d);
            return this;
        };
        Color.div = function (a, d) {
            return new Color(a.r / d, a.g / d, a.b / d, a.a / d);
        };
        Color.prototype.div = function (d) {
            this.set(this.r / d, this.g / d, this.b / d, this.a / d);
            return this;
        };
        Color.prototype.equals = function (other) {
            return this.r == other.r && this.g == other.g && this.b == other.b && this.a == other.a;
        };
        Color.lerp = function (from, to, t) {
            t = airkit.MathUtils.clamp(t, 0, 1);
            return new Color(from.r + (to.r - from.r) * t, from.g + (to.g - from.g) * t, from.b + (to.b - from.b) * t + (to.a - from.a) * t);
        };
        Object.defineProperty(Color, "zero", {
            get: function () {
                return new Color(0, 0, 0, 0);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "one", {
            get: function () {
                return new Color(1, 1, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "red", {
            get: function () {
                return new Color(1, 0, 0, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "green", {
            get: function () {
                return new Color(0, 1, 0, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "blue", {
            get: function () {
                return new Color(0, 0, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "white", {
            get: function () {
                return new Color(1, 1, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "black", {
            get: function () {
                return new Color(0, 0, 0, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "yellow", {
            get: function () {
                return new Color(1, 0.9215686, 0.01568628, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "cyan", {
            get: function () {
                return new Color(0, 1, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "magenta", {
            get: function () {
                return new Color(1, 0, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "gray", {
            get: function () {
                return new Color(0.5, 0.5, 0.5, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "grey", {
            get: function () {
                return new Color(0.5, 0.5, 0.5, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color, "clear", {
            get: function () {
                return new Color(0, 0, 0, 0);
            },
            enumerable: false,
            configurable: true
        });
        Color.prototype.toString = function () {
            return airkit.StringUtils.format('(%d,%d,%d,%d)', this.r, this.g, this.b, this.a);
        };
        return Color;
    }());
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
    var NDictionary = /** @class */ (function () {
        function NDictionary() {
            this._dic = {};
        }
        NDictionary.prototype.add = function (key, value) {
            if (this.has(key)) {
                airkit.Log.warning('NDictionary already containsKey ', key.toString());
                return false;
            }
            this._dic[key] = value;
            return true;
        };
        NDictionary.prototype.remove = function (key) {
            delete this._dic[key];
        };
        NDictionary.prototype.set = function (key, value) {
            this._dic[key] = value;
        };
        NDictionary.prototype.has = function (key) {
            return this._dic[key] != null ? true : false;
        };
        NDictionary.prototype.getValue = function (key) {
            if (!this.has(key))
                return null;
            return this._dic[key];
        };
        NDictionary.prototype.clear = function () {
            for (var key in this._dic) {
                delete this._dic[key];
            }
        };
        NDictionary.prototype.getkeys = function () {
            var list = [];
            for (var key in this._dic) {
                list.push(airkit.StringUtils.toNumber(key));
            }
            return list;
        };
        NDictionary.prototype.getValues = function () {
            var list = [];
            for (var key in this._dic) {
                list.push(this._dic[key]);
            }
            return list;
        };
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        NDictionary.prototype.foreach = function (compareFn) {
            for (var key in this._dic) {
                if (!compareFn.call(null, key, this._dic[key]))
                    break;
            }
        };
        Object.defineProperty(NDictionary.prototype, "length", {
            get: function () {
                return airkit.DicUtils.getLength(this._dic);
            },
            enumerable: false,
            configurable: true
        });
        return NDictionary;
    }());
    airkit.NDictionary = NDictionary;
    /**
     * 字典-键为string
     * @author ankye
     * @time 2018-7-6
     */
    var SDictionary = /** @class */ (function () {
        function SDictionary() {
            this._dic = {};
        }
        SDictionary.prototype.add = function (key, value) {
            if (this.has(key))
                return false;
            this._dic[key] = value;
            return true;
        };
        SDictionary.prototype.set = function (key, value) {
            this._dic[key] = value;
        };
        SDictionary.prototype.remove = function (key) {
            delete this._dic[key];
        };
        SDictionary.prototype.has = function (key) {
            return this._dic[key] != null ? true : false;
        };
        SDictionary.prototype.getValue = function (key) {
            if (!this.has(key))
                return null;
            return this._dic[key];
        };
        SDictionary.prototype.getkeys = function () {
            var list = [];
            for (var key in this._dic) {
                list.push(key);
            }
            return list;
        };
        SDictionary.prototype.getValues = function () {
            var list = [];
            for (var key in this._dic) {
                list.push(this._dic[key]);
            }
            return list;
        };
        SDictionary.prototype.clear = function () {
            for (var key in this._dic) {
                delete this._dic[key];
            }
        };
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        SDictionary.prototype.foreach = function (compareFn) {
            for (var key in this._dic) {
                if (!compareFn.call(null, key, this._dic[key]))
                    break;
            }
        };
        Object.defineProperty(SDictionary.prototype, "length", {
            get: function () {
                return airkit.DicUtils.getLength(this._dic);
            },
            enumerable: false,
            configurable: true
        });
        return SDictionary;
    }());
    airkit.SDictionary = SDictionary;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:28
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/DoubleArray.ts
 */
//import { ArrayUtils } from "../utils/ArrayUtils";

(function (airkit) {
    /**
     * 二维数组
     * @author ankye
     * @time 2018-7-8
     */
    var DoubleArray = /** @class */ (function () {
        function DoubleArray(rows, cols, value) {
            this._array = [];
            if (rows > 0 && cols > 0) {
                for (var row = 0; row < rows; ++row) {
                    for (var col = 0; col < cols; ++col) {
                        this.set(row, col, value);
                    }
                }
            }
        }
        DoubleArray.prototype.set = function (row, col, value) {
            if (!this._array[row])
                this._array[row] = [];
            this._array[row][col] = value;
        };
        DoubleArray.prototype.get = function (row, col) {
            if (!this._array[row])
                return null;
            return this._array[row][col];
        };
        DoubleArray.prototype.clear = function () {
            airkit.ArrayUtils.clear(this._array);
        };
        return DoubleArray;
    }());
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
    var LinkList = /** @class */ (function () {
        function LinkList() {
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
        LinkList.prototype.add = function (t) {
            this.append(this._size, t);
        };
        /**将节点插入到第index位置之前*/
        LinkList.prototype.insert = function (index, t) {
            if (this._size < 1 || index >= this._size)
                airkit.Log.exception('没有可插入的点或者索引溢出了');
            if (index == 0)
                this.append(this._size, t);
            else {
                var inode = this.getNode(index);
                var tnode = { Data: t, Prev: inode.Prev, Next: inode };
                inode.Prev.Next = tnode;
                inode.Prev = tnode;
                this._size++;
            }
        };
        /**追加到index位置之后*/
        LinkList.prototype.append = function (index, t) {
            var inode;
            if (index == 0)
                inode = this._linkHead;
            else {
                index = index - 1;
                if (index < 0)
                    airkit.Log.exception('位置不存在');
                inode = this.getNode(index);
            }
            var tnode = { Data: t, Prev: inode, Next: inode.Next };
            inode.Next.Prev = tnode;
            inode.Next = tnode;
            this._size++;
        };
        /**
         * 删除节点，有效节点索引为[0,_size-1]
         */
        LinkList.prototype.del = function (index) {
            var inode = this.getNode(index);
            inode.Prev.Next = inode.Next;
            inode.Next.Prev = inode.Prev;
            this._size--;
        };
        LinkList.prototype.delFirst = function () {
            this.del(0);
        };
        LinkList.prototype.delLast = function () {
            this.del(this._size - 1);
        };
        LinkList.prototype.get = function (index) {
            return this.getNode(index).Data;
        };
        LinkList.prototype.getFirst = function () {
            return this.getNode(0).Data;
        };
        LinkList.prototype.getLast = function () {
            return this.getNode(this._size - 1).Data;
        };
        /**通过索引查找*/
        LinkList.prototype.getNode = function (index) {
            if (index < 0 || index >= this._size) {
                airkit.Log.exception('索引溢出或者链表为空');
            }
            if (index < this._size / 2) {
                //正向查找
                var node = this._linkHead.Next;
                for (var i = 0; i < index; i++)
                    node = node.Next;
                return node;
            }
            //反向查找
            var rnode = this._linkHead.Prev;
            var rindex = this._size - index - 1;
            for (var i = 0; i < rindex; i++)
                rnode = rnode.Prev;
            return rnode;
        };
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        LinkList.prototype.foreach = function (compareFn) {
            var node = this._linkHead.Next;
            if (!node)
                return;
            do {
                if (!compareFn.call(null, node.Data))
                    break;
                node = node.Next;
            } while (node != this._linkHead);
        };
        LinkList.prototype.isEmpty = function () {
            return this._size == 0;
        };
        Object.defineProperty(LinkList.prototype, "length", {
            get: function () {
                return this._size;
            },
            enumerable: false,
            configurable: true
        });
        return LinkList;
    }());
    airkit.LinkList = LinkList;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:37
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/ObjectPools.ts
 */
// import { Log } from "../log/Log";
// import { DicUtils } from "../utils/DicUtils";

(function (airkit) {
    /**
     * 对象缓存
     * 1.如果继承IPoolsObject，并实现init接口函数；创建时会自动调用init函数
     * @author ankye
     * @time 2018-7-11
     */
    var ObjectPools = /** @class */ (function () {
        function ObjectPools() {
        }
        /**
         * 获取一个对象，不存在则创建,classDef必须要有 objectKey的static变量
         * @param classDef  类名
         */
        ObjectPools.get = function (classDef) {
            var sign = classDef['objectKey'];
            if (sign == null) {
                //直接通过classDef.name获取sign,在混淆的情况下会出错
                airkit.Log.error('static objectKey must set in %s ', classDef.name);
            }
            var pool = this.poolsMap[sign];
            if (pool == null) {
                pool = new Array();
                this.poolsMap[sign] = pool;
            }
            var obj = pool.pop();
            if (obj == null) {
                obj = new classDef();
            }
            if (obj && obj['init'])
                obj.init();
            return obj;
        };
        /**
         * 回收对象
         * @param obj  对象实例
         */
        ObjectPools.recover = function (obj) {
            if (!obj)
                return;
            if (obj['parent'] != null) {
                obj.removeFromParent();
            }
            if (obj['dispose'] && obj['displayObject'] == null) {
                obj.dispose();
                return;
            }
            var proto = Object.getPrototypeOf(obj);
            var clazz = proto['constructor'];
            var sign = clazz['objectKey'];
            var pool = this.poolsMap[sign];
            if (pool != null) {
                if (obj['visible'] !== null && obj['visible'] === false) {
                    obj.visible = true;
                }
                pool.push(obj);
            }
        };
        ObjectPools.clearAll = function () {
            var _this = this;
            airkit.DicUtils.foreach(this.poolsMap, function (k, v) {
                _this.clear(k);
                return true;
            });
        };
        ObjectPools.clear = function (sign) {
            var pool = this.poolsMap[sign];
            airkit.Log.info('max object count %s', pool.length);
            while (pool.length > 0) {
                var obj = pool.pop();
                if (obj && obj['dispose']) {
                    if (obj['parent'] != null) {
                        obj.removeFromParent();
                    }
                    else if (obj.displayObject['parent'] != null) {
                        obj.displayObject.removeFromParent();
                    }
                    obj.dispose();
                }
            }
        };
        ObjectPools.poolsMap = {};
        return ObjectPools;
    }());
    airkit.ObjectPools = ObjectPools;
})(airkit || (airkit = {}));
/**
 * 队列：先入先出
 * @author ankye
 * @time 2018-7-6
 */

(function (airkit) {
    var Queue = /** @class */ (function () {
        function Queue() {
            this._list = [];
        }
        /**添加到队列尾*/
        Queue.prototype.enqueue = function (item) {
            this._list.push(item);
        };
        /**获取队列头，并删除*/
        Queue.prototype.dequeue = function () {
            return this._list.shift();
        };
        /**获取队列头，并不删除*/
        Queue.prototype.peek = function () {
            if (this._list.length == 0)
                return null;
            return this._list[0];
        };
        /**查询某个元素，并不删除*/
        Queue.prototype.seek = function (index) {
            if (this._list.length < index)
                return null;
            return this._list[index];
        };
        /**转换成标准数组*/
        Queue.prototype.toArray = function () {
            return this._list.slice(0, this._list.length);
        };
        /**是否包含指定元素*/
        Queue.prototype.has = function (item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        };
        /**清空*/
        Queue.prototype.clear = function () {
            this._list.length = 0;
        };
        Object.defineProperty(Queue.prototype, "length", {
            get: function () {
                return this._list.length;
            },
            enumerable: false,
            configurable: true
        });
        Queue.prototype.foreach = function (compareFn) {
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!compareFn.call(null, item))
                    break;
            }
        };
        return Queue;
    }());
    airkit.Queue = Queue;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:45
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/Size.ts
 */

(function (airkit) {
    /**
     * Size大小 宽高
     * @author ankye
     * @time 2018-7-3
     */
    var Size = /** @class */ (function () {
        function Size(w, h) {
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this._width = w;
            this._height = h;
        }
        Size.prototype.set = function (w, h) {
            this._width = w;
            this._height = h;
        };
        Object.defineProperty(Size.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: false,
            configurable: true
        });
        return Size;
    }());
    airkit.Size = Size;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:48
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/Stack.ts
 */

(function (airkit) {
    /**
     * 栈：后入先出
     * @author ankye
     * @time 2018-7-6
     */
    var Stack = /** @class */ (function () {
        function Stack() {
            this._list = [];
        }
        /**添加数据*/
        Stack.prototype.push = function (item) {
            this._list.push(item);
        };
        /**获取栈顶元素，并删除*/
        Stack.prototype.pop = function () {
            return this._list.pop();
        };
        /**获取栈顶元素，并不删除*/
        Stack.prototype.peek = function () {
            if (this._list.length == 0)
                return null;
            return this._list[this._list.length - 1];
        };
        /**转换成标准数组*/
        Stack.prototype.toArray = function () {
            return this._list.slice(0, this._list.length);
        };
        /**是否包含指定元素*/
        Stack.prototype.contains = function (item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        };
        /**清空*/
        Stack.prototype.clear = function () {
            this._list.length = 0;
        };
        Object.defineProperty(Stack.prototype, "length", {
            get: function () {
                return this._list.length;
            },
            enumerable: false,
            configurable: true
        });
        Stack.prototype.foreach = function (compareFn) {
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!compareFn.call(null, item))
                    break;
            }
        };
        return Stack;
    }());
    airkit.Stack = Stack;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:53
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/common/Constant.ts
 */

(function (airkit) {
    var eLoaderType;
    (function (eLoaderType) {
        eLoaderType[eLoaderType["NONE"] = 0] = "NONE";
        eLoaderType[eLoaderType["VIEW"] = 1] = "VIEW";
        eLoaderType[eLoaderType["FULL_SCREEN"] = 2] = "FULL_SCREEN";
        eLoaderType[eLoaderType["WINDOW"] = 3] = "WINDOW";
        eLoaderType[eLoaderType["NET_LOADING"] = 4] = "NET_LOADING";
        eLoaderType[eLoaderType["CUSTOM_1"] = 5] = "CUSTOM_1";
        eLoaderType[eLoaderType["CUSTOM_2"] = 6] = "CUSTOM_2";
        eLoaderType[eLoaderType["CUSTOM_3"] = 7] = "CUSTOM_3";
    })(eLoaderType = airkit.eLoaderType || (airkit.eLoaderType = {}));
    var eUIType;
    (function (eUIType) {
        eUIType[eUIType["SHOW"] = 0] = "SHOW";
        eUIType[eUIType["POPUP"] = 1] = "POPUP";
    })(eUIType = airkit.eUIType || (airkit.eUIType = {}));
    /**
     * UI层级
     */
    var eUILayer;
    (function (eUILayer) {
        eUILayer[eUILayer["BG"] = 0] = "BG";
        eUILayer[eUILayer["MAIN"] = 1] = "MAIN";
        eUILayer[eUILayer["GUI"] = 2] = "GUI";
        eUILayer[eUILayer["LOADING"] = 3] = "LOADING";
        //  MAX
    })(eUILayer = airkit.eUILayer || (airkit.eUILayer = {}));
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
        LogLevel[LogLevel["INFO"] = 6] = "INFO";
        LogLevel[LogLevel["WARNING"] = 5] = "WARNING";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["EXCEPTION"] = 3] = "EXCEPTION";
    })(LogLevel = airkit.LogLevel || (airkit.LogLevel = {}));
    var eDlgResult;
    (function (eDlgResult) {
        eDlgResult[eDlgResult["YES"] = 1] = "YES";
        eDlgResult[eDlgResult["NO"] = 2] = "NO";
    })(eDlgResult = airkit.eDlgResult || (airkit.eDlgResult = {}));
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:56
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/config/ConfigItem.ts
 */

(function (airkit) {
    /**
     * 配置表
     * @author ankye
     * @time 2018-7-11
     */
    var ConfigItem = /** @class */ (function () {
        function ConfigItem(url, name, key) {
            this.url = url;
            this.name = name;
            this.key = key;
        }
        return ConfigItem;
    }());
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
    var ConfigManger = /** @class */ (function (_super) {
        __extends(ConfigManger, _super);
        function ConfigManger() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ConfigManger, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new ConfigManger();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        /**初始化数据*/
        ConfigManger.prototype.init = function (keys, zipPath) {
            if (zipPath === void 0) { zipPath = null; }
            if (zipPath != null)
                ConfigManger.zipUrl = zipPath;
            this._listTables = [];
            var c = keys;
            for (var k in c) {
                this._listTables.push(new airkit.ConfigItem(k, k, c[k]));
            }
        };
        /**释放数据*/
        ConfigManger.prototype.release = function () {
            if (!this._listTables)
                return;
            for (var _i = 0, _a = this._listTables; _i < _a.length; _i++) {
                var info = _a[_i];
                airkit.DataProvider.Instance.unload(info.url);
            }
            airkit.ArrayUtils.clear(this._listTables);
            this._listTables = null;
        };
        /**开始加载*/
        ConfigManger.prototype.loadAll = function (url) {
            if (url === void 0) { url = ConfigManger.zipUrl; }
            if (this._listTables.length > 0) {
                airkit.DataProvider.Instance.enableZip();
                return airkit.DataProvider.Instance.loadZip(url, this._listTables);
            }
            //return DataProvider.Instance.load(this._listTables)
        };
        /**
         * 获取列表，fiter用于过滤,可以有多个值，格式为 [["id",this.id],["aaa","bbb"]]
         * @param table
         * @param filter 目前只实现了绝对值匹配
         */
        ConfigManger.prototype.query = function (table, filter) {
            var dic = airkit.DataProvider.Instance.getConfig(table);
            if (dic == null)
                return [];
            if (filter == null)
                filter = [];
            var result = [];
            for (var key in dic) {
                var val = dic[key];
                var flag = true;
                for (var j = 0; j < filter.length; j++) {
                    var k = filter[j][0];
                    var v = filter[j][1];
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
        };
        ConfigManger.prototype.getInfo = function (table, key) {
            var info = airkit.DataProvider.Instance.getInfo(table, key);
            return info;
        };
        Object.defineProperty(ConfigManger.prototype, "listTables", {
            /**定义需要前期加载的资源*/
            // public get preLoadRes(): Array<[string, string]> {
            //     let c = TableConfig.keys()
            //     let res = []
            //     for (let k in c) {
            //         res.push(["res/config/" + k, laya.net.Loader.JSON])
            //     }
            //     return res
            // }
            get: function () {
                return this._listTables;
            },
            enumerable: false,
            configurable: true
        });
        ConfigManger.instance = null;
        ConfigManger.zipUrl = 'config/config';
        return ConfigManger;
    }(airkit.Singleton));
    airkit.ConfigManger = ConfigManger;
    //通过主键获取配置信息
    function getCInfo(table, key) {
        return ConfigManger.Instance.getInfo(table, key);
    }
    airkit.getCInfo = getCInfo;
    //通过查询键获取列表，query:[[k,v],[k,v]]
    function getCList(table, query) {
        return ConfigManger.Instance.query(table, query);
    }
    airkit.getCList = getCList;
    //通过查询键获取单个信息，query:[[k,v],[k,v]]
    function queryCInfo(table, query) {
        var list = getCList(table, query);
        if (list == null)
            return null;
        return list[0];
    }
    airkit.queryCInfo = queryCInfo;
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
    var DataProvider = /** @class */ (function (_super) {
        __extends(DataProvider, _super);
        function DataProvider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._dicTemplate = null;
            _this._dicData = null;
            return _this;
        }
        Object.defineProperty(DataProvider, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new DataProvider();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        DataProvider.prototype.enableZip = function () {
            this._zip = true;
        };
        DataProvider.prototype.setup = function () {
            this._dicTemplate = new airkit.SDictionary();
            this._dicData = new airkit.SDictionary();
            this._zip = false;
        };
        DataProvider.prototype.destroy = function () {
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
        };
        DataProvider.prototype.loadZip = function (url, list) {
            var _this = this;
            return airkit.ResourceManager.Instance.loadRes(url, cc.BufferAsset).then(function (v) {
                var ab = airkit.ResourceManager.Instance.getRes(url);
                return airkit.ZipUtils.unzip(ab['_buffer'])
                    .then(function (v) {
                    for (var i = 0; i < list.length; i++) {
                        var template = list[i];
                        _this._dicTemplate.add(list[i].url, template);
                        airkit.Log.info('Load config %s', template.url);
                        var json_res = JSON.parse(v[template.url]);
                        if (airkit.StringUtils.isNullOrEmpty(template.key)) {
                            _this._dicData.add(template.name, json_res);
                        }
                        else {
                            var map = {};
                            var sValue = void 0;
                            var sData = void 0;
                            var i_1 = 0;
                            var isArrayKey = Array.isArray(template.key);
                            while (json_res[i_1]) {
                                sData = json_res[i_1];
                                if (isArrayKey) {
                                    sValue = sData[template.key[0]];
                                    for (var i_2 = 1; i_2 < template.key.length; i_2++) {
                                        sValue += '_' + sData[template.key[i_2]];
                                    }
                                }
                                else {
                                    sValue = sData[template.key];
                                }
                                airkit.assertNullOrNil(sValue, '配置表解析错误:' + template.url);
                                map[sValue] = sData;
                                i_1++;
                            }
                            _this._dicData.add(template.name, map);
                        }
                    }
                    return v;
                })
                    .catch(function (e) {
                    airkit.Log.error(e);
                    return null;
                });
            });
        };
        DataProvider.prototype.load = function (list) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var assets = [];
                for (var i = 0; i < list.length; i++) {
                    if (!airkit.ResourceManager.Instance.getRes(list[i].url)) {
                        assets.push({ url: list[i].url, type: cc.JsonAsset });
                        _this._dicTemplate.add(list[i].url, list[i]);
                    }
                }
                if (assets.length == 0) {
                    resolve([]);
                    return;
                }
                airkit.ResourceManager.Instance.loadArrayRes(assets)
                    .then(function (v) {
                    for (var i = 0; i < v.length; i++) {
                        _this.onLoadComplete(v[i]);
                        resolve(v);
                    }
                })
                    .catch(function (e) {
                    reject(e);
                });
            });
        };
        DataProvider.prototype.unload = function (url) {
            var template = this._dicTemplate.getValue(url);
            if (template) {
                this._dicData.remove(template.name);
            }
            if (this._zip) {
            }
            else {
                airkit.ResourceManager.Instance.clearRes(url, 1);
            }
            this._dicTemplate.remove(url);
        };
        DataProvider.prototype.unloadAll = function () {
            if (!this._dicTemplate)
                return;
            this._dicTemplate.foreach(function (key, value) {
                this.Unload(key);
                return true;
            });
            this._dicData.clear();
            this._dicTemplate.clear();
        };
        /**返回表*/
        DataProvider.prototype.getConfig = function (table) {
            var data = this._dicData.getValue(table);
            return data;
        };
        /**返回一行*/
        DataProvider.prototype.getInfo = function (table, key) {
            var data = this._dicData.getValue(table);
            if (data) {
                var isArrayKey = Array.isArray(key);
                var sValue = void 0;
                if (isArrayKey) {
                    sValue = key[0];
                    for (var i = 1; i < key.length; i++) {
                        sValue += '_' + key[i];
                    }
                }
                else {
                    sValue = key;
                }
                var info = data[sValue];
                return info;
            }
            return null;
        };
        DataProvider.prototype.getRes = function (url) {
            airkit.Log.debug('[load]加载配置表:' + url);
            var template = this._dicTemplate.getValue(url);
            if (template) {
                var json_res = airkit.ResourceManager.Instance.getRes(url);
                if (airkit.StringUtils.isNullOrEmpty(template.key)) {
                    this._dicData.add(template.name, json_res);
                }
                else {
                    var map = {};
                    var sValue = void 0;
                    var sData = void 0;
                    var i = 0;
                    var isArrayKey = Array.isArray(template.key);
                    while (json_res[i]) {
                        sData = json_res[i];
                        if (isArrayKey) {
                            sValue = sData[template.key[0]];
                            for (var i_3 = 1; i_3 < template.key.length; i_3++) {
                                sValue += '_' + sData[template.key[i_3]];
                            }
                        }
                        else {
                            sValue = sData[template.key];
                        }
                        airkit.assertNullOrNil(sValue, '配置表解析错误:' + template.url);
                        map[sValue] = sData;
                        i++;
                    }
                    this._dicData.add(template.name, map);
                }
            }
        };
        DataProvider.prototype.onLoadComplete = function (url) {
            this.getRes(url);
        };
        DataProvider.instance = null;
        return DataProvider;
    }(airkit.Singleton));
    airkit.DataProvider = DataProvider;
})(airkit || (airkit = {}));

(function (airkit) {
    function base64_encode(data) {
        var base = new Base64();
        var buffer = stringToArrayBuffer(data);
        var str = base.encode(buffer);
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
    var Base64 = /** @class */ (function () {
        function Base64() {
            this.alphabet = [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z',
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '+',
                '/',
            ];
            this.values = {};
            for (var i = 0; i < 64; ++i) {
                this.values[this.alphabet[i]] = i;
            }
        }
        Base64.prototype.encode = function (bytes) {
            var array = new Uint8Array(bytes);
            var base64 = [];
            var index = 0;
            var quantum;
            var value;
            /* tslint:disable:no-bitwise */
            // Grab as many sets of 3 bytes as we can, that form 24 bits.
            while (index + 2 < array.byteLength) {
                quantum = (array[index] << 16) | (array[index + 1] << 8) | array[index + 2];
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
                base64.push('==');
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
                base64.push('=');
            }
            /* tslint:enable:no-bitwise */
            return base64.join('');
        };
        Base64.prototype.decode = function (string) {
            var size = string.length;
            if (size === 0) {
                return new Uint8Array(new ArrayBuffer(0));
            }
            if (size % 4 !== 0) {
                throw new Error('Bad length: ' + size);
            }
            if (!string.match(/^[a-zA-Z0-9+/]+={0,2}$/)) {
                throw new Error('Invalid base64 encoded value');
            }
            // Every 4 base64 chars = 24 bits = 3 bytes. But, we also need to figure out
            // padding, if any.
            var bytes = 3 * (size / 4);
            var numPad = 0;
            if (string.charAt(size - 1) === '=') {
                numPad++;
                bytes--;
            }
            if (string.charAt(size - 2) === '=') {
                numPad++;
                bytes--;
            }
            var buffer = new Uint8Array(new ArrayBuffer(bytes));
            var index = 0;
            var bufferIndex = 0;
            var quantum;
            if (numPad > 0) {
                size -= 4; // handle the last one specially
            }
            /* tslint:disable:no-bitwise */
            while (index < size) {
                quantum = 0;
                for (var i = 0; i < 4; ++i) {
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
                for (var i = 0; i < 4 - numPad; ++i) {
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
        };
        return Base64;
    }());
    airkit.Base64 = Base64;
})(airkit || (airkit = {}));

(function (airkit) {
    function md5_encrypt(data) {
        var base = new MD5();
        return base.hex_md5(data);
    }
    airkit.md5_encrypt = md5_encrypt;
    var MD5 = /** @class */ (function () {
        function MD5() {
            this.hexcase = 0; /* hex output format. 0 - lowercase 1 - uppercase        */
            this.b64pad = ''; /* base-64 pad character. "=" for strict RFC compliance   */
        }
        /*
         * These are the privates you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        MD5.prototype.hex_md5 = function (s) {
            return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
        }; //这个函数就行了，
        MD5.prototype.b64_md5 = function (s) {
            return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s)));
        };
        MD5.prototype.any_md5 = function (s, e) {
            return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e);
        };
        MD5.prototype.hex_hmac_md5 = function (k, d) {
            return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
        };
        MD5.prototype.b64_hmac_md5 = function (k, d) {
            return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
        };
        MD5.prototype.any_hmac_md5 = function (k, d, e) {
            return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e);
        };
        /*
         * Perform a simple self-test to see if the VM is working
         */
        MD5.prototype.md5_vm_test = function () {
            return this.hex_md5('abc').toLowerCase() == '900150983cd24fb0d6963f7d28e17f72';
        };
        /*
         * Calculate the MD5 of a raw string
         */
        MD5.prototype.rstr_md5 = function (s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        MD5.prototype.rstr_hmac_md5 = function (key, data) {
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
        };
        /*
         * Convert a raw string to a hex string
         */
        MD5.prototype.rstr2hex = function (input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
            var output = '';
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
            }
            return output;
        };
        /*
         * Convert a raw string to a base-64 string
         */
        MD5.prototype.rstr2b64 = function (input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = '';
            }
            var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var output = '';
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
                }
            }
            return output;
        };
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        MD5.prototype.rstr2any = function (input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
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
            var output = '';
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        };
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        MD5.prototype.str2rstr_utf8 = function (input) {
            var output = '';
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
        };
        /*
         * Encode a string as utf-16
         */
        MD5.prototype.str2rstr_utf16le = function (input) {
            var output = '';
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xff, (input.charCodeAt(i) >>> 8) & 0xff);
            return output;
        };
        MD5.prototype.str2rstr_utf16be = function (input) {
            var output = '';
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xff, input.charCodeAt(i) & 0xff);
            return output;
        };
        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        MD5.prototype.rstr2binl = function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
            return output;
        };
        /*
         * Convert an array of little-endian words to a string
         */
        MD5.prototype.binl2rstr = function (input) {
            var output = '';
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
            return output;
        };
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        MD5.prototype.binl_md5 = function (x, len) {
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
        };
        /*
         * These privates implement the four basic operations the algorithm uses.
         */
        MD5.prototype.md5_cmn = function (q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        };
        MD5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | (~b & d), a, b, x, s, t);
        };
        MD5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & ~d), a, b, x, s, t);
        };
        MD5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };
        MD5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
        };
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        MD5.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        };
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        MD5.prototype.bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        return MD5;
    }());
    airkit.MD5 = MD5;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:15
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/event/EventArgs.ts
 */
// import { ArrayUtils } from "../utils/ArrayUtils";

(function (airkit) {
    /**
     * 事件参数
     * @author ankye
     * @time 2018-7-6
     */
    var EventArgs = /** @class */ (function () {
        function EventArgs() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._type = '';
            this._data = null;
            if (!args || args.length == 0)
                return;
            if (args instanceof Array)
                this._data = airkit.ArrayUtils.copy(args[0]);
            else
                this._data = airkit.ArrayUtils.copy(args);
        }
        EventArgs.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length == 0)
                return;
            if (args instanceof Array)
                this._data = airkit.ArrayUtils.copy(args[0]);
            else
                this._data = airkit.ArrayUtils.copy(args);
        };
        EventArgs.prototype.get = function (index) {
            if (!this._data || this._data.length == 0)
                return null;
            if (index < 0 || index >= this._data.length)
                return null;
            return this._data[index];
        };
        Object.defineProperty(EventArgs.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (t) {
                this._type = t;
            },
            enumerable: false,
            configurable: true
        });
        return EventArgs;
    }());
    airkit.EventArgs = EventArgs;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:18
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/event/EventCenter.ts
 */
// import { EventArgs } from "./EventArgs";
// import { EventDispatcher } from "./EventDispatcher";
// import { Singleton } from "../collection/Singleton";

(function (airkit) {
    /**
     * 全局事件
     * @author ankye
     * @time 2018-7-6
     */
    var EventCenter = /** @class */ (function (_super) {
        __extends(EventCenter, _super);
        function EventCenter() {
            var _this = _super.call(this) || this;
            _this._event = null;
            _this._evtArgs = null;
            _this._event = new airkit.EventDispatcher();
            _this._evtArgs = new airkit.EventArgs();
            return _this;
        }
        Object.defineProperty(EventCenter, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new EventCenter();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        EventCenter.on = function (type, caller, fun) {
            EventCenter.Instance._event.on(type, caller, fun);
        };
        /**
         * 移除监听
         */
        EventCenter.off = function (type, caller, fun) {
            EventCenter.Instance._event.off(type, caller, fun);
        };
        /**
         * 派发事件
         */
        EventCenter.dispatchEvent = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            EventCenter.Instance._evtArgs.init(args);
            EventCenter.Instance._event.dispatchEvent(type, EventCenter.Instance._evtArgs);
        };
        EventCenter.clear = function () {
            EventCenter.Instance._event.clear();
        };
        EventCenter.instance = null;
        return EventCenter;
    }(airkit.Singleton));
    airkit.EventCenter = EventCenter;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:24
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/event/EventDispatcher.ts
 */
// import { DicUtils } from "../utils/DicUtils";
// import { EventArgs } from "./EventArgs";

(function (airkit) {
    /**
     * 事件
     * @author ankye
     * @time 2018-7-6
     */
    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
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
        EventDispatcher.prototype.on = function (type, caller, fun) {
            if (!this._dicFuns[type]) {
                this._dicFuns[type] = [];
                this._dicFuns[type].push(airkit.Handler.create(caller, fun, null, false));
            }
            else {
                var arr = this._dicFuns[type];
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var item = arr_1[_i];
                    if (item.caller == caller && item.method == fun)
                        return;
                }
                arr.push(airkit.Handler.create(caller, fun, null, false));
            }
        };
        /**
         * 移除监听
         */
        EventDispatcher.prototype.off = function (type, caller, fun) {
            var arr = this._dicFuns[type];
            if (!arr)
                return;
            for (var i = 0; i < arr.length; ++i) {
                var item = arr[i];
                if (item.caller == caller && item.method == fun) {
                    item.recover();
                    arr.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * 派发事件，注意参数类型为EventArgs
         */
        EventDispatcher.prototype.dispatchEvent = function (type, args) {
            args.type = type;
            var arr = this._dicFuns[type];
            if (!arr)
                return;
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var item = arr_2[_i];
                item.runWith(args);
            }
        };
        /**
         * 派发事件
         */
        EventDispatcher.prototype.dispatch = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._evtArgs.init(args);
            this.dispatchEvent(type, this._evtArgs);
        };
        EventDispatcher.prototype.clear = function () {
            airkit.DicUtils.clearDic(this._dicFuns);
        };
        return EventDispatcher;
    }());
    airkit.EventDispatcher = EventDispatcher;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:28
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/event/EventID.ts
 */

(function (airkit) {
    var Event = /** @class */ (function () {
        function Event() {
        }
        Event.PROGRESS = 'progress';
        Event.COMPLETE = 'complete';
        Event.ERROR = 'error';
        return Event;
    }());
    airkit.Event = Event;
    var EventID = /** @class */ (function () {
        function EventID() {
        }
        //～～～～～～～～～～～～～～～～～～～～～～～场景~～～～～～～～～～～～～～～～～～～～～～～～//
        //游戏
        EventID.BEGIN_GAME = 'BEGIN_GAME';
        EventID.RESTART_GAEM = 'RESTART_GAME';
        //暂停游戏-主界面暂停按钮
        EventID.STOP_GAME = 'STOP_GAME';
        EventID.PAUSE_GAME = 'PAUSE_GAME';
        EventID.ON_SHOW = 'ON_SHOW';
        EventID.ON_HIDE = 'ON_HIDE';
        //切换场景
        EventID.CHANGE_SCENE = 'CHANGE_SCENE';
        EventID.RESIZE = 'RESIZE';
        //模块管理事件
        EventID.BEGIN_MODULE = 'BEGIN_MODULE';
        EventID.END_MODULE = 'END_MODULE';
        EventID.ENTER_MODULE = 'ENTER_MODULE';
        EventID.EXIT_MODULE = 'EXIT_MODULE';
        EventID.UI_OPEN = 'UI_OPEN'; //界面打开
        EventID.UI_CLOSE = 'UI_CLOSE'; //界面关闭
        EventID.UI_LANG = 'UI_LANG'; //语言设置改变
        return EventID;
    }());
    airkit.EventID = EventID;
    var LoaderEventID = /** @class */ (function () {
        function LoaderEventID() {
        }
        //加载事件
        LoaderEventID.RESOURCE_LOAD_COMPLATE = 'RESOURCE_LOAD_COMPLATE'; //资源加载完成
        LoaderEventID.RESOURCE_LOAD_PROGRESS = 'RESOURCE_LOAD_PROGRESS'; //资源加载进度
        LoaderEventID.RESOURCE_LOAD_FAILED = 'RESOURCE_LOAD_FAILED'; //资源加载失败
        //加载界面事件
        LoaderEventID.LOADVIEW_OPEN = 'LOADVIEW_OPEN'; //加载界面打开
        LoaderEventID.LOADVIEW_COMPLATE = 'LOADVIEW_COMPLATE'; //加载进度完成
        LoaderEventID.LOADVIEW_PROGRESS = 'LOADVIEW_PROGRESS'; //加载进度
        return LoaderEventID;
    }());
    airkit.LoaderEventID = LoaderEventID;
})(airkit || (airkit = {}));
// import { ISignal } from "./ISignal";

(function (airkit) {
    var Signal = /** @class */ (function () {
        function Signal() {
        }
        Signal.prototype.destory = function () {
            this._listener && this._listener.destory();
            this._listener = null;
        };
        /**
         * 派发信号
         * @param arg
         */
        Signal.prototype.dispatch = function (arg) {
            if (this._listener)
                this._listener.execute(arg);
        };
        Signal.prototype.has = function (caller) {
            if (this._listener == null)
                return false;
            return this._listener.has(caller);
        };
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        Signal.prototype.on = function (caller, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, false);
        };
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        Signal.prototype.once = function (caller, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, true);
        };
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        Signal.prototype.off = function (caller, method) {
            if (this._listener)
                this._listener.off(caller, method);
        };
        Signal.prototype.offAll = function () {
            if (this._listener)
                this._listener.offAll();
        };
        /**
         * 保证ListenerManager可用
         */
        Signal.prototype.makeSureListenerManager = function () {
            if (!this._listener)
                this._listener = new SignalListener();
        };
        return Signal;
    }());
    airkit.Signal = Signal;
    var SignalListener = /** @class */ (function () {
        function SignalListener() {
            this.stopped = false;
        }
        SignalListener.prototype.destory = function () {
            this.stopped = false;
            this.clear();
        };
        SignalListener.prototype.has = function (caller) {
            for (var i = 0; i < this.handlers.length; i++) {
                if (this.handlers[i].caller == caller) {
                    return true;
                }
            }
            return false;
        };
        SignalListener.prototype.on = function (caller, method, args, once) {
            if (once === void 0) { once = false; }
            if (!this.handlers)
                this.handlers = [];
            var handler = new airkit.Handler(caller, method, args, once);
            this.handlers.push(handler);
            return handler;
        };
        /**
         * 解除回调
         * @param caller
         * @param method
         */
        SignalListener.prototype.off = function (caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            var tempHandlers = [];
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
        };
        /**
         * 解除所有回调
         * @param caller
         * @param method
         */
        SignalListener.prototype.offAll = function () {
            this.clear();
            this.handlers = [];
        };
        /**
         * 清除所有回调
         */
        SignalListener.prototype.clear = function () {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                handler.recover();
            }
            this.handlers = null;
        };
        SignalListener.prototype.stop = function () {
            this.stopped = true;
        };
        SignalListener.prototype.execute = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.handlers || this.handlers.length <= 0)
                return;
            var handlers = this.handlers;
            var len = handlers.length;
            var handler;
            var temp = [];
            var i = 0;
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
        };
        return SignalListener;
    }());
    airkit.SignalListener = SignalListener;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:41
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/lang/LangManager.ts
 */

(function (airkit) {
    /**
     * 提供简易获取语言包的方式,配合语言导出脚本
     * @param key LK.xxx  %s,%s..%s.表示参数占位符
     * @param args
     */
    function L(key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var info = airkit.getCInfo(LangManager.lang, key);
        if (info == null)
            return 'unknown key:' + key;
        if (airkit.StringUtils.isNullOrEmpty(info.name))
            return '';
        return airkit.StringUtils.format.apply(airkit.StringUtils, __spreadArrays([info.name], args));
    }
    airkit.L = L;
    /**
     * 多语言
     * @author ankye
     * @time 2017-7-9
     */
    var LangManager = /** @class */ (function (_super) {
        __extends(LangManager, _super);
        function LangManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //设置语言包
        LangManager.setLang = function (lang) {
            var data = airkit.ConfigManger.Instance.query(this.lang);
            if (data == null) {
                airkit.Log.error('set lang %s failed ', lang);
                return false;
            }
            this.lang = lang;
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_LANG, this.lang);
            return true;
        };
        LangManager.lang = 'zh_cn.json'; // 语言包
        return LangManager;
    }(airkit.Singleton));
    airkit.LangManager = LangManager;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:45
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/log/Log.ts
 */
// import { StringUtils } from "../utils/StringUtils";
// import { DateUtils } from "../utils/DateUtils";
// import { LogLevel } from "../common/Constant";

(function (airkit) {
    /**
     * 日志类处理
     * @author ankye
     * @time 2018-7-8
     */
    var Log = /** @class */ (function () {
        function Log() {
        }
        Log.format = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (format == null)
                return 'null';
            if (airkit.StringUtils.isString(format)) {
                var arr = [];
                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    if (airkit.StringUtils.isString(arg)) {
                        arr.push(arg);
                    }
                    else {
                        arr.push(JSON.stringify(arg, null, 4));
                    }
                }
                var content = airkit.StringUtils.format.apply(airkit.StringUtils, __spreadArrays([format], arr));
                return content;
            }
            else {
                if (typeof format == 'object' && format.message) {
                    return format.message;
                }
                else {
                    return JSON.stringify(format, null, 4);
                }
            }
        };
        Log.debug = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.LEVEL < airkit.LogLevel.DEBUG)
                return;
            var content = this.format.apply(this, __spreadArrays([format], args));
            console.log(airkit.DateUtils.currentYMDHMS(), '[debug]', content);
            return content;
        };
        Log.info = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.LEVEL < airkit.LogLevel.INFO)
                return;
            var content = this.format.apply(this, __spreadArrays([format], args));
            console.log(airkit.DateUtils.currentYMDHMS(), '[info]', content);
            return content;
        };
        Log.warning = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.LEVEL < airkit.LogLevel.WARNING)
                return;
            var content = this.format.apply(this, __spreadArrays([format], args));
            console.warn(airkit.DateUtils.currentYMDHMS(), '[warn]', content);
            return content;
        };
        Log.error = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.LEVEL < airkit.LogLevel.ERROR)
                return;
            var content = this.format.apply(this, __spreadArrays([format], args));
            console.error(airkit.DateUtils.currentYMDHMS(), '[error]', content);
            return content;
        };
        Log.exception = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.LEVEL < airkit.LogLevel.EXCEPTION)
                return;
            var content = this.format.apply(this, __spreadArrays([format], args));
            console.exception(airkit.DateUtils.currentYMDHMS(), '[exce]', content);
            return content;
        };
        Log.dump = function (value) {
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
            console.log(airkit.DateUtils.currentYMDHMS(), '[Dump]', value);
        };
        Log.LEVEL = airkit.LogLevel.INFO;
        return Log;
    }());
    airkit.Log = Log;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:50
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/module/BaseModule.ts
 */
// import { ISignal } from "../event/ISignal";
// import { EventID } from "../event/EventID";
// import { LOADVIEW_TYPE_NONE } from "../common/Constant";

(function (airkit) {
    var BaseModule = /** @class */ (function (_super) {
        __extends(BaseModule, _super);
        function BaseModule() {
            return _super.call(this) || this;
        }
        BaseModule.prototype.setup = function (args) {
            this.emit(airkit.EventID.BEGIN_MODULE, this.name);
            this.registerEvent();
        };
        BaseModule.prototype.enter = function () {
            this.emit(airkit.EventID.ENTER_MODULE, this.name);
        };
        BaseModule.prototype.exit = function () {
            this.emit(airkit.EventID.EXIT_MODULE, this.name);
        };
        BaseModule.prototype.update = function (dt) { };
        BaseModule.prototype.registerEvent = function () {
            this.registerSignalEvent();
        };
        BaseModule.prototype.unRegisterEvent = function () {
            this.unregisterSignalEvent();
        };
        //需要提前加载的资源
        BaseModule.res = function () {
            return null;
        };
        BaseModule.loaderTips = function () {
            return '资源加载中';
        };
        /**是否显示加载界面*/
        BaseModule.loaderType = function () {
            return airkit.eLoaderType.NONE;
        };
        BaseModule.prototype.registerSignalEvent = function () {
            var event_list = this.signalMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_1 = event_list; _i < event_list_1.length; _i++) {
                var item = event_list_1[_i];
                var signal = item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        };
        BaseModule.prototype.unregisterSignalEvent = function () {
            var event_list = this.signalMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_2 = event_list; _i < event_list_2.length; _i++) {
                var item = event_list_2[_i];
                var signal = item[0];
                signal.off(item[1], item[2]);
            }
        };
        BaseModule.prototype.signalMap = function () {
            return null;
        };
        BaseModule.prototype.dispose = function () {
            this.emit(airkit.EventID.END_MODULE, this.name);
            this.unRegisterEvent();
        };
        return BaseModule;
    }(cc.Node));
    airkit.BaseModule = BaseModule;
})(airkit || (airkit = {}));
// import { ResourceManager } from "../loader/ResourceManager";
// import { SDictionary } from "../collection/Dictionary";
// import { BaseModule } from "./BaseModule";
// import { Log } from "../log/Log";
// import { EventID } from "../event/EventID";

(function (airkit) {
    var Mediator = /** @class */ (function () {
        function Mediator() {
        }
        Object.defineProperty(Mediator, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new Mediator();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        Mediator.prototype.setup = function () {
            this.registerEvent();
        };
        /**
         * 注册模块
         * @param name
         * @param cls
         */
        Mediator.register = function (name, cls) {
            airkit.ClassUtils.regClass(name, cls);
        };
        //远程调用
        Mediator.call = function (name, funcName) {
            var _this = this;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                var m = _this.modules.getValue(name);
                if (m == null) {
                    m = airkit.ClassUtils.getInstance(name);
                    var clas = airkit.ClassUtils.getClass(name);
                    if (m == null) {
                        airkit.Log.warning('Cant find module %s', name);
                        reject('Cant find module' + name);
                    }
                    _this.modules.add(name, m);
                    m.name = name;
                    var onInitModuleOver = function () {
                        m.enter();
                        if (funcName == null) {
                            resolve(m);
                        }
                        else {
                            var result = _this.callFunc(m, funcName, args);
                            resolve(result);
                        }
                    };
                    m.once(airkit.EventID.BEGIN_MODULE, onInitModuleOver, null);
                    if (clas.res() && clas.res().length > 0) {
                        _this.loadResource(m, clas)
                            .then(function (v) {
                            m.setup(null);
                        })
                            .catch(function (e) {
                            airkit.Log.warning('Load module Resource Failed %s', name);
                            reject('Load module Resource Failed ' + name);
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
                        var result = _this.callFunc(m, funcName, args);
                        resolve(result);
                    }
                }
            });
        };
        Mediator.callFunc = function (m, funcName, args) {
            if (funcName == null) {
                return;
            }
            var func = m[funcName];
            var result = null;
            if (func) {
                if (args) {
                    result = func.apply(m, args);
                }
                else {
                    result = func.apply(m);
                }
            }
            else {
                airkit.Log.error('cant find funcName %s from Module:%s', funcName, m.name);
            }
            return result;
        };
        /**处理需要提前加载的资源*/
        Mediator.loadResource = function (m, clas) {
            var res_map = clas.res();
            var load_view = clas.loaderType();
            var tips = clas.loaderTips();
            return airkit.ResourceManager.Instance.loadArrayRes(res_map, load_view, tips, 1, true);
        };
        Mediator.prototype.destroy = function () {
            this.unRegisterEvent();
            this.clear();
        };
        Mediator.prototype.clear = function () {
            if (Mediator.modules) {
                Mediator.modules.foreach(function (k, v) {
                    v.exit();
                    v.dispose();
                    return true;
                });
                Mediator.modules.clear();
            }
        };
        Mediator.prototype.update = function (dt) {
            Mediator.modules.foreach(function (k, v) {
                v.update(dt);
                return true;
            });
        };
        Mediator.prototype.registerEvent = function () { };
        Mediator.prototype.unRegisterEvent = function () { };
        Mediator.modules = new airkit.SDictionary();
        Mediator.instance = null;
        return Mediator;
    }());
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
    var eHttpRequestType;
    (function (eHttpRequestType) {
        eHttpRequestType[eHttpRequestType["TypeText"] = 0] = "TypeText";
        eHttpRequestType[eHttpRequestType["TypeJson"] = 1] = "TypeJson";
        eHttpRequestType[eHttpRequestType["TypePB"] = 2] = "TypePB";
    })(eHttpRequestType = airkit.eHttpRequestType || (airkit.eHttpRequestType = {}));
    airkit.POST = 'POST';
    airkit.GET = 'GET';
    airkit.CONTENT_TYPE_TEXT = 'application/x-www-form-urlencoded';
    airkit.CONTENT_TYPE_JSON = 'application/json';
    airkit.CONTENT_TYPE_PB = 'application/octet-stream'; // "application/x-protobuf"  //
    //responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
    airkit.RESPONSE_TYPE_TEXT = 'text';
    airkit.RESPONSE_TYPE_JSON = 'json';
    airkit.RESPONSE_TYPE_XML = 'xml';
    airkit.RESPONSE_TYPE_BYTE = 'arraybuffer';
    airkit.HTTP_REQUEST_TIMEOUT = 10000; //设置超时时间
    var Http = /** @class */ (function () {
        function Http() {
        }
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
        Http.request = function (url, method, reqType, header, data, responseType) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (Http.currentRequsts > Http.maxRequest) {
                    airkit.Log.error('reached max request %s', Http.currentRequsts);
                }
                if (Http.currentRequsts < 0)
                    Http.currentRequsts = 0;
                Http.currentRequsts++;
                if (responseType == undefined) {
                    responseType = 'text';
                }
                if (method != airkit.POST && method != airkit.GET) {
                    Http.currentRequsts--;
                    reject('method error');
                }
                if (!header)
                    header = [];
                var key = 'Content-Type';
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
                    airkit.Log.error('request timeout %s', url);
                    request.targetOff(request);
                    Http.currentRequsts--;
                    reject('timeout');
                };
                request.once(airkit.Event.COMPLETE, _this, function (event) {
                    var data;
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
                request.once(airkit.Event.ERROR, _this, function (event) {
                    airkit.Log.error('req:%s error:%s', url, event);
                    request.targetOff(request);
                    Http.currentRequsts--;
                    reject(event);
                });
                request.on(airkit.Event.PROGRESS, _this, function (event) { });
                if (method == airkit.GET) {
                    request.send(url, null, method, responseType, header);
                }
                else {
                    request.send(url, data, method, responseType, header);
                }
            });
        };
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
        Http.get = function (url, reqType, header, responseType) {
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            if (responseType == undefined) {
                responseType = airkit.RESPONSE_TYPE_TEXT;
            }
            return this.request(url, airkit.GET, reqType, header, null, responseType);
        };
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
        Http.post = function (url, params, reqType, header, responseType) {
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
        };
        Http.currentRequsts = 0;
        Http.maxRequest = 6;
        return Http;
    }());
    airkit.Http = Http;
})(airkit || (airkit = {}));

(function (airkit) {
    var HttpRequest = /** @class */ (function (_super) {
        __extends(HttpRequest, _super);
        function HttpRequest() {
            var _this_1 = _super !== null && _super.apply(this, arguments) || this;
            /**@private */
            _this_1._http = new XMLHttpRequest();
            return _this_1;
        }
        /**
         * 发送 HTTP 请求。
         * @param	url				请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
         * @param	data			(default = null)发送的数据。
         * @param	method			(default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
         * @param	responseType	(default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @param	headers			(default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         */
        HttpRequest.prototype.send = function (url, data, method, responseType, headers) {
            if (data === void 0) { data = null; }
            if (method === void 0) { method = 'get'; }
            if (responseType === void 0) { responseType = 'text'; }
            if (headers === void 0) { headers = null; }
            this._responseType = responseType;
            this._data = null;
            this._url = url;
            var _this = this;
            var http = this._http;
            http.open(method, url, true);
            var isJson = false;
            if (headers) {
                for (var i = 0; i < headers.length; i++) {
                    http.setRequestHeader(headers[i++], headers[i]);
                }
            }
            else if (!window.conch) {
                if (!data || typeof data == 'string')
                    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                else {
                    http.setRequestHeader('Content-Type', 'application/json');
                    isJson = true;
                }
            }
            var restype = responseType !== 'arraybuffer' ? 'text' : 'arraybuffer';
            http.responseType = restype;
            if (http.dataType) {
                //for Ali
                ;
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
        };
        /**
         * @private
         * 请求进度的侦听处理函数。
         * @param	e 事件对象。
         */
        HttpRequest.prototype._onProgress = function (e) {
            if (e && e.lengthComputable)
                this.emit(airkit.Event.PROGRESS, e.loaded / e.total);
        };
        /**
         * @private
         * 请求中断的侦听处理函数。
         * @param	e 事件对象。
         */
        HttpRequest.prototype._onAbort = function (e) {
            this.error('Request was aborted by user');
        };
        /**
         * @private
         * 请求出错侦的听处理函数。
         * @param	e 事件对象。
         */
        HttpRequest.prototype._onError = function (e) {
            this.error('Request failed Status:' + this._http.status + ' text:' + this._http.statusText);
        };
        /**
         * @private
         * 请求消息返回的侦听处理函数。
         * @param	e 事件对象。
         */
        HttpRequest.prototype._onLoad = function (e) {
            var http = this._http;
            var status = http.status !== undefined ? http.status : 200;
            if (status === 200 || status === 204 || status === 0) {
                this.complete();
            }
            else {
                this.error('[' + http.status + ']' + http.statusText + ':' + http.responseURL);
            }
        };
        /**
         * @private
         * 请求错误的处理函数。
         * @param	message 错误信息。
         */
        HttpRequest.prototype.error = function (message) {
            this.clear();
            console.warn(this.url, message);
            this.emit(airkit.Event.ERROR, message);
        };
        /**
         * @private
         * 请求成功完成的处理函数。
         */
        HttpRequest.prototype.complete = function () {
            this.clear();
            var flag = true;
            try {
                if (this._responseType === 'json') {
                    this._data = JSON.parse(this._http.responseText);
                }
                else if (this._responseType === 'xml') {
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
        };
        /**
         * @private
         * 清除当前请求。
         */
        HttpRequest.prototype.clear = function () {
            _super.prototype.clear.call(this);
            var http = this._http;
            http.onerror = http.onabort = http.onprogress = http.onload = null;
        };
        Object.defineProperty(HttpRequest.prototype, "url", {
            /** 请求的地址。*/
            get: function () {
                return this._url;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "data", {
            /** 返回的数据。*/
            get: function () {
                return this._data;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "http", {
            /**
             * 本对象所封装的原生 XMLHttpRequest 引用。
             */
            get: function () {
                return this._http;
            },
            enumerable: false,
            configurable: true
        });
        /**@private */
        HttpRequest._urlEncode = encodeURI;
        return HttpRequest;
    }(cc.Node));
    airkit.HttpRequest = HttpRequest;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:08
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/plugins/state_machine/State.ts
 */
// import { StateMachine } from "./StateMachine";
// import { Log } from "../../log/Log";

(function (airkit) {
    var eStateEnum;
    (function (eStateEnum) {
        eStateEnum[eStateEnum["NONE"] = 1] = "NONE";
        eStateEnum[eStateEnum["INIT"] = 2] = "INIT";
        eStateEnum[eStateEnum["ENTER"] = 4] = "ENTER";
        eStateEnum[eStateEnum["RUNNING"] = 8] = "RUNNING";
        eStateEnum[eStateEnum["EXIT"] = 16] = "EXIT";
        eStateEnum[eStateEnum["DESTROY"] = 32] = "DESTROY";
    })(eStateEnum = airkit.eStateEnum || (airkit.eStateEnum = {}));
    var State = /** @class */ (function () {
        function State(entity) {
            this._owner = null;
            //实体控制器引用
            this._entity = null;
            this._state = 0;
            this._status = eStateEnum.NONE;
            //帧数统计,每帧update的时候+1,每次enter和exit的时候清零,用于处理一些定时事件,比较通用
            //所以抽离到基础属性里面了，有需要的需要自己在状态里面进行加减重置等操作，基类只提供属性字段
            this._times = 0;
            this._tick = 0; //用于计数
            this._entity = entity;
        }
        // 设置运行状态，对外开放的接口
        State.prototype.setStatus = function (v) {
            this._status = this._status | v;
        };
        // 重置运行状态
        // 支持重置多个状态位
        State.prototype.resetStatus = function (v) {
            this._status = this._status & (this._status ^ v);
        };
        /**
         * hasStatus
         * @param Status
         * @returns boolean
         * 是否存在运行状态,支持多个状态查询
         */
        State.prototype.hasStatus = function (v) {
            return (this._status & v) > 0;
        };
        Object.defineProperty(State.prototype, "owner", {
            set: function (v) {
                this._owner = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "entity", {
            set: function (v) {
                this._entity = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "state", {
            set: function (v) {
                this._state = v;
            },
            enumerable: false,
            configurable: true
        });
        State.prototype.enter = function () {
            airkit.Log.info('you must overwrite the func state.enter !');
        };
        State.prototype.update = function (dt) {
            airkit.Log.info('you must overwrite the func state.update !');
        };
        State.prototype.exit = function () {
            airkit.Log.info('you must overwrite the func state.exit !');
        };
        State.prototype.destroy = function () {
            this._owner = null;
            this._entity = null;
            this._state = 0;
        };
        return State;
    }());
    airkit.State = State;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:11
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/plugins/state_machine/StateMachine.ts
 */
// import { State } from "./State";

(function (airkit) {
    var StateMachine = /** @class */ (function () {
        function StateMachine() {
            this._currentState = null;
            this._previousState = null;
            this._gState = null;
            this._states = new airkit.NDictionary();
            this._stateQueue = new airkit.Queue();
            this.changedSignal = new airkit.Signal();
            this.enterSignal = new airkit.Signal();
            this.exitSignal = new airkit.Signal();
        }
        /**
         * 注册状态
         * @param type
         * @param state
         */
        StateMachine.prototype.registerState = function (type, state) {
            state.state = type;
            this._states.add(type, state);
            state.setStatus(airkit.eStateEnum.INIT);
        };
        /**
         * 移除状态
         * @param type
         */
        StateMachine.prototype.unregisterState = function (type) {
            this._states.remove(type);
        };
        StateMachine.prototype.update = function (dt) {
            if (this._gState && this._gState.hasStatus(airkit.eStateEnum.RUNNING) && !this._gState.hasStatus(airkit.eStateEnum.EXIT)) {
                this._gState.update(dt);
            }
            if (this._currentState && this._currentState.hasStatus(airkit.eStateEnum.RUNNING) && !this._currentState.hasStatus(airkit.eStateEnum.EXIT)) {
                this._currentState.update(dt);
            }
        };
        /**
         * 切换状态,如果有上一个状态，先退出上一个状态，再切换到该状态
         * @param type
         */
        StateMachine.prototype.changeState = function (type) {
            if (!this._states.has(type)) {
                return false;
            }
            this._stateQueue.clear();
            this._stateQueue.enqueue(type);
            return this.doNextState();
        };
        StateMachine.prototype.doNextState = function () {
            if (this._stateQueue.length <= 0) {
                return false;
            }
            var type = this._stateQueue.dequeue();
            if (!this._states.has(type)) {
                return false;
            }
            this._previousState = this._currentState;
            this._currentState = this._states.getValue(type);
            this._stateExit(this._previousState);
            this.changedSignal.dispatch([this._previousState.state, this._currentState.state]);
            this._stateEnter(this._currentState);
            return true;
        };
        StateMachine.prototype._stateExit = function (state) {
            state.setStatus(airkit.eStateEnum.EXIT);
            state.exit();
            this.exitSignal.dispatch(state.state);
        };
        StateMachine.prototype._stateEnter = function (state) {
            state.resetStatus(airkit.eStateEnum.ENTER | airkit.eStateEnum.RUNNING | airkit.eStateEnum.EXIT);
            state.owner = this;
            state.setStatus(airkit.eStateEnum.ENTER);
            state.enter();
            state.setStatus(airkit.eStateEnum.RUNNING);
            this.enterSignal.dispatch(state.state);
        };
        /**
         * 设置下一个状态，如果队列有，追加到最后，如果当前没有运行的状态，直接运行
         * @param type
         * @returns
         */
        StateMachine.prototype.setNextState = function (type) {
            if (!this._states.has(type)) {
                return false;
            }
            this._stateQueue.enqueue(type);
            if (!this._currentState) {
                return this.doNextState();
            }
            else {
                if (this._currentState.hasStatus(airkit.eStateEnum.EXIT)) {
                    return this.doNextState();
                }
            }
            return true;
        };
        StateMachine.prototype.setGlobalState = function (type) {
            if (!this._states.has(type)) {
                return false;
            }
            if (this._gState) {
                this._stateExit(this._gState);
                this._gState = null;
            }
            this._gState = this._states.getValue(type);
            this._stateEnter(this._gState);
        };
        StateMachine.prototype.clearAllState = function () {
            if (this._gState) {
                this._stateExit(this._gState);
                this._gState = null;
            }
            if (this._currentState) {
                this._stateExit(this._currentState);
                this._currentState = null;
            }
            this._previousState = null;
            this._states.foreach(function (k, v) {
                v.setStatus(airkit.eStateEnum.DESTROY);
                v.destroy();
                return true;
            });
            this._states.clear();
            this._stateQueue.clear();
            this.changedSignal.offAll();
            this.enterSignal.offAll();
            this.exitSignal.offAll();
        };
        Object.defineProperty(StateMachine.prototype, "currentState", {
            get: function () {
                return this._currentState;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(StateMachine.prototype, "previousState", {
            get: function () {
                return this._previousState;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(StateMachine.prototype, "globalState", {
            get: function () {
                return this._gState;
            },
            enumerable: false,
            configurable: true
        });
        StateMachine.prototype.destory = function () {
            this.clearAllState();
            this.changedSignal.destory();
            this.enterSignal.destory();
            this.exitSignal.destory();
            this.changedSignal = null;
            this.enterSignal = null;
            this.exitSignal = null;
        };
        return StateMachine;
    }());
    airkit.StateMachine = StateMachine;
})(airkit || (airkit = {}));

(function (airkit) {
    var SocketStatus = /** @class */ (function () {
        function SocketStatus() {
        }
        SocketStatus.SOCKET_CONNECT = '1';
        SocketStatus.SOCKET_RECONNECT = '2';
        SocketStatus.SOCKET_START_RECONNECT = '3';
        SocketStatus.SOCKET_CLOSE = '4';
        SocketStatus.SOCKET_NOCONNECT = '5';
        SocketStatus.SOCKET_DATA = '6';
        return SocketStatus;
    }());
    airkit.SocketStatus = SocketStatus;
    var eSocketMsgType;
    (function (eSocketMsgType) {
        // MTRequest request =1
        eSocketMsgType[eSocketMsgType["MTRequest"] = 1] = "MTRequest";
        // MTResponse response = 2
        eSocketMsgType[eSocketMsgType["MTResponse"] = 2] = "MTResponse";
        // MTNotify notify = 3
        eSocketMsgType[eSocketMsgType["MTNotify"] = 3] = "MTNotify";
        // MTBroadcast broadcast = 4
        eSocketMsgType[eSocketMsgType["MTBroadcast"] = 4] = "MTBroadcast";
    })(eSocketMsgType = airkit.eSocketMsgType || (airkit.eSocketMsgType = {}));
    var WebSocketEx = /** @class */ (function (_super) {
        __extends(WebSocketEx, _super);
        function WebSocketEx() {
            var _this = _super.call(this) || this;
            _this.mSocket = null;
            _this._needReconnect = false;
            _this._maxReconnectCount = 10;
            _this._reconnectCount = 0;
            _this._requestTimeout = 10 * 1000; //10s
            return _this;
        }
        /**
         *
         * @param address ws://host:port?token=aaaa
         * @param msgCls
         * @param endian
         * @returns
         */
        WebSocketEx.prototype.initServer = function (address, msgCls, endian) {
            if (endian === void 0) { endian = airkit.Byte.BIG_ENDIAN; }
            //ws://192.168.0.127:8080
            this._remoteAddress = address;
            this.mEndian = endian;
            this._handers = new airkit.NDictionary();
            this._msgCls = msgCls;
            return this.connect();
        };
        WebSocketEx.prototype.connect = function () {
            this.mSocket = new WebSocket(this._remoteAddress);
            this.mSocket.binaryType = 'arraybuffer';
            // this.mSocket.binaryType = this.mEndian;
            this.addEvents();
            return this.wait();
        };
        WebSocketEx.prototype.wait = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var cbConnect = function () {
                    _this.off(SocketStatus.SOCKET_RECONNECT, cbReconnect, _this);
                    resolve(true);
                };
                var cbReconnect = function () {
                    _this.off(SocketStatus.SOCKET_CONNECT, cbConnect, _this);
                    reject(false);
                };
                _this.once(SocketStatus.SOCKET_RECONNECT, cbReconnect, _this);
                _this.once(SocketStatus.SOCKET_CONNECT, cbConnect, _this);
            });
        };
        WebSocketEx.prototype.addEvents = function () {
            this.mSocket.onopen = this.onSocketOpen.bind(this);
            this.mSocket.onclose = this.onSocketClose.bind(this);
            this.mSocket.onerror = this.onSocketError.bind(this);
            this.mSocket.onmessage = this.onReceiveMessage.bind(this);
        };
        WebSocketEx.prototype.removeEvents = function () { };
        WebSocketEx.prototype.onSocketOpen = function (event) {
            if (event === void 0) { event = null; }
            this._reconnectCount = 0;
            this._isConnected = true;
            if (this._connectFlag && this._needReconnect) {
                this.emit(SocketStatus.SOCKET_RECONNECT, this._reconnectCount);
            }
            else {
                this.emit(SocketStatus.SOCKET_CONNECT);
            }
            this._connectFlag = true;
        };
        WebSocketEx.prototype.onSocketClose = function (e) {
            if (e === void 0) { e = null; }
            this._isConnected = false;
            if (this._needReconnect) {
                this.emit(SocketStatus.SOCKET_START_RECONNECT);
                this.reconnect();
            }
            else {
                this.emit(SocketStatus.SOCKET_CLOSE);
            }
        };
        WebSocketEx.prototype.onSocketError = function (e) {
            if (e === void 0) { e = null; }
            if (this._needReconnect) {
                this.reconnect();
            }
            else {
                this.emit(SocketStatus.SOCKET_NOCONNECT);
            }
            this._isConnected = false;
        };
        WebSocketEx.prototype.reconnect = function () {
            this.closeCurrentSocket();
            this._reconnectCount++;
            if (this._reconnectCount < this._maxReconnectCount) {
                this.connect();
            }
            else {
                this._reconnectCount = 0;
            }
        };
        WebSocketEx.prototype.onReceiveMessage = function (msg) {
            if (msg === void 0) { msg = null; }
            if (!msg || !msg.data)
                return;
            var obj = new this._msgCls();
            if (!obj) {
                return;
            }
            var message = obj.unpack(msg.data, this.mEndian);
            if (message == null) {
                airkit.Log.error('decode msg faild %s', msg.data);
                return;
            }
            var hander = this._handers.getValue(obj.getID());
            if (hander) {
                hander(obj);
            }
            else {
                this.emit(SocketStatus.SOCKET_DATA, obj);
            }
        };
        WebSocketEx.prototype.request = function (req) {
            var that = this;
            return new Promise(function (resolve, reject) {
                var msg = new that._msgCls();
                var buf = msg.pack(req, that.mEndian);
                var handerID = msg.getID();
                if (buf) {
                    var id_1 = airkit.TimerManager.Instance.addOnce(that._requestTimeout, null, function () {
                        that._handers.remove(handerID);
                        reject('timeout');
                    });
                    that._handers.add(handerID, function (resp) {
                        airkit.TimerManager.Instance.removeTimer(id_1);
                        resolve(resp);
                    });
                    //  Log.info("start request ws %s", buf);
                    that.mSocket.send(buf);
                }
            }).catch(function (e) {
                return e;
            });
        };
        WebSocketEx.prototype.close = function () {
            this._connectFlag = false;
            this._handers.clear();
            this.closeCurrentSocket();
        };
        WebSocketEx.prototype.closeCurrentSocket = function () {
            this.removeEvents();
            this.mSocket.close();
            this.mSocket = null;
            this._isConnected = false;
        };
        WebSocketEx.prototype.isConnected = function () {
            return this._isConnected;
        };
        return WebSocketEx;
    }(cc.Node));
    airkit.WebSocketEx = WebSocketEx;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:24
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/serialize/LocalDB.ts
 */
/**
 * 本地数据
 * @author ankye
 * @time 2018-7-15
 */

(function (airkit) {
    var LocalDB = /** @class */ (function () {
        function LocalDB() {
        }
        /**
         * 设置全局id，用于区分同一个设备的不同玩家
         * @param	key	唯一键，可以使用玩家id
         */
        LocalDB.setGlobalKey = function (key) {
            this._globalKey = key;
        };
        LocalDB.has = function (key) {
            return cc.sys.localStorage.getItem(this.getFullKey(key)) != null;
        };
        LocalDB.getInt = function (key) {
            return parseInt(cc.sys.localStorage.getItem(this.getFullKey(key)));
        };
        LocalDB.setInt = function (key, value) {
            cc.sys.localStorage.setItem(this.getFullKey(key), value.toString());
        };
        LocalDB.getFloat = function (key) {
            return parseInt(cc.sys.localStorage.getItem(this.getFullKey(key)));
        };
        LocalDB.setFloat = function (key, value) {
            cc.sys.localStorage.setItem(this.getFullKey(key), value.toString());
        };
        LocalDB.getString = function (key) {
            return cc.sys.localStorage.getItem(this.getFullKey(key));
        };
        LocalDB.setString = function (key, value) {
            cc.sys.localStorage.setItem(this.getFullKey(key), value);
        };
        LocalDB.remove = function (key) {
            cc.sys.localStorage.removeItem(this.getFullKey(key));
        };
        LocalDB.clear = function () {
            cc.sys.localStorage.clear();
        };
        LocalDB.getFullKey = function (key) {
            return this._globalKey + '_' + key;
        };
        LocalDB._globalKey = '';
        return LocalDB;
    }());
    airkit.LocalDB = LocalDB;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:28
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/timer/IntervalTimer.ts
 */
/**
 * 定时执行
 * @author ankye
 * @time 2018-7-11
 */

(function (airkit) {
    var IntervalTimer = /** @class */ (function () {
        function IntervalTimer() {
            this._nowTime = 0;
        }
        /**
         * 初始化定时器
         * @param	interval	触发间隔
         * @param	firstFrame	是否第一帧开始执行
         */
        IntervalTimer.prototype.init = function (interval, firstFrame) {
            this._intervalTime = interval;
            if (firstFrame)
                this._nowTime = this._intervalTime;
        };
        IntervalTimer.prototype.reset = function () {
            this._nowTime = 0;
        };
        IntervalTimer.prototype.update = function (elapseTime) {
            this._nowTime += elapseTime;
            if (this._nowTime >= this._intervalTime) {
                this._nowTime -= this._intervalTime;
                return true;
            }
            return false;
        };
        return IntervalTimer;
    }());
    airkit.IntervalTimer = IntervalTimer;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:32
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/timer/Timer.ts
 */
/**
 * 时间
 * @author ankye
 * @time 2018-7-3
 */

(function (airkit) {
    var Timer = /** @class */ (function () {
        function Timer() {
        }
        Object.defineProperty(Timer, "deltaTimeMS", {
            //两帧之间的时间间隔,单位毫秒
            get: function () {
                return cc.director.getDeltaTime() * 1000;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Timer, "frameCount", {
            /**游戏启动后，经过的帧数*/
            get: function () {
                return cc.director.getTotalFrames();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Timer, "timeScale", {
            get: function () {
                return cc.director.getScheduler().getTimeScale();
            },
            set: function (scale) {
                cc.director.getScheduler().setTimeScale(scale);
            },
            enumerable: false,
            configurable: true
        });
        return Timer;
    }());
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
    var TimerManager = /** @class */ (function (_super) {
        __extends(TimerManager, _super);
        function TimerManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._idCounter = 0;
            _this._removalPending = [];
            _this._timers = [];
            return _this;
        }
        Object.defineProperty(TimerManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new TimerManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        TimerManager.prototype.setup = function () {
            this._idCounter = 0;
        };
        TimerManager.prototype.destroy = function () {
            airkit.ArrayUtils.clear(this._removalPending);
            airkit.ArrayUtils.clear(this._timers);
            return true;
        };
        TimerManager.prototype.update = function (dt) {
            this.remove();
            for (var i = 0; i < this._timers.length; i++) {
                this._timers[i].update(dt);
                if (this._timers[i].isActive == false) {
                    TimerManager.Instance.removeTimer(this._timers[i].id);
                }
            }
        };
        /**
         * 定时重复执行
         * @param	rate	间隔时间(单位毫秒)。
         * @param	ticks	执行次数,-1=forever
         * @param	caller	执行域(this)。
         * @param	method	定时器回调函数：注意，返回函数第一个参数为定时器id，后面参数依次时传入的参数。例OnTime(timer_id:number, args1:any, args2:any,...):void
         * @param	args	回调参数。
         */
        TimerManager.prototype.addLoop = function (rate, ticks, caller, method, args) {
            if (args === void 0) { args = null; }
            if (ticks <= 0)
                ticks = 0;
            var timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            // if (args != null) ArrayUtils.insert(args, this._idCounter, 0);
            var handler = airkit.Handler.create(caller, method, args, false);
            var forever = ticks == -1;
            timer.set(this._idCounter, rate, ticks, handler, forever);
            this._timers.push(timer);
            return timer.id;
        };
        /**
         * 单次执行
         * 间隔时间(单位毫秒)。
         */
        TimerManager.prototype.addOnce = function (rate, caller, method, args) {
            if (args === void 0) { args = null; }
            var timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            // if (args != null) ArrayUtils.insert(args, this._idCounter, 0);
            var handler = airkit.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, 1, handler, false);
            this._timers.push(timer);
            return timer.id;
        };
        /**
         * 移除定时器
         * @param	timerId	定时器id
         */
        TimerManager.prototype.removeTimer = function (timerId) {
            this._removalPending.push(timerId);
        };
        /**
         * 移除过期定时器
         */
        TimerManager.prototype.remove = function () {
            var t;
            if (this._removalPending.length > 0) {
                for (var _i = 0, _a = this._removalPending; _i < _a.length; _i++) {
                    var id = _a[_i];
                    for (var i = 0; i < this._timers.length; i++) {
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
        };
        TimerManager.TIMER_OBJECT = 'timerObject';
        TimerManager.instance = null;
        return TimerManager;
    }(airkit.Singleton));
    airkit.TimerManager = TimerManager;
    var TimerObject = /** @class */ (function () {
        function TimerObject() {
            this.mTime = new airkit.IntervalTimer();
        }
        TimerObject.prototype.init = function () { };
        TimerObject.prototype.clear = function () {
            if (this.handle != null) {
                this.handle.recover();
                this.handle = null;
            }
        };
        TimerObject.prototype.set = function (id, rate, ticks, handle, forever) {
            this.id = id;
            this.mRate = rate < 0 ? 0 : rate;
            this.mTicks = ticks < 0 ? 0 : ticks;
            this.handle = handle;
            this.mTicksElapsed = 0;
            this.isActive = true;
            this.mTime.init(this.mRate, false);
            this.forever = forever;
        };
        TimerObject.prototype.update = function (dt) {
            if (this.isActive && this.mTime.update(dt)) {
                if (this.handle != null)
                    this.handle.run();
                if (!this.forever) {
                    this.mTicksElapsed++;
                    if (this.mTicks > 0 && this.mTicks == this.mTicksElapsed) {
                        this.isActive = false;
                    }
                }
            }
        };
        TimerObject.objectKey = 'TimerObject';
        return TimerObject;
    }());
    airkit.TimerObject = TimerObject;
})(airkit || (airkit = {}));
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
    var BaseView = /** @class */ (function (_super) {
        __extends(BaseView, _super);
        function BaseView() {
            var _this = _super.call(this) || this;
            _this._isOpen = false;
            _this._UIID = null;
            _this.objectData = null;
            _this._destory = false;
            _this._viewID = genViewIDSeq();
            return _this;
        }
        Object.defineProperty(BaseView.prototype, "UIID", {
            get: function () {
                return this._UIID;
            },
            /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
            set: function (id) {
                this._UIID = id;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseView.prototype, "viewID", {
            get: function () {
                return this._viewID;
            },
            set: function (v) {
                this._viewID = v;
            },
            enumerable: false,
            configurable: true
        });
        BaseView.prototype.debug = function () {
            var bgColor = '#4aa7a688';
            // this.graphics.clear()
            // this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        };
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        BaseView.prototype.setup = function (args) {
            this._isOpen = true;
            this.onLangChange();
            this.onCreate(args);
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_OPEN, this._UIID);
            airkit.EventCenter.on(airkit.EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
        };
        /**关闭*/
        BaseView.prototype.dispose = function () {
            if (this._destory)
                return;
            this._destory = true;
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            if (this._UIID)
                airkit.EventCenter.dispatchEvent(airkit.EventID.UI_CLOSE, this._UIID, this._viewID);
            airkit.EventCenter.off(airkit.EventID.UI_LANG, this, this.onLangChange);
            if (this.numChildren > 0) {
                this.removeChildren(0, this.numChildren, true);
            }
            _super.prototype.dispose.call(this);
        };
        BaseView.prototype.isDestory = function () {
            return this._destory;
        };
        /**是否可见*/
        BaseView.prototype.setVisible = function (bVisible) {
            var old = this.visible;
            this.visible = bVisible;
        };
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        BaseView.prototype.onCreate = function (args) { };
        /**销毁*/
        BaseView.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        /**每帧循环：如果覆盖，必须调用super.update()*/
        BaseView.prototype.update = function (dt) {
            return true;
        };
        /**资源加载结束*/
        BaseView.prototype.onEnable = function () {
            _super.prototype.onEnable.call(this);
        };
        //资源卸载前
        BaseView.prototype.onDisable = function () {
            _super.prototype.onDisable.call(this);
        };
        /**多语言初始化，或语音设定改变时触发*/
        BaseView.prototype.onLangChange = function () { };
        //framework需要提前加载的资源
        BaseView.res = function () {
            return null;
        };
        BaseView.unres = function () {
            var arr = this.res();
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    airkit.ResourceManager.Instance.clearRes(arr[i].url, arr[i].refCount);
                }
            }
        };
        BaseView.loaderTips = function () {
            return '资源加载中';
        };
        //显示加载界面 默认不显示
        BaseView.loaderType = function () {
            return airkit.eLoaderType.NONE;
        };
        //信号事件注册，适合单体物件事件传递
        // return [
        //     [me.updateSignal, this, this.refreshUser],
        // ]
        //   public refreshUser(val: any, result: [model.eUserAttr, number]): void
        BaseView.prototype.signalMap = function () {
            return null;
        };
        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        BaseView.prototype.eventMap = function () {
            return null;
        };
        /**自定义事件注册，用于EventCenter派发的事件*/
        BaseView.prototype.registerEvent = function () { };
        BaseView.prototype.unRegisterEvent = function () { };
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        BaseView.prototype.staticCacheUI = function () {
            return null;
        };
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        BaseView.loadResource = function (onAssetLoaded) {
            var tips = this.loaderTips();
            var loaderType = this.loaderType();
            airkit.ResourceManager.Instance.loadArrayRes(this.res(), loaderType, tips, 1, true)
                .then(function (v) {
                onAssetLoaded(true);
            })
                .catch(function (e) {
                airkit.Log.error(e);
                onAssetLoaded(false);
            });
        };
        BaseView.prototype.registerSignalEvent = function () {
            var event_list = this.signalMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_3 = event_list; _i < event_list_3.length; _i++) {
                var item = event_list_3[_i];
                var signal = item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        };
        BaseView.prototype.unregisterSignalEvent = function () {
            var event_list = this.signalMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_4 = event_list; _i < event_list_4.length; _i++) {
                var item = event_list_4[_i];
                var signal = item[0];
                signal.off(item[1], item[2]);
            }
        };
        /**注册界面事件*/
        BaseView.prototype.registeGUIEvent = function () {
            var event_list = this.eventMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_5 = event_list; _i < event_list_5.length; _i++) {
                var item = event_list_5[_i];
                var gui_control = item[0];
                gui_control.on(item[1], item[2], this);
            }
        };
        BaseView.prototype.unregisteGUIEvent = function () {
            var event_list = this.eventMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_6 = event_list; _i < event_list_6.length; _i++) {
                var item = event_list_6[_i];
                var gui_control = item[0];
                gui_control.off(item[1], item[2], this);
            }
        };
        return BaseView;
    }(fgui.GComponent));
    airkit.BaseView = BaseView;
})(airkit || (airkit = {}));
/// <reference path="./BaseView.ts" />

(function (airkit) {
    var Dialog = /** @class */ (function (_super) {
        __extends(Dialog, _super);
        function Dialog() {
            var _this = _super.call(this) || this;
            _this._isOpen = false;
            _this._UIID = null;
            _this.objectData = null;
            _this._destory = false;
            _this._viewID = airkit.genViewIDSeq();
            _this._resultData = { result: airkit.eDlgResult.NO, data: null };
            return _this;
        }
        Dialog.prototype.wait = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.on(fgui.Event.UNDISPLAY, function () {
                    resolve({ result: _this._resultData.result, data: _this._resultData.data });
                }, _this);
            });
        };
        Dialog.prototype.setupClickBg = function () {
            var bg = new fgui.GGraph();
            bg.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            bg.onClick(this.close, this);
            bg.drawRect(0, cc.Color.TRANSPARENT, new cc.Color(0x0, 0x0, 0x0, 0));
            bg.addRelation(this, fgui.RelationType.Size);
            this.addChildAt(bg, 0);
            bg.center();
            this._clickMask = bg;
        };
        Object.defineProperty(Dialog.prototype, "UIID", {
            get: function () {
                return this._UIID;
            },
            /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
            set: function (id) {
                this._UIID = id;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "viewID", {
            get: function () {
                return this._viewID;
            },
            set: function (v) {
                this._viewID = v;
            },
            enumerable: false,
            configurable: true
        });
        Dialog.prototype.createDlgView = function () {
            return null;
        };
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        Dialog.prototype.setup = function (args) {
            this._isOpen = true;
            this.onLangChange();
            this.onCreate(args);
            this.contentPane = this.createDlgView();
            airkit.EventCenter.dispatchEvent(airkit.EventID.UI_OPEN, this._UIID);
            airkit.EventCenter.on(airkit.EventID.UI_LANG, this, this.onLangChange);
            this.registerEvent();
            this.registeGUIEvent();
            this.registerSignalEvent();
        };
        Dialog.prototype.onShown = function () { };
        Dialog.prototype.onHide = function () {
            this.onClose();
        };
        Dialog.prototype.close = function (data) {
            if (data === void 0) { data = { result: airkit.eDlgResult.NO, data: null }; }
            this._resultData = data;
            this.doHideAnimation();
        };
        Dialog.prototype.doShowAnimation = function () {
            this.onShown();
        };
        Dialog.prototype.doHideAnimation = function () {
            _super.prototype.doHideAnimation.call(this);
        };
        /**关闭*/
        Dialog.prototype.dispose = function () {
            if (this._destory)
                return;
            this._destory = true;
            this.unRegisterEvent();
            this.unregisteGUIEvent();
            this.unregisterSignalEvent();
            this._isOpen = false;
            this.objectData = null;
            if (this._clickMask) {
                this._clickMask.offClick(this.close, this);
                this._clickMask.removeFromParent();
                this._clickMask = null;
            }
            if (this._UIID)
                airkit.EventCenter.dispatchEvent(airkit.EventID.UI_CLOSE, this._UIID, this._viewID);
            airkit.EventCenter.off(airkit.EventID.UI_LANG, this, this.onLangChange);
            _super.prototype.dispose.call(this);
            console.log('dialog dispose');
        };
        Dialog.prototype.isDestory = function () {
            return this._destory;
        };
        Dialog.prototype.modalShowAnimation = function (dt, alpha) {
            if (dt === void 0) { dt = 0.3; }
            if (alpha === void 0) { alpha = 1.0; }
            var layer = fgui.GRoot.inst.modalLayer;
            layer.alpha = 0;
            airkit.TweenUtils.get(layer).to({ alpha: alpha }, dt, fgui.EaseType.SineIn);
        };
        Dialog.prototype.modalHideAnimation = function (dt, alpha) {
            if (dt === void 0) { dt = 0.3; }
            if (alpha === void 0) { alpha = 0.0; }
            var layer = fgui.GRoot.inst.modalLayer;
            airkit.TweenUtils.get(layer).to({ alpha: alpha }, dt, fgui.EaseType.SineOut);
        };
        /**是否可见*/
        Dialog.prototype.setVisible = function (bVisible) {
            var old = this.visible;
            this.visible = bVisible;
        };
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        Dialog.prototype.onCreate = function (args) { };
        /**销毁*/
        Dialog.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        /**每帧循环：如果覆盖，必须调用super.update()*/
        Dialog.prototype.update = function (dt) {
            return true;
        };
        /**资源加载结束*/
        Dialog.prototype.onEnable = function () {
            _super.prototype.onEnable.call(this);
        };
        //资源卸载前
        Dialog.prototype.onDisable = function () {
            _super.prototype.onDisable.call(this);
        };
        /**多语言初始化，或语音设定改变时触发*/
        Dialog.prototype.onLangChange = function () { };
        //framework需要提前加载的资源
        Dialog.res = function () {
            return null;
        };
        Dialog.unres = function () {
            var arr = this.res();
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    airkit.ResourceManager.Instance.clearRes(arr[i].url, arr[i].refCount);
                }
            }
        };
        Dialog.loaderTips = function () {
            return '资源加载中';
        };
        //显示加载界面 默认不显示
        Dialog.loaderType = function () {
            return airkit.eLoaderType.NONE;
        };
        //信号事件注册，适合单体物件事件传递
        // return [
        //     [me.updateSignal, this, this.refreshUser],
        // ]
        //   public refreshUser(val: any, result: [model.eUserAttr, number]): void
        Dialog.prototype.signalMap = function () {
            return null;
        };
        /**
     * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
     * 例：
            return [
                [this._loginBtn, Laya.Event.CLICK, this.onPressLogin],
            ]
     */
        Dialog.prototype.eventMap = function () {
            return null;
        };
        /**自定义事件注册，用于EventCenter派发的事件*/
        Dialog.prototype.registerEvent = function () { };
        Dialog.prototype.unRegisterEvent = function () { };
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        Dialog.prototype.staticCacheUI = function () {
            return null;
        };
        Dialog.prototype.resize = function () {
            this.center();
            if (this._clickMask) {
                this._clickMask.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
                this._clickMask.center();
            }
        };
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源,手动创建的view需要手动调用*/
        Dialog.loadResource = function (onAssetLoaded) {
            var tips = this.loaderTips();
            var loaderType = this.loaderType();
            airkit.ResourceManager.Instance.loadArrayRes(this.res(), loaderType, tips, 1, true)
                .then(function (v) {
                onAssetLoaded(true);
            })
                .catch(function (e) {
                airkit.Log.error(e);
                onAssetLoaded(false);
            });
        };
        Dialog.prototype.registerSignalEvent = function () {
            var event_list = this.signalMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_7 = event_list; _i < event_list_7.length; _i++) {
                var item = event_list_7[_i];
                var signal = item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        };
        Dialog.prototype.unregisterSignalEvent = function () {
            var event_list = this.signalMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_8 = event_list; _i < event_list_8.length; _i++) {
                var item = event_list_8[_i];
                var signal = item[0];
                signal.off(item[1], item[2]);
            }
        };
        /**注册界面事件*/
        Dialog.prototype.registeGUIEvent = function () {
            var event_list = this.eventMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_9 = event_list; _i < event_list_9.length; _i++) {
                var item = event_list_9[_i];
                var gui_control = item[0];
                gui_control.on(item[1], item[2], this);
            }
        };
        Dialog.prototype.unregisteGUIEvent = function () {
            var event_list = this.eventMap();
            if (!event_list)
                return;
            for (var _i = 0, event_list_10 = event_list; _i < event_list_10.length; _i++) {
                var item = event_list_10[_i];
                var gui_control = item[0];
                gui_control.off(item[1], item[2], this);
            }
        };
        Dialog.buildRes = function (resMap) {
            var res = [];
            for (var k in resMap) {
                res.push({ url: 'ui/' + k, type: airkit.FGUIAsset, refCount: 1, pkg: k });
                for (var k2 in resMap[k]) {
                    res.push({ url: 'ui/' + k2, type: cc.BufferAsset, refCount: resMap[k][k2], pkg: k });
                }
            }
            return res;
        };
        Dialog.prototype.onClose = function () {
            if (this._isOpen === false) {
                airkit.Log.error('连续点击');
                return false; //避免连续点击关闭
            }
            this._isOpen = false;
            airkit.UIManager.Instance.close(this.UIID, this.viewID);
            return true;
        };
        Dialog.prototype.hideImmediately = function () {
            _super.prototype.hideImmediately.call(this);
            fgui.GRoot.inst.modalLayer.alpha = 1.0;
        };
        return Dialog;
    }(fgui.Window));
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
    var Layer = /** @class */ (function (_super) {
        __extends(Layer, _super);
        function Layer() {
            return _super.call(this) || this;
        }
        Layer.prototype.debug = function () {
            var bgColor = '#f4e1e188';
            //	this.graphics.clear()
            //	this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        };
        return Layer;
    }(fgui.GComponent));
    airkit.Layer = Layer;
    /**
     * 场景层级
     * @author ankye
     * @time 2017-7-13
     */
    var LayerManager = /** @class */ (function (_super) {
        __extends(LayerManager, _super);
        function LayerManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(LayerManager, "stage", {
            get: function () {
                return this._root;
            },
            enumerable: false,
            configurable: true
        });
        LayerManager.getLayer = function (t) {
            var layer = null;
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
            if (cc.winSize.width != layer.width || cc.winSize.height != layer.height) {
                layer.width = cc.winSize.width;
                layer.height = cc.winSize.height;
            }
            //layer.debug()
            return layer;
        };
        LayerManager.setup = function (root) {
            this._root = new Layer();
            root.addChild(this._root);
            this._bgLayer = new Layer();
            this._bgLayer.node.name = 'bgLayer';
            this._bgLayer.touchable = true;
            this._root.addChild(this._bgLayer);
            this._bgLayer.sortingOrder = 0;
            this._mainLayer = new Layer();
            this._mainLayer.node.name = 'mainLayer';
            this._mainLayer.touchable = true;
            this._root.addChild(this._mainLayer);
            this._mainLayer.sortingOrder = 1;
            // this._tooltipLayer = new Layer();
            // this._tooltipLayer.node.name = "tooltipLayer";
            // this._tooltipLayer.touchable = false;
            // this._root.addChild(this._tooltipLayer);
            // this._tooltipLayer.sortingOrder = 3;
            this._uiLayer = new Layer();
            this._uiLayer.node.name = 'uiLayer';
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
            this._loadingLayer.node.name = 'loadingLayer';
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
        };
        LayerManager.registerEvent = function () {
            airkit.EventCenter.on(airkit.EventID.RESIZE, this, this.resize);
        };
        LayerManager.unRegisterEvent = function () {
            airkit.EventCenter.off(airkit.EventID.RESIZE, this, this.resize);
        };
        LayerManager.resize = function () {
            airkit.Log.info('LayerManager Receive Resize %s %s', cc.winSize.width, cc.winSize.height);
            var i;
            var l;
            var w = cc.winSize.width;
            var h = cc.winSize.height;
            this._root.setSize(w, h);
            for (i = 0, l = this.layers.length; i < l; i++) {
                this.layers[i].setSize(w, h);
                // this.layers[i].touchable = true
                // this.layers[i].opaque = false
            }
            if (this._bgLayer.numChildren) {
                var bg = this._bgLayer.getChildAt(0);
                var x = (w - LayerManager.BG_WIDTH) >> 1;
                var y = h - LayerManager.BG_HEIGHT;
                bg.setPosition(x, y);
            }
            // let obj = this._uiLayer
            // obj.node.graphics.clear()
            // obj.node.graphics.drawRect(0, 0, obj.width, obj.height, "#33333333")
        };
        LayerManager.destroy = function () {
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
        };
        LayerManager.removeAll = function () {
            airkit.DisplayUtils.removeAllChild(this._bgLayer);
            airkit.DisplayUtils.removeAllChild(this._mainLayer);
            airkit.DisplayUtils.removeAllChild(this._uiLayer);
            // DisplayUtils.removeAllChild(this._popupLayer);
            // DisplayUtils.removeAllChild(this._tooltipLayer);
            // DisplayUtils.removeAllChild(this._systemLayer);
            airkit.DisplayUtils.removeAllChild(this._loadingLayer);
        };
        Object.defineProperty(LayerManager, "root", {
            get: function () {
                return this._root;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "bgLayer", {
            get: function () {
                return this._bgLayer;
            },
            enumerable: false,
            configurable: true
        });
        LayerManager.addBg = function (url) {
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
        };
        Object.defineProperty(LayerManager, "mainLayer", {
            get: function () {
                return this._mainLayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "uiLayer", {
            get: function () {
                return this._uiLayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "loadingLayer", {
            // public static get popupLayer(): fgui.GComponent {
            //     return this._popupLayer;
            // }
            // public static get tooltipLayer(): fgui.GComponent {
            //     return this._tooltipLayer;
            // }
            // public static get systemLayer(): fgui.GComponent {
            //     return this._systemLayer;
            // }
            get: function () {
                return this._loadingLayer;
            },
            enumerable: false,
            configurable: true
        });
        //背景宽高,按中下往上扩展图片
        LayerManager.BG_WIDTH = 750;
        LayerManager.BG_HEIGHT = 1650;
        return LayerManager;
    }(airkit.Singleton));
    airkit.LayerManager = LayerManager;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:52
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/ui/LoaderDialog.ts
 */

(function (airkit) {
    var LoaderDialog = /** @class */ (function (_super) {
        __extends(LoaderDialog, _super);
        function LoaderDialog() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoaderDialog.prototype.setup = function (type) {
            this.modal = true;
            this.sortingOrder = 1000 + this.type;
            _super.prototype.setup.call(this, type);
            this.type = type;
            this.center();
        };
        /**
         * 打开
         */
        LoaderDialog.prototype.onOpen = function (total) { };
        /**
         * 设置提示
         */
        LoaderDialog.prototype.setTips = function (s) { };
        /**
         * 加载进度
         * @param 	cur		当前加载数量
         * @param	total	总共需要加载的数量
         */
        LoaderDialog.prototype.setProgress = function (cur, total) { };
        /**
         * 关闭
         */
        LoaderDialog.prototype.onClose = function () {
            return _super.prototype.onClose.call(this);
        };
        return LoaderDialog;
    }(airkit.Dialog));
    airkit.LoaderDialog = LoaderDialog;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * 加载界面管理器
     * @author ankye
     * @time 2017-7-25
     */
    var LoaderManager = /** @class */ (function (_super) {
        __extends(LoaderManager, _super);
        function LoaderManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 注册加载类，存放场景id和url的对应关系
         * @param view_type
         * @param className
         */
        LoaderManager.register = function (view_type, className, cls) {
            this.loaders.add(view_type, className);
            airkit.ClassUtils.regClass(className, cls);
        };
        Object.defineProperty(LoaderManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new LoaderManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        LoaderManager.prototype.setup = function () {
            this.registerEvent();
            this._dicLoadView = new airkit.NDictionary();
        };
        LoaderManager.prototype.destroy = function () {
            this.unRegisterEvent();
            if (this._dicLoadView) {
                var view_1 = null;
                this._dicLoadView.foreach(function (key, value) {
                    view_1 = value;
                    view_1.close();
                    return true;
                });
                this._dicLoadView.clear();
                this._dicLoadView = null;
            }
            return true;
        };
        LoaderManager.prototype.registerEvent = function () {
            airkit.EventCenter.on(airkit.LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
            airkit.EventCenter.on(airkit.LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
            airkit.EventCenter.on(airkit.LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
        };
        LoaderManager.prototype.unRegisterEvent = function () {
            airkit.EventCenter.off(airkit.LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
            airkit.EventCenter.off(airkit.LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
            airkit.EventCenter.off(airkit.LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
        };
        /**加载进度事件*/
        LoaderManager.prototype.onLoadViewEvt = function (args) {
            var type = args.type;
            var viewType = args.get(0);
            switch (type) {
                case airkit.LoaderEventID.LOADVIEW_OPEN:
                    {
                        airkit.Log.debug('显示加载界面');
                        var total = args.get(1);
                        var tips = args.get(2);
                        this.show(viewType, total, tips);
                    }
                    break;
                case airkit.LoaderEventID.LOADVIEW_PROGRESS:
                    {
                        //Log.debug("加载界面进度")
                        var cur = args.get(1);
                        var total = args.get(2);
                        this.setProgress(viewType, cur, total);
                    }
                    break;
                case airkit.LoaderEventID.LOADVIEW_COMPLATE:
                    {
                        airkit.Log.debug('加载界面关闭');
                        this.close(viewType);
                    }
                    break;
            }
        };
        LoaderManager.prototype.show = function (type, total, tips) {
            var _this = this;
            if (total === void 0) { total = 1; }
            if (type == null || type == airkit.eLoaderType.NONE)
                return;
            var view = this._dicLoadView.getValue(type);
            if (!view) {
                var className_1 = LoaderManager.loaders.getValue(type);
                //切换
                if (className_1.length > 0) {
                    var clas = airkit.ClassUtils.getClass(className_1);
                    var res = clas.res();
                    if (res == null || (Array.isArray(res) && res.length == 0)) {
                        view = airkit.ClassUtils.getInstance(className_1);
                        view.setup(type);
                        this._dicLoadView.add(type, view);
                        this.updateView(view, total, tips);
                    }
                    else {
                        clas.loadResource(function (v) {
                            if (v) {
                                view = airkit.ClassUtils.getInstance(className_1);
                                view.setup(type);
                                _this._dicLoadView.add(type, view);
                                _this.updateView(view, total, tips);
                            }
                            else {
                                airkit.Log.error('创建加载类失败 %s', className_1);
                            }
                        });
                    }
                }
                else {
                    airkit.Log.error('Must set loadingview first type= %s', type);
                }
            }
            else {
                this.updateView(view, total, tips);
            }
        };
        LoaderManager.prototype.updateView = function (view, total, tips) {
            view.sortingOrder = 9999;
            view.show();
            view.onOpen(total);
            view.setTips(tips);
            view.setVisible(true);
        };
        LoaderManager.prototype.setProgress = function (type, cur, total) {
            var view = this._dicLoadView.getValue(type);
            if (!view) {
                return;
            }
            view.setProgress(cur, total);
        };
        LoaderManager.prototype.close = function (type) {
            var view = this._dicLoadView.getValue(type);
            if (!view) {
                return;
            }
            view.close();
            this._dicLoadView.remove(type);
            view = null;
            // TweenUtils.get(view).to({ alpha: 0 }, 500, Laya.Ease.bounceIn, LayaHandler.create(null, v => {
            // 	view.setVisible(false)
            // }))
        };
        LoaderManager.loaders = new airkit.NDictionary();
        LoaderManager.instance = null;
        return LoaderManager;
    }(airkit.Singleton));
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
    var FGUIAsset = /** @class */ (function (_super) {
        __extends(FGUIAsset, _super);
        function FGUIAsset() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FGUIAsset;
    }(cc.BufferAsset));
    airkit.FGUIAsset = FGUIAsset;
    var ResourceManager = /** @class */ (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._dicResInfo = null; //加载过的信息，方便资源释放
            return _this;
        }
        Object.defineProperty(ResourceManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new ResourceManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        ResourceManager.prototype.setup = function () {
            this._dicResInfo = new airkit.SDictionary();
            this._minLoaderTime = 400;
        };
        ResourceManager.memory = function () {
            var cache = cc.loader._cache;
            var totalMemory = 0;
            var size = 0;
            cc.assetManager.assets.forEach(function (asset, key) {
                if (asset instanceof cc.Texture2D) {
                    if (asset.width && asset.height && asset['_format']) {
                        size = (asset.width * asset.height * (asset['_native'] === '.jpg' ? 3 : 4)) / (1024.0 * 1024.0);
                        airkit.Log.info('Texture[%s] %s 资源占用内存%sMB', asset.name, asset.nativeUrl, size.toFixed(3));
                        totalMemory += size;
                    }
                }
                else if (asset instanceof cc.SpriteFrame) {
                    if (asset['_originalSize'] && asset['_texture']) {
                        size = (asset['_originalSize'].width * asset['_originalSize'].height * asset['_texture']._format) / 4 / (1024.0 * 1024.0);
                        totalMemory += size;
                        airkit.Log.info('SpriteFrame[%s] %s 资源占用内存%sMB', asset.name, asset.nativeUrl, size.toFixed(3));
                    }
                }
            });
            // for (let key in cache) {
            //     let asset = cc.loader['_cache'][key]
            //     if (asset instanceof cc.Texture2D) {
            //         if (asset.width && asset.height && asset['_format']) {
            //             size = (asset.width * asset.height * (asset['_native'] === '.jpg' ? 3 : 4)) / (1024.0 * 1024.0)
            //             Log.info('Texture %s 资源占用内存%sMB', asset.nativeUrl, size.toFixed(3))
            //             totalMemory += size
            //         }
            //     } else if (asset instanceof cc.SpriteFrame) {
            //         if (asset['_originalSize'] && asset['_texture']) {
            //             size = (asset['_originalSize'].width * asset['_originalSize'].height * asset['_texture']._format) / 4 / (1024.0 * 1024.0)
            //             totalMemory += size
            //             Log.info('SpriteFrame %s 资源占用内存%sMB', asset.nativeUrl, size.toFixed(3))
            //         }
            //     }
            // }
            airkit.Log.info('资源占用内存%sMB', totalMemory.toFixed(3));
        };
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
        ResourceManager.prototype.destroy = function () {
            if (this._dicResInfo) {
                this._dicResInfo.foreach(function (k, v) {
                    ResourceManager.Instance.clearRes(k, v.ref);
                    return true;
                });
                this._dicResInfo.clear();
                this._dicResInfo = null;
            }
            return true;
        };
        ResourceManager.prototype.update = function (dt) { };
        /**获取资源*/
        ResourceManager.prototype.getRes = function (path, type) {
            //修改访问时间
            return cc.resources.get(path, type);
        };
        ResourceManager.prototype.dump = function () {
            this._dicResInfo.foreach(function (k, v) {
                console.log('url:' + k + ' refCount=' + v.ref + '\n');
                return true;
            });
        };
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
        ResourceManager.prototype.loadRes = function (url, type, refCount, viewType, priority, cache, pkg, ignoreCache) {
            //添加到加载目录
            var _this = this;
            if (refCount === void 0) { refCount = 1; }
            if (viewType === void 0) { viewType = airkit.eLoaderType.NONE; }
            if (priority === void 0) { priority = 1; }
            if (cache === void 0) { cache = true; }
            if (pkg === void 0) { pkg = null; }
            if (ignoreCache === void 0) { ignoreCache = false; }
            if (viewType == null)
                viewType = airkit.eLoaderType.NONE;
            //判断是否需要显示加载界面
            if (viewType != airkit.eLoaderType.NONE) {
                if (cc.resources.get(url))
                    viewType = airkit.eLoaderType.NONE;
            }
            //显示加载界面
            if (viewType != airkit.eLoaderType.NONE) {
                airkit.LoaderManager.Instance.show(viewType, 1);
            }
            var resInfo = this._dicResInfo.getValue(url);
            if (!resInfo) {
                resInfo = new ResInfo(url, type, refCount, pkg);
                this._dicResInfo.set(url, resInfo);
                resInfo.updateStatus(eLoaderStatus.LOADING);
            }
            else {
                resInfo.incRef(refCount);
            }
            return new Promise(function (resolve, reject) {
                cc.resources.load(url, type, function (completedCount, totalCount, item) {
                    _this.onLoadProgress(viewType, totalCount, '', completedCount / totalCount);
                }, function (error, resource) {
                    if (error) {
                        resInfo.updateStatus(eLoaderStatus.READY);
                        resInfo.decRef(refCount);
                        reject(url);
                        return;
                    }
                    resInfo.updateStatus(eLoaderStatus.LOADED);
                    _this.onLoadComplete(viewType, [url], [{ url: url, type: type, refCount: 1, pkg: pkg }], '');
                    resolve(url);
                });
            });
        };
        /**
         * 批量加载资源，如果所有资源在此之前已经加载过，则当前帧会调用complete
         * @param	arr_res 	需要加载的资源数组
         * @param	loaderType 	加载界面 eLoaderType
         * @param   tips		提示文字
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @return 	结束回调(参数：Array<string>，加载的url数组)
         */
        ResourceManager.prototype.loadArray = function (arr_res, loaderType, tips, priority, cache) {
            var _this = this;
            if (loaderType === void 0) { loaderType = airkit.eLoaderType.NONE; }
            if (tips === void 0) { tips = null; }
            if (priority === void 0) { priority = 1; }
            if (cache === void 0) { cache = true; }
            var has_unload = false;
            var pathInfos = [];
            var resArr = [];
            if (loaderType == null)
                loaderType = airkit.eLoaderType.NONE;
            if (priority == null)
                priority = 1;
            if (cache == null)
                cache = true;
            for (var i = 0; i < arr_res.length; i++) {
                var res = arr_res[i];
                if (!this.getRes(res.url)) {
                    pathInfos.push({ path: res.url, type: res.type });
                    resArr.push(res);
                    has_unload = true;
                }
                var resInfo = this._dicResInfo.getValue(res.url);
                if (!resInfo) {
                    resInfo = new ResInfo(res.url, res.type, res.refCount, res.pkg);
                    this._dicResInfo.set(res.url, resInfo);
                }
                else {
                    resInfo.incRef(res.refCount);
                    resInfo.updateStatus(eLoaderStatus.LOADED);
                }
            }
            //判断是否需要显示加载界面
            if (!has_unload && loaderType != airkit.eLoaderType.NONE) {
                loaderType = airkit.eLoaderType.NONE;
            }
            //显示加载界面
            if (loaderType != airkit.eLoaderType.NONE) {
                airkit.LoaderManager.Instance.show(loaderType, pathInfos.length, tips);
            }
            return new Promise(function (resolve, reject) {
                cc.assetManager.loadAny(pathInfos, { bundle: 'resources' }, function (completedCount, totalCount, item) {
                    _this.onLoadProgress(loaderType, totalCount, tips, completedCount / totalCount);
                }, function (error, resource) {
                    if (error) {
                        for (var i = 0; i < pathInfos.length; i++) {
                            var resInfo = _this._dicResInfo.getValue(pathInfos[i].path);
                            if (resInfo) {
                                resInfo.decRef(arr_res[i].refCount);
                                resInfo.updateStatus(eLoaderStatus.READY);
                            }
                        }
                        reject(pathInfos);
                        return;
                    }
                    for (var i = 0; i < pathInfos.length; i++) {
                        var resInfo = _this._dicResInfo.getValue(pathInfos[i].url);
                        if (resInfo) {
                            resInfo.updateStatus(eLoaderStatus.READY);
                        }
                    }
                    if (loaderType != airkit.eLoaderType.NONE) {
                        airkit.TimerManager.Instance.addOnce(_this._minLoaderTime, null, function (v) {
                            _this.onLoadComplete(loaderType, pathInfos, resArr, tips);
                            resolve(pathInfos);
                        });
                    }
                    else {
                        _this.onLoadComplete(loaderType, pathInfos, resArr, tips);
                        resolve(pathInfos);
                    }
                });
            });
        };
        /**
         * 批量加载资源，如果所有资源在此之前已经加载过，则当前帧会调用complete
         * @param	arr_res 	需要加载的资源数组
         * @param	loaderType 	加载界面 eLoaderType
         * @param   tips		提示文字
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @return 	结束回调(参数：Array<string>，加载的url数组)
         */
        ResourceManager.prototype.loadArrayRes = function (arr_res, loaderType, tips, priority, cache) {
            var _this = this;
            if (loaderType === void 0) { loaderType = airkit.eLoaderType.NONE; }
            if (tips === void 0) { tips = null; }
            if (priority === void 0) { priority = 1; }
            if (cache === void 0) { cache = true; }
            var has_unload = false;
            var urls = [];
            var resArr = [];
            if (loaderType == null)
                loaderType = airkit.eLoaderType.NONE;
            if (priority == null)
                priority = 1;
            if (cache == null)
                cache = true;
            for (var i = 0; i < arr_res.length; i++) {
                var res = arr_res[i];
                if (!this.getRes(res.url)) {
                    urls.push(res.url);
                    resArr.push(res);
                    has_unload = true;
                }
                var resInfo = this._dicResInfo.getValue(res.url);
                if (!resInfo) {
                    resInfo = new ResInfo(res.url, res.type, res.refCount, res.pkg);
                    this._dicResInfo.set(res.url, resInfo);
                }
                else {
                    resInfo.incRef(res.refCount);
                    resInfo.updateStatus(eLoaderStatus.LOADED);
                }
            }
            //判断是否需要显示加载界面
            if (!has_unload && loaderType != airkit.eLoaderType.NONE) {
                loaderType = airkit.eLoaderType.NONE;
            }
            //显示加载界面
            if (loaderType != airkit.eLoaderType.NONE) {
                airkit.LoaderManager.Instance.show(loaderType, urls.length, tips);
            }
            return new Promise(function (resolve, reject) {
                cc.resources.load(urls, function (completedCount, totalCount, item) {
                    _this.onLoadProgress(loaderType, totalCount, tips, completedCount / totalCount);
                }, function (error, resource) {
                    if (error) {
                        for (var i = 0; i < urls.length; i++) {
                            var resInfo = _this._dicResInfo.getValue(urls[i]);
                            if (resInfo) {
                                resInfo.decRef(arr_res[i].refCount);
                                resInfo.updateStatus(eLoaderStatus.READY);
                            }
                        }
                        reject(urls);
                        return;
                    }
                    for (var i = 0; i < urls.length; i++) {
                        var resInfo = _this._dicResInfo.getValue(urls[i]);
                        if (resInfo) {
                            resInfo.updateStatus(eLoaderStatus.READY);
                        }
                    }
                    if (loaderType != airkit.eLoaderType.NONE) {
                        airkit.TimerManager.Instance.addOnce(_this._minLoaderTime, null, function (v) {
                            _this.onLoadComplete(loaderType, urls, resArr, tips);
                            resolve(urls);
                        });
                    }
                    else {
                        _this.onLoadComplete(loaderType, urls, resArr, tips);
                        resolve(urls);
                    }
                });
            });
        };
        /**
         * 加载完成
         * @param	loaderType	显示的加载界面类型
         * @param 	handle 		加载时，传入的回调函数
         * @param 	args		第一个参数为加载的资源url列表；第二个参数为是否加载成功
         */
        ResourceManager.prototype.onLoadComplete = function (loaderType, urls, arr_res, tips) {
            //显示加载日志
            if (urls) {
                var arr = urls;
                for (var i = 0; i < urls.length; i++) {
                    if (arr_res[i].type == FGUIAsset) {
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
            if (loaderType != airkit.eLoaderType.NONE) {
                airkit.LoaderManager.Instance.close(loaderType);
            }
        };
        /**
         * 加载进度
         * @param	viewType	显示的加载界面类型
         * @param	total		总共需要加载的资源数量
         * @param	progress	已经加载的数量，百分比；注意，有可能相同进度会下发多次
         */
        ResourceManager.prototype.onLoadProgress = function (viewType, total, tips, progress) {
            var cur = airkit.NumberUtils.toInt(Math.floor(progress * total));
            airkit.Log.debug('[load]进度: current=%s total=%s precent = %s', cur, total, progress);
            if (viewType != airkit.eLoaderType.NONE) {
                airkit.LoaderManager.Instance.setProgress(viewType, cur, total);
            }
        };
        /**
         * 释放指定资源
         * @param	url	资源路径
         */
        ResourceManager.prototype.clearRes = function (url, refCount) {
            var res = this._dicResInfo.getValue(url);
            if (res) {
                res.decRef(refCount);
            }
        };
        ResourceManager.prototype.releaseRes = function (url) {
            this._dicResInfo.remove(url);
            cc.resources.release(url);
            airkit.Log.info('[res]释放资源:' + url);
        };
        /**
         * 图片代理，可以远程加载图片显示
         * @param image
         * @param skin
         * @param proxy
         * @param atlas
         */
        ResourceManager.imageProxy = function (image, skin, proxy, atlas) {
            return new Promise(function (resolve, reject) {
                var texture = ResourceManager.Instance.getRes(skin);
                if (texture != null) {
                    image.url = skin;
                }
                else {
                    var res_1 = skin;
                    if (atlas != null) {
                        res_1 = atlas;
                    }
                    if (proxy) {
                        image.url = proxy;
                    }
                    airkit.Log.info('imageProxy start load %s ', res_1);
                    ResourceManager.Instance.loadRes(res_1)
                        .then(function (v) {
                        image.url = skin;
                        image.alpha = 0.1;
                        airkit.TweenUtils.get(image).to({ alpha: 1.0 }, 0.3);
                        airkit.Log.info('imageProxy start load done %s ', res_1);
                    })
                        .catch(function (e) { return airkit.Log.error(e); });
                }
            });
        };
        ResourceManager.FONT_Yuanti = 'Yuanti SC Regular';
        ResourceManager.Font_Helvetica = 'Helvetica';
        ResourceManager.FONT_DEFAULT = '';
        ResourceManager.FONT_DEFAULT_SIZE = airkit.FONT_SIZE_5;
        ResourceManager.instance = null;
        return ResourceManager;
    }(airkit.Singleton));
    airkit.ResourceManager = ResourceManager;
    var eLoaderStatus;
    (function (eLoaderStatus) {
        eLoaderStatus[eLoaderStatus["READY"] = 0] = "READY";
        eLoaderStatus[eLoaderStatus["LOADING"] = 1] = "LOADING";
        eLoaderStatus[eLoaderStatus["LOADED"] = 2] = "LOADED";
    })(eLoaderStatus || (eLoaderStatus = {}));
    /**
     * 保存加载过的url
     */
    var ResInfo = /** @class */ (function (_super) {
        __extends(ResInfo, _super);
        function ResInfo(url, type, refCount, pkg) {
            var _this = _super.call(this) || this;
            _this.url = url;
            _this.ref = refCount;
            _this.type = type;
            _this.pkg = pkg;
            _this.status = eLoaderStatus.READY;
            return _this;
        }
        ResInfo.prototype.updateStatus = function (status) {
            this.status = status;
        };
        ResInfo.prototype.incRef = function (v) {
            if (v === void 0) { v = 1; }
            this.ref += v;
        };
        ResInfo.prototype.decRef = function (v) {
            if (v === void 0) { v = 1; }
            this.ref -= v;
            if (this.ref <= 0) {
                if (this.type == FGUIAsset) {
                    fgui.UIPackage.removePackage(this.url);
                    console.log('remove package' + this.url);
                    ResourceManager.Instance.releaseRes(this.url);
                }
                else if (this.pkg != null) {
                    // do nothing
                }
                else {
                    ResourceManager.Instance.releaseRes(this.url);
                }
            }
        };
        return ResInfo;
    }(airkit.EventDispatcher));
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
    var SceneManager = /** @class */ (function () {
        function SceneManager() {
        }
        /**
         * 注册场景类，存放场景name和class的对应关系
         * @param name
         * @param cls
         */
        SceneManager.register = function (name, cls) {
            if (!this.cache) {
                this.cache = new airkit.SDictionary();
            }
            if (this.cache.has(name)) {
                airkit.Log.error('SceneManager::register scene - same id is register:' + name);
                return;
            }
            this.cache.add(name, cls);
            fgui.UIObjectFactory.setExtension(cls.URL, cls);
            airkit.ClassUtils.regClass(name, cls);
        };
        Object.defineProperty(SceneManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new SceneManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        SceneManager.prototype.setup = function () {
            this.registerEvent();
        };
        SceneManager.prototype.destroy = function () {
            this.unRegisterEvent();
        };
        SceneManager.prototype.update = function (dt) {
            //do update
            if (this._curScene) {
                this._curScene.update(dt);
            }
        };
        SceneManager.prototype.registerEvent = function () {
            airkit.EventCenter.on(airkit.EventID.CHANGE_SCENE, this, this.onChangeScene);
            airkit.EventCenter.on(airkit.EventID.RESIZE, this, this.resize);
        };
        SceneManager.prototype.unRegisterEvent = function () {
            airkit.EventCenter.off(airkit.EventID.CHANGE_SCENE, this, this.onChangeScene);
            airkit.EventCenter.off(airkit.EventID.RESIZE, this, this.resize);
        };
        SceneManager.prototype.resize = function () {
            airkit.Log.info('SceneManager Receive Resize %s %s', cc.winSize.width, cc.winSize.height);
            if (this._curScene) {
                this._curScene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
                var func = this._curScene['resize'];
                var result = null;
                if (func) {
                    result = func.apply(this._curScene);
                }
                for (var i = 0; i < fgui.GRoot.inst.numChildren; i++) {
                    var v = fgui.GRoot.inst._children[i];
                    if (v instanceof airkit.Dialog) {
                        var func = v['resize'];
                        if (func) {
                            result = func.apply(v);
                        }
                    }
                }
                fgui.GRoot.inst.modalLayer.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            }
        };
        SceneManager.prototype.onChangeScene = function (evt) {
            var info = evt.get(0);
            this.gotoScene(info);
        };
        //～～～～～～～～～～～～～～～～～～～～～～～场景切换~～～～～～～～～～～～～～～～～～～～～～～～//
        /**进入场景*/
        SceneManager.prototype.gotoScene = function (sceneName, args) {
            var _this = this;
            //切换
            var clas = airkit.ClassUtils.getClass(sceneName);
            var res = clas.res();
            if (res == null || (Array.isArray(res) && res.length == 0)) {
                this.exitScene();
                this.enterScene(sceneName, clas, args);
            }
            else {
                clas.loadResource(function (v) {
                    if (v) {
                        _this.exitScene();
                        _this.enterScene(sceneName, clas, args);
                        //  ResourceManager.Instance.dump();
                    }
                    else {
                        airkit.Log.error('加载场景失败 %s', sceneName);
                    }
                });
            }
        };
        SceneManager.prototype.enterScene = function (sceneName, clas, args) {
            var scene = clas.createInstance();
            scene.UIID = sceneName;
            this._curScene = scene;
            airkit.LayerManager.mainLayer.addChild(scene);
            scene.setup(args);
        };
        SceneManager.prototype.exitScene = function () {
            if (this._curScene) {
                //切换
                var sceneName = this._curScene.UIID;
                var clas = airkit.ClassUtils.getClass(sceneName);
                clas.unres();
                this._curScene.removeFromParent();
                this._curScene.dispose();
                this._curScene = null;
            }
        };
        SceneManager.instance = null;
        return SceneManager;
    }());
    airkit.SceneManager = SceneManager;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @Date: 2021-08-13 16:20:10
 * @LastEditTime: 2021-08-13 18:23:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /source/src/ui/SpineView.ts
 */
/// <reference path="./BaseView.ts" />

(function (airkit) {
    var SpineView = /** @class */ (function (_super) {
        __extends(SpineView, _super);
        function SpineView() {
            var _this = _super.call(this) || this;
            // 播放速率
            _this._animRate = 1;
            // 循环次数
            _this._loopCount = 0;
            // 是否自动播放
            _this._autoPlay = true;
            // 是否已加载
            _this._isLoaded = false;
            // 完成回调
            _this._completeHandler = null;
            _this._skeletonData = null;
            _this._skeleton = null;
            _this._trackIndex = 0;
            return _this;
        }
        Object.defineProperty(SpineView.prototype, "source", {
            get: function () {
                return this._source ? this._source : '';
            },
            set: function (value) {
                if (this._source != value) {
                    this._source = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        SpineView.prototype.loadSkeleton = function (source, useJson) {
            var _this = this;
            if (useJson === void 0) { useJson = true; }
            if (this.isLoaded) {
                return Promise.resolve(true);
            }
            // let image = `spine/${source}/${source}.png`
            // let atlas = `spine/${source}/${source}.atlas`
            // let json = `spine/${source}/${source}.json`
            // let ske = `spine/${source}/${source}.skel`
            // let res: Res[] = [
            //     {
            //         url: image,
            //         type: ImageAsset,
            //         refCount: 1,
            //         pkg: null,
            //     },
            //     {
            //         url: atlas,
            //         type: TxtAsset,
            //         refCount: 1,
            //         pkg: null,
            //     },
            // ]
            // if (useJson) {
            //     res.push({
            //         url: json,
            //         type: TxtAsset,
            //         refCount: 1,
            //         pkg: null,
            //     })
            // } else {
            //     res.push({
            //         url: ske,
            //         type: BufferAsset,
            //         refCount: 1,
            //         pkg: null,
            //     })
            // }
            return new Promise(function (resolve, reject) {
                cc.resources.load("spine/" + source + "/" + source, sp.SkeletonData, function (err, asset2) {
                    var asset = cc.resources.get("spine/" + source + "/" + source, sp.SkeletonData);
                    _this._skeletonData = asset;
                    _this._isLoaded = true;
                    asset.addRef();
                    console.log('spine引用数量', asset.refCount);
                    resolve(true);
                });
                // ////
                // ResourceManager.Instance.loadArrayRes([{ url: `spine/${source}/${source}`, type: sp.SkeletonData, refCount: 1, pkg: null }]).then((v) => {
                //     console.log(v)
                //     this._skeletonData = ResourceManager.Instance.getRes(`spine/${source}/${source}`, sp.SkeletonData)
                //     this._isLoaded = true
                //     this._skeletonData.addRef()
                //     console.log('spine引用数量', this._skeletonData.refCount)
                //     resolve(true)
                // })
            });
        };
        Object.defineProperty(SpineView.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpineView.prototype, "animName", {
            get: function () {
                return this._animName;
            },
            set: function (value) {
                this._animName = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpineView.prototype, "aniRate", {
            get: function () {
                return this._animRate;
            },
            set: function (value) {
                this._animRate = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpineView.prototype, "loopCount", {
            get: function () {
                return this._loopCount;
            },
            set: function (value) {
                this._loopCount = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SpineView.prototype, "autoPlay", {
            get: function () {
                return this._autoPlay;
            },
            set: function (value) {
                if (this._autoPlay == value)
                    return;
                this._autoPlay = value;
                value && this._isLoaded && this.play(this._animName, this._loopCount, this._completeHandler);
            },
            enumerable: false,
            configurable: true
        });
        SpineView.prototype.play = function (animName, loopCount, completeHandler) {
            var _this = this;
            if (this.isLoaded) {
                if (this._skeleton) {
                    this._skeleton.setAnimation(this._trackIndex, animName, loopCount == -1 ? true : false);
                }
            }
            else {
                this.loadSkeleton(this.source).then(function (result) {
                    var skeleton = _this.node.addComponent(sp.Skeleton);
                    skeleton.skeletonData = _this._skeletonData;
                    _this._skeleton = skeleton;
                    _this._skeleton.setAnimation(_this._trackIndex, animName, loopCount == -1 ? true : false);
                });
            }
        };
        SpineView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this._skeletonData) {
                this._skeletonData.decRef();
            }
        };
        return SpineView;
    }(airkit.BaseView));
    airkit.SpineView = SpineView;
})(airkit || (airkit = {}));
/**
 * UI管理器
 * @author ankye
 * @time 2018-7-3
 */

(function (airkit) {
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
    var UIManager = /** @class */ (function (_super) {
        __extends(UIManager, _super);
        function UIManager() {
            var _this = _super.call(this) || this;
            _this._cacheViews = null;
            _this._UIQueues = null;
            _this._cacheViews = new Array();
            _this._UIQueues = new Array();
            //预创建2个队列,通常情况下都能满足需求了
            _this._UIQueues[airkit.eUIType.SHOW] = new UIQueue(airkit.eUIType.SHOW);
            _this._UIQueues[airkit.eUIType.POPUP] = new UIQueue(airkit.eUIType.POPUP);
            return _this;
        }
        /**
         * 注册ui类，存放uiname和class的对应关系
         * @param name
         * @param cls
         */
        UIManager.register = function (name, cls) {
            if (!this.cache) {
                this.cache = new airkit.SDictionary();
            }
            if (this.cache.has(name)) {
                airkit.Log.error('UIManager::register ui - same id is register:' + name);
                return;
            }
            this.cache.add(name, cls);
            airkit.ClassUtils.regClass(name, cls);
        };
        Object.defineProperty(UIManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new UIManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        //弹窗框显示，点击空白非自动关闭
        UIManager.show = function (uiid, params) {
            return this.Instance.show(uiid, params);
        };
        //弹窗框显示，点击空白自动关闭
        UIManager.showQ = function (uiid, params) {
            return this.Instance.showQ(uiid, params);
        };
        //弹窗框显示，点击空白非自动关闭
        UIManager.popup = function (uiid, params) {
            return this.Instance.popup(uiid, params);
        };
        //弹窗框显示，点击空白自动关闭
        UIManager.popupQ = function (uiid, params) {
            return this.Instance.popupQ(uiid, params);
        };
        //关闭所有弹窗
        UIManager.closeAll = function () {
            UIManager.Instance.getQueue(airkit.eUIType.POPUP).clear();
            UIManager.Instance.getQueue(airkit.eUIType.SHOW).clear();
            UIManager.Instance.closeAll();
        };
        //返回最上面的dialog
        UIManager.getTopDlg = function () {
            var dlg = fgui.GRoot.inst.getTopWindow();
            if (dlg)
                return dlg;
            return null;
        };
        UIManager.prototype.getQueue = function (t) {
            return this._UIQueues[t];
        };
        UIManager.prototype.empty = function () {
            var queue = this.getQueue(airkit.eUIType.SHOW);
            if (!queue.empty())
                return false;
            if (this._cacheViews.length > 0)
                return false;
            return true;
        };
        //～～～～～～～～～～～～～～～～～～～～～～～显示~～～～～～～～～～～～～～～～～～～～～～～～//
        /**
         * 显示界面
         * @param uiid        界面uiid
         * @param args      参数
         */
        UIManager.prototype.show = function (uiid, params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                params = params || {};
                if (params.single !== false) {
                    //从缓存中查找
                    var findObj = null;
                    for (var i = _this._cacheViews.length - 1; i >= 0; i--) {
                        var obj = _this._cacheViews[i];
                        if (obj && obj.UIID == uiid) {
                            findObj = obj;
                            break;
                        }
                    }
                    if (findObj) {
                        findObj.setVisible(true);
                        airkit.Log.info('添加重复uiid %s', uiid);
                        resolve(findObj);
                        return;
                    }
                }
                if (params.clothOther) {
                    _this.closeAll([uiid]);
                }
                //获取数据
                var clas = UIManager.cache.getValue(uiid);
                var res = clas.res();
                if (res == null || (Array.isArray(res) && res.length == 0)) {
                    var ui = _this.showUI(airkit.eUIType.SHOW, uiid, clas, params);
                    resolve(ui);
                }
                else {
                    clas.loadResource(function (v) {
                        if (v) {
                            var ui = _this.showUI(airkit.eUIType.SHOW, uiid, clas, params);
                            resolve(ui);
                        }
                        else {
                            reject('ui load resource failed');
                        }
                    });
                }
            }).catch(function (e) {
                airkit.Log.error(e);
                return null;
            });
        };
        /**
         * 显示界面
         * @param uiid        界面uiName
         * @param args      参数
         */
        UIManager.prototype.popup = function (uiid, params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                params = params || {};
                if (params.single !== false) {
                    //从缓存中查找
                    var findObj = null;
                    for (var i = _this._cacheViews.length - 1; i >= 0; i--) {
                        var obj = _this._cacheViews[i];
                        if (obj && obj.UIID == uiid) {
                            findObj = obj;
                            break;
                        }
                    }
                    if (findObj) {
                        findObj.setVisible(true);
                        airkit.Log.info('添加重复uiid %s', uiid);
                        resolve(findObj);
                        return;
                    }
                }
                if (params.clothOther) {
                    _this.closeAll([uiid]);
                }
                //获取数据
                var clas = UIManager.cache.getValue(uiid);
                var res = clas.res();
                if (res == null || (Array.isArray(res) && res.length == 0)) {
                    var ui = _this.showUI(airkit.eUIType.POPUP, uiid, clas, params);
                    resolve(ui);
                }
                else {
                    clas.loadResource(function (v) {
                        if (v) {
                            var ui = _this.showUI(airkit.eUIType.POPUP, uiid, clas, params);
                            resolve(ui);
                        }
                        else {
                            reject('ui load resource failed');
                        }
                    });
                }
            }).catch(function (e) {
                airkit.Log.error(e);
                return null;
            });
        };
        UIManager.prototype.showUI = function (type, uiid, clas, params) {
            var ui = new clas();
            airkit.assert(ui != null, 'UIManager::Show - cannot create ui:' + uiid);
            ui.UIID = uiid;
            ui.setup(params.data);
            if (params.clickMaskClose) {
                ui.setupClickBg();
            }
            if (type == airkit.eUIType.POPUP) {
                if (params.target) {
                    fgui.GRoot.inst.showPopup(ui, params.target);
                }
                else {
                    fgui.GRoot.inst.showPopup(ui);
                }
            }
            else {
                ui.show();
            }
            if (params.pos) {
                ui.setPosition(params.pos.x, params.pos.y);
            }
            else {
                ui.center();
            }
            this._cacheViews.push(ui);
            return ui;
        };
        /**
         * 关闭界面
         * @param uiid    界面id
         */
        UIManager.prototype.close = function (uiid, vid) {
            var _this = this;
            if (airkit.StringUtils.isNullOrEmpty(uiid))
                return;
            return new Promise(function (resolve, reject) {
                airkit.Log.info('close panel %s %s', uiid, vid);
                for (var i = _this._cacheViews.length - 1; i >= 0; i--) {
                    var obj = _this._cacheViews[i];
                    if (obj.UIID == uiid && obj.viewID == vid) {
                        //切换
                        var clas = airkit.ClassUtils.getClass(uiid);
                        clas.unres();
                        _this._cacheViews.splice(i, 1);
                        obj.dispose();
                        resolve(uiid);
                        return;
                    }
                }
            });
        };
        /**
         * 关闭所有界面
         * @param   exclude_list    需要排除关闭的列表
         */
        UIManager.prototype.closeAll = function (exclude_list) {
            if (exclude_list === void 0) { exclude_list = null; }
            for (var i = this._cacheViews.length - 1; i >= 0; i--) {
                var obj = this._cacheViews[i];
                if (exclude_list && airkit.ArrayUtils.containsValue(exclude_list, obj.UIID)) {
                    continue;
                }
                UIManager.Instance.close(obj.UIID, obj.viewID);
            }
        };
        /**
         * 弹窗UI，默认用队列显示
         * @param uiid
         * @param params
         */
        UIManager.prototype.showQ = function (uiid, params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!params)
                    params = {};
                params.resolve = resolve;
                _this.getQueue(airkit.eUIType.SHOW).show(uiid, params);
            });
        };
        /**
         * popup队列显示
         *
         * @param {string} uiid
         * @param {ShowParams} params
         * @memberof UIManager
         */
        UIManager.prototype.popupQ = function (uiid, params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!params)
                    params = {};
                params.resolve = resolve;
                _this.getQueue(airkit.eUIType.POPUP).popup(uiid, params);
            });
        };
        /**查找界面*/
        UIManager.prototype.findPanel = function (uiid) {
            for (var i = this._cacheViews.length - 1; i >= 0; i--) {
                var obj = this._cacheViews[i];
                if (obj.UIID == uiid) {
                    return obj;
                }
            }
            return null;
        };
        /**界面是否打开*/
        UIManager.prototype.isDlgOpen = function (uiid) {
            return this.findPanel(uiid) != null;
        };
        UIManager.instance = null;
        return UIManager;
    }(airkit.Singleton));
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
    var UIQueue = /** @class */ (function () {
        function UIQueue(type) {
            /*～～～～～～～～～～～～～～～～～～～～～队列方式显示界面，上一个界面关闭，才会显示下一个界面～～～～～～～～～～～～～～～～～～～～～*/
            this._currentUIs = null;
            this._currentUIs = [];
            this._type = type;
            this._readyUIs = new airkit.Queue();
        }
        /**
         * 直接显示界面,注：
         * 1.通过这个接口打开的界面，初始化注册的ui类设定的UIConfig.mHideDestroy必须为true。原因是显示下一个界面是通过上个界面的CLOSE事件触发
         * @param 	uiid		界面uiid
         * @param 	params	创建参数，会在界面onCreate时传入
         */
        UIQueue.prototype.show = function (uiid, params) {
            var info = [uiid, params];
            this._readyUIs.enqueue(info);
            this.checkNextUI();
        };
        UIQueue.prototype.popup = function (uiid, params) {
            var info = [uiid, params];
            this._readyUIs.enqueue(info);
            this.checkNextUI();
        };
        UIQueue.prototype.empty = function () {
            if (this._currentUIs.length > 0 || this._readyUIs.length > 0)
                return false;
            return true;
        };
        UIQueue.prototype.clear = function () {
            this._currentUIs = [];
            for (var i = 0; i < this._readyUIs.length; i++) {
                var info = this._readyUIs.dequeue();
                info[1].resolve && info[1].resolve(null);
            }
        };
        /**
         * 判断是否弹出下一个界面
         */
        UIQueue.prototype.checkNextUI = function () {
            var _this = this;
            if (this._currentUIs.length > 0 || this._readyUIs.length <= 0)
                return;
            var info = this._readyUIs.dequeue();
            var viewID = airkit.genViewIDSeq();
            this._currentUIs.push([info[0], viewID]);
            airkit.Log.info('dialog queue %s %s', info[0], viewID);
            if (this._type == airkit.eUIType.POPUP) {
                UIManager.Instance.popup(info[0], info[1]).then(function (v) {
                    if (v) {
                        v.viewID = viewID;
                        if (_this._currentUIs.length == 1) {
                            _this.registerEvent();
                        }
                    }
                    else {
                        _this._currentUIs.splice(_this._currentUIs.length - 1, 1);
                    }
                    if (info[1] && info[1].resolve) {
                        info[1].resolve(v);
                        info[1].resolve = null;
                    }
                });
            }
            else {
                UIManager.Instance.show(info[0], info[1]).then(function (v) {
                    if (v) {
                        v.viewID = viewID;
                        if (_this._currentUIs.length == 1) {
                            _this.registerEvent();
                        }
                    }
                    else {
                        _this._currentUIs.splice(_this._currentUIs.length - 1, 1);
                    }
                    if (info[1] && info[1].resolve) {
                        info[1].resolve(v);
                        info[1].resolve = null;
                    }
                });
            }
        };
        UIQueue.prototype.registerEvent = function () {
            airkit.EventCenter.on(airkit.EventID.UI_CLOSE, this, this.onUIEvent);
        };
        UIQueue.prototype.unRegisterEvent = function () {
            airkit.EventCenter.off(airkit.EventID.UI_CLOSE, this, this.onUIEvent);
        };
        UIQueue.prototype.onUIEvent = function (args) {
            switch (args.type) {
                case airkit.EventID.UI_CLOSE:
                    var id = args.get(0);
                    var viewID = args.get(1);
                    for (var i = 0; i < this._currentUIs.length; i++) {
                        if (this._currentUIs[i][0] == id && this._currentUIs[i][1] == viewID) {
                            console.log('close dialog:' + id + ' and id:' + viewID);
                            this._currentUIs.splice(i, 1);
                            if (this._currentUIs.length == 0) {
                                this.unRegisterEvent();
                            }
                            this.checkNextUI();
                            break;
                        }
                    }
                    break;
            }
        };
        return UIQueue;
    }());
})(airkit || (airkit = {}));

(function (airkit) {
    /**数组排序方式*/
    var eArraySortOrder;
    (function (eArraySortOrder) {
        eArraySortOrder[eArraySortOrder["ASCENDING"] = 0] = "ASCENDING";
        eArraySortOrder[eArraySortOrder["DESCENDING"] = 1] = "DESCENDING";
    })(eArraySortOrder = airkit.eArraySortOrder || (airkit.eArraySortOrder = {}));
    /**
     * 数组工具类
     * @author ankye
     * @time 2018-7-6
     */
    var ArrayUtils = /** @class */ (function () {
        function ArrayUtils() {
        }
        /** 插入元素
         * @param arr 需要操作的数组
         * @param value 需要插入的元素
         * @param index 插入位置
         */
        ArrayUtils.insert = function (arr, value, index) {
            if (index > arr.length - 1) {
                arr.push(value);
            }
            else {
                arr.splice(index, 0, value);
            }
        };
        /**
         * Checks if the given argument is a Array.
         * @function
         */
        ArrayUtils.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
        ArrayUtils.equip = function (arr, v) {
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
        };
        /**从数组移除元素*/
        ArrayUtils.removeValue = function (arr, v) {
            if (Array.isArray(v)) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (this.equip(arr[i], v)) {
                        arr.splice(i, 1);
                    }
                }
            }
            else {
                var i = arr.indexOf(v);
                if (i != -1) {
                    arr.splice(i, 1);
                }
            }
        };
        /**移除所有值等于v的元素*/
        ArrayUtils.removeAllValue = function (arr, v) {
            var i = arr.indexOf(v);
            while (i >= 0) {
                arr.splice(i, 1);
                i = arr.indexOf(v);
            }
        };
        /**包含元素*/
        ArrayUtils.containsValue = function (arr, v) {
            return arr.length > 0 ? arr.indexOf(v) != -1 : false;
        };
        /**复制*/
        ArrayUtils.copy = function (arr) {
            // return arr.slice()
            return JSON.parse(JSON.stringify(arr));
        };
        /**
         * 排序
         * @param arr 需要排序的数组
         * @param key 排序字段
         * @param order 排序方式
         */
        ArrayUtils.sort = function (arr, key, order) {
            if (order === void 0) { order = eArraySortOrder.DESCENDING; }
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
        };
        /**清空数组*/
        ArrayUtils.clear = function (arr) {
            var i = 0;
            var len = arr.length;
            for (i = 0; i < len; ++i) {
                arr[i] = null;
            }
            arr.splice(0);
        };
        /**数据是否为空*/
        ArrayUtils.isEmpty = function (arr) {
            if (arr == null || arr.length == 0) {
                return true;
            }
            return false;
        };
        return ArrayUtils;
    }());
    airkit.ArrayUtils = ArrayUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * <p> <code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。</p>
     * <p> <code>Byte</code> 类适用于需要在字节层访问数据的高级开发人员。</p>
     */
    var Byte = /** @class */ (function () {
        /**
         * 创建一个 <code>Byte</code> 类的实例。
         * @param	data	用于指定初始化的元素数目，或者用于初始化的TypedArray对象、ArrayBuffer对象。如果为 null ，则预分配一定的内存空间，当可用空间不足时，优先使用这部分内存，如果还不够，则重新分配所需内存。
         */
        function Byte(data) {
            if (data === void 0) { data = null; }
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
        Byte.getSystemEndian = function () {
            if (!Byte._sysEndian) {
                var buffer = new ArrayBuffer(2);
                new DataView(buffer).setInt16(0, 256, true);
                Byte._sysEndian = new Int16Array(buffer)[0] === 256 ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
            }
            return Byte._sysEndian;
        };
        Object.defineProperty(Byte.prototype, "buffer", {
            /**
             * 获取此对象的 ArrayBuffer 数据，数据只包含有效数据部分。
             */
            get: function () {
                var rstBuffer = this._d_.buffer;
                if (rstBuffer.byteLength === this._length)
                    return rstBuffer;
                return rstBuffer.slice(0, this._length);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Byte.prototype, "endian", {
            /**
             * <p> <code>Byte</code> 实例的字节序。取值为：<code>BIG_ENDIAN</code> 或 <code>BIG_ENDIAN</code> 。</p>
             * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
             * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
             *  <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
             */
            get: function () {
                return this._xd_ ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
            },
            set: function (value) {
                this._xd_ = value === Byte.LITTLE_ENDIAN;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Byte.prototype, "length", {
            get: function () {
                return this._length;
            },
            /**
             * <p> <code>Byte</code> 对象的长度（以字节为单位）。</p>
             * <p>如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。</p>
             * <p>如果要设置的长度大于当前已分配的内存空间的字节长度，则重新分配内存空间，大小为以下两者较大者：要设置的长度、当前已分配的长度的2倍，并将原有数据拷贝到新的内存空间中；如果要设置的长度小于当前已分配的内存空间的字节长度，也会重新分配内存空间，大小为要设置的长度，并将原有数据从头截断为要设置的长度存入新的内存空间中。</p>
             */
            set: function (value) {
                if (this._allocated_ < value)
                    this._resizeBuffer((this._allocated_ = Math.floor(Math.max(value, this._allocated_ * 2))));
                else if (this._allocated_ > value)
                    this._resizeBuffer((this._allocated_ = value));
                this._length = value;
            },
            enumerable: false,
            configurable: true
        });
        /**@private */
        Byte.prototype._resizeBuffer = function (len) {
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
                throw 'Invalid typed array length:' + len;
            }
        };
        /**
         * @private
         * <p>常用于解析固定格式的字节流。</p>
         * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
         * @return 读取的字符串。
         */
        Byte.prototype.getString = function () {
            return this.readString();
        };
        /**
         * <p>常用于解析固定格式的字节流。</p>
         * <p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
         * @return 读取的字符串。
         */
        Byte.prototype.readString = function () {
            return this._rUTF(this.getUint16());
        };
        /**
         * @private
         * <p>从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。</p>
         * <p><b>注意：</b>返回的 Float32Array 对象，在 JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。</p>
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Float32Array 对象。
         */
        Byte.prototype.getFloat32Array = function (start, len) {
            return this.readFloat32Array(start, len);
        };
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Float32Array 对象。
         */
        Byte.prototype.readFloat32Array = function (start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Float32Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        };
        /**
         * @private
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        Byte.prototype.getUint8Array = function (start, len) {
            return this.readUint8Array(start, len);
        };
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
         * @param	start	开始位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        Byte.prototype.readUint8Array = function (start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Uint8Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        };
        /**
         * @private
         * <p>从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。</p>
         * <p><b>注意：</b>返回的 Int16Array 对象，在 JavaScript 环境下，是原生的 HTML5 Int16Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Int16Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。</p>
         * @param	start	开始读取的字节偏移量位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Int16Array 对象。
         */
        Byte.prototype.getInt16Array = function (start, len) {
            return this.readInt16Array(start, len);
        };
        /**
         * 从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。
         * @param	start	开始读取的字节偏移量位置。
         * @param	len		需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
         * @return  读取的 Uint8Array 对象。
         */
        Byte.prototype.readInt16Array = function (start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Int16Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        };
        /**
         * @private
         * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        Byte.prototype.getFloat32 = function () {
            return this.readFloat32();
        };
        /**
         * 从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
         * @return 单精度（32 位）浮点数。
         */
        Byte.prototype.readFloat32 = function () {
            if (this._pos_ + 4 > this._length)
                throw 'getFloat32 error - Out of bounds';
            var v = this._d_.getFloat32(this._pos_, this._xd_);
            this._pos_ += 4;
            return v;
        };
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        Byte.prototype.getFloat64 = function () {
            return this.readFloat64();
        };
        /**
         * 从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
         * @return 双精度（64 位）浮点数。
         */
        Byte.prototype.readFloat64 = function () {
            if (this._pos_ + 8 > this._length)
                throw 'getFloat64 error - Out of bounds';
            var v = this._d_.getFloat64(this._pos_, this._xd_);
            this._pos_ += 8;
            return v;
        };
        /**
         * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
         * @param	value	单精度（32 位）浮点数。
         */
        Byte.prototype.writeFloat32 = function (value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setFloat32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        };
        /**
         * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 双精度（64 位）浮点数。
         * @param	value	双精度（64 位）浮点数。
         */
        Byte.prototype.writeFloat64 = function (value) {
            this._ensureWrite(this._pos_ + 8);
            this._d_.setFloat64(this._pos_, value, this._xd_);
            this._pos_ += 8;
        };
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
         * @return Int32 值。
         */
        Byte.prototype.getInt32 = function () {
            return this.readInt32();
        };
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Int32 值。
         * @return Int32 值。
         */
        Byte.prototype.readInt32 = function () {
            if (this._pos_ + 4 > this._length)
                throw 'getInt32 error - Out of bounds';
            var float = this._d_.getInt32(this._pos_, this._xd_);
            this._pos_ += 4;
            return float;
        };
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
         * @return Uint32 值。
         */
        Byte.prototype.getUint32 = function () {
            return this.readUint32();
        };
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint32 值。
         * @return Uint32 值。
         */
        Byte.prototype.readUint32 = function () {
            if (this._pos_ + 4 > this._length)
                throw 'getUint32 error - Out of bounds';
            var v = this._d_.getUint32(this._pos_, this._xd_);
            this._pos_ += 4;
            return v;
        };
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Int32 值。
         * @param	value	需要写入的 Int32 值。
         */
        Byte.prototype.writeInt32 = function (value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setInt32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        };
        /**
         * 在字节流的当前字节偏移量位置处写入 Uint32 值。
         * @param	value	需要写入的 Uint32 值。
         */
        Byte.prototype.writeUint32 = function (value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setUint32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        };
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
         * @return Int16 值。
         */
        Byte.prototype.getInt16 = function () {
            return this.readInt16();
        };
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Int16 值。
         * @return Int16 值。
         */
        Byte.prototype.readInt16 = function () {
            if (this._pos_ + 2 > this._length)
                throw 'getInt16 error - Out of bounds';
            var us = this._d_.getInt16(this._pos_, this._xd_);
            this._pos_ += 2;
            return us;
        };
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
         * @return Uint16 值。
         */
        Byte.prototype.getUint16 = function () {
            return this.readUint16();
        };
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint16 值。
         * @return Uint16 值。
         */
        Byte.prototype.readUint16 = function () {
            if (this._pos_ + 2 > this._length)
                throw 'getUint16 error - Out of bounds';
            var us = this._d_.getUint16(this._pos_, this._xd_);
            this._pos_ += 2;
            return us;
        };
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Uint16 值。
         * @param	value	需要写入的Uint16 值。
         */
        Byte.prototype.writeUint16 = function (value) {
            this._ensureWrite(this._pos_ + 2);
            this._d_.setUint16(this._pos_, value, this._xd_);
            this._pos_ += 2;
        };
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Int16 值。
         * @param	value	需要写入的 Int16 值。
         */
        Byte.prototype.writeInt16 = function (value) {
            this._ensureWrite(this._pos_ + 2);
            this._d_.setInt16(this._pos_, value, this._xd_);
            this._pos_ += 2;
        };
        /**
         * @private
         * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
         * @return Uint8 值。
         */
        Byte.prototype.getUint8 = function () {
            return this.readUint8();
        };
        /**
         * 从字节流的当前字节偏移量位置处读取一个 Uint8 值。
         * @return Uint8 值。
         */
        Byte.prototype.readUint8 = function () {
            if (this._pos_ + 1 > this._length)
                throw 'getUint8 error - Out of bounds';
            return this._u8d_[this._pos_++];
        };
        /**
         * 在字节流的当前字节偏移量位置处写入指定的 Uint8 值。
         * @param	value	需要写入的 Uint8 值。
         */
        Byte.prototype.writeUint8 = function (value) {
            this._ensureWrite(this._pos_ + 1);
            this._d_.setUint8(this._pos_, value);
            this._pos_++;
        };
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
         * @param	pos	字节读取位置。
         * @return Uint8 值。
         */
        //TODO:coverage
        Byte.prototype._getUInt8 = function (pos) {
            return this._readUInt8(pos);
        };
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint8 值。
         * @param	pos	字节读取位置。
         * @return Uint8 值。
         */
        //TODO:coverage
        Byte.prototype._readUInt8 = function (pos) {
            return this._d_.getUint8(pos);
        };
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
         * @param	pos	字节读取位置。
         * @return Uint16 值。
         */
        //TODO:coverage
        Byte.prototype._getUint16 = function (pos) {
            return this._readUint16(pos);
        };
        /**
         * @internal
         * 从字节流的指定字节偏移量位置处读取一个 Uint16 值。
         * @param	pos	字节读取位置。
         * @return Uint16 值。
         */
        //TODO:coverage
        Byte.prototype._readUint16 = function (pos) {
            return this._d_.getUint16(pos, this._xd_);
        };
        /**
         * @private
         * 读取指定长度的 UTF 型字符串。
         * @param	len 需要读取的长度。
         * @return 读取的字符串。
         */
        Byte.prototype._rUTF = function (len) {
            var v = '', max = this._pos_ + len, c, c2, c3, f = String.fromCharCode;
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
                    var _code = ((c & 0x0f) << 18) | ((c2 & 0x7f) << 12) | ((c3 & 0x7f) << 6) | (u[this._pos_++] & 0x7f);
                    if (_code >= 0x10000) {
                        var _offset = _code - 0x10000;
                        var _lead = 0xd800 | (_offset >> 10);
                        var _trail = 0xdc00 | (_offset & 0x3ff);
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
            return strs.join('');
            //return v;
        };
        /**
         * @private
         * 读取 <code>len</code> 参数指定的长度的字符串。
         * @param	len	要读取的字符串的长度。
         * @return 指定长度的字符串。
         */
        //TODO:coverage
        Byte.prototype.getCustomString = function (len) {
            return this.readCustomString(len);
        };
        /**
         * @private
         * 读取 <code>len</code> 参数指定的长度的字符串。
         * @param	len	要读取的字符串的长度。
         * @return 指定长度的字符串。
         */
        //TODO:coverage
        Byte.prototype.readCustomString = function (len) {
            var v = '', ulen = 0, c, c2, f = String.fromCharCode;
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
        };
        Object.defineProperty(Byte.prototype, "pos", {
            /**
             * 移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
             */
            get: function () {
                return this._pos_;
            },
            set: function (value) {
                this._pos_ = value;
                //$MOD byteOffset是只读的，这里进行赋值没有意义。
                //_d_.byteOffset = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Byte.prototype, "bytesAvailable", {
            /**
             * 可从字节流的当前位置到末尾读取的数据的字节数。
             */
            get: function () {
                return this._length - this._pos_;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 清除字节数组的内容，并将 length 和 pos 属性重置为 0。调用此方法将释放 Byte 实例占用的内存。
         */
        Byte.prototype.clear = function () {
            this._pos_ = 0;
            this.length = 0;
        };
        /**
         * @internal
         * 获取此对象的 ArrayBuffer 引用。
         * @return
         */
        Byte.prototype.__getBuffer = function () {
            //this._d_.buffer.byteLength = this.length;
            return this._d_.buffer;
        };
        /**
         * <p>将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的字为字符串添加前缀。</p>
         * <p>对应的读取方法为： getUTFBytes 。</p>
         * @param value 要写入的字符串。
         */
        Byte.prototype.writeUTFBytes = function (value) {
            // utf8-decode
            value = value + '';
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
                    var c2 = value.charCodeAt(i);
                    if (!Number.isNaN(c2) && c2 >= 0xdc00 && c2 <= 0xdfff) {
                        var _p1 = (c & 0x3ff) + 0x40;
                        var _p2 = c2 & 0x3ff;
                        var _b1 = 0xf0 | ((_p1 >> 8) & 0x3f);
                        var _b2 = 0x80 | ((_p1 >> 2) & 0x3f);
                        var _b3 = 0x80 | ((_p1 & 0x3) << 4) | ((_p2 >> 6) & 0xf);
                        var _b4 = 0x80 | (_p2 & 0x3f);
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
        };
        /**
         * <p>将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。</p>
         * <p>对应的读取方法为： getUTFString 。</p>
         * @param	value 要写入的字符串值。
         */
        Byte.prototype.writeUTFString = function (value) {
            var tPos = this.pos;
            this.writeUint16(1);
            this.writeUTFBytes(value);
            var dPos = this.pos - tPos - 2;
            //trace("writeLen:",dPos,"pos:",tPos);
            this._d_.setUint16(tPos, dPos, this._xd_);
        };
        /**
         * @private
         * 读取 UTF-8 字符串。
         * @return 读取的字符串。
         */
        Byte.prototype.readUTFString = function () {
            //var tPos:int = pos;
            //var len:int = getUint16();
            ////trace("readLen:"+len,"pos,",tPos);
            return this.readUTFBytes(this.getUint16());
        };
        /**
         * <p>从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。</p>
         * <p>对应的写入方法为： writeUTFString 。</p>
         * @return 读取的字符串。
         */
        Byte.prototype.getUTFString = function () {
            return this.readUTFString();
        };
        /**
         * @private
         * 读字符串，必须是 writeUTFBytes 方法写入的字符串。
         * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
         * @return 读取的字符串。
         */
        Byte.prototype.readUTFBytes = function (len) {
            if (len === void 0) { len = -1; }
            if (len === 0)
                return '';
            var lastBytes = this.bytesAvailable;
            if (len > lastBytes)
                throw 'readUTFBytes error - Out of bounds';
            len = len > 0 ? len : lastBytes;
            return this._rUTF(len);
        };
        /**
         * <p>从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。</p>
         * <p>一般读取的是由 writeUTFBytes 方法写入的字符串。</p>
         * @param len	要读的buffer长度，默认将读取缓冲区全部数据。
         * @return 读取的字符串。
         */
        Byte.prototype.getUTFBytes = function (len) {
            if (len === void 0) { len = -1; }
            return this.readUTFBytes(len);
        };
        /**
         * <p>在字节流中写入一个字节。</p>
         * <p>使用参数的低 8 位。忽略高 24 位。</p>
         * @param	value
         */
        Byte.prototype.writeByte = function (value) {
            this._ensureWrite(this._pos_ + 1);
            this._d_.setInt8(this._pos_, value);
            this._pos_ += 1;
        };
        /**
         * <p>从字节流中读取带符号的字节。</p>
         * <p>返回值的范围是从 -128 到 127。</p>
         * @return 介于 -128 和 127 之间的整数。
         */
        Byte.prototype.readByte = function () {
            if (this._pos_ + 1 > this._length)
                throw 'readByte error - Out of bounds';
            return this._d_.getInt8(this._pos_++);
        };
        /**
         * @private
         * 从字节流中读取带符号的字节。
         */
        Byte.prototype.getByte = function () {
            return this.readByte();
        };
        /**
         * @internal
         * <p>保证该字节流的可用长度不小于 <code>lengthToEnsure</code> 参数指定的值。</p>
         * @param	lengthToEnsure	指定的长度。
         */
        Byte.prototype._ensureWrite = function (lengthToEnsure) {
            if (this._length < lengthToEnsure)
                this._length = lengthToEnsure;
            if (this._allocated_ < lengthToEnsure)
                this.length = lengthToEnsure;
        };
        /**
         * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
         * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
         * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
         * @param	arraybuffer	需要写入的 Arraybuffer 对象。
         * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
         * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
         */
        Byte.prototype.writeArrayBuffer = function (arraybuffer, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (offset < 0 || length < 0)
                throw 'writeArrayBuffer error - Out of bounds';
            if (length == 0)
                length = arraybuffer.byteLength - offset;
            this._ensureWrite(this._pos_ + length);
            var uint8array = new Uint8Array(arraybuffer);
            this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
            this._pos_ += length;
        };
        /**
         * 读取ArrayBuffer数据
         * @param	length
         * @return
         */
        Byte.prototype.readArrayBuffer = function (length) {
            var rst;
            rst = this._u8d_.buffer.slice(this._pos_, this._pos_ + length);
            this._pos_ = this._pos_ + length;
            return rst;
        };
        /**
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
         * <p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
         * <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
         */
        Byte.BIG_ENDIAN = 'bigEndian';
        /**
         * <p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
         * <p> <code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。<br/>
         * <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。</p>
         */
        Byte.LITTLE_ENDIAN = 'littleEndian';
        /**@private */
        Byte._sysEndian = null;
        return Byte;
    }());
    airkit.Byte = Byte;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:04:17
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/utils/ByteArrayUtils.ts
 */

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
        var body = bytes2Uint8Array(data, endian);
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
        var dataString = '';
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
    var ClassUtils = /** @class */ (function () {
        function ClassUtils() {
        }
        /**
         * 注册 Class 映射，方便在class反射时获取。
         * @param	className 映射的名字或者别名。
         * @param	classDef 类的全名或者类的引用，全名比如:"cc.Sprite"。
         */
        ClassUtils.regClass = function (className, classDef) {
            ClassUtils._classMap[className] = classDef;
        };
        /**
         * 根据类名短名字注册类，比如传入[Sprite]，功能同regClass("Sprite",Sprite);
         * @param	classes 类数组
         */
        ClassUtils.regShortClassName = function (classes) {
            for (var i = 0; i < classes.length; i++) {
                var classDef = classes[i];
                var className = classDef.name;
                ClassUtils._classMap[className] = classDef;
            }
        };
        /**
         * 返回注册的 Class 映射。
         * @param	className 映射的名字。
         */
        ClassUtils.getRegClass = function (className) {
            return ClassUtils._classMap[className];
        };
        /**
         * 根据名字返回类对象。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return 类对象
         */
        ClassUtils.getClass = function (className) {
            var classObject = ClassUtils._classMap[className] || ClassUtils._classMap['cc.' + className] || className;
            return classObject;
        };
        /**
         * 根据名称创建 Class 实例。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return	返回类的实例。
         */
        ClassUtils.getInstance = function (className) {
            var compClass = ClassUtils.getClass(className);
            if (compClass)
                return new compClass();
            else
                console.warn('[error] Undefined class:', className);
            return null;
        };
        /**深复制一个对象*/
        ClassUtils.copyObject = function (obj) {
            var js = JSON.stringify(obj);
            return JSON.parse(js);
        };
        /**获取一个对象里的值*/
        ClassUtils.getObjectValue = function (obj, key, defVal) {
            if (obj[key]) {
                return obj[key];
            }
            return defVal;
        };
        ClassUtils.callFunc = function (obj, funcName, args) {
            if (args === void 0) { args = null; }
            if (funcName == null) {
                return;
            }
            var func = obj[funcName];
            var result = null;
            if (func) {
                if (args == null) {
                    result = func.apply(obj);
                }
                else {
                    result = func.apply(obj, args);
                }
            }
            else {
                airkit.Log.error('cant find funcName %s from Module:%s', funcName, obj.name);
            }
            return result;
        };
        ClassUtils.classKey = function (obj) {
            var proto = Object.getPrototypeOf(obj);
            var clazz = proto['constructor'];
            var sign = clazz['objectKey'];
            return sign;
        };
        /**@private */
        ClassUtils._classMap = {};
        return ClassUtils;
    }());
    airkit.ClassUtils = ClassUtils;
})(airkit || (airkit = {}));
// import { StringUtils } from "./StringUtils";

(function (airkit) {
    /**
     * 时间
     * @author ankye
     * @time 2018-7-11
     */
    var DateUtils = /** @class */ (function () {
        function DateUtils() {
        }
        DateUtils.setServerTime = function (time) {
            this.serverTime = time;
            this.serverTimeDiff = Date.now() - time;
        };
        /**获取UNIX时间 */
        DateUtils.getNow = function () {
            var now = Math.floor((Date.now() - this.serverTimeDiff) / 1000);
            return now;
        };
        DateUtils.getNowMS = function () {
            return Date.now() - this.serverTimeDiff;
        };
        DateUtils.isTheSameMonth = function (nTime, nSecond) {
            var now = DateUtils.getNow();
            var curTime = now - nSecond;
            var date = new Date(curTime * 1000);
            var defineDate = new Date(date.getFullYear(), date.getMonth(), 1);
            var nextTime = Math.floor(defineDate.getTime() / 1000) + nSecond;
            return nTime >= nextTime;
        };
        DateUtils.isTheSameDayByNow = function (nTime, nSecond) {
            var date = new Date();
            var offset = date.getTimezoneOffset() * 60;
            var now = DateUtils.getNow();
            var day1 = (nTime - offset - nSecond) / 86400;
            var day2 = (now - offset - nSecond) / 86400;
            if (Math.floor(day1) === Math.floor(day2)) {
                return true;
            }
            return false;
        };
        /**计算从nTime1到nTime2过去了多少天*/
        DateUtils.passedDays = function (nTime1, nTime2, nSecondOffset) {
            if (nSecondOffset === void 0) { nSecondOffset = 0; }
            var date = new Date();
            var offset = date.getTimezoneOffset() * 60;
            var day1 = (nTime1 - offset - nSecondOffset) / 86400;
            var day2 = (nTime2 - offset - nSecondOffset) / 86400;
            return Math.floor(day2) - Math.floor(day1);
        };
        DateUtils.currentYMDHMS = function () {
            return this.formatDateTime(this.getNowMS());
        };
        DateUtils.currentHour = function () {
            var date = new Date(this.getNowMS());
            return date.getHours();
        };
        //时间戳转换日期 (yyyy-MM-dd HH:mm:ss)
        DateUtils.formatDateTime = function (timeValue) {
            var date = new Date(timeValue);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var M = m < 10 ? '0' + m : m;
            var d = date.getDate();
            var D = d < 10 ? '0' + d : d;
            var h = date.getHours();
            var H = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var minut = minute < 10 ? '0' + minute : minute;
            var secon = second < 10 ? '0' + second : second;
            return y + '-' + M + '-' + D + ' ' + H + ':' + minut + ':' + secon;
        };
        //返回时:分:秒
        DateUtils.countdown = function (time, format) {
            if (format === void 0) { format = 'D天H时M分S秒'; }
            var s = Math.max(0, time / 1000);
            var d = Math.floor(s / 24 / 3600);
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            var f = format.replace(/D/, d.toString());
            f = f.replace(/H/, h.toString());
            f = f.replace(/M/, m.toString());
            f = f.replace(/S/, s.toString());
            return f;
        };
        DateUtils.formatTime = function (time, format) {
            if (format === void 0) { format = '%s:%s:%s'; }
            var s = Math.max(0, time);
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            return airkit.StringUtils.format(format, h < 10 ? '0' + h : h, m < 10 ? '0' + m : m, s < 10 ? '0' + s : s);
        };
        DateUtils.format2Time = function (time) {
            var format = '%s:%s';
            var s = Math.max(0, time);
            var d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return airkit.StringUtils.format('%s天', d);
            }
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            var M = m < 10 ? '0' + m : m;
            var H = h < 10 ? '0' + h : h;
            var S = s < 10 ? '0' + s : s;
            if (h > 0) {
                return airkit.StringUtils.format(format, H, M);
            }
            else {
                format = format.replace(':', '’');
                return airkit.StringUtils.format(format, M, S);
            }
        };
        DateUtils.format2Time2 = function (time) {
            var format = '%s:%s';
            var s = Math.max(0, time);
            var d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return airkit.StringUtils.format('%s天', d);
            }
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            var M = m < 10 ? '0' + m : m;
            var H = h < 10 ? '0' + h : h;
            var S = s < 10 ? '0' + s : s;
            if (h > 0) {
                return airkit.StringUtils.format(format, H, M);
            }
            else {
                format = format.replace(':', '’');
                return airkit.StringUtils.format(format, M, S);
            }
        };
        /**服务器时间*/
        DateUtils.serverTimeDiff = 0;
        DateUtils.serverTime = 0;
        return DateUtils;
    }());
    airkit.DateUtils = DateUtils;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:04:27
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/utils/DicUtils.ts
 */
/**
 * 字典工具类
 * @author ankye
 * @time 2018-7-6
 */

(function (airkit) {
    var DicUtils = /** @class */ (function () {
        function DicUtils() {
        }
        /**
         * 键列表
         */
        DicUtils.getKeys = function (d) {
            var a = [];
            for (var key in d) {
                a.push(key);
            }
            return a;
        };
        /**
         * 值列表
         */
        DicUtils.getValues = function (d) {
            var a = [];
            for (var key in d) {
                a.push(d[key]);
            }
            return a;
        };
        /**
         * 清空字典
         */
        DicUtils.clearDic = function (dic) {
            var v;
            for (var key in dic) {
                v = dic[key];
                if (v instanceof Object) {
                    DicUtils.clearDic(v);
                }
                delete dic[key];
            }
        };
        /**
         * 全部应用
         */
        DicUtils.foreach = function (dic, compareFn) {
            for (var key in dic) {
                if (!compareFn.call(null, key, dic[key]))
                    break;
            }
        };
        DicUtils.isEmpty = function (dic) {
            if (dic == null)
                return true;
            for (var key in dic) {
                return false;
            }
            return true;
        };
        DicUtils.getLength = function (dic) {
            if (dic == null)
                return 0;
            var count = 0;
            for (var key in dic) {
                ++count;
            }
            return count;
        };
        DicUtils.assign = function (obj, dic) {
            ;
            Object.assign(obj, dic);
        };
        return DicUtils;
    }());
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
    var DisplayUtils = /** @class */ (function () {
        function DisplayUtils() {
        }
        /**
         * 移除全部子对象
         */
        DisplayUtils.removeAllChild = function (container) {
            if (!container)
                return;
            if (container.numChildren <= 0)
                return;
            while (container.numChildren > 0) {
                var node = container.removeChildAt(0);
                if (node) {
                    var cons = node['constructor'];
                    if (cons['name'] == 'Animation') {
                        var ani = node;
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
        };
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
        DisplayUtils.colorBG = function (color, w, h) {
            var bgSp = new fgui.GGraph();
            bgSp.drawRect(1, color, color);
            bgSp.setSize(w, h);
            bgSp.alpha = 0.7;
            return bgSp;
        };
        DisplayUtils.popupDown = function (panel, handler, ignoreAnchor) {
            panel.scale(0.8, 0.8);
            var x = displayWidth() >> 1;
            var y = displayHeight() >> 1;
            if (ignoreAnchor == null || !ignoreAnchor) {
                panel.anchorX = 0.5;
                panel.anchorY = 0.5;
            }
            else {
                x = panel.x;
                y = panel.y;
            }
            panel.pos(x, 0);
            var time = 500;
            airkit.TweenUtils.get(panel).to({ scaleX: 1, scaleY: 1, x: x, y: y }, time, fgui.EaseType.BackOut, handler);
            if (panel.parent && panel.parent.bg) {
                panel.parent.bg.alpha = 0;
                airkit.TweenUtils.get(panel.parent.bg).to({ alpha: 1.0 }, time, fgui.EaseType.QuadOut);
            }
        };
        DisplayUtils.popup = function (view, handler, ignoreAnchor) {
            view.setScale(0.85, 0.85);
            var x = displayWidth() >> 1;
            var y = displayHeight() >> 1;
            if (ignoreAnchor == null || !ignoreAnchor) {
                view.setPivot(0.5, 0.5, true);
            }
            else {
                x = view.x;
                y = view.y;
            }
            view.setPosition(x, y);
            var time = 0.25;
            airkit.TweenUtils.get(view).to({ scaleX: 1, scaleY: 1 }, time, fgui.EaseType.QuadOut, handler);
            if (view.parent && view.parent.getChild('bg')) {
                var bg = view.parent.getChild('bg');
                bg.alpha = 0;
                airkit.TweenUtils.get(bg).to({ alpha: 1.0 }, 0.25, fgui.EaseType.QuadOut);
            }
        };
        DisplayUtils.hide = function (panel, handler) {
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
        };
        return DisplayUtils;
    }());
    airkit.DisplayUtils = DisplayUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    /**
     * <p><code>Handler</code> 是事件处理器类。</p>
     * <p>推荐使用 Handler.create() 方法从对象池创建，减少对象创建消耗。创建的 Handler 对象不再使用后，可以使用 Handler.recover() 将其回收到对象池，回收后不要再使用此对象，否则会导致不可预料的错误。</p>
     * <p><b>注意：</b>由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。</p>
     */
    var Handler = /** @class */ (function () {
        /**
         * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
         * @param	caller 执行域。
         * @param	method 处理函数。
         * @param	args 函数参数。
         * @param	once 是否只执行一次。
         */
        function Handler(caller, method, args, once) {
            if (caller === void 0) { caller = null; }
            if (method === void 0) { method = null; }
            if (args === void 0) { args = null; }
            if (once === void 0) { once = false; }
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
        Handler.prototype.setTo = function (caller, method, args, once) {
            if (once === void 0) { once = false; }
            this._id = Handler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
            return this;
        };
        /**
         * 执行处理器。
         */
        Handler.prototype.run = function () {
            if (this.method == null)
                return null;
            var id = this._id;
            var result = this.method.apply(this.caller, this.args);
            this._id === id && this.once && this.recover();
            return result;
        };
        /**
         * 执行处理器，并携带额外数据。
         * @param	data 附加的回调数据，可以是单数据或者Array(作为多参)。
         */
        Handler.prototype.runWith = function (data) {
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
        };
        /**
         * 清理对象引用。
         */
        Handler.prototype.clear = function () {
            this.caller = null;
            this.method = null;
            this.args = null;
            return this;
        };
        /**
         * 清理并回收到 Handler 对象池内。
         */
        Handler.prototype.recover = function () {
            if (this._id > 0) {
                this._id = 0;
                Handler._pool.push(this.clear());
            }
        };
        /**
         * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
         * @return  返回创建的handler实例。
         */
        Handler.create = function (caller, method, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = true; }
            if (Handler._pool.length)
                return Handler._pool.pop().setTo(caller, method, args, once);
            return new Handler(caller, method, args, once);
        };
        /**@private handler对象池*/
        Handler._pool = [];
        /**@private */
        Handler._gid = 1;
        return Handler;
    }());
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
    var OrbitType;
    (function (OrbitType) {
        OrbitType[OrbitType["Line"] = 3] = "Line";
        OrbitType[OrbitType["Curve"] = 2] = "Curve";
    })(OrbitType = airkit.OrbitType || (airkit.OrbitType = {}));
    var MathUtils = /** @class */ (function () {
        function MathUtils() {
        }
        MathUtils.sign = function (n) {
            n = +n;
            if (n === 0 || isNaN(n)) {
                return n;
            }
            return n > 0 ? 1 : -1;
        };
        /**
         * 限制范围
         */
        MathUtils.clamp = function (n, min, max) {
            if (min > max) {
                var i = min;
                min = max;
                max = i;
            }
            return n < min ? min : n > max ? max : n;
        };
        MathUtils.clamp01 = function (value) {
            if (value < 0)
                return 0;
            if (value > 1)
                return 1;
            return value;
        };
        MathUtils.lerp = function (from, to, t) {
            return from + (to - from) * MathUtils.clamp01(t);
        };
        MathUtils.lerpAngle = function (a, b, t) {
            var num = MathUtils.repeat(b - a, 360);
            if (num > 180)
                num -= 360;
            return a + num * MathUtils.clamp01(t);
        };
        MathUtils.repeat = function (t, length) {
            return t - Math.floor(t / length) * length;
        };
        /**
         * 产生随机数
         * 结果：x>=param1 && x<param2
         */
        MathUtils.randRange = function (param1, param2) {
            var loc = Math.random() * (param2 - param1) + param1;
            return loc;
        };
        /**
         * 产生随机数
         * 结果：x>=param1 && x<=param2
         */
        MathUtils.randRange_Int = function (param1, param2) {
            var loc = Math.random() * (param2 - param1 + 1) + param1;
            return Math.floor(loc);
        };
        /**
         * 从数组中产生随机数[-1,1,2]
         * 结果：-1/1/2中的一个
         */
        MathUtils.randRange_Array = function (arr) {
            if (arr.length == 0)
                return null;
            var loc = arr[MathUtils.randRange_Int(0, arr.length - 1)];
            return loc;
        };
        /**
         * 转换为360度角度
         */
        MathUtils.clampDegrees = function (degrees) {
            while (degrees < 0)
                degrees = degrees + 360;
            while (degrees >= 360)
                degrees = degrees - 360;
            return degrees;
        };
        /**
         * 转换为360度弧度
         */
        MathUtils.clampRadians = function (radians) {
            while (radians < 0)
                radians = radians + 2 * Math.PI;
            while (radians >= 2 * Math.PI)
                radians = radians - 2 * Math.PI;
            return radians;
        };
        /**
         * 两点间的距离
         */
        MathUtils.getDistance = function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
        };
        MathUtils.getSquareDistance = function (x1, y1, x2, y2) {
            return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2);
        };
        /**
         * 两点间的弧度：x正方形为0，Y轴向下,顺时针为正
         */
        MathUtils.getLineRadians = function (x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        };
        MathUtils.getLineDegree = function (x1, y1, x2, y2) {
            var degree = MathUtils.toDegree(MathUtils.getLineRadians(x1, y1, x2, y2));
            return MathUtils.clampDegrees(degree);
        };
        MathUtils.getPointRadians = function (x, y) {
            return Math.atan2(y, x);
        };
        MathUtils.getPointDegree = function (x, y) {
            var degree = MathUtils.toDegree(MathUtils.getPointRadians(x, y));
            return MathUtils.clampDegrees(degree);
        };
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
        MathUtils.toDegree = function (radian) {
            return radian * (180.0 / Math.PI);
        };
        /**
         * 度转化为弧度
         */
        MathUtils.toRadian = function (degree) {
            return degree * (Math.PI / 180.0);
        };
        MathUtils.moveTowards = function (current, target, maxDelta) {
            if (Math.abs(target - current) <= maxDelta) {
                return target;
            }
            return current + MathUtils.sign(target - current) * maxDelta;
        };
        //求两点的夹角（弧度）
        MathUtils.radians4point = function (ax, ay, bx, by) {
            return Math.atan2(ay - by, bx - ax);
        };
        // 求圆上一个点的位置
        MathUtils.pointAtCircle = function (px, py, radians, radius) {
            return new cc.Vec2(px + Math.cos(radians) * radius, py - Math.sin(radians) * radius);
        };
        /**
         * 根据位置数组，轨迹类型和时间进度来返回对应的位置
         * @param pts 位置数组
         * @param t 时间进度[0,1]
         * @param type Line:多点折线移动,Curve:贝塞尔曲线移动
         */
        MathUtils.getPos = function (pts, t, type) {
            if (pts.length == 0)
                return null;
            if (pts.length == 1)
                return pts[0];
            t = Math.min(t, 1); //限定时间值范围,最大为1
            var target = new cc.Vec2();
            var count = pts.length;
            if (type == OrbitType.Line) {
                var unitTime = 1 / (count - 1); //每两个顶点之间直线所用的时间
                var index = Math.floor(t / unitTime);
                if (index + 1 < count) {
                    var start = pts[index];
                    var end = pts[index + 1];
                    var time = (t - index * unitTime) / unitTime; //每两点之间曲线移动时间[0,1]
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
        };
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
        MathUtils.getRotation = function (startX, startY, endX, endY) {
            var deltaX = endX - startX;
            var deltaY = endY - startY;
            var angle = (Math.atan(deltaY / deltaX) * 180) / Math.PI;
            if (deltaX >= 0) {
                angle += 90;
            }
            else {
                angle += 270;
            }
            return angle;
        };
        /**
         * 根据顶点数组来生成贝塞尔曲线(只支持二阶和三阶)，根据t返回对应的曲线位置
         * @param pts 顶点数组：第一个和最后一个点是曲线轨迹的起点和终点，其他点都是控制点，曲线不会经过这些点
         * @param t 整个轨迹的时间[0-1]
         */
        MathUtils.getBezierat = function (pts, t) {
            var target = new cc.Vec2();
            if (pts.length == 3) {
                //二阶贝塞尔
                target.x = Math.pow(1 - t, 2) * pts[0].x + 2 * t * (1 - t) * pts[1].x + Math.pow(t, 2) * pts[2].x;
                target.y = Math.pow(1 - t, 2) * pts[0].y + 2 * t * (1 - t) * pts[1].y + Math.pow(t, 2) * pts[2].y;
            }
            else if (pts.length == 4) {
                //三阶贝塞尔
                target.x = Math.pow(1 - t, 3) * pts[0].x + 3 * t * Math.pow(1 - t, 2) * pts[1].x + 3 * Math.pow(t, 2) * (1 - t) * pts[2].x + Math.pow(t, 3) * pts[3].x;
                target.y = Math.pow(1 - t, 3) * pts[0].y + 3 * t * Math.pow(1 - t, 2) * pts[1].y + 3 * Math.pow(t, 2) * (1 - t) * pts[2].y + Math.pow(t, 3) * pts[3].y;
            }
            return target;
        };
        /**
         * 根据旋转角度返回二维方向向量(单位化过)
         * @param angle
         */
        MathUtils.getDirection = function (angle) {
            var dir = new cc.Vec2();
            if (angle == 0 || angle == 180) {
                dir.x = 0;
                dir.y = angle == 0 ? -1 : 1;
            }
            else if (angle == 90 || angle == 270) {
                dir.y = 0;
                dir.x = angle == 90 ? 1 : -1;
            }
            else {
                var idx = Math.floor(angle / 90);
                var rad = ((90 - angle) * Math.PI) / 180;
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
        };
        /**
         * 单位化向量
         * @param vec
         */
        MathUtils.normalize = function (vec) {
            var k = vec.y / vec.x;
            var x = Math.sqrt(1 / (k * k + 1));
            var y = Math.abs(k * x);
            vec.x = vec.x > 0 ? x : -x;
            vec.y = vec.y > 0 ? y : -y;
            return vec;
        };
        /**
         * 求两点之间的距离长度
         */
        MathUtils.distance = function (startX, startY, endX, endY) {
            return Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
        };
        /**
         * 根据起始和终点连线方向，计算垂直于其的向量和连线中心点的位置，通过raise来调整远近，越远贝塞尔曲线计算的曲线越弯
         *  @param start 起始点坐标
         *  @param end   终点坐标
         *  @param raise 调整离中心点远近
         *
         */
        MathUtils.getVerticalVector = function (start, end, raise) {
            var dir = new cc.Vec2();
            dir.x = end.x - start.x;
            dir.y = end.y - start.y;
            dir.normalize();
            var vertial = new cc.Vec2();
            vertial.x = 1;
            vertial.y = -dir.x / dir.y;
            var target = new cc.Vec2();
            target.x = (start.x + end.x) / 2 + vertial.x * raise;
            target.y = (start.y + end.y) / 2 + vertial.y * raise;
            return target;
        };
        /**
         * 根据起始点和终点获得控制点
         *
         * @param start 起始点坐标
         * @param end 终点坐标
         * @param raise 控制弯曲度,越大越弯曲
         * @param xOffset 控制弯曲X方向偏移量
         * @param yOffset 控制弯曲Y方向偏移量
         */
        MathUtils.getCtrlPoint = function (start, end, raise, xOffset, yOffset) {
            if (raise === void 0) { raise = 100; }
            if (xOffset === void 0) { xOffset = 50; }
            if (yOffset === void 0) { yOffset = 50; }
            var ctrlPoint = this.getVerticalVector(start, end, raise);
            ctrlPoint.x += xOffset;
            ctrlPoint.y += yOffset;
            return ctrlPoint;
        };
        MathUtils.getDefaultPoints = function (start, end, xOffset, yOffset, raise) {
            if (xOffset === void 0) { xOffset = 150; }
            if (yOffset === void 0) { yOffset = 150; }
            if (raise === void 0) { raise = 150; }
            if (start.x > airkit.displayWidth() / 2) {
                xOffset = -xOffset;
            }
            if (start.y > end.y) {
                yOffset = -yOffset;
            }
            var ctrlPt1 = this.getCtrlPoint(start, end, raise, xOffset, yOffset);
            return [start, ctrlPt1, end];
        };
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
        return MathUtils;
    }());
    airkit.MathUtils = MathUtils;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:04:49
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/utils/NumberUtils.ts
 */
// import { StringUtils } from "./StringUtils";

(function (airkit) {
    /**
     * 字符串
     * @author ankye
     * @time 2018-7-8
     */
    var NumberUtils = /** @class */ (function () {
        function NumberUtils() {
        }
        /**
         * 保留小数点后几位
         */
        NumberUtils.toFixed = function (value, p) {
            return airkit.StringUtils.toNumber(value.toFixed(p));
        };
        NumberUtils.toInt = function (value) {
            return Math.floor(value);
        };
        NumberUtils.isInt = function (value) {
            return Math.ceil(value) != value ? false : true;
        };
        /**
         * 保留有效数值
         */
        NumberUtils.reserveNumber = function (num, size) {
            var str = String(num);
            var l = str.length;
            var p_index = str.indexOf('.');
            if (p_index < 0) {
                return num;
            }
            var ret = str.slice(0, p_index + 1);
            var lastNum = l - p_index;
            if (lastNum > size) {
                lastNum = size;
            }
            var lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
            return airkit.StringUtils.toNumber(ret + lastStr);
        };
        /**
         * 保留有效数值，不够补0；注意返回的是字符串
         */
        NumberUtils.reserveNumberWithZero = function (num, size) {
            var str = String(num);
            var l = str.length;
            var p_index = str.indexOf('.');
            if (p_index < 0) {
                //是整数
                str += '.';
                for (var i = 0; i < size; ++i)
                    str += '0';
                return str;
            }
            var ret = str.slice(0, p_index + 1);
            var lastNum = l - p_index - 1;
            if (lastNum > size) {
                //超过
                lastNum = size;
                var lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
                return ret + lastStr;
            }
            else if (lastNum < size) {
                //不足补0
                var diff = size - lastNum;
                for (var i = 0; i < diff; ++i)
                    str += '0';
                return str;
            }
            else {
                return str;
            }
        };
        return NumberUtils;
    }());
    airkit.NumberUtils = NumberUtils;
})(airkit || (airkit = {}));
/**
 * 字符串
 * @author ankye
 * @time 2018-7-8
 */

(function (airkit) {
    var StringUtils = /** @class */ (function () {
        function StringUtils() {
        }
        Object.defineProperty(StringUtils, "empty", {
            get: function () {
                return '';
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 字符串是否有值
         */
        StringUtils.isNullOrEmpty = function (s) {
            return s != null && s.length > 0 ? false : true;
        };
        StringUtils.toInt = function (str) {
            if (!str || str.length == 0)
                return 0;
            return parseInt(str);
        };
        StringUtils.toNumber = function (str) {
            if (!str || str.length == 0)
                return 0;
            return parseFloat(str);
        };
        StringUtils.stringCut = function (str, len, fill) {
            if (fill === void 0) { fill = '...'; }
            var result = str;
            if (str.length > len) {
                result = str.substr(0, len) + fill;
            }
            return result;
        };
        /**
         * 获取字符串真实长度,注：
         * 1.普通数组，字符占1字节；汉子占两个字节
         * 2.如果变成编码，可能计算接口不对
         */
        StringUtils.getNumBytes = function (str) {
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLength += 1;
                else
                    realLength += 2;
            }
            return realLength;
        };
        /**
         * 补零
         * @param str
         * @param len
         * @param dir 0-后；1-前
         * @return
         */
        StringUtils.addZero = function (str, len, dir) {
            if (dir === void 0) { dir = 0; }
            var _str = '';
            var _len = str.length;
            var str_pre_zero = '';
            var str_end_zero = '';
            if (dir == 0)
                str_end_zero = '0';
            else
                str_pre_zero = '0';
            if (_len < len) {
                var i = 0;
                while (i < len - _len) {
                    _str = str_pre_zero + _str + str_end_zero;
                    ++i;
                }
                return _str + str;
            }
            return str;
        };
        /**
         * Checks if the given argument is a string.
         * @function
         */
        StringUtils.isString = function (obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        };
        /**
         * 去除左右空格
         * @param input
         * @return
         */
        StringUtils.trim = function (input) {
            if (input == null) {
                return '';
            }
            return input.replace(/^\s+|\s+$""^\s+|\s+$/g, '');
        };
        /**
         * 去除左侧空格
         * @param input
         * @return
         */
        StringUtils.trimLeft = function (input) {
            if (input == null) {
                return '';
            }
            return input.replace(/^\s+""^\s+/, '');
        };
        /**
         * 去除右侧空格
         * @param input
         * @return
         */
        StringUtils.trimRight = function (input) {
            if (input == null) {
                return '';
            }
            return input.replace(/\s+$""\s+$/, '');
        };
        /**
         * 分钟与秒格式(如-> 40:15)
         * @param seconds 秒数
         * @return
         */
        StringUtils.minuteFormat = function (seconds) {
            var min = Math.floor(seconds / 60);
            var sec = Math.floor(seconds % 60);
            var min_str = min < 10 ? '0' + min.toString() : min.toString();
            var sec_str = sec < 10 ? '0' + sec.toString() : sec.toString();
            return min_str + ':' + sec_str;
        };
        /**
         * 时分秒格式(如-> 05:32:20)
         * @param seconds(秒)
         * @return
         */
        StringUtils.hourFormat = function (seconds) {
            var hour = Math.floor(seconds / 3600);
            var hour_str = hour < 10 ? '0' + hour.toString() : hour.toString();
            return hour_str + ':' + StringUtils.minuteFormat(seconds % 3600);
        };
        /**
         * 格式化字符串
         * @param str 需要格式化的字符串，【"杰卫，这里有%s个苹果，和%s个香蕉！", 5,10】
         * @param args 参数列表
         */
        StringUtils.format2 = function (str) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++) {
                str = str.replace(new RegExp('\\{' + i + '\\}', 'gm'), typeof args[i] === 'object' ? JSON.stringify(args[i], null, 4) : args[i]);
            }
            return str;
        };
        StringUtils.format = function (str) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var seq = 0;
            str = str.replace(/(%s|%d|%o|%%)/g, function (match) {
                return match === '%%' ? '%' : "{" + seq++ + "}";
            });
            return this.format2.apply(this, __spreadArrays([str], args));
        };
        StringUtils.formatWithDic = function (str, dic) {
            for (var key in dic) {
                str = str.replace(new RegExp('\\{' + key + '\\}', 'gm'), typeof dic[key] === 'object' ? JSON.stringify(dic[key], null, 4) : dic[key]);
            }
            return str;
        };
        /**
         * 以指定字符开始
         */
        StringUtils.beginsWith = function (input, prefix) {
            return prefix == input.substring(0, prefix.length);
        };
        /**
         * 以指定字符结束
         */
        StringUtils.endsWith = function (input, suffix) {
            return suffix == input.substring(input.length - suffix.length);
        };
        /**guid*/
        StringUtils.getGUIDString = function () {
            var d = Date.now();
            if (window.performance && typeof window.performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
            });
        };
        return StringUtils;
    }());
    airkit.StringUtils = StringUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var TouchUtils = /** @class */ (function () {
        function TouchUtils() {
        }
        return TouchUtils;
    }());
    airkit.TouchUtils = TouchUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    /*
     * @author ankye
     * 连续动画
     */
    var TweenUtils = /** @class */ (function () {
        function TweenUtils(target) {
            this._target = target;
            this._steps = [];
            this._isPlaying = false;
            this._currentTweener = null;
        }
        TweenUtils.get = function (target) {
            return new TweenUtils(target);
        };
        Object.defineProperty(TweenUtils.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: false,
            configurable: true
        });
        // set update callback
        TweenUtils.prototype.setOnUpdate = function (callback) {
            this._updateFunc = callback;
        };
        // update
        TweenUtils.prototype.onUpdate = function (gt) {
            if (this._updateFunc) {
                this._updateFunc(gt);
            }
        };
        /**
         * 缓动对象的props属性到目标值。
         * @param	target 目标对象(即将更改属性值的对象)。
         * @param	props 变化的属性列表，比如
         * @param	duration 花费的时间，单位秒。
         * @param	ease 缓动类型，默认为匀速运动。
         * @param	complete 结束回调函数。
         * @param	delay 延迟执行时间。
         */
        TweenUtils.prototype.to = function (props, duration, ease, complete, delay) {
            if (ease === void 0) { ease = fgui.EaseType.QuadOut; }
            if (complete === void 0) { complete = null; }
            if (delay === void 0) { delay = 0; }
            this._steps.push({ props: props, duration: duration, ease: ease, complete: complete, delay: delay });
            this.trigger();
            return this;
        };
        TweenUtils.prototype.delay = function (delay) {
            this._steps.push({ delay: delay });
            return this;
        };
        TweenUtils.prototype.trigger = function () {
            if (!this._isPlaying) {
                if (this._steps && this._steps.length) {
                    var step = this._steps.shift();
                    if (step.hasOwnProperty('props')) {
                        this._isPlaying = true;
                        // Laya.Tween.to(this._target, step.props, step.duration, step.ease, step.complete, step.delay, step.coverBefore, step.autoRecover)
                        if (step.props['x'] != null || step.props['y'] != null) {
                            var x = step.props['x'] != null ? step.props.x : this._target.x;
                            var y = step.props['y'] != null ? step.props.y : this._target.y;
                            this._currentTweener = fgui.GTween.to2(this._target.x, this._target.y, x, y, step.duration).setTarget(this._target, this._target.setPosition).setEase(step.ease);
                        }
                        if (step.props['scaleX'] != null || step.props['scaleY'] != null) {
                            var x = step.props['scaleX'] != null ? step.props.scaleX : this._target.scaleX;
                            var y = step.props['scaleY'] != null ? step.props.scaleY : this._target.scaleY;
                            this._currentTweener = fgui.GTween.to2(this._target.scaleX, this._target.scaleY, x, y, step.duration).setTarget(this._target, this._target.setScale).setEase(step.ease);
                        }
                        if (step.props['rotation'] != null) {
                            var rotation = step.props['rotation'] != null ? step.props.rotation : this._target.rotation;
                            this._currentTweener = fgui.GTween.to(this._target.rotation, rotation, step.duration).setTarget(this._target, 'rotation').setEase(step.ease);
                        }
                        if (step.props['alpha'] != null) {
                            var alpha = step.props['alpha'] != null ? step.props.alpha : this._target.alpha;
                            this._currentTweener = fgui.GTween.to(this._target.alpha, alpha, step.duration).setTarget(this._target, 'alpha').setEase(step.ease);
                        }
                        this._stepCompleteHandler = step.complete;
                        fgui.GTween.delayedCall(step.duration + step.delay)
                            .onComplete(this.onStepComplete, this)
                            .setTarget(this);
                    }
                    else if (step.hasOwnProperty('delay')) {
                        this._isPlaying = true;
                        this._stepCompleteHandler = step.complete;
                        fgui.GTween.delayedCall(step.duration + step.delay)
                            .onComplete(this.onStepComplete, this)
                            .setTarget(this);
                    }
                }
            }
        };
        TweenUtils.prototype.onStepComplete = function (tweener) {
            var handler = this._stepCompleteHandler;
            if (handler) {
                if (!this._isPlaying || this._steps == null) {
                    handler.clear();
                    return;
                }
                if (handler) {
                    handler.runWith(null);
                }
                this._isPlaying = false;
            }
            this.trigger();
        };
        /**
         * 取消target所有的动画
         */
        TweenUtils.prototype.clear = function () {
            this._steps = null;
            this._isPlaying = false;
            fgui.GTween.kill(this._target, false);
            fgui.GTween.kill(this);
        };
        /**
         * 取消当前运行的tween
         */
        TweenUtils.prototype.cancel = function (doComplete) {
            if (doComplete === void 0) { doComplete = false; }
            this._steps = null;
            this._isPlaying = false;
            if (this._currentTweener != null) {
                fgui.GTween.kill(this._target, doComplete);
            }
            fgui.GTween.kill(this);
        };
        TweenUtils.scale = function (view) {
            this.get(view).to({ scaleX: 0.8, scaleY: 0.8 }, 0.05, fgui.EaseType.QuadIn).to({ scaleX: 1.0, scaleY: 1.0 }, 0.05, fgui.EaseType.QuadIn);
        };
        TweenUtils.appear = function (view) {
            view.setScale(0, 0);
            this.get(view).to({ scaleX: 1.2, scaleY: 1.2 }, 0.4, fgui.EaseType.QuadOut).to({ scaleX: 1.0, scaleY: 1.0 }, 0.2, fgui.EaseType.QuadOut);
        };
        return TweenUtils;
    }());
    airkit.TweenUtils = TweenUtils;
})(airkit || (airkit = {}));
/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:05:02
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/utils/UrlUtils.ts
 */
// import { StringUtils } from "./StringUtils";

(function (airkit) {
    /**
     * url工具类
     * @author ankye
     * @time 2018-7-16
     */
    var UrlUtils = /** @class */ (function () {
        function UrlUtils() {
        }
        /**获取文件扩展名*/
        UrlUtils.getFileExt = function (url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            var idx = url.lastIndexOf('.');
            if (idx >= 0) {
                return url.substr(idx + 1);
            }
            return airkit.StringUtils.empty;
        };
        /**获取不含扩展名的路径*/
        UrlUtils.getPathWithNoExtend = function (url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            var idx = url.lastIndexOf('.');
            if (idx >= 0) {
                return url.substr(0, idx);
            }
            return airkit.StringUtils.empty;
        };
        return UrlUtils;
    }());
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
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.buildRes = function (resMap) {
            var res = [];
            for (var k in resMap) {
                res.push({ url: 'ui/' + k, type: airkit.FGUIAsset, refCount: 1, pkg: k });
                for (var k2 in resMap[k]) {
                    res.push({ url: 'ui/' + k2, type: cc.BufferAsset, refCount: resMap[k][k2], pkg: k });
                }
            }
            return res;
        };
        /**打开外部链接 xxx */
        Utils.openURL = function (url) {
            window.location.href = url;
        };
        /**获取当前地址栏参数*/
        Utils.getLocationParams = function () {
            var url = window.location.href;
            var dic = new airkit.SDictionary();
            var num = url.indexOf('?');
            if (num >= 0) {
                url = url.substr(num + 1);
                var key = void 0, value = void 0;
                var arr = url.split('&');
                for (var i in arr) {
                    var str = arr[i];
                    num = str.indexOf('=');
                    key = str.substr(0, num);
                    value = str.substr(num + 1);
                    dic.add(key, value);
                }
            }
            return dic;
        };
        /**
         * object转成查询字符串
         * @param obj
         * @returns {string}
         */
        Utils.obj2query = function (obj) {
            if (!obj) {
                return '';
            }
            var arr = [];
            for (var key in obj) {
                arr.push(key + '=' + obj[key]);
            }
            return arr.join('&');
        };
        Utils.injectProp = function (target, data, callback, ignoreMethod, ignoreNull, keyBefore) {
            if (data === void 0) { data = null; }
            if (callback === void 0) { callback = null; }
            if (ignoreMethod === void 0) { ignoreMethod = true; }
            if (ignoreNull === void 0) { ignoreNull = true; }
            if (keyBefore === void 0) { keyBefore = ''; }
            if (!data) {
                return false;
            }
            var result = true;
            for (var key in data) {
                var value = data[key];
                if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)) {
                    if (callback) {
                        callback(target, key, value);
                    }
                    else {
                        target[key] = value;
                    }
                }
            }
            return result;
        };
        /**
         * 将字符串解析成 XML 对象。
         * @param value 需要解析的字符串。
         * @return js原生的XML对象。
         */
        Utils.parseXMLFromString = function (value) {
            var rst;
            value = value.replace(/>\s+</g, '><');
            rst = new DOMParser().parseFromString(value, 'text/xml');
            if (rst.firstChild.textContent.indexOf('This page contains the following errors') > -1) {
                throw new Error(rst.firstChild.firstChild.textContent);
            }
            return rst;
        };
        return Utils;
    }());
    airkit.Utils = Utils;
    /**
     * 位操作
     */
    var FlagUtils = /** @class */ (function () {
        function FlagUtils() {
        }
        FlagUtils.hasFlag = function (a, b) {
            a = airkit.NumberUtils.toInt(a);
            b = airkit.NumberUtils.toInt(b);
            return (a & b) == 0 ? false : true;
        };
        FlagUtils.insertFlag = function (a, b) {
            a = airkit.NumberUtils.toInt(a);
            b = airkit.NumberUtils.toInt(b);
            a |= b;
            return a;
        };
        FlagUtils.removeFlag = function (a, b) {
            a = airkit.NumberUtils.toInt(a);
            b = airkit.NumberUtils.toInt(b);
            a ^= b;
            return a;
        };
        return FlagUtils;
    }());
    airkit.FlagUtils = FlagUtils;
    /**
     * 断言
     */
    function assert(condition, msg) {
        if (!condition) {
            throw msg || 'assert';
        }
    }
    airkit.assert = assert;
    function assertNullOrNil(condition, msg) {
        if (condition == null || condition === null || typeof condition === 'undefined') {
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
        if (typeof x === 'undefined')
            return true;
        return false;
    }
    airkit.checkNullOrNil = checkNullOrNil;
    function checkEmptyDic(x) {
        if (checkNullOrNil(x))
            return true;
        if (JSON.stringify(x) == '{}') {
            return true;
        }
        return false;
    }
    airkit.checkEmptyDic = checkEmptyDic;
    //设置graphics图像alpha值
    function graphAlpha(g, alpha) {
        var gp = g.node.getComponent(cc.Graphics);
        var color = g.color;
        color.a = alpha * 255;
        gp.fillColor = color;
        gp.stroke();
        gp.fill();
    }
    airkit.graphAlpha = graphAlpha;
})(airkit || (airkit = {}));
// import { SDictionary } from "../collection/Dictionary";
// import { Log } from "../log/Log";

(function (airkit) {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */
    var ZipUtils = /** @class */ (function () {
        function ZipUtils() {
        }
        ZipUtils.unzip = function (ab) {
            var resultDic = {};
            return ZipUtils.parseZip(ab).then(function (zip) {
                var jszip = zip.jszip;
                var filelist = zip.filelist;
                var reqs = [];
                if (jszip && filelist) {
                    for (var i = 0; i < filelist.length; i++) {
                        reqs.push(ZipUtils.parseZipFile(jszip, filelist[i]));
                    }
                    return Promise.all(reqs).then(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            if (results[i] && results[i][1] != null) {
                                resultDic[results[i][0]] = results[i][1];
                            }
                            else {
                                airkit.Log.info('解析zip file:%s error', results[i][0]);
                            }
                        }
                        reqs = null;
                        results = null;
                        return resultDic;
                    });
                }
                zip = null;
                jszip = null;
                filelist = null;
                return resultDic;
            });
        };
        // public static unzip(ab: ArrayBuffer): Promise<any> {
        //     return new Promise((resolve, reject) => {
        //         let resultDic = {};
        //         ZipUtils.parseZip(ab)
        //             .then((zip) => {
        //                 let jszip = zip.jszip;
        //                 let filelist = zip.filelist;
        //                 if (jszip && filelist) {
        //                     let count = 0;
        //                     for (let i = 0; i < filelist.length; i++) {
        //                         ZipUtils.parseZipFile(jszip, filelist[i])
        //                             .then((content) => {
        //                                 count++;
        //                                 resultDic[filelist[i]] = content;
        //                                 if (count == filelist.length) {
        //                                     zip = null;
        //                                     jszip = null;
        //                                     filelist = null;
        //                                     resolve(resultDic);
        //                                 }
        //                             })
        //                             .catch((e) => {
        //                                 Log.error(e);
        //                                 reject(e);
        //                             });
        //                     }
        //                 }
        //             })
        //             .catch((e) => {
        //                 Log.error(e);
        //                 reject(e);
        //             });
        //     });
        // }
        ZipUtils.parseZip = function (ab) {
            var fileNameArr = new Array();
            return JSZip.loadAsync(ab)
                .then(function (jszip) {
                for (var fileName in jszip.files) {
                    fileNameArr.push(fileName);
                }
                return {
                    jszip: jszip,
                    filelist: fileNameArr,
                };
            })
                .catch(function (e) {
                airkit.Log.error(e);
                return null;
            });
        };
        ZipUtils.parseZipFile = function (jszip, filename) {
            return jszip
                .file(filename)
                .async('text')
                .then(function (content) {
                return [filename, content];
            })
                .catch(function (e) {
                airkit.Log.error(e);
                return [filename, null];
            });
        };
        return ZipUtils;
    }());
    airkit.ZipUtils = ZipUtils;
})(airkit || (airkit = {}));
