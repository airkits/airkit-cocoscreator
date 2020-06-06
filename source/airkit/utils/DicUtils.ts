/**
 * 字典工具类
 * @author ankye
 * @time 2018-7-6
 */
namespace airkit {
    export class DicUtils {
        /**
         * 键列表
         */
        public static getKeys(d: Object): any[] {
            let a: any[] = [];
            for (let key in d) {
                a.push(key);
            }

            return a;
        }

        /**
         * 值列表
         */
        public static getValues(d: Object): any[] {
            let a: any[] = [];

            for (let key in d) {
                a.push(d[key]);
            }

            return a;
        }

        /**
         * 清空字典
         */
        public static clearDic(dic: Object): void {
            let v: any;
            for (let key in dic) {
                v = dic[key];
                if (v instanceof Object) {
                    DicUtils.clearDic(v);
                }
                delete dic[key];
            }
        }

        /**
         * 全部应用
         */
        public static foreach(dic: Object, compareFn: (key: any, value: any) => boolean): void {
            for (let key in dic) {
                if (!compareFn.call(null, key, dic[key])) break;
            }
        }

        public static isEmpty(dic: Object): Boolean {
            if (dic == null) return true;

            for (let key in dic) {
                return false;
            }
            return true;
        }

        public static getLength(dic: Object): number {
            if (dic == null) return 0;

            let count: number = 0;
            for (let key in dic) {
                ++count;
            }
            return count;
        }

        public static assign(obj: any, dic: any): void {
            (<any>Object).assign(obj, dic);
        }
    }
}
