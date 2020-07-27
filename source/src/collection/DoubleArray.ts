//import { ArrayUtils } from "../utils/ArrayUtils";
namespace airkit {
  /**
   * 二维数组
   * @author ankye
   * @time 2018-7-8
   */
  export class DoubleArray {
    private _array: any[] = [];

    constructor(rows: number, cols: number, value: any) {
      if (rows > 0 && cols > 0) {
        for (let row = 0; row < rows; ++row) {
          for (let col = 0; col < cols; ++col) {
            this.set(row, col, value);
          }
        }
      }
    }

    public set(row: number, col: number, value: any): void {
      if (!this._array[row]) this._array[row] = [];
      this._array[row][col] = value;
    }
    public get(row: number, col: number): any {
      if (!this._array[row]) return null;
      return this._array[row][col];
    }
    public clear(): void {
      ArrayUtils.clear(this._array);
    }
  }
}
