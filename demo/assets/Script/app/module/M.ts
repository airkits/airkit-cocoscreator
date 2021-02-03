
import SystemModule from "./system/SystemModule";
import LoginModule from "./login/LoginModule";
import BattleModule from "./battle/BattleModule";
import HomeModule from './home/HomeModule';

export default class M {
    //模块定义
    public static SYSTEM: string = "system"
    public static LOGIN: string = "login"
    public static HOME: string = "home"
    public static BATTLE: string = "battle"

    public static register(): void {
        let m: Array<[string, any]> = [
            [M.SYSTEM, SystemModule],
            [M.LOGIN, LoginModule],
            [M.HOME, HomeModule],
            [M.BATTLE, BattleModule]
        ]
        for (let i = 0; i < m.length; i++) {
            airkit.Mediator.register(m[i][0], m[i][1])
        }
    }

    public static preloadModule() {
        let list = [
            M.SYSTEM,
        ]
        
        for (let i = 0; i < list.length; i++) {
            airkit.Mediator.call(list[i])
        }
    }

    public static system(): Promise<SystemModule> {
        return airkit.Mediator.call(M.SYSTEM)
    }

    public static login(): Promise<LoginModule> {
        return airkit.Mediator.call(M.LOGIN)
    }

    public static battle(): Promise<BattleModule> {
        return airkit.Mediator.call(M.BATTLE)
    }

    public static home(): Promise<HomeModule> {
        return airkit.Mediator.call(M.HOME)
    }

}




