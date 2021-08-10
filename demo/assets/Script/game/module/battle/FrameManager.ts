
export class FrameManager {

	public stateNone: FrameStateNone<FrameManager>
	private stateMachine: ak.StateMachine<FrameManager>

    constructor() {
        this.stateMachine = new ak.StateMachine<FrameManager>();
    }

}

class FrameStateNone<T extends FrameManager > extends ak.State<T> {
    public constructor(entity: T, status: number) {
        super(entity, status)
    }
    public enter() {
        ak.Log.debug(" --- enter None --- ")

        this._times = 0
    }
    public update(dt: number) {
       
    }

    public exit() {
        ak.Log.debug(" --- exit None --- ")
    }
}