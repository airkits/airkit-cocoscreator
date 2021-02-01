/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Toast extends fgui.GComponent {

	public m_tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglnz2l11";
	public static PkgName:string = "Loader";
	public static ResName:string = "Toast";

	public static createInstance():Toast {
		return <Toast>(fgui.UIPackage.createObject("Loader", "Toast"));
	}

	protected onConstruct():void {
		this.m_tips = <fgui.GTextField>(this.getChildAt(1));
	}
}