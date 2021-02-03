

/**
 * 加载界面
 * @author ankye
 * @time 2017-7-25
 */
export default class WindowView extends airkit.BaseView implements airkit.ILoadingView {

    public pkgName: string = "Loader"
    public resName: string = "WindowLoading"

    private lblTips: fgui.GLabel;
    private lblProgress: fgui.GLabel;
    private _totalNum: number //总共需要加载数量
    private _curNum: number   //已经加载数量

    /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～重写方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
    public setup(args: any): void {
        super.setup(args)
        this.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height)
    }
    /**销毁*/
    public onDestroy(): void {

        super.onDestroy()
    }

    /**每帧循环*/
    public update(dt: number): boolean {
        return super.update(dt)
    }

    public onEnter(): void {
        super.onEnter()
        this.createPanel(this.pkgName, this.resName)
        this.lblTips = this.getGObject("lblTips").asLabel
        this.lblProgress = this.getGObject("lblProgress").asLabel
        this.lblProgress.text = ""
        this.lblTips.text = ""

    }
    public setTips(s: string): void {
        this.lblTips.text = s
    }
    public onOpen(total: number): void {

        this._totalNum = total
        this._curNum = 0
        this.updateLabel()
        Laya.timer.clear(this, this.onAnimate)
        Laya.timer.loop(100, this, this.onAnimate)
    }
    /**
     * 加载进度
     * @param 	cur		当前加载数量
     * @param	total	总共需要加载的数量
    */
    public setProgress(cur: number, total: number): void {
        this._curNum = cur
        this._totalNum = total
        this.updateLabel()
    }
    public updateLabel(): void {
        this.lblProgress.text = Math.floor(this._curNum / this._totalNum * 100) + "%"
    }
    /**
     * 加载完成
    */
    public onClose(): void {
        Laya.timer.clear(this, this.onAnimate)
    }
    /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
    private onAnimate(e) {
        this.updateLabel()
    }
}
