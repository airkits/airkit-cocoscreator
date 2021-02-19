// import { ArrayUtils } from "../utils/ArrayUtils";
// import { ObjectPools } from "../collection/ObjectPools";
// import { Singleton } from "../collection/Singleton";
// import { IPoolsObject } from "../collection/IPoolsObject";
// import { IntervalTimer } from "./IntervalTimer";
// import { Timer } from "./Timer";
namespace airkit {
  /**
   * 定时器
   * @author ankye
   * @time 2018-7-11
   */
  export class TimerManager extends Singleton {
    private _idCounter: number = 0;
    private _removalPending: Array<number> = [];
    private _timers: Array<TimerObject> = [];
    public static TIMER_OBJECT = "timerObject";
    private static instance: TimerManager = null;
    public static get Instance(): TimerManager {
      if (!this.instance) this.instance = new TimerManager();
      return this.instance;
    }

    public setup(): void {
      this._idCounter = 0;
    }

    public destroy(): boolean {
      ArrayUtils.clear(this._removalPending);
      ArrayUtils.clear(this._timers);
      return true;
    }

    public update(dt: number): void {
      this.remove();
     
      for (let i = 0; i < this._timers.length; i++) {
        this._timers[i].update(dt);
        if (this._timers[i].isActive == false) {
          TimerManager.Instance.removeTimer(this._timers[i].id);
        }
      }
    }
    /**
     * 定时重复执行
     * @param	rate	间隔时间(单位毫秒)。
     * @param	ticks	执行次数,-1=forever
     * @param	caller	执行域(this)。
     * @param	method	定时器回调函数：注意，返回函数第一个参数为定时器id，后面参数依次时传入的参数。例OnTime(timer_id:number, args1:any, args2:any,...):void
     * @param	args	回调参数。
     */
    public addLoop(
      rate: number,
      ticks: number,
      caller: any,
      method: Function,
      args: Array<any> = null
    ): number {
      if (ticks <= 0) ticks = 0;
      let timer: TimerObject = ObjectPools.get(TimerObject);

      ++this._idCounter;
     // if (args != null) ArrayUtils.insert(args, this._idCounter, 0);
      let handler = Handler.create(caller, method, args, false);
      let forever = ticks == -1;
      timer.set(this._idCounter, rate, ticks, handler,forever);
      this._timers.push(timer);
      return timer.id;
    }
    /**
     * 单次执行
     * 间隔时间(单位毫秒)。
     */
    public addOnce(
      rate: number,
      caller: any,
      method: Function,
      args: Array<any> = null
    ): number {
      let timer: TimerObject = ObjectPools.get(TimerObject);

      ++this._idCounter;
     // if (args != null) ArrayUtils.insert(args, this._idCounter, 0);
      let handler = Handler.create(caller, method, args, false);
      timer.set(this._idCounter, rate, 1, handler,false);
      this._timers.push(timer);
      return timer.id;
    }
    /**
     * 移除定时器
     * @param	timerId	定时器id
     */
    public removeTimer(timerId: number): void {
      this._removalPending.push(timerId);
    }
    /**
     * 移除过期定时器
     */
    private remove(): void {
      let t: TimerObject;
      if (this._removalPending.length > 0) {
        for (let id of this._removalPending) {
          for (let i = 0; i < this._timers.length; i++) {
            t = this._timers[i];
            if (t.id == id) {
              t.clear();
              ObjectPools.recover(t);

              this._timers.splice(i, 1);
              break;
            }
          }
        }

        ArrayUtils.clear(this._removalPending);
      }
    }
  }

  export class TimerObject implements IPoolsObject {
    public static objectKey: string = "TimerObject";

    public id: number;
    public isActive: boolean;

    public mRate: number;
    public mTicks: number;
    public mTicksElapsed: number;
    public handle: Handler;

    public mTime: IntervalTimer;
    public forever:boolean;

    constructor() {
      this.mTime = new IntervalTimer();
    }

    public init(): void {}

    public clear(): void {
      if (this.handle != null) {
        this.handle.recover();
        this.handle = null;
      }
    }

    public set(id: number, rate: number, ticks: number, handle: Handler,forever:boolean) {
      this.id = id;
      this.mRate = rate < 0 ? 0 : rate;
      this.mTicks = ticks < 0 ? 0 : ticks;
      this.handle = handle;
      this.mTicksElapsed = 0;
      this.isActive = true;
      this.mTime.init(this.mRate, false);
      this.forever = forever;
    }

    public update(dt: number): void {
      if (this.isActive && this.mTime.update(dt)) {
        if (this.handle != null) this.handle.run();
        if(!this.forever){
          this.mTicksElapsed++;
          if (this.mTicks > 0 && this.mTicks == this.mTicksElapsed) {
            this.isActive = false;
          }
        }
      }
    }
  }
}
