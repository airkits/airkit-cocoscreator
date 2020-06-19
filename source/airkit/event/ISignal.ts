namespace airkit {
  export interface ISignal {
    /**
     * 派发信号
     * @param arg
     */
    dispatch(arg: any);

    /**
     * 注册回调
     * @param caller
     * @param method
     * @param args
     */
    on(caller: any, method: (arg: any, ...args: any[]) => any, ...args: any[]);

    /**
     * 注册一次性回调
     * @param caller
     * @param method
     * @param args
     */
    once(
      caller: any,
      method: (arg: any, ...args: any[]) => any,
      ...args: any[]
    );

    /**
     * 取消回调
     * @param caller
     * @param method
     */
    off(caller: any, method: (arg: any, ...args: any[]) => any);

    destory();
  }
}
