
  export class PBMsg implements ak.WSMessage {
    private receiveByte: ak.Byte;
    private ID: number;
    public constructor() {
      this.receiveByte = new ak.Byte();
      this.receiveByte.endian = ak.Byte.LITTLE_ENDIAN;
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
        let data: ak.Byte = new ak.Byte();
        data.writeArrayBuffer(this.receiveByte, 4, len);
        return true;
      }
      return false;
    }

    public encode(endian: string,data?:ArrayBuffer): any {
      let msg: ak.Byte = new ak.Byte();
      msg.endian =ak.Byte.LITTLE_ENDIAN;
      msg.writeArrayBuffer(data)
      msg.pos = 0;
      return msg;
    }
  }