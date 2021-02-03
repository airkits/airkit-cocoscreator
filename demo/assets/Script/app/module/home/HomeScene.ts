import { eLoaderType } from "../system/loader/LoaderType";
import { API } from '../../manager/API';
import M from '../M';
import { SpineView, createSpine } from './SpineView';



/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class HomeScene extends airkit.BaseView {

    public pkgName: string = "Common"
    public resName: string = "Main"
    // public map: GameMap
    private list: fgui.GList
    private listArray: Array<any>;
    private _sp: SpineView;
    private _magicBg: airkit.ColorView;

    constructor() {
        super()
    }

    onEnter(): void {
        airkit.Log.info("tower scene onEnter")
        this.createPanel(this.pkgName, this.resName)
        let btn = this.getGObject("btnStart").asButton
        btn.onClick(this, this.onStart)

        btn = this.getGObject("btnAdd").asButton
        btn.onClick(this, this.onAdd)
        btn = this.getGObject("btnSub").asButton
        btn.onClick(this, this.onSub)

        btn = this.getGObject("btnBg").asButton
        btn.onClick(this, this.onBg)

        btn = this.getGObject("btnMagic").asButton
        btn.onClick(this, this.onMagic)

        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(100, 650);
            sp.armature.showSkinByIndex(1);
            sp.play("a1", 0);
        })
        createSpine('res/spine.d/shuipao/shuipao.sk', "shuidi", false).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(200, 500);
            sp.play("shuidi", 0);
        })

        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(300, 650);
            sp.armature.showSkinByIndex(1);
            sp.play("a2", 0);
        })
        createSpine('res/spine.d/shuipao/shuipao.sk', "shuidi", false).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(400, 500);
            sp.play("shuidi", 0);
        })

        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(500, 650);
            sp.armature.showSkinByIndex(1);
            sp.play("a3", 0);
        })
        createSpine('res/spine.d/shuipao/shuipao.sk', "shuidi", false).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(600, 500);
            sp.play("shuidi", 0);
        })

        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(200, 800);
            sp.armature.showSkinByIndex(2);
            sp.play("a4", 0);
        })

        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(400, 800);
            sp.armature.showSkinByIndex(2);
            sp.play("a5", 0);
        })

        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(600, 800);
            sp.armature.showSkinByIndex(2);
            sp.play("a6", 0);
            this._sp = sp;
        })

        let magicbg = new airkit.ColorView();
        magicbg.setup();
        this.addChildAt(magicbg, 0);
        this._magicBg = magicbg;
        // magicbg.debug();
    }
    onBg(): void {
        let com = airkit.LayerManager.bgCom;
        if (com) {
            com.getController("ctrl").selectedIndex = airkit.MathUtils.randRange_Int(0, 4);
        }
    }
    onAdd(): void {
        if (this._sp) return;
        createSpine('res/spine.d/go/go_a.sk', "a1", false, { armatureType: 1 }).then(sp => {
            this.displayObject.addChild(sp);
            sp.pos(600, 800);
            sp.armature.showSkinByIndex(2);
            sp.play("a6", 0);
            this._sp = sp;
        })
    }
    onMagic(): void {
        this._magicBg.visible = !this._magicBg.visible;
    }
    onSub(): void {
        if (!this._sp) return;
        this._sp.removeSelf();
        this._sp.destroy();
        this._sp = null;
    }
    onStart(): void {
        M.battle().then(v => {
            v.enterScene()
        })
    }

    public res(): Array<[string, string]> {
        let list: Array<[string, string]> = [
            ["wxlocal/Loader_atlas_zjvp2c.png", Laya.Loader.IMAGE],
            ["res/ui/Common_atlas0.png", Laya.Loader.IMAGE],
            ["res/ui/Common.bin", Laya.Loader.BUFFER],

        ]

        return list
    }
    public loaderType(): number {
        return eLoaderType.FULLSCREEN
    }
    public loaderTips(): string {
        return "资源加载"
    }
    protected eventMap(): Array<any> {
        return [

        ]
    }

    public onDestroy(): void {
        airkit.DisplayUtils.removeAllChild(this)
        super.onDestroy()

    }



    onDisable(): void {
        airkit.Log.info("tower scene onDisable")

    }

    public update(dt: number): boolean {

        if (this._magicBg) {
            this._magicBg.update(dt);
        }
        return super.update(dt)
    }
    public resizeMap(): void {


        // if (this.map) {
        //     this.map.setXY((this.width - this.map.width) / 2.0, 200)
        // }
    }


    public resize(): void {
        this.resizeMap()

        this._view.setSize(this.width, this.height)
    }

}
