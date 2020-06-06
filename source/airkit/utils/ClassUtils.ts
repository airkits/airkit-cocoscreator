// import { Log } from "../log/Log";
namespace airkit {
    /**
     * 对象工具类
     * @author ankye
     * @time 2018-7-11
     */

    export class ClassUtils {
        /**深复制一个对象*/
        public static copyObject(obj: any): any {
            let js = JSON.stringify(obj);
            return JSON.parse(js);
        }
        /**获取一个对象里的值*/
        public static getObjectValue(obj: any, key: string, defVal?: any): any {
            if (obj[key]) {
                return obj[key];
            }
            return defVal;
        }

        public static callFunc(obj: any, funcName: string, args: any[] = null): any {
            if (funcName == null) {
                return;
            }
            var func: Function = obj[funcName];
            let result = null;
            if (func) {
                if (args == null) {
                    result = func.apply(obj);
                } else {
                    result = func.apply(obj, args);
                }
            } else {
                Log.error("cant find funcName {0} from Module:{1}", funcName, obj.name);
            }
            return result;
        }

        public static classKey(obj: any): string {
            let proto: any = Object.getPrototypeOf(obj);
            let clazz: any = proto["constructor"];
            let sign: string = clazz["objectKey"];
            return sign;
        }
    }
}
