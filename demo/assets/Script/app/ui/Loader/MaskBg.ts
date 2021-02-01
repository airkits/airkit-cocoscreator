/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class MaskBg extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public static URL:string = "ui://v9v1pqglnz2l12";
	public static PkgName:string = "Loader";
	public static ResName:string = "MaskBg";

	public static createInstance():MaskBg {
		return <MaskBg>(fgui.UIPackage.createObject("Loader", "MaskBg"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
	}
}