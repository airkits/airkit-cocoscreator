/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIToastView extends airkit.BaseView {

	public m_tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglsi0te";
	public static PkgName:string = "Loader";
	public static ResName:string = "ToastView";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":2}};

	public static createInstance():UIToastView {
		return <UIToastView>(fgui.UIPackage.createObject("Loader", "ToastView"));
	}

	protected onConstruct():void {
		this.m_tips = <fgui.GTextField>(this.getChildAt(2));
	}
}