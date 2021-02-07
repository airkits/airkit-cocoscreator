/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIMaskBg from "./UIMaskBg";

export default class UILoading extends airkit.BaseView {

	public bg:UIMaskBg;
	public text:fgui.GTextField;
	public loading:fgui.Transition;
	public static URL:string = "ui://v9v1pqglnz2l14";
	public static PkgName:string = "Loader";
	public static ResName:string = "Loading";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():UILoading {
		return <UILoading>(fgui.UIPackage.createObject("Loader", "Loading"));
	}

	protected onConstruct():void {
		this.bg = <UIMaskBg>(this.getChildAt(0));
		this.text = <fgui.GTextField>(this.getChildAt(2));
		this.loading = this.getTransitionAt(0);
	}
}