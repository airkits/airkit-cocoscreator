// import { ISignal } from "../event/ISignal";
// import { EventID } from "../event/EventID";
// import { LOADVIEW_TYPE_NONE } from "../common/Constant";
namespace airkit {
    export class BaseModule extends cc.Node {
        public name: string;

        constructor() {
            super();
        }

        public setup(args: number): void {
            this.emit(EventID.BEGIN_MODULE, this.name);
            this.registerEvent();
        }

        public enter(): void {
            this.emit(EventID.ENTER_MODULE, this.name);
        }

        public exit(): void {
            this.emit(EventID.EXIT_MODULE, this.name);
        }

        public update(dt: number): void {}

        protected registerEvent(): void {
            this.registerSignalEvent();
        }

        protected unRegisterEvent(): void {
            this.unregisterSignalEvent();
        }

        //需要提前加载的资源
        public static res(): Array<Res> {
            return null;
        }

        public static loaderTips(): string {
            return "资源加载中";
        }

        /**是否显示加载界面*/
        public static loaderType(): number {
            return  eLoaderType.NONE;
        }

        private registerSignalEvent(): void {
            let event_list: Array<any> = this.signalMap();
            if (!event_list) return;
            for (let item of event_list) {
                let signal = <ISignal>item[0];
                signal.on(item[1], item[2], item.slice(3));
            }
        }
        private unregisterSignalEvent(): void {
            let event_list: Array<any> = this.signalMap();
            if (!event_list) return;

            for (let item of event_list) {
                let signal = <ISignal>item[0];
                signal.off(item[1], item[2]);
            }
        }

        protected signalMap() {
            return null;
        }

        public dispose(): void {
            this.emit(EventID.END_MODULE, this.name);
            this.unRegisterEvent();
        }
    }
}
