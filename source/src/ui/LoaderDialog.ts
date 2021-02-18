namespace airkit {
    export class LoaderDialog extends Dialog {
            public setup(args?:any): void {
                super.setup(args);
                this.center();
                this.modal = true;
                this.sortingOrder = 9999;
            }
            /**
             * 打开
             */
            onOpen(total: number): void{

            }

            /**
             * 设置提示
             */
            setTips(s: string): void{

            }
            /**
             * 加载进度
             * @param 	cur		当前加载数量
             * @param	total	总共需要加载的数量
             */
            setProgress(cur: number, total: number): void{

            }
            /**
             * 关闭
             */
            onClose(): boolean{
                return super.onClose();
            }
    }
}