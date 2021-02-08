namespace airkit {
  /**
   * 加载界面管理器
   * @author ankye
   * @time 2017-7-25
   */

  export class LoaderManager extends Singleton {
    public _dicLoadView: NDictionary<ILoadingView>;

    public static loaders: NDictionary<string> = new NDictionary<string>();

    /**
     * 注册加载类，存放场景id和url的对应关系
     * @param view_type
     * @param className
     */
    public static registerLoadingView(
      view_type: number,
      className: string,
      cls: any
    ): void {
      this.loaders.add(view_type, className);
      ClassUtils.regClass(className, cls);
    }

    private static instance: LoaderManager = null;
    public static get Instance(): LoaderManager {
      if (!this.instance) this.instance = new LoaderManager();
      return this.instance;
    }

    public setup(): void {
      this.registerEvent();
      this._dicLoadView = new NDictionary<ILoadingView>();
    }

    public destroy(): boolean {
      this.unRegisterEvent();
      if (this._dicLoadView) {
        let view: any = null;
        this._dicLoadView.foreach(function (key, value) {
          view = value;
          view.close();
          return true;
        });
        this._dicLoadView.clear();
        this._dicLoadView = null;
      }
      return true;
    }

    private registerEvent(): void {
      EventCenter.on(LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
      EventCenter.on(LoaderEventID.LOADVIEW_COMPLATE, this, this.onLoadViewEvt);
      EventCenter.on(LoaderEventID.LOADVIEW_PROGRESS, this, this.onLoadViewEvt);
    }

    private unRegisterEvent(): void {
      EventCenter.off(LoaderEventID.LOADVIEW_OPEN, this, this.onLoadViewEvt);
      EventCenter.off(
        LoaderEventID.LOADVIEW_COMPLATE,
        this,
        this.onLoadViewEvt
      );
      EventCenter.off(
        LoaderEventID.LOADVIEW_PROGRESS,
        this,
        this.onLoadViewEvt
      );
    }
    /**加载进度事件*/
    private onLoadViewEvt(args: EventArgs): void {
      let type: string = args.type;
      let viewType: number = args.get(0);
      switch (type) {
        case LoaderEventID.LOADVIEW_OPEN:
          {
            Log.debug("显示加载界面");
            let total: number = args.get(1);
            let tips: string = args.get(2);
            this.show(viewType, total, tips);
          }
          break;
        case LoaderEventID.LOADVIEW_PROGRESS:
          {
            //Log.debug("加载界面进度")
            let cur: number = args.get(1);
            let total: number = args.get(2);
            this.setProgress(viewType, cur, total);
          }
          break;
        case LoaderEventID.LOADVIEW_COMPLATE:
          {
            Log.debug("加载界面关闭");
            this.close(viewType);
          }
          break;
      }
    }

    private show(type: number, total: number, tips: string): void {
      if (type == null || type == LOADVIEW_TYPE_NONE) return;

      let view: any = this._dicLoadView.getValue(type);
      if (!view) {
        let className: string = LoaderManager.loaders.getValue(type);
        //切换
        if (className.length > 0) {
          view = ClassUtils.getInstance(className);
          if (view == null) return;

          view.setup([]);
          let clas = ClassUtils.getClass(className);
          view.loadResource(() => {
            LayerManager.loadingLayer.addChild(view);
            this._dicLoadView.add(type, view);
            this.updateView(view, total, tips);
          });
        } else {
          Log.error("Must set loadingview first type= {0}", type);
        }
      } else {
        this.updateView(view, total, tips);
      }
    }
    public updateView(view: any, total: number, tips: string): void {
      if (!view.parent) {
        LayerManager.loadingLayer.addChild(view);
      }
      view.onOpen(total);
      view.setTips(tips);
      view.setVisible(true);
    }
    private setProgress(type: number, cur: number, total: number): void {
      let view = this._dicLoadView.getValue(type);
      if (!view) {
        return;
      }
      view.setProgress(cur, total);
    }
    private close(type: number): void {
      let view: any = this._dicLoadView.getValue(type);
      if (!view) {
        return;
      }
      view.setVisible(false);
      view.onClose();
      this._dicLoadView.remove(type);
      view = null;

      // TweenUtils.get(view).to({ alpha: 0 }, 500, Laya.Ease.bounceIn, LayaHandler.create(null, v => {
      // 	view.setVisible(false)
      // }))
    }
  }
}
