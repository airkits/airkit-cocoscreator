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
   
}
