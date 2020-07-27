namespace airkit {
  /**
   * 加载进度界面接口类
   * @author ankye
   * @time 2018-7-25
   */

  export interface ILoadingView {
    /**
     * 打开
     */
    onOpen(total: number): void;

    /**
     * 设置提示
     */
    setTips(s: string): void;
    /**
     * 加载进度
     * @param 	cur		当前加载数量
     * @param	total	总共需要加载的数量
     */
    setProgress(cur: number, total: number): void;
    /**
     * 关闭
     */
    onClose(): void;
  }
}
