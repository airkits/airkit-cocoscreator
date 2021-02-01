/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import Alert from "./Alert";

export default class AlertDlg extends fgui.GComponent {

	public m_bg:fgui.GComponent;
	public m_panel:Alert;
	public static URL:string = "ui://v9v1pqglnz2li";
	public static PkgName:string = "Loader";
	public static ResName:string = "AlertDlg";

	public static createInstance():AlertDlg {
		return <AlertDlg>(fgui.UIPackage.createObject("Loader", "AlertDlg"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GComponent>(this.getChildAt(0));
		this.m_panel = <Alert>(this.getChildAt(1));
	}
}