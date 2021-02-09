/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIbg from "./UIbg";

export default class UILoginScene extends airkit.BaseView {

	public bg:UIbg;
	public imgBg:fgui.GLoader;
	public btnStart:fgui.GButton;
	public btnShowDlg:fgui.GButton;
	public click:fgui.Transition;
	public t1:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0tb";
	public static PkgName:string = "Loader";
	public static ResName:string = "LoginScene";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas_mdb81v":1,"Loader_atlas_hhom25":1,"Loader_atlas0":2}};

	public static createInstance():UILoginScene {
		return <UILoginScene>(fgui.UIPackage.createObject("Loader", "LoginScene"));
	}

	protected onConstruct():void {
		this.bg = <UIbg>(this.getChildAt(0));
		this.imgBg = <fgui.GLoader>(this.getChildAt(1));
		this.btnStart = <fgui.GButton>(this.getChildAt(3));
		this.btnShowDlg = <fgui.GButton>(this.getChildAt(4));
		this.click = this.getTransitionAt(0);
		this.t1 = this.getTransitionAt(1);
	}
}