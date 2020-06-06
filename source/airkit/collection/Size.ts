namespace airkit {
  /**
   * Size大小 宽高
   * @author ankye
   * @time 2018-7-3
   */
  export class Size {
    private _width: number;
    private _height: number;

    constructor(w: number = 0, h: number = 0) {
      this._width = w;
      this._height = h;
    }

    public set(w: number, h: number) {
      this._width = w;
      this._height = h;
    }

    public get width(): number {
      return this._width;
    }

    public get height(): number {
      return this._height;
    }
  }
}
