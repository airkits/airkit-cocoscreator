/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:15
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/plugins/ws/message.ts
 */
namespace airkit {
    export interface IWSMessage {
        unpack(msg: ArrayBuffer, endian: string): IWSMessage
        pack(req: any, endian: string): ArrayBuffer
        getID(): number
    }

    // export class PBMsg implements IWSMessage {
    //   private receiveByte: Byte;
    //   private ID: number;
    //   private data: ArrayBuffer;
    //   public constructor() {
    //     this.receiveByte = new Byte();
    //     this.receiveByte.endian = Byte.BIG_ENDIAN;

    //   }
    //   public setData(v:ArrayBuffer):void {
    //     this.data = v;
    //   }

    //   public getID(): number {
    //     return this.ID;
    //   }
    //   public unpack(msg: ArrayBuffer, endian: string): any {
    //     this.receiveByte.clear();
    //     this.receiveByte.writeArrayBuffer(msg);
    //     this.receiveByte.pos = 0;

    //     var len = this.receiveByte.getUint32();
    //     if (this.receiveByte.bytesAvailable >= len-4) {

    //       return this.receiveByte.getUint8Array(4,len-4);
    //     }
    //     return null;
    //   }

    //   public pack(endian: string): any {
    //     let msg: Byte = new Byte();
    //     msg.endian = Byte.BIG_ENDIAN;
    //     msg.writeUint32( this.data.byteLength + 4)
    //     msg.writeArrayBuffer(this.data)
    //     msg.pos = 0;
    //     return msg.buffer;
    //   }
    // }
}
