/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class LoadingDlg extends fgui.GComponent {

	public m_mask:fgui.GComponent;
	public m_text:fgui.GTextField;
	public m_loading:fgui.Transition;
	public static URL:string = "ui://v9v1pqglsi0ta";
	public static PkgName:string = "Loader";
	public static ResName:string = "LoadingDlg";

	public static createInstance():LoadingDlg {
		return <LoadingDlg>(fgui.UIPackage.createObject("Loader", "LoadingDlg"));
	}

	protected onConstruct():void {
		this.m_mask = <fgui.GComponent>(this.getChildAt(0));
		this.m_text = <fgui.GTextField>(this.getChildAt(2));
		this.m_loading = this.getTransitionAt(0);
	}
}