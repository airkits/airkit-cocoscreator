import { eDialogUIID } from '../../common/DialogType';
import { LK } from '../../gen/data/LK';
import M from '../../gen/M';
import UIAlertDlg from '../../gen/ui/Loader/UIAlertDlg';
import UILoginScene from '../../gen/ui/Loader/UILoginScene';
import { AlertDlg } from './AlertDlg';
import VideoSprite from '../../render/VideoSprite';
import BrightSaturaContrastAssembler from '../../render/BrightSaturaContrastAssembler';





/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class LoginScene extends UILoginScene{

    private videpPlayer : VideoSprite
    
    constructor() {
        super()
        
    }
	public static createInstance():LoginScene {
		return <LoginScene>(fgui.UIPackage.createObject(this.PkgName, this.ResName));
	}
    
    onEnable(): void {
        super.onEnable();
        airkit.Log.info("login scene onEnable");
        console.log(ak.L(LK.format_h_m_s,"2011","3",4));
        let node = new cc.Node();
        let vp = node.addComponent(VideoSprite);
        this.videpPlayer = vp;
        
        cc.loader.loadRes("material/BrightSaturaContrastAssembler", cc.Material, function(err, res) {
                var material = cc.MaterialVariant.create(res,vp);
                vp.setMaterial(0, material)
            })

        cc.loader.loadRes("ui/Loader_atlas_mdb81w", cc.Asset, function(err, v) {
         //let asset = <cc.Texture2D>cc.loader.getRes("ui/Loader_atlas_mdb81w")
           let tex = new cc.Texture2D(); 
           let width = 640;
           let height = 640;
           let data: any = new Uint8Array(width * height * 4);
            for(let i=0; i<width * height*4; i++) {
                data[i] = 255;
                // for(let j=0; j<640; j++) {
                //     data[i*2*4 + j*4+0] = 255;
                //     data[i*2*4 + j*4+1] = 255;
                //     data[i*2*4 + j*4+2] = 255;
                //     data[i*2*4 + j*4+3] = 255;
                // }
            }
           tex.initWithData(data,cc.Texture2D.PixelFormat.RGBA8888,width,height);
           tex.setWrapMode(cc.Texture2D.WrapMode.CLAMP_TO_EDGE,cc.Texture2D.WrapMode.CLAMP_TO_EDGE);
           vp.fillType = cc.Sprite.FillType.VERTICAL;
           tex.width = width;
           tex.height = height;
        //   let video = new gfx.Video();                                // 构造函数

        // video.init(cc.renderer.device, {                            // 初始化参数
        //     images: [],                                                         
        //     width: 256,                                                 
        //     height: 256,
        //     glFormat:6408,                                           
        //     wrapS: gfx.WRAP_CLAMP,                                              
        //     wrapT: gfx.WRAP_CLAMP,
        // });
        
        vp.setTexture(tex);
                 
    });
        this.node.addChild(node);
        node.setPosition(300,-700);
        // let scene = cc.director.getScene();
        // let comp = scene.getChildByName("girl2");
        
        // comp.parent = this.imgBg.node
        // comp.setPosition(300,500);
        // console.log(this);
       
      
    }
    //先加载资源
    public static res(): Array<ak.Res> {
        return ak.Utils.buildRes(UILoginScene.ResMap);
    }
   
    public static loaderType(): number {
        
       return ak.eLoaderType.FULL_SCREEN
    }
    public static loaderTips(): string {
        return "动画资源加载"
    }
    protected eventMap(): Array<any> {
        return [
          [this.btnStart,fgui.Event.CLICK,this.onBtnStart],
          [this.btnShowDlg,fgui.Event.CLICK,this.onBtnShowDlg],
        ]
  
    }
    protected signalMap():Array<any> {
        return [
           
        ]
    }
    public onBtnShowDlg():void {
       
        this.videpPlayer.setBuffer();
      // ak.UIManager.show(eDialogUIID.ALERT);
     //  ak.UIManager.show(eDialogUIID.ALERT);
    //   ak.UIManager.showQ(eDialogUIID.ALERT,{clickMaskClose:false}).then(v=>{
    //     if(v){  
    //         console.log("showQ dlg ="+v.viewID);
    //         v.wait().then(result=>{
    //             console.log("result wait ");
    //             console.log(result);
    //         });
    //     }
    //   });
    //    ak.UIManager.showQ(eDialogUIID.ALERT,{clickMaskClose:true}).then(v=>{
    //     if(v){  
    //         console.log("showQ dlg ="+v.viewID);
    //         v.wait().then(result=>{
    //             console.log("result wait ");
    //             console.log(result);
    //         });
    //     }
    // });
      //  ak.UIManager.popup(eDialogUIID.ALERT);
      //  ak.UIManager.popup(eDialogUIID.ALERT);
   //   ak.LoaderManager.Instance.show(ak.eLoaderType.CUSTOM_1)
    }
    public onBtnStart():void {
        console.log("start btn");
        M.home().then(v=>{
            v.enterScene();
        })
    }
    public onDestroy(): void {
        super.onDestroy()
    
        this.videpPlayer.destroy();
        this.videpPlayer = null;
        console.log("on destory");
    }



    onDisable(): void {
        super.onDisable();
        ak.Log.info("login scene onDisable")
      
    }

    public update(dt: number): boolean {

        return super.update(dt)
    }

    public resize(): void {

        this.setSize(this.width, this.height)
    }

}
