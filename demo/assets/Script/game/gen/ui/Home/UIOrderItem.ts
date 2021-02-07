/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIOrderItem extends airkit.BaseView {

	public bg:fgui.GGraph;
	public lblName:fgui.GTextField;
	public imgIcon:fgui.GLoader;
	public lblState:fgui.GTextField;
	public lblAddress:fgui.GTextField;
	public lblUserName:fgui.GTextField;
	public lblPhone:fgui.GTextField;
	public lblTips:fgui.GTextField;
	public lblTitle:fgui.GTextField;
	public lblInfo:fgui.GTextField;
	public lblCopy:fgui.GTextField;
	public boxOrderInfo:fgui.GGroup;
	public static URL:string = "ui://21mnfg0cn70mi";
	public static PkgName:string = "Home";
	public static ResName:string = "OrderItem";
	public static ResMap:{ [index: string]: {} } = {"Home":{"Home_atlas0":2}};

	public static createInstance():UIOrderItem {
		return <UIOrderItem>(fgui.UIPackage.createObject("Home", "OrderItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GGraph>(this.getChildAt(0));
		this.lblName = <fgui.GTextField>(this.getChildAt(1));
		this.imgIcon = <fgui.GLoader>(this.getChildAt(2));
		this.lblState = <fgui.GTextField>(this.getChildAt(5));
		this.lblAddress = <fgui.GTextField>(this.getChildAt(6));
		this.lblUserName = <fgui.GTextField>(this.getChildAt(7));
		this.lblPhone = <fgui.GTextField>(this.getChildAt(8));
		this.lblTips = <fgui.GTextField>(this.getChildAt(9));
		this.lblTitle = <fgui.GTextField>(this.getChildAt(10));
		this.lblInfo = <fgui.GTextField>(this.getChildAt(11));
		this.lblCopy = <fgui.GTextField>(this.getChildAt(12));
		this.boxOrderInfo = <fgui.GGroup>(this.getChildAt(13));
	}
}