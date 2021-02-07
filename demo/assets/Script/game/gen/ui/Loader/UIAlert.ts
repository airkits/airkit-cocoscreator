/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIAlert extends airkit.BaseView {

	public cancelBtn:fgui.GButton;
	public confirmBtn:fgui.GButton;
	public closeBtn:fgui.GButton;
	public content:fgui.GTextField;
	public tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglnz2l10";
	public static PkgName:string = "Loader";
	public static ResName:string = "Alert";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":4,"Loader_atlas_mdb81w":1}};

	public static createInstance():UIAlert {
		return <UIAlert>(fgui.UIPackage.createObject("Loader", "Alert"));
	}

	protected onConstruct():void {
		this.cancelBtn = <fgui.GButton>(this.getChildAt(1));
		this.confirmBtn = <fgui.GButton>(this.getChildAt(2));
		this.closeBtn = <fgui.GButton>(this.getChildAt(3));
		this.content = <fgui.GTextField>(this.getChildAt(4));
		this.tips = <fgui.GTextField>(this.getChildAt(5));
	}
}