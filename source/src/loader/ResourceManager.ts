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

    export class FguiAsset extends cc.BufferAsset {}

    export class ResourceManager extends Singleton {
        public static FONT_Yuanti = "Yuanti SC Regular";
        public static Font_Helvetica = "Helvetica";
        public static FONT_DEFAULT = "";
        public static FONT_DEFAULT_SIZE = FONT_SIZE_5;

        private _dicResInfo: SDictionary<ResInfo> = null; //加载过的信息，方便资源释放
        private _minLoaderTime: number; //最小加载时间，调整图片一闪而过的体验 单位毫秒
        public static DefaultGroup: string = "airkit";
        public static SystemGroup: string = "system";

        private static instance: ResourceManager = null;
        public static get Instance(): ResourceManager {
            if (!this.instance) this.instance = new ResourceManager();
            return this.instance;
        }

        public setup(): void {
            this._dicResInfo = new SDictionary<ResInfo>();
            this._minLoaderTime = 1000;
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

        public destroy(): boolean {
            super.destroy();
            if (this._dicResInfo) {
                this._dicResInfo.foreach((k, v) => {
                    ResourceManager.Instance.clearRes(k);
                    return true;
                });
                this._dicResInfo.clear();
                this._dicResInfo = null;
            }
            return true;
        }
        public update(dt: number): void {}

        /**获取资源*/
        public getRes(url: string): any {
            //修改访问时间
            return cc.resources.get(url);
        }

        public dump(): void {
            this._dicResInfo.foreach((k, v) => {
                console.log("url:" + k + " refCount=" + v.ref + "\n");
                return true;
            });
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
            type?: typeof cc.Asset,
            viewType: number = LOADVIEW_TYPE_NONE,
            priority: number = 1,
            cache: boolean = true,
            group: string = "default",
            ignoreCache: boolean = false
        ): Promise<string> {
            //添加到加载目录

            if (viewType == null) viewType = LOADVIEW_TYPE_NONE;
            //判断是否需要显示加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                if (cc.resources.get(url)) viewType = LOADVIEW_TYPE_NONE;
            }
            //显示加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(
                    LoaderEventID.LOADVIEW_OPEN,
                    viewType,
                    1
                );
            }
            let resInfo = this._dicResInfo.getValue(url);
            if (!resInfo) {
                resInfo = new ResInfo(url, type, group);
                this._dicResInfo.set(url, resInfo);
            }
            resInfo.incRef();
            resInfo.updateStatus(eLoaderStatus.LOADING);

            return new Promise((resolve, reject) => {
                cc.resources.load(
                    url,
                    type,
                    (completedCount: number, totalCount: number, item: any) => {
                        this.onLoadProgress(
                            viewType,
                            totalCount,
                            "",
                            completedCount / totalCount
                        );
                    },
                    (error: Error, resource: any) => {
                        if (error) {
                            resInfo.updateStatus(eLoaderStatus.READY);
                            resInfo.decRef();
                            reject(url);
                            return;
                        }
                        resInfo.updateStatus(eLoaderStatus.LOADED);
                        this.onLoadComplete(viewType, [url], [type], "");
                        resolve(url);
                    }
                );
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
            arr_res: Array<{ url: string; type: typeof cc.Asset }>,
            viewType: number = LOADVIEW_TYPE_NONE,
            tips: string = null,
            priority: number = 1,
            cache: boolean = true,
            group: string = "default",
            ignoreCache: boolean = false
        ): Promise<string[]> {
            let has_unload: boolean = false;
            let urls = [];
            let types = new Array<typeof cc.Asset>();
            if (viewType == null) viewType = LOADVIEW_TYPE_NONE;
            if (priority == null) priority = 1;
            if (cache == null) cache = true;
            for (let res of arr_res) {
                urls.push(res.url);
                types.push(res.type);
                //判断是否有未加载资源
                if (!has_unload && !cc.resources.get(res.url))
                    has_unload = true;
                //添加到加载目录
            }
            //判断是否需要显示加载界面
            if (!has_unload && viewType != LOADVIEW_TYPE_NONE) {
                viewType = LOADVIEW_TYPE_NONE;
            }
            //显示加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(
                    LoaderEventID.LOADVIEW_OPEN,
                    viewType,
                    urls.length,
                    tips
                );
            }
            for (let i = 0; i < urls.length; i++) {
                let resInfo = this._dicResInfo.getValue(urls[i]);
                if (!resInfo) {
                    resInfo = new ResInfo(urls[i], types[i], group);
                    this._dicResInfo.set(urls[i], resInfo);
                }
                resInfo.incRef();
                resInfo.updateStatus(eLoaderStatus.LOADING);
            }
            return new Promise((resolve, reject) => {
                cc.resources.load(
                    urls,
                    (completedCount: number, totalCount: number, item: any) => {
                        this.onLoadProgress(
                            viewType,
                            totalCount,
                            tips,
                            completedCount / totalCount
                        );
                    },
                    (error: Error, resource: any) => {
                        if (error) {
                            for (let i = 0; i < urls.length; i++) {
                                let resInfo = this._dicResInfo.getValue(
                                    urls[i]
                                );
                                if (resInfo) {
                                    resInfo.decRef();
                                    resInfo.updateStatus(eLoaderStatus.READY);
                                }
                            }
                            reject(urls);
                            return;
                        }

                        for (let i = 0; i < urls.length; i++) {
                            let resInfo = this._dicResInfo.getValue(urls[i]);
                            if (resInfo) {
                                resInfo.updateStatus(eLoaderStatus.READY);
                            }
                        }

                        if (viewType != LOADVIEW_TYPE_NONE) {
                            TimerManager.Instance.addOnce(
                                this._minLoaderTime,
                                null,
                                (v) => {
                                    this.onLoadComplete(
                                        viewType,
                                        urls,
                                        types,
                                        tips
                                    );
                                    resolve(urls);
                                }
                            );
                        } else {
                            this.onLoadComplete(viewType, urls, types, tips);
                            resolve(urls);
                        }
                    }
                );
            });
        }
        /**
         * 加载完成
         * @param	viewType	显示的加载界面类型
         * @param 	handle 		加载时，传入的回调函数
         * @param 	args		第一个参数为加载的资源url列表；第二个参数为是否加载成功
         */
        public onLoadComplete(
            viewType: number,
            urls: string[],
            types: Array<typeof cc.Asset>,
            tips: string
        ): void {
            //显示加载日志
            if (urls) {
                let arr: Array<string> = urls;
                for (let i = 0; i < urls.length; i++) {
                    if (types[i] == airkit.FguiAsset) {
                        fgui.UIPackage.addPackage(urls[i]);
                    }
                }
            }

            //关闭加载界面
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(
                    LoaderEventID.LOADVIEW_COMPLATE,
                    viewType
                );
            }
        }
        /**
         * 加载进度
         * @param	viewType	显示的加载界面类型
         * @param	total		总共需要加载的资源数量
         * @param	progress	已经加载的数量，百分比；注意，有可能相同进度会下发多次
         */
        public onLoadProgress(
            viewType: number,
            total: number,
            tips: string,
            progress: number
        ): void {
            let cur: number = NumberUtils.toInt(Math.floor(progress * total));

            Log.debug("[load]进度: current={0} total={1}", cur, total);
            if (viewType != LOADVIEW_TYPE_NONE) {
                EventCenter.dispatchEvent(
                    LoaderEventID.LOADVIEW_PROGRESS,
                    viewType,
                    cur,
                    total,
                    tips
                );
            }
        }

        /**
         * 释放指定资源
         * @param	url	资源路径
         */
        public clearRes(url: string): void {
            let res = this._dicResInfo.getValue(url);
            if (res) {
                res.decRef();
            }
        }

        public releaseRes(url: string): void {
            this._dicResInfo.remove(url);
            cc.resources.release(url);
            Log.info("[res]释放资源:" + url);
        }

        public createFuiAnim(
            pkgName: string,
            resName: string,
            path: string,
            group: string = "default"
        ): Promise<any> {
            return new Promise((resolve, reject) => {
                let atlas = path + "_atlas0";
                let bin = path;
                let res = ResourceManager.Instance.getRes(atlas);
                if (res == null) {
                    ResourceManager.Instance.loadArrayRes(
                        [
                            { url: atlas, type: cc.BufferAsset },
                            { url: bin, type: FguiAsset },
                        ],
                        null,
                        null,
                        0,
                        true,
                        group
                    )
                        .then((v) => {
                            let obj = fgui.UIPackage.createObject(
                                pkgName,
                                resName
                            );
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

        /**
         * 图片代理，可以远程加载图片显示
         * @param image
         * @param skin
         * @param proxy
         * @param atlas
         */
        public static imageProxy(
            image: fgui.GLoader,
            skin: string,
            proxy?: string,
            atlas?: string
        ): Promise<any> {
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
    class ResInfo extends EventDispatcher {
        public group: string;
        public url: string;
        public type: typeof cc.Asset;
        public status: eLoaderStatus;
        public ref: number;

        constructor(url: string, type: typeof cc.Asset, group: string) {
            super();
            this.url = url;
            this.ref = 0;
            this.group = group;
            this.status = eLoaderStatus.READY;
        }

        public updateStatus(status: eLoaderStatus): void {
            this.status = status;
        }

        public incRef(): void {
            this.ref++;
        }
        public decRef(): void {
            this.ref--;
            if (this.ref <= 0) {
                if (this.type == FguiAsset) {
                    fgui.UIPackage.removePackage(this.url);
                }
                ResourceManager.Instance.releaseRes(this.url);
            }
        }
    }
}
