namespace airkit {

  export type Dict<T> = { [key: string]: T };

  export type Point = cc.Vec2;

  export enum eLoaderType {
      NONE = 0,
      VIEW = 1,
      FULL_SCREEN = 2,
      CUSTOM_1 = 3,
      CUSTOM_2 = 4,
      CUSTOM_3 = 5
  } 

  export enum eUIType {
    SHOW = 0,
    POPUP = 1
  }

  /**
   * UI层级
   */
  export enum eUILayer {
    BG = 0, // 界面背景
    MAIN, //游戏层		游戏主内容
    GUI, //ui层		角色信息、快捷菜单、聊天等工具视图
    //POPUP, //弹出层
    // TOOLTIP, //提示层
    // SYSTEM, //system层
     LOADING, //loading层
    TOP, // 最顶层
  //  MAX
  }

  export enum LogLevel {
    DEBUG = 7,
    INFO = 6,
    WARNING = 5,
    ERROR = 4,
    EXCEPTION = 3
  }

  export enum eDlgResult {
     YES = 1,
     NO = 2,  
  }
}
