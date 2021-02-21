// import { Log } from "../log/Log";
namespace airkit {
    /**
     * 对象工具类
     * @author ankye
     * @time 2018-7-11
     */

    export class ClassUtils {
        /**@private */
        private static _classMap: any = {};
        /**
         * 注册 Class 映射，方便在class反射时获取。
         * @param	className 映射的名字或者别名。
         * @param	classDef 类的全名或者类的引用，全名比如:"cc.Sprite"。
         */
        static regClass(className: string, classDef: any): void {
            ClassUtils._classMap[className] = classDef;
        }

        /**
         * 根据类名短名字注册类，比如传入[Sprite]，功能同regClass("Sprite",Sprite);
         * @param	classes 类数组
         */
        static regShortClassName(classes: any[]): void {
            for (var i: number = 0; i < classes.length; i++) {
                var classDef: any = classes[i];
                var className: string = classDef.name;
                ClassUtils._classMap[className] = classDef;
            }
        }

        /**
         * 返回注册的 Class 映射。
         * @param	className 映射的名字。
         */
        static getRegClass(className: string): any {
            return ClassUtils._classMap[className];
        }

        /**
         * 根据名字返回类对象。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return 类对象
         */
        static getClass(className: string): any {
            var classObject = ClassUtils._classMap[className] || ClassUtils._classMap["cc." + className] || className;
            return classObject;
        }

        /**
         * 根据名称创建 Class 实例。
         * @param	className 类名(比如Sprite)或者注册的别名(比如Sprite)。
         * @return	返回类的实例。
         */
        static getInstance(className: string): any {
            var compClass: any = ClassUtils.getClass(className);
            if (compClass) return new compClass();
            else console.warn("[error] Undefined class:", className);
            return null;
        }
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
                Log.error("cant find funcName %s from Module:%s", funcName, obj.name);
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
