/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:11
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/plugins/state_machine/StateMachine.ts
 */
// import { State } from "./State";
namespace airkit {
    export class StateMachine<T> {
        protected _currentState: State<T> = null
        protected _previousState: State<T> = null
        protected _gState: State<T> = null
        protected _states: NDictionary<State<T>>
        protected _stateQueue: Queue<number>

        public constructor() {
            this._states = new NDictionary<State<T>>()
            this._stateQueue = new Queue<number>()
        }

        /**
         * 注册状态
         * @param type
         * @param state
         */
        public registerState(type: number, state: State<T>): void {
            state.setStatus(eStateEnum.INIT)
            this._states.add(type, state)
        }
        /**
         * 移除状态
         * @param type
         */
        public unregisterState(type: number): void {
            this._states.remove(type)
        }

        public update(dt: number) {
            if (this._gState && this._gState.hasStatus(eStateEnum.RUNNING) && !this._gState.hasStatus(eStateEnum.EXIT)) {
                this._gState.update(dt)
            }

            if (this._currentState && this._currentState.hasStatus(eStateEnum.RUNNING) && !this._currentState.hasStatus(eStateEnum.EXIT)) {
                this._currentState.update(dt)
            }
        }
        /**
         * 切换状态,如果有上一个状态，先退出上一个状态，再切换到该状态
         * @param type
         */
        public changeState(type: number): boolean {
            if (!this._states.has(type)) {
                return false
            }
            this._stateQueue.clear()
            this._stateQueue.enqueue(type)
            return this.doNextState()
        }

        protected doNextState(): boolean {
            if (this._stateQueue.length <= 0) {
                return false
            }
            let type = this._stateQueue.dequeue()
            if (!this._states.has(type)) {
                return false
            }
            this._previousState = this._currentState
            this._currentState = this._states.getValue(type)
            this._stateExit(this._previousState)
            this._stateEnter(this._currentState)

            return true
        }
        private _stateExit(state: State<T>): void {
            state.setStatus(eStateEnum.EXIT)
            state.exit()
        }
        private _stateEnter(state: State<T>): void {
            state.resetStatus(eStateEnum.ENTER | eStateEnum.RUNNING | eStateEnum.EXIT)
            state.owner = this
            state.setStatus(eStateEnum.ENTER)
            state.enter()
            state.setStatus(eStateEnum.RUNNING)
        }
        /**
         * 设置下一个状态，如果队列有，追加到最后，如果当前没有运行的状态，直接运行
         * @param type
         * @returns
         */
        public setNextState(type: number): boolean {
            if (!this._states.has(type)) {
                return false
            }
            this._stateQueue.enqueue(type)
            if (!this._currentState) {
                return this.doNextState()
            } else {
                if (this._currentState.hasStatus(eStateEnum.EXIT)) {
                    return this.doNextState()
                }
            }
            return true
        }
        public setGlobalState(type: number): boolean {
            if (!this._states.has(type)) {
                return false
            }
            if (this._gState) {
                this._stateExit(this._gState)
                this._gState = null
            }

            this._gState = this._states.getValue(type)
            this._stateEnter(this._gState)
        }

        public clearAllState() {
            if (this._gState) {
                this._stateExit(this._gState)
                this._gState = null
            }

            if (this._currentState) {
                this._stateExit(this._currentState)
                this._currentState = null
            }
            this._previousState = null
            this._states.foreach((k, v) => {
                v.setStatus(eStateEnum.DESTROY)
                v.destroy()
                return true
            })
            this._states.clear()
            this._stateQueue.clear()
        }

        public get currentState() {
            return this._currentState
        }

        public get previousState() {
            return this._previousState
        }

        public get globalState() {
            return this._gState
        }

        public destory(): void {
            this.clearAllState()
        }
    }
}
