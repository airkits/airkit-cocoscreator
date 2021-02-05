/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIMaskBg from "./UIMaskBg";

export default class UILoading extends airkit.BaseView {

	public m_bg:UIMaskBg;
	public m_text:fgui.GTextField;
	public m_loading:fgui.Transition;
	public static URL:string = "ui://v9v1pqglnz2l14";
	public static PkgName:string = "Loader";
	public static ResName:string = "Loading";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():UILoading {
		return <UILoading>(fgui.UIPackage.createObject("Loader", "Loading"));
	}

	protected onConstruct():void {
		this.m_bg = <UIMaskBg>(this.getChildAt(0));
		this.m_text = <fgui.GTextField>(this.getChildAt(2));
		this.m_loading = this.getTransitionAt(0);
	}
}