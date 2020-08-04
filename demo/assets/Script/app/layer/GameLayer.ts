const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLayer extends cc.Component {
    private _view: fgui.GComponent;

    onLoad() {
        fgui.UIPackage.loadPackage("ui/Loader", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        fgui.UIPackage.addPackage("ui/Loader");

        this._view = fgui.UIPackage.createObject("Loader", "Login").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);
    }

    onDestroy() {
        this._view.dispose();
    }
}
