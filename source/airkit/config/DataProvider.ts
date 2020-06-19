// import { assertNullOrNil } from "../utils/Utils";
// import { StringUtils } from "../utils/StringUtils";
// import { ResourceManager } from "../loader/ResourceManager";
// import { Log } from "../log/Log";
// import { SDictionary } from "../collection/Dictionary";
// import { Singleton } from "../collection/Singleton";
// import { ConfigItem } from "./ConfigItem";
// import ZipUtils from "../utils/ZipUtils";
namespace airkit {
  /**
   * json配置表
   * @author ankye
   * @time 2018-7-11
   */

  export class DataProvider extends Singleton {
    private _dicTemplate: SDictionary<ConfigItem> = null;
    private _dicData: SDictionary<any> = null;
    public _zip: boolean;
    private static instance: DataProvider = null;
    public static get Instance(): DataProvider {
      if (!this.instance) this.instance = new DataProvider();
      return this.instance;
    }
    public enableZip(): void {
      this._zip = true;
    }
    public setup(): void {
      this._dicTemplate = new SDictionary<ConfigItem>();
      this._dicData = new SDictionary<any>();
      this._zip = false;
    }

    public destroy(): void {
      this.unloadAll();
      if (this._dicTemplate) {
        this._dicTemplate.clear();
        this._dicTemplate = null;
      }
      if (this._dicData) {
        this._dicData.clear();
        this._dicData = null;
      }
    }
    public loadZip(url: string, list: ConfigItem[]): Promise<any> {
      return new Promise((resolve, reject) => {
        ResourceManager.Instance.loadRes(url, Laya.Loader.BUFFER).then(v => {
          let ab = ResourceManager.Instance.getRes(url);
          ZipUtils.unzip(ab)
            .then(v => {
              for (let i = 0; i < list.length; i++) {
                let template = list[i];
                this._dicTemplate.add(list[i].url, template);
                Log.info("Load config {0}", template.url);
                let json_res = JSON.parse(v[template.url]);
                if (StringUtils.isNullOrEmpty(template.key)) {
                  this._dicData.add(template.name, json_res);
                } else {
                  let map = {};
                  let sValue;
                  let sData;
                  let i = 0;
                  let isArrayKey = Array.isArray(template.key);
                  while (json_res[i]) {
                    sData = json_res[i];
                    if (isArrayKey) {
                      sValue = sData[template.key[0]];
                      for (let i = 1; i < template.key.length; i++) {
                        sValue += "_" + sData[template.key[i]];
                      }
                    } else {
                      sValue = sData[template.key];
                    }

                    assertNullOrNil(sValue, "配置表解析错误:" + template.url);
                    map[sValue] = sData;

                    i++;
                  }
                  this._dicData.add(template.name, map);
                }
              }
              resolve(v);
            })
            .catch(e => {
              Log.error(e);
              reject(e);
            });
        });
      });
    }
    public load(list: ConfigItem[]): Promise<any> {
      return new Promise((resolve, reject) => {
        let assets = [];
        for (let i = 0; i < list.length; i++) {
          if (!ResourceManager.Instance.getRes(list[i].url)) {
            assets.push({ url: list[i].url, type: Laya.Loader.JSON });
            this._dicTemplate.add(list[i].url, list[i]);
          }
        }
        if (assets.length == 0) {
          resolve([]);
          return;
        }
        ResourceManager.Instance.loadArrayRes(
          assets,
          null,
          null,
          null,
          null,
          ResourceManager.SystemGroup
        )
          .then(v => {
            for (let i = 0; i < v.length; i++) {
              this.onLoadComplete(v[i]);
              resolve(v);
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    }

    public unload(url: string): void {
      let template = this._dicTemplate.getValue(url);
      if (template) {
        this._dicData.remove(template.name);
      }
      if (this._zip) {
      } else {
        ResourceManager.Instance.clearRes(url);
      }

      this._dicTemplate.remove(url);
    }

    public unloadAll(): void {
      if (!this._dicTemplate) return;

      this._dicTemplate.foreach(function(key, value) {
        this.Unload(key);
        return true;
      });
      this._dicData.clear();
      this._dicTemplate.clear();
    }

    /**返回表*/
    public getConfig(table: string): any {
      let data = this._dicData.getValue(table);
      return data;
    }

    /**返回一行*/
    public getInfo(table: string, key: any): any {
      let data = this._dicData.getValue(table);
      if (data) {
        let isArrayKey = Array.isArray(key);
        let sValue;
        if (isArrayKey) {
          sValue = key[0];
          for (let i = 1; i < key.length; i++) {
            sValue += "_" + key[i];
          }
        } else {
          sValue = key;
        }
        let info = data[sValue];
        return info;
      }
      return null;
    }

    private getRes(url: string): any {
      Log.debug("[load]加载配置表:" + url);
      let template = this._dicTemplate.getValue(url);
      if (template) {
        let json_res = ResourceManager.Instance.getRes(url);

        if (StringUtils.isNullOrEmpty(template.key)) {
          this._dicData.add(template.name, json_res);
        } else {
          let map = {};
          let sValue;
          let sData;
          let i = 0;
          let isArrayKey = Array.isArray(template.key);
          while (json_res[i]) {
            sData = json_res[i];
            if (isArrayKey) {
              sValue = sData[template.key[0]];
              for (let i = 1; i < template.key.length; i++) {
                sValue += "_" + sData[template.key[i]];
              }
            } else {
              sValue = sData[template.key];
            }

            assertNullOrNil(sValue, "配置表解析错误:" + template.url);
            map[sValue] = sData;

            i++;
          }
          this._dicData.add(template.name, map);
        }
      }
    }

    private onLoadComplete(url: string): void {
      this.getRes(url);
    }
  }
}
