// import { StringUtils } from "./StringUtils";
namespace airkit {
  /**
   * 字符串
   * @author ankye
   * @time 2018-7-8
   */
  export class NumberUtils {
    /**
     * 保留小数点后几位
     */
    public static toFixed(value: number, p: number): number {
      return StringUtils.toNumber(value.toFixed(p));
    }
    public static toInt(value: number): number {
      return Math.floor(value);
    }
    public static isInt(value: number): boolean {
      return Math.ceil(value) != value ? false : true;
    }
    /**
     * 保留有效数值
     */
    public static reserveNumber(num: number, size: number): number {
      let str = String(num);
      let l = str.length;
      let p_index: number = str.indexOf(".");
      if (p_index < 0) {
        return num;
      }
      let ret: string = str.slice(0, p_index + 1);

      let lastNum = l - p_index;
      if (lastNum > size) {
        lastNum = size;
      }
      let lastStr: string = str.slice(p_index + 1, p_index + 1 + lastNum);
      return StringUtils.toNumber(ret + lastStr);
    }
    /**
     * 保留有效数值，不够补0；注意返回的是字符串
     */
    public static reserveNumberWithZero(num: number, size: number): string {
      let str = String(num);
      let l = str.length;
      let p_index: number = str.indexOf(".");
      if (p_index < 0) {
        //是整数
        str += ".";
        for (let i = 0; i < size; ++i) str += "0";
        return str;
      }
      let ret: string = str.slice(0, p_index + 1);

      let lastNum = l - p_index - 1;
      if (lastNum > size) {
        //超过
        lastNum = size;
        let lastStr: string = str.slice(p_index + 1, p_index + 1 + lastNum);
        return ret + lastStr;
      } else if (lastNum < size) {
        //不足补0
        let diff: number = size - lastNum;
        for (let i = 0; i < diff; ++i) str += "0";
        return str;
      } else {
        return str;
      }
    }
  }
}
