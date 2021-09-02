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
        public static buildRes(resMap: { [index: string]: {} }): Array<Res> {
            let res = []
            for (let k in resMap) {
                res.push({ url: 'ui/' + k, type: FGUIAsset, refCount: 1, pkg: k })
                for (let k2 in resMap[k]) {
                    res.push({ url: 'ui/' + k2, type: cc.BufferAsset, refCount: resMap[k][k2], pkg: k })
                }
            }
            return res
        }

        /**打开外部链接 xxx */
        public static openURL(url: string): void {
            window.location.href = url
        }
        /**获取当前地址栏参数*/
        public static getLocationParams(): SDictionary<string> {
            let url = window.location.href

            let dic = new SDictionary<string>()
            let num = url.indexOf('?')
            if (num >= 0) {
                url = url.substr(num + 1)
                let key, value
                let arr = url.split('&')
                for (let i in arr) {
                    let str = arr[i]
                    num = str.indexOf('=')
                    key = str.substr(0, num)
                    value = str.substr(num + 1)
                    dic.add(key, value)
                }
            }
            return dic
        }

        /**
         * object转成查询字符串
         * @param obj
         * @returns {string}
         */
        public static obj2query(obj: any): string {
            if (!obj) {
                return ''
            }
            var arr: string[] = []
            for (var key in obj) {
                arr.push(key + '=' + obj[key])
            }
            return arr.join('&')
        }

        public static injectProp(target: Object, data: Object = null, callback: Function = null, ignoreMethod: boolean = true, ignoreNull: boolean = true, keyBefore: string = ''): boolean {
            if (!data) {
                return false
            }

            let result = true
            for (let key in data) {
                let value: any = data[key]
                if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)) {
                    if (callback) {
                        callback(target, key, value)
                    } else {
                        target[key] = value
                    }
                }
            }
            return result
        }

        /**
         * 将字符串解析成 XML 对象。
         * @param value 需要解析的字符串。
         * @return js原生的XML对象。
         */
        static parseXMLFromString: Function = function (value: string): XMLDocument {
            var rst: any
            value = value.replace(/>\s+</g, '><')
            rst = new DOMParser().parseFromString(value, 'text/xml')
            if (rst.firstChild.textContent.indexOf('This page contains the following errors') > -1) {
                throw new Error(rst.firstChild.firstChild.textContent)
            }
            return rst
        }
    }
    /**
     * 位操作
     */
    export class FlagUtils {
        public static hasFlag(a: number, b: number): boolean {
            a = NumberUtils.toInt(a)
            b = NumberUtils.toInt(b)
            return (a & b) == 0 ? false : true
        }

        public static insertFlag(a: number, b: number): number {
            a = NumberUtils.toInt(a)
            b = NumberUtils.toInt(b)
            a |= b
            return a
        }
        public static removeFlag(a: number, b: number): number {
            a = NumberUtils.toInt(a)
            b = NumberUtils.toInt(b)
            a ^= b
            return a
        }
    }
    /**
     * 断言
     */
    export function assert(condition, msg?: string) {
        if (!condition) {
            throw msg || 'assert'
        }
    }
    export function assertNullOrNil(condition, msg?: string) {
        if (condition == null || condition === null || typeof condition === 'undefined') {
            assert(false, msg)
        }
    }
    /**
     * 判空
     */
    export function checkNullOrNil(x): boolean {
        if (x == null) return true
        if (x === null) return true
        if (typeof x === 'undefined') return true
        return false
    }
    export function checkEmptyDic(x: any): boolean {
        if (checkNullOrNil(x)) return true
        if (JSON.stringify(x) == '{}') {
            return true
        }
        return false
    }

    //设置graphics图像alpha值
    export function graphAlpha(g: fgui.GGraph, alpha: number): void {
        let gp = g.node.getComponent(cc.Graphics)
        let color = g.color
        color.a = alpha * 255
        gp.fillColor = color
        gp.stroke()
        gp.fill()
    }
}
