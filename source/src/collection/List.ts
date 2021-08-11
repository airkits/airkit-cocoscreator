//import { Log } from "../log/Log";
namespace airkit {
    /**
     * 双向循环链表
     * 实际测试100000增加和删除，发现:
     * 1.如果是在开始位置插入和删除，比Array快；基数越大，差距越大
     * 2.中间位置插入和删除，比Array慢；基数越大，差距越大
     * 3.末端操作，效率差距不大
     * 4.耗时比较多的是GetNode函数
     * @author ankye
     * @time 2018-7-6
     */
    export class LinkList<T> {
        /**表头*/
        private _linkHead: any = null
        /**节点个数*/
        private _size: number = 0

        constructor() {
            this._linkHead = { Data: null, Prev: null, Next: null } //双向链表 表头为空
            this._linkHead.Prev = this._linkHead
            this._linkHead.Next = this._linkHead
            this._size = 0
        }
        /**在链表末尾添加*/
        public add(t: T): void {
            this.append(this._size, t)
        }
        /**将节点插入到第index位置之前*/
        public insert(index: number, t: T): void {
            if (this._size < 1 || index >= this._size) Log.exception('没有可插入的点或者索引溢出了')
            if (index == 0) this.append(this._size, t)
            else {
                let inode: any = this.getNode(index)
                let tnode: any = { Data: t, Prev: inode.Prev, Next: inode }
                inode.Prev.Next = tnode
                inode.Prev = tnode
                this._size++
            }
        }
        /**追加到index位置之后*/
        public append(index: number, t: T): void {
            let inode: any
            if (index == 0) inode = this._linkHead
            else {
                index = index - 1
                if (index < 0) Log.exception('位置不存在')
                inode = this.getNode(index)
            }
            let tnode: any = { Data: t, Prev: inode, Next: inode.Next }
            inode.Next.Prev = tnode
            inode.Next = tnode
            this._size++
        }
        /**
         * 删除节点，有效节点索引为[0,_size-1]
         */
        public del(index: number): void {
            let inode: any = this.getNode(index)
            inode.Prev.Next = inode.Next
            inode.Next.Prev = inode.Prev
            this._size--
        }
        public delFirst(): void {
            this.del(0)
        }
        public delLast(): void {
            this.del(this._size - 1)
        }
        public get(index: number): T {
            return this.getNode(index).Data
        }
        public getFirst(): T {
            return this.getNode(0).Data
        }
        public getLast(): T {
            return this.getNode(this._size - 1).Data
        }
        /**通过索引查找*/
        private getNode(index: number): any {
            if (index < 0 || index >= this._size) {
                Log.exception('索引溢出或者链表为空')
            }
            if (index < this._size / 2) {
                //正向查找
                let node: any = this._linkHead.Next
                for (let i = 0; i < index; i++) node = node.Next
                return node
            }
            //反向查找
            let rnode: any = this._linkHead.Prev
            let rindex = this._size - index - 1
            for (let i = 0; i < rindex; i++) rnode = rnode.Prev
            return rnode
        }
        /**
         * 遍历列表，执行回调函数；注意返回值为false时，中断遍历
         */
        public foreach(compareFn: (value: T) => boolean): void {
            let node: any = this._linkHead.Next
            if (!node) return

            do {
                if (!compareFn.call(null, node.Data)) break
                node = node.Next
            } while (node != this._linkHead)
        }
        public isEmpty(): boolean {
            return this._size == 0
        }
        public get length(): number {
            return this._size
        }
    }
}
