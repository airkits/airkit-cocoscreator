import { Model } from "./Model"

export enum eUserAttr {
    EXP = 1,
    COIN,
    MONEY
}



export class Player extends Model {
    public id: number //游戏内用户ID
    public updateSignal: airkit.Signal<[eUserAttr, any]>
    private _exp:number;
    private _coin: number;
    private _money:number;

    constructor() {
        super()
        this.updateSignal = new airkit.Signal<[eUserAttr, any]>();
        this._exp = 0;
        this._coin = this._money = 1000;
    }
   
    public get coin():number {
        return this._coin;
    }
    public set coin(v:number) {
        this._coin = v;
        this.updateSignal.dispatch([eUserAttr.COIN, this._coin]);
    }
  
    public get money():number {
        return this._money;
    }
    public set money(v:number) {
        this._money = v;
        this.updateSignal.dispatch([eUserAttr.MONEY, this._money]);
    }

    public get exp():number {
        return this._exp;
    }
    public set exp(v:number) {
        this._exp = v;
        this.updateSignal.dispatch([eUserAttr.EXP, this._exp]);
    }
}

export var me = new Player();
