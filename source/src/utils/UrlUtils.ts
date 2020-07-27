// import { StringUtils } from "./StringUtils";
namespace airkit {
  /**
   * url工具类
   * @author ankye
   * @time 2018-7-16
   */
  export class UrlUtils {
    /**获取文件扩展名*/
    public static getFileExte(url: string): string {
      if (StringUtils.isNullOrEmpty(url)) return StringUtils.empty;

      let idx: number = url.lastIndexOf(".");
      if (idx >= 0) {
        return url.substr(idx + 1);
      }
      return StringUtils.empty;
    }
    /**获取不含扩展名的路径*/
    public static getPathWithNoExtend(url: string): string {
      if (StringUtils.isNullOrEmpty(url)) return StringUtils.empty;

      let idx: number = url.lastIndexOf(".");
      if (idx >= 0) {
        return url.substr(0, idx);
      }
      return StringUtils.empty;
    }
  }
}
