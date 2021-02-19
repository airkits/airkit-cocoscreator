/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIWindowLoadingDlg extends airkit.BaseView {

	public progressBar:fgui.GProgressBar;
	public tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglsi0tf";
	public static PkgName:string = "Loader";
	public static ResName:string = "WindowLoadingDlg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":3}};

	public static createInstance():UIWindowLoadingDlg {
		return <UIWindowLoadingDlg>(fgui.UIPackage.createObject("Loader", "WindowLoadingDlg"));
	}

	protected onConstruct():void {
		this.progressBar = <fgui.GProgressBar>(this.getChildAt(0));
		this.tips = <fgui.GTextField>(this.getChildAt(1));
	}
}