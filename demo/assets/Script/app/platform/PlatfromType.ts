export enum ePlatform {
    LOCAL = 0, //本地开发
    WX = 1, //微信小游戏
    WEB = 2, //web h5
}

export enum ePlatfromADStatus {
    VIDEO_ERROR_NOT_READY = 1, //视频广告未授权开放
    VIDEO_ERROR_OVERTIME = 2, //今日广告用完
    VIDEO_ERROR_LOADED = 3, //加载失败，不用再试
    VIDEO_ERROR_TRY_AGAIN = 4, //加载失败,可重试
    VIDEO_ERROR_CLOSE = 5, //观看未完成
    VIDEO_FINISH = 6, //观看完成
    VIDEO_REUSE = 7, //重复播放
}
