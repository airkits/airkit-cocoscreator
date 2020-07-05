const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    private _view: fgui.GComponent;

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        airkit.Framework.Instance.setup(fgui.GRoot.inst);

        //这里填写的是相对于resources里的路径
        let res = [
            "ui/Loader", //描述文件
            "ui/Loader_atlas0", //纹理集
        ];
        cc.loader.loadResArray(res, function (err, assets) {
            //都加载完毕后再调用addPackage
            fgui.UIPackage.addPackage("ui/Loader");

            //下面就可以开始创建包里的界面了。
            this._view = fgui.UIPackage.createObject("Loader", "Login").asCom;
            this._view.makeFullScreen();
            fgui.GRoot.inst.addChild(this._view);
        });
    }

    start() {
        console.log("hello");
    }
}
