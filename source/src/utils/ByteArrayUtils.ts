/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:04:17
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/utils/ByteArrayUtils.ts
 */
namespace airkit {
    /**
     * 字节工具类
     * @author ankye
     * @time 2018-7-7
     */

    export function bytes2Uint8Array(data: any, endian: string): Uint8Array {
        var bytes: Byte = new Byte(data)
        bytes.endian = endian
        var body: Uint8Array = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos)
        return body
    }
    export function bytes2String(data: any, endian: string): string {
        let body = bytes2Uint8Array(data, endian)
        return uint8Array2String(body)
    }

    // Converts a string to an ArrayBuffer.
    export function string2ArrayBuffer(s: string): ArrayBuffer {
        var buffer = new ArrayBuffer(s.length)
        var bytes = new Uint8Array(buffer)
        for (var i = 0; i < s.length; ++i) {
            bytes[i] = s.charCodeAt(i)
        }
        return buffer
    }

    export function string2Uint8Array(str) {
        var arr = []
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i))
        }
        var tmpUint8Array = new Uint8Array(arr)
        return tmpUint8Array
    }

    export function uint8Array2String(fileData) {
        var dataString = ''
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i])
        }
        return dataString
    }
}
