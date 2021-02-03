


/**
 * ui 界面id
 * @author ankye
 * @time 2017-7-19
 * 命名规则：
 * 1.大的模块之间预留100的id空间
 */
export class UIID {
    //system
    public static readonly ALERT_VIEW: number = 1	        // 弹出对话框
    public static readonly LEVEL_UP_VIEW: number = 2        //升级弹出框
    //loading
    public static readonly LOAD_VIEW: number = 100	        // 普通加载界面
    public static readonly FULL_LOAD_VIEW: number = 101	    // 全屏加载界面

    //game
    public static readonly EQUIP_UPGRADE_VIEW: number = 1001
    public static readonly GUEST_VIEW: number = 1002
    public static readonly CHEF_VIEW: number = 1003
    public static readonly EMPLOYE_VIEW: number = 1004

    public static readonly SPREAD_VIEW: number = 1005
    public static readonly SWEET_VIEW: number = 1006
    public static readonly EMPLOY_INFO_VIEW: number = 1007
    public static readonly EQUIP_INFO_VIEW: number = 1008
}

export class SceneID {
    public static readonly LOGIN_SCENE: number = 1
    public static readonly GAME_SCENE: number = 2
    public static readonly SKIP_SCENE: number = 3
    public static readonly TOWER_SCENE: number = 4
    public static readonly STORE_SCENE: number = 5
    public static readonly BATTLE_SCENE: number = 6
    public static readonly HOME_SCENE: number = 7
}

export class MusicID {
    public static readonly GAME_BGM: number = 0
}
export class AEID {
    public static readonly CLICK: number = 0
    public static readonly FIRE1: number = 1
    public static readonly FIRE2: number = 2
    public static readonly FIRE3: number = 3
    public static readonly REWARD: number = 4
}