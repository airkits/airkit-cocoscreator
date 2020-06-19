namespace airkit {
    export class SocketStatus {
        static SOCKET_CONNECT: string = "1"
        static SOCKET_RECONNECT: string = "2"
        static SOCKET_START_RECONNECT: string = "3"
        static SOCKET_CLOSE: string = "4"
        static SOCKET_NOCONNECT: string = "5"
        static SOCKET_DATA: string = "6"
    }
    export enum eSocketMsgType {
        // MTRequest request =1
        MTRequest = 1,
        // MTResponse response = 2
        MTResponse = 2,
        // MTNotify notify = 3
        MTNotify = 3,
        // MTBroadcast broadcast = 4
        MTBroadcast = 4
    }
    export class WebSocket extends Laya.EventDispatcher {
        private mSocket: Laya.Socket = null
        private mHost: string
        private mPort: any
        private mEndian: string

        private _needReconnect: boolean = false
        private _maxReconnectCount = 10
        private _reconnectCount: number = 0
        private _connectFlag: boolean
        private _isConnecting: boolean
        private _handers: NDictionary<any>
        private _requestTimeout: number = 10 * 1000 //10s
        private _clsName: string

        constructor() {
            super()
        }

        public initServer(host: string, port: any, msgCls: any, endian: string = Laya.Byte.BIG_ENDIAN): void {
            this.mHost = host
            this.mPort = port

            this.mEndian = endian
            this._handers = new NDictionary<any>()
            this._clsName = "message"
            Laya.ClassUtils.regClass(this._clsName, msgCls)
            this.connect()
        }
        public connect(): void {
            this.mSocket = new Laya.Socket()
            this.mSocket.endian = this.mEndian
            this.addEvents()
            this.mSocket.connect(this.mHost, this.mPort)
        }

        private addEvents() {
            this.mSocket.on(Laya.Event.OPEN, this, this.onSocketOpen)
            this.mSocket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage)
            this.mSocket.on(Laya.Event.CLOSE, this, this.onSocketClose)
            this.mSocket.on(Laya.Event.ERROR, this, this.onSocketError)
        }

        private removeEvents(): void {
            this.mSocket.off(Laya.Event.OPEN, this, this.onSocketOpen)
            this.mSocket.off(Laya.Event.MESSAGE, this, this.onReceiveMessage)
            this.mSocket.off(Laya.Event.CLOSE, this, this.onSocketClose)
            this.mSocket.off(Laya.Event.ERROR, this, this.onSocketError)
        }

        private onSocketOpen(event: any = null): void {
            this._reconnectCount = 0
            this._isConnecting = true
            if (this._connectFlag && this._needReconnect) {
                this.event(SocketStatus.SOCKET_RECONNECT)
            } else {
                this.event(SocketStatus.SOCKET_CONNECT)
            }

            this._connectFlag = true
        }

        private onSocketClose(e: any = null): void {
            this._isConnecting = false

            if (this._needReconnect) {
                this.event(SocketStatus.SOCKET_START_RECONNECT)
                this.reconnect()
            } else {
                this.event(SocketStatus.SOCKET_CLOSE)
            }
        }

        private onSocketError(e: any = null): void {
            if (this._needReconnect) {
                this.reconnect()
            } else {
                this.event(SocketStatus.SOCKET_NOCONNECT)
            }
            this._isConnecting = false
        }

        private reconnect(): void {
            this.closeCurrentSocket()
            this._reconnectCount++
            if (this._reconnectCount < this._maxReconnectCount) {
                this.connect()
            } else {
                this._reconnectCount = 0
            }
        }

        private onReceiveMessage(msg: any = null): void {
            let clas = Laya.ClassUtils.getClass(this._clsName)
            let obj = new clas() as WSMessage
            if (!obj.decode(msg, this.mEndian)) {
                Log.error("decode msg faild {0}", msg)
                return
            }
            let hander = this._handers.getValue(obj.getID())
            if (hander) {
                hander(obj)
            } else {
                this.event(SocketStatus.SOCKET_DATA, obj)
            }
        }

        public request(req: WSMessage): Promise<any> {
            return new Promise((resolve, reject) => {
                var buf: any = req.encode(this.mEndian)
                let handerID = req.getID()
                if (buf) {
                    let id = TimerManager.Instance.addOnce(this._requestTimeout, null, () => {
                        this._handers.remove(handerID)
                        reject("timeout")
                    })
                    this._handers.add(handerID, (resp: WSMessage) => {
                        TimerManager.Instance.removeTimer(id)
                        resolve(resp)
                    })
                    Log.info("start request ws {0}", buf)
                    this.mSocket.send(buf)
                }
            })
        }

        public close(): void {
            this._connectFlag = false
            this._handers.clear()
            this.closeCurrentSocket()
        }

        private closeCurrentSocket() {
            this.removeEvents()
            this.mSocket.close()
            this.mSocket = null
            this._isConnecting = false
        }

        public isConnecting(): boolean {
            return this._isConnecting
        }
    }
}
