import UIFullScreenLoadingDlg from '../../gen/ui/Loader/UIFullScreenLoadingDlg'
import UIResMap from '../../gen/ui/UIResMap'

export default class SystemModule extends airkit.BaseModule {
    constructor() {
        super()
    }

    public setup(args: number): void {
        super.setup(args)
    }

    public enter(): void {
        super.enter()
        airkit.Log.info('Module login enter')
    }

    public update(dt: number): void {
        super.update(dt)
    }

    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UIFullScreenLoadingDlg.ResMap, UIResMap.ResMap)
    }

    /**是否显示加载界面*/
    public static loaderType(): number {
        return ak.eLoaderType.NONE
    }

    protected signalMap() {
        return null
    }

    public dispose(): void {
        super.dispose()
    }
}
