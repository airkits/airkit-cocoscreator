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
namespace airkit {
    /**
     * 事件
     * @author ankye
     * @time 2018-7-6
     */

    export class EventDispatcher {
        private _dicFuns: Object = {}
        private _evtArgs: EventArgs = null

        constructor() {
            this._evtArgs = new EventArgs()
        }
        /**
         * 添加监听
         * @param type      事件类型
         * @param caller    调用者
         * @param fun       回调函数，注意回调函数的参数是共用一个，所有不要持有引用[let evt = args（不建议这样写）]
         */
        public on(type: string, caller: any, fun: Function): void {
            if (!this._dicFuns[type]) {
                this._dicFuns[type] = []
                this._dicFuns[type].push(Handler.create(caller, fun, null, false))
            } else {
                let arr: Handler[] = this._dicFuns[type]
                for (let item of arr) {
                    if (item.caller == caller && item.method == fun) return
                }
                arr.push(Handler.create(caller, fun, null, false))
            }
        }

        /**
         * 移除监听
         */
        public off(type: string, caller: any, fun: Function): void {
            let arr: Handler[] = this._dicFuns[type]
            if (!arr) return
            for (let i = 0; i < arr.length; ++i) {
                let item: Handler = arr[i]
                if (item.caller == caller && item.method == fun) {
                    item.recover()
                    arr.splice(i, 1)
                    break
                }
            }
        }

        /**
         * 派发事件，注意参数类型为EventArgs
         */
        public dispatchEvent(type: string, args: EventArgs): void {
            args.type = type
            let arr: Handler[] = this._dicFuns[type]
            if (!arr) return
            for (let item of arr) {
                item.runWith(args)
            }
        }

        /**
         * 派发事件
         */
        public dispatch(type: string, ...args: any[]): void {
            this._evtArgs.init(args)
            this.dispatchEvent(type, this._evtArgs)
        }

        public clear(): void {
            DicUtils.clearDic(this._dicFuns)
        }
    }
}
