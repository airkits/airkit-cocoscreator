import UIAlertDlg from '../../gen/ui/Loader/UIAlertDlg';
export class AlertDlg extends ak.Dialog {
    public constructor() {
        super();
    }

    public setup(args?:any): void {
        super.setup(args);
        this.contentPane = UIAlertDlg.createInstance();
        this.center();
        this.modal = true;
        
    }

     //先加载资源
     public static res(): Array<ak.Res> {
        return this.buildRes(UIAlertDlg.ResMap);
    }
   
    protected doShowAnimation(): void {
        this.setScale(0, 0);
        this.setPivot(0.5,0.5);
        fgui.GTween.to2(0.1, 0.1, 1, 1, 0.3)
            .setTarget(this, this.setScale)
            .setEase(fgui.EaseType.SineIn)
            .onComplete(super.doShowAnimation, this);
    }

    protected doHideAnimation(): void {
       
        fgui.GTween.to2(1, 1, 0, 0, 0.3)
            .setTarget(this, this.setScale)
            .setEase(fgui.EaseType.SineOut)
            .onComplete(super.doHideAnimation, this);
    }
}
