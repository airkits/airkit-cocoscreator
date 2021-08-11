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
        public _currentState: State<T> = null
        public _previousState: State<T> = null
        public _globalState: State<T> = null

        public constructor() {}
        public update(dt: number) {
            if (this._globalState) {
                this._globalState.update(dt)
            }

            if (this._currentState) {
                this._currentState.update(dt)
            }
        }

        public changeState(_state: any) {
            this._previousState = this._currentState
            this._currentState = _state
            this._currentState._owner = this
            if (this._previousState) this._previousState.exit()
            this._currentState.enter()
        }

        public setCurrentState(_state: any) {
            if (this._currentState) {
                this._currentState.exit()
            }

            this._currentState = _state
            this._currentState._owner = this
            this._currentState.enter()
        }

        public setGlobalState(_state: any) {
            if (this._globalState) {
                this._globalState.exit()
            }
            this._globalState = _state
            this._globalState._owner = this
            this._globalState.enter()
        }

        public clearAllState() {
            if (this._globalState) {
                this._globalState.exit()
                this._globalState = null
            }

            if (this._currentState) {
                this._currentState.exit()
                this._currentState = null
            }
            this._previousState = null
        }

        public get currentState() {
            return this._currentState
        }

        public get previousState() {
            return this._previousState
        }

        public get globalState() {
            return this._globalState
        }
    }
}
