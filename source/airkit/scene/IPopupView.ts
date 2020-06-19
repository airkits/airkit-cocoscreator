// import { ePopupButton } from "../common/Constant";
namespace airkit {
  export interface IPopupDelegate {
    /** 
        所有按钮点击回调
        点击的按钮类型请参考枚举类型 AlertViewButtonIndex
    */
    onPopupClick(tag: string, btnType: ePopupButton): void;
  }
}
