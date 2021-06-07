namespace airkit {
  export interface WSMessage {
    decode(msg: any, endian: string): boolean;
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
  export class JSONMsg implements WSMessage {
    private static REQ_ID: number = 1;
    private ID: number;
    public uid: string;
    public cmd: string;
    public msgType: number;
    public data: any;
    private static getSeq(): number {
      return JSONMsg.REQ_ID++;
    }

    public setData(v:string):void {
      this.data = v;
    }
    public decode(msg: any, endian: string): boolean {
      let str = bytes2String(msg, endian);
      let m = JSON.parse(str);
      if (m && m.payload) {
        this.uid = m.uid;
        this.cmd = m.cmd;
        this.msgType = m.msgType;
        this.ID = m.userdata;
        this.data = JSON.parse(m.payload);
        return true;
      }
      str = null;
      return false;
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
  export class PBMsg implements WSMessage {
    private receiveByte: Byte;
    private ID: number;
    private data: ArrayBuffer;
    public constructor() {
      this.receiveByte = new Byte();
      this.receiveByte.endian = Byte.LITTLE_ENDIAN;
    
    }
    public setData(v:ArrayBuffer):void {
      this.data = v;
    }
    public getID(): number {
      return this.ID;
    }
    public decode(msg: any, endian: string): boolean {
      this.receiveByte.clear();
      this.receiveByte.writeArrayBuffer(msg);
      this.receiveByte.pos = 0;

      var len = this.receiveByte.getInt16();
      var id = this.receiveByte.getInt16();
      if (this.receiveByte.bytesAvailable >= len) {
        let data: Byte = new Byte();
        data.writeArrayBuffer(this.receiveByte, 4, len);
        return true;
      }
      return false;
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
