/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class ToastView extends fgui.GComponent {

	public m_tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglsi0te";
	public static PkgName:string = "Loader";
	public static ResName:string = "ToastView";

	public static createInstance():ToastView {
		return <ToastView>(fgui.UIPackage.createObject("Loader", "ToastView"));
	}

	protected onConstruct():void {
		this.m_tips = <fgui.GTextField>(this.getChildAt(2));
	}
}