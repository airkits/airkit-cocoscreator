/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import bg from "./bg";

export default class LoginScene extends airkit.BaseView {

	public m_bg:bg;
	public m_click:fgui.Transition;
	public m_t1:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0tb";
	public static PkgName:string = "Loader";
	public static ResName:string = "LoginScene";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas_mdb81v":1,"Loader_atlas_hhom25":1,"Loader_atlas0":1}};

	public static createInstance():LoginScene {
		return <LoginScene>(fgui.UIPackage.createObject("Loader", "LoginScene"));
	}

	protected onConstruct():void {
		this.m_bg = <bg>(this.getChildAt(0));
		this.m_click = this.getTransitionAt(0);
		this.m_t1 = this.getTransitionAt(1);
	}
}