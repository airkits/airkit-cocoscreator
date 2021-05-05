/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIButtonBack from "./UIButtonBack";

export default class UIHomeScene extends airkit.BaseView {

	public ctrl:fgui.Controller;
	public bg:fgui.GGraph;
	public list:fgui.GList;
	public btnBack:UIButtonBack;
	public btnBattle:fgui.GButton;
	public txtUID:fgui.GTextInput;
	public lblName:fgui.GTextField;
	public static URL:string = "ui://21mnfg0cn70mh";
	public static PkgName:string = "Home";
	public static ResName:string = "HomeScene";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":3},"Loader":{"Loader_atlas0":1}};

	public static createInstance():UIHomeScene {
		return <UIHomeScene>(fgui.UIPackage.createObject("Home", "HomeScene"));
	}

	protected onConstruct():void {
		this.ctrl = this.getControllerAt(0);
		this.bg = <fgui.GGraph>(this.getChildAt(0));
		this.list = <fgui.GList>(this.getChildAt(1));
		this.btnBack = <UIButtonBack>(this.getChildAt(3));
		this.btnBattle = <fgui.GButton>(this.getChildAt(4));
		this.txtUID = <fgui.GTextInput>(this.getChildAt(5));
		this.lblName = <fgui.GTextField>(this.getChildAt(6));
	}
}