/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIbg extends airkit.BaseView {

	public m_bg:fgui.GImage;
	public static URL:string = "ui://v9v1pqglp6l917";
	public static PkgName:string = "Loader";
	public static ResName:string = "bg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas_mdb81v":1}};

	public static createInstance():UIbg {
		return <UIbg>(fgui.UIPackage.createObject("Loader", "bg"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GImage>(this.getChildAt(0));
	}
}