/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIToast extends airkit.BaseView {

	public tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglnz2l11";
	public static PkgName:string = "Loader";
	public static ResName:string = "Toast";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():UIToast {
		return <UIToast>(fgui.UIPackage.createObject("Loader", "Toast"));
	}

	protected onConstruct():void {
		this.tips = <fgui.GTextField>(this.getChildAt(1));
	}
}