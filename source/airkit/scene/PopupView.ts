// import { IUIPanel } from "./IUIPanel";
// import { EventCenter } from "../event/EventCenter";
// import { EventID, LoaderEventID } from "../event/EventID";

// import { ResourceManager } from "../loader/ResourceManager";
// import { Log } from "../log/Log";
// import { ISignal } from "../event/ISignal";
// import { TimerManager } from "../timer/TimerManager";
// import { LOADVIEW_TYPE_NONE, eCloseAnim } from "../common/Constant";
// import { UIManager } from "./UIManager";
// import BaseView from "./BaseView";
// import { DisplayUtils } from "../utils/DisplayUtils";
// import { TweenUtils } from "../utils/TweenUtils";
namespace airkit {
    /**
     * 非可拖动界面基类
     * @author ankye
     * @time 2018-7-19
     */

    export class PopupView extends BaseView implements IUIPanel {
        public callback: Function

        public closeBtn: fgui.GButton
        public bgTouch: boolean

        constructor() {
            super()
            this.bgTouch = true
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～重写方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**每帧循环*/
        public update(dt: number): boolean {
            return super.update(dt)
        }
        public setup(args: any): void {
            super.setup(args)
            this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height)
        }

        public onEnter(): void {
            super.onEnter()

            this.createPanel(this.pkgName, this.resName)

            let panel = this.panel()
            if (panel) {
                DisplayUtils.popup(panel, Laya.Handler.create(this, this.onOpen))
                //  this.panel().displayObject.cacheAs = "bitmap";
                this.closeBtn = this.closeButton()
                if (this.closeBtn) {
                    this.closeBtn.visible = false
                }
            }

            TimerManager.Instance.addOnce(250, this, this.setupTouchClose)
        }
        public onOpen(): void {}
        public closeButton(): fgui.GButton {
            let btn = this.panel().getChild("closeBtn")
            if (btn != null) return btn.asButton
            return null
        }
        public setupTouchClose() {
            let bg = this.bg()
            if (bg && this.bgTouch) {
                bg.touchable = true
                bg.onClick(this, this.onClose)
            }
            if (this.closeBtn) {
                this.closeBtn.visible = true
                this.closeBtn.onClick(this, this.pressClose)
            }
        }

        public pressClose() {
            if (this.closeBtn) TweenUtils.scale(this.closeBtn)
            this.onClose()
        }

        public onClose() {
            this.doClose()
        }

        public dispose(): void {
            super.dispose()
            if (this.callback != null) this.callback()
        }
        public loadResource(group: string, clas: any): Promise<any> {
            return super.loadResource(group, clas)
        }
    }
}
