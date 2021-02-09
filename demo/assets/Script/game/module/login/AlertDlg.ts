import UIAlertDlg from '../../gen/ui/Loader/UIAlertDlg';
export class AlertDlg extends ak.Dialog {
    public constructor() {
        super();
    }

    protected onInit(): void {
        this.contentPane = UIAlertDlg.createInstance();
        this.center();
    }

}
