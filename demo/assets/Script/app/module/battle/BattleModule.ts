
import { eLoaderType } from "../system/loader/LoaderType";
import { SceneID } from "../../config/UIID";
import { API } from "../../manager/API";
import { GetPlatform } from "../../../platform/Platform";
import { helper } from "../../helper/Helper";

export default class BattleModule extends airkit.BaseModule {

    constructor() {
        super()
    }

    public setup(args: number): void {
        super.setup(args)
    }

    public start(): void {
        super.start()
        airkit.Log.info("Module Game start")
    }

    public enterScene(): void {

        airkit.SceneManager.Instance.gotoScene(SceneID.BATTLE_SCENE)

    }


    public update(dt: number): void {
        super.update(dt)
    }


    public res(): Array<[string, string]> {
        let assets = [

        ]
        return assets
    }

    public loaderTips(): string {
        return "资源加载中"
    }

    /**是否显示加载界面*/
    public loaderType(): number {
        return eLoaderType.FULLSCREEN
    }

    protected signalMap() {
        return null
    }


    public dispose(): void {
        super.dispose()
    }

}
