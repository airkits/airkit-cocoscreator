/**
 * 队列：先入先出
 * @author ankye
 * @time 2018-7-6
 */
namespace airkit {
    export class Queue<T> {
        private _list: Array<T> = []

        /**添加到队列尾*/
        public enqueue(item: T): void {
            this._list.push(item)
        }
        /**获取队列头，并删除*/
        public dequeue(): T {
            return this._list.shift()
        }
        /**获取队列头，并不删除*/
        public peek(): T {
            if (this._list.length == 0) return null
            return this._list[0]
        }
        /**查询某个元素，并不删除*/
        public seek(index: number): T {
            if (this._list.length < index) return null
            return this._list[index]
        }
        /**转换成标准数组*/
        public toArray(): Array<T> {
            return this._list.slice(0, this._list.length)
        }
        /**是否包含指定元素*/
        public contains(item: T): boolean {
            return this._list.indexOf(item, 0) == -1 ? false : true
        }
        /**清空*/
        public clear(): void {
            this._list.length = 0
        }
        public get length(): number {
            return this._list.length
        }
        public foreach(compareFn: (a: T) => boolean): void {
            for (let item of this._list) {
                if (!compareFn.call(null, item)) break
            }
        }
    }
}
