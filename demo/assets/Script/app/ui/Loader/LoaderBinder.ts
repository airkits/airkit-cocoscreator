/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import Alert from "./Alert";
import Toast from "./Toast";
import MaskBg from "./MaskBg";
import FullScreenLoading from "./FullScreenLoading";
import Loading from "./Loading";
import AlertDlg from "./AlertDlg";
import Panel from "./Panel";
import Popup from "./Popup";
import bg from "./bg";
import FullScreenLoadingDlg from "./FullScreenLoadingDlg";
import LoadingDlg from "./LoadingDlg";
import LoginDlg from "./LoginDlg";
import ToastView from "./ToastView";
import WindowLoadingDlg from "./WindowLoadingDlg";

export default class LoaderBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(Alert.URL, Alert);
		fgui.UIObjectFactory.setExtension(Toast.URL, Toast);
		fgui.UIObjectFactory.setExtension(MaskBg.URL, MaskBg);
		fgui.UIObjectFactory.setExtension(FullScreenLoading.URL, FullScreenLoading);
		fgui.UIObjectFactory.setExtension(Loading.URL, Loading);
		fgui.UIObjectFactory.setExtension(AlertDlg.URL, AlertDlg);
		fgui.UIObjectFactory.setExtension(Panel.URL, Panel);
		fgui.UIObjectFactory.setExtension(Popup.URL, Popup);
		fgui.UIObjectFactory.setExtension(bg.URL, bg);
		fgui.UIObjectFactory.setExtension(FullScreenLoadingDlg.URL, FullScreenLoadingDlg);
		fgui.UIObjectFactory.setExtension(LoadingDlg.URL, LoadingDlg);
		fgui.UIObjectFactory.setExtension(LoginDlg.URL, LoginDlg);
		fgui.UIObjectFactory.setExtension(ToastView.URL, ToastView);
		fgui.UIObjectFactory.setExtension(WindowLoadingDlg.URL, WindowLoadingDlg);
	}
}