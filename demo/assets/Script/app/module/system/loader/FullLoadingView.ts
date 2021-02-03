
/**
 * 加载界面
 * @author ankye
 * @time 2017-7-25
 */
export default class FullLoadingView extends airkit.BaseView implements airkit.ILoadingView {


    public pkgName: string = "Loader"
    public resName: string = "FullScreenLoading"

    private progressBar: fgui.GProgressBar
    private tips: fgui.GLabel
    private _totalNum: number //总共需要加载数量
    private _curNum: number   //已经加载数量
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
        //  fgui.UIPackage.addPackage("res/ui/Loader")

        this.createPanel(this.pkgName, this.resName)

        // let loader = this.getGObject("bg").asLoader
        // loader.url = "res/bg/background.jpg"
        this.progressBar = this.getGObject("progressBar").asProgress
        this.progressBar.value = this._curNum
        this.progressBar.max = this._totalNum
        this.tips = this.getGObject("tips").asLabel
        this.tips.text = ""

    }

    // public res(): Array<[string, string]> {
    //     let list = [
    //         ["res/ui/Loader_atlas0.png", Laya.Loader.IMAGE],
    //         ["res/ui/Loader.bin", Laya.Loader.BUFFER]
    //     ]

    //     return list
    // }

    public setTips(s: string): void {
        this.tips.text = s
    }
    public onOpen(total: number): void {
        this.debug()
        this._view.visible = true
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
        this.progressBar.value = this._curNum
        this.progressBar.max = this._totalNum

        //this.tips.text = Math.floor(this._curNum / this._totalNum * 100) + "%"
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
