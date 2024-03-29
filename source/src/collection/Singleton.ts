/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:42
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/Singleton.ts
 */
//import { Log } from "../log/Log";
namespace airkit {
    /**
     * 单列
     * @author ankye
     * @time 2018-7-6
     */
    export class Singleton {
        private static classKeys: Function[] = []
        private static classValues: any[] = []

        constructor() {
            let clazz: any = this['constructor']
            //为空时，表示浏览器不支持这样读取构造函数
            if (!clazz) {
                Log.warning('浏览器不支持读取构造函数')
                return
            }
            // 防止重复实例化
            if (Singleton.classKeys.indexOf(clazz) != -1) {
                throw new Error(this + ' 只允许实例化一次！')
            } else {
                Singleton.classKeys.push(clazz)
                Singleton.classValues.push(this)
            }
        }
    }
}
