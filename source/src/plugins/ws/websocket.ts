namespace airkit {
    export class SocketStatus {
        static SOCKET_CONNECT: string = "1";
        static SOCKET_RECONNECT: string = "2";
        static SOCKET_START_RECONNECT: string = "3";
        static SOCKET_CLOSE: string = "4";
        static SOCKET_NOCONNECT: string = "5";
        static SOCKET_DATA: string = "6";
    }
    export enum eSocketMsgType {
        // MTRequest request =1
        MTRequest = 1,
        // MTResponse response = 2
        MTResponse = 2,
        // MTNotify notify = 3
        MTNotify = 3,
        // MTBroadcast broadcast = 4
        MTBroadcast = 4,
    }
    export class WebSocketEx extends cc.Node {
        private mSocket: WebSocket = null;
        private mEndian: string;

        private _needReconnect: boolean = false;
        private _maxReconnectCount = 10;
        private _reconnectCount: number = 0;
        private _connectFlag: boolean;
        private _isConnecting: boolean;
        private _handers: NDictionary<any>;
        private _requestTimeout: number = 10 * 1000; //10s
        //消息类
        private _msgCls: any;
        //协议类
        private _protoCls: any;
        private _remoteAddress: string;
        constructor() {
            super();
        }
        /**
         * 
         * @param address ws://host:port?token=aaaa
         * @param msgCls 
         * @param endian 
         * @returns 
         */
        public initServer(address:string, endian: string = Byte.BIG_ENDIAN): Promise<boolean> {
          
            //ws://192.168.0.127:8080
            this._remoteAddress = address;
            this.mEndian = endian;
            this._handers = new NDictionary<any>();
            return this.connect();
        }
        //协议类
        public setProtoCls(msgCls:any,protoCls?:any):void {
            this._msgCls = msgCls;
            this._protoCls = protoCls;
        }
        public connect(): Promise<boolean>{
            this.mSocket = new WebSocket(this._remoteAddress);
            this.mSocket.binaryType = "arraybuffer";
            // this.mSocket.binaryType = this.mEndian;
            this.addEvents();
            return this.wait()
        }

        private wait(): Promise<boolean> {
            return new Promise((resolve: any, reject: any) => {
                let cbConnect = ()=>{
                    this.off(SocketStatus.SOCKET_RECONNECT,cbReconnect,this);
                    resolve(true);
                };
                let cbReconnect = ()=>{
                    this.off(SocketStatus.SOCKET_CONNECT,cbConnect,this);
                    reject(false);
                };
                  
                this.once(SocketStatus.SOCKET_RECONNECT, cbReconnect,this);
                this.once(SocketStatus.SOCKET_CONNECT, cbConnect,this);
            })
        }
        private addEvents() {
    
            this.mSocket.onopen = this.onSocketOpen.bind(this);
            this.mSocket.onclose = this.onSocketClose.bind(this);
            this.mSocket.onerror = this.onSocketError.bind(this);
            this.mSocket.onmessage = this.onReceiveMessage.bind(this);
        }

        private removeEvents(): void {}

        private onSocketOpen(event: any = null): void {
            this._reconnectCount = 0;
            this._isConnecting = true;
            if (this._connectFlag && this._needReconnect) {
                this.emit(SocketStatus.SOCKET_RECONNECT,this._reconnectCount);
            } else {
                this.emit(SocketStatus.SOCKET_CONNECT);
            }

            this._connectFlag = true;
        }

        private onSocketClose(e: any = null): void {
            this._isConnecting = false;

            if (this._needReconnect) {
                this.emit(SocketStatus.SOCKET_START_RECONNECT);
                this.reconnect();
            } else {
                this.emit(SocketStatus.SOCKET_CLOSE);
            }
        }

        private onSocketError(e: any = null): void {
            if (this._needReconnect) {
                this.reconnect();
            } else {
                this.emit(SocketStatus.SOCKET_NOCONNECT);
            }
            this._isConnecting = false;
        }

        private reconnect(): void {
            this.closeCurrentSocket();
            this._reconnectCount++;
            if (this._reconnectCount < this._maxReconnectCount) {
                this.connect();
            } else {
                this._reconnectCount = 0;
            }
        }

        private onReceiveMessage(msg: MessageEvent = null): void {
            if(!msg || !msg.data) return;
            let obj = new this._msgCls(this._protoCls) as IWSMessage;
            if(!obj){
                return;
            }
            let message = obj.decode(msg.data, this.mEndian);

            if (message == null) {
                Log.error("decode msg faild %s", msg.data);
                return;
            }
          
            let hander = this._handers.getValue(obj.getID());
            if (hander) {
                hander(obj);
            } else {
                this.emit(SocketStatus.SOCKET_DATA, obj);
            }
        }

        
        public request(req: IWSMessage): Promise<any> {
            return new Promise((resolve, reject) => {
                var buf: any = req.encode(this.mEndian);
                let handerID = req.getID();
                if (buf) {
                    let id = TimerManager.Instance.addOnce(this._requestTimeout, null, () => {
                        this._handers.remove(handerID);
                        reject("timeout");
                    });
                    this._handers.add(handerID, (resp: IWSMessage) => {
                        TimerManager.Instance.removeTimer(id);
                        resolve(resp);
                    });
                    Log.info("start request ws %s", buf);
                    this.mSocket.send(buf);
                }
            });
        }

        public close(): void {
            this._connectFlag = false;
            this._handers.clear();
            this.closeCurrentSocket();
        }

        private closeCurrentSocket() {
            this.removeEvents();
            this.mSocket.close();
            this.mSocket = null;
            this._isConnecting = false;
        }

        public isConnecting(): boolean {
            return this._isConnecting;
        }
    }
}
