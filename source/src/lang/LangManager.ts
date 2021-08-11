/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:41
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/lang/LangManager.ts
 */
namespace airkit {
    export interface CLang {
        id: string
        name: string
    }

    /**
     * 提供简易获取语言包的方式,配合语言导出脚本
     * @param key LK.xxx  %s,%s..%s.表示参数占位符
     * @param args
     */
    export function L(key: string, ...args): string {
        let info = getCInfo<CLang>(LangManager.lang, key)
        if (info == null) return 'unknown key:' + key
        if (StringUtils.isNullOrEmpty(info.name)) return ''
        return StringUtils.format(info.name, ...args)
    }

    /**
     * 多语言
     * @author ankye
     * @time 2017-7-9
     */
    export class LangManager extends Singleton {
        public static lang: string = 'zh_cn.json' // 语言包
        //设置语言包
        public static setLang(lang: string): boolean {
            let data = ConfigManger.Instance.query(this.lang)
            if (data == null) {
                Log.error('set lang %s failed ', lang)
                return false
            }
            this.lang = lang
            EventCenter.dispatchEvent(EventID.UI_LANG, this.lang)
            return true
        }
    }
}
