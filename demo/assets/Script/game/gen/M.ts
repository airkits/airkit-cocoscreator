


import BattleModule from "../module/battle/BattleModule";
import HomeModule from "../module/home/HomeModule";
import LoginModule from "../module/login/LoginModule";
import SystemModule from "../module/system/SystemModule";

export default class M {
    //模块定义
    
    public static BATTLE : string = "BattleModule";
    public static HOME : string = "HomeModule";
    public static LOGIN : string = "LoginModule";
    public static SYSTEM : string = "SystemModule";

    public static register(): void {
        let m: Array<[string, any]> = [
            
            [M.BATTLE , BattleModule],
            [M.HOME , HomeModule],
            [M.LOGIN , LoginModule],
            [M.SYSTEM , SystemModule],
        ]
        for (let i = 0; i < m.length; i++) {
            airkit.Mediator.register(m[i][0], m[i][1]);
        }
    }
  
    public static preloadModule():Promise<boolean> {
        let list = [
            this.SYSTEM
        ]
        let calls = [];
        for (let i = 0; i < list.length; i++) {
           calls.push(airkit.Mediator.call(list[i]));
        }
        return Promise.all(calls).then((result) => {
            console.log(result);
            return true;
        }).catch((error) => {
            return false;
        })
        
    }
    constructor() {

    }
    
    public static battle(): Promise<BattleModule> {
        return airkit.Mediator.call(M.BATTLE)
    }

    public static home(): Promise<HomeModule> {
        return airkit.Mediator.call(M.HOME)
    }

    public static login(): Promise<LoginModule> {
        return airkit.Mediator.call(M.LOGIN)
    }

    public static system(): Promise<SystemModule> {
        return airkit.Mediator.call(M.SYSTEM)
    }

}




