// import { TweenUtils } from "./TweenUtils";
// import { Log } from "../log/Log";
// import { IUIPanel } from "../scene/IUIPanel";
namespace airkit {
  export function displayWidth(): number {
    return cc.winSize.width;
  }
  export function displayHeight(): number {
    return cc.winSize.height;
  }

  /**
   * 显示对象
   * @author ankye
   * @time 2018-7-13
   */

  export class DisplayUtils {
    /**
     * 移除全部子对象
     */
    public static removeAllChild(container: fgui.GComponent): void {
      if (!container) return;
      if (container.numChildren <= 0) return;

      while (container.numChildren > 0) {
        let node = container.removeChildAt(0);
        if (node) {
          let cons = node["constructor"];
          if (cons["name"] == "Animation") {
            let ani: any = node;
            ani.clear();
            ani.destroy(true);
            ani = null;
          } else {
            node.removeFromParent();
            node.dispose();
          }
          cons = null;
        }
        node = null;
      }
    }

    // /**获得子节点*/
    // public static getChildByName(parent: laya.display.Node, name: string): laya.display.Node {
    // 	if (!parent) return null
    // 	if (parent.name === name) return parent
    // 	let child: laya.display.Node = null
    // 	let num: number = parent.numChildren
    // 	for (let i = 0; i < num; ++i) {
    // 		child = DisplayUtils.getChildByName(parent.getChildAt(i), name)
    // 		if (child) return child
    // 	}
    // 	return null
    // }

    /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～滤镜～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
    /**
     * 创建发光滤镜
     * @param	color	滤镜的颜色
     * @param	blur	边缘模糊的大小
     * @param	offX	X轴方向的偏移
     * @param	offY	Y轴方向的偏移
     */
    // public static getGlowFilter(color: string, blur?: number, offX?: number, offY?: number): Laya.GlowFilter[] {
    // 	let glow = new Laya.GlowFilter(color, blur, offX, offY)
    // 	return [glow]
    // }

    /**
     * 模糊滤镜
     * @param	strength	模糊滤镜的强度值
     */
    // public static getBlurFilter(strength?: number): Laya.BlurFilter[] {
    // 	let blur = new Laya.BlurFilter(strength)
    // 	return [blur]
    // }

    /**
     * 创建一个 <code>ColorFilter</code> 实例。
     * @param mat	（可选）由 20 个项目（排列成 4 x 5 矩阵）组成的数组，用于颜色转换。
     */
    // public static getColorFilter(mat?: Array<any>): Laya.ColorFilter[] {
    // 	let color = new Laya.ColorFilter(mat)
    // 	return [color]
    // }

    /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～UI组件～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/

    /**
     * 创建一个背景层
     */
    public static colorBG(color: cc.Color, w: number, h: number): fgui.GGraph {
      let bgSp = new fgui.GGraph();
      bgSp.drawRect(1, color, color);
      bgSp.setSize(w, h);
      bgSp.alpha = 0.7;

      return bgSp;
    }

    public static popupDown(
      panel: any,
      handler?: Handler,
      ignoreAnchor?: boolean
    ): void {
      panel.scale(0.8, 0.8);
      let x = displayWidth() >> 1;
      let y = displayHeight() >> 1;

      if (ignoreAnchor == null || !ignoreAnchor) {
        panel.anchorX = 0.5;
        panel.anchorY = 0.5;
      } else {
        x = panel.x;
        y = panel.y;
      }
      panel.pos(x, 0);

      let time = 500;
      TweenUtils.get(panel).to(
        { scaleX: 1, scaleY: 1, x: x, y: y },
        time,
        fgui.EaseType.BackOut,
        handler
      );

      if (panel.parent && panel.parent.bg) {
        panel.parent.bg.alpha = 0;
        TweenUtils.get(panel.parent.bg).to(
          { alpha: 1.0 },
          time,
          fgui.EaseType.QuadOut
        );
      }
    }

    public static popup(
      view: fgui.GComponent,
      handler?: Handler,
      ignoreAnchor?: boolean
    ): void {
      view.setScale(0.85, 0.85);
      let x = displayWidth() >> 1;
      let y = displayHeight() >> 1;

      if (ignoreAnchor == null || !ignoreAnchor) {
        view.setPivot(0.5, 0.5, true);
      } else {
        x = view.x;
        y = view.y;
      }
      view.setPosition(x, y);

      let time = 0.25;

      TweenUtils.get(view).to(
        { scaleX: 1, scaleY: 1 },
        time,
        fgui.EaseType.QuadOut,
        handler
      );
      if (view.parent && view.parent.getChild("bg")) {
        let bg = view.parent.getChild("bg");
        bg.alpha = 0;
        TweenUtils.get(bg).to({ alpha: 1.0 }, 0.25, fgui.EaseType.QuadOut);
      }
    }
    public static hide(panel: IUIPanel, handler?: Handler): void {
      // let time = 0.2;
      // let view = panel.panel();
      // let bg = panel.bg();
      // if (view == null) {
      //   if (handler) {
      //     handler.run();
      //   }
      // } else {
      //   TweenUtils.get(view).to(
      //     { scaleX: 0.5, scaleY: 0.5 },
      //     time,
      //     fgui.EaseType.BackIn,
      //     handler
      //   );
      //   if (bg) {
      //     TweenUtils.get(bg).to({ alpha: 0 }, 0.2, fgui.EaseType.QuadOut);
      //   }
      // }
    }

    // static createAsyncAnimation(ani: string, atlas: string): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let anim = new Laya.Animation();
    //         anim.loadAnimation(
    //             ani,
    //             Laya.Handler.create(null, (v) => {
    //                 resolve(anim);
    //             }),
    //             atlas
    //         );
    //     });
    // }

    /**
     * 创建骨骼
     * @param skUrl sk文件地址
     * @param aniMode type 0	动画模式，0:不支持换装,1,2支持换装
     */
    // static createSkeletonAni(skUrl: string, aniMode: number): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let templet = new Laya.Templet();
    //         templet.on(
    //             Laya.Event.COMPLETE,
    //             null,
    //             (t: Laya.Templet) => {
    //                 var skeleton: Laya.Skeleton = t.buildArmature(aniMode);
    //                 t.offAll();
    //                 resolve([t, skeleton]);
    //             },
    //             [templet]
    //         );
    //         templet.on(Laya.Event.ERROR, null, (e) => {
    //             reject(e);
    //         });
    //         templet.loadAni(skUrl);
    //     });
    // }
  }
}
