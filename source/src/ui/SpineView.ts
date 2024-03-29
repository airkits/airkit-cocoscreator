/*
 * @Author: ankye
 * @Date: 2021-08-13 16:20:10
 * @LastEditTime: 2021-08-13 18:23:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /source/src/ui/SpineView.ts
 */
/// <reference path="./BaseView.ts" />

namespace airkit {
    export class SpineView extends BaseView {
        // 原始url
        private _source: string
        // 动画名
        private _animName: string
        // 播放速率
        private _animRate: number = 1
        // 循环次数
        private _loopCount: number = 0
        // 是否自动播放
        private _autoPlay: boolean = true
        // 是否已加载
        private _isLoaded: boolean = false
        // 完成回调
        private _completeHandler: Handler = null

        constructor() {
            super()
        }
        public set source(value: string) {
            if (this._source == value) return
            this._source = value
        }

        public loadSkeleton(source: string): Promise<boolean> {
            return new Promise<boolean>((resolve, reject) => {})
        }

        get isLoaded(): boolean {
            return this._isLoaded
        }

        get source(): string {
            return this._source ? this._source : ''
        }

        get animName(): string {
            return this._animName
        }

        set animName(value: string) {
            this._animName = value
        }

        get aniRate(): number {
            return this._animRate
        }

        set aniRate(value: number) {
            this._animRate = value
        }

        get loopCount(): number {
            return this._loopCount
        }

        set loopCount(value: number) {
            this._loopCount = value
        }

        get autoPlay(): boolean {
            return this._autoPlay
        }

        set autoPlay(value: boolean) {
            if (this._autoPlay == value) return
            this._autoPlay = value
            value && this._isLoaded && this.play(this._animName, this._loopCount, this._completeHandler)
        }

        public play(animName: string, loopCount: number, completeHandler: Handler): void {}
    }
}
