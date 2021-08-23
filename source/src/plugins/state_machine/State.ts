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
    export enum eStateEnum {
        NONE = 1 << 0,
        INIT = 1 << 1,
        ENTER = 1 << 2,
        RUNNING = 1 << 3,
        EXIT = 1 << 4,
        DESTROY = 1 << 5,
    }
    export class State<T> {
        protected _owner: StateMachine<T> = null
        //实体控制器引用
        protected _entity: T = null
        protected _state: number = 0

        protected _status: eStateEnum = eStateEnum.NONE
        //帧数统计,每帧update的时候+1,每次enter和exit的时候清零,用于处理一些定时事件,比较通用
        //所以抽离到基础属性里面了，有需要的需要自己在状态里面进行加减重置等操作，基类只提供属性字段
        protected _times: number = 0
        protected _tick: number = 0 //用于计数

        public constructor(entity: T) {
            this._entity = entity
        }

        // 设置运行状态，对外开放的接口
        public setStatus(v: number): void {
            this._status = this._status | v
        }

        // 重置运行状态
        // 支持重置多个状态位
        resetStatus(v: number): void {
            this._status = this._status & (this._status ^ v)
        }
        /**
         * hasStatus
         * @param Status
         * @returns boolean
         * 是否存在运行状态,支持多个状态查询
         */
        public hasStatus(v: number): boolean {
            return (this._status & v) > 0
        }

        public set owner(v: StateMachine<T>) {
            this._owner = v
        }

        public set entity(v: T) {
            this._entity = v
        }
        public set state(v: number) {
            this._state = v
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

        public destroy(): void {
            this._owner = null
            this._entity = null
            this._state = 0
        }
    }
}
