/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UILoadingDlg extends airkit.BaseView {

	public tips:fgui.GTextField;
	public loading:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0ta";
	public static PkgName:string = "Loader";
	public static ResName:string = "LoadingDlg";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":1}};

	public static createInstance():UILoadingDlg {
		return <UILoadingDlg>(fgui.UIPackage.createObject("Loader", "LoadingDlg"));
	}

	protected onConstruct():void {
		this.tips = <fgui.GTextField>(this.getChildAt(1));
		this.loading = this.getTransitionAt(0);
	}
}