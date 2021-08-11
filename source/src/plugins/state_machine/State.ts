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
namespace airkit {
    export class State<T> {
        public _owner: StateMachine<T> = null
        //实体控制器引用
        public _entity: T
        public _status = 0

        //帧数统计,每帧update的时候+1,每次enter和exit的时候清零,用于处理一些定时事件,比较通用
        //所以抽离到基础属性里面了，有需要的需要自己在状态里面进行加减重置等操作，基类只提供属性字段
        protected _times: number = 0
        protected _tick: number = 0 //用于计数

        public constructor(entity: T, status: number) {
            this._entity = entity
            this._status = status
        }

        public enter() {
            Log.info('you must overwrite the func state.enter !')
        }
        public update(dt: number) {
            Log.info('you must overwrite the func state.update !')
        }
        public exit() {
            Log.info('you must overwrite the func state.exit !')
        }
    }
}
