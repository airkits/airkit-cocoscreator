/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:02:28
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/event/EventID.ts
 */
namespace airkit {
    export class Event {
        public static PROGRESS: string = 'progress'
        public static COMPLETE: string = 'complete'
        public static ERROR: string = 'error'
    }
    export class EventID {
        //～～～～～～～～～～～～～～～～～～～～～～～场景~～～～～～～～～～～～～～～～～～～～～～～～//
        //游戏
        public static BEGIN_GAME: string = 'BEGIN_GAME'
        public static RESTART_GAEM: string = 'RESTART_GAME'
        //暂停游戏-主界面暂停按钮
        public static STOP_GAME: string = 'STOP_GAME'
        public static PAUSE_GAME: string = 'PAUSE_GAME'

        public static ON_SHOW: string = 'ON_SHOW'
        public static ON_HIDE: string = 'ON_HIDE'
        //切换场景
        public static CHANGE_SCENE: string = 'CHANGE_SCENE'
        public static RESIZE: string = 'RESIZE'
        //模块管理事件
        public static BEGIN_MODULE: string = 'BEGIN_MODULE'
        public static END_MODULE: string = 'END_MODULE'
        public static ENTER_MODULE: string = 'ENTER_MODULE'
        public static EXIT_MODULE: string = 'EXIT_MODULE'

        public static UI_OPEN: string = 'UI_OPEN' //界面打开
        public static UI_CLOSE: string = 'UI_CLOSE' //界面关闭
        public static UI_LANG: string = 'UI_LANG' //语言设置改变
    }

    export class LoaderEventID {
        //加载事件
        public static RESOURCE_LOAD_COMPLATE: string = 'RESOURCE_LOAD_COMPLATE' //资源加载完成
        public static RESOURCE_LOAD_PROGRESS: string = 'RESOURCE_LOAD_PROGRESS' //资源加载进度
        public static RESOURCE_LOAD_FAILED: string = 'RESOURCE_LOAD_FAILED' //资源加载失败

        //加载界面事件
        public static LOADVIEW_OPEN: string = 'LOADVIEW_OPEN' //加载界面打开
        public static LOADVIEW_COMPLATE: string = 'LOADVIEW_COMPLATE' //加载进度完成
        public static LOADVIEW_PROGRESS: string = 'LOADVIEW_PROGRESS' //加载进度
    }
}
