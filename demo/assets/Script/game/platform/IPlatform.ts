/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，推荐开发者将所有接口封装为基于 Promise 的异步形式
 */

import { ePlatform, ePlatfromADStatus } from "./PlatfromType";
import { PlatformUser } from "./PlatformUser";

export abstract class IPlatform {
    /**时段礼包是否关闭视频阶段 */
    isCloseTimeBoxAd?: boolean;

    abstract init(t: ePlatform, appID: string, channel?: string): void;

    abstract showLoading(): void;
    abstract hideLoading(): void;
    abstract checkVersion(): number;
    abstract createAuthButton(pos: cc.Vec2, size: cc.Size, onSuccess: Function, onFailed: Function): any;
    abstract share(position: string, title: string, image: string, query: string): Promise<any>;
    abstract showVideoAd(eventName?: string, data?: any, onProgress?: (t: ePlatfromADStatus, res: any) => void): Promise<any>;
    abstract loginWithUserInfo(): Promise<PlatformUser>;
    abstract login(info?: any): Promise<PlatformUser>;

    // 短震
    abstract vibrateShort(): void;
    // 长震
    abstract vibrateLong(): void;
    // 屏幕常亮
    abstract setKeepScreenOn(flag: boolean): void;
    abstract setDefaultShare(title: string, img: string): void;
    abstract setApiServer(url: string): void;
    /**跳转小程序 */
    abstract open(appid: string, path: string, data: any): Promise<any>;
    /**小程序订阅监听,一次只能一个 */
    abstract addListenserToSubscribeSystemMessage(hitObj: cc.Node, callBack: (isOK: boolean) => void): void;
    /**取消当前订阅监听 */
    abstract offListenserToSubscribeSystemMessage(): void;
    /**客服发对话卡片 */
    abstract openCustomerServiceCardMsg(showMessageCard: boolean, sendMessageTitle: string, sendMessageImg: string): Promise<any>;

    abstract exitGame(): Promise<any>;
    //安全顶部偏移
    abstract safeTop(): number;
    //安全底部偏移
    abstract safeBottom(): number;
    //胶囊偏移
    abstract menuButtonTop(): number;
    //统计
    abstract tj(a: string): void;
    //获取平台渠道号
    abstract getPlatfromChannel(): Promise<string>;
    //获取平台版本号
    abstract getNativeAppVersion(): Promise<number>;

    //注册onShow
    abstract registerOnShowHandler(hander: (res: any) => void): void;
    //注册onHide
    abstract registerOnHideHandler(hander: (res: any) => void): void;
    //注册回退事件
    abstract registerBackHandler(hander: (res: any) => void): void;
    //注册同步事件
    abstract registerSyncHandler(hander: (res: any) => void): void;
    //初始化native相关接口
    abstract callNativeAppInit(): Promise<boolean>;
    //打开url
    // isFullscreen  0：不全屏   2：全屏
    // backStyle    0表示没有返回键，1表示左上角显示，2表示右上角显示
    abstract openUrlInApp(url: string, isFullscreen?: number, backStyle?: number): Promise<any>;
    //调用宿主进行copy
    abstract copyTextByApp(str: string): boolean;
    //是否小屏幕手机
    abstract isSmallScreen(): Promise<boolean>;

    //for wx
    //创建游戏图标
    abstract createGameIcon?(adUnitId: string, x: number, y: number, iconSize: number): Promise<boolean>;
    abstract showGameIcon?(v: boolean): void;
    //显示插屏广告
    abstract interstitialAd?(adUnitID: string): Promise<boolean>;
    //end for wx
}

