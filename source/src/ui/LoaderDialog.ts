/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:52
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/ui/LoaderDialog.ts
 */
namespace airkit {
    export class LoaderDialog extends Dialog {
        public type: eLoaderType

        public setup(type: eLoaderType): void {
            this.modal = true
            this.sortingOrder = 1000 + this.type
            super.setup(type)
            this.type = type
            this.center()
        }

        /**
         * 打开
         */
        onOpen(total: number): void {}

        /**
         * 设置提示
         */
        setTips(s: string): void {}
        /**
         * 加载进度
         * @param 	cur		当前加载数量
         * @param	total	总共需要加载的数量
         */
        setProgress(cur: number, total: number): void {}
        /**
         * 关闭
         */
        onClose(): boolean {
            return super.onClose()
        }
    }
}
