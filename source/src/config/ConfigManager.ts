// import { Singleton } from "../collection/Singleton";
// import { ConfigItem } from "./ConfigItem";
// import { DataProvider } from "./DataProvider";
// import { ArrayUtils } from "../utils/ArrayUtils";
namespace airkit {
    /**
     * 配置表管理器
     * @author ankye
     * @time 2017-7-9
     */
    export class ConfigManger extends Singleton {
        private _listTables: Array<ConfigItem>

        private static instance: ConfigManger = null
        public static zipUrl: string = 'config/config'
        public static get Instance(): ConfigManger {
            if (!this.instance) this.instance = new ConfigManger()
            return this.instance
        }

        /**初始化数据*/
        public init(keys: any, zipPath: string = null): void {
            if (zipPath != null) ConfigManger.zipUrl = zipPath
            this._listTables = []

            let c = keys

            for (let k in c) {
                this._listTables.push(new ConfigItem(k, k, c[k]))
            }
        }
        /**释放数据*/
        public release(): void {
            if (!this._listTables) return

            for (let info of this._listTables) {
                DataProvider.Instance.unload(info.url)
            }
            ArrayUtils.clear(this._listTables)
            this._listTables = null
        }
        /**开始加载*/
        public loadAll(url: string = ConfigManger.zipUrl): Promise<any> {
            if (this._listTables.length > 0) {
                DataProvider.Instance.enableZip()
                return DataProvider.Instance.loadZip(url, this._listTables)
            }
            //return DataProvider.Instance.load(this._listTables)
        }
        /**
         * 获取列表，fiter用于过滤,可以有多个值，格式为 [["id",this.id],["aaa","bbb"]]
         * @param table
         * @param filter 目前只实现了绝对值匹配
         */
        public query(table: string, filter?: Array<any>): Array<any> {
            let dic = DataProvider.Instance.getConfig(table)
            if (dic == null) return []
            if (filter == null) filter = []
            let result = []
            for (let key in dic) {
                let val = dic[key]
                let flag = true
                for (let j = 0; j < filter.length; j++) {
                    let k = filter[j][0]
                    let v = filter[j][1]
                    if (val[k] != v) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    result.push(val)
                }
            }
            return result
        }
        public getInfo(table: string, key: string | string[]): any {
            let info = DataProvider.Instance.getInfo(table, key)
            return info
        }
        /**定义需要前期加载的资源*/
        // public get preLoadRes(): Array<[string, string]> {

        //     let c = TableConfig.keys()
        //     let res = []
        //     for (let k in c) {
        //         res.push(["res/config/" + k, laya.net.Loader.JSON])
        //     }
        //     return res
        // }

        public get listTables(): Array<ConfigItem> {
            return this._listTables
        }
    }

    //通过主键获取配置信息
    export function getCInfo<TValue>(table: string, key: string | string[]): TValue {
        return <TValue>ConfigManger.Instance.getInfo(table, key)
    }
    //通过查询键获取列表，query:[[k,v],[k,v]]
    export function getCList<TValue>(table: string, query: Array<[string, number | string]>): Array<TValue> {
        return ConfigManger.Instance.query(table, query)
    }
    //通过查询键获取单个信息，query:[[k,v],[k,v]]
    export function queryCInfo<TValue>(table: string, query: Array<[string, number | string]>): TValue {
        let list = getCList<TValue>(table, query)
        if (list == null) return null
        return <TValue>list[0]
    }
}
