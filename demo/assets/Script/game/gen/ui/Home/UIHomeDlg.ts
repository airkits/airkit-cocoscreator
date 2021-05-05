/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIHomeDlg extends airkit.BaseView {

	public ctrl:fgui.Controller;
	public bg:fgui.GGraph;
	public list:fgui.GList;
	public backBtn:fgui.GImage;
	public static URL:string = "ui://21mnfg0cfqe2j";
	public static PkgName:string = "Home";
	public static ResName:string = "HomeDlg";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":3}};

	public static createInstance():UIHomeDlg {
		return <UIHomeDlg>(fgui.UIPackage.createObject("Home", "HomeDlg"));
	}

	protected onConstruct():void {
		this.ctrl = this.getControllerAt(0);
		this.bg = <fgui.GGraph>(this.getChildAt(0));
		this.list = <fgui.GList>(this.getChildAt(1));
		this.backBtn = <fgui.GImage>(this.getChildAt(2));
	}
}