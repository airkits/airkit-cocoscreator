namespace airkit {
    /**
     * 资源管理
     * @author ankye
     * @time 2018-7-10
     */
    export const FONT_SIZE_4 = 18;
    export const FONT_SIZE_5 = 22;
    export const FONT_SIZE_6 = 25;
    export const FONT_SIZE_7 = 29;

    export class ResourceManager extends Singleton {
        public static FONT_Yuanti = "Yuanti SC Regular";
        public static Font_Helvetica = "Helvetica";
        public static FONT_DEFAULT = "";
        public static FONT_DEFAULT_SIZE = FONT_SIZE_5;

        private _dicLoaderUrl: SDictionary<LoaderConfig> = null; //加载过的信息，方便资源释放
        private _minLoaderTime: number; //最小加载时间，调整图片一闪而过的体验 单位毫秒
        public static DefaultGroup: string = "airkit";
        public static SystemGroup: string = "system";
        private _spineDic: SDictionary<[Laya.Templet, string]>;

        private _aniAnimDic: SDictionary<[string, number, string]>;
        public onAniResUpdateSignal: Signal<string>;

        private static instance: ResourceManager = null;
        public static get Instance(): ResourceManager {
            if (!this.instance) this.instance = new ResourceManager();
            return this.instance;
        }

        public setup(): void {
            this._dicLoaderUrl = new SDictionary<LoaderConfig>();
            this._spineDic = new SDictionary<[Laya.Templet, string]>();

            this._minLoaderTime = 1000;
            this._aniAnimDic = new SDictionary<[string, number, string]>();
            this.onAniResUpdateSignal = new Signal<string>();
        }

        /**
         * 异步加载
         * @param    url  要加载的单个资源地址或资源信息数组。比如：简单数组：["a.png","b.png"]；复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]。
         * @param    progress  加载进度
         * @param    type		数组的时候，类型为undefined 资源类型。比如：Loader.IMAGE。
         * @param	priority	(default = 1)加载的优先级，优先级高的优先加载。有0-4共5个优先级，0最高，4最低。
         * @param	cache		是否缓存加载结果。
         * @param	group		分组，方便对资源进行管理。
         * @param    ignoreCache	是否忽略缓存，强制重新加载。
         */
        protected static asyncLoad(
            url: any,
            progress?: Handler,
            type?: string,
            priority?: number,
            cache?: boolean,
            group?: string,
            ignoreCache?: boolean
        ): Promise<any> {
            return new Promise((resolve, reject) => {
                let errFunc = function (v) {
                    Laya.loader.off(Laya.Event.ERROR, null, errFunc);
                    reject(url);
                };
                Laya.loader.load(
                    url,
                    Handler.create(this, (v) => {
                        Laya.loader.off(Laya.Event.ERROR, null, errFunc);
                        resolve(url);
                    }),
                    progress,
                    type,
                    priority,
                    cache,
                    group,
                    ignoreCache
                );
                Laya.loader.on(Laya.Event.ERROR, null, errFunc);
            });
        }

        public destroy(): void {
            if (this._dicLoaderUrl) {
                this._dicLoaderUrl.clear();
                this._dicLoaderUrl = null;
            }
        }
        public update(dt: number): void {}

        /**获取资源*/
        public getRes(url: string): any {
            //修改访问时间
            this.refreshResourceTime(url, null, false);
            return Laya.loader.getRes(url);
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～加载～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**
         * 加载资源，如果资源在此之前已经加载过，则当前帧会调用complete
         * @param	url 		单个资源地址
         * @param	type 		资源类型
         * @param	viewType 	加载界面
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @param	group 		分组，方便对资源进行管理。
         * @param	ignoreCache 是否忽略缓存，强制重新加载
         * @return 	结束回调(参数：string 加载的资源url)
         */
        public loadRes(
            url: string,
            type: string = "",
            viewType: number = LOADVIEW_TYPE_NONE,
            priority: number = 1,
            cache: boolean = true,
            group: string = "default",
            ignoreCache: boolean = false
        ): Promise<any> {
            //添加到加载目录
            this.refreshResourceTime(url, group, true);
            if (viewType == null) viewType = LOADVIEW_TYPE_NONE;
            //判断是否需要显示加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                if (Laya.loader.getRes(url)) viewType = LOADVIEW_TYPE_NONE;
            }
            //显示加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(LoaderEventID.LOADVIEW_OPEN, viewType, 1);
            }
            //加载
            return new Promise((resolve, reject) => {
                ResourceManager.asyncLoad(
                    url,
                    Handler.create(this, this.onLoadProgress, [viewType, 1], false),
                    type,
                    priority,
                    cache,
                    group,
                    ignoreCache
                )
                    .then((v) => {
                        this.onLoadComplete(viewType, [url]);
                        resolve(url);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        }
        /**
         * 批量加载资源，如果所有资源在此之前已经加载过，则当前帧会调用complete
         * @param	arr_res 	需要加载的资源数组
         * @param	viewType 	加载界面
         * @param   tips		提示文字
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @param	group 		分组，方便对资源进行管理。
         * @param	ignoreCache 是否忽略缓存，强制重新加载
         * @return 	结束回调(参数：Array<string>，加载的url数组)
         */
        public loadArrayRes(
            arr_res: Array<{ url: string; type: string }>,
            viewType: number = LOADVIEW_TYPE_NONE,
            tips: string = null,
            priority: number = 1,
            cache: boolean = true,
            group: string = "default",
            ignoreCache: boolean = false
        ): Promise<any> {
            let has_unload: boolean = false;
            let assets = [];
            let urls = [];
            Laya.loader.maxLoader = 4;
            if (viewType == null) viewType = LOADVIEW_TYPE_NONE;
            if (priority == null) priority = 1;
            if (cache == null) cache = true;
            for (let res of arr_res) {
                assets.push({ url: res.url, type: res.type });
                urls.push(res.url);
                //判断是否有未加载资源
                if (!has_unload && !Laya.loader.getRes(res.url)) has_unload = true;
                //添加到加载目录
                this.refreshResourceTime(res.url, group, true);
            }
            //判断是否需要显示加载界面
            if (!has_unload && viewType != LOADVIEW_TYPE_NONE) {
                viewType = LOADVIEW_TYPE_NONE;
            }
            //显示加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(LoaderEventID.LOADVIEW_OPEN, viewType, assets.length, tips);
            }

            // //加载
            return new Promise((resolve, reject) => {
                ResourceManager.asyncLoad(
                    assets,
                    Handler.create(this, this.onLoadProgress, [viewType, assets.length, tips], false),
                    undefined,
                    priority,
                    cache,
                    group,
                    ignoreCache
                )
                    .then((v) => {
                        if (viewType != LOADVIEW_TYPE_NONE) {
                            TimerManager.Instance.addOnce(this._minLoaderTime, null, (v) => {
                                this.onLoadComplete(viewType, urls, tips);
                                resolve(urls);
                            });
                        } else {
                            this.onLoadComplete(viewType, urls, tips);
                            resolve(urls);
                        }
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        }
        /**
         * 加载完成
         * @param	viewType	显示的加载界面类型
         * @param 	handle 		加载时，传入的回调函数
         * @param 	args		第一个参数为加载的资源url列表；第二个参数为是否加载成功
         */
        public onLoadComplete(viewType: number, ...args: any[]): void {
            //显示加载日志
            if (args) {
                let arr: Array<string> = args[0];
                for (let url of arr) {
                    Log.debug("[load]加载完成url:" + url);
                    var i = url.lastIndexOf(".bin");
                    if (i > 0) {
                        let pkg = url.substr(0, i);
                        fgui.UIPackage.addPackage(pkg);
                        Log.info("add Package :" + pkg);
                    }
                    let loader_info: LoaderConfig = this._dicLoaderUrl.getValue(url);
                    if (loader_info) {
                        loader_info.updateStatus(eLoaderStatus.LOADED);
                    }
                }
            }
            //关闭加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(LoaderEventID.LOADVIEW_COMPLATE, viewType);
            }
        }
        /**
         * 加载进度
         * @param	viewType	显示的加载界面类型
         * @param	total		总共需要加载的资源数量
         * @param	progress	已经加载的数量，百分比；注意，有可能相同进度会下发多次
         */
        public onLoadProgress(viewType: number, total: number, tips: string, progress: number): void {
            let cur: number = NumberUtils.toInt(Math.floor(progress * total));

            Log.debug("[load]进度: current={0} total={1}", cur, total);
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(LoaderEventID.LOADVIEW_PROGRESS, viewType, cur, total, tips);
            }
        }

        /**更新资源使用时间*/
        private refreshResourceTime(url: string, group: string, is_create: boolean) {
            if (is_create) {
                let loader_info: LoaderConfig = this._dicLoaderUrl.getValue(url);
                if (!loader_info) {
                    loader_info = new LoaderConfig(url, group);
                    this._dicLoaderUrl.add(url, loader_info);
                    loader_info.updateStatus(eLoaderStatus.LOADING);
                } else {
                    loader_info.ctime = Timer.timeSinceStartup;
                }
            } else {
                let loader_info: LoaderConfig = this._dicLoaderUrl.getValue(url);
                if (loader_info) {
                    loader_info.utime = Timer.timeSinceStartup;
                }
            }
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～资源释放～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**
         * 释放资源
         * @param	type	释放策略
         */
        // public clearUnusedAssets(type: eClearStrategy): void {
        // 	this.clearAsset(type)
        // }
        /**
         * 释放指定资源
         * @param	url	资源路径
         */
        public clearRes(url: string): any {
            this._dicLoaderUrl.remove(url);
            Laya.loader.clearRes(url);
            var i = url.lastIndexOf(".bin");
            if (i > 0) {
                // let pkg = url.substr(0, i);
                let offset = url.lastIndexOf("/");
                let pkg = url.substr(offset + 1, i - offset - 1);
                fgui.UIPackage.removePackage(pkg);
                Log.info("remove Package :" + pkg);
            }

            Log.info("[res]释放资源:" + url);
        }

        public cleanTexture(group: string): void {
            this._dicLoaderUrl.foreach((k, v) => {
                //if (k.indexOf(".png") > 0 || k.indexOf(".atlas") > 0) {
                if (v.group == group) {
                    Log.info("清理texture资源 {0}", k);
                    this.clearRes(k);
                }
                //}
                return true;
            });
        }

        public setAniAnim(ani: string, atlas: string, group: string): void {
            let value = this._aniAnimDic.getValue(ani);
            if (value == null) {
                this._aniAnimDic.add(ani, [atlas, 1, group]);
            } else {
                value[1] += 1;
            }
        }

        /**
         *
         * @param skUrl
         * @param aniMode type 0	动画模式，0:不支持换装,1,2支持换装
         */
        public createSpineAnim(skUrl: string, aniMode: number, group: string = "default"): Promise<any> {
            return new Promise((resolve, reject) => {
                let t = this._spineDic.getValue(skUrl);
                if (t) {
                    resolve(t[0].buildArmature(aniMode));
                } else {
                    DisplayUtils.createSkeletonAni(skUrl, aniMode)
                        .then((v) => {
                            //store templet return Skeleton
                            this._spineDic.add(skUrl, [v[0], group]);
                            resolve(v[1]);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                }
            });
        }

        public removeSpineAnim(sk: Laya.Skeleton): void {
            sk.offAll();
            sk.removeSelf();
            sk.destroy();
            sk = null;
        }
        public removeSpineTemplet(skUrl: string): void {
            let v = this._spineDic.getValue(skUrl);
            if (v == null) {
                return;
            }
            for (let k in v[0].subTextureDic) {
                let t = v[0].subTextureDic[k];
                t.disposeBitmap();
                delete v[0].subTextureDic[k];
                t = null;
            }
            ResourceManager.Instance.clearRes(skUrl);
            this._spineDic.remove(skUrl);
            v[0].destroy();
            ArrayUtils.clear(v);
            v = null;
        }

        public removeSpineTempletGroup(group: string): void {
            this._spineDic.foreach((k, v) => {
                if (v[1] == group) {
                    this.removeSpineTemplet(k);
                }
                return true;
            });
        }
        public createAniAnim(ani: string, atlas: string, group: string = "default"): Promise<any> {
            return new Promise((resolve, reject) => {
                DisplayUtils.createAsyncAnimation(ani, atlas)
                    .then((v: Laya.Animation) => {
                        this.setAniAnim(ani, atlas, group);
                        this.onAniResUpdateSignal.dispatch(ani);
                        resolve(v);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        }

        public createFrameAnim(name: string, urls: Array<string>, atlas: string, group: string = "default"): Promise<any> {
            return new Promise((resolve, reject) => {
                let res = ResourceManager.Instance.getRes(atlas);
                let anim = new Laya.Animation();
                anim.loadAtlas(
                    atlas,
                    Handler.create(null, (v) => {
                        Laya.Animation.createFrames(urls, name);
                        //循环播放动画
                        resolve(anim);
                    })
                );
            });
        }

        public createFuiAnim(pkgName: string, resName: string, path: string, group: string = "default"): Promise<any> {
            return new Promise((resolve, reject) => {
                let atlas = path + "_atlas0.png";
                let bin = path + ".bin";
                let res = ResourceManager.Instance.getRes(atlas);
                if (res == null) {
                    ResourceManager.Instance.loadArrayRes(
                        [
                            { url: atlas, type: Laya.Loader.IMAGE },
                            { url: bin, type: Laya.Loader.BUFFER },
                        ],
                        null,
                        null,
                        0,
                        true,
                        group
                    )
                        .then((v) => {
                            let obj = fgui.UIPackage.createObject(pkgName, resName);
                            resolve(obj.asCom);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                } else {
                    let obj = fgui.UIPackage.createObject(pkgName, resName);
                    resolve(obj.asCom);
                }
            });
        }
        //清理资源，连atlas一起删除，非必要不用调用
        public removeAniAnim(ani: string): void {
            let v = this._aniAnimDic.getValue(ani);
            if (v == null) {
                return;
            }
            ResourceManager.Instance.clearRes(ani);
            for (let k in Laya.Animation.framesMap) {
                if (StringUtils.beginsWith(k, ani)) {
                    let obj = Laya.Animation.framesMap[k];
                    delete Laya.Animation.framesMap[k];
                    if (obj.frames && obj.frames.length > 0) {
                        let len = obj.frames.length;
                        for (let i = 0; i < len; i++) {
                            let g = obj.frames.shift();
                            g.autoDestroy = true;
                            g.destroy(true);
                            g = null;
                        }
                        obj.frames = null;
                    }
                    obj = null;
                }
            }
            this._aniAnimDic.remove(ani);
        }

        public removeAllAniAnim(group: string = "default"): void {
            this._aniAnimDic.foreach((k, v) => {
                if (v[2] == group) {
                    Log.info("clean {0} {1}", k, v[0]);
                    this.removeAniAnim(k);
                }
                return true;
            });

            //	Laya.Animation.framesMap = {}

            //	this._aniAnimDic.clear()
        }

        /**
         * 图片代理，可以远程加载图片显示
         * @param image
         * @param skin
         * @param proxy
         * @param atlas
         */
        public static imageProxy(image: fgui.GLoader, skin: string, proxy?: string, atlas?: string): Promise<any> {
            return new Promise((resolve, reject) => {
                let texture = ResourceManager.Instance.getRes(skin);
                if (texture != null) {
                    image.url = skin;
                } else {
                    let res = skin;
                    if (atlas != null) {
                        res = atlas;
                    }
                    if (proxy) {
                        image.url = proxy;
                    }

                    Log.info("imageProxy start load {0} ", res);

                    ResourceManager.Instance.loadRes(res)
                        .then((v) => {
                            image.url = skin;
                            image.alpha = 0.1;
                            TweenUtils.get(image).to({ alpha: 1.0 }, 0.3);
                            Log.info("imageProxy start load done {0} ", res);
                        })
                        .catch((e) => Log.error(e));
                }
            });
        }
    }

    enum eLoaderStatus {
        READY = 0,
        LOADING = 1,
        LOADED = 2,
    }
    /**
     * 保存加载过的url
     */
    class LoaderConfig {
        public group: string;
        public url: string;
        /**创建时间*/
        public ctime: number;
        /**最近使用时间*/
        public utime: number;
        public status: eLoaderStatus;
        constructor(url: string, group: string) {
            this.url = url;
            this.group = group;
            this.ctime = Timer.timeSinceStartup;
            this.utime = Timer.timeSinceStartup;
            this.status = eLoaderStatus.READY;
        }

        public updateStatus(status: eLoaderStatus): void {
            this.status = status;
        }
    }
}
