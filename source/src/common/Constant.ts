namespace airkit {
  /**
   * 预留id=0，不显示加载界面
   */
  export const LOADVIEW_TYPE_NONE: number = 0;

  export enum eUIQueueType {
    POPUP = 1,
    ALERT = 2
  }

  export enum ePopupAnim {}
  export enum eCloseAnim {
    CLOSE_CENTER = 1
  }

  export enum eAligeType {
    NONE = 0,
    RIGHT,
    RIGHT_BOTTOM,
    BOTTOM,
    LEFT_BOTTOM,
    LEFT,
    LEFT_TOP,
    TOP,
    RIGHT_TOP,
    MID
  }

  /**
   * UI层级
   */
  export enum eUILayer {
    BG = 0, // 界面背景
    MAIN, //游戏层		游戏主内容
    GUI, //ui层		角色信息、快捷菜单、聊天等工具视图
    POPUP, //弹出层
    TOOLTIP, //提示层
    SYSTEM, //system层
    LOADING, //loading层
    TOP, // 最顶层
    MAX
  }

  export enum LogLevel {
    DEBUG = 7,
    INFO = 6,
    WARNING = 5,
    ERROR = 4,
    EXCEPTION = 3
  }

  export enum ePopupButton {
    Close = 0, //关闭按钮
    Cancel = 1, //取消按钮
    Ok = 2 //确定按钮
  }
}
