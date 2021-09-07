/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIButtonBack from "./UIButtonBack";

export default class UIBattleScene extends airkit.BaseScene {

	public ctrl:fgui.Controller;
	public btnBack:UIButtonBack;
	public player:fgui.GMovieClip;
	public static URL:string = "ui://21mnfg0cy3shk";
	public static PkgName:string = "Home";
	public static ResName:string = "BattleScene";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":1}};

	public static createInstance():UIBattleScene {
		return <UIBattleScene>(fgui.UIPackage.createObject("Home", "BattleScene"));
	}

	protected onConstruct():void {
		this.ctrl = this.getControllerAt(0);
		this.btnBack = <UIButtonBack>(this.getChildAt(0));
		this.player = <fgui.GMovieClip>(this.getChildAt(1));
	}
}