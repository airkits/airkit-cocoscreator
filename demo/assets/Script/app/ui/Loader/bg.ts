/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class bg extends fgui.GComponent {

	public m_bg:fgui.GImage;
	public static URL:string = "ui://v9v1pqglp6l917";
	public static PkgName:string = "Loader";
	public static ResName:string = "bg";

	public static createInstance():bg {
		return <bg>(fgui.UIPackage.createObject("Loader", "bg"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GImage>(this.getChildAt(0));
	}
}