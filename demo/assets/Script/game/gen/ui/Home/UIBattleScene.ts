/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIBattleScene extends airkit.BaseView {

	public ctrl:fgui.Controller;
	public bg:fgui.GGraph;
	public emptyIcon:fgui.GImage;
	public list:fgui.GList;
	public btnBack:fgui.GImage;
	public title:fgui.GTextField;
	public static URL:string = "ui://21mnfg0cy3shk";
	public static PkgName:string = "Home";
	public static ResName:string = "BattleScene";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":4}};

	public static createInstance():UIBattleScene {
		return <UIBattleScene>(fgui.UIPackage.createObject("Home", "BattleScene"));
	}

	protected onConstruct():void {
		this.ctrl = this.getControllerAt(0);
		this.bg = <fgui.GGraph>(this.getChildAt(0));
		this.emptyIcon = <fgui.GImage>(this.getChildAt(1));
		this.list = <fgui.GList>(this.getChildAt(2));
		this.btnBack = <fgui.GImage>(this.getChildAt(3));
		this.title = <fgui.GTextField>(this.getChildAt(4));
	}
}