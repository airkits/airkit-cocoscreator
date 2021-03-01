
import BrightSaturaContrastAssembler from "./BrightSaturaContrastAssembler";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class VideoSprite extends cc.Sprite {
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

    onEnable(){
        super.onEnable();
        this.flushProperties();
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
