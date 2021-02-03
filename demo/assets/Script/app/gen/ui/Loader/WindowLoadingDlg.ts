/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class WindowLoadingDlg extends airkit.BaseView {

	public m_progressBar:fgui.GProgressBar;
	public m_tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglsi0tf";
	public static PkgName:string = "Loader";
	public static ResName:string = "WindowLoadingDlg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":4}};

	public static createInstance():WindowLoadingDlg {
		return <WindowLoadingDlg>(fgui.UIPackage.createObject("Loader", "WindowLoadingDlg"));
	}

	protected onConstruct():void {
		this.m_progressBar = <fgui.GProgressBar>(this.getChildAt(1));
		this.m_tips = <fgui.GTextField>(this.getChildAt(2));
	}
}