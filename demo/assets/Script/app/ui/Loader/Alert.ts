/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Alert extends fgui.GComponent {

	public m_cancelBtn:fgui.GButton;
	public m_confirmBtn:fgui.GButton;
	public m_closeBtn:fgui.GButton;
	public m_content:fgui.GTextField;
	public m_tips:fgui.GTextField;
	public static URL:string = "ui://v9v1pqglnz2l10";
	public static PkgName:string = "Loader";
	public static ResName:string = "Alert";

	public static createInstance():Alert {
		return <Alert>(fgui.UIPackage.createObject("Loader", "Alert"));
	}

	protected onConstruct():void {
		this.m_cancelBtn = <fgui.GButton>(this.getChildAt(1));
		this.m_confirmBtn = <fgui.GButton>(this.getChildAt(2));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(3));
		this.m_content = <fgui.GTextField>(this.getChildAt(4));
		this.m_tips = <fgui.GTextField>(this.getChildAt(5));
	}
}