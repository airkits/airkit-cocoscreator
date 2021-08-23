export enum eFrameState {
    NONE = 0,
    NOTIFY = 1,
    SYNC = 2,
    SEND = 3,
}
export class FrameController {
    private _sm: ak.StateMachine<FrameController>

    constructor() {
        this._sm = new ak.StateMachine<FrameController>()
        this._sm.registerState(eFrameState.NONE, new FrameStateNone<FrameController>(this))
        this._sm.registerState(eFrameState.NOTIFY, new FrameStateNotify<FrameController>(this))
        this._sm.registerState(eFrameState.SEND, new FrameStateSend<FrameController>(this))
        this._sm.registerState(eFrameState.SYNC, new FrameStateSync<FrameController>(this))
    }
    public notify(): void {
        this._sm.changeState(eFrameState.NOTIFY)
    }
    public update(dt: number): void {
        if (this._sm) {
            this._sm.update(dt)
        }
    }
    public destroy(): void {
        if (this._sm) {
            this._sm.destory()
            this._sm = null
        }
    }
}

class FrameStateNone<T extends FrameController> extends ak.State<T> {
    public constructor(entity: T) {
        super(entity)
    }
    public enter() {
        ak.Log.debug(' --- enter None --- ')

        this._times = 0
    }
    public update(dt: number) {}

    public exit() {
        ak.Log.debug(' --- exit None --- ')
    }
}

class FrameStateNotify<T extends FrameController> extends ak.State<T> {
    public constructor(entity: T) {
        super(entity)
    }
    public enter() {
        ak.Log.debug(' --- enter Notify --- ')

        this._times = 0
    }
    public update(dt: number) {}

    public exit() {
        ak.Log.debug(' --- exit Notify --- ')
    }
}

class FrameStateSync<T extends FrameController> extends ak.State<T> {
    public constructor(entity: T) {
        super(entity)
    }
    public enter() {
        ak.Log.debug(' --- enter Sync --- ')

        this._times = 0
    }
    public update(dt: number) {}

    public exit() {
        ak.Log.debug(' --- exit Sync --- ')
    }
}
class FrameStateSend<T extends FrameController> extends ak.State<T> {
    public constructor(entity: T) {
        super(entity)
    }
    public enter() {
        ak.Log.debug(' --- enter Send --- ')

        this._times = 0
    }
    public update(dt: number) {}

    public exit() {
        ak.Log.debug(' --- exit Send --- ')
    }
}
