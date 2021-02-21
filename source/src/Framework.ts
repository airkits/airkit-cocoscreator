/// <reference path="collection/Singleton.ts" />

namespace airkit {
  /**
   * 框架管理器
   * @author ankye
   * @time 2018-7-6
   */
  export class Framework extends Singleton{
    private _isStopGame: boolean = false;
    private _mainloopHandle: Handler = null;

    private static instance: Framework = null;
    public static get Instance(): Framework {
      if (!this.instance){
        this.instance = new Framework();
      } 
      return this.instance;
    }

    constructor() {
      super();
    }
    /**
     * 初始化
     * @param	root	根节点，可以是stage
     */
    public setup(
      root: fgui.GComponent,
      log_level: LogLevel = LogLevel.INFO,
      design_width: number = 750,
      design_height: number = 1334,
      screen_mode: string = "",
      frame: number = 1
    ): void {
      this.printDeviceInfo();
      this._isStopGame = false;

      cc.view.setResizeCallback(() => {
        EventCenter.dispatchEvent(EventID.RESIZE);
      });
      Log.LEVEL = log_level;
      LayerManager.setup(root);
      Mediator.Instance.setup();
      TimerManager.Instance.setup();
      ResourceManager.Instance.setup();
      LoaderManager.Instance.setup();
      DataProvider.Instance.setup();
      // LangManager.Instance.init();

       SceneManager.Instance.setup();
      // 
       
     // cc.director.getScheduler().scheduleUpdate(this, 0, false);

    }

    public destroy(): boolean {
      LoaderManager.Instance.destroy();
      ResourceManager.Instance.destroy();
      TimerManager.Instance.destroy();
      Mediator.Instance.destroy();
      LayerManager.destroy();
      //UIManager.Instance.destroy();
      SceneManager.Instance.destroy(); 
      DataProvider.Instance.destroy();
      
      // LangManager.Instance.destory();
      return true;
    }
    /**
     * 游戏主循环
     */
    public update(dt: number): void { //dt是秒，强制转换成毫秒
     
      if (!this._isStopGame) {
        let dtMs = dt * 1000;
        this.preTick(dtMs);
        this.tick(dtMs);
        this.endTick(dtMs);
      }
    }
    public preTick(dt: number): void {
       TimerManager.Instance.update(dt);
       //UIManager.Instance.update(dt);
       ResourceManager.Instance.update(dt);
       Mediator.Instance.update(dt);
      SceneManager.Instance.update(dt);
    }
    public tick(dt: number): void {
      if (this._mainloopHandle) {
        this._mainloopHandle.runWith([dt]);
      }
    }

    public endTick(dt: number): void {}

    /**暂停游戏*/
    public pauseGame(): void {
      this._isStopGame = true;

      EventCenter.dispatchEvent(EventID.STOP_GAME, true);
    }
    /**结束暂停*/
    public resumeGame(): void {
      this._isStopGame = false;

      EventCenter.dispatchEvent(EventID.STOP_GAME, false);
    }
    public get isStopGame(): boolean {
      return this._isStopGame;
    }

    /**打印设备信息*/
    private printDeviceInfo() {
      if (navigator) {
        let agentStr = navigator.userAgent;

        let start = agentStr.indexOf("(");
        let end = agentStr.indexOf(")");

        if (start < 0 || end < 0 || end < start) {
          return;
        }

        let infoStr = agentStr.substring(start + 1, end);
        Log.info(infoStr);

        let device: string, system: string, version: string;
        let infos = infoStr.split(";");
        if (infos.length == 3) {
          //如果是三个的话， 可能是android的， 那么第三个是设备号
          device = infos[2];
          //第二个是系统号和版本
          let system_info = infos[1].split(" ");
          if (system_info.length >= 2) {
            system = system_info[1];
            version = system_info[2];
          }
        } else if (infos.length == 2) {
          system = infos[0];
          device = infos[0];
          version = infos[1];
        } else {
          system = navigator.platform;
          device = navigator.platform;
          version = infoStr;
        }
        Log.info("%s,%s,%s", system, device, version);
      }
    }
  }
}
