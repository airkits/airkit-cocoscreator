
import Skeleton = Laya.Skeleton;
import Event = Laya.Event;

const ENABLE_CACHE: boolean = true;
/**
 * 缓存类，用于存放templet和引用计数
 */
class SK {
    private _templet: Laya.Templet;
    private _loaded: boolean;

    private _refCount: number = 0;
    constructor(templet: Laya.Templet) {
        this._templet = templet;
        this._loaded = false;
        this._refCount = 0
    }
    public set loaded(v: boolean) {
        this._loaded = v;
    }
    public get loaded(): boolean {
        return this._loaded;
    }
    public get templet(): Laya.Templet {
        return this._templet
    }
    public get refCount(): number {
        return this._refCount
    }
    public incRef(): number {
        return this._refCount++
    }
    public decRef(): number {
        this._refCount--
        return this._refCount
    }
    public release(): void {
        this._templet.offAll();
        this._templet.destroy();
        this._templet = null
        this._refCount = 0
    }
}

interface SDict<T> {
    [name: string]: T;
}
//缓存templet，优化加载速度，有缓存的情况下直接从缓存创建,通过引用计数来进行清理templet
class TempletCache {
    private static cache: SDict<SK> = {}
    public static hasTemplet(key: string): boolean {
        let sk = TempletCache.cache[key]
        if (sk == null) {
            return false
        }
        return true
    }
    public static borrowTemplet(key: string): Laya.Templet {
        let sk = null
        sk = TempletCache.cache[key];
        sk.incRef();
        return sk.templet
    }
    public static isTempletLoaded(key: string): boolean {
        let sk = TempletCache.cache[key];
        if (sk && sk.loaded) return true;
        return false;
    }
    public static setTempletLoaded(key: string) {
        let sk = TempletCache.cache[key];
        if (sk) {
            sk.loaded = true;
        }
    }
    public static setTemplet(key: string, templet: Laya.Templet) {
        let sk = new SK(templet)
        sk.incRef()
        TempletCache.cache[key] = sk
    }

    public static backTemplet(key: string): void {
        if (TempletCache.hasTemplet(key)) {
            let sk = TempletCache.cache[key];
            sk.decRef();
            if (sk.refCount <= 0 && sk.loaded) {
                TempletCache.cache[key] = null;
                sk.release();
            }
        }
    }
    public static releaseTemplet(key: string): void {
        if (TempletCache.hasTemplet(key)) {
            let sk = TempletCache.cache[key];
            if (sk.refCount <= 0) {
                TempletCache.cache[key] = null;
                sk.release();
            }
        }
    }
}

export class SpineView extends Laya.View {
    private static __options: any = { "isDebugEnabled": false };

    static debugLog(message?: any, ...optionalParams: any[]): void {
        (SpineView.__options["isDebugEnabled"])
            && (console.log(message, ...optionalParams));
    }

    public static LOADED: string = 'loaded';
    public static ERROR: string = "error";
    private _source: string;
    private _aniName: string;
    private _aniRate: number = 1;
    private _loopCount: number = 0;
    private _autoPlay: boolean = true;

    private _factory: Laya.Templet;
    private _armature: Skeleton;
    private _cb: any;
    private _isLoaded: boolean = false;//是否已加载
    private _armatureType: number = 0;

    set source(value: string) {
        if (this._source == value)
            return;

        this._source = value;
        if (this._factory) {
            this.cleanData();
        }

        if (value.indexOf('.sk') > 0) { //加载sk文件
            this._isLoaded = false;
            if (ENABLE_CACHE && TempletCache.hasTemplet(value)) {
                this._factory = TempletCache.borrowTemplet(value)
                if (TempletCache.isTempletLoaded(value)) {
                    this.parseComplete(null, true);
                } else {
                    this._factory.once(Event.COMPLETE, this, this.parseComplete);
                    this._factory.once(Event.ERROR, this, this.onError);
                }
            } else {
                let templet = new Laya.Templet();
                this._factory = templet;
                this._factory.once(Event.COMPLETE, this, this.parseComplete);
                this._factory.once(Event.ERROR, this, this.onError);
                if (ENABLE_CACHE) {
                    TempletCache.setTemplet(value, this._factory);
                }
                this._factory.loadAni(value);

            }

        }
        else { //如果不是sk文件，给出提示不加载
            //console.error('SpineView: animation must convert to sk file');
        }
    }

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    get source(): string {
        return this._source ? this._source : "";
    }

    get aniName(): string {
        return this._aniName;
    }

    set aniName(value: string) {
        this._aniName = value;
    }

    get aniRate(): number {
        return this._aniRate;
    }

    set aniRate(value: number) {
        this._aniRate = value;
    }

    get loopCount(): number {
        return this._loopCount;
    }

    set loopCount(value: number) {
        this._loopCount = value;
    }

    get autoPlay(): boolean {
        return this._autoPlay;
    }

    set autoPlay(value: boolean) {
        if (this._autoPlay == value) return;
        this._autoPlay = value;
        value && this._isLoaded && this.play();
    }

    get armature(): Skeleton {
        return this._armature;
    }

    set armature(v: Skeleton) {
        this._armature = v;
    }

    get armatureType(): number {
        return this._armatureType;
    }

    set armatureType(v: number) {
        this._armatureType = v;
    }

    private onError(): void {
        //console.error("SpineView: Load animation error." + this._source);
        this.event(SpineView.ERROR);
    }

    private parseComplete(content: Laya.Templet, useCache: boolean = false): void {
        if (ENABLE_CACHE) {
            if (TempletCache.hasTemplet(this._source)) {
                if (!useCache) {
                    if (content) {
                        TempletCache.setTempletLoaded(this._source);
                    } else {
                        //load failed
                        TempletCache.releaseTemplet(this._source);
                        return;
                    }
                }
            } else {
                //templet clear
                return;
            }
        } else {
            if (!content) {
                //load failed
                return;
            }
        }
        //创建模式为0 从动画模板创建动画播放对象
        this._armature = this._factory.buildArmature(this.armatureType);
        this._armature.x = (this.width - this._armature.width) / 2;
        this._armature.y = (this.height - this._armature.height) / 2;
        this.addChild(this._armature);
        this._autoPlay && this.play();
        this._isLoaded = true;
        this.event(SpineView.LOADED);
    }


    onClose() {
        if (this._armature) {
            this._armature.stop();
            this._armature.offAll();
            this._armature.removeSelf();
            this._armature.removeChildren();
            this._armature.destroy(true);
            this._armature = null;
        }
    }

    onStop() {
        if (this._cb) this._cb();
    }

    play(aniName?: string, loopCount?: number, cb?: () => void): void {
        if (!this._armature) {
            this.once(Laya.Event.LOADED, this, this.play, [aniName, loopCount, cb]);
            return
        };
        if (cb) {
            this._cb = cb;
            this._armature.once(Event.STOPPED, this, this.onStop);
        }
        if (!this._armature) {
            return;
        }

        if (loopCount != null)
            this.loopCount = loopCount;

        if (aniName) {
            this._armature.play(aniName, this.loopCount === 0);
            this._armature.playbackRate(this.aniRate);
        } else if (this.aniName) {
            this._armature.play(this.aniName, this.loopCount === 0);
            this._armature.playbackRate(this.aniRate);
        } else {
            this._armature.play(0, this.loopCount === 0);
            this._armature.playbackRate(this.aniRate);
        }
    }


    stop(index: number = -1): void {
        if (this._armature) {
            if (index > -1) {
                this._armature.index = index;
            }
            this._armature.stop();
        }
    }

    destroy(destroyChild = true) {
        if (ENABLE_CACHE) {
            if (this._source.length > 0) {
                TempletCache.backTemplet(this.source)
            }
        }
        this.cleanData();
        super.destroy(destroyChild);
    }

    private cleanData() {

        if (this._armature) {
            this._armature.offAll();
            this._armature.stop();
            this._armature.removeSelf();
            this._armature.removeChildren();
            this._armature.destroy(true);
            this._armature = null;
        }
        if (ENABLE_CACHE === false) {
            if (this._factory) {
                this._factory.offAll();
                this._factory.destroy();
                this._factory = null;
            }
        }
        this._source = "";
    }
}


export function createSpine(
    source: string,
    name: string = 'animation',
    force: boolean = true,
    props: any = {},
): Promise<SpineView> {
    return new Promise(resolve => {
        let sp = new SpineView();
        sp.armatureType = props.armatureType || 0;

        sp.loopCount = 1;
        sp.mouseEnabled = false;

        sp.once(SpineView.LOADED, this, () => {
            sp.play(name, 1, () => {
                if (force) {
                    sp.removeSelf();
                    sp.destroy();
                }
            });
            resolve(sp);
        });
        sp.source = source;
    });

}
