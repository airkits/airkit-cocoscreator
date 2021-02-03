/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Popup extends airkit.BaseView {

	public m_content:fgui.GGraph;
	public m_closeBtn:fgui.GButton;
	public static URL:string = "ui://v9v1pqglnz2lz";
	public static PkgName:string = "Loader";
	public static ResName:string = "Popup";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():Popup {
		return <Popup>(fgui.UIPackage.createObject("Loader", "Popup"));
	}

	protected onConstruct():void {
		this.m_content = <fgui.GGraph>(this.getChildAt(1));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(2));
	}
}