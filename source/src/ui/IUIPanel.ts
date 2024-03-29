/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:45
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/ui/IUIPanel.ts
 */
/**
 * ui界面接口
 * @author ankye
 * @time 2018-7-19
 */
namespace airkit {
    export interface ShowParams {
        pos?: Point //显示位置，默认center
        target?: fgui.GComponent //挂载点，默认GRoot,popup有效
        data?: any[] //传递参数
        single?: boolean //是否唯一实例，默认true
        clothOther?: boolean //是否关闭其他弹窗，默认false
        resolve?: any //promise回调,队列显示
        clickMaskClose?: boolean //点击空白处关闭，默认false
    }

    export interface IUIPanel {
        /**打开*/
        setup(...args: any[]): void
        /**关闭：如果是用UIManager打开的，则关闭一定要通过UIManager关闭*/
        dispose(): void
        /**是否可见*/
        setVisible(bVisible: boolean): void
        /**设置界面唯一id，在UIManager设置dialogName,ScemeManager设置scenename，其他地方不要再次设置*/
        UIID: string
        viewID: number
        update(dt: number): boolean
        removeFromParent(): void
        hideImmediately?(): void
        wait?(): Promise<DialogResultData>
    }
}
