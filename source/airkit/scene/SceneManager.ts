// import { EventCenter } from "../event/EventCenter";
// import { EventID, LoaderEventID } from "../event/EventID";
// import { EventArgs } from "../event/EventArgs";
// import { LayerManager } from "../scene/LayerManager";
// import { Log } from "../log/Log";
// import BaseView from "../scene/BaseView";
// import { ResourceManager } from "../loader/ResourceManager";
// import { DisplayUtils } from "../utils/DisplayUtils";
// import { NDictionary } from "../collection/Dictionary";
// import { ObjectPools } from "../collection/ObjectPools";
// import { UIManager } from "../scene/UIManager";
namespace airkit {
  /**
   * 场景管理器
   * @author ankye
   * @time 2017-7-13
   */
  export class SceneManager {
    public static scenes: NDictionary<string> = new NDictionary<string>();
    /**
     * 注册场景类，存放场景id和name的对应关系
     * @param scene_type
     * @param name
     * @param cls
     */
    public static registerScene(
      scene_type: number,
      name: string,
      cls: any
    ): any {
      SceneManager.scenes.add(scene_type, name);
      ClassUtils.regClass(name, cls);
    }

    private _curScene: BaseView;

    private static instance: SceneManager = null;
    public static get Instance(): SceneManager {
      if (!this.instance) this.instance = new SceneManager();
      return this.instance;
    }

    public setup(): void {
      this.registerEvent();
    }

    public destroy(): void {
      this.unRegisterEvent();
    }

    public update(dt: number): void {
      //do update
      if (this._curScene) {
        this._curScene.update(dt);
      }
    }

    private registerEvent(): void {
      EventCenter.on(EventID.CHANGE_SCENE, this, this.onChangeScene);
      EventCenter.on(EventID.RESIZE, this, this.resize);
    }
    private unRegisterEvent(): void {
      EventCenter.off(EventID.CHANGE_SCENE, this, this.onChangeScene);
      EventCenter.off(EventID.RESIZE, this, this.resize);
    }

    private resize(): void {
      Log.info(
        "SceneManager Receive Resize {0} {1}",
        cc.winSize.width,
        cc.winSize.height
      );

      if (this._curScene) {
        this._curScene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        var func: Function = this._curScene["resize"];
        let result = null;
        if (func) {
          result = func.apply(this._curScene);
        }
      }
    }
    private onChangeScene(evt: EventArgs): void {
      let info: any = evt.get(0);
      this.gotoScene(info);
    }
    //～～～～～～～～～～～～～～～～～～～～～～～场景切换~～～～～～～～～～～～～～～～～～～～～～～～//

    private onComplete(v: any): void {
      this._curScene = v;
    }
    /**进入场景*/
    public gotoScene(scene_type: number, args?: any): void {
      this.exitScene();
      let sceneName = SceneManager.scenes.getValue(scene_type);
      //切换
      let clas = ClassUtils.getClass(sceneName);

      let scene = new clas();
      scene.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
      scene.setup(args);
      scene
        .loadResource(ResourceManager.DefaultGroup, clas)
        .then((v) => {
          this.onComplete(v);
        })
        .catch((e) => {
          Log.error(e);
        });

      LayerManager.mainLayer.addChild(scene);
    }

    private exitScene(): void {
      if (this._curScene) {
        this._curScene.removeFromParent();
        this._curScene.dispose();
        this._curScene = null;

        UIManager.Instance.closeAll();
        //  LayerManager.removeAll();
        //  ResourceManager.Instance.removeAllAniAnim();
        ObjectPools.clearAll();

        ResourceManager.Instance.cleanTexture(ResourceManager.DefaultGroup);
        // ResourceManager.Instance.removeAllAniAnim("default");
        // ResourceManager.Instance.removeSpineTempletGroup("default");
      }
    }
  }
}
