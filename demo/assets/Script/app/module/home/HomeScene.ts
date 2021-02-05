

/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class HomeScene extends airkit.BaseView {

    public pkgName: string = "Loader"
    public resName: string = "Login"

    constructor() {
        super()
    }

    onEnter(): void {
        airkit.Log.info("login scene onEnter")
    //    this.createPanel(this.pkgName, this.resName)
        this.resize()

    }

    public res(): Array<{ url: string; type: typeof cc.Asset }> {
        let list = [
            // [ResourceConfig.APP_BG, Laya.Loader.IMAGE]
            // ["res/bg/gamebg.jpg", Laya.Loader.IMAGE],
            // ["res/ui/Game_atlas0.png", Laya.Loader.IMAGE],
            // ["res/ui/Game.bin", Laya.Loader.BUFFER],
            // ["res/anim/Hero1_atlas0.png", Laya.Loader.IMAGE],
            // ["res/anim/Hero1.bin", Laya.Loader.BUFFER],
            // ["res/anim/Hero2_atlas0.png", Laya.Loader.IMAGE],
            // ["res/anim/Hero2.bin", Laya.Loader.BUFFER],
            // ["res/anim/Hero3_atlas0.png", Laya.Loader.IMAGE],
            // ["res/anim/Hero3.bin", Laya.Loader.BUFFER],
            // ["res/anim/Monster_atlas0.png", Laya.Loader.IMAGE],
            // ["res/anim/Monster.bin", Laya.Loader.BUFFER],
            // ["res/anim/Building1_atlas0.png", Laya.Loader.IMAGE],
            // ["res/anim/Building1.bin", Laya.Loader.BUFFER],
            // ["res/anim/Bullet1_atlas0.png", Laya.Loader.IMAGE],
            // ["res/anim/Bullet1.bin", Laya.Loader.BUFFER]
        ]

        return list
    }
    // public loaderType(): number {
    //     return eLoaderType.FULLSCREEN
    // }
    public loaderTips(): string {
        return "动画资源加载"
    }
    protected eventMap(): Array<any> {
        return [

        ]
    }

    public onDestroy(): void {
        airkit.DisplayUtils.removeAllChild(this)
        super.onDestroy()

    }



    onDisable(): void {
        airkit.Log.info("login scene onDisable")

    }

    public update(dt: number): boolean {


        return super.update(dt)
    }

    public resize(): void {

        this._view.setSize(this.width, this.height)
    }

}
