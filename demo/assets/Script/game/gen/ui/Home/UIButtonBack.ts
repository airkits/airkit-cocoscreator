/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIButtonBack extends fgui.GButton {

	public btnBack:fgui.GImage;
	public static URL:string = "ui://21mnfg0cy3shl";
	public static PkgName:string = "Home";
	public static ResName:string = "ButtonBack";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":1}};

	public static createInstance():UIButtonBack {
		return <UIButtonBack>(fgui.UIPackage.createObject("Home", "ButtonBack"));
	}

	protected onConstruct():void {
		this.btnBack = <fgui.GImage>(this.getChildAt(0));
	}
}