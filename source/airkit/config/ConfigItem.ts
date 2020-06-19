namespace airkit {
  /**
   * 配置表
   * @author ankye
   * @time 2018-7-11
   */

  export class ConfigItem {
    public url: string; //资源url
    public name: string; //名称：用于查找
    public key: any; //表的主键

    constructor(url: string, name: string, key: any) {
      this.url = url;
      this.name = name;
      this.key = key;
    }
  }
}
