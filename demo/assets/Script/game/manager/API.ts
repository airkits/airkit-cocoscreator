
// export class API extends ak.Singleton {
//     //请求ID，自增，负数以后重置
//     public static REQUEST_ID: number = 0
//     public static REQUEST_MAP = {}
//     public static RESPONSE_MAP = {}


//     private static instance: API = null
//     public static get Instance(): API {
//         if (!this.instance) this.instance = new API()
//         return this.instance
//     }

//     constructor() {
//         super()


//     }
//     /**在这做数据初始化*/
//     public init(): void {
  
//         API.REQUEST_ID = 0
      
//         API.registerProto()
//     }
//     //公用方法，用于创建消息体
//     public static registerProto(): void {

//          //设置支持64位long
//          protobuf.util.Long = pb.Long
//          protobuf.configure()

//         let list = [
//             [c2s.MessageCmd.JOIN_ROOM, c2s.JoinRoomReq, c2s.JoinRoomResp],
         
//         ]

//         for (let i = 0; i < list.length; i++) {
//             let v = list[i]
//             let key = v[0] as c2s.MessageCmd
//             this.REQUEST_MAP[key] = v[1]
//             this.RESPONSE_MAP[key] = v[2]
//         }

//     }
//     public static packetMessage(uid: number,messageID: c2s.MessageCmd, req: any): ArrayBuffer {
//         let msg = new cs.Message()
//         msg.seq = this.reqID()
//         msg.msgType = cs.MessageType.Request;
//         msg.UID = uid;
//         msg.cmd = "JOIN_ROOM";
//         let cls = this.REQUEST_MAP[messageID]
//         let bodyBuf = cls.encode(req).finish()
//         ak.Log.info("Request Body buffer: %s ", bodyBuf.toString())
//         msg.body = {type_url: "./c2s.JoinRoomReq", value: bodyBuf} 
//         let buffer = cs.Message.encode(msg).finish() //Uint8Array
//         return this.buffer(buffer);
//     }

//     public static buffer(src: Uint8Array):ArrayBuffer{
//        return src.buffer.slice(src.byteOffset, src.byteOffset + src.byteLength)
//     }

//     public static unpackMessage(data: ArrayBuffer): any {
//         var bytes = new airkit.Byte(data);
//         bytes.endian = airkit.Byte.BIG_ENDIAN;
//         var buffer = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos);

//         let resp = cs.Message.decode(buffer)

//         if (resp.msgType == cs.MessageType.Response) {
//             let cls = this.RESPONSE_MAP[resp.cmd]
//             let body = cls.decode(resp.body.value);
//             ak.Log.info("Response Body Length: %s", resp.body.value.buffer.byteLength.toString())
//             ak.Log.info("Response Body buffer: %s ", resp.body.toString())
//             return cls.toObject(body, { defaults: true, longs: String })
//         }
//     }


  
   
//     public static reqID(): number {
//         let id = this.REQUEST_ID++
//         if (id < 0) id = 0
//         return id
//     }


//     /**在这清空数据，尤其是列表等保存的数据*/
//     public release(): void {

//     }



// }
