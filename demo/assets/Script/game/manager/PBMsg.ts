
  export interface IProtoData {
    
    /** Message UID. */
    uid: (number|Long);
    /** Message msgID. */
    msgID: number;
    
    msgType: cs.MessageType;
    //body typeurl
    typeUrl: string;
    /** Message body. */
    body?:{ [k: string]: any };
  }
  export class PBMsg extends cs.Message implements ak.IWSMessage {

    //请求ID，自增，负数以后重置
    public static REQUEST_ID: number = 0
    public static REQUEST_MAP = {}
    public static RESPONSE_MAP = {}

    private _receiveByte: ak.Byte;
    // private data: ArrayBuffer;
    constructor(properties?: cs.IMessage){
        super(properties);
         this._receiveByte = new ak.Byte();
        // this.receiveByte.endian = ak.Byte.BIG_ENDIAN;
    
    }
    //公用方法，用于创建消息体
    public static registerProto(): void {

        //设置支持64位long
        protobuf.util.Long = pb.Long
        protobuf.configure()
        this.REQUEST_ID = 100;
        let list = [
            [c2s.MessageCmd.JOIN_ROOM, c2s.JoinRoomReq, c2s.JoinRoomResp],
            [c2s.MessageCmd.FRAME, c2s.FrameReq, c2s.FrameResp],
        ]

        for (let i = 0; i < list.length; i++) {
            let v = list[i]
            let key = v[0] as c2s.MessageCmd
            this.REQUEST_MAP[key] = v[1]
            this.RESPONSE_MAP[key] = v[2]
        }

   }
   
    public getID(): number {
      return this.ID;
    }
    public unpack(msg: ArrayBuffer, endian: string): any {
        this._receiveByte.endian = endian;
        this._receiveByte.clear();
        this._receiveByte.writeArrayBuffer(msg);
        this._receiveByte.pos = 0;

        var len = this._receiveByte.getUint32();
        if (this._receiveByte.bytesAvailable >= len-4) {
            let buf = this._receiveByte.getUint8Array(4,len-4);
            let msg = cs.Message.decode(buf);
            this.ID = msg.ID;
            this.UID = msg.UID;
            this.msgID = msg.msgID;
            this.seq = msg.seq;
            this.msgType = msg.msgType;
            this.options = msg.options;
            let cls = null;
            if(msg.msgType == cs.MessageType.Response){
                cls = PBMsg.RESPONSE_MAP[msg.msgID];
            }else if(msg.msgType == cs.MessageType.Broadcast){
                cls = PBMsg.RESPONSE_MAP[msg.msgID];
            }
            let body = cls.decode(msg.body.value);
       //     ak.Log.info("Response Body Length: %s", msg.body.value.buffer.byteLength.toString());
         //   ak.Log.info("Response Body buffer: %s ", msg.body.toString());
            this.body = body;
           // return cls.toObject(body, { defaults: true, longs: String });
            return body;
        }
        return null;
    }
    public static incID():number {
        return this.REQUEST_ID++;
    }
    public pack(data:IProtoData, endian: string): ArrayBuffer {
        this.msgType = data.msgType;
        this.UID = data.uid;
        this.msgID = data.msgID;
        this.seq = PBMsg.incID();
        this.ID = this.seq;
        let cls = PBMsg.REQUEST_MAP[data.msgID]
        let bodyBuf = cls.encode(data.body).finish()
      //  ak.Log.info("Request Body buffer: %s ", bodyBuf.toString())
        this.body = {type_url: data.typeUrl, value: bodyBuf} 
        let buffer = cs.Message.encode(this).finish() //Uint8Array
        let msg: ak.Byte = new ak.Byte();
        msg.endian = endian;
        msg.writeUint32(buffer.length + 4);
        msg.writeArrayBuffer(PBMsg.buffer(buffer));
        msg.pos = 0;
                   
        return msg.buffer;

    }

    public static buffer(src: Uint8Array):ArrayBuffer{
        return src.buffer.slice(src.byteOffset, src.byteOffset + src.byteLength)
    }
}

