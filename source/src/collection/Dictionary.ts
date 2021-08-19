// import { Log } from "../log/Log";
// import { StringUtils } from "../utils/StringUtils";
// import { DicUtils } from "../utils/DicUtils";
namespace airkit {
    /**
     * 字典-键为number
     * TODO:Object的键不支持泛型
     * @author ankye
     * @time 2018-7-6
     */
    export class NDictionary<TValue> {
        private _dic: Object = {}

        public add(key: number, value: TValue): boolean {
            if (this.has(key)) {
                Log.warning('NDictionary already containsKey ', key.toString())
                return false
            }
            this._dic[key] = value
            return true
        }
        public remove(key: number): void {
            delete this._dic[key]
        }
        public set(key: number, value: TValue) {
            this._dic[key] = value
        }
        public has(key: number): boolean {
            return this._dic[key] != null ? true : false
        }
        public getValue(key: number): TValue {
            if (!this.has(key)) return null
            return this._dic[key]
        }
        public clear(): void {
            for (let key in this._dic) {
                delete this._dic[key]
            }
        }
        public getkeys(): Array<number> {
            let list: Array<number> = []
            for (let key in this._dic) {
                list.push(StringUtils.toNumber(key))
            }
            return list
        }
        public getValues(): Array<TValue> {
            let list: Array<TValue> = []
            for (let key in this._dic) {
                list.push(this._dic[key])
            }
            return list
        }
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        public foreach(compareFn: (key: number, value: TValue) => boolean): void {
            for (let key in this._dic) {
                if (!compareFn.call(null, key, this._dic[key])) break
            }
        }
        public get length(): number {
            return DicUtils.getLength(this._dic)
        }
    }
    /**
     * 字典-键为string
     * @author ankye
     * @time 2018-7-6
     */
    export class SDictionary<TValue> {
        private _dic: Object = {}

        public add(key: string, value: TValue): boolean {
            if (this.has(key)) return false
            this._dic[key] = value
            return true
        }

        public set(key: string, value: TValue) {
            this._dic[key] = value
        }
        public remove(key: string): void {
            delete this._dic[key]
        }

        public has(key: string): boolean {
            return this._dic[key] != null ? true : false
        }

        public getValue(key: string): TValue {
            if (!this.has(key)) return null
            return this._dic[key]
        }

        public getkeys(): Array<string> {
            let list: Array<string> = []
            for (let key in this._dic) {
                list.push(key)
            }
            return list
        }
        public getValues(): Array<TValue> {
            let list: Array<TValue> = []
            for (let key in this._dic) {
                list.push(this._dic[key])
            }
            return list
        }
        public clear(): void {
            for (let key in this._dic) {
                delete this._dic[key]
            }
        }
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        public foreach(compareFn: (key: string, value: TValue) => boolean): void {
            for (let key in this._dic) {
                if (!compareFn.call(null, key, this._dic[key])) break
            }
        }
        public get length(): number {
            return DicUtils.getLength(this._dic)
        }
    }
}
