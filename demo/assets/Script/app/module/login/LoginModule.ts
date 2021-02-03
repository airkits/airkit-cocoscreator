
import { API } from "../../manager/API";

import User from "../../model/User";
import { SceneID } from "../../config/UIID";
import { UserManager } from "../../manager/UserManager";
import { GetPlatform } from "../../../platform/Platform";


export default class LoginModule extends airkit.BaseModule {

    constructor() {
        super()
    }

    public setup(args: number): void {
        super.setup(args)
    }

    public start(): void {
        super.start()
        airkit.Log.info("Module login start")
    }

    public enterScene(): void {

        // SceneManager.Instance.gotoScene(eSceneType.Login, SceneID.LOGIN_SCENE_ID)
        //Laya.Scene.open("login/Login.scene")
        airkit.SceneManager.Instance.gotoScene(SceneID.LOGIN_SCENE)
    }


    public update(dt: number): void {
        super.update(dt)
    }


    public res(): Array<[string, string]> {
        let assets = [

        ]
        return assets
    }

    public loaderTips(): string {
        return "美术资源加载中"
    }

    /**是否显示加载界面*/
    // public loaderType(): number {
    //     return eLoaderType.FULLSCREEN
    // }

    protected signalMap() {
        return null
    }


    public dispose(): void {
        super.dispose()
    }

    public static onReqLogin(platformID: string): boolean {

        let userinfo = {
            AvatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJxibYhSsL4bB0TUy49d7XQxx8xuKeH22bm7fQs9bZqEJszJdxN9h6shDA1uiaPLjJzfZ7b3ZAfPKgg/132",
            NickName: "ankye大华🐻",
            OpenId: "oxBds5d45LJN2l20zob9kPq6Qr-w",
            City: "赞比亚",
            Province: "",
            Country: "",
            Gender: 1,
            Sign: "a744e6469c0ff553b92a4e2f110face0915f31a0",
        }
        // API.TOKEN = RegisterHelper.getToken(platformID)


        return this.onLogin(userinfo)



    }


    public static onLogin(userinfo: any): boolean {

        if (userinfo == null || userinfo.AvatarUrl == null) {
            throw ("auth failed")
        }

        return true

        // API.Instance.initUser(user, userinfo.Sign).then(v => {
        //     M.game().then(m => {
        //         m.enterScene()
        //     }).catch(e => {
        //         Log.error(e)
        //     })
        // }).catch(e => {
        //     Log.error(e)
        // })

        // let info = await API.Instance.initUser(user, userinfo.Sign)
        // if (info == null) {
        //     throw ("init user failed")
        // }
        // Log.info(info)


        // let m = await M.game() as GameModule
        // m.enterScene()




    }
}
