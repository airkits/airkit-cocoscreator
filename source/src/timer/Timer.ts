/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:03:32
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/timer/Timer.ts
 */
/**
 * 时间
 * @author ankye
 * @time 2018-7-3
 */
namespace airkit {
    export class Timer {
        //两帧之间的时间间隔,单位毫秒
        public static get deltaTimeMS(): number {
            return cc.director.getDeltaTime() * 1000
        }
        /**游戏启动后，经过的帧数*/
        public static get frameCount(): number {
            return cc.director.getTotalFrames()
        }

        public static get timeScale(): number {
            return cc.director.getScheduler().getTimeScale()
        }
        public static set timeScale(scale: number) {
            cc.director.getScheduler().setTimeScale(scale)
        }
    }
}
