/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIAlert from "./UIAlert";

export default class UIAlertDlg extends airkit.BaseView {

	public bg:fgui.GComponent;
	public panel:UIAlert;
	public static URL:string = "ui://v9v1pqglnz2li";
	public static PkgName:string = "Loader";
	public static ResName:string = "AlertDlg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":5,"Loader_atlas_mdb81w":1}};

	public static createInstance():UIAlertDlg {
		return <UIAlertDlg>(fgui.UIPackage.createObject("Loader", "AlertDlg"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GComponent>(this.getChildAt(0));
		this.panel = <UIAlert>(this.getChildAt(1));
	}
}