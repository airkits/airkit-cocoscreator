// import { ISignal } from "./ISignal";
namespace airkit {
    export class Signal<T> implements ISignal {
        private _listener: SignalListener

        constructor() {}

        public destory() {
            this._listener && this._listener.destory()
            this._listener = null
        }

        /**
         * 派发信号
         * @param arg
         */
        public dispatch(arg?: T) {
            if (this._listener) this._listener.execute(arg)
        }

        public has(caller: any): boolean {
            if (this._listener == null) return false
            return this._listener.has(caller)
        }
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        public on(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]) {
            this.makeSureListenerManager()
            this._listener.on(caller, method, args, false)
        }

        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        public once(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]) {
            this.makeSureListenerManager()
            this._listener.on(caller, method, args, true)
        }

        /**
         * 取消回调
         * @param caller
         * @param method
         */
        public off(caller: any, method: (arg: T, ...args: any[]) => any) {
            if (this._listener) this._listener.off(caller, method)
        }

        /**
         * 保证ListenerManager可用
         */
        private makeSureListenerManager() {
            if (!this._listener) this._listener = new SignalListener()
        }
    }

    export class SignalListener {
        private handlers: Handler[]
        private stopped: boolean = false

        constructor() {}

        public destory() {
            this.stopped = false
            this.clear()
        }

        public has(caller: any): boolean {
            for (let i = 0; i < this.handlers.length; i++) {
                if (this.handlers[i].caller == caller) {
                    return true
                }
            }
            return false
        }
        public on(caller: any, method: Function, args: any[], once: boolean = false): Handler {
            if (!this.handlers) this.handlers = []
            let handler: Handler = new Handler(caller, method, args, once)
            this.handlers.push(handler)
            return handler
        }

        /**
         * 解除回调
         * @param caller
         * @param method
         */
        public off(caller: any, method: Function) {
            if (!this.handlers || this.handlers.length <= 0) return

            let tempHandlers: Handler[] = []
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i]
                if (handler.caller === caller && handler.method === method) {
                    handler.recover()
                    break
                } else {
                    tempHandlers.push(handler)
                }
            }

            // 把剩下的放回
            ++i
            for (; i < this.handlers.length; ++i) {
                tempHandlers.push(this.handlers[i])
            }
            this.handlers = tempHandlers
        }

        /**
         * 解除所有回调
         * @param caller
         * @param method
         */
        public offAll(caller: any, method: Function) {
            if (!this.handlers || this.handlers.length <= 0) return

            let temp: Handler[] = []
            let handlers: Handler[] = this.handlers
            let len: number = handlers.length
            for (var i: number = 0; i < len; ++i) {
                if (caller !== handlers[i].caller || method !== handlers[i].method) {
                    temp.push(handlers[i])
                } else {
                    handlers[i].recover()
                }
            }

            this.handlers = temp
        }

        /**
         * 清除所有回调
         */
        public clear() {
            if (!this.handlers || this.handlers.length <= 0) return

            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i]
                handler.recover()
            }
            this.handlers = null
        }

        public stop() {
            this.stopped = true
        }
        public execute(...args: any[]) {
            if (!this.handlers || this.handlers.length <= 0) return
            let handlers: Handler[] = this.handlers
            let len: number = handlers.length
            let handler: Handler
            let temp: Handler[] = []
            let i: number = 0

            for (; i < len; ++i) {
                if (this.stopped) break

                handler = handlers[i]
                handler.runWith(args)
                if (handler.method) {
                    temp.push(handler)
                }
            }
            for (; i < len; ++i) {
                temp.push(handlers[i])
            }

            this.stopped = false

            this.handlers = temp
            handler = null
            handlers = null
            temp = null
        }
    }
}
