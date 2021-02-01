/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import bg from "./bg";

export default class FullScreenLoadingDlg extends fgui.GComponent {

	public m_bg:bg;
	public m_tips:fgui.GTextField;
	public m_progressBar:fgui.GProgressBar;
	public m_t0:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0t8";
	public static PkgName:string = "Loader";
	public static ResName:string = "FullScreenLoadingDlg";

	public static createInstance():FullScreenLoadingDlg {
		return <FullScreenLoadingDlg>(fgui.UIPackage.createObject("Loader", "FullScreenLoadingDlg"));
	}

	protected onConstruct():void {
		this.m_bg = <bg>(this.getChildAt(0));
		this.m_tips = <fgui.GTextField>(this.getChildAt(1));
		this.m_progressBar = <fgui.GProgressBar>(this.getChildAt(2));
		this.m_t0 = this.getTransitionAt(0);
	}
}