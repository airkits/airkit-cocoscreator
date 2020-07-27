// import { ArrayUtils } from "../utils/ArrayUtils";
namespace airkit {
  /**
   * 事件参数
   * @author ankye
   * @time 2018-7-6
   */

  export class EventArgs {
    private _type: string = "";
    private _data: any[] = null;

    constructor(...args: any[]) {
      if (!args || args.length == 0) return;

      if (args instanceof Array) this._data = ArrayUtils.copy(args[0]);
      else this._data = ArrayUtils.copy(args);
    }

    public init(...args: any[]) {
      if (args.length == 0) return;
      if (args instanceof Array) this._data = ArrayUtils.copy(args[0]);
      else this._data = ArrayUtils.copy(args);
    }

    public get(index: number): any {
      if (!this._data || this._data.length == 0) return null;
      if (index < 0 || index >= this._data.length) return null;
      return this._data[index];
    }

    get type() {
      return this._type;
    }

    set type(t: string) {
      this._type = t;
    }
  }
}
