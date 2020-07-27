/**
 * 定时执行
 * @author ankye
 * @time 2018-7-11
 */
namespace airkit {
  export class IntervalTimer {
    private _intervalTime: number; //毫秒
    private _nowTime: number;

    constructor() {
      this._nowTime = 0;
    }
    /**
     * 初始化定时器
     * @param	interval	触发间隔
     * @param	firstFrame	是否第一帧开始执行
     */
    public init(interval: number, firstFrame: boolean): void {
      this._intervalTime = interval;
      if (firstFrame) this._nowTime = this._intervalTime;
    }

    public reset(): void {
      this._nowTime = 0;
    }

    public update(elapseTime: number): boolean {
      this._nowTime += elapseTime;
      if (this._nowTime >= this._intervalTime) {
        this._nowTime -= this._intervalTime;
        return true;
      }
      return false;
    }
  }
}
