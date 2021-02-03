import { LK } from "../../../config/LK";


export default class AlertView extends airkit.BaseView {


    private _callback: Function = null
    private info: airkit.AlertInfo
    public pkgName: string = "Loader"
    public resName: string = "Alert"

    private content: fgui.GLabel
    private tips: fgui.GLabel
    private cancelBtn: fgui.GButton
    private confirmBtn: fgui.GButton
    private closeBtn: fgui.GButton


    public setup(args: any): void {
        super.setup(args)
        this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height)

        this.info = args[0]
    }
    public onEnter(): void {
        super.onEnter()
        //  fgui.UIPackage.addPackage("res/ui/Loader")

        this.createPanel(this.pkgName, this.resName)
        let panel = this.panel()
        this.content = panel.getChild("content").asLabel
        this.tips = panel.getChild("tips").asLabel
        this.cancelBtn = panel.getChild("cancelBtn").asButton
        this.confirmBtn = panel.getChild("confirmBtn").asButton
        this.closeBtn = panel.getChild("closeBtn").asButton
        this.closeBtn.onClick(this, this.onPressAnyBtn, [airkit.ePopupButton.Close])
        this.confirmBtn.onClick(this, this.onPressAnyBtn, [airkit.ePopupButton.Ok])
        this.cancelBtn.onClick(this, this.onPressAnyBtn, [airkit.ePopupButton.Cancel])
        airkit.DisplayUtils.popup(panel)

        this.setInfo(this.info)
    }

    public setInfo(info: airkit.AlertInfo): void {
        this.info = info
        this._callback = this.info.callback
        this.content.text = info.content
        this.tips.text = info.tips
        this.cancelBtn.visible = false
        this.confirmBtn.visible = false
        if (info.buttons && info.buttons.length > 0) {
            if (info.buttons.length == 1) {
                this.confirmBtn.visible = true
                this.confirmBtn.x = this.panel().width / 2.0
                this.confirmBtn.text = info.buttons[0].label !== undefined ? info.buttons[0].label : airkit.L(LK.btn_ok)

            } else if (info.buttons.length == 2) {
                this.cancelBtn.visible = true
                this.confirmBtn.visible = true
                if (info.buttons[0].type == airkit.ePopupButton.Cancel) {
                    this.cancelBtn.x = 140
                    this.confirmBtn.x = 340

                    this.cancelBtn.text = info.buttons[0].label !== undefined ? info.buttons[0].label : airkit.L(LK.btn_cancel)
                    this.confirmBtn.text = info.buttons[1].label !== undefined ? info.buttons[1].label : airkit.L(LK.btn_ok)
                } else {
                    this.cancelBtn.x = 340
                    this.confirmBtn.x = 140
                    this.cancelBtn.text = info.buttons[1].label !== undefined ? info.buttons[1].label : airkit.L(LK.btn_cancel)
                    this.confirmBtn.text = info.buttons[0].label !== undefined ? info.buttons[0].label : airkit.L(LK.btn_ok)
                }
            }
        }

        // this.btnCancel.visible = false
        // this.btnConfirm.visible = false
        // this.btnCancel.labelFont = ResourceManager.Font_Helvetica
        // this.btnConfirm.labelFont = ResourceManager.Font_Helvetica
        // this.title.text = info.title
        // this.title.fontSize = FONT_SIZE_7
        // if (info.buttons && info.buttons.length > 0) {
        //     if (info.buttons.length == 1) {
        //         this.btnConfirm.visible = true
        //         this.btnConfirm.centerX = 0

        //         this.btnConfirm.label = info.buttons[0].label !== undefined ? info.buttons[0].label : "Confirm"

        //     } else if (info.buttons.length == 2) {
        //         this.btnCancel.visible = true
        //         this.btnConfirm.visible = true
        //         if (info.buttons[0].type == ePopupButton.Cancel) {
        //             this.btnCancel.centerX = -100
        //             this.btnConfirm.centerX = 100

        //             this.btnCancel.label = info.buttons[0].label !== undefined ? info.buttons[0].label : L(LK.btn_cancel)
        //             this.btnConfirm.label = info.buttons[1].label !== undefined ? info.buttons[1].label : L(LK.btn_ok)
        //         } else {
        //             this.btnCancel.centerX = 100
        //             this.btnConfirm.centerX = -100
        //             this.btnCancel.label = info.buttons[1].label !== undefined ? info.buttons[1].label : L(LK.btn_cancel)
        //             this.btnConfirm.label = info.buttons[0].label !== undefined ? info.buttons[0].label : L(LK.btn_ok)
        //         }
        //     }
        // }
    }
    public dispose() {
        this._callback = null
        super.dispose()
    }

    //事件映射表
    protected eventMap(): Array<any> {
        return [
            // [this.btnCancel, Laya.Event.CLICK, this.onPressAnyBtn, ePopupButton.Cancel],
            // [this.btnConfirm, Laya.Event.CLICK, this.onPressAnyBtn, ePopupButton.Ok],
        ]
    }


    /** 获取预设的参数param */
    public getParam(): any {
        return this.info.param
    }

    /** 所有按钮点击事件 */
    private onPressAnyBtn(type: airkit.ePopupButton, evt: Laya.Event): void {
        let btn = fgui.GObject.cast(evt.currentTarget).asButton
        airkit.TweenUtils.scale(btn)
        if (this._callback) {
            this._callback(type, this.info)
        }
        airkit.UIManager.Instance.close(this.UIID, airkit.eCloseAnim.CLOSE_CENTER)

    }

}

