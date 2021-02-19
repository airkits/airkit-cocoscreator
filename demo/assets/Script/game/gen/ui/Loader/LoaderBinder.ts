/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIAlert from "./UIAlert";
import UIToast from "./UIToast";
import UIMaskBg from "./UIMaskBg";
import UIFullScreenLoading from "./UIFullScreenLoading";
import UILoading from "./UILoading";
import UIAlertDlg from "./UIAlertDlg";
import UIPanel from "./UIPanel";
import UIPopup from "./UIPopup";
import UIWindowFrame from "./UIWindowFrame";
import UIbg from "./UIbg";
import UIFullScreenLoadingDlg from "./UIFullScreenLoadingDlg";
import UILoadingDlg from "./UILoadingDlg";
import UILoginScene from "./UILoginScene";
import UIMaskBg2 from "./UIMaskBg2";
import UIToastView from "./UIToastView";
import UIWindowLoadingDlg from "./UIWindowLoadingDlg";

export default class LoaderBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UIAlert.URL, UIAlert);
		fgui.UIObjectFactory.setExtension(UIToast.URL, UIToast);
		fgui.UIObjectFactory.setExtension(UIMaskBg.URL, UIMaskBg);
		fgui.UIObjectFactory.setExtension(UIFullScreenLoading.URL, UIFullScreenLoading);
		fgui.UIObjectFactory.setExtension(UILoading.URL, UILoading);
		fgui.UIObjectFactory.setExtension(UIAlertDlg.URL, UIAlertDlg);
		fgui.UIObjectFactory.setExtension(UIPanel.URL, UIPanel);
		fgui.UIObjectFactory.setExtension(UIPopup.URL, UIPopup);
		fgui.UIObjectFactory.setExtension(UIWindowFrame.URL, UIWindowFrame);
		fgui.UIObjectFactory.setExtension(UIbg.URL, UIbg);
		fgui.UIObjectFactory.setExtension(UIFullScreenLoadingDlg.URL, UIFullScreenLoadingDlg);
		fgui.UIObjectFactory.setExtension(UILoadingDlg.URL, UILoadingDlg);
		fgui.UIObjectFactory.setExtension(UILoginScene.URL, UILoginScene);
		fgui.UIObjectFactory.setExtension(UIMaskBg2.URL, UIMaskBg2);
		fgui.UIObjectFactory.setExtension(UIToastView.URL, UIToastView);
		fgui.UIObjectFactory.setExtension(UIWindowLoadingDlg.URL, UIWindowLoadingDlg);
	}
}