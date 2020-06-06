/**
 * 时间
 * @author ankye
 * @time 2018-7-3
 */
namespace airkit {
    export class Timer {
        private static _startTime: number = 0;
        public static Start() {
            this._startTime =cc.director.getScheduler().;
        }
        
        //两帧之间的时间间隔,单位毫秒
        public static get deltaTimeMS(): number {
            return cc.director.getDeltaTime();
        }
        /**固定两帧之间的时间间隔*/
        public static get fixedDeltaTime(): number {
            return 0;
        }

        /**游戏启动后，经过的帧数*/
        public static get frameCount(): number {
            return cc.director.getTotalFrames();
        }

        public static get timeScale(): number {
            return cc.director.getScheduler().getTimeScale();
        }
        public static set timeScale(scale: number) {
            cc.director.getScheduler().setTimeScale(scale);
        }
    }
}
