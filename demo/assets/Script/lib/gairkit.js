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

(function (airkit) {
    var Singleton = (function (_super) {
        __extends(Singleton, _super);
        function Singleton() {
            var _this = _super.call(this) || this;
            var clazz = _this["constructor"];
            if (!clazz) {
                airkit.Log.warning("浏览器不支持读取构造函数");
                return _this;
            }
            if (Singleton.classKeys.indexOf(clazz) != -1) {
                throw new Error(_this + " 只允许实例化一次！");
            }
            else {
                Singleton.classKeys.push(clazz);
                Singleton.classValues.push(_this);
            }
            return _this;
        }
        Singleton.classKeys = [];
        Singleton.classValues = [];
        return Singleton;
    }(cc.Node));
    airkit.Singleton = Singleton;
})(airkit || (airkit = {}));

(function (airkit) {
    var Framework = (function (_super) {
        __extends(Framework, _super);
        function Framework() {
            var _this = _super.call(this) || this;
            _this._isStopGame = false;
            _this._mainloopHandle = null;
            airkit.Timer.Start();
            return _this;
        }
        Object.defineProperty(Framework, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new Framework();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        Framework.prototype.setup = function (root, log_level, design_width, design_height, screen_mode, frame) {
            if (log_level === void 0) { log_level = airkit.LogLevel.INFO; }
            if (design_width === void 0) { design_width = 750; }
            if (design_height === void 0) { design_height = 1334; }
            if (screen_mode === void 0) { screen_mode = ""; }
            if (frame === void 0) { frame = 1; }
            this.printDeviceInfo();
            this._lastTimeMS = airkit.DateUtils.getNowMS();
            this._isStopGame = false;
            cc.view.setResizeCallback(function () {
                airkit.EventCenter.dispatchEvent(airkit.EventID.RESIZE);
            });
            airkit.Log.LEVEL = log_level;
            cc.director.getScheduler().scheduleUpdate(this, 0, false);
            airkit.LayerManager.setup(root);
            airkit.TimerManager.Instance.setup();
            airkit.UIManager.Instance.setup();
            airkit.ResourceManager.Instance.setup();
            airkit.DataProvider.Instance.setup();
            airkit.LangManager.Instance.init();
            airkit.SceneManager.Instance.setup();
            airkit.Mediator.Instance.setup();
            airkit.LoaderManager.Instance.setup();
        };
        Framework.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            airkit.Mediator.Instance.destroy();
            airkit.LoaderManager.Instance.destroy();
            airkit.TimerManager.Instance.destroy();
            airkit.UIManager.Instance.destroy();
            airkit.SceneManager.Instance.destroy();
            airkit.ResourceManager.Instance.destroy();
            airkit.DataProvider.Instance.destroy();
            airkit.LayerManager.destroy();
            airkit.LangManager.Instance.destory();
            return true;
        };
        Framework.prototype.update = function (dt) {
            if (!this._isStopGame) {
                var currentMS = airkit.DateUtils.getNowMS();
                var dt_1 = currentMS - this._lastTimeMS;
                this._lastTimeMS = currentMS;
                this.preTick(dt_1);
                this.tick(dt_1);
                this.endTick(dt_1);
            }
        };
        Framework.prototype.preTick = function (dt) {
            airkit.TimerManager.Instance.update(dt);
            airkit.UIManager.Instance.update(dt);
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
        Framework.prototype.pauseGame = function () {
            this._isStopGame = true;
            airkit.EventCenter.dispatchEvent(airkit.EventID.STOP_GAME, true);
        };
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
        Framework.prototype.printDeviceInfo = function () {
            if (navigator) {
                var agentStr = navigator.userAgent;
                var start = agentStr.indexOf("(");
                var end = agentStr.indexOf(")");
                if (start < 0 || end < 0 || end < start) {
                    return;
                }
                var infoStr = agentStr.substring(start + 1, end);
                airkit.Log.info(infoStr);
                var device = void 0, system = void 0, version = void 0;
                var infos = infoStr.split(";");
                if (infos.length == 3) {
                    device = infos[2];
                    var system_info = infos[1].split(" ");
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
        };
        Framework.instance = null;
        return Framework;
    }(airkit.Singleton));
    airkit.Framework = Framework;
})(airkit || (airkit = {}));

(function (airkit) {
    var Color = (function () {
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
            return (this.r == other.r &&
                this.g == other.g &&
                this.b == other.b &&
                this.a == other.a);
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
            return airkit.StringUtils.format("({0}, {1}, {2}, {3})", this.r, this.g, this.b, this.a);
        };
        return Color;
    }());
    airkit.Color = Color;
})(airkit || (airkit = {}));

(function (airkit) {
    var NDictionary = (function () {
        function NDictionary() {
            this._dic = {};
        }
        NDictionary.prototype.add = function (key, value) {
            if (this.containsKey(key)) {
                airkit.Log.warning("NDictionary already containsKey ", key.toString());
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
        NDictionary.prototype.containsKey = function (key) {
            return this._dic[key] != null ? true : false;
        };
        NDictionary.prototype.getValue = function (key) {
            if (!this.containsKey(key))
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
    var SDictionary = (function () {
        function SDictionary() {
            this._dic = {};
        }
        SDictionary.prototype.add = function (key, value) {
            if (this.containsKey(key))
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
        SDictionary.prototype.containsKey = function (key) {
            return this._dic[key] != null ? true : false;
        };
        SDictionary.prototype.getValue = function (key) {
            if (!this.containsKey(key))
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

(function (airkit) {
    var DoubleArray = (function () {
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

(function (airkit) {
    var LinkList = (function () {
        function LinkList() {
            this._linkHead = null;
            this._size = 0;
            this._linkHead = { Data: null, Prev: null, Next: null };
            this._linkHead.Prev = this._linkHead;
            this._linkHead.Next = this._linkHead;
            this._size = 0;
        }
        LinkList.prototype.add = function (t) {
            this.append(this._size, t);
        };
        LinkList.prototype.insert = function (index, t) {
            if (this._size < 1 || index >= this._size)
                airkit.Log.exception("没有可插入的点或者索引溢出了");
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
        LinkList.prototype.append = function (index, t) {
            var inode;
            if (index == 0)
                inode = this._linkHead;
            else {
                index = index - 1;
                if (index < 0)
                    airkit.Log.exception("位置不存在");
                inode = this.getNode(index);
            }
            var tnode = { Data: t, Prev: inode, Next: inode.Next };
            inode.Next.Prev = tnode;
            inode.Next = tnode;
            this._size++;
        };
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
        LinkList.prototype.getNode = function (index) {
            if (index < 0 || index >= this._size) {
                airkit.Log.exception("索引溢出或者链表为空");
            }
            if (index < this._size / 2) {
                var node = this._linkHead.Next;
                for (var i = 0; i < index; i++)
                    node = node.Next;
                return node;
            }
            var rnode = this._linkHead.Prev;
            var rindex = this._size - index - 1;
            for (var i = 0; i < rindex; i++)
                rnode = rnode.Prev;
            return rnode;
        };
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

(function (airkit) {
    var ObjectPools = (function () {
        function ObjectPools() {
        }
        ObjectPools.get = function (classDef) {
            var sign = classDef["objectKey"];
            if (sign == null) {
                airkit.Log.error("static objectKey must set in {0} ", classDef.name);
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
            if (obj && obj["init"])
                obj.init();
            return obj;
        };
        ObjectPools.recover = function (obj) {
            if (!obj)
                return;
            if (obj["parent"] != null) {
                obj.removeFromParent();
            }
            if (obj["dispose"] && obj["displayObject"] == null) {
                obj.dispose();
                return;
            }
            var proto = Object.getPrototypeOf(obj);
            var clazz = proto["constructor"];
            var sign = clazz["objectKey"];
            var pool = this.poolsMap[sign];
            if (pool != null) {
                if (obj["visible"] !== null && obj["visible"] === false) {
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
            airkit.Log.info("max object count {0}", pool.length);
            while (pool.length > 0) {
                var obj = pool.pop();
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
        };
        ObjectPools.poolsMap = {};
        return ObjectPools;
    }());
    airkit.ObjectPools = ObjectPools;
})(airkit || (airkit = {}));

(function (airkit) {
    var Queue = (function () {
        function Queue() {
            this._list = [];
        }
        Queue.prototype.enqueue = function (item) {
            this._list.push(item);
        };
        Queue.prototype.dequeue = function () {
            return this._list.shift();
        };
        Queue.prototype.peek = function () {
            if (this._list.length == 0)
                return null;
            return this._list[0];
        };
        Queue.prototype.seek = function (index) {
            if (this._list.length < index)
                return null;
            return this._list[index];
        };
        Queue.prototype.toArray = function () {
            return this._list.slice(0, this._list.length);
        };
        Queue.prototype.contains = function (item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        };
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

(function (airkit) {
    var Size = (function () {
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

(function (airkit) {
    var Stack = (function () {
        function Stack() {
            this._list = [];
        }
        Stack.prototype.push = function (item) {
            this._list.push(item);
        };
        Stack.prototype.pop = function () {
            return this._list.pop();
        };
        Stack.prototype.peek = function () {
            if (this._list.length == 0)
                return null;
            return this._list[this._list.length - 1];
        };
        Stack.prototype.toArray = function () {
            return this._list.slice(0, this._list.length);
        };
        Stack.prototype.contains = function (item) {
            return this._list.indexOf(item, 0) == -1 ? false : true;
        };
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

(function (airkit) {
    airkit.LOADVIEW_TYPE_NONE = 0;
    var eUIQueueType;
    (function (eUIQueueType) {
        eUIQueueType[eUIQueueType["POPUP"] = 1] = "POPUP";
        eUIQueueType[eUIQueueType["ALERT"] = 2] = "ALERT";
    })(eUIQueueType = airkit.eUIQueueType || (airkit.eUIQueueType = {}));
    var ePopupAnim;
    (function (ePopupAnim) {
    })(ePopupAnim = airkit.ePopupAnim || (airkit.ePopupAnim = {}));
    var eCloseAnim;
    (function (eCloseAnim) {
        eCloseAnim[eCloseAnim["CLOSE_CENTER"] = 1] = "CLOSE_CENTER";
    })(eCloseAnim = airkit.eCloseAnim || (airkit.eCloseAnim = {}));
    var eAligeType;
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
    var eUILayer;
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
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
        LogLevel[LogLevel["INFO"] = 6] = "INFO";
        LogLevel[LogLevel["WARNING"] = 5] = "WARNING";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["EXCEPTION"] = 3] = "EXCEPTION";
    })(LogLevel = airkit.LogLevel || (airkit.LogLevel = {}));
    var ePopupButton;
    (function (ePopupButton) {
        ePopupButton[ePopupButton["Close"] = 0] = "Close";
        ePopupButton[ePopupButton["Cancel"] = 1] = "Cancel";
        ePopupButton[ePopupButton["Ok"] = 2] = "Ok";
    })(ePopupButton = airkit.ePopupButton || (airkit.ePopupButton = {}));
})(airkit || (airkit = {}));

(function (airkit) {
    var ConfigItem = (function () {
        function ConfigItem(url, name, key) {
            this.url = url;
            this.name = name;
            this.key = key;
        }
        return ConfigItem;
    }());
    airkit.ConfigItem = ConfigItem;
})(airkit || (airkit = {}));

(function (airkit) {
    var ConfigManger = (function (_super) {
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
        ConfigManger.prototype.loadAll = function () {
            if (this._listTables.length > 0) {
                airkit.DataProvider.Instance.enableZip();
                return airkit.DataProvider.Instance.loadZip(ConfigManger.zipUrl, this._listTables);
            }
        };
        ConfigManger.prototype.getList = function (table, filter) {
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
                    var k = filter[j]["k"];
                    var v = filter[j]["v"];
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
            get: function () {
                return this._listTables;
            },
            enumerable: false,
            configurable: true
        });
        ConfigManger.instance = null;
        ConfigManger.zipUrl = "res/config.zip";
        return ConfigManger;
    }(airkit.Singleton));
    airkit.ConfigManger = ConfigManger;
})(airkit || (airkit = {}));

(function (airkit) {
    var DataProvider = (function (_super) {
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
            return new Promise(function (resolve, reject) {
                airkit.ResourceManager.Instance.loadRes(url, cc.BufferAsset).then(function (v) {
                    var ab = airkit.ResourceManager.Instance.getRes(url);
                    airkit.ZipUtils.unzip(ab)
                        .then(function (v) {
                        for (var i = 0; i < list.length; i++) {
                            var template = list[i];
                            _this._dicTemplate.add(list[i].url, template);
                            airkit.Log.info("Load config {0}", template.url);
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
                                            sValue += "_" + sData[template.key[i_2]];
                                        }
                                    }
                                    else {
                                        sValue = sData[template.key];
                                    }
                                    airkit.assertNullOrNil(sValue, "配置表解析错误:" + template.url);
                                    map[sValue] = sData;
                                    i_1++;
                                }
                                _this._dicData.add(template.name, map);
                            }
                        }
                        resolve(v);
                    })
                        .catch(function (e) {
                        airkit.Log.error(e);
                        reject(e);
                    });
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
                airkit.ResourceManager.Instance.loadArrayRes(assets, null, null, null, null, airkit.ResourceManager.SystemGroup)
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
                airkit.ResourceManager.Instance.clearRes(url);
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
        DataProvider.prototype.getConfig = function (table) {
            var data = this._dicData.getValue(table);
            return data;
        };
        DataProvider.prototype.getInfo = function (table, key) {
            var data = this._dicData.getValue(table);
            if (data) {
                var isArrayKey = Array.isArray(key);
                var sValue = void 0;
                if (isArrayKey) {
                    sValue = key[0];
                    for (var i = 1; i < key.length; i++) {
                        sValue += "_" + key[i];
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
            airkit.Log.debug("[load]加载配置表:" + url);
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
                                sValue += "_" + sData[template.key[i_3]];
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
    function stringToArrayBuffer(s) {
        var buffer = new ArrayBuffer(s.length);
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < s.length; ++i) {
            bytes[i] = s.charCodeAt(i);
        }
        return buffer;
    }
    airkit.stringToArrayBuffer = stringToArrayBuffer;
    var Base64 = (function () {
        function Base64() {
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
            }
            else if (index + 2 === array.byteLength) {
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
        };
        Base64.prototype.decode = function (string) {
            var size = string.length;
            if (size === 0) {
                return new Uint8Array(new ArrayBuffer(0));
            }
            if (size % 4 !== 0) {
                throw new Error("Bad length: " + size);
            }
            if (!string.match(/^[a-zA-Z0-9+/]+={0,2}$/)) {
                throw new Error("Invalid base64 encoded value");
            }
            var bytes = 3 * (size / 4);
            var numPad = 0;
            if (string.charAt(size - 1) === "=") {
                numPad++;
                bytes--;
            }
            if (string.charAt(size - 2) === "=") {
                numPad++;
                bytes--;
            }
            var buffer = new Uint8Array(new ArrayBuffer(bytes));
            var index = 0;
            var bufferIndex = 0;
            var quantum;
            if (numPad > 0) {
                size -= 4;
            }
            while (index < size) {
                quantum = 0;
                for (var i = 0; i < 4; ++i) {
                    quantum = (quantum << 6) | this.values[string.charAt(index + i)];
                }
                buffer[bufferIndex++] = (quantum >> 16) & 0xff;
                buffer[bufferIndex++] = (quantum >> 8) & 0xff;
                buffer[bufferIndex++] = quantum & 0xff;
                index += 4;
            }
            if (numPad > 0) {
                quantum = 0;
                for (var i = 0; i < 4 - numPad; ++i) {
                    quantum = (quantum << 6) | this.values[string.charAt(index + i)];
                }
                if (numPad === 1) {
                    quantum = quantum >> 2;
                    buffer[bufferIndex++] = (quantum >> 8) & 0xff;
                    buffer[bufferIndex++] = quantum & 0xff;
                }
                else {
                    quantum = quantum >> 4;
                    buffer[bufferIndex++] = quantum & 0xff;
                }
            }
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
    var MD5 = (function () {
        function MD5() {
            this.hexcase = 0;
            this.b64pad = "";
        }
        MD5.prototype.hex_md5 = function (s) {
            return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
        };
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
        MD5.prototype.md5_vm_test = function () {
            return (this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72");
        };
        MD5.prototype.rstr_md5 = function (s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
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
        MD5.prototype.rstr2hex = function (input) {
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
        };
        MD5.prototype.rstr2b64 = function (input) {
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
        };
        MD5.prototype.rstr2any = function (input, encoding) {
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
        };
        MD5.prototype.str2rstr_utf8 = function (input) {
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
        };
        MD5.prototype.str2rstr_utf16le = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xff, (input.charCodeAt(i) >>> 8) & 0xff);
            return output;
        };
        MD5.prototype.str2rstr_utf16be = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xff, input.charCodeAt(i) & 0xff);
            return output;
        };
        MD5.prototype.rstr2binl = function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
            return output;
        };
        MD5.prototype.binl2rstr = function (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
            return output;
        };
        MD5.prototype.binl_md5 = function (x, len) {
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
        MD5.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        };
        MD5.prototype.bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        return MD5;
    }());
    airkit.MD5 = MD5;
})(airkit || (airkit = {}));

(function (airkit) {
    var EventArgs = (function () {
        function EventArgs() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._type = "";
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

(function (airkit) {
    var EventCenter = (function (_super) {
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
        EventCenter.on = function (type, caller, fun) {
            EventCenter.Instance._event.on(type, caller, fun);
        };
        EventCenter.off = function (type, caller, fun) {
            EventCenter.Instance._event.off(type, caller, fun);
        };
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

(function (airkit) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this._dicFuns = {};
            this._evtArgs = null;
            this._evtArgs = new airkit.EventArgs();
        }
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

(function (airkit) {
    var Event = (function () {
        function Event() {
        }
        Event.PROGRESS = "progress";
        Event.COMPLETE = "complete";
        Event.ERROR = "error";
        return Event;
    }());
    airkit.Event = Event;
    var EventID = (function () {
        function EventID() {
        }
        EventID.BEGIN_GAME = "BEGIN_GAME";
        EventID.RESTART_GAEM = "RESTART_GAME";
        EventID.STOP_GAME = "STOP_GAME";
        EventID.PAUSE_GAME = "PAUSE_GAME";
        EventID.ON_SHOW = "ON_SHOW";
        EventID.ON_HIDE = "ON_HIDE";
        EventID.CHANGE_SCENE = "CHANGE_SCENE";
        EventID.RESIZE = "RESIZE";
        EventID.BEGIN_MODULE = "BEGIN_MODULE";
        EventID.END_MODULE = "END_MODULE";
        EventID.UI_OPEN = "UI_OPEN";
        EventID.UI_CLOSE = "UI_CLOSE";
        EventID.UI_LANG = "UI_LANG";
        return EventID;
    }());
    airkit.EventID = EventID;
    var LoaderEventID = (function () {
        function LoaderEventID() {
        }
        LoaderEventID.RESOURCE_LOAD_COMPLATE = "RESOURCE_LOAD_COMPLATE";
        LoaderEventID.RESOURCE_LOAD_PROGRESS = "RESOURCE_LOAD_PROGRESS";
        LoaderEventID.RESOURCE_LOAD_FAILED = "RESOURCE_LOAD_FAILED";
        LoaderEventID.LOADVIEW_OPEN = "LOADVIEW_OPEN";
        LoaderEventID.LOADVIEW_COMPLATE = "LOADVIEW_COMPLATE";
        LoaderEventID.LOADVIEW_PROGRESS = "LOADVIEW_PROGRESS";
        return LoaderEventID;
    }());
    airkit.LoaderEventID = LoaderEventID;
})(airkit || (airkit = {}));

(function (airkit) {
    var Signal = (function () {
        function Signal() {
        }
        Signal.prototype.destory = function () {
            this._listener && this._listener.destory();
            this._listener = null;
        };
        Signal.prototype.dispatch = function (arg) {
            if (this._listener)
                this._listener.execute(arg);
        };
        Signal.prototype.has = function (caller) {
            if (this._listener == null)
                return false;
            return this._listener.has(caller);
        };
        Signal.prototype.on = function (caller, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, false);
        };
        Signal.prototype.once = function (caller, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.makeSureListenerManager();
            this._listener.on(caller, method, args, true);
        };
        Signal.prototype.off = function (caller, method) {
            if (this._listener)
                this._listener.off(caller, method);
        };
        Signal.prototype.makeSureListenerManager = function () {
            if (!this._listener)
                this._listener = new SignalListener();
        };
        return Signal;
    }());
    airkit.Signal = Signal;
    var SignalListener = (function () {
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
            ++i;
            for (; i < this.handlers.length; ++i) {
                tempHandlers.push(this.handlers[i]);
            }
            this.handlers = tempHandlers;
        };
        SignalListener.prototype.offAll = function (caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            var temp = [];
            var handlers = this.handlers;
            var len = handlers.length;
            for (var i = 0; i < len; ++i) {
                if (caller !== handlers[i].caller || method !== handlers[i].method) {
                    temp.push(handlers[i]);
                }
                else {
                    handlers[i].recover();
                }
            }
            this.handlers = temp;
        };
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

(function (airkit) {
    function L(key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var str = LangManager.Instance.getText(LangManager.Instance.curLang, key);
        if (str == null)
            return "unknown key:" + key;
        return airkit.StringUtils.format.apply(airkit.StringUtils, __spreadArrays([str], args));
    }
    airkit.L = L;
    var LangManager = (function (_super) {
        __extends(LangManager, _super);
        function LangManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(LangManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new LangManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        LangManager.prototype.init = function () {
            this._curLang = null;
        };
        LangManager.prototype.destory = function () {
        };
        LangManager.prototype.changeLang = function (lang) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (lang == _this._curLang) {
                    resolve(lang);
                    return;
                }
                var data = airkit.ConfigManger.Instance.getList(_this._curLang);
                if (data) {
                    if (airkit.DataProvider.Instance.getConfig(lang)) {
                        _this._curLang = lang;
                        airkit.EventCenter.dispatchEvent(airkit.EventID.UI_LANG, _this._curLang);
                        resolve(lang);
                    }
                }
                else {
                    airkit.Log.error("no lang package {0} ", lang);
                    reject("no lang package " + lang);
                }
            });
        };
        LangManager.prototype.getText = function (lang, key) {
            var info = airkit.DataProvider.Instance.getInfo(lang, key);
            if (info) {
                return info["name"];
            }
            else {
                airkit.Log.error("cant get lang key", key);
                return "";
            }
        };
        Object.defineProperty(LangManager.prototype, "curLang", {
            get: function () {
                return this._curLang;
            },
            enumerable: false,
            configurable: true
        });
        LangManager.instance = null;
        return LangManager;
    }(airkit.Singleton));
    airkit.LangManager = LangManager;
})(airkit || (airkit = {}));

(function (airkit) {
    var LoaderManager = (function (_super) {
        __extends(LoaderManager, _super);
        function LoaderManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoaderManager.registerLoadingView = function (view_type, className, cls) {
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
            _super.prototype.destroy.call(this);
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
        LoaderManager.prototype.onLoadViewEvt = function (args) {
            var type = args.type;
            var viewType = args.get(0);
            switch (type) {
                case airkit.LoaderEventID.LOADVIEW_OPEN:
                    {
                        airkit.Log.debug("显示加载界面");
                        var total = args.get(1);
                        var tips = args.get(2);
                        this.show(viewType, total, tips);
                    }
                    break;
                case airkit.LoaderEventID.LOADVIEW_PROGRESS:
                    {
                        var cur = args.get(1);
                        var total = args.get(2);
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
        };
        LoaderManager.prototype.show = function (type, total, tips) {
            var _this = this;
            if (type == null || type == airkit.LOADVIEW_TYPE_NONE)
                return;
            var view = this._dicLoadView.getValue(type);
            if (!view) {
                var className = LoaderManager.loaders.getValue(type);
                if (className.length > 0) {
                    view = airkit.ClassUtils.getInstance(className);
                    if (view == null)
                        return;
                    view.setup([]);
                    var clas = airkit.ClassUtils.getClass(className);
                    view.loadResource(airkit.ResourceManager.SystemGroup, clas).then(function () {
                        airkit.LayerManager.loadingLayer.addChild(view);
                        _this._dicLoadView.add(type, view);
                        _this.updateView(view, total, tips);
                    });
                }
                else {
                    airkit.Log.error("Must set loadingview first type= {0}", type);
                }
            }
            else {
                this.updateView(view, total, tips);
            }
        };
        LoaderManager.prototype.updateView = function (view, total, tips) {
            if (!view.parent) {
                airkit.LayerManager.loadingLayer.addChild(view);
            }
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
            view.setVisible(false);
            view.onClose();
            this._dicLoadView.remove(type);
            view = null;
        };
        LoaderManager.loaders = new airkit.NDictionary();
        LoaderManager.instance = null;
        return LoaderManager;
    }(airkit.Singleton));
    airkit.LoaderManager = LoaderManager;
})(airkit || (airkit = {}));

(function (airkit) {
    airkit.FONT_SIZE_4 = 18;
    airkit.FONT_SIZE_5 = 22;
    airkit.FONT_SIZE_6 = 25;
    airkit.FONT_SIZE_7 = 29;
    var FguiAsset = (function (_super) {
        __extends(FguiAsset, _super);
        function FguiAsset() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FguiAsset;
    }(cc.BufferAsset));
    airkit.FguiAsset = FguiAsset;
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._dicResInfo = null;
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
            this._minLoaderTime = 1000;
        };
        ResourceManager.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._dicResInfo) {
                this._dicResInfo.foreach(function (k, v) {
                    ResourceManager.Instance.clearRes(k);
                    return true;
                });
                this._dicResInfo.clear();
                this._dicResInfo = null;
            }
            return true;
        };
        ResourceManager.prototype.update = function (dt) { };
        ResourceManager.prototype.getRes = function (url) {
            return cc.resources.get(url);
        };
        ResourceManager.prototype.loadRes = function (url, type, viewType, priority, cache, group, ignoreCache) {
            var _this = this;
            if (viewType === void 0) { viewType = airkit.LOADVIEW_TYPE_NONE; }
            if (priority === void 0) { priority = 1; }
            if (cache === void 0) { cache = true; }
            if (group === void 0) { group = "default"; }
            if (ignoreCache === void 0) { ignoreCache = false; }
            if (viewType == null)
                viewType = airkit.LOADVIEW_TYPE_NONE;
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                if (cc.resources.get(url))
                    viewType = airkit.LOADVIEW_TYPE_NONE;
            }
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_OPEN, viewType, 1);
            }
            return new Promise(function (resolve, reject) {
                cc.resources.load(url, type, function (completedCount, totalCount, item) {
                    _this.onLoadProgress(viewType, totalCount, "", completedCount / totalCount);
                }, function (error, resource) {
                    if (error) {
                        reject(url);
                        return;
                    }
                    _this.onLoadComplete(viewType, [url], [type], "");
                    resolve(url);
                });
            });
        };
        ResourceManager.prototype.loadArrayRes = function (arr_res, viewType, tips, priority, cache, group, ignoreCache) {
            var _this = this;
            if (viewType === void 0) { viewType = airkit.LOADVIEW_TYPE_NONE; }
            if (tips === void 0) { tips = null; }
            if (priority === void 0) { priority = 1; }
            if (cache === void 0) { cache = true; }
            if (group === void 0) { group = "default"; }
            if (ignoreCache === void 0) { ignoreCache = false; }
            var has_unload = false;
            var assets = [];
            var urls = [];
            var types = new Array();
            if (viewType == null)
                viewType = airkit.LOADVIEW_TYPE_NONE;
            if (priority == null)
                priority = 1;
            if (cache == null)
                cache = true;
            for (var _i = 0, arr_res_1 = arr_res; _i < arr_res_1.length; _i++) {
                var res = arr_res_1[_i];
                assets.push({ url: res.url, type: res.type });
                urls.push(res.url);
                types.push(res.type);
                if (!has_unload && !cc.resources.get(res.url))
                    has_unload = true;
            }
            if (!has_unload && viewType != airkit.LOADVIEW_TYPE_NONE) {
                viewType = airkit.LOADVIEW_TYPE_NONE;
            }
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_OPEN, viewType, assets.length, tips);
            }
            return new Promise(function (resolve, reject) {
                cc.resources.load(urls, function (completedCount, totalCount, item) {
                    _this.onLoadProgress(viewType, totalCount, tips, completedCount / totalCount);
                }, function (error, resource) {
                    if (error) {
                        reject(urls);
                        return;
                    }
                    if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                        airkit.TimerManager.Instance.addOnce(_this._minLoaderTime, null, function (v) {
                            _this.onLoadComplete(viewType, urls, types, tips);
                            resolve(urls);
                        });
                    }
                    else {
                        _this.onLoadComplete(viewType, urls, types, tips);
                        resolve(urls);
                    }
                });
            });
        };
        ResourceManager.prototype.onLoadComplete = function (viewType, urls, types, tips) {
            if (urls) {
                var arr = urls;
                for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
                    var url = arr_3[_i];
                    airkit.Log.debug("[load]加载完成url:" + url);
                    var i = url.lastIndexOf(".bin");
                    if (i > 0) {
                        var pkg = url.substr(0, i);
                        fgui.UIPackage.addPackage(pkg);
                        airkit.Log.info("add Package :" + pkg);
                    }
                    var loader_info = this._dicResInfo.getValue(url);
                    if (loader_info) {
                        loader_info.updateStatus(eLoaderStatus.LOADED);
                    }
                }
            }
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_COMPLATE, viewType);
            }
        };
        ResourceManager.prototype.onLoadProgress = function (viewType, total, tips, progress) {
            var cur = airkit.NumberUtils.toInt(Math.floor(progress * total));
            airkit.Log.debug("[load]进度: current={0} total={1}", cur, total);
            if (viewType != airkit.LOADVIEW_TYPE_NONE) {
                airkit.EventCenter.dispatchEvent(airkit.LoaderEventID.LOADVIEW_PROGRESS, viewType, cur, total, tips);
            }
        };
        ResourceManager.prototype.clearRes = function (url) {
            var res = this._dicResInfo.getValue(url);
            if (res) {
                res.decRef();
            }
        };
        ResourceManager.prototype.releaseRes = function (url) {
            this._dicResInfo.remove(url);
            cc.resources.release(url);
            airkit.Log.info("[res]释放资源:" + url);
        };
        ResourceManager.prototype.createFuiAnim = function (pkgName, resName, path, group) {
            if (group === void 0) { group = "default"; }
            return new Promise(function (resolve, reject) {
                var atlas = path + "_atlas0.png";
                var bin = path + ".bin";
                var res = ResourceManager.Instance.getRes(atlas);
                if (res == null) {
                    ResourceManager.Instance.loadArrayRes([
                        { url: atlas, type: cc.SpriteFrame },
                        { url: bin, type: cc.BufferAsset },
                    ], null, null, 0, true, group)
                        .then(function (v) {
                        var obj = fgui.UIPackage.createObject(pkgName, resName);
                        resolve(obj.asCom);
                    })
                        .catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    var obj = fgui.UIPackage.createObject(pkgName, resName);
                    resolve(obj.asCom);
                }
            });
        };
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
                    airkit.Log.info("imageProxy start load {0} ", res_1);
                    ResourceManager.Instance.loadRes(res_1)
                        .then(function (v) {
                        image.url = skin;
                        image.alpha = 0.1;
                        airkit.TweenUtils.get(image).to({ alpha: 1.0 }, 0.3);
                        airkit.Log.info("imageProxy start load done {0} ", res_1);
                    })
                        .catch(function (e) { return airkit.Log.error(e); });
                }
            });
        };
        ResourceManager.FONT_Yuanti = "Yuanti SC Regular";
        ResourceManager.Font_Helvetica = "Helvetica";
        ResourceManager.FONT_DEFAULT = "";
        ResourceManager.FONT_DEFAULT_SIZE = airkit.FONT_SIZE_5;
        ResourceManager.DefaultGroup = "airkit";
        ResourceManager.SystemGroup = "system";
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
    var ResInfo = (function (_super) {
        __extends(ResInfo, _super);
        function ResInfo(url, type, group) {
            var _this = _super.call(this) || this;
            _this.url = url;
            _this.ref = 0;
            _this.group = group;
            _this.status = eLoaderStatus.READY;
            return _this;
        }
        ResInfo.prototype.updateStatus = function (status) {
            this.status = status;
        };
        ResInfo.prototype.incRef = function () {
            this.ref++;
        };
        ResInfo.prototype.decRef = function () {
            this.ref--;
            if (this.ref <= 0) {
                ResourceManager.Instance.releaseRes(this.url);
            }
        };
        return ResInfo;
    }(airkit.EventDispatcher));
})(airkit || (airkit = {}));

(function (airkit) {
    var Log = (function () {
        function Log() {
        }
        Log.format = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (format == null)
                return "null";
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
                if (typeof format == "object" && format.message) {
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
            console.log(airkit.DateUtils.currentYMDHMS(), "[debug]", content);
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
            console.log(airkit.DateUtils.currentYMDHMS(), "[info]", content);
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
            console.warn(airkit.DateUtils.currentYMDHMS(), "[warn]", content);
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
            console.error(airkit.DateUtils.currentYMDHMS(), "[error]", content);
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
            console.exception(airkit.DateUtils.currentYMDHMS(), "[exce]", content);
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
            console.log(airkit.DateUtils.currentYMDHMS(), "[Dump]", value);
        };
        Log.LEVEL = airkit.LogLevel.INFO;
        return Log;
    }());
    airkit.Log = Log;
})(airkit || (airkit = {}));

(function (airkit) {
    var BaseModule = (function (_super) {
        __extends(BaseModule, _super);
        function BaseModule() {
            return _super.call(this) || this;
        }
        BaseModule.prototype.setup = function (args) {
            this.emit(airkit.EventID.BEGIN_MODULE, this.name);
            this.registerEvent();
        };
        BaseModule.prototype.start = function () { };
        BaseModule.prototype.update = function (dt) { };
        BaseModule.prototype.registerEvent = function () {
            this.registerSignalEvent();
        };
        BaseModule.prototype.unRegisterEvent = function () {
            this.unregisterSignalEvent();
        };
        BaseModule.res = function () {
            return null;
        };
        BaseModule.loaderTips = function () {
            return "资源加载中";
        };
        BaseModule.loaderType = function () {
            return airkit.LOADVIEW_TYPE_NONE;
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

(function (airkit) {
    var Mediator = (function () {
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
        Mediator.register = function (name, cls) {
            airkit.ClassUtils.regClass(name, cls);
        };
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
                        airkit.Log.warning("Cant find module {0}", name);
                        reject("Cant find module" + name);
                    }
                    _this.modules.add(name, m);
                    m.name = name;
                    _this.loadResource(m, clas)
                        .then(function (v) {
                        var onInitModuleOver = function () {
                            m.start();
                            if (funcName == null) {
                                resolve(m);
                            }
                            else {
                                var result = _this.callFunc(m, funcName, args);
                                resolve(result);
                            }
                        };
                        m.once(airkit.EventID.BEGIN_MODULE, onInitModuleOver, null);
                        m.setup(null);
                    })
                        .catch(function (e) {
                        airkit.Log.warning("Load module Resource Failed {0}", name);
                        reject("Load module Resource Failed " + name);
                    });
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
                airkit.Log.error("cant find funcName {0} from Module:{1}", funcName, m.name);
            }
            return result;
        };
        Mediator.loadResource = function (m, clas) {
            var assets = [];
            var res_map = clas.res();
            if (res_map && res_map.length > 0) {
                for (var i = 0; i < res_map.length; ++i) {
                    var res = res_map[i];
                    if (!airkit.ResourceManager.Instance.getRes(res[0])) {
                        assets.push({ url: res[0], type: res[1] });
                    }
                }
            }
            return new Promise(function (resolve, reject) {
                if (assets.length > 0) {
                    var load_view = clas.loaderType();
                    var tips = clas.loaderTips();
                    airkit.ResourceManager.Instance.loadArrayRes(assets, load_view, tips, 1, true, airkit.ResourceManager.DefaultGroup)
                        .then(function (v) {
                        resolve(v);
                    })
                        .catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    resolve([]);
                }
            });
        };
        Mediator.prototype.destroy = function () {
            this.unRegisterEvent();
            this.clear();
        };
        Mediator.prototype.clear = function () {
            if (Mediator.modules) {
                Mediator.modules.foreach(function (k, v) {
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

(function (airkit) {
    var eHttpRequestType;
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
    var Http = (function () {
        function Http() {
        }
        Http.request = function (url, method, reqType, header, data, responseType) {
            var _this = this;
            return new Promise(function (resolve, reject) {
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
                var key = "Content-Type";
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
                var request = new airkit.HttpRequest();
                request.http.timeout = airkit.HTTP_REQUEST_TIMEOUT;
                request.http.ontimeout = function () {
                    airkit.Log.error("request timeout {0}", url);
                    request.targetOff(request);
                    Http.currentRequsts--;
                    reject("timeout");
                };
                request.once(airkit.Event.COMPLETE, _this, function (event) {
                    var data;
                    switch (responseType) {
                        case airkit.RESPONSE_TYPE_TEXT:
                            data = request.data;
                            break;
                        case airkit.RESPONSE_TYPE_JSON:
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
                    airkit.Log.error("req:{0} error:{1}", url, event);
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
        Http.get = function (url, reqType, header, responseType) {
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            if (responseType == undefined) {
                responseType = airkit.RESPONSE_TYPE_TEXT;
            }
            return this.request(url, airkit.GET, reqType, header, null, responseType);
        };
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
    var HttpRequest = (function (_super) {
        __extends(HttpRequest, _super);
        function HttpRequest() {
            var _this_1 = _super !== null && _super.apply(this, arguments) || this;
            _this_1._http = new XMLHttpRequest();
            return _this_1;
        }
        HttpRequest.prototype.send = function (url, data, method, responseType, headers) {
            if (data === void 0) { data = null; }
            if (method === void 0) { method = "get"; }
            if (responseType === void 0) { responseType = "text"; }
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
                if (!data || typeof data == "string")
                    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                else {
                    http.setRequestHeader("Content-Type", "application/json");
                    isJson = true;
                }
            }
            var restype = responseType !== "arraybuffer" ? "text" : "arraybuffer";
            http.responseType = restype;
            if (http.dataType) {
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
        HttpRequest.prototype._onProgress = function (e) {
            if (e && e.lengthComputable)
                this.emit(airkit.Event.PROGRESS, e.loaded / e.total);
        };
        HttpRequest.prototype._onAbort = function (e) {
            this.error("Request was aborted by user");
        };
        HttpRequest.prototype._onError = function (e) {
            this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText);
        };
        HttpRequest.prototype._onLoad = function (e) {
            var http = this._http;
            var status = http.status !== undefined ? http.status : 200;
            if (status === 200 || status === 204 || status === 0) {
                this.complete();
            }
            else {
                this.error("[" + http.status + "]" + http.statusText + ":" + http.responseURL);
            }
        };
        HttpRequest.prototype.error = function (message) {
            this.clear();
            console.warn(this.url, message);
            this.emit(airkit.Event.ERROR, message);
        };
        HttpRequest.prototype.complete = function () {
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
        };
        HttpRequest.prototype.clear = function () {
            var http = this._http;
            http.onerror = http.onabort = http.onprogress = http.onload = null;
        };
        Object.defineProperty(HttpRequest.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "http", {
            get: function () {
                return this._http;
            },
            enumerable: false,
            configurable: true
        });
        HttpRequest._urlEncode = encodeURI;
        return HttpRequest;
    }(cc.Node));
    airkit.HttpRequest = HttpRequest;
})(airkit || (airkit = {}));

(function (airkit) {
    var State = (function () {
        function State(entity, status) {
            this._owner = null;
            this._status = 0;
            this._times = 0;
            this._tick = 0;
            this._entity = entity;
            this._status = status;
        }
        State.prototype.enter = function () {
            airkit.Log.info("you must overwrite the func state.enter !");
        };
        State.prototype.update = function (dt) {
            airkit.Log.info("you must overwrite the func state.update !");
        };
        State.prototype.exit = function () {
            airkit.Log.info("you must overwrite the func state.exit !");
        };
        return State;
    }());
    airkit.State = State;
})(airkit || (airkit = {}));

(function (airkit) {
    var StateMachine = (function () {
        function StateMachine() {
            this._currentState = null;
            this._previousState = null;
            this._globalState = null;
        }
        StateMachine.prototype.update = function (dt) {
            if (this._globalState) {
                this._globalState.update(dt);
            }
            if (this._currentState) {
                this._currentState.update(dt);
            }
        };
        StateMachine.prototype.changeState = function (_state) {
            this._previousState = this._currentState;
            this._currentState = _state;
            this._currentState._owner = this;
            if (this._previousState)
                this._previousState.exit();
            this._currentState.enter();
        };
        StateMachine.prototype.setCurrentState = function (_state) {
            if (this._currentState) {
                this._currentState.exit();
            }
            this._currentState = _state;
            this._currentState._owner = this;
            this._currentState.enter();
        };
        StateMachine.prototype.setGlobalState = function (_state) {
            if (this._globalState) {
                this._globalState.exit();
            }
            this._globalState = _state;
            this._globalState._owner = this;
            this._globalState.enter();
        };
        StateMachine.prototype.clearAllState = function () {
            if (this._globalState) {
                this._globalState.exit();
                this._globalState = null;
            }
            if (this._currentState) {
                this._currentState.exit();
                this._currentState = null;
            }
            this._previousState = null;
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
                return this._globalState;
            },
            enumerable: false,
            configurable: true
        });
        return StateMachine;
    }());
    airkit.StateMachine = StateMachine;
})(airkit || (airkit = {}));

(function (airkit) {
    var JSONMsg = (function () {
        function JSONMsg() {
        }
        JSONMsg.getSeq = function () {
            return JSONMsg.REQ_ID++;
        };
        JSONMsg.prototype.decode = function (msg, endian) {
            var str = airkit.bytes2String(msg, endian);
            var m = JSON.parse(str);
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
        };
        JSONMsg.prototype.encode = function (endian) {
            this.ID = JSONMsg.getSeq();
            var msg = {
                uid: this.uid,
                cmd: this.cmd,
                msgType: this.msgType,
                seq: this.ID,
                userdata: this.ID,
                payload: JSON.stringify(this.data),
            };
            return JSON.stringify(msg);
        };
        JSONMsg.prototype.getID = function () {
            return this.ID;
        };
        JSONMsg.REQ_ID = 1;
        return JSONMsg;
    }());
    airkit.JSONMsg = JSONMsg;
    var PBMsg = (function () {
        function PBMsg() {
            this.receiveByte = new airkit.Byte();
            this.receiveByte.endian = airkit.Byte.LITTLE_ENDIAN;
        }
        PBMsg.prototype.getID = function () {
            return this.ID;
        };
        PBMsg.prototype.decode = function (msg, endian) {
            this.receiveByte.clear();
            this.receiveByte.writeArrayBuffer(msg);
            this.receiveByte.pos = 0;
            var len = this.receiveByte.getInt16();
            var id = this.receiveByte.getInt16();
            if (this.receiveByte.bytesAvailable >= len) {
                var data = new airkit.Byte();
                data.writeArrayBuffer(this.receiveByte, 4, len);
                return true;
            }
            return false;
        };
        PBMsg.prototype.encode = function (endian) {
            var msg = new airkit.Byte();
            msg.endian = airkit.Byte.LITTLE_ENDIAN;
            msg.pos = 0;
            return msg;
        };
        return PBMsg;
    }());
    airkit.PBMsg = PBMsg;
})(airkit || (airkit = {}));

(function (airkit) {
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView() {
            var _this = _super.call(this) || this;
            _this._isOpen = false;
            _this._UIID = 0;
            _this.objectData = null;
            _this._destory = false;
            _this._viewID = BaseView.__ViewIDSeq++;
            return _this;
        }
        BaseView.prototype.createPanel = function (pkgName, resName) {
            var v = fgui.UIPackage.createObjectFromURL("ui://" + pkgName + "/" + resName);
            if (v == null)
                return;
            this._view = v.asCom;
            this._view.setSize(this.width, this.height);
            this._view.addRelation(this, fgui.RelationType.Width);
            this._view.addRelation(this, fgui.RelationType.Height);
            this.addChild(this._view);
        };
        BaseView.prototype.debug = function () {
            var bgColor = "#4aa7a688";
        };
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
        BaseView.prototype.dispose = function () {
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
            airkit.EventCenter.off(airkit.EventID.UI_LANG, this, this.onLangChange);
            _super.prototype.dispose.call(this);
        };
        BaseView.prototype.isDestory = function () {
            return this._destory;
        };
        BaseView.prototype.panel = function () {
            var panel = this.getGObject("panel");
            if (panel != null)
                return panel.asCom;
            return null;
        };
        BaseView.prototype.bg = function () {
            var view = this.getGObject("bg");
            if (view != null)
                return view.asCom;
            return null;
        };
        BaseView.prototype.setVisible = function (bVisible) {
            var old = this.visible;
            this.visible = bVisible;
        };
        BaseView.prototype.setUIID = function (id) {
            this._UIID = id;
        };
        Object.defineProperty(BaseView.prototype, "UIID", {
            get: function () {
                return this._UIID;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseView.prototype, "viewID", {
            get: function () {
                return this._viewID;
            },
            enumerable: false,
            configurable: true
        });
        BaseView.prototype.onCreate = function (args) { };
        BaseView.prototype.onDestroy = function () { };
        BaseView.prototype.update = function (dt) {
            return true;
        };
        BaseView.prototype.getGObject = function (name) {
            return this._view.getChild(name);
        };
        BaseView.prototype.onEnter = function () { };
        BaseView.prototype.onLangChange = function () { };
        BaseView.res = function () {
            return null;
        };
        BaseView.loaderTips = function () {
            return "资源加载中";
        };
        BaseView.loaderType = function () {
            return airkit.LOADVIEW_TYPE_NONE;
        };
        BaseView.prototype.signalMap = function () {
            return null;
        };
        BaseView.prototype.eventMap = function () {
            return null;
        };
        BaseView.prototype.registerEvent = function () { };
        BaseView.prototype.unRegisterEvent = function () { };
        BaseView.prototype.staticCacheUI = function () {
            return null;
        };
        BaseView.prototype.loadResource = function (group, clas) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var assets = [];
                var res_map = clas.res();
                if (res_map && res_map.length > 0) {
                    for (var i = 0; i < res_map.length; ++i) {
                        var res = res_map[i];
                        if (!airkit.ResourceManager.Instance.getRes(res[0])) {
                            assets.push({ url: res[0], type: res[1] });
                        }
                    }
                }
                if (assets.length > 0) {
                    var tips = clas.loaderTips();
                    var loaderType = clas.loaderType();
                    airkit.ResourceManager.Instance.loadArrayRes(assets, loaderType, tips, 1, true, group)
                        .then(function (v) {
                        _this.onAssetLoaded();
                        resolve(_this);
                        _this.onEnter();
                    })
                        .catch(function (e) {
                        airkit.Log.error(e);
                        reject(e);
                    });
                }
                else {
                    _this.onAssetLoaded();
                    resolve(_this);
                    _this.onEnter();
                }
            });
        };
        BaseView.prototype.onAssetLoaded = function () {
            if (!this._isOpen)
                return;
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
        BaseView.prototype.doClose = function () {
            if (this._isOpen === false) {
                airkit.Log.error("连续点击");
                return false;
            }
            this._isOpen = false;
            airkit.UIManager.Instance.close(this.UIID, airkit.eCloseAnim.CLOSE_CENTER);
            return true;
        };
        BaseView.__ViewIDSeq = 0;
        return BaseView;
    }(fgui.GComponent));
    airkit.BaseView = BaseView;
})(airkit || (airkit = {}));

(function (airkit) {
    var Layer = (function (_super) {
        __extends(Layer, _super);
        function Layer() {
            return _super.call(this) || this;
        }
        Layer.prototype.debug = function () {
            var bgColor = "#f4e1e188";
        };
        return Layer;
    }(fgui.GComponent));
    airkit.Layer = Layer;
    var LayerManager = (function (_super) {
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
            if (cc.winSize.width != layer.width ||
                cc.winSize.height != layer.height) {
                layer.width = cc.winSize.width;
                layer.height = cc.winSize.height;
            }
            return layer;
        };
        LayerManager.setup = function (root) {
            this._root = root;
            this._bgLayer = new Layer();
            this._bgLayer.node.name = "bgLayer";
            this._bgLayer.touchable = true;
            this._root.addChild(this._bgLayer);
            this._bgLayer.sortingOrder = 0;
            this._mainLayer = new Layer();
            this._mainLayer.node.name = "mainLayer";
            this._mainLayer.touchable = true;
            this._root.addChild(this._mainLayer);
            this._mainLayer.sortingOrder = 2;
            this._tooltipLayer = new Layer();
            this._tooltipLayer.node.name = "tooltipLayer";
            this._tooltipLayer.touchable = false;
            this._root.addChild(this._tooltipLayer);
            this._tooltipLayer.sortingOrder = 3;
            this._uiLayer = new Layer();
            this._uiLayer.node.name = "uiLayer";
            this._uiLayer.touchable = true;
            this._root.addChild(this._uiLayer);
            this._uiLayer.sortingOrder = 4;
            this._popupLayer = new Layer();
            this._popupLayer.node.name = "popupLayer";
            this._popupLayer.touchable = true;
            this._root.addChild(this._popupLayer);
            this._popupLayer.sortingOrder = 5;
            this._systemLayer = new Layer();
            this._systemLayer.node.name = "systemLayer";
            this._systemLayer.touchable = true;
            this._root.addChild(this._systemLayer);
            this._systemLayer.sortingOrder = 6;
            this._loadingLayer = new Layer();
            this._loadingLayer.node.name = "loadingLayer";
            this._loadingLayer.touchable = true;
            this._root.addChild(this._loadingLayer);
            this._loadingLayer.sortingOrder = 1001;
            this._topLayer = new Layer();
            this._topLayer.node.name = "topLayer";
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
                this._topLayer,
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
            airkit.Log.info("LayerManager Receive Resize {0} {1}", cc.winSize.width, cc.winSize.height);
            var i;
            var l;
            var w = cc.winSize.width;
            var h = cc.winSize.height;
            fgui.GRoot.inst.setSize(w, h);
            for (i = 0, l = this.layers.length; i < l; i++) {
                this.layers[i].setSize(w, h);
            }
            if (this._bgLayer.numChildren) {
                var bg = this._bgLayer.getChildAt(0);
                var x = (w - LayerManager.BG_WIDTH) >> 1;
                var y = h - LayerManager.BG_HEIGHT;
                bg.setPosition(x, y);
            }
            fgui.GRoot.inst.setSize(w, h);
            var needUpChilds = [
                this._uiLayer,
                this._popupLayer,
                this._systemLayer,
                this._topLayer,
                this._loadingLayer,
            ];
            for (var i_4 = 0; i_4 < needUpChilds.length; i_4++) {
                var layer = needUpChilds[i_4];
                for (var j = 0, l_1 = layer.numChildren; j < l_1; j++) {
                    var child = layer.getChildAt(j);
                    child.setSize(w, h);
                }
            }
        };
        LayerManager.destroy = function () {
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
        };
        LayerManager.removeAll = function () {
            airkit.DisplayUtils.removeAllChild(this._bgLayer);
            airkit.DisplayUtils.removeAllChild(this._mainLayer);
            airkit.DisplayUtils.removeAllChild(this._uiLayer);
            airkit.DisplayUtils.removeAllChild(this._popupLayer);
            airkit.DisplayUtils.removeAllChild(this._tooltipLayer);
            airkit.DisplayUtils.removeAllChild(this._systemLayer);
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
        Object.defineProperty(LayerManager, "popupLayer", {
            get: function () {
                return this._popupLayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "tooltipLayer", {
            get: function () {
                return this._tooltipLayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "systemLayer", {
            get: function () {
                return this._systemLayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "loadingLayer", {
            get: function () {
                return this._loadingLayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LayerManager, "topLayer", {
            get: function () {
                return this._topLayer;
            },
            enumerable: false,
            configurable: true
        });
        LayerManager.BG_WIDTH = 750;
        LayerManager.BG_HEIGHT = 1650;
        return LayerManager;
    }(airkit.Singleton));
    airkit.LayerManager = LayerManager;
})(airkit || (airkit = {}));

(function (airkit) {
    var PopupView = (function (_super) {
        __extends(PopupView, _super);
        function PopupView() {
            var _this = _super.call(this) || this;
            _this.bgTouch = true;
            return _this;
        }
        PopupView.prototype.update = function (dt) {
            return _super.prototype.update.call(this, dt);
        };
        PopupView.prototype.setup = function (args) {
            _super.prototype.setup.call(this, args);
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        };
        PopupView.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            this.createPanel(this.pkgName, this.resName);
            var panel = this.panel();
            if (panel) {
                airkit.DisplayUtils.popup(panel, airkit.Handler.create(this, this.onOpen));
                this.closeBtn = this.closeButton();
                if (this.closeBtn) {
                    this.closeBtn.visible = false;
                }
            }
            airkit.TimerManager.Instance.addOnce(250, this, this.setupTouchClose);
        };
        PopupView.prototype.onOpen = function () { };
        PopupView.prototype.closeButton = function () {
            var btn = this.panel().getChild("closeBtn");
            if (btn != null)
                return btn.asButton;
            return null;
        };
        PopupView.prototype.setupTouchClose = function () {
            var bg = this.bg();
            if (bg && this.bgTouch) {
                bg.touchable = true;
                bg.onClick(this.onClose, this);
            }
            if (this.closeBtn) {
                this.closeBtn.visible = true;
                this.closeBtn.onClick(this.pressClose, this);
            }
        };
        PopupView.prototype.pressClose = function () {
            if (this.closeBtn)
                airkit.TweenUtils.scale(this.closeBtn);
            this.onClose();
        };
        PopupView.prototype.onClose = function () {
            this.doClose();
        };
        PopupView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.callback != null)
                this.callback();
        };
        PopupView.prototype.loadResource = function (group, clas) {
            return _super.prototype.loadResource.call(this, group, clas);
        };
        return PopupView;
    }(airkit.BaseView));
    airkit.PopupView = PopupView;
})(airkit || (airkit = {}));

(function (airkit) {
    var SceneManager = (function () {
        function SceneManager() {
        }
        SceneManager.registerScene = function (scene_type, name, cls) {
            SceneManager.scenes.add(scene_type, name);
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
            airkit.Log.info("SceneManager Receive Resize {0} {1}", cc.winSize.width, cc.winSize.height);
            if (this._curScene) {
                this._curScene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
                var func = this._curScene["resize"];
                var result = null;
                if (func) {
                    result = func.apply(this._curScene);
                }
            }
        };
        SceneManager.prototype.onChangeScene = function (evt) {
            var info = evt.get(0);
            this.gotoScene(info);
        };
        SceneManager.prototype.onComplete = function (v) {
            this._curScene = v;
        };
        SceneManager.prototype.gotoScene = function (scene_type, args) {
            var _this = this;
            this.exitScene();
            var sceneName = SceneManager.scenes.getValue(scene_type);
            var clas = airkit.ClassUtils.getClass(sceneName);
            var scene = new clas();
            scene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            scene.setup(args);
            scene
                .loadResource(airkit.ResourceManager.DefaultGroup, clas)
                .then(function (v) {
                _this.onComplete(v);
            })
                .catch(function (e) {
                airkit.Log.error(e);
            });
            airkit.LayerManager.mainLayer.addChild(scene);
        };
        SceneManager.prototype.exitScene = function () {
            if (this._curScene) {
                this._curScene.removeFromParent();
                this._curScene.dispose();
                this._curScene = null;
                airkit.UIManager.Instance.closeAll();
                airkit.ObjectPools.clearAll();
            }
        };
        SceneManager.scenes = new airkit.NDictionary();
        SceneManager.instance = null;
        return SceneManager;
    }());
    airkit.SceneManager = SceneManager;
})(airkit || (airkit = {}));

(function (airkit) {
    var UIManager = (function (_super) {
        __extends(UIManager, _super);
        function UIManager() {
            var _this = _super.call(this) || this;
            _this._dicConfig = null;
            _this._dicUIView = null;
            _this._UIQueues = null;
            _this._dicConfig = new airkit.NDictionary();
            _this._dicUIView = new airkit.NDictionary();
            _this._UIQueues = new airkit.NDictionary();
            _this._UIQueues.add(airkit.eUIQueueType.POPUP, new UIQueue());
            _this._UIQueues.add(airkit.eUIQueueType.ALERT, new UIQueue());
            return _this;
        }
        Object.defineProperty(UIManager, "Instance", {
            get: function () {
                if (!this.instance)
                    this.instance = new UIManager();
                return this.instance;
            },
            enumerable: false,
            configurable: true
        });
        UIManager.prototype.empty = function () {
            var queue = this._UIQueues.getValue(airkit.eUIQueueType.POPUP);
            if (!queue.empty())
                return false;
            if (this._dicUIView.length > 0)
                return false;
            return true;
        };
        UIManager.prototype.show = function (id) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                airkit.Log.info("show panel {0}", id);
                var obj = _this._dicUIView.getValue(id);
                if (obj != null) {
                    if (obj["displayObject"] == null) {
                        _this._dicUIView.remove(id);
                        obj = null;
                    }
                    else {
                        obj.setVisible(true);
                        resolve(obj);
                        return;
                    }
                }
                var conf = _this._dicConfig.getValue(id);
                airkit.assert(conf != null, "UIManager::Show - not find id:" + conf.mID);
                var params = args.slice(0);
                var clas = airkit.ClassUtils.getClass(conf.name);
                var v = new clas();
                airkit.assert(v != null, "UIManager::Show - cannot create ui:" + id);
                v.setUIID(id);
                v.setup(params);
                v.loadResource(airkit.ResourceManager.DefaultGroup, clas)
                    .then(function (p) {
                    var layer = airkit.LayerManager.getLayer(conf.mLayer);
                    layer.addChild(p);
                    _this._dicUIView.add(id, p);
                    resolve(p);
                })
                    .catch(function (e) {
                    airkit.Log.error(e);
                });
            });
        };
        UIManager.prototype.close = function (id, animType) {
            var _this = this;
            if (animType === void 0) { animType = 0; }
            return new Promise(function (resolve, reject) {
                airkit.Log.info("close panel {0}", id);
                var loader_info = _this._dicConfig.getValue(id);
                airkit.assert(loader_info != null, "UIManager::Close - not find id:" + loader_info.mID);
                var panel = _this._dicUIView.getValue(id);
                if (!panel)
                    return;
                if (animType == 0) {
                    var result = _this.clearPanel(id, panel, loader_info);
                    resolve([id, result]);
                }
                else {
                    airkit.DisplayUtils.hide(panel, airkit.Handler.create(null, function (v) {
                        var result = _this.clearPanel(id, panel, loader_info);
                        resolve([id, result]);
                    }));
                }
            });
        };
        UIManager.prototype.clearPanel = function (id, panel, loader_info) {
            if (loader_info.mHideDestroy) {
                this._dicUIView.remove(id);
                airkit.Log.info("clear panel {0}", id);
                panel.removeFromParent();
                panel.dispose();
                return true;
            }
            else {
                panel.setVisible(false);
                return false;
            }
        };
        UIManager.prototype.closeAll = function (exclude_list) {
            if (exclude_list === void 0) { exclude_list = null; }
            this._dicUIView.foreach(function (key, value) {
                if (exclude_list && airkit.ArrayUtils.containsValue(exclude_list, key))
                    return true;
                UIManager.Instance.close(key);
                return true;
            });
        };
        UIManager.prototype.popup = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._UIQueues.getValue(airkit.eUIQueueType.POPUP).show(id, args);
        };
        UIManager.prototype.alert = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._UIQueues.getValue(airkit.eUIQueueType.ALERT).show(id, args);
        };
        UIManager.prototype.findPanel = function (id) {
            var panel = this._dicUIView.getValue(id);
            return panel;
        };
        UIManager.prototype.isPanelOpen = function (id) {
            var panel = this._dicUIView.getValue(id);
            if (panel)
                return true;
            else
                return false;
        };
        UIManager.prototype.tipsPopup = function (toastLayer, target, view, duration, fromProps, toProps, usePool) {
            if (duration === void 0) { duration = 0.5; }
            if (fromProps === void 0) { fromProps = null; }
            if (toProps === void 0) { toProps = null; }
            if (usePool === void 0) { usePool = true; }
            return new Promise(function (resolve, reject) {
                toastLayer.addChild(view);
                view.setScale(0.1, 0.1);
                var point = target.localToGlobal(target.width / 2.0 - target.pivotX * target.width, target.height * 0.382 - target.pivotY * target.height);
                var localPoint = toastLayer.globalToLocal(point.x, point.y);
                var start = 0;
                var offset = 600;
                var type = fgui.EaseType.BounceOut;
                if (duration > 1.5) {
                    start = toastLayer.height + 600;
                    offset = -600;
                    type = fgui.EaseType.QuadOut;
                    view.setPosition(localPoint.x, start);
                }
                else {
                    view.setPosition(localPoint.x, start - 200);
                }
                airkit.TweenUtils.get(view)
                    .delay(1.5)
                    .to({
                    scaleX: 1.0,
                    scaleY: 1.0,
                    alpha: 1.0,
                    x: localPoint.x,
                    y: localPoint.y,
                }, duration, type)
                    .delay(0.5)
                    .to({ x: localPoint.x, y: start - offset }, duration, fgui.EaseType.ExpoOut, airkit.Handler.create(null, function () {
                    view.removeFromParent();
                    resolve();
                }));
            });
        };
        UIManager.prototype.singleToast = function (toastLayer, target, view, duration, speedUp, usePool, x, y) {
            var _this = this;
            if (duration === void 0) { duration = 0.5; }
            if (usePool === void 0) { usePool = true; }
            if (x === void 0) { x = null; }
            if (y === void 0) { y = null; }
            return new Promise(function (resolve, reject) {
                var key = "_single_toast";
                if (target[key] == null) {
                    target[key] = [];
                }
                var inEase = fgui.EaseType.QuadOut;
                var outEase = fgui.EaseType.QuadIn;
                toastLayer.addChild(view);
                var k = airkit.ClassUtils.classKey(view);
                for (var i in target[key]) {
                    var o = target[key][i];
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
                var point = target.localToGlobal(x, y);
                var localPoint = toastLayer.globalToLocal(point.x, point.y);
                view.setPosition(localPoint.x, localPoint.y);
                view["toY"] = view.y;
                var tu = airkit.TweenUtils.get(view);
                tu.setOnUpdate(function (gt) {
                    var toY = view["toY"];
                    if (toY < view.y) {
                        var offset = (toY - view.y) * 0.4;
                        var limit = -5 - Math.ceil(view.height / 50);
                        if (offset < limit)
                            offset = limit;
                        view.y += offset;
                    }
                });
                var scale = 1.0;
                tu.to({ scaleX: scale, scaleY: scale, alpha: 1.0 }, duration, inEase).to({ alpha: 0.4 }, duration * 0.7, outEase, airkit.Handler.create(_this, function () {
                    target[key].splice(target[key].indexOf(view), 1);
                    if (target && view && view["parent"]) {
                        view.removeFromParent();
                        tu.clear();
                    }
                    if (usePool) {
                        airkit.ObjectPools.recover(view);
                    }
                    else {
                        view.dispose();
                    }
                    resolve();
                }));
            });
        };
        UIManager.prototype.toast = function (toastLayer, target, view, duration, speedUp, usePool, x, y) {
            var _this = this;
            if (duration === void 0) { duration = 0.5; }
            if (usePool === void 0) { usePool = true; }
            if (x === void 0) { x = null; }
            if (y === void 0) { y = null; }
            return new Promise(function (resolve, reject) {
                if (target["_toastList"] == null) {
                    target["_toastList"] = [];
                }
                var inEase = fgui.EaseType.QuadOut;
                var outEase = fgui.EaseType.QuadIn;
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
                }
                else {
                    for (var i in target["_toastList"]) {
                        if (target["_toastList"][i]) {
                            target["_toastList"][i]["toY"] -=
                                target["_toastList"][i].height + 8;
                        }
                    }
                }
                target["_toastList"].push(view);
                view.setScale(0.1, 0.1);
                if (x == null)
                    x = target.width / 2.0 - target.pivotX * target.width;
                if (y == null)
                    y = target.height * 0.382 - target.pivotY * target.height;
                var point = target.localToGlobal(x, y);
                var localPoint = toastLayer.globalToLocal(point.x, point.y);
                view.setPosition(localPoint.x, localPoint.y);
                view["toY"] = view.y;
                var tu = airkit.TweenUtils.get(view);
                tu.setOnUpdate(function (gt) {
                    var toY = view["toY"];
                    if (toY < view.y) {
                        var offset = (toY - view.y) * 0.4;
                        var limit = -8 - Math.ceil(view.height / 50);
                        if (offset < limit)
                            offset = limit;
                        view.y += offset;
                    }
                });
                var scale = speedUp ? 1.0 : 1.0;
                tu.to({ scaleX: scale, scaleY: scale, alpha: 1.0 }, duration, inEase).to({ alpha: 0.4 }, duration * 0.7, outEase, airkit.Handler.create(_this, function () {
                    target["_toastList"].splice(target["_toastList"].indexOf(view), 1);
                    if (target && view && view["parent"]) {
                        view.removeFromParent();
                        tu.clear();
                    }
                    if (usePool) {
                        airkit.ObjectPools.recover(view);
                    }
                    else {
                        view.dispose();
                    }
                    resolve();
                }));
            });
        };
        UIManager.prototype.setup = function () { };
        UIManager.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.closeAll();
            this.clearUIConfig();
            return true;
        };
        UIManager.prototype.update = function (dt) {
            this._dicUIView.foreach(function (key, value) {
                value.update(dt);
                return true;
            });
        };
        UIManager.prototype.addUIConfig = function (info) {
            if (this._dicConfig.containsKey(info.mID)) {
                airkit.Log.error("UIManager::Push UIConfig - same id is register:" + info.mID);
                return;
            }
            this._dicConfig.add(info.mID, info);
            airkit.ClassUtils.regClass(info.name, info.cls);
        };
        UIManager.prototype.clearUIConfig = function () {
            this._dicConfig.clear();
        };
        UIManager.prototype.getUIConfig = function (id) {
            return this._dicConfig.getValue(id);
        };
        UIManager.prototype.getUILayerID = function (id) {
            var info = this._dicConfig.getValue(id);
            if (!info) {
                return -1;
            }
            return info.mLayer;
        };
        UIManager.instance = null;
        return UIManager;
    }(airkit.Singleton));
    airkit.UIManager = UIManager;
    var AlertInfo = (function () {
        function AlertInfo(callback, title, content, tips, buttons, param) {
            if (title === void 0) { title = ""; }
            if (tips === void 0) { tips = ""; }
            if (buttons === void 0) { buttons = {}; }
            if (param === void 0) { param = null; }
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
        return AlertInfo;
    }());
    airkit.AlertInfo = AlertInfo;
    var UIConfig = (function () {
        function UIConfig(id, name, cls, layer, destroy, alige) {
            this.mID = id;
            this.name = name;
            this.cls = cls;
            this.mLayer = layer;
            this.mHideDestroy = destroy;
            this.mAlige = alige;
        }
        return UIConfig;
    }());
    airkit.UIConfig = UIConfig;
    var UIQueue = (function () {
        function UIQueue() {
            this._currentUI = 0;
            this._currentUI = 0;
            this._listPanels = new airkit.Queue();
        }
        UIQueue.prototype.show = function (id, args) {
            var info = [id, args];
            this._listPanels.enqueue(info);
            this.checkAlertNext();
        };
        UIQueue.prototype.empty = function () {
            if (this._currentUI > 0 || this._listPanels.length > 0)
                return false;
            return true;
        };
        UIQueue.prototype.checkAlertNext = function () {
            var _a;
            if (this._currentUI > 0 || this._listPanels.length <= 0)
                return;
            var info = this._listPanels.dequeue();
            this.registerEvent();
            this._currentUI = info[0];
            (_a = UIManager.Instance).show.apply(_a, __spreadArrays([info[0]], info[1]));
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
                    if (this._currentUI > 0 && this._currentUI == id) {
                        this._currentUI = 0;
                        this.unRegisterEvent();
                        this.checkAlertNext();
                    }
                    break;
            }
        };
        return UIQueue;
    }());
})(airkit || (airkit = {}));

(function (airkit) {
    var LocalDB = (function () {
        function LocalDB() {
        }
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
            return this._globalKey + "_" + key;
        };
        LocalDB._globalKey = "";
        return LocalDB;
    }());
    airkit.LocalDB = LocalDB;
})(airkit || (airkit = {}));

(function (airkit) {
    var IntervalTimer = (function () {
        function IntervalTimer() {
            this._nowTime = 0;
        }
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

(function (airkit) {
    var Timer = (function () {
        function Timer() {
        }
        Timer.Start = function () { };
        Object.defineProperty(Timer, "deltaTimeMS", {
            get: function () {
                return cc.director.getDeltaTime();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Timer, "fixedDeltaTime", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Timer, "frameCount", {
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

(function (airkit) {
    var TimerManager = (function (_super) {
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
            _super.prototype.destroy.call(this);
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
        TimerManager.prototype.addLoop = function (rate, ticks, caller, method, args) {
            if (args === void 0) { args = null; }
            if (ticks <= 0)
                ticks = 0;
            var timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            if (args != null)
                airkit.ArrayUtils.insert(args, this._idCounter, 0);
            var handler = airkit.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, ticks, handler);
            this._timers.push(timer);
            return timer.id;
        };
        TimerManager.prototype.addOnce = function (rate, caller, method, args) {
            if (args === void 0) { args = null; }
            var timer = airkit.ObjectPools.get(TimerObject);
            ++this._idCounter;
            if (args != null)
                airkit.ArrayUtils.insert(args, this._idCounter, 0);
            var handler = airkit.Handler.create(caller, method, args, false);
            timer.set(this._idCounter, rate, 1, handler);
            this._timers.push(timer);
            return timer.id;
        };
        TimerManager.prototype.removeTimer = function (timerId) {
            this._removalPending.push(timerId);
        };
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
        TimerManager.TIMER_OBJECT = "timerObject";
        TimerManager.instance = null;
        return TimerManager;
    }(airkit.Singleton));
    airkit.TimerManager = TimerManager;
    var TimerObject = (function () {
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
        TimerObject.prototype.set = function (id, rate, ticks, handle) {
            this.id = id;
            this.mRate = rate < 0 ? 0 : rate;
            this.mTicks = ticks < 0 ? 0 : ticks;
            this.handle = handle;
            this.mTicksElapsed = 0;
            this.isActive = true;
            this.mTime.init(this.mRate, false);
        };
        TimerObject.prototype.update = function (dt) {
            if (this.isActive && this.mTime.update(airkit.Timer.deltaTimeMS)) {
                if (this.handle != null)
                    this.handle.run();
                this.mTicksElapsed++;
                if (this.mTicks > 0 && this.mTicks == this.mTicksElapsed) {
                    this.isActive = false;
                }
            }
        };
        TimerObject.objectKey = "TimerObject";
        return TimerObject;
    }());
    airkit.TimerObject = TimerObject;
})(airkit || (airkit = {}));

(function (airkit) {
    var eArraySortOrder;
    (function (eArraySortOrder) {
        eArraySortOrder[eArraySortOrder["ASCENDING"] = 0] = "ASCENDING";
        eArraySortOrder[eArraySortOrder["DESCENDING"] = 1] = "DESCENDING";
    })(eArraySortOrder = airkit.eArraySortOrder || (airkit.eArraySortOrder = {}));
    var ArrayUtils = (function () {
        function ArrayUtils() {
        }
        ArrayUtils.insert = function (arr, value, index) {
            if (index > arr.length - 1) {
                arr.push(value);
            }
            else {
                arr.splice(index, 0, value);
            }
        };
        ArrayUtils.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
        ArrayUtils.equip = function (arr, v) {
            if (!arr || !v)
                return false;
            if (arr.length != v.length)
                return false;
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] instanceof Array && v[i] instanceof Array) {
                    if (!arr[i].equals(v[i]))
                        return false;
                }
                else if (arr[i] != v[i]) {
                    return false;
                }
            }
            return true;
        };
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
        ArrayUtils.removeAllValue = function (arr, v) {
            var i = arr.indexOf(v);
            while (i >= 0) {
                arr.splice(i, 1);
                i = arr.indexOf(v);
            }
        };
        ArrayUtils.containsValue = function (arr, v) {
            return arr.length > 0 ? arr.indexOf(v) != -1 : false;
        };
        ArrayUtils.copy = function (arr) {
            return JSON.parse(JSON.stringify(arr));
        };
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
        ArrayUtils.clear = function (arr) {
            var i = 0;
            var len = arr.length;
            for (i = 0; i < len; ++i) {
                arr[i] = null;
            }
            arr.splice(0);
        };
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
    var Byte = (function () {
        function Byte(data) {
            if (data === void 0) { data = null; }
            this._xd_ = true;
            this._allocated_ = 8;
            this._pos_ = 0;
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
        Byte.getSystemEndian = function () {
            if (!Byte._sysEndian) {
                var buffer = new ArrayBuffer(2);
                new DataView(buffer).setInt16(0, 256, true);
                Byte._sysEndian = new Int16Array(buffer)[0] === 256 ? Byte.LITTLE_ENDIAN : Byte.BIG_ENDIAN;
            }
            return Byte._sysEndian;
        };
        Object.defineProperty(Byte.prototype, "buffer", {
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
                throw "Invalid typed array length:" + len;
            }
        };
        Byte.prototype.getString = function () {
            return this.readString();
        };
        Byte.prototype.readString = function () {
            return this._rUTF(this.getUint16());
        };
        Byte.prototype.getFloat32Array = function (start, len) {
            return this.readFloat32Array(start, len);
        };
        Byte.prototype.readFloat32Array = function (start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Float32Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        };
        Byte.prototype.getUint8Array = function (start, len) {
            return this.readUint8Array(start, len);
        };
        Byte.prototype.readUint8Array = function (start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Uint8Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        };
        Byte.prototype.getInt16Array = function (start, len) {
            return this.readInt16Array(start, len);
        };
        Byte.prototype.readInt16Array = function (start, len) {
            var end = start + len;
            end = end > this._length ? this._length : end;
            var v = new Int16Array(this._d_.buffer.slice(start, end));
            this._pos_ = end;
            return v;
        };
        Byte.prototype.getFloat32 = function () {
            return this.readFloat32();
        };
        Byte.prototype.readFloat32 = function () {
            if (this._pos_ + 4 > this._length)
                throw "getFloat32 error - Out of bounds";
            var v = this._d_.getFloat32(this._pos_, this._xd_);
            this._pos_ += 4;
            return v;
        };
        Byte.prototype.getFloat64 = function () {
            return this.readFloat64();
        };
        Byte.prototype.readFloat64 = function () {
            if (this._pos_ + 8 > this._length)
                throw "getFloat64 error - Out of bounds";
            var v = this._d_.getFloat64(this._pos_, this._xd_);
            this._pos_ += 8;
            return v;
        };
        Byte.prototype.writeFloat32 = function (value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setFloat32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        };
        Byte.prototype.writeFloat64 = function (value) {
            this._ensureWrite(this._pos_ + 8);
            this._d_.setFloat64(this._pos_, value, this._xd_);
            this._pos_ += 8;
        };
        Byte.prototype.getInt32 = function () {
            return this.readInt32();
        };
        Byte.prototype.readInt32 = function () {
            if (this._pos_ + 4 > this._length)
                throw "getInt32 error - Out of bounds";
            var float = this._d_.getInt32(this._pos_, this._xd_);
            this._pos_ += 4;
            return float;
        };
        Byte.prototype.getUint32 = function () {
            return this.readUint32();
        };
        Byte.prototype.readUint32 = function () {
            if (this._pos_ + 4 > this._length)
                throw "getUint32 error - Out of bounds";
            var v = this._d_.getUint32(this._pos_, this._xd_);
            this._pos_ += 4;
            return v;
        };
        Byte.prototype.writeInt32 = function (value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setInt32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        };
        Byte.prototype.writeUint32 = function (value) {
            this._ensureWrite(this._pos_ + 4);
            this._d_.setUint32(this._pos_, value, this._xd_);
            this._pos_ += 4;
        };
        Byte.prototype.getInt16 = function () {
            return this.readInt16();
        };
        Byte.prototype.readInt16 = function () {
            if (this._pos_ + 2 > this._length)
                throw "getInt16 error - Out of bounds";
            var us = this._d_.getInt16(this._pos_, this._xd_);
            this._pos_ += 2;
            return us;
        };
        Byte.prototype.getUint16 = function () {
            return this.readUint16();
        };
        Byte.prototype.readUint16 = function () {
            if (this._pos_ + 2 > this._length)
                throw "getUint16 error - Out of bounds";
            var us = this._d_.getUint16(this._pos_, this._xd_);
            this._pos_ += 2;
            return us;
        };
        Byte.prototype.writeUint16 = function (value) {
            this._ensureWrite(this._pos_ + 2);
            this._d_.setUint16(this._pos_, value, this._xd_);
            this._pos_ += 2;
        };
        Byte.prototype.writeInt16 = function (value) {
            this._ensureWrite(this._pos_ + 2);
            this._d_.setInt16(this._pos_, value, this._xd_);
            this._pos_ += 2;
        };
        Byte.prototype.getUint8 = function () {
            return this.readUint8();
        };
        Byte.prototype.readUint8 = function () {
            if (this._pos_ + 1 > this._length)
                throw "getUint8 error - Out of bounds";
            return this._u8d_[this._pos_++];
        };
        Byte.prototype.writeUint8 = function (value) {
            this._ensureWrite(this._pos_ + 1);
            this._d_.setUint8(this._pos_, value);
            this._pos_++;
        };
        Byte.prototype._getUInt8 = function (pos) {
            return this._readUInt8(pos);
        };
        Byte.prototype._readUInt8 = function (pos) {
            return this._d_.getUint8(pos);
        };
        Byte.prototype._getUint16 = function (pos) {
            return this._readUint16(pos);
        };
        Byte.prototype._readUint16 = function (pos) {
            return this._d_.getUint16(pos, this._xd_);
        };
        Byte.prototype._rUTF = function (len) {
            var v = "", max = this._pos_ + len, c, c2, c3, f = String.fromCharCode;
            var u = this._u8d_, i = 0;
            var strs = [];
            var n = 0;
            strs.length = 1000;
            while (this._pos_ < max) {
                c = u[this._pos_++];
                if (c < 0x80) {
                    if (c != 0)
                        strs[n++] = f(c);
                }
                else if (c < 0xe0) {
                    strs[n++] = f(((c & 0x3f) << 6) | (u[this._pos_++] & 0x7f));
                }
                else if (c < 0xf0) {
                    c2 = u[this._pos_++];
                    strs[n++] = f(((c & 0x1f) << 12) | ((c2 & 0x7f) << 6) | (u[this._pos_++] & 0x7f));
                }
                else {
                    c2 = u[this._pos_++];
                    c3 = u[this._pos_++];
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
            return strs.join("");
        };
        Byte.prototype.getCustomString = function (len) {
            return this.readCustomString(len);
        };
        Byte.prototype.readCustomString = function (len) {
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
        };
        Object.defineProperty(Byte.prototype, "pos", {
            get: function () {
                return this._pos_;
            },
            set: function (value) {
                this._pos_ = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Byte.prototype, "bytesAvailable", {
            get: function () {
                return this._length - this._pos_;
            },
            enumerable: false,
            configurable: true
        });
        Byte.prototype.clear = function () {
            this._pos_ = 0;
            this.length = 0;
        };
        Byte.prototype.__getBuffer = function () {
            return this._d_.buffer;
        };
        Byte.prototype.writeUTFBytes = function (value) {
            value = value + "";
            for (var i = 0, sz = value.length; i < sz; i++) {
                var c = value.charCodeAt(i);
                if (c <= 0x7f) {
                    this.writeByte(c);
                }
                else if (c <= 0x7ff) {
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
        Byte.prototype.writeUTFString = function (value) {
            var tPos = this.pos;
            this.writeUint16(1);
            this.writeUTFBytes(value);
            var dPos = this.pos - tPos - 2;
            this._d_.setUint16(tPos, dPos, this._xd_);
        };
        Byte.prototype.readUTFString = function () {
            return this.readUTFBytes(this.getUint16());
        };
        Byte.prototype.getUTFString = function () {
            return this.readUTFString();
        };
        Byte.prototype.readUTFBytes = function (len) {
            if (len === void 0) { len = -1; }
            if (len === 0)
                return "";
            var lastBytes = this.bytesAvailable;
            if (len > lastBytes)
                throw "readUTFBytes error - Out of bounds";
            len = len > 0 ? len : lastBytes;
            return this._rUTF(len);
        };
        Byte.prototype.getUTFBytes = function (len) {
            if (len === void 0) { len = -1; }
            return this.readUTFBytes(len);
        };
        Byte.prototype.writeByte = function (value) {
            this._ensureWrite(this._pos_ + 1);
            this._d_.setInt8(this._pos_, value);
            this._pos_ += 1;
        };
        Byte.prototype.readByte = function () {
            if (this._pos_ + 1 > this._length)
                throw "readByte error - Out of bounds";
            return this._d_.getInt8(this._pos_++);
        };
        Byte.prototype.getByte = function () {
            return this.readByte();
        };
        Byte.prototype._ensureWrite = function (lengthToEnsure) {
            if (this._length < lengthToEnsure)
                this._length = lengthToEnsure;
            if (this._allocated_ < lengthToEnsure)
                this.length = lengthToEnsure;
        };
        Byte.prototype.writeArrayBuffer = function (arraybuffer, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (offset < 0 || length < 0)
                throw "writeArrayBuffer error - Out of bounds";
            if (length == 0)
                length = arraybuffer.byteLength - offset;
            this._ensureWrite(this._pos_ + length);
            var uint8array = new Uint8Array(arraybuffer);
            this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
            this._pos_ += length;
        };
        Byte.prototype.readArrayBuffer = function (length) {
            var rst;
            rst = this._u8d_.buffer.slice(this._pos_, this._pos_ + length);
            this._pos_ = this._pos_ + length;
            return rst;
        };
        Byte.BIG_ENDIAN = "bigEndian";
        Byte.LITTLE_ENDIAN = "littleEndian";
        Byte._sysEndian = null;
        return Byte;
    }());
    airkit.Byte = Byte;
})(airkit || (airkit = {}));

(function (airkit) {
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
    var ClassUtils = (function () {
        function ClassUtils() {
        }
        ClassUtils.regClass = function (className, classDef) {
            ClassUtils._classMap[className] = classDef;
        };
        ClassUtils.regShortClassName = function (classes) {
            for (var i = 0; i < classes.length; i++) {
                var classDef = classes[i];
                var className = classDef.name;
                ClassUtils._classMap[className] = classDef;
            }
        };
        ClassUtils.getRegClass = function (className) {
            return ClassUtils._classMap[className];
        };
        ClassUtils.getClass = function (className) {
            var classObject = ClassUtils._classMap[className] || ClassUtils._classMap["cc." + className] || className;
            return classObject;
        };
        ClassUtils.getInstance = function (className) {
            var compClass = ClassUtils.getClass(className);
            if (compClass)
                return new compClass();
            else
                console.warn("[error] Undefined class:", className);
            return null;
        };
        ClassUtils.copyObject = function (obj) {
            var js = JSON.stringify(obj);
            return JSON.parse(js);
        };
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
                airkit.Log.error("cant find funcName {0} from Module:{1}", funcName, obj.name);
            }
            return result;
        };
        ClassUtils.classKey = function (obj) {
            var proto = Object.getPrototypeOf(obj);
            var clazz = proto["constructor"];
            var sign = clazz["objectKey"];
            return sign;
        };
        ClassUtils._classMap = {};
        return ClassUtils;
    }());
    airkit.ClassUtils = ClassUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var DateUtils = (function () {
        function DateUtils() {
        }
        DateUtils.setServerTime = function (time) {
            this.serverTime = time;
            this.serverTimeDiff = Date.now() - time;
        };
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
        DateUtils.formatDateTime = function (timeValue) {
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
        };
        DateUtils.countdown = function (time, format) {
            if (format === void 0) { format = "D天H时M分S秒"; }
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
            if (format === void 0) { format = "{0}:{1}:{2}"; }
            var s = Math.max(0, time);
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            return airkit.StringUtils.format(format, h < 10 ? "0" + h : h, m < 10 ? "0" + m : m, s < 10 ? "0" + s : s);
        };
        DateUtils.format2Time = function (time) {
            var format = "{0}:{1}";
            var s = Math.max(0, time);
            var d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return airkit.StringUtils.format("{0}天", d);
            }
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            var M = m < 10 ? "0" + m : m;
            var H = h < 10 ? "0" + h : h;
            var S = s < 10 ? "0" + s : s;
            if (h > 0) {
                return airkit.StringUtils.format(format, H, M);
            }
            else {
                format = format.replace(":", "’");
                return airkit.StringUtils.format(format, M, S);
            }
        };
        DateUtils.format2Time2 = function (time) {
            var format = "{0}:{1}";
            var s = Math.max(0, time);
            var d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return airkit.StringUtils.format("{0}天", d);
            }
            var h = Math.floor((s / 3600) % 24);
            var m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            var M = m < 10 ? "0" + m : m;
            var H = h < 10 ? "0" + h : h;
            var S = s < 10 ? "0" + s : s;
            if (h > 0) {
                return airkit.StringUtils.format(format, H, M);
            }
            else {
                format = format.replace(":", "’");
                return airkit.StringUtils.format(format, M, S);
            }
        };
        DateUtils.serverTimeDiff = 0;
        DateUtils.serverTime = 0;
        return DateUtils;
    }());
    airkit.DateUtils = DateUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var DicUtils = (function () {
        function DicUtils() {
        }
        DicUtils.getKeys = function (d) {
            var a = [];
            for (var key in d) {
                a.push(key);
            }
            return a;
        };
        DicUtils.getValues = function (d) {
            var a = [];
            for (var key in d) {
                a.push(d[key]);
            }
            return a;
        };
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
            Object.assign(obj, dic);
        };
        return DicUtils;
    }());
    airkit.DicUtils = DicUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    function displayWidth() {
        return cc.winSize.width;
    }
    airkit.displayWidth = displayWidth;
    function displayHeight() {
        return cc.winSize.height;
    }
    airkit.displayHeight = displayHeight;
    var DisplayUtils = (function () {
        function DisplayUtils() {
        }
        DisplayUtils.removeAllChild = function (container) {
            if (!container)
                return;
            if (container.numChildren <= 0)
                return;
            while (container.numChildren > 0) {
                var node = container.removeChildAt(0);
                if (node) {
                    var cons = node["constructor"];
                    if (cons["name"] == "Animation") {
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
            if (view.parent && view.parent.getChild("bg")) {
                var bg = view.parent.getChild("bg");
                bg.alpha = 0;
                airkit.TweenUtils.get(bg).to({ alpha: 1.0 }, 0.25, fgui.EaseType.QuadOut);
            }
        };
        DisplayUtils.hide = function (panel, handler) {
            var time = 0.2;
            var view = panel.panel();
            var bg = panel.bg();
            if (view == null) {
                if (handler) {
                    handler.run();
                }
            }
            else {
                airkit.TweenUtils.get(view).to({ scaleX: 0.5, scaleY: 0.5 }, time, fgui.EaseType.BackIn, handler);
                if (bg) {
                    airkit.TweenUtils.get(bg).to({ alpha: 0 }, 0.2, fgui.EaseType.QuadOut);
                }
            }
        };
        return DisplayUtils;
    }());
    airkit.DisplayUtils = DisplayUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var Handler = (function () {
        function Handler(caller, method, args, once) {
            if (caller === void 0) { caller = null; }
            if (method === void 0) { method = null; }
            if (args === void 0) { args = null; }
            if (once === void 0) { once = false; }
            this.once = false;
            this._id = 0;
            this.setTo(caller, method, args, once);
        }
        Handler.prototype.setTo = function (caller, method, args, once) {
            if (once === void 0) { once = false; }
            this._id = Handler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
            return this;
        };
        Handler.prototype.run = function () {
            if (this.method == null)
                return null;
            var id = this._id;
            var result = this.method.apply(this.caller, this.args);
            this._id === id && this.once && this.recover();
            return result;
        };
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
        Handler.prototype.clear = function () {
            this.caller = null;
            this.method = null;
            this.args = null;
            return this;
        };
        Handler.prototype.recover = function () {
            if (this._id > 0) {
                this._id = 0;
                Handler._pool.push(this.clear());
            }
        };
        Handler.create = function (caller, method, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = true; }
            if (Handler._pool.length)
                return Handler._pool.pop().setTo(caller, method, args, once);
            return new Handler(caller, method, args, once);
        };
        Handler._pool = [];
        Handler._gid = 1;
        return Handler;
    }());
    airkit.Handler = Handler;
})(airkit || (airkit = {}));

(function (airkit) {
    var OrbitType;
    (function (OrbitType) {
        OrbitType[OrbitType["Line"] = 3] = "Line";
        OrbitType[OrbitType["Curve"] = 2] = "Curve";
    })(OrbitType = airkit.OrbitType || (airkit.OrbitType = {}));
    var MathUtils = (function () {
        function MathUtils() {
        }
        MathUtils.sign = function (n) {
            n = +n;
            if (n === 0 || isNaN(n)) {
                return n;
            }
            return n > 0 ? 1 : -1;
        };
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
        MathUtils.randRange = function (param1, param2) {
            var loc = Math.random() * (param2 - param1) + param1;
            return loc;
        };
        MathUtils.randRange_Int = function (param1, param2) {
            var loc = Math.random() * (param2 - param1 + 1) + param1;
            return Math.floor(loc);
        };
        MathUtils.randRange_Array = function (arr) {
            if (arr.length == 0)
                return null;
            var loc = arr[MathUtils.randRange_Int(0, arr.length - 1)];
            return loc;
        };
        MathUtils.clampDegrees = function (degrees) {
            while (degrees < 0)
                degrees = degrees + 360;
            while (degrees >= 360)
                degrees = degrees - 360;
            return degrees;
        };
        MathUtils.clampRadians = function (radians) {
            while (radians < 0)
                radians = radians + 2 * Math.PI;
            while (radians >= 2 * Math.PI)
                radians = radians - 2 * Math.PI;
            return radians;
        };
        MathUtils.getDistance = function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
        };
        MathUtils.getSquareDistance = function (x1, y1, x2, y2) {
            return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2);
        };
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
        MathUtils.toDegree = function (radian) {
            return radian * (180.0 / Math.PI);
        };
        MathUtils.toRadian = function (degree) {
            return degree * (Math.PI / 180.0);
        };
        MathUtils.moveTowards = function (current, target, maxDelta) {
            if (Math.abs(target - current) <= maxDelta) {
                return target;
            }
            return current + MathUtils.sign(target - current) * maxDelta;
        };
        MathUtils.radians4point = function (ax, ay, bx, by) {
            return Math.atan2(ay - by, bx - ax);
        };
        MathUtils.pointAtCircle = function (px, py, radians, radius) {
            return new cc.Vec2(px + Math.cos(radians) * radius, py - Math.sin(radians) * radius);
        };
        MathUtils.getPos = function (pts, t, type) {
            if (pts.length == 0)
                return null;
            if (pts.length == 1)
                return pts[0];
            t = Math.min(t, 1);
            var target = new cc.Vec2();
            var count = pts.length;
            if (type == OrbitType.Line) {
                var unitTime = 1 / (count - 1);
                var index = Math.floor(t / unitTime);
                if (index + 1 < count) {
                    var start = pts[index];
                    var end = pts[index + 1];
                    var time = (t - index * unitTime) / unitTime;
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
        MathUtils.getBezierat = function (pts, t) {
            var target = new cc.Vec2();
            if (pts.length == 3) {
                target.x = Math.pow(1 - t, 2) * pts[0].x + 2 * t * (1 - t) * pts[1].x + Math.pow(t, 2) * pts[2].x;
                target.y = Math.pow(1 - t, 2) * pts[0].y + 2 * t * (1 - t) * pts[1].y + Math.pow(t, 2) * pts[2].y;
            }
            else if (pts.length == 4) {
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
        };
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
        MathUtils.normalize = function (vec) {
            var k = vec.y / vec.x;
            var x = Math.sqrt(1 / (k * k + 1));
            var y = Math.abs(k * x);
            vec.x = vec.x > 0 ? x : -x;
            vec.y = vec.y > 0 ? y : -y;
            return vec;
        };
        MathUtils.distance = function (startX, startY, endX, endY) {
            return Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
        };
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

(function (airkit) {
    var NumberUtils = (function () {
        function NumberUtils() {
        }
        NumberUtils.toFixed = function (value, p) {
            return airkit.StringUtils.toNumber(value.toFixed(p));
        };
        NumberUtils.toInt = function (value) {
            return Math.floor(value);
        };
        NumberUtils.isInt = function (value) {
            return Math.ceil(value) != value ? false : true;
        };
        NumberUtils.reserveNumber = function (num, size) {
            var str = String(num);
            var l = str.length;
            var p_index = str.indexOf(".");
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
        NumberUtils.reserveNumberWithZero = function (num, size) {
            var str = String(num);
            var l = str.length;
            var p_index = str.indexOf(".");
            if (p_index < 0) {
                str += ".";
                for (var i = 0; i < size; ++i)
                    str += "0";
                return str;
            }
            var ret = str.slice(0, p_index + 1);
            var lastNum = l - p_index - 1;
            if (lastNum > size) {
                lastNum = size;
                var lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
                return ret + lastStr;
            }
            else if (lastNum < size) {
                var diff = size - lastNum;
                for (var i = 0; i < diff; ++i)
                    str += "0";
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

(function (airkit) {
    var StringUtils = (function () {
        function StringUtils() {
        }
        Object.defineProperty(StringUtils, "empty", {
            get: function () {
                return "";
            },
            enumerable: false,
            configurable: true
        });
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
            if (fill === void 0) { fill = "..."; }
            var result = str;
            if (str.length > len) {
                result = str.substr(0, len) + fill;
            }
            return result;
        };
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
        StringUtils.addZero = function (str, len, dir) {
            if (dir === void 0) { dir = 0; }
            var _str = "";
            var _len = str.length;
            var str_pre_zero = "";
            var str_end_zero = "";
            if (dir == 0)
                str_end_zero = "0";
            else
                str_pre_zero = "0";
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
        StringUtils.isString = function (obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        };
        StringUtils.trim = function (input) {
            if (input == null) {
                return "";
            }
            return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
        };
        StringUtils.trimLeft = function (input) {
            if (input == null) {
                return "";
            }
            return input.replace(/^\s+""^\s+/, "");
        };
        StringUtils.trimRight = function (input) {
            if (input == null) {
                return "";
            }
            return input.replace(/\s+$""\s+$/, "");
        };
        StringUtils.minuteFormat = function (seconds) {
            var min = Math.floor(seconds / 60);
            var sec = Math.floor(seconds % 60);
            var min_str = min < 10 ? "0" + min.toString() : min.toString();
            var sec_str = sec < 10 ? "0" + sec.toString() : sec.toString();
            return min_str + ":" + sec_str;
        };
        StringUtils.hourFormat = function (seconds) {
            var hour = Math.floor(seconds / 3600);
            var hour_str = hour < 10 ? "0" + hour.toString() : hour.toString();
            return hour_str + ":" + StringUtils.minuteFormat(seconds % 3600);
        };
        StringUtils.format = function (str) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++) {
                str = str.replace(new RegExp("\\{" + i + "\\}", "gm"), args[i]);
            }
            return str;
        };
        StringUtils.formatWithDic = function (str, dic) {
            for (var key in dic) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gm"), dic[key]);
            }
            return str;
        };
        StringUtils.beginsWith = function (input, prefix) {
            return prefix == input.substring(0, prefix.length);
        };
        StringUtils.endsWith = function (input, suffix) {
            return suffix == input.substring(input.length - suffix.length);
        };
        StringUtils.getGUIDString = function () {
            var d = Date.now();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now();
            }
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            });
        };
        return StringUtils;
    }());
    airkit.StringUtils = StringUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var TouchUtils = (function () {
        function TouchUtils() {
        }
        return TouchUtils;
    }());
    airkit.TouchUtils = TouchUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var TweenUtils = (function () {
        function TweenUtils(target) {
            this._target = target;
            this.clear();
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
        TweenUtils.prototype.setOnUpdate = function (callback) {
            this._updateFunc = callback;
        };
        TweenUtils.prototype.onUpdate = function (gt) {
            if (this._updateFunc) {
                this._updateFunc(gt);
            }
        };
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
            var _this = this;
            if (!this._isPlaying) {
                if (this._steps && this._steps.length) {
                    var step = this._steps.shift();
                    if (step.hasOwnProperty("props")) {
                        this._isPlaying = true;
                        if (step.props["x"] != null || step.props["y"] != null) {
                            var x = step.props["x"] != null ? step.props.x : this._target.x;
                            var y = step.props["y"] != null ? step.props.y : this._target.y;
                            fgui.GTween.to2(this._target.x, this._target.y, x, y, step.duration)
                                .setTarget(this._target, this._target.setPosition)
                                .setEase(step.ease);
                        }
                        if (step.props["scaleX"] != null || step.props["scaleY"] != null) {
                            var x = step.props["scaleX"] != null ? step.props.scaleX : this._target.scaleX;
                            var y = step.props["scaleY"] != null ? step.props.scaleY : this._target.scaleY;
                            fgui.GTween.to2(this._target.scaleX, this._target.scaleY, x, y, step.duration)
                                .setTarget(this._target, this._target.setScale)
                                .setEase(step.ease);
                        }
                        if (step.props["rotation"] != null) {
                            var rotation = step.props["rotation"] != null ? step.props.rotation : this._target.rotation;
                            fgui.GTween.to(this._target.rotation, rotation, step.duration).setTarget(this._target, "rotation").setEase(step.ease);
                        }
                        if (step.props["alpha"] != null) {
                            if (step.props.pts) {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate(function (gt) {
                                    var point = airkit.MathUtils.getPos(step.props.pts, gt.normalizedTime, airkit.OrbitType.Curve);
                                    _this._target.setPosition(point.x, point.y);
                                    _this.onUpdate(gt);
                                }, null);
                            }
                            else {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate(function (gt) {
                                    _this.onUpdate(gt);
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
        };
        TweenUtils.prototype.onStepComplete = function (onFunc) {
            if (onFunc) {
                onFunc.runWith();
            }
            this._isPlaying = false;
            this.trigger();
        };
        TweenUtils.prototype.clear = function () {
            this._steps = [];
            this._isPlaying = false;
            fgui.GTween.kill(this._target);
        };
        TweenUtils.scale = function (view) {
            this.get(view).to({ scaleX: 0.8, scaleY: 0.8 }, 0.05, fgui.EaseType.QuadIn).to({ scaleX: 1.0, scaleY: 1.0 }, 0.05, fgui.EaseType.QuadIn);
        };
        TweenUtils.appear = function (view) {
            view.setScale(0, 0);
            this.get(view).to({ scaleX: 1.2, scaleY: 1.2 }, 0.4, fgui.EaseType.QuadOut).to({ scaleX: 1.0, scaleY: 1.0 }, 0.2, fgui.EaseType.QuadOut);
        };
        TweenUtils.EaseBezier = 9999;
        return TweenUtils;
    }());
    airkit.TweenUtils = TweenUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var UrlUtils = (function () {
        function UrlUtils() {
        }
        UrlUtils.getFileExte = function (url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            var idx = url.lastIndexOf(".");
            if (idx >= 0) {
                return url.substr(idx + 1);
            }
            return airkit.StringUtils.empty;
        };
        UrlUtils.getPathWithNoExtend = function (url) {
            if (airkit.StringUtils.isNullOrEmpty(url))
                return airkit.StringUtils.empty;
            var idx = url.lastIndexOf(".");
            if (idx >= 0) {
                return url.substr(0, idx);
            }
            return airkit.StringUtils.empty;
        };
        return UrlUtils;
    }());
    airkit.UrlUtils = UrlUtils;
})(airkit || (airkit = {}));

(function (airkit) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.openURL = function (url) {
            window.location.href = url;
        };
        Utils.getLocationParams = function () {
            var url = window.location.href;
            var dic = new airkit.SDictionary();
            var num = url.indexOf("?");
            if (num >= 0) {
                url = url.substr(num + 1);
                var key = void 0, value = void 0;
                var arr = url.split("&");
                for (var i in arr) {
                    var str = arr[i];
                    num = str.indexOf("=");
                    key = str.substr(0, num);
                    value = str.substr(num + 1);
                    dic.add(key, value);
                }
            }
            return dic;
        };
        Utils.obj2query = function (obj) {
            if (!obj) {
                return "";
            }
            var arr = [];
            for (var key in obj) {
                arr.push(key + "=" + obj[key]);
            }
            return arr.join("&");
        };
        Utils.injectProp = function (target, data, callback, ignoreMethod, ignoreNull, keyBefore) {
            if (data === void 0) { data = null; }
            if (callback === void 0) { callback = null; }
            if (ignoreMethod === void 0) { ignoreMethod = true; }
            if (ignoreNull === void 0) { ignoreNull = true; }
            if (keyBefore === void 0) { keyBefore = ""; }
            if (!data) {
                return false;
            }
            var result = true;
            for (var key in data) {
                var value = data[key];
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
        };
        Utils.parseXMLFromString = function (value) {
            var rst;
            value = value.replace(/>\s+</g, "><");
            rst = new DOMParser().parseFromString(value, "text/xml");
            if (rst.firstChild.textContent.indexOf("This page contains the following errors") > -1) {
                throw new Error(rst.firstChild.firstChild.textContent);
            }
            return rst;
        };
        return Utils;
    }());
    airkit.Utils = Utils;
    var FlagUtils = (function () {
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
    var ZipUtils = (function () {
        function ZipUtils() {
        }
        ZipUtils.unzip = function (ab) {
            return new Promise(function (resolve, reject) {
                var resultDic = {};
                ZipUtils.parseZip(ab)
                    .then(function (zip) {
                    var jszip = zip.jszip;
                    var filelist = zip.filelist;
                    if (jszip && filelist) {
                        var count_1 = 0;
                        var _loop_1 = function (i) {
                            ZipUtils.parseZipFile(jszip, filelist[i])
                                .then(function (content) {
                                count_1++;
                                resultDic[filelist[i]] = content;
                                if (count_1 == filelist.length) {
                                    zip = null;
                                    jszip = null;
                                    filelist = null;
                                    resolve(resultDic);
                                }
                            })
                                .catch(function (e) {
                                airkit.Log.error(e);
                                reject(e);
                            });
                        };
                        for (var i = 0; i < filelist.length; i++) {
                            _loop_1(i);
                        }
                    }
                })
                    .catch(function (e) {
                    airkit.Log.error(e);
                    reject(e);
                });
            });
        };
        ZipUtils.parseZip = function (ab) {
            return new Promise(function (resolve, reject) {
                var dic = new airkit.SDictionary();
                var fileNameArr = new Array();
                window.JSZip.loadAsync(ab)
                    .then(function (jszip) {
                    for (var fileName in jszip.files) {
                        fileNameArr.push(fileName);
                    }
                    resolve({
                        jszip: jszip,
                        filelist: fileNameArr,
                    });
                })
                    .catch(function (e) {
                    airkit.Log.error(e);
                });
            });
        };
        ZipUtils.parseZipFile = function (jszip, filename) {
            return new Promise(function (resolve, reject) {
                jszip
                    .file(filename)
                    .async("text")
                    .then(function (content) {
                    resolve(content);
                })
                    .catch(function (e) {
                    reject(e);
                    airkit.Log.error(e);
                });
            });
        };
        return ZipUtils;
    }());
    airkit.ZipUtils = ZipUtils;
})(airkit || (airkit = {}));
