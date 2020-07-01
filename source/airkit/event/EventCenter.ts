// import { EventArgs } from "./EventArgs";
// import { EventDispatcher } from "./EventDispatcher";
// import { Singleton } from "../collection/Singleton";

namespace airkit {
    /**
     * 全局事件
     * @author ankye
     * @time 2018-7-6
     */

    export class EventCenter extends Singleton {
        private _event: EventDispatcher = null;
        private _evtArgs: EventArgs = null;

        private static instance: EventCenter = null;
        public static get Instance(): EventCenter {
            if (!this.instance) this.instance = new EventCenter();
            return this.instance;
        }

        constructor() {
            super();
            this._event = new EventDispatcher();
            this._evtArgs = new EventArgs();
        }

        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        public static on(type: string, caller: any, fun: Function): void {
            EventCenter.Instance._event.on(type, caller, fun);
        }

        /**
         * 移除监听
         */
        public static off(type: string, caller: any, fun: Function): void {
            EventCenter.Instance._event.off(type, caller, fun);
        }
        /**
         * 派发事件
         */
        public static dispatchEvent(type: string, ...args: any[]): void {
            EventCenter.Instance._evtArgs.init(args);
            EventCenter.Instance._event.dispatchEvent(type, EventCenter.Instance._evtArgs);
        }

        public static clear(): void {
            EventCenter.Instance._event.clear();
        }
    }
}
