/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:56
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/config/ConfigItem.ts
 */
namespace airkit {
    /**
     * 配置表
     * @author ankye
     * @time 2018-7-11
     */

    export class ConfigItem {
        public url: string //资源url
        public name: string //名称：用于查找
        public key: any //表的主键

        constructor(url: string, name: string, key: any) {
            this.url = url
            this.name = name
            this.key = key
        }
    }
}
