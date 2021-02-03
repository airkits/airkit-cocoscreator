
export default class ToastView extends airkit.BaseView implements airkit.IPoolsObject {
    public static objectKey: string = "ToastView"
    public pkgName: string = "Loader"
    public resName: string = "Toast"
    public tips: fgui.GLabel

    public init() {
        if (this._view == null) {
            this.createPanel(this.pkgName, this.resName)
            if (this._view == null) {
                return
            }
            this.tips = this.getGObject("tips").asLabel
        }

    }


}

export class CoinView extends airkit.BaseView implements airkit.IPoolsObject {
    public static objectKey: string = "CoinView"
    public pkgName: string = "Game"
    public resName: string = "Coin"
    public tips: fgui.GLabel

    public init() {
        this.width = 33
        this.height = 33
        if (this._view == null) {
            this.createPanel(this.pkgName, this.resName)
        }

    }
    public play(callback: Function = null) {
        if (this._view == null) {
            return
        }
        this._view.getTransition("born").play(Laya.Handler.create(null, () => {
            if (callback != null) {
                callback()
            }
        }), 1)
    }

}

