const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
    }

    onDemoStart(demo) {}

    start() {
        console.log("hello");
    }
}
