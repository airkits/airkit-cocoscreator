// import { Singleton } from "../collection/Singleton";
// import { DisplayUtils, displayWidth } from '../utils/DisplayUtils';
// import { Log } from "../log/Log";
// import { eUILayer } from "../common/Constant";

/**
 * 层级管理
 */

namespace airkit {
    /**
     * 声音事件
     */
    //调试方便，封装一次fgui.GComponent
    export class Layer extends fgui.GComponent {
        constructor() {
            super();
        }
        public debug(): void {
            let bgColor: string = "#f4e1e188";
            //	this.graphics.clear()
            //	this.graphics.drawRect(0, 0, this.width, this.height, bgColor)
        }
    }

    /**
     * 场景层级
     * @author ankye
     * @time 2017-7-13
     */
    export class LayerManager extends Singleton {
        //背景宽高,按中下往上扩展图片
        public static BG_WIDTH: number = 750;
        public static BG_HEIGHT: number = 1650;

         private static _root: fgui.GComponent; //根容器

        // private static _topLayer: Layer; //最高层 固化应用信息
        private static _loadingLayer: Layer; //loading层
        // private static _systemLayer: Layer; //system层
        // private static _tooltipLayer: Layer; //提示层
        // private static _popupLayer: Layer; //弹出层
        private static _uiLayer: Layer; //ui层		角色信息、快捷菜单、聊天等工具视图
        private static _mainLayer: Layer; //游戏层		游戏主内容
        private static _bgLayer: Layer; //背景层

        /**
         * 存放要随着屏幕变化而调整自身尺寸的容器
         */
        private static layers: Array<Layer>;

        public static get stage(): fgui.GComponent {
            return this._root;
        }

        public static getLayer(t: eUILayer): fgui.GComponent {
            let layer = null;
            switch (t) {
                case eUILayer.BG:
                    layer = this.bgLayer;
                    break;
                case eUILayer.MAIN:
                    layer = this.mainLayer;
                    break;
                case eUILayer.GUI:
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
                case eUILayer.LOADING:
                    layer = this.loadingLayer;
                    break;
                // case eUILayer.TOP:
                //     layer = this.topLayer;
                //     break;
            }

            if (
                cc.winSize.width != layer.width ||
                cc.winSize.height != layer.height
            ) {
                layer.width = cc.winSize.width;
                layer.height = cc.winSize.height;
            }
            //layer.debug()
            return layer;
        }
        public static setup(root: fgui.GComponent): void {
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
                // this._topLayer,
            ];

            this.registerEvent();
            this.resize();
        }

        protected static registerEvent(): void {
            EventCenter.on(EventID.RESIZE, this, this.resize);
        }
        protected static unRegisterEvent(): void {
            EventCenter.off(EventID.RESIZE, this, this.resize);
        }

        public static resize(): void {
            Log.info(
                "LayerManager Receive Resize {0} {1}",
                cc.winSize.width,
                cc.winSize.height
            );

            var i: number;
            var l: number;
            let w = cc.winSize.width;
            let h = cc.winSize.height;
            this._root.setSize(w, h);
            for (i = 0, l = this.layers.length; i < l; i++) {
                this.layers[i].setSize(w, h);
                // this.layers[i].touchable = true
                // this.layers[i].opaque = false
            }
            if (this._bgLayer.numChildren) {
                var bg = this._bgLayer.getChildAt(0) as fgui.GImage;
                let x = (w - LayerManager.BG_WIDTH) >> 1;
                let y = h - LayerManager.BG_HEIGHT;
                bg.setPosition(x, y);
            }
            
            // let obj = this._uiLayer
            // obj.node.graphics.clear()
            // obj.node.graphics.drawRect(0, 0, obj.width, obj.height, "#33333333")
        }

        public static destroy(): void {
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
        public static removeAll(): void {
            DisplayUtils.removeAllChild(this._bgLayer);
            DisplayUtils.removeAllChild(this._mainLayer);
            DisplayUtils.removeAllChild(this._uiLayer);
            // DisplayUtils.removeAllChild(this._popupLayer);
            // DisplayUtils.removeAllChild(this._tooltipLayer);
            // DisplayUtils.removeAllChild(this._systemLayer);
            DisplayUtils.removeAllChild(this._loadingLayer);
        }
        public static get root(): fgui.GComponent {
            return this._root;
        }

        public static get bgLayer(): fgui.GComponent {
            return this._bgLayer;
        }

        public static addBg(url: string): fgui.GLoader {
            var child: fgui.GLoader;
            if (this.bgLayer.numChildren)
                child = this.bgLayer.getChildAt(0) as fgui.GLoader;
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

        public static get mainLayer(): fgui.GComponent {
            return this._mainLayer;
        }

        public static get uiLayer(): fgui.GComponent {
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

        public static get loadingLayer(): fgui.GComponent {
            return this._loadingLayer;
        }

        // public static get topLayer(): fgui.GComponent {
        //     return this._topLayer;
        // }
    }
}
