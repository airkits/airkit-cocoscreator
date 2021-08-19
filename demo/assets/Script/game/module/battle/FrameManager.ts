export class FrameManager {
    public stateNone: FrameStateNone<FrameManager>
    public stateNotify: FrameStateNotify<FrameManager>
    public stateSync: FrameStateSync<FrameManager>
    public stateSend: FrameStateSend<FrameManager>

    private stateMachine: ak.StateMachine<FrameManager>

    constructor() {
        this.stateMachine = new ak.StateMachine<FrameManager>()
    }
    public notify(): void {}
}

class FrameStateNone<T extends FrameManager> extends ak.State<T> {
    public constructor(entity: T, status: number) {
        super(entity, status)
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

class FrameStateNotify<T extends FrameManager> extends ak.State<T> {
    public constructor(entity: T, status: number) {
        super(entity, status)
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

class FrameStateSync<T extends FrameManager> extends ak.State<T> {
    public constructor(entity: T, status: number) {
        super(entity, status)
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
class FrameStateSend<T extends FrameManager> extends ak.State<T> {
    public constructor(entity: T, status: number) {
        super(entity, status)
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
