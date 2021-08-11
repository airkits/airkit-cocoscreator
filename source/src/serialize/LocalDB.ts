/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:24
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/serialize/LocalDB.ts
 */
/**
 * 本地数据
 * @author ankye
 * @time 2018-7-15
 */
namespace airkit {
    export class LocalDB {
        private static _globalKey: string = ''

        /**
         * 设置全局id，用于区分同一个设备的不同玩家
         * @param	key	唯一键，可以使用玩家id
         */
        public static setGlobalKey(key: string): void {
            this._globalKey = key
        }
        public static has(key: string): boolean {
            return cc.sys.localStorage.getItem(this.getFullKey(key)) != null
        }

        public static getInt(key: string): number {
            return parseInt(cc.sys.localStorage.getItem(this.getFullKey(key)))
        }
        public static setInt(key: string, value: number): void {
            cc.sys.localStorage.setItem(this.getFullKey(key), value.toString())
        }

        public static getFloat(key: string): number {
            return parseInt(cc.sys.localStorage.getItem(this.getFullKey(key)))
        }
        public static setFloat(key: string, value: number): void {
            cc.sys.localStorage.setItem(this.getFullKey(key), value.toString())
        }

        public static getString(key: string): string {
            return cc.sys.localStorage.getItem(this.getFullKey(key))
        }
        public static setString(key: string, value: string): void {
            cc.sys.localStorage.setItem(this.getFullKey(key), value)
        }

        public static remove(key: string) {
            cc.sys.localStorage.removeItem(this.getFullKey(key))
        }

        public static clear(): void {
            cc.sys.localStorage.clear()
        }

        private static getFullKey(key: string): string {
            return this._globalKey + '_' + key
        }
    }
}
