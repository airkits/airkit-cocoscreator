/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FullScreenLoading extends airkit.BaseView {

	public m_progressBar:fgui.GProgressBar;
	public m_tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglnz2l13";
	public static PkgName:string = "Loader";
	public static ResName:string = "FullScreenLoading";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():FullScreenLoading {
		return <FullScreenLoading>(fgui.UIPackage.createObject("Loader", "FullScreenLoading"));
	}

	protected onConstruct():void {
		this.m_progressBar = <fgui.GProgressBar>(this.getChildAt(1));
		this.m_tips = <fgui.GTextField>(this.getChildAt(2));
	}
}