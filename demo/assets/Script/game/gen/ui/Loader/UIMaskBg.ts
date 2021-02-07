/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIMaskBg extends airkit.BaseView {

	public bg:fgui.GGraph;
	public static URL:string = "ui://v9v1pqglnz2l12";
	public static PkgName:string = "Loader";
	public static ResName:string = "MaskBg";
	public static ResMap:{ [index: string]: {} } = {};

	public static createInstance():UIMaskBg {
		return <UIMaskBg>(fgui.UIPackage.createObject("Loader", "MaskBg"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GGraph>(this.getChildAt(0));
	}
}