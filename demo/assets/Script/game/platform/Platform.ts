

import { ePlatform } from "./PlatfromType";
import { PlatformWechat } from "./PlatformWechat";
import { PlatformWeb } from "./PlatformWeb";
import { IPlatform } from "./IPlatform";

export class Platform {
    public static p: IPlatform;
    private static instance: Platform = null;
    public static type: ePlatform;
    public static get Instance(): Platform {
        if (!this.instance) this.instance = new Platform();
        return this.instance;
    }

    public static init(t: ePlatform, appID: string, channel: string = "") {
        this.type = t;
        switch (t) {
            case ePlatform.WX: {
                this.p = new PlatformWechat();
                break;
            }

            default: {
                this.p = new PlatformWeb();
                break;
            }
        }

        if (this.p) {
            this.p.init(t, appID, channel);
        } else {
            console.error("no platform init");
        }
    }
    public static get P(): IPlatform {
        return this.p;
    }
    public static isWeixin(): boolean {
        return this.type == ePlatform.WX;
    }
}

export function GetPlatform(): IPlatform {
    return Platform.P;
}
export function init(t: ePlatform, channel: string = "") {
    Platform.init(t, channel);
}

export function isWX(): boolean {
    return cc.sys.platform === cc.sys.WECHAT_GAME ? true : false;
}
export function tj(a: string): void {
    GetPlatform().tj(a);
}
