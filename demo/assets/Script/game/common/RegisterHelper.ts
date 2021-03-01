import M from "../gen/M";
import HomeBinder from "../gen/ui/Home/HomeBinder";
import LoaderBinder from "../gen/ui/Loader/LoaderBinder";
import BattleScene from "../module/battle/BattleScene";
import HomeScene from "../module/home/HomeScene";
import { AlertDlg } from "../module/login/AlertDlg";
import LoginScene from "../module/login/LoginScene";
import { FullScreenLoaderDlg } from "../module/system/FullScreenLoaderDlg";
import { NetLoader2Dlg } from "../module/system/NetLoader2Dlg";
import { NetLoaderDlg } from "../module/system/NetLoaderDlg";
import { WindowLoaderDlg } from "../module/system/WindowLoaderDlg";
import { eDialogUIID } from "./DialogType";
import { eSceneType } from "./SceneType";

/*
 * @Author: ankye
 * @Date: 2018-10-15 20:33:48
 * @Last Modified by: 
 * @Last Modified time: 2019-12-11 19:49:07
 *
 * 类注册helper
 *
 * @class RegisterHelper
 */
export default class RegisterHelper {
    public static init() {
        this.registerFgui();
        M.register();
        this.registerLoadingView();
        this.registerUI();
        this.registerScene();
        this.registerAudio();
    }
    
    public static registerFgui():void {
        LoaderBinder.bindAll();
        HomeBinder.bindAll();
    }
  // 注册加载界面类
    // 加载器本身资源先加载下来，避免加载自身的时候抢资源
    public static registerLoadingView(): void {
        let m: Array<[number, string, any]> = [
            [ak.eLoaderType.FULL_SCREEN,"FullScreenLoaderDlg",FullScreenLoaderDlg],
            [ak.eLoaderType.NET_LOADING,"NetLoaderDlg",NetLoaderDlg],
            [ak.eLoaderType.WINDOW,"WindowLoaderDlg",WindowLoaderDlg],
            [ak.eLoaderType.CUSTOM_1,"NetLoader2Dlg",NetLoader2Dlg]
        ];

        for (let i = 0; i < m.length; i++) {
            airkit.LoaderManager.register(m[i][0], m[i][1], m[i][2])
        }
    }

    // 通用UI弹窗注册
    public static registerUI(): void {
        let m: Array<[string, any]> = [
            [eDialogUIID.ALERT,AlertDlg],
        ];
        for (let i = 0; i < m.length; i++) {
            airkit.UIManager.register(m[i][0], m[i][1])
        }
    }


    // 注册场景类
    public static registerScene(): void {
        let m: Array<[string, any]> = [
            [eSceneType.LOGIN,LoginScene],
            [eSceneType.BATTLE, BattleScene],
            [eSceneType.HOME, HomeScene],
        ]
        for (let i = 0; i < m.length; i++) {
            ak.SceneManager.register(m[i][0], m[i][1])
        }
    }
  

 
    public static registerAudio(): void {
        // let musics: Array<{ id: number; url: string; desc: string }> = [{ id: MusicID.GAME_BGM, url: "res/audio/bgm.mp3", desc: "游戏背景" }]
        // for (let v of musics) {
        //     airkit.AudioManager.Instance.registerMusic(v)
        // }

        // let effects: Array<{ id: number; url: string; desc: string }> = [
        //     { id: AEID.CLICK, url: "res/audio/click.mp3", desc: "点击音效" },
        //     { id: AEID.FIRE1, url: "res/audio/fire_1.mp3", desc: "开火音效" },
        //     { id: AEID.FIRE2, url: "res/audio/fire_2.mp3", desc: "开火音效" },
        //     { id: AEID.FIRE3, url: "res/audio/fire_3.mp3", desc: "开火音效" },
        //     { id: AEID.REWARD, url: "res/audio/reward_card.mp3", desc: "奖励卡片" }
        // ]
        // for (let v of effects) {
        //     airkit.AudioManager.Instance.registerEffect(v)
        // }
    }
}
