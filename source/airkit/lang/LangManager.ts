// import { DataProvider } from "../config/DataProvider";
// import { Log } from "../log/Log";
// import { EventCenter } from "../event/EventCenter";
// import { Singleton } from "../collection/Singleton";
// import { ConfigItem } from "../config/ConfigItem";
// import { ArrayUtils } from "../utils/ArrayUtils";
// import { EventID } from "../event/EventID";
// import { SDictionary } from "../collection/Dictionary";
// import { StringUtils } from "../utils/StringUtils";
// import { ConfigManger } from "../config/ConfigManager";

namespace airkit {
  /**
   * 提供简易获取语言包的方式,配合语言导出脚本
   * @param key LK.xxx  {0},{1}..{n}.表示参数占位符
   * @param args
   */
  export function L(key: string, ...args): string {
    let str = LangManager.Instance.getText(LangManager.Instance.curLang, key);
    if (str == null) return "unknown key:" + key;
    return StringUtils.format(str, ...args);
  }

  /**
   * 多语言
   * @author ankye
   * @time 2017-7-9
   */
  export class LangManager extends Singleton {
    private _curLang: string;
    //public _langs: SDictionary<LangConfig>
    // private _listTables: Array<ConfigItem>

    private static instance: LangManager = null;
    public static get Instance(): LangManager {
      if (!this.instance) this.instance = new LangManager();
      return this.instance;
    }

    public init(): void {
      //this._langs = new SDictionary<LangConfig>()
      //  this._listTables = []
      this._curLang = null;
    }

    // public addLangPack(conf: LangConfig): void {
    //     // this._listTables.push(new ConfigItem(conf.url, conf.name, "id"))
    //     this._langs.add(conf.name, conf)
    // }

    public destory(): void {
      // if (!this._listTables) return
      // for (let info of this._listTables) {
      //     DataProvider.Instance.unload(info.url)
      // }
      // ArrayUtils.clear(this._listTables)
      // this._listTables = null
      // this._langs.clear()
    }
    /**开始加载*/
    // public loadAll(): void {
    //     DataProvider.Instance.load(this._listTables)
    // }

    // public get listTables(): Array<Config> {
    //     return this._listTables
    // }

    /**
     * 切换语言
     * @param type  语言类型
     */
    public changeLang(lang: string): Promise<any> {
      return new Promise((resolve, reject) => {
        if (lang == this._curLang) {
          resolve(lang);
          return;
        }
        let data = ConfigManger.Instance.getList(this._curLang);
        // for (let i = 0; i < this._listTables.length; i++) {
        //     if (this._listTables[i].name == lang) {
        //         data = this._listTables[i]
        //         break
        //     }
        // }
        if (data) {
          if (DataProvider.Instance.getConfig(lang)) {
            this._curLang = lang;
            EventCenter.dispatchEvent(EventID.UI_LANG, this._curLang);
            resolve(lang);
          }
        } else {
          Log.error("no lang package {0} ", lang);
          reject("no lang package " + lang);
        }
      });
    }
    /**
     * 获取语言包
     * @param key     位置
     */
    public getText(lang: string, key: string): string {
      let info = DataProvider.Instance.getInfo(lang, key);
      if (info) {
        return info["name"];
      } else {
        Log.error("cant get lang key", key);
        return "";
      }
    }

    /**当前语言类型*/
    public get curLang(): string {
      return this._curLang;
    }
  }

  // export class LangConfig {
  //     public name: string
  //     public url: string
  //     constructor(name: string, url: string) {
  //         this.name = name
  //         this.url = url
  //     }
  // }
}
