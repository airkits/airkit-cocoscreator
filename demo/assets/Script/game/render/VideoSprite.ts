
import BrightSaturaContrastAssembler from "./BrightSaturaContrastAssembler";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class VideoSprite extends cc.Sprite {
    _videoPlayer: gfx.VideoPlayer;

    @property
    _brightness: number = 1.0;
    @property({ type: cc.Float, range: [0, 3], slide: true })
    set brightness(v) {
        this._brightness = v;
        this.flushProperties();
    }
    get brightness() {
        return this._brightness;
    }

    @property
    _saturation: number = 1.0;
    @property({ type: cc.Float, range: [0, 3], slide: true })
    set saturation(v) {
        this._saturation = v;
        this.flushProperties();
    }
    get saturation() {
        return this._saturation;
    }

    @property
    _constrast: number = 1.0;
    @property({ type: cc.Float, range: [0, 3], slide: true })
    set constrast(v) {
        this._constrast = v;
        this.flushProperties();
    }
    get constrast() {
        return this._constrast;
    }

    constructor() {
        super();
        
    }

    get videoPlayer(): gfx.VideoPlayer {
        if(!this._videoPlayer) {
            this._videoPlayer= new gfx.VideoPlayer();
            this._videoPlayer.init(cc.renderer.device);
        }
        return this._videoPlayer;
       
    }
    setTexture(v: cc.Texture2D) {
        this.spriteFrame = new cc.SpriteFrame(v);
        this.videoPlayer.setTargetNative(v.getImpl());
    }

    setBuffer():void {
        if(this.videoPlayer){
            this.videoPlayer.setBuffer();
        }
    }
    onEnable(){
        super.onEnable();
        this.flushProperties();
    }

    onDestroy() {
        super.onDestroy();
        this.videoPlayer.destory();
    }
    public flushProperties() {
        //@ts-ignore
        let assembler: BrightSaturaContrastAssembler = this._assembler;
        if (!assembler)
            return;

        assembler.brightness = this.brightness;
        assembler.constrast = this.constrast;
        assembler.saturation = this.saturation;
        this.setVertsDirty();
    }

    // // 使用cc.Sprite默认逻辑
    _resetAssembler() {
        let assembler = this._assembler = new BrightSaturaContrastAssembler();
        this.flushProperties();
        assembler.init(this);
        this._updateColor();
    }
}
