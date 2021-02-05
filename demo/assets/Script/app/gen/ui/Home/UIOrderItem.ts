/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIOrderItem extends airkit.BaseView {

	public m_bg:fgui.GGraph;
	public m_lblName:fgui.GTextField;
	public m_imgIcon:fgui.GLoader;
	public m_lblState:fgui.GTextField;
	public m_lblAddress:fgui.GTextField;
	public m_lblUserName:fgui.GTextField;
	public m_lblPhone:fgui.GTextField;
	public m_lblTips:fgui.GTextField;
	public m_lblTitle:fgui.GTextField;
	public m_lblInfo:fgui.GTextField;
	public m_lblCopy:fgui.GTextField;
	public m_boxOrderInfo:fgui.GGroup;
	public static URL:string = "ui://21mnfg0cn70mi";
	public static PkgName:string = "Home";
	public static ResName:string = "OrderItem";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":2}};

	public static createInstance():UIOrderItem {
		return <UIOrderItem>(fgui.UIPackage.createObject("Home", "OrderItem"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_lblName = <fgui.GTextField>(this.getChildAt(1));
		this.m_imgIcon = <fgui.GLoader>(this.getChildAt(2));
		this.m_lblState = <fgui.GTextField>(this.getChildAt(5));
		this.m_lblAddress = <fgui.GTextField>(this.getChildAt(6));
		this.m_lblUserName = <fgui.GTextField>(this.getChildAt(7));
		this.m_lblPhone = <fgui.GTextField>(this.getChildAt(8));
		this.m_lblTips = <fgui.GTextField>(this.getChildAt(9));
		this.m_lblTitle = <fgui.GTextField>(this.getChildAt(10));
		this.m_lblInfo = <fgui.GTextField>(this.getChildAt(11));
		this.m_lblCopy = <fgui.GTextField>(this.getChildAt(12));
		this.m_boxOrderInfo = <fgui.GGroup>(this.getChildAt(13));
	}
}