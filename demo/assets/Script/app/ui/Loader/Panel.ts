/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Panel extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public static URL:string = "ui://v9v1pqglnz2lv";
	public static PkgName:string = "Loader";
	public static ResName:string = "Panel";

	public static createInstance():Panel {
		return <Panel>(fgui.UIPackage.createObject("Loader", "Panel"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
	}
}