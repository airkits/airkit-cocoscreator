/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIWindowFrame extends fgui.GLabel {

	public dragArea:fgui.GGraph;
	public closeButton:fgui.GButton;
	public static URL:string = "ui://v9v1pqglo3ko26";
	public static PkgName:string = "Loader";
	public static ResName:string = "WindowFrame";
	public static ResMap:{ [index: string]: {} } = {"Loader":{"Loader_atlas0":2}};

	public static createInstance():UIWindowFrame {
		return <UIWindowFrame>(fgui.UIPackage.createObject("Loader", "WindowFrame"));
	}

	protected onConstruct():void {
		this.dragArea = <fgui.GGraph>(this.getChildAt(1));
		this.closeButton = <fgui.GButton>(this.getChildAt(3));
	}
}