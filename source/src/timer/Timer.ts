/**
 * 时间
 * @author ankye
 * @time 2018-7-3
 */
namespace airkit {
    export class Timer {

        //两帧之间的时间间隔,单位毫秒
        public static get deltaTimeMS(): number {
            return cc.director.getDeltaTime();
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
