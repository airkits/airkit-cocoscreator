/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import HomeDlg from "./HomeDlg";
import HomeScene from "./HomeScene";
import OrderItem from "./OrderItem";

export default class HomeBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(HomeDlg.URL, HomeDlg);
		fgui.UIObjectFactory.setExtension(HomeScene.URL, HomeScene);
		fgui.UIObjectFactory.setExtension(OrderItem.URL, OrderItem);
	}
}