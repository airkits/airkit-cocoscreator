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
       

        public static cache: SDictionary<BaseView>; 
        private static instance: SceneManager = null;
        private _curScene: BaseView;

        /**
         * 注册场景类，存放场景name和class的对应关系
         * @param name
         * @param cls
         */
        public static register(name: string,cls: any ): any {
            if(!this.cache){
                this.cache = new SDictionary<BaseView>();
            }
            if (this.cache.containsKey(name)) {
                Log.error("SceneManager::register scene - same id is register:" + name);
                return;
            }
            this.cache.add(name,cls);
            fgui.UIObjectFactory.setExtension(cls.URL, cls);
            ClassUtils.regClass(name, cls);
        }
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
                "SceneManager Receive Resize %s %s",
                cc.winSize.width,
                cc.winSize.height
            );

            if (this._curScene) {
                this._curScene.setSize(
                    fgui.GRoot.inst.width,
                    fgui.GRoot.inst.height
                );
                var func: Function = this._curScene["resize"];
                let result = null;
                if (func) {
                    result = func.apply(this._curScene);
                }
                for (var i: number = 0; i < fgui.GRoot.inst.numChildren; i++) {
                    let v = fgui.GRoot.inst._children[i];
                    if (v instanceof Dialog){
                        var func: Function = v["resize"];
                        if (func) {
                            result = func.apply(v);
                        }
                    }
                }
                fgui.GRoot.inst.modalLayer.setSize(fgui.GRoot.inst.width,fgui.GRoot.inst.height)
            }
        }
        private onChangeScene(evt: EventArgs): void {
            let info: any = evt.get(0);
            this.gotoScene(info);
        }
        //～～～～～～～～～～～～～～～～～～～～～～～场景切换~～～～～～～～～～～～～～～～～～～～～～～～//

   
        /**进入场景*/
        public gotoScene(sceneName: string, args?: any): void {
            
            //切换
            let clas = ClassUtils.getClass(sceneName);
            let res = clas.res();
            if(res == null || (Array.isArray(res) && res.length == 0)){
                this.exitScene();
                this.enterScene(sceneName,clas,args);
            }else{
                clas.loadResource((v)=>{
                    if(v){
                        this.exitScene();
                        this.enterScene(sceneName,clas,args);
                      //  ResourceManager.Instance.dump();
                    }else{
                        Log.error("加载场景失败 %s",sceneName);
                    }
                });
            }
            
        }
        private enterScene(sceneName : string , clas : any , args? : any):void {
             let scene = clas.createInstance();
             scene.UIID = sceneName;
             this._curScene = scene;
            LayerManager.mainLayer.addChild(scene);
             scene.setup(args);
        }
        
        private exitScene(): void {
            if (this._curScene) {
                //切换
                let sceneName = this._curScene.UIID;
                
                let clas = ClassUtils.getClass(sceneName);
                clas.unres();
                this._curScene.removeFromParent();
                this._curScene.dispose();
                this._curScene = null;
            }
           
        }
    }
}
