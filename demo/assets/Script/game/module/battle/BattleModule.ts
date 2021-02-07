import { eSceneType } from "../../common/SceneType"


export default class BattleModule extends ak.BaseModule {
    

    constructor() {
        super()
    }

    public setup(args: number): void {
        super.setup(args)
    }

    public enter(): void {
        super.enter()
        ak.Log.info("Module battle enter")
    }
    public update(dt: number): void {
        super.update(dt)
    }
    
    public static res():Array<ak.Res> {
        let assets = [

        ]
        return assets
    }
    public loaderTips(): string {
        return "美术资源加载中"
    }
    /**是否显示加载界面*/
    // public loaderType(): number {
    //     return eLoaderType.FULLSCREEN
    // }
    protected signalMap() {
        return null
    }


    public dispose(): void {
        super.dispose()
    }


    public enterScene(): void {
        ak.SceneManager.Instance.gotoScene(eSceneType.BATTLE)
     }
 
}
