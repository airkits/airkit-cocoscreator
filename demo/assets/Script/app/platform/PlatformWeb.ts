import { ePlatfromADStatus, ePlatform } from "./PlatfromType";
import { PlatformUser } from "./PlatformUser";

export class PlatformWeb {
    public static AuthServer = "https://127.0.0.1/auth";
    public type: ePlatform;

    isCloseTimeBoxAd: boolean = true;

    private _subscribeSystemMessageListener: { onTouchEnd: Function; hitObj: cc.Node; callBack: Function } = {
        onTouchEnd: null,
        hitObj: null,
        callBack: null,
    };

    public setApiServer(url: string): void {
        PlatformWeb.AuthServer = url;
    }
    public init(t: ePlatform, appID: string, channel: string = ""): void {
        this.type = t;
    }
    public exitGame(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    public safeTop(): number {
        return 60;
    }
    public safeBottom(): number {
        return 60;
    }
    public menuButtonTop(): number {
        return 60;
    }

    public checkVersion(): number {
        return 0;
    }
    public showLoading(): void {}
    public hideLoading(): void {}

    public vibrateShort(): void {}

    public vibrateLong(): void {}

    public setKeepScreenOn(flag: boolean): void {}
    createAuthButton(pos: cc.Vec2, size: cc.Size, onSuccess: Function, onFailed: Function): any {}

    public getUserInfo(): Promise<PlatformUser> {
        return new Promise((resolve, reject) => {
            resolve(new PlatformUser());
        });
    }

    /**
     * 用户登录
     *
     * @returns {Promise<any>}
     * @memberof IPlatform
     */
    loginWithUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => {});
    }

    /**
     * 用户登录
     *
     * @returns {Promise<any>}
     * @memberof IPlatform
     */
    login(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    open(appid: string, path: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    openCustomerServiceCardMsg(showMessageCard: boolean, sendMessageTitle: string, sendMessageImg: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    addListenserToSubscribeSystemMessage(hitObj: cc.Node, callBack: (isOK: boolean) => void): void {
        // if (this._subscribeSystemMessageListener.hitObj) {
        //     this._subscribeSystemMessageListener.hitObj.off(Event.CLICK, this, this.onSubscribeSystemMessageTouchEnd);
        // }
        // //模拟实现
        // this._subscribeSystemMessageListener.hitObj = hitObj;
        // this._subscribeSystemMessageListener.callBack = callBack;
        // this._subscribeSystemMessageListener.hitObj.on(Laya.Event.CLICK, this, this.onSubscribeSystemMessageTouchEnd);
    }

    offListenserToSubscribeSystemMessage() {
        // if (this._subscribeSystemMessageListener.hitObj) {
        //     this._subscribeSystemMessageListener.hitObj.off(Laya.Event.CLICK, this, this.onSubscribeSystemMessageTouchEnd);
        // }
        // this._subscribeSystemMessageListener.hitObj = null;
        // this._subscribeSystemMessageListener.callBack = null;
    }

    private onSubscribeSystemMessageTouchEnd() {
        if (this._subscribeSystemMessageListener.callBack) {
            this._subscribeSystemMessageListener.callBack(true);
        }
    }

    public showVideoAd(eventName?: string, data?: any, onProgress?: (t: ePlatfromADStatus, res: any) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            if (onProgress) onProgress(ePlatfromADStatus.VIDEO_FINISH, "");
            resolve(ePlatfromADStatus.VIDEO_FINISH);
        });
    }
    /**
     * 设置回到前台
     *
     * @returns {Promise<any>}
     * @memberof IPlatform
     */
    setOnForeground(): Promise<any> {
        return new Promise((resolve, reject) => {});
    }

    /**
     * 显示认证弹窗
     *
     * @returns {Promise<any>}
     * @memberof IPlatform
     */
    showAuthModal(): Promise<any> {
        return new Promise((resolve, reject) => {});
    }

    //分享接口
    public share(position: string, title: string, image: string, query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    getVersion(): string {
        return "";
    }

    setDefaultShare(title: string, img: string): void {
        return;
    }
    //统计
    tj(a: string): void {}

    //获取平台渠道号
    getPlatfromChannel(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("web");
        });
    }

    //获取平台版本号
    getNativeAppVersion(): Promise<number> {
        return new Promise((resolve, reject) => {
            return 1.0;
        });
    }

    //注册onShow
    registerOnShowHandler(hander: (res: any) => void): void {}
    //注册onHide
    registerOnHideHandler(hander: (res: any) => void): void {}
    //注册回退事件
    registerBackHandler(hander: (res: any) => void): void {}
    //注册同步事件
    registerSyncHandler(hander: (res: any) => void): void {}

    callNativeAppInit(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return true;
        });
    }

    //是否小屏幕手机
    isSmallScreen(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return false;
        });
    }

    openUrlInApp(url: string, isFullscreen?: number, backStyle?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            return null;
        }).catch((e) => {
            return null;
        });
    }
    //调用宿主进行copy
    copyTextByApp(str: string): boolean {
        return true;
    }
}
