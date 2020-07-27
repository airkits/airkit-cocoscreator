const { ccclass, property } = cc._decorator;

@ccclass
export default class DemoEntry extends cc.Component {
    private _closeButton: fgui.GObject;
    private _currentDemo: cc.Component;

    onLoad() {
        fgui.GRoot.create();

        // this.node.on("start_demo", this.onDemoStart, this);
        // this.addComponent(MainMenu);
        airkit.Framework.Instance.setup(
            fgui.GRoot.inst,
            ak.LogLevel.DEBUG,
            cc.winSize.width,
            cc.winSize.height
        );
        // cc.resources.load(
        //     ["ui/Loader.bin", "ui/Loader_atlas0.png"],
        //     (err, assets) => {
        //         fgui.UIPackage.addPackage("ui/Loader");
        //         let node = fgui.UIPackage.createObject("Loader", "Main");
        //         fgui.GRoot.inst.addChild(node);
        //     }
        // );
        //这里填写的是相对于resources里的路径

        let res = [
            { url: "ui/Loader", type: null }, //描述文件
            { url: "ui/Loader_atlas0", type: null }, //纹理集
        ];

        airkit.ResourceManager.Instance.loadArrayRes(res).then((v) => {
            //     //都加载完毕后再调用addPackage
            fgui.UIPackage.addPackage("ui/Loader");
            let view: fgui.GComponent = fgui.UIPackage.createObject(
                "Loader",
                "Login"
            ).asCom;
            fgui.GRoot.inst.addChild(view);
        });
    }

    // onDemoStart(demo) {
    //     this._currentDemo = demo;
    //     this._closeButton = fgui.UIPackage.createObject(
    //         "MainMenu",
    //         "CloseButton"
    //     );
    //     this._closeButton.setPosition(
    //         fgui.GRoot.inst.width - this._closeButton.width - 10,
    //         fgui.GRoot.inst.height - this._closeButton.height - 10
    //     );
    //     this._closeButton.addRelation(
    //         fgui.GRoot.inst,
    //         fgui.RelationType.Right_Right
    //     );
    //     this._closeButton.addRelation(
    //         fgui.GRoot.inst,
    //         fgui.RelationType.Bottom_Bottom
    //     );
    //     this._closeButton.sortingOrder = 100000;
    //     this._closeButton.onClick(this.onDemoClosed, this);
    //     fgui.GRoot.inst.addChild(this._closeButton);
    // }

    // onDemoClosed() {
    //     fgui.GRoot.inst.removeChildren(0, -1, true);
    //     this.node.removeComponent(this._currentDemo);

    //     this.addComponent(MainMenu);
    // }

    start() {}
}
