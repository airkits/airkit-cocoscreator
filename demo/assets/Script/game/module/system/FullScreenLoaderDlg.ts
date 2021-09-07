import UIFullScreenLoadingDlg from '../../gen/ui/Loader/UIFullScreenLoadingDlg'
import UIResMap from '../../gen/ui/UIResMap'
export class FullScreenLoaderDlg extends ak.LoaderDialog {
    public constructor() {
        super()
    }

    public createDlgView(): fgui.GComponent {
        return UIFullScreenLoadingDlg.createInstance()
    }

    public get view(): UIFullScreenLoadingDlg {
        return <UIFullScreenLoadingDlg>this.contentPane
    }
    public setup(type: ak.eLoaderType): void {
        super.setup(type)
        this.center()
        this.modal = true
        console.log('full screen setup')
    }
    protected doHideAnimation(): void {
        fgui.GTween.to(1, 0, 0.3).setTarget(this, this.alpha).setEase(fgui.EaseType.SineOut).onComplete(this.hideImmediately, this)
    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UIFullScreenLoadingDlg.ResMap, UIResMap.ResMap)
    }

    public onOpen(total: number): void {
        this.view.progressBar.value = 0
        console.log('full screen onOpen')
    }
    public setTips(s: string): void {
        this.view.tips.text = s
    }
    public setProgress(cur: number, total: number): void {
        this.view.progressBar.value = ((cur / total) * 100) >> 0
        console.log('full screen setProgress')
    }
    public onClose(): boolean {
        return super.onClose()
    }
}
