namespace airkit {
    export interface Res {
        url: string //资源地址
        type: typeof cc.Asset //资源类型
        pkg: string //fgui包名
    }
    /**
     * 资源管理
     * @author ankye
     * @time 2018-7-10
     */
    export const FONT_SIZE_4 = 18
    export const FONT_SIZE_5 = 22
    export const FONT_SIZE_6 = 25
    export const FONT_SIZE_7 = 29
    export class FGUIAsset extends cc.BufferAsset {}
    export class ResourceManager extends Singleton {
        public static FONT_Yuanti = 'Yuanti SC Regular'
        public static Font_Helvetica = 'Helvetica'
        public static FONT_DEFAULT = ''
        public static FONT_DEFAULT_SIZE = FONT_SIZE_5

        private _dicResInfo: SDictionary<ResInfo> = null //加载过的信息，方便资源释放
        private _minLoaderTime: number //最小加载时间，调整图片一闪而过的体验 单位毫秒

        private static instance: ResourceManager = null
        public static get Instance(): ResourceManager {
            if (!this.instance) this.instance = new ResourceManager()
            return this.instance
        }

        public setup(): void {
            this._dicResInfo = new SDictionary<ResInfo>()
            this._minLoaderTime = 400
        }

        public static memory(): void {
            let cache = (<any>cc.loader)._cache
            let totalMemory = 0
            let size = 0
            cc.assetManager.assets.forEach((asset: cc.Asset, key: string) => {
                if (asset instanceof cc.Texture2D) {
                    if (asset.width && asset.height && asset['_format']) {
                        size = (asset.width * asset.height * (asset['_native'] === '.jpg' ? 3 : 4)) / (1024.0 * 1024.0)
                        Log.info('Texture[%s] %s 资源占用内存%sMB', asset.name, asset.nativeUrl, size.toFixed(3))
                        totalMemory += size
                    }
                } else if (asset instanceof cc.SpriteFrame) {
                    if (asset['_originalSize'] && asset['_texture']) {
                        size = (asset['_originalSize'].width * asset['_originalSize'].height * asset['_texture']._format) / 4 / (1024.0 * 1024.0)
                        totalMemory += size
                        Log.info('SpriteFrame[%s] %s 资源占用内存%sMB', asset.name, asset.nativeUrl, size.toFixed(3))
                    }
                }
            })
            // for (let key in cache) {
            //     let asset = cc.loader['_cache'][key]
            //     if (asset instanceof cc.Texture2D) {
            //         if (asset.width && asset.height && asset['_format']) {
            //             size = (asset.width * asset.height * (asset['_native'] === '.jpg' ? 3 : 4)) / (1024.0 * 1024.0)
            //             Log.info('Texture %s 资源占用内存%sMB', asset.nativeUrl, size.toFixed(3))
            //             totalMemory += size
            //         }
            //     } else if (asset instanceof cc.SpriteFrame) {
            //         if (asset['_originalSize'] && asset['_texture']) {
            //             size = (asset['_originalSize'].width * asset['_originalSize'].height * asset['_texture']._format) / 4 / (1024.0 * 1024.0)
            //             totalMemory += size
            //             Log.info('SpriteFrame %s 资源占用内存%sMB', asset.nativeUrl, size.toFixed(3))
            //         }
            //     }
            // }
            Log.info('资源占用内存%sMB', totalMemory.toFixed(3))
        }
        public getFGUIAsset(pkg: string): FGUIAsset {
            let result: FGUIAsset = null
            this._dicResInfo.foreach((k, v) => {
                if (v.type == FGUIAsset && v.pkg == pkg) {
                    result = cc.resources.get(v.url)
                    return false
                }
                return true
            })
            return result
        }
        public getFGUIPackageURL(pkg: string): string {
            let result: string = null
            this._dicResInfo.foreach((k, v) => {
                if (v.type == FGUIAsset && v.pkg == pkg) {
                    result = v.url
                    return false
                }
                return true
            })
            return result
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
            if (this._dicResInfo) {
                this._dicResInfo.foreach((k, v) => {
                    ResourceManager.Instance.releaseRes(k)
                    return true
                })
                this._dicResInfo.clear()
                this._dicResInfo = null
            }
            return true
        }
        public update(dt: number): void {}

        /**获取资源*/
        public getRes(path: string, type?: typeof cc.Asset): any {
            //修改访问时间
            return cc.resources.get(path, type)
        }

        public dump(): void {
            this._dicResInfo.foreach((k, v) => {
                console.log('url:' + k + '\n')
                return true
            })
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
            refCount: number = 1,
            viewType: number = eLoaderType.NONE,
            priority: number = 1,
            cache: boolean = true,
            pkg: string = null,
            ignoreCache: boolean = false
        ): Promise<string> {
            //添加到加载目录

            if (viewType == null) viewType = eLoaderType.NONE
            //判断是否需要显示加载界面
            let asset = this.getRes(url)
            if (viewType != eLoaderType.NONE) {
                if (asset) viewType = eLoaderType.NONE
            }
            //显示加载界面
            if (viewType != eLoaderType.NONE) {
                LoaderManager.Instance.show(viewType, 1)
            }
            let resInfo = this._dicResInfo.getValue(url)
            if (!resInfo) {
                resInfo = new ResInfo(url, type, pkg)
                this._dicResInfo.set(url, resInfo)
            }
            if (asset) {
                resInfo.incRef()
                return Promise.resolve(url)
            }

            return new Promise((resolve, reject) => {
                cc.resources.load(
                    url,
                    type,
                    (completedCount: number, totalCount: number, item: cc.AssetManager.RequestItem) => {
                        this.onLoadProgress(viewType, totalCount, '', completedCount / totalCount, item)
                    },
                    (error: Error, resource: any) => {
                        if (error) {
                            reject(url)
                            return
                        }
                        this.onLoadComplete(viewType, [url], [{ url: url, type: type, pkg: pkg }], '')
                        resolve(url)
                    }
                )
            })
        }

        /**
         * 批量加载资源，如果所有资源在此之前已经加载过，则当前帧会调用complete
         * @param	arr_res 	需要加载的资源数组
         * @param	loaderType 	加载界面 eLoaderType
         * @param   tips		提示文字
         * @param	priority 	优先级，0-4，5个优先级，0优先级最高，默认为1。
         * @param	cache 		是否缓存加载结果。
         * @return 	结束回调(参数：Array<string>，加载的url数组)
         */
        public loadArrayRes(arr_res: Array<Res>, loaderType: number = eLoaderType.NONE, tips: string = null, priority: number = 1, cache: boolean = true): Promise<string[]> {
            let has_unload: boolean = false
            let urls = []
            let resArr = []
            if (loaderType == null) loaderType = eLoaderType.NONE
            if (priority == null) priority = 1
            if (cache == null) cache = true
            for (let i = 0; i < arr_res.length; i++) {
                let res = arr_res[i]
                let asset = this.getRes(res.url)
                if (!asset) {
                    urls.push(res.url)
                    resArr.push(res)
                    has_unload = true
                }
                let resInfo = this._dicResInfo.getValue(res.url)
                if (!resInfo) {
                    resInfo = new ResInfo(res.url, res.type, res.pkg)
                    this._dicResInfo.set(res.url, resInfo)
                }
                if (asset) {
                    resInfo.incRef()
                }
            }
            //判断是否需要显示加载界面
            if (!has_unload && loaderType != eLoaderType.NONE) {
                loaderType = eLoaderType.NONE
            }
            //显示加载界面
            if (loaderType != eLoaderType.NONE) {
                LoaderManager.Instance.show(loaderType, urls.length, tips)
            }

            return new Promise((resolve, reject) => {
                cc.resources.load(
                    urls,
                    (completedCount: number, totalCount: number, item: cc.AssetManager.RequestItem) => {
                        this.onLoadProgress(loaderType, totalCount, tips, completedCount / totalCount, item)
                    },
                    (error: Error, resource: any) => {
                        if (error) {
                            reject(urls)
                            return
                        }

                        if (loaderType != eLoaderType.NONE) {
                            TimerManager.Instance.addOnce(this._minLoaderTime, null, (v) => {
                                this.onLoadComplete(loaderType, urls, resArr, tips)
                                resolve(urls)
                            })
                        } else {
                            this.onLoadComplete(loaderType, urls, resArr, tips)
                            resolve(urls)
                        }
                    }
                )
            })
        }
        /**
         * 加载完成
         * @param	loaderType	显示的加载界面类型
         * @param 	handle 		加载时，传入的回调函数
         * @param 	args		第一个参数为加载的资源url列表；第二个参数为是否加载成功
         */
        public onLoadComplete(loaderType: eLoaderType, urls: string[], arr_res: Array<Res>, tips: string): void {
            //显示加载日志
            if (urls) {
                let arr: Array<string> = urls
                for (let i = 0; i < urls.length; i++) {
                    if (arr_res[i].type == FGUIAsset) {
                        fgui.UIPackage.addPackage(urls[i])
                        console.log('add fgui package:', urls[i])
                    }

                    let info = this._dicResInfo.getValue(urls[i])
                    if (info) {
                        info.incRef()
                    }
                }
            }

            //关闭加载界面
            if (loaderType != eLoaderType.NONE) {
                LoaderManager.Instance.close(loaderType)
            }
        }
        /**
         * 加载进度
         * @param	viewType	显示的加载界面类型
         * @param	total		总共需要加载的资源数量
         * @param	progress	已经加载的数量，百分比；注意，有可能相同进度会下发多次
         */
        public onLoadProgress(viewType: number, total: number, tips: string, progress: number, item: cc.AssetManager.RequestItem): void {
            let cur: number = NumberUtils.toInt(Math.floor(progress * total))

            Log.debug('[load]进度: %s current=%s total=%s precent = %s', item.info.path, cur, total, progress)
            if (viewType != eLoaderType.NONE) {
                LoaderManager.Instance.setProgress(viewType, cur, total)
            }
        }

        /**
         * 释放指定资源
         * @param	url	资源路径
         */
        public clearRes(url: string): void {
            let res = this._dicResInfo.getValue(url)
            if (res) {
                res.decRef()
            }
        }

        public releaseRes(url: string): void {
            this._dicResInfo.remove(url)
            cc.resources.release(url)
            Log.info('[res]释放资源:' + url)
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
                let texture = ResourceManager.Instance.getRes(skin)
                if (texture != null) {
                    image.url = skin
                } else {
                    let res = skin
                    if (atlas != null) {
                        res = atlas
                    }
                    if (proxy) {
                        image.url = proxy
                    }

                    Log.info('imageProxy start load %s ', res)

                    ResourceManager.Instance.loadRes(res)
                        .then((v) => {
                            image.url = skin
                            image.alpha = 0.1
                            TweenUtils.get(image).to({ alpha: 1.0 }, 0.3)
                            Log.info('imageProxy start load done %s ', res)
                        })
                        .catch((e) => Log.error(e))
                }
            })
        }
    }

    /**
     * 保存加载过的url
     */
    class ResInfo extends EventDispatcher {
        public pkg: string
        public url: string
        public type: typeof cc.Asset

        constructor(url: string, type: typeof cc.Asset, pkg: string) {
            super()
            this.url = url

            this.type = type
            this.pkg = pkg
        }

        public incRef(): void {
            let asset = cc.resources.get(this.url)
            if (asset) {
                let fguiAsset: cc.Asset = null
                if (this.pkg != null && this.type != FGUIAsset) {
                    fguiAsset = ResourceManager.Instance.getFGUIAsset(this.pkg)
                }

                asset.addRef()
                fguiAsset && fguiAsset.addRef()
            }
        }
        public decRef(): void {
            let assert = cc.resources.get(this.url)
            if (assert) {
                let fguiAsset: cc.Asset = null
                if (this.pkg != null && this.type != FGUIAsset) {
                    fguiAsset = ResourceManager.Instance.getFGUIAsset(this.pkg)
                }

                assert.decRef()
                fguiAsset && fguiAsset.decRef()

                if (assert.refCount == 0) {
                    if (this.type == FGUIAsset) {
                        fgui.UIPackage.removePackage(this.url)
                        console.log('remove fgui package:', this.url)
                    } else if (this.pkg != null && fguiAsset.refCount == 0) {
                        let url = ResourceManager.Instance.getFGUIPackageURL(this.pkg)
                        fgui.UIPackage.removePackage(url)
                        ResourceManager.Instance.releaseRes(url)
                        console.log('remove fgui package:', url)
                    }
                    ResourceManager.Instance.releaseRes(this.url)
                }
            }
        }
    }
}
