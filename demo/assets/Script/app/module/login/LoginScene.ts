
import { GetPlatform } from "../../../platform/Platform";
import { API } from "../../manager/API";
import M from "../M";
import { helper } from "../../helper/Helper";
import { eLoaderType } from "../system/loader/LoaderType";



/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class LoginScene extends airkit.BaseView {

    public pkgName: string = "Loader"
    public resName: string = "Login"

    constructor() {
        super()
    }

    onEnter(): void {
        airkit.Log.info("login scene onEnter")
        this.createPanel(this.pkgName, this.resName)
        this.createLoginBtn()
        this.resize()

    }




    public createLoginBtn() {
        let that = this
        GetPlatform().createAuthButton(user => {
            airkit.Log.info(user)

            M.battle().then(m => {
                m.enterScene()
            }).catch(e => {
                airkit.Log.error(e)
            })
            // API.Instance.initUser(user).then(v => {

            //     M.tower().then(m => {
            //         m.enterScene()
            //     }).catch(e => {
            //         airkit.Log.error(e)
            //     })


            // }).catch(e => {
            //     helper.toast(e)
            //     that.createLoginBtn()
            // })
        }, v => {
            airkit.Log.info(v)
            helper.toast(v["data"]["msg"])
            that.createLoginBtn()

        })
    }



    public res(): Array<[string, string]> {
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
    public loaderType(): number {
        return eLoaderType.FULLSCREEN
    }
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
