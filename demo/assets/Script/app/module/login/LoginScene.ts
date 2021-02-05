import UILoginScene from '../../gen/ui/Loader/UILoginScene';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class LoginScene extends UILoginScene {

    constructor() {
        super()
    }

    onEnter(): void {
        airkit.Log.info("login scene onEnter")
    }

    public res(): Array<{ url: string; type: typeof cc.Asset }> {
        let res = [];
        let resMap = LoginScene.ResMap;
        for (let k in resMap) {
            res.push({ url: "ui/" + k, type: airkit.FguiAsset });
            for (let k2 in resMap[k]) {
                res.push({ url: "ui/" + k2, type: cc.BufferAsset });
            }
        }
        return res
    }
    //public loaderType(): number {
        
       // return eLoaderType.FULLSCREEN
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
