// import { SDictionary } from "../collection/Dictionary";
// import { Log } from "../log/Log";
// import { NumberUtils } from "./NumberUtils";
namespace airkit {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */
    export class Utils {
        /**打开外部链接，如https://ask.laya.ui.Box.com/xxx*/
        public static openURL(url: string): void {
            window.location.href = url;
        }
        /**获取当前地址栏参数*/
        public static getLocationParams(): SDictionary<string> {
            let url = window.location.href;

            let dic = new SDictionary<string>();
            let num = url.indexOf("?");
            if (num >= 0) {
                url = url.substr(num + 1);
                let key, value;
                let arr = url.split("&");
                for (let i in arr) {
                    let str = arr[i];
                    num = str.indexOf("=");
                    key = str.substr(0, num);
                    value = str.substr(num + 1);
                    dic.add(key, value);
                }
            }
            return dic;
        }

        /**
         * object转成查询字符串
         * @param obj
         * @returns {string}
         */
        public static obj2query(obj: any): string {
            if (!obj) {
                return "";
            }
            var arr: string[] = [];
            for (var key in obj) {
                arr.push(key + "=" + obj[key]);
            }
            return arr.join("&");
        }

        public static injectProp(
            target: Object,
            data: Object = null,
            callback: Function = null,
            ignoreMethod: boolean = true,
            ignoreNull: boolean = true,
            keyBefore: string = ""
        ): boolean {
            if (!data) {
                return false;
            }

            let result = true;
            for (let key in data) {
                let value: any = data[key];
                if ((!ignoreMethod || typeof value != "function") && (!ignoreNull || value != null)) {
                    if (callback) {
                        callback(target, key, value);
                    } else {
                        target[key] = value;
                    }
                }
            }
            return result;
        }
    }
    /**
     * 位操作
     */
    export class FlagUtils {
        public static hasFlag(a: number, b: number): boolean {
            a = NumberUtils.toInt(a);
            b = NumberUtils.toInt(b);
            return (a & b) == 0 ? false : true;
        }

        public static insertFlag(a: number, b: number): number {
            a = NumberUtils.toInt(a);
            b = NumberUtils.toInt(b);
            a |= b;
            return a;
        }
        public static removeFlag(a: number, b: number): number {
            a = NumberUtils.toInt(a);
            b = NumberUtils.toInt(b);
            a ^= b;
            return a;
        }
    }
    /**
     * 断言
     */
    export function assert(condition, msg?: string) {
        if (!condition) {
            throw msg || "assert";
        }
    }
    export function assertNullOrNil(condition, msg?: string) {
        if (condition == null || condition === null || typeof condition === "undefined") {
            assert(false, msg);
        }
    }
    /**
     * 判空
     */
    export function checkNullOrNil(x): boolean {
        if (x == null) return true;
        if (x === null) return true;
        if (typeof x === "undefined") return true;
        return false;
    }
    export function checkEmptyDic(x: any): boolean {
        if (checkNullOrNil(x)) return true;
        if (JSON.stringify(x) == "{}") {
            return true;
        }
        return false;
    }
}
