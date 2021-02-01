/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import Home from "./Home";
import OrderItem from "./OrderItem";

export default class HomeBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(Home.URL, Home);
		fgui.UIObjectFactory.setExtension(OrderItem.URL, OrderItem);
	}
}