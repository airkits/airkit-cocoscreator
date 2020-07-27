namespace airkit {
  /**
   * 栈：后入先出
   * @author ankye
   * @time 2018-7-6
   */
  export class Stack<T> {
    private _list: Array<T> = [];

    /**添加数据*/
    public push(item: T): void {
      this._list.push(item);
    }
    /**获取栈顶元素，并删除*/
    public pop(): T {
      return this._list.pop();
    }
    /**获取栈顶元素，并不删除*/
    public peek(): T {
      if (this._list.length == 0) return null;
      return this._list[this._list.length - 1];
    }
    /**转换成标准数组*/
    public toArray(): Array<T> {
      return this._list.slice(0, this._list.length);
    }
    /**是否包含指定元素*/
    public contains(item: T): boolean {
      return this._list.indexOf(item, 0) == -1 ? false : true;
    }
    /**清空*/
    public clear(): void {
      this._list.length = 0;
    }
    public get length(): number {
      return this._list.length;
    }
    public foreach(compareFn: (a: T) => boolean): void {
      for (let item of this._list) {
        if (!compareFn.call(null, item)) break;
      }
    }
  }
}
