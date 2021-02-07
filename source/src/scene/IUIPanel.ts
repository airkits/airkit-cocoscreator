/**
 * ui界面接口
 * @author ankye
 * @time 2018-7-19
 */
namespace airkit {
  export interface IUIPanel {
    /**打开*/
    setup(...args: any[]): void;
    /**关闭：如果是用UIManager打开的，则关闭一定要通过UIManager关闭*/
    dispose(): void;
    /**是否可见*/
    setVisible(bVisible: boolean): void;
    /**设置界面唯一id*/
    setUIID(id: number): void;
    update(dt: number): boolean;

    removeFromParent(): void;
  }
}
