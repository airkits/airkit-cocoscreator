/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UIHomeDlg from "./UIHomeDlg";
import UIHomeScene from "./UIHomeScene";
import UIOrderItem from "./UIOrderItem";

export default class HomeBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UIHomeDlg.URL, UIHomeDlg);
		fgui.UIObjectFactory.setExtension(UIHomeScene.URL, UIHomeScene);
		fgui.UIObjectFactory.setExtension(UIOrderItem.URL, UIOrderItem);
	}
}