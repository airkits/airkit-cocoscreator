module app.platform {
    /**
     * 平台数据接口。
     * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
     * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
     * 由于不同平台的接口形式各有不同，推荐开发者将所有接口封装为基于 Promise 的异步形式
     */

    export interface IPlatform {
        /**时段礼包是否关闭视频阶段 */
        isCloseTimeBoxAd?: boolean;

        init(t: ePlatform): void;

        showLoading(): void;
        hideLoading(): void;
        checkVersion(): number;
        createAuthButton(pos: cc.Vec2, size: cc.Size, onSuccess: Function, onFailed: Function): any;
        share(position: string, title: string, image: string, query: string): Promise<any>;
        showVideoAd(eventName?: string, data?: any, onProgress?: (t: ePlatfromADStatus, res: any) => void): Promise<any>;
        loginWithUserInfo(): Promise<PlatformUser>;
        login(): Promise<PlatformUser>;

        // 短震
        vibrateShort(): void;
        // 长震
        vibrateLong(): void;
        // 屏幕常亮
        setKeepScreenOn(flag: boolean): void;
        setDefaultShare(title: string, img: string): void;
        setApiServer(url: string): void;
        /**跳转小程序 */
        open(appid: string, path: string, data: any): Promise<any>;
        /**小程序订阅监听,一次只能一个 */
        addListenserToSubscribeSystemMessage(hitObj: cc.Node, callBack: (isOK: boolean) => void): void;
        /**取消当前订阅监听 */
        offListenserToSubscribeSystemMessage(): void;
        /**客服发对话卡片 */
        openCustomerServiceCardMsg(showMessageCard: boolean, sendMessageTitle: string, sendMessageImg: string): Promise<any>;

        exitGame(): Promise<any>;
        //安全顶部偏移
        safeTop(): number;
        //安全底部偏移
        safeBottom(): number;
        //胶囊偏移
        menuButtonTop(): number;
        //统计
        tj(a: string): void;
        //获取平台渠道号
        getPlatfromChannel(): Promise<string>;
        //获取平台版本号
        getNativeAppVersion(): Promise<number>;

        //注册onShow
        registerOnShowHandler(hander: (res: any) => void): void;
        //注册onHide
        registerOnHideHandler(hander: (res: any) => void): void;
        //注册回退事件
        registerBackHandler(hander: (res: any) => void): void;
        //注册同步事件
        registerSyncHandler(hander: (res: any) => void): void;
        //初始化native相关接口
        callNativeAppInit(): Promise<boolean>;
        //打开url
        // isFullscreen  0：不全屏   2：全屏
        // backStyle    0表示没有返回键，1表示左上角显示，2表示右上角显示
        openUrlInApp(url: string, isFullscreen?: number, backStyle?: number): Promise<any>;
        //调用宿主进行copy
        copyTextByApp(str: string): boolean;
        //是否小屏幕手机
        isSmallScreen(): Promise<boolean>;

        //for wx
        //创建游戏图标
        createGameIcon?(adUnitId: string, x: number, y: number, iconSize: number): Promise<boolean>;
        showGameIcon?(v: boolean): void;
        //显示插屏广告
        interstitialAd?(adUnitID: string): Promise<boolean>;
        //end for wx
    }

    export class Platform {
        public static p: IPlatform;
        private static instance: Platform = null;
        public static type: ePlatform;
        public static get Instance(): Platform {
            if (!this.instance) this.instance = new Platform();
            return this.instance;
        }

        public static init(t: ePlatform, channel: string = "") {
            this.type = t;
            switch (t) {
                case ePlatform.WEIXINX: {
                    this.p = new PlatformWechat();
                    break;
                }

                default: {
                    this.p = new PlatformWeb();
                    break;
                }
            }

            if (this.p) {
                this.p.init(t);
            } else {
                console.error("no platform init");
            }
        }
        public static get P(): IPlatform {
            return this.p;
        }
        public static isWeixin(): boolean {
            return this.type == ePlatform.WEIXINX;
        }
    }

    export function GetPlatform(): IPlatform {
        return Platform.P;
    }
    export function init(t: ePlatform, channel: string = "") {
        Platform.init(t, channel);
    }

    export function isWX(): boolean {
        return Platform.isWeixin();
    }
    export function tj(a: string): void {
        platform.GetPlatform().tj(a);
    }
}
