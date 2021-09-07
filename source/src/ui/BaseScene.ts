/// <reference path="./BaseView.ts" />

namespace airkit {
    export class BaseScene extends BaseView {
        public setup(args: { [key: string]: unknown }): void {
            super.setup(args)
            console.log('初始化', this.UIID)
        }
        public onEnable(): void {
            super.onEnable()
            console.log('进入场景', this.UIID)
        }
        public onDisable(): void {
            super.onDisable()
            console.log('退出场景', this.UIID)
        }
    }
}
