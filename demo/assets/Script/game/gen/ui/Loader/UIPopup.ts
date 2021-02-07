/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIPopup extends airkit.BaseView {

	public content:fgui.GGraph;
	public closeBtn:fgui.GButton;
	public static URL:string = "ui://v9v1pqglnz2lz";
	public static PkgName:string = "Loader";
	public static ResName:string = "Popup";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():UIPopup {
		return <UIPopup>(fgui.UIPackage.createObject("Loader", "Popup"));
	}

	protected onConstruct():void {
		this.content = <fgui.GGraph>(this.getChildAt(1));
		this.closeBtn = <fgui.GButton>(this.getChildAt(2));
	}
}