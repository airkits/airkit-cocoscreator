/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Home extends fgui.GComponent {

	public m_ctrl:fgui.Controller;
	public m_bg:fgui.GGraph;
	public m_emptyIcon:fgui.GImage;
	public m_list:fgui.GList;
	public m_backBtn:fgui.GImage;
	public m_title:fgui.GTextField;
	public static URL:string = "ui://21mnfg0cn70mh";
	public static PkgName:string = "Home";
	public static ResName:string = "Home";

	public static createInstance():Home {
		return <Home>(fgui.UIPackage.createObject("Home", "Home"));
	}

	protected onConstruct():void {
		this.m_ctrl = this.getControllerAt(0);
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_emptyIcon = <fgui.GImage>(this.getChildAt(1));
		this.m_list = <fgui.GList>(this.getChildAt(2));
		this.m_backBtn = <fgui.GImage>(this.getChildAt(3));
		this.m_title = <fgui.GTextField>(this.getChildAt(4));
	}
}