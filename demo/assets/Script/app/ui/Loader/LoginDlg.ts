/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import bg from "./bg";

export default class LoginDlg extends fgui.GComponent {

	public m_bg:bg;
	public m_click:fgui.Transition;
	public m_t1:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0tb";
	public static PkgName:string = "Loader";
	public static ResName:string = "LoginDlg";

	public static createInstance():LoginDlg {
		return <LoginDlg>(fgui.UIPackage.createObject("Loader", "LoginDlg"));
	}

	protected onConstruct():void {
		this.m_bg = <bg>(this.getChildAt(0));
		this.m_click = this.getTransitionAt(0);
		this.m_t1 = this.getTransitionAt(1);
	}
}