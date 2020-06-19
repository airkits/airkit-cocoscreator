namespace airkit {
    export interface WSMessage {
        decode(msg: any, endian: string): boolean
        encode(endian: string): any
        getID(): number
    }

    //header
    // uid string
    // cmd string
    // seq int
    // msgType int
    // userdata int
    // payload string
    export class JSONMsg implements WSMessage {
        private static REQ_ID: number = 1
        private ID: number
        public uid: string
        public cmd: string
        public msgType: number
        public data: any
        private static getSeq(): number {
            return JSONMsg.REQ_ID++
        }
        public decode(msg: any, endian: string): boolean {
            let str = bytes2String(msg, endian)
            let m = JSON.parse(str)
            if (m && m.payload) {
                this.uid = m.uid
                this.cmd = m.cmd
                this.msgType = m.msgType
                this.ID = m.userdata
                this.data = JSON.parse(m.payload)
                return true
            }
            str = null
            return false
        }

        public encode(endian: string): any {
            this.ID = JSONMsg.getSeq()
            let msg = {
                uid: this.uid,
                cmd: this.cmd,
                msgType: this.msgType,
                seq: this.ID,
                userdata: this.ID,
                payload: JSON.stringify(this.data)
            }

            return JSON.stringify(msg)
        }
        public getID(): number {
            return this.ID
        }
    }

    export class PBMsg implements WSMessage {
        private receiveByte: Laya.Byte
        private ID: number
        public constructor() {
            this.receiveByte = new Laya.Byte()
            this.receiveByte.endian = Laya.Byte.LITTLE_ENDIAN
        }
        public getID(): number {
            return this.ID
        }
        public decode(msg: any, endian: string): boolean {
            this.receiveByte.clear()
            this.receiveByte.writeArrayBuffer(msg)
            this.receiveByte.pos = 0

            var len = this.receiveByte.getInt16()
            var id = this.receiveByte.getInt16()
            if (this.receiveByte.bytesAvailable >= len) {
                let data: Laya.Byte = new Laya.Byte()
                data.writeArrayBuffer(this.receiveByte, 4, len)
                return true
            }
            return false
        }

        public encode(endian: string): any {
            let msg: Laya.Byte = new Laya.Byte()
            msg.endian = Laya.Byte.LITTLE_ENDIAN
            // msg.writeUint16(data.length + 4)
            // msg.writeUint16(id)
            // msg.writeArrayBuffer(data)
            msg.pos = 0
            return msg
        }
    }
}
