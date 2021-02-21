/**
 * 字符串
 * @author ankye
 * @time 2018-7-8
 */
namespace airkit {
  export class StringUtils {
    public static get empty(): string {
      return "";
    }
    /**
     * 字符串是否有值
     */
    public static isNullOrEmpty(s: string): boolean {
      return s != null && s.length > 0 ? false : true;
    }

    public static toInt(str: string): number {
      if (!str || str.length == 0) return 0;
      return parseInt(str);
    }

    public static toNumber(str: string): number {
      if (!str || str.length == 0) return 0;
      return parseFloat(str);
    }

    public static stringCut(
      str: string,
      len: number,
      fill: string = "..."
    ): string {
      var result: string = str;
      if (str.length > len) {
        result = str.substr(0, len) + fill;
      }
      return result;
    }

    /**
     * 获取字符串真实长度,注：
     * 1.普通数组，字符占1字节；汉子占两个字节
     * 2.如果变成编码，可能计算接口不对
     */
    public static getNumBytes(str: string): number {
      let realLength = 0,
        len = str.length,
        charCode = -1;
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
      }
      return realLength;
    }
    /**
     * 补零
     * @param str
     * @param len
     * @param dir 0-后；1-前
     * @return
     */
    public static addZero(str: string, len: number, dir: number = 0): string {
      let _str: string = "";
      let _len: number = str.length;
      let str_pre_zero: string = "";
      let str_end_zero: string = "";
      if (dir == 0) str_end_zero = "0";
      else str_pre_zero = "0";

      if (_len < len) {
        let i: number = 0;
        while (i < len - _len) {
          _str = str_pre_zero + _str + str_end_zero;
          ++i;
        }

        return _str + str;
      }

      return str;
    }

    /**
     * Checks if the given argument is a string.
     * @function
     */
    public static isString(obj: any): boolean {
      return Object.prototype.toString.call(obj) === "[object String]";
    }

    /**
     * 去除左右空格
     * @param input
     * @return
     */
    public static trim(input: string): string {
      if (input == null) {
        return "";
      }
      return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
    }
    /**
     * 去除左侧空格
     * @param input
     * @return
     */
    public static trimLeft(input: string): string {
      if (input == null) {
        return "";
      }
      return input.replace(/^\s+""^\s+/, "");
    }

    /**
     * 去除右侧空格
     * @param input
     * @return
     */
    public static trimRight(input: string): string {
      if (input == null) {
        return "";
      }
      return input.replace(/\s+$""\s+$/, "");
    }
    /**
     * 分钟与秒格式(如-> 40:15)
     * @param seconds 秒数
     * @return
     */
    public static minuteFormat(seconds: number): string {
      let min: number = Math.floor(seconds / 60);
      let sec: number = Math.floor(seconds % 60);

      let min_str: string = min < 10 ? "0" + min.toString() : min.toString();
      let sec_str: string = sec < 10 ? "0" + sec.toString() : sec.toString();

      return min_str + ":" + sec_str;
    }

    /**
     * 时分秒格式(如-> 05:32:20)
     * @param seconds(秒)
     * @return
     */
    public static hourFormat(seconds: number): string {
      let hour: number = Math.floor(seconds / 3600);
      let hour_str: String =
        hour < 10 ? "0" + hour.toString() : hour.toString();
      return hour_str + ":" + StringUtils.minuteFormat(seconds % 3600);
    }
    /**
     * 格式化字符串
     * @param str 需要格式化的字符串，【"杰卫，这里有%s个苹果，和%s个香蕉！", 5,10】
     * @param args 参数列表
     */
    public static format2(str: string, ...args): string {
      for (let i = 0; i < args.length; i++) {
        str = str.replace(new RegExp("\\{" + i + "\\}", "gm"), (typeof args[i] === "object") ?  JSON.stringify(args[i],null,4): args[i]);
      }
      return str;
    }

    public static format(str:string, ...args):string {
      let seq = 0;
      str = str.replace(/(%s|%d|%o|%%)/g, (match: string) => {
          return match === '%%' ? '%' : `{${seq++}}`
      });
      return this.format2(str,...args);
    }
    public static formatWithDic(str: string, dic): string {
      for (let key in dic) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gm"), (typeof dic[key] === "object") ?  JSON.stringify(dic[key],null,4): dic[key]);
      }
      return str;
    }
    /**
     * 以指定字符开始
     */
    public static beginsWith(input: string, prefix: string): boolean {
      return prefix == input.substring(0, prefix.length);
    }

    /**
     * 以指定字符结束
     */
    public static endsWith(input: string, suffix: string): boolean {
      return suffix == input.substring(input.length - suffix.length);
    }
    /**guid*/
    public static getGUIDString(): string {
      let d = Date.now();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
  }
}
