/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:32
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/event/ISignal.ts
 */
namespace airkit {
    export interface ISignal {
        /**
         * 派发信号
         * @param arg
         */
        dispatch(arg: any)

        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        on(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[])

        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        once(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[])

        /**
         * 取消回调
         * @param caller
         * @param method
         */
        off(caller: any, method: (arg: any, ...args: any[]) => any)

        destory()
    }
}
