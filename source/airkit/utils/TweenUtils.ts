// import { Utils } from "./Utils";
// import { MathUtils, OrbitType } from "./MathUtils";
// import { Log } from "../log/Log";

namespace airkit {
    /*
     * @author ankye
     * 连续动画
     */
    export class TweenUtils {
        public static EaseBezier: number = 9999;

        constructor(target: fgui.GObject) {
            this._target = target;
            this.clear();
        }

        private _target: fgui.GObject;
        private _steps: any[];
        private _isPlaying: boolean;

        private _updateFunc: Function;

        public static get(target: fgui.GObject): TweenUtils {
            return new TweenUtils(target);
        }
        public get target(): fgui.GObject {
            return this._target;
        }
        public setOnUpdate(callback: Function) {
            this._updateFunc = callback;
        }
        public onUpdate(gt: fgui.GTweener) {
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
        public to(props: any, duration: number, ease: number = fgui.EaseType.QuadOut, complete: Function = null, delay: number = 0): TweenUtils {
            this._steps.push({ props, duration, ease, complete, delay });
            this.trigger();
            return this;
        }

        public delay(delay: number): TweenUtils {
            this._steps.push({ delay });
            return this;
        }

        private trigger(): void {
            if (!this._isPlaying) {
                if (this._steps && this._steps.length) {
                    var step: any = this._steps.shift();
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
                        if (step.props["color"] != null) {
                            let color = step.props["color"] != null ? step.props.color : 0xffffff;

                            var redMat: Array<number> = [
                                1,
                                0,
                                0,
                                0.3,
                                0.3, //R
                                0,
                                0,
                                0,
                                0,
                                0, //G
                                0,
                                0,
                                0,
                                0,
                                0, //B
                                0,
                                0,
                                0,
                                1,
                                0, //A
                            ];
                            //创建一个颜色滤镜对象,红色
                            // var redFilter: Laya.ColorFilter = new Laya.ColorFilter(redMat);
                            // this._target.filters = [redFilter];
                        }
                        if (step.props["alpha"] != null) {
                            if (step.props.pts) {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate((gt: fgui.GTweener) => {
                                        let point = MathUtils.getPos(step.props.pts, gt.normalizedTime, OrbitType.Curve);
                                        this._target.setPosition(point.x, point.y);
                                        this.onUpdate(gt);
                                    }, null);
                            } else {
                                fgui.GTween.to(this._target.alpha, step.props.alpha, step.duration)
                                    .setTarget(this._target, "alpha")
                                    .setEase(step.ease)
                                    .onUpdate((gt: fgui.GTweener) => {
                                        this.onUpdate(gt);
                                    }, null);
                            }
                        }
                        setTimeout(() => {
                            this.onStepComplete(step.complete);
                        }, (step.duration + step.delay) * 1000);
                    } else if (step.hasOwnProperty("delay")) {
                        this._isPlaying = true;
                        setTimeout(() => {
                            this.onStepComplete(step.complete);
                        }, step.delay * 1000);
                    }
                }
            }
        }

        private onStepComplete(onFunc: any): void {
            if (onFunc) {
                onFunc.runWith();
            }
            this._isPlaying = false;
            this.trigger();
        }

        public clear(): void {
            this._steps = [];
            this._isPlaying = false;
            fgui.GTween.kill(this._target);
        }

        public static scale(view: fgui.GObject): void {
            this.get(view).to({ scaleX: 0.8, scaleY: 0.8 }, 0.05, fgui.EaseType.QuadIn).to({ scaleX: 1.0, scaleY: 1.0 }, 0.05, fgui.EaseType.QuadIn);
        }
        public static appear(view: fgui.GObject): void {
            view.setScale(0, 0);
            this.get(view).to({ scaleX: 1.2, scaleY: 1.2 }, 0.4, fgui.EaseType.QuadOut).to({ scaleX: 1.0, scaleY: 1.0 }, 0.2, fgui.EaseType.QuadOut);
        }

        /**
         * 抖动效果
         * @param node
         */
        // public static shake(node: any): void {
        //     Laya.Tween.to(
        //         node,
        //         { y: node.y + 100 },
        //         100,
        //         null,
        //         Laya.Handler.create(this, function () {
        //             Laya.Tween.to(node, { y: node.y - 100 }, 1000, Laya.Ease.elasticOut);
        //         })
        //     );
        // }
        //public static isShake: boolean = false;
        /**
         * 震动屏幕
         * @param callBack
         * @param times
         * @param offset
         * @param speed
         *
         */
        // public static stageShake(
        //     view: fgui.GComponent,
        //     times: number = 2,
        //     offset: number = 12,
        //     speed: number = 32,
        //     caller?: any,
        //     callBack?: Function
        // ): void {
        //     if (view["isShake"]) {
        //         return;
        //     }

        //     view["isShake"] = true;
        //     var num: number = 0;
        //     var offsetArr: Array<number> = [0, 0];
        //     var point: cc.Vec2 = new cc.Vec2(view.x, view.y);
        //     Laya.stage.timerLoop(speed, this, shakeObject);

        //     function shakeObject(args: Array<any> = null, frameNum: number = 1, frameTime: number = 0): void {
        //         var count: number = num++ % 4;
        //         offsetArr[num % 2] = count < 2 ? 0 : offset;
        //         view.x = offsetArr[0] + point.x;
        //         view.y = offsetArr[1] + point.y;
        //         if (num > times * 4 + 1) {
        //             Laya.stage.clearTimer(this, shakeObject);
        //             num = 0;
        //             view["isShake"] = false;
        //             if (callBack != null) {
        //                 callBack.call(caller);
        //             }
        //         }
        //     }
        // }
    }
}
