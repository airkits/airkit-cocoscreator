namespace airkit {
  export interface IWSMessage {
    decode(msg: any, endian: string): any;
    encode(endian: string): any;
    setData(v:ArrayBuffer | string):void ;
    getID(): number;
  }

  //header
  // uid string
  // cmd string
  // seq int
  // msgType int
  // userdata int
  // payload string
  export class JSONMsg implements IWSMessage {
    private static REQ_ID: number = 1;
    private ID: number;
    public uid: string;
    public cmd: string;
    public msgType: number;
    public data: any;
    private _protoCls:any;
    constructor(protoCls:any){
      this._protoCls = protoCls;
    }
    private static getSeq(): number {
      return JSONMsg.REQ_ID++;
    }

    public setData(v:string):void {
      this.data = v;
    }
    public decode(msg: any, endian: string): any {
      let str = bytes2String(msg, endian);
      let m = JSON.parse(str);
      if (m && m.payload) {
        this.uid = m.uid;
        this.cmd = m.cmd;
        this.msgType = m.msgType;
        this.ID = m.userdata;
        this.data = JSON.parse(m.payload);
        return this.data;
      }
      str = null;
      return str;
    }

    public encode(endian: string): any {
      this.ID = JSONMsg.getSeq();
      let msg = {
        uid: this.uid,
        cmd: this.cmd,
        msgType: this.msgType,
        seq: this.ID,
        userdata: this.ID,
        payload: JSON.stringify(this.data),
      };

      return JSON.stringify(msg);
    }
    public getID(): number {
      return this.ID;
    }
  }
  export class PBMsg implements IWSMessage {
    private receiveByte: Byte;
    private ID: number;
    private data: ArrayBuffer;
    private _protoCls:any;
    public constructor(protoCls:any) {
      this._protoCls = protoCls;
      this.receiveByte = new Byte();
      this.receiveByte.endian = Byte.BIG_ENDIAN;
    
    }
    public setData(v:ArrayBuffer):void {
      this.data = v;
    }
   
    public getID(): number {
      return this.ID;
    }
    public decode(msg: any, endian: string): any {
      this.receiveByte.clear();
      this.receiveByte.writeArrayBuffer(msg);
      this.receiveByte.pos = 0;

      var len = this.receiveByte.getUint32();
      if (this.receiveByte.bytesAvailable >= len-4) {
        if(this._protoCls){
           return this._protoCls.decode(this.receiveByte.getUint8Array(4,len-4));
        }
        
        return this.receiveByte.getUint8Array(4,len-4);
      }
      return null;
    }

    public encode(endian: string): any {
      let msg: Byte = new Byte();
      msg.endian = Byte.BIG_ENDIAN;
      msg.writeUint32( this.data.byteLength + 4)
      msg.writeArrayBuffer(this.data)
      msg.pos = 0;
      return msg.buffer;
    }
  }
}
