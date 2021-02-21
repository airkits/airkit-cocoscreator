import { ePlatfromADStatus, ePlatform } from "./PlatfromType";
import { PlatformUser } from "./PlatformUser";
import { IPlatform } from './IPlatform';

var AuthAPI = "http://127.0.0.1:8000/v1/wxlogin";

export class PlatformWechat extends IPlatform {
    private static doNull() { }

    private isIphoneX: boolean;
    private isIOS: boolean;
    private sdkVersion: string;
    private video_ads = {};
    private _appID: string;
    private _channel: string;
    //插屏广告
    private interstitialAds = {};
    private iconAd: any = null;
    private _isShowGameIcon: boolean = true;
    // private myEventer: Laya.EventDispatcher;
    private readonly EVENT_ON_WX_SHOW = "EVENT_ON_WX_SHOW";

    /**订阅模板id */
    private _subscribeMessageTempleteId1 = "oDkFiHcKJ9aOBRcuGxrqKPn77DDpzQOXu8did7y7g4Y";
    private _subscribeMessageTempleteId2 = "uhEd48wUFYxzey9XahM4cIrRTvYSI2DfLqS2B7FfhXs";
    private _subscribeMessageTempleteId3 = "kNwVvBhPIcJi2LIbOs9w242yEsn_V8la-hf5cDRO_8s";
    private _subscribeSystemMessageListener: { onTouchEnd: Function; hitObj: cc.Node; callBack: Function } = {
        onTouchEnd: null,
        hitObj: null,
        callBack: null,
    };
    //  private _subscriptionGuideDlg: app.home.SubscriptionGuideDlg;
    private _subscriptionTimeId = 0;

    isCloseTimeBoxAd: boolean = true;

    public get isWXEnv(): boolean {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) return true;
        return false;
    }

    public setApiServer(url: string): void {
        AuthAPI = url;
    }
    public init(t: ePlatform, appID: string, channel: string = ""): void {
        //小游戏处理暂停
        if (!this.isWXEnv) {
            return;
        }
        this._appID = appID;
        this._channel = channel;

        var self = this;

        // this.myEventer = new Laya.EventDispatcher();
        wx.onShow(function (e: any) {
            // PlatformWechat.showTime = DateUtils.getNowMS()
            //   console.info("wx onShow %s", PlatformWechat.showTime)
            // EventCenter.dispatchEvent(EventID.ON_SHOW)
            // self.myEventer.event(self.EVENT_ON_WX_SHOW);
            // if (me.id && me.id > 0 && me.id != app.model.NEW_GUEST_ID) {
            //     sound && sound.activate();
            // }
            // if (e && e.query && e.query[net.WX_QUERY_LAUNCH_FRIEND_ID]) {
            //     try {
            //         app.model.wxShareFriendId = e.query[net.WX_QUERY_LAUNCH_FRIEND_ID];
            //         manager.event(Manager.WX_ON_SHOW_ADD_FRIEND);
            //         console.log("wx onShow has wxShareFriendId:" + app.model.wxShareFriendId);
            //     } catch (ee) {}
            // }
            // if (e && e.query && e.query["type"] == "recall") {
            //     try {
            //         app.model.wxRecallPassId = e.query["passId"];
            //         app.model.wxRecallDay = e.query["day"];
            //         manager.event(Manager.WX_ON_SHOW_RECALL_CARD);
            //         console.log("wx onShow wxRecallPassId = " + app.model.wxRecallPassId);
            //     } catch (ee) {}
            // }
        });
        wx.onHide(function () {
            // PlatformWechat.hideTime = DateUtils.getNowMS()
            // console.info("wx onHide %s", PlatformWechat.hideTime)
            // EventCenter.dispatchEvent(EventID.ON_HIDE)
        });

        var launchObj = wx.getLaunchOptionsSync();
        // if (launchObj.query) {
        //     if (launchObj.query && launchObj.query[net.WX_QUERY_LAUNCH_FRIEND_ID]) {
        //         try {
        //             app.model.wxShareFriendId = launchObj.query[net.WX_QUERY_LAUNCH_FRIEND_ID];
        //             console.log("wxShareFriendId = " + app.model.wxShareFriendId);
        //         } catch (e) {}
        //     }
        //     if (launchObj.query && launchObj.query[net.WX_INVITE_FROM_XQ_GAME]) {
        //         try {
        //             app.model.wxXqInviteId = launchObj.query[net.WX_INVITE_FROM_XQ_GAME];
        //             console.log("wxXqInviteId = " + app.model.wxXqInviteId);
        //         } catch (e) {}
        //     }
        //     if (launchObj.query && launchObj.query["type"] == "recall") {
        //         try {
        //             app.model.wxRecallPassId = launchObj.query["passId"];
        //             app.model.wxRecallDay = launchObj.query["day"];
        //             console.log("wxRecallPassId = " + app.model.wxRecallPassId);
        //         } catch (e) {}
        //     }
        // }

        this.setKeepScreenOn(true);

        // Laya.MiniAdpter.nativefiles = ["wxlocal"];

        // Laya.MiniAdpter["getUrlEncode"] = PlatformWechat.getUrlAndEncode;

        this._subscribeSystemMessageListener.onTouchEnd = this.onSubscribeSystemMessageTouchEnd.bind(this);
        this._subscribeSystemMessageListener.callBack = PlatformWechat.doNull;

        let systemInfo = wx.getSystemInfoSync();
        let model = systemInfo.model;
        if (model.search("iPhone X") != -1) {
            this.isIphoneX = true;
            this.isIOS = true;
        } else {
            this.isIphoneX = false;
            let system = systemInfo.system;
            if (system && system.search("iOS") != -1) {
                this.isIOS = true;
            } else {
                this.isIOS = false;
            }
        }
        if (systemInfo.SDKVersion) {
            this.sdkVersion = systemInfo.SDKVersion;
        }
    }

    public getMenuButtonBoundingClientRect(): any {
        let systemInfo = wx.getSystemInfoSync();

        let rect = null;
        try {
            rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
            if (rect === null) {
                throw "getMenuButtonBoundingClientRect error";
            }
            //取值为0的情况
            if (!rect.width) {
                throw "getMenuButtonBoundingClientRect error";
            }
        } catch (error) {
            let gap = 0; //胶囊按钮上下间距 使导航内容居中
            let width = 96; //胶囊的宽度，android大部分96，ios为88
            if (systemInfo.platform === "android") {
                gap = 8;
                width = 96;
            } else if (systemInfo.platform === "devtools") {
                if (this.isIOS) {
                    gap = 5.5; //开发工具中ios手机
                } else {
                    gap = 7.5; //开发工具中android和其他手机
                }
            } else {
                gap = 4;
                width = 88;
            }
            if (!systemInfo.statusBarHeight) {
                //开启wifi的情况下修复statusBarHeight值获取不到
                systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
            }
            rect = {
                //获取不到胶囊信息就自定义重置一个
                bottom: systemInfo.statusBarHeight + gap + 32,
                height: 32,
                left: systemInfo.windowWidth - width - 10,
                right: systemInfo.windowWidth - 10,
                top: systemInfo.statusBarHeight + gap,
                width: width,
            };
        }
        return rect;
    }

    public safeBottom(): number {
        let height = cc.winSize.height;
        let systemInfo = wx.getSystemInfoSync();
        if (this.isIphoneX) {
            height = cc.winSize.height * (1 - 44 / systemInfo.windowHeight);
        }
        return height;
    }

    public menuButtonTop(): number {
        let menuInfo = this.getMenuButtonBoundingClientRect(); //距离屏幕的左上角的屏幕坐标信息
        console.info(menuInfo);
        let systemInfo = wx.getSystemInfoSync();

        var height = cc.winSize.height * ((menuInfo.top + menuInfo.height) / systemInfo.windowHeight); //systemInfo.safeArea.top / systemInfo.windowHeight;//
        return height;
    }

    public safeTop(): number {
        let systemInfo = wx.getSystemInfoSync();
        var height = cc.winSize.height * (systemInfo.statusBarHeight / systemInfo.windowHeight); //systemInfo.safeArea.top / systemInfo.windowHeight;//
        return height;
    }
    public exitGame(): Promise<void> {
        return new Promise((resolve, reject) => {
            wx.exitMiniProgram({
                success: () => {
                    resolve();
                },
                fail: () => {
                    reject();
                },
                complete: () => {
                    resolve();
                },
            });
        });
    }
    //该方法示例仅做参考，视项目情况自行修改或拓展
    public static getUrlAndEncode(url: string, type: string): string {
        if (url.indexOf(".fnt") != -1 || url.indexOf(".json") != -1) {
            return "utf8";
        } else if (type == "arraybuffer") {
            return "";
        }
        return "ascii";
    }
    public setKeepScreenOn(flag: boolean): void {
        wx.setKeepScreenOn({
            keepScreenOn: flag,
        });
    }

    public checkVersion(): number {
        if (wx.getUpdateManager) {
            console.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (result: any) {
                if (result.hasUpdate) {
                    console.log("有新版本");
                    updateManager.onUpdateReady(function () {
                        console.log("新的版本已经下载好");
                        wx.showModal({
                            title: "更新提示",
                            content: "新版本已经下载，是否重启？",
                            success: function (result: any) {
                                if (result.confirm) {
                                    // 点击确定，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate();
                                }
                            },
                        });
                    });
                    updateManager.onUpdateFailed(function () {
                        console.log("新的版本下载失败");
                        wx.showModal({
                            title: "已经有新版本了",
                            content: "新版本已经上线啦，请您删除当前小游戏，重新搜索打开",
                        });
                    });
                } else {
                    console.log("没有新版本");
                }
            });
        } else {
            console.log("有更新肯定要用户使用新版本，对不支持的低版本客户端提示");
            wx.showModal({
                title: "温馨提示",
                content: "当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。",
            });
        }
        return 0;
    }

    showVideoAd(eventName?: string, data?: any, onProgress?: (t: ePlatfromADStatus, res: any) => void): Promise<any> {
        return this.showVideoAdWX(eventName);
    }

    public showLoading(): void {
        wx.showLoading({
            title: "Login...",
            mask: true,
        });
    }
    public hideLoading(): void {
        wx.hideLoading();
    }

    public vibrateShort(): void {
        wx.vibrateShort({
            success: () => { },
            fail: () => { },
            complete: () => { },
        });
    }

    public vibrateLong(): void {
        wx.vibrateLong({
            success: () => { },
            fail: () => { },
            complete: () => { },
        });
    }
    public getButtonRect(pos: cc.Vec2, size: cc.Size): any {
        let info = wx.getSystemInfoSync();
        let r = cc.winSize.width / info.screenWidth;

        return {
            type: "text",
            text: "",
            style: {
                left: pos.x / r,
                top: pos.y / r,
                width: size.width / r,
                height: size.height / r,
                lineHeight: 40,
                backgroundColor: "#5fce7b88",
                color: "#ffffff",
                textAlign: "center",
                fontSize: 16,
                borderRadius: 4,
            },
        };
    }

    public createAuthButton(pos: cc.Vec2, size: cc.Size, onSuccess: Function, onFailed: Function): any {
        var button = wx.createUserInfoButton(this.getButtonRect(pos, size));
        button.show();
        var that = this;
        button.onTap((res: any) => {
            that.showLoading();
            console.info(res);
            if (res.errMsg.indexOf("auth deny") > -1 || res.errMsg.indexOf("auth denied") > -1) {
                // 处理用户拒绝授权的情况,关闭游戏
                // wx.showToast({
                //     title: "授权失败",
                //     icon: "none",
                //     image: "",
                // } as _showToastObject);
                this.hideLoading();
                onFailed(res.errMsg);
            } else if (res.errMsg == "getUserInfo:ok") {
                let userInfo = res.userInfo;
                button.destroy();

                that.login(userInfo)
                    .then((v) => {
                        this.hideLoading();
                        onSuccess(v);
                        return true;
                    })
                    .catch((e) => {
                        this.hideLoading();
                        onFailed(e);
                        return false;
                    });
            } else {
                console.error(res);
                that.hideLoading();
                onFailed(res);
            }
        });
        return button;
    }

    login(userInfo?: any): Promise<PlatformUser> {
        return this.loginWX(userInfo);
    }

    loginWX(userinfo?: any): Promise<PlatformUser> {
        return new Promise((resolve, reject) => {
            let that = this;

            let obj = {
                success: (res) => {
                    let user = new PlatformUser();
                    user.avatarUrl = userinfo.avatarUrl;
                    user.nickname = userinfo.nickName;
                    user.gender = userinfo.gender;
                    user.data = {
                        code: res.code,
                    };
                    that.auth(AuthAPI, user)
                        .then((info) => {
                            user.openId = info.openId;
                            resolve(user);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                },
                fail: () => {
                    reject("login wxgame failed");
                },
                complete: () => { },
            };
            wx.login(obj);
        });
    }

    auth(url: string, user: PlatformUser): Promise<any> {
        return new Promise((resolve, reject) => {
            let that = this;
            let data = {
                code: user.data["code"],
                platform: "wechat",
                appid: this._appID,
                channel: this._channel,
                nickname: user.nickname,
                gender: user.gender,
                avatar: user.avatarUrl,
            };

            wx.request({
                url: url,
                method: "POST",
                data: data,
                success: function (res) {
                    let out = res["data"];
                    //resolve(res)
                    if (out["code"] == 200) {
                        user.openId = out["data"]["openid"];
                        user.token = out["data"]["token"];
                        resolve(user);
                    } else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);
                },
            });
        });
    }

    /**
     * 用户登录
     *
     * @returns {Promise<any>}
     * @memberof IPlatform
     */
    loginWithUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => { });
    }
    public getUserInfo(): Promise<PlatformUser> {
        return new Promise((resolve, reject) => {
            let that = this;
            wx.getUserInfo({
                withCredentials: true,
                lang: "zh_CN",
                success: function (res) {
                    var userInfo = res.userInfo;
                    let user = new PlatformUser();
                    user.nickname = userInfo["nickName"];
                    user.avatarUrl = userInfo["avatarUrl"];
                    user.gender = userInfo["gender"]; //性别 0：未知、1：男、2：女
                    user.data = {
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        signature: res.signature,
                        rawData: res.rawData,
                    };
                    resolve(user);
                },
                fail: function (err: any) {
                    reject(err);
                },
            });
        });
    }

    open(appid: string, path: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (wx.navigateToMiniProgram) {
                wx.navigateToMiniProgram({
                    appId: appid,
                    path: path,
                    extraData: data,
                    envVersion: "trial",
                    success(res: any) {
                        resolve(true);
                    },
                    fail(e: any) {
                        reject(e);
                    },
                });
            } else {
                reject();
            }
        });
    }

    openCustomerServiceCardMsg(showMessageCard: boolean, sendMessageTitle: string, sendMessageImg: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (wx.openCustomerServiceConversation) {
                wx.openCustomerServiceConversation({
                    showMessageCard: showMessageCard,

                    sendMessageTitle: sendMessageTitle, // 标题

                    sendMessageImg: sendMessageImg, //图片地址

                    success: (res: any) => {
                        console.log("customerService success back:" + JSON.stringify(res));
                        // if ((res && res.path)||(res&&res.errMsg&&res.errMsg.indexOf('OK'))) {
                        //     //经过测试得出path参数存在时，是合法的
                        //    // resolve();//wxj undo
                        //    reject();
                        // } else {
                        //     reject();
                        // }
                        if (res && res["query"] && res["query"]["type"] == "recall") {
                            // app.model.wxRecallPassId = res["query"]["passId"];
                            // app.model.wxRecallDay = res["query"]["day"];
                            // manager.event(Manager.WX_ON_SHOW_RECALL_CARD);
                        }
                        resolve(res);
                    },

                    fail: (res: any) => {
                        reject();
                    },
                });
            }
        });
    }

    addListenserToSubscribeSystemMessage(hitObj: cc.Node, callBack: (isOK: boolean) => void): void {
        // if (!this._subscribeSystemMessageListener.hitObj) {
        //     wx.onTouchEnd(this._subscribeSystemMessageListener.onTouchEnd);
        // }
        // //模拟实现
        // this._subscribeSystemMessageListener.hitObj = hitObj;
        // this._subscribeSystemMessageListener.callBack = callBack;
    }

    offListenserToSubscribeSystemMessage() {
        // if (this._subscribeSystemMessageListener.hitObj) {
        //     wx.offTouchEnd(this._subscribeSystemMessageListener.onTouchEnd);
        // }
        // this._subscribeSystemMessageListener.hitObj = null;
        // this._subscribeSystemMessageListener.callBack = PlatformWechat.doNull;
    }

    private onSubscribeSystemMessageTouchEnd(res: any) {
        // if (this._subscribeSystemMessageListener.hitObj) {
        //     var touches: any[] = res.changedTouches;
        //     if (touches && touches.length > 0) {
        //         var e: any = touches[0];
        //         var point = new cc.Vec2(e.pageX || e.clientX, e.pageY || e.clientY);
        //         Laya.stage._canvasTransform.invertTransformPoint(point);
        //         if (this._subscribeSystemMessageListener.hitObj.hitTestPoint(point.x, point.y)) {
        //             var self = this;
        //             if (!wx.requestSubscribeMessage) {
        //                 self._subscribeSystemMessageListener.callBack(false);
        //                 ui.toast("您当前微信版本过低，不支持本功能");
        //                 return;
        //             }
        //             // 0:等待用户确认 1:成功 2:失败
        //             let state = 0;
        //             // 延迟判断状态，只有处于等待用户确认时，才弹出引导dlg
        //             clearTimeout(self._subscriptionTimeId);
        //             self._subscriptionTimeId = setTimeout(() => {
        //                 if (state == 0) {
        //                     ui.popup(app.home.SubscriptionGuideDlg, {
        //                         popupBgAlpha: 0,
        //                         params: [-400],
        //                         isShowLoading: false,
        //                         closeOnClick: true,
        //                     }).then((subGuideDlgUI) => {
        //                         self._subscriptionGuideDlg = subGuideDlgUI;
        //                     });
        //                 }
        //             }, 1200);
        //             wx.requestSubscribeMessage({
        //                 tmplIds: [this._subscribeMessageTempleteId1, this._subscribeMessageTempleteId2, this._subscribeMessageTempleteId3],
        //                 success: (res: any) => {
        //                     if (
        //                         res &&
        //                         (res[this._subscribeMessageTempleteId1] == "accept" ||
        //                             res[this._subscribeMessageTempleteId2] == "accept" ||
        //                             res[this._subscribeMessageTempleteId3] == "accept")
        //                     ) {
        //                         state = 1;
        //                         self._subscribeSystemMessageListener.callBack(true);
        //                     } else {
        //                         // isFail = true;
        //                         state = 2;
        //                         //this._subscribeSystemMessageListener.callBack(false);
        //                         wx.showModal({
        //                             title: "订阅失败",
        //                             content: "如无法正常订阅，请点击设置进行手动订阅",
        //                             showCancel: true,
        //                             cancelText: "取消",
        //                             confirmText: "设置",
        //                             success: function (result: any) {
        //                                 if (result.confirm) {
        //                                     self.openSettingForSubscribe();
        //                                 } else {
        //                                     // 用户选择了“取消”，没有进入设置订阅界面
        //                                     self._subscribeSystemMessageListener.callBack(false);
        //                                 }
        //                             },
        //                         });
        //                     }
        //                     clearTimeout(self._subscriptionTimeId);
        //                     if (self._subscriptionGuideDlg) {
        //                         self._subscriptionGuideDlg.close();
        //                     }
        //                 },
        //                 fail: (errMsg: string, errCode: number) => {
        //                     state = 2;
        //                     clearTimeout(self._subscriptionTimeId);
        //                     if (self._subscriptionGuideDlg) {
        //                         self._subscriptionGuideDlg.close();
        //                     }
        //                     //this._subscribeSystemMessageListener.callBack(false);
        //                     wx.showModal({
        //                         title: "订阅失败",
        //                         content: "如无法正常订阅，请点击设置进行手动订阅",
        //                         showCancel: true,
        //                         cancelText: "取消",
        //                         confirmText: "设置",
        //                         success: function (result: any) {
        //                             if (result.confirm) {
        //                                 self.openSettingForSubscribe();
        //                             } else {
        //                                 // 用户选择了“取消”，没有进入设置订阅界面
        //                                 self._subscribeSystemMessageListener.callBack(false);
        //                             }
        //                         },
        //                     });
        //                 },
        //             });
        //         }
        //     }
        // }
    }

    private openSettingForSubscribe() {
        var self = this;
        // wx.openSetting({
        //     withSubscriptions: true,
        //     success: function (res: any) {
        //         console.log(res.subscriptionsSetting);
        //         // res.authSetting = {
        //         //   "scope.userInfo": true,
        //         //   "scope.userLocation": true
        //         // }
        //         if (
        //             res &&
        //             res.subscriptionsSetting &&
        //             res.subscriptionsSetting.itemSettings &&
        //             (res.subscriptionsSetting.itemSettings[self._subscribeMessageTempleteId1] == "accept" ||
        //                 res.subscriptionsSetting.itemSettings[self._subscribeMessageTempleteId2] == "accept" ||
        //                 res.subscriptionsSetting.itemSettings[self._subscribeMessageTempleteId3] == "accept")
        //         ) {
        //             self._subscribeSystemMessageListener.callBack(true);
        //         } else {
        //             self._subscribeSystemMessageListener.callBack(false);
        //         }
        //     },
        // });
    }
    //显示插屏广告
    interstitialAd(adUnitID: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let ad = this.interstitialAds[adUnitID];
            if (!ad) {
                this.interstitialAds[adUnitID] = wx.createInterstitialAd({ adUnitId: adUnitID });
                ad = this.interstitialAds[adUnitID];
            }

            ad.onError((e: any) => {
                console.log(e);
                reject(false);
            });
            ad.onClose(() => {
                resolve(true);
            });
            ad.show().catch((e: any) => {
                console.log(e);
                reject(false);
            });
        });
    }
    public showVideoAdWX(ad_id: string): Promise<ePlatfromADStatus> {
        return new Promise((resolve, reject) => {
            let index = 0;
            // 无ad_id时弹出警告
            if (ad_id == null || ad_id == "") {
                wx.showModal({ title: "提示", content: "播放失败！视频广告未授权开放" });
                reject(ePlatfromADStatus.VIDEO_ERROR_NOT_READY);
                return;
            }
            let rewardedVideoAd = this.video_ads[ad_id];
            if (!rewardedVideoAd) {
                this.video_ads[ad_id] = rewardedVideoAd = wx.createRewardedVideoAd({
                    adUnitId: ad_id,
                });
            }
            if (rewardedVideoAd == null) {
                wx.showModal({ title: "提示", content: "今日广告已看完！" });
                reject(ePlatfromADStatus.VIDEO_ERROR_OVERTIME);
                // manager.system.setLocalStorage({ wxVideoAdMaxLimit: true });
                return;
            }
            rewardedVideoAd.onError((err: VideoError) => {
                removeListening();
                let code = err.errCode;
                if (code == 1000 || code == 1003) {
                    wx.showModal({ title: "提示", content: "加载失败,请重试！" });
                    reject(ePlatfromADStatus.VIDEO_ERROR_TRY_AGAIN);
                } else {
                    wx.showModal({ title: "提示", content: "今日广告已看完！" });
                    // manager.system.setLocalStorage({ wxVideoAdMaxLimit: true });
                    reject(ePlatfromADStatus.VIDEO_ERROR_NOT_READY);
                }
            });

            // 兼容新老版本广告关闭按钮
            rewardedVideoAd.onClose(function onCloseFunc(res: any) {
                removeListening();
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if ((res && res.isEnded) || res === undefined) {
                    // 用户完整观看广告
                    resolve(ePlatfromADStatus.VIDEO_FINISH);
                } else {
                    // 用户提前点击了【关闭广告】按钮,进入失败回调
                    reject(ePlatfromADStatus.VIDEO_ERROR_CLOSE);
                }
                // 关闭后重开背景音乐
                //Audio.playBGM()
            });

            // 激励视频广告组件是自动拉取广告并进行更新的。在组件创建后会拉取一次广告，用户点击 关闭广告 后会去拉取下一条广告。
            // 如果拉取成功。RewardedVideoAd.onLoad() 会执行
            rewardedVideoAd.onLoad(() => {
                console.log("激励视频 广告加载成功");
            });

            showVideo();
            // 播放广告时暂停背景音乐
            //  Audio.stopBGM()
            function showVideo() {
                rewardedVideoAd.show().catch((err: any) => {
                    index++;
                    if (index < 2) videLoad();
                    else {
                        removeListening();
                        wx.showModal({ title: "提示", content: "播放失败！" });
                        reject(ePlatfromADStatus.VIDEO_ERROR_LOADED);
                    }
                });
            }

            function videLoad() {
                rewardedVideoAd
                    .load()
                    .then(() => {
                        showVideo();
                    })
                    .catch((err: any) => {
                        removeListening();
                        wx.showModal({ title: "提示", content: "暂时无法获取广告,请检查网络" });
                        reject(ePlatfromADStatus.VIDEO_ERROR_LOADED);
                    });
            }

            function removeListening() {
                rewardedVideoAd.offClose();
                rewardedVideoAd.offError();
            }
        });
    }

    public share(position: string, title: string, image: string, query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.updateShareMenu({
                withShareTicket: true,
            });

            var shareT = Date.now();
            wx.shareAppMessage({
                title: title,
                imageUrl: image,
                query: query,
            });
            // this.myEventer.once(this.EVENT_ON_WX_SHOW, null, () => {
            //     var delta = Date.now() - shareT;
            //     if (delta >= 3000) {
            //         resolve();
            //     } else {
            //         reject();
            //     }
            // });
        });
    }

    getVersion(): string {
        return "";
    }

    setDefaultShare(title: string, img: string): void {
        let menus = ["shareAppMessage"];
        if (!this.isIOS) {
            menus = ["shareAppMessage", "shareTimeline"];
        }
        wx.showShareMenu({
            withShareTicket: true,
            menus: menus,
            success: (res: any) => {
                console.info("setting_success");
                console.info(res);
            },
            fail: (err: any) => {
                console.warn(err);
            },
        });
        wx.onShareAppMessage(() => {
            return {
                title: title || "",
                imageUrl: img || "",
            };
        });
        if (!this.isIOS && this.compareVersions(this.sdkVersion, "2.12.0") >= 0) {
            wx.onShareTimeline(() => {
                return {
                    title: title || "",
                    imageUrl: img || "", // 图片 URL
                    query: "",
                };
            });
        }
    }

    tj(a: string): void {
        wx.uma.trackEvent(a);
    }

    //获取平台渠道号
    getPlatfromChannel(): Promise<string> {
        return new Promise((resolve, reject) => {
            return "wechat";
        });
    }

    //获取平台版本号
    getNativeAppVersion(): Promise<number> {
        return new Promise((resolve, reject) => {
            return 1.0;
        });
    }

    //注册onShow
    registerOnShowHandler(hander: (res: any) => void): void {
        wx.onShow((res) => {
            hander(res);
        });
    }
    //注册onHide
    registerOnHideHandler(hander: (res: any) => void): void { }
    //注册回退事件
    registerBackHandler(hander: (res: any) => void): void { }
    //注册同步事件
    registerSyncHandler(hander: (res: any) => void): void { }
    //调用宿主进行copy
    copyTextByApp(str: string): boolean {
        return true;
    }

    //是否小屏幕手机
    isSmallScreen(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }
    callNativeAppInit(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return true;
        });
    }

    openUrlInApp(url: string, isFullscreen?: number, backStyle?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            return null;
        }).catch((e) => {
            return null;
        });
    }
    //版本比较函数 //0:相等 1:大于 -1:小于
    compareVersions(version1: string, version2: string): number {
        var versionArr1 = version1.split(".");
        var versionArr2 = version2.split(".");

        var maxLength = Math.max(versionArr1.length, versionArr2.length);
        while (versionArr1.length < maxLength) {
            versionArr1.push("0");
        }
        while (versionArr2.length < maxLength) {
            versionArr2.push("0");
        }

        var result = 0; //0:相等 1:大于 -1:小于
        for (var i = 0; i < maxLength; i++) {
            if (parseInt(versionArr1[i]) > parseInt(versionArr2[i])) {
                result = 1;
                break;
            } else if (parseInt(versionArr1[i]) < parseInt(versionArr2[i])) {
                result = -1;
                break;
            }
        }

        return result;
    }

    showGameIcon(v: boolean): void {
        this._isShowGameIcon = v;
        if (this.iconAd) {
            if (v) this.iconAd.show();
            else this.iconAd.hide();
        }
    }
    createGameIcon(adUnitId: string, x: number, y: number, iconSize: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // 创建推荐位实例，提前初始化
            if (wx.createGameIcon) {
                let info = wx.getSystemInfoSync();

                let rx = cc.winSize.width / info.screenWidth;
                let ry = cc.winSize.height / info.screenHeight;
                if (!this._isShowGameIcon) {
                    reject(false);
                    return;
                }
                if (this.iconAd == null) {
                    let iconAd = wx.createGameIcon({
                        adUnitId: adUnitId,
                        count: 1,
                        style: [{ appNameHidden: true, left: 0, top: 0, borderWidth: 2, borderColor: "#ffffff", size: iconSize / rx }],
                    });
                    if (iconAd) {
                        iconAd.onResize((arr: Array<any>) => {
                            if (arr && arr.length > 0) {
                                arr[0].left = x / rx - arr[0].width / 2.0;
                                arr[0].top = y / ry - 9;
                            }
                        });
                    }
                    this.iconAd = iconAd;
                }
                if (this.iconAd) {
                    let that = this;
                    this.iconAd
                        .load()
                        .then(() => {
                            if (!this._isShowGameIcon) {
                                that.iconAd.hide();
                                reject(false);
                            } else {
                                that.iconAd.show();
                                resolve(true);
                            }
                        })
                        .catch(() => {
                            that.iconAd = null;
                            reject(false);
                        });
                } else {
                    reject(false);
                }
            } else {
                reject(false);
            }
            // 在合适的场景显示推荐位
            // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
        });
    }
}

export class WxLoginButton extends Object {
    public static btnWidth: number = 337;
    public static btnHeight: number = 123;

    //判断是否为小游戏运行环境，用于一套代码同时适配小游戏与非小游戏项目。
    public static isMiniGame(): boolean {
        return cc.sys.platform === cc.sys.WECHAT_GAME ? true : false;
    }

    public static buttonTop(): number {
        if (this.isMiniGame()) {
            return wx.getSystemInfoSync().screenHeight - WxLoginButton.btnHeight / 2.0 - 50;
        }
        return 0;
    }
    public static buttonLeft(): number {
        if (this.isMiniGame()) {
            return (wx.getSystemInfoSync().screenWidth - WxLoginButton.btnWidth / 2.0) / 2.0;
        }
        return 0;
    }
    public static btnSkinText = {
        type: "text",
        text: "获取用户信息",
        style: {
            left: 10,
            top: 76,
            width: 200,
            height: 40,
            lineHeight: 40,
            backgroundColor: "#ff0000",
            color: "#ffffff",
            textAlign: "center",
            fontSize: 16,
            borderRadius: 4,
        },
    };
}
