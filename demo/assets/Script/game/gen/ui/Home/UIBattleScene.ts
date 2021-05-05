/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIButtonBack from "./UIButtonBack";

export default class UIBattleScene extends airkit.BaseView {

	public ctrl:fgui.Controller;
	public bg:fgui.GImage;
	public list:fgui.GList;
	public btnBack:UIButtonBack;
	public static URL:string = "ui://21mnfg0cy3shk";
	public static PkgName:string = "Home";
	public static ResName:string = "BattleScene";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":4}};

	public static createInstance():UIBattleScene {
		return <UIBattleScene>(fgui.UIPackage.createObject("Home", "BattleScene"));
	}

	protected onConstruct():void {
		this.ctrl = this.getControllerAt(0);
		this.bg = <fgui.GImage>(this.getChildAt(0));
		this.list = <fgui.GList>(this.getChildAt(1));
		this.btnBack = <UIButtonBack>(this.getChildAt(2));
	}
}