/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIbg from "./UIbg";

export default class UIFullScreenLoadingDlg extends airkit.BaseView {

	public bg:UIbg;
	public tips:fgui.GTextField;
	public progressBar:fgui.GProgressBar;
	public t0:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0t8";
	public static PkgName:string = "Loader";
	public static ResName:string = "FullScreenLoadingDlg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas_mdb81v":1,"Loader_atlas0":4}};

	public static createInstance():UIFullScreenLoadingDlg {
		return <UIFullScreenLoadingDlg>(fgui.UIPackage.createObject("Loader", "FullScreenLoadingDlg"));
	}

	protected onConstruct():void {
		this.bg = <UIbg>(this.getChildAt(0));
		this.tips = <fgui.GTextField>(this.getChildAt(1));
		this.progressBar = <fgui.GProgressBar>(this.getChildAt(2));
		this.t0 = this.getTransitionAt(0);
	}
}