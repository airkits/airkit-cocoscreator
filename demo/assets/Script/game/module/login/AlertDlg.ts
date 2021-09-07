import UIAlertDlg from '../../gen/ui/Loader/UIAlertDlg'
import UIResMap from '../../gen/ui/UIResMap'
export class AlertDlg extends ak.Dialog {
    public constructor() {
        super()
    }

    public createDlgView(): fgui.GComponent {
        return UIAlertDlg.createInstance()
    }

    public setup(args?: any): void {
        super.setup(args)

        this.modal = true

        // this.center();
    }

    protected eventMap(): Array<any> {
        return [[(<UIAlertDlg>this.contentPane).confirmBtn, fgui.Event.CLICK, this.onConfirmBtnClick]]
    }
    public onConfirmBtnClick(): void {
        this.close({ result: ak.eDlgResult.YES, data: ['ok'] })
    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UIAlertDlg.ResMap, UIResMap.ResMap)
    }

    protected doShowAnimation(): void {
        this.setScale(0, 0)
        this.setPivot(0.5, 0.5)
        this.modalShowAnimation(0.3)
        fgui.GTween.to2(0.1, 0.1, 1, 1, 0.3).setTarget(this, this.setScale).setEase(fgui.EaseType.SineIn).onComplete(super.doShowAnimation, this)
    }

    protected doHideAnimation(): void {
        this.modalHideAnimation(0.3)

        fgui.GTween.to2(1, 1, 0, 0, 0.3).setTarget(this, this.setScale).setEase(fgui.EaseType.SineOut).onComplete(this.hideImmediately, this)
    }
}
