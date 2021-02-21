// import { Log } from "../log/Log";
// import { DicUtils } from "../utils/DicUtils";
namespace airkit {
  /**
   * 对象缓存
   * 1.如果继承IPoolsObject，并实现init接口函数；创建时会自动调用init函数
   * @author ankye
   * @time 2018-7-11
   */

  export class ObjectPools {
    private static poolsMap = {};

    /**
     * 获取一个对象，不存在则创建,classDef必须要有 objectKey的static变量
     * @param classDef  类名
     */
    public static get(classDef: any): any {
      let sign: string = classDef["objectKey"];
      if (sign == null) {
        //直接通过classDef.name获取sign,在混淆的情况下会出错
        Log.error("static objectKey must set in %s ", classDef.name);
      }
      let pool = this.poolsMap[sign] as Array<any>;
      if (pool == null) {
        pool = new Array<any>();
        this.poolsMap[sign] = pool;
      }
      let obj = pool.pop();
      if (obj == null) {
        obj = new classDef();
      }
      if (obj && obj["init"]) obj.init();

      return obj;
    }

    /**
     * 回收对象
     * @param obj  对象实例
     */
    public static recover(obj: any): void {
      if (!obj) return;

      if (obj["parent"] != null) {
        obj.removeFromParent();
      }
      if (obj["dispose"] && obj["displayObject"] == null) {
        obj.dispose();
        return;
      }
      let proto: any = Object.getPrototypeOf(obj);
      let clazz: any = proto["constructor"];
      let sign: string = clazz["objectKey"];
      let pool = this.poolsMap[sign] as Array<any>;
      if (pool != null) {
        if (obj["visible"] !== null && obj["visible"] === false) {
          obj.visible = true;
        }
        pool.push(obj);
      }
    }
    public static clearAll() {
      DicUtils.foreach(this.poolsMap, (k, v) => {
        this.clear(k);
        return true;
      });
    }
    public static clear(sign: string) {
      let pool = this.poolsMap[sign] as Array<any>;
      Log.info("max object count %s", pool.length);
      while (pool.length > 0) {
        let obj = pool.pop();
        if (obj && obj["dispose"]) {
          if (obj["parent"] != null) {
            obj.removeFromParent();
          } else if (obj.displayObject["parent"] != null) {
            obj.displayObject.removeFromParent();
          }
          obj.dispose();
        }
      }
    }
  }
}
