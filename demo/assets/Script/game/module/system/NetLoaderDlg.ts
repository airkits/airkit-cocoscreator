import UILoadingDlg from '../../gen/ui/Loader/UILoadingDlg'
import UIResMap from '../../gen/ui/UIResMap'
export class NetLoaderDlg extends ak.LoaderDialog {
    public constructor() {
        super()
    }

    public createDlgView(): fgui.GComponent {
        return UILoadingDlg.createInstance()
    }

    public get view(): UILoadingDlg {
        return <UILoadingDlg>this.contentPane
    }
    public setup(type: ak.eLoaderType): void {
        super.setup(type)
        this.center()
        this.modal = true
    }
    protected doShowAnimation(): void {
        this.modalShowAnimation(0.2)
        super.doShowAnimation()
    }

    protected doHideAnimation(): void {
        this.modalHideAnimation(0.3, 0.2)
        fgui.GTween.to(1, 0, 0.3).setTarget(this, this.alpha).setEase(fgui.EaseType.SineOut).onComplete(this.hideImmediately, this)
    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UILoadingDlg.ResMap, UIResMap.ResMap)
    }

    public onOpen(total: number): void {
        console.log('full screen onOpen')
    }
    public setTips(s: string): void {
        this.view.tips.text = s
    }
    public setProgress(cur: number, total: number): void {
        console.log('full screen setProgress')
    }
    public onClose(): boolean {
        return super.onClose()
    }
}
