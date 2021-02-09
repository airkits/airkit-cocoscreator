/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIWindowFrame from "./UIWindowFrame";

export default class UIAlertDlg extends airkit.BaseView {

	public frame:UIWindowFrame;
	public cancelBtn:fgui.GButton;
	public confirmBtn:fgui.GButton;
	public content:fgui.GTextField;
	public tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglnz2li";
	public static PkgName:string = "Loader";
	public static ResName:string = "AlertDlg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":4}};

	public static createInstance():UIAlertDlg {
		return <UIAlertDlg>(fgui.UIPackage.createObject("Loader", "AlertDlg"));
	}

	protected onConstruct():void {
		this.frame = <UIWindowFrame>(this.getChildAt(0));
		this.cancelBtn = <fgui.GButton>(this.getChildAt(1));
		this.confirmBtn = <fgui.GButton>(this.getChildAt(2));
		this.content = <fgui.GTextField>(this.getChildAt(3));
		this.tips = <fgui.GTextField>(this.getChildAt(4));
	}
}