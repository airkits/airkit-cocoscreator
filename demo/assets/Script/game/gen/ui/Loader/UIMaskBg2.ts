/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIMaskBg2 extends airkit.BaseView {

	public bg:fgui.GImage;
	public static URL:string = "ui://v9v1pqglsi0td";
	public static PkgName:string = "Loader";
	public static ResName:string = "MaskBg2";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":1}};

	public static createInstance():UIMaskBg2 {
		return <UIMaskBg2>(fgui.UIPackage.createObject("Loader", "MaskBg2"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChildAt(0));
	}
}