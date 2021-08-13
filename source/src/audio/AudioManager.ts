// // import { Singleton } from "../collection/Singleton";
// // import { SDictionary, NDictionary } from "../collection/Dictionary";
// // import { Timer } from "../timer/Timer";
// ///<reference path="../collection/Singleton.ts"/>

namespace airkit {
    /*
     * 声音管理
     */
    export class AudioManager extends Singleton {
        private _effectSwitch: boolean
        private _musicSwitch: boolean
        /**
         * 背景音乐id，唯一
         */
        private _musicID: number

        private _audioIDs: NDictionary<string>
        constructor() {
            super()
            this._audioIDs = new NDictionary<string>()
            this._musicID = -1
            this._effectSwitch = true
            this._musicSwitch = true
        }

        private static instance: AudioManager = null
        public static get Instance(): AudioManager {
            if (!this.instance) this.instance = new AudioManager()
            return this.instance
        }

        /**
         * 设置背景音乐开关，关闭(false)将关闭背景音乐
         *
         * @memberof SoundsManager
         */
        public set musicSwitch(v: boolean) {
            if (this._musicSwitch != v) {
                if (!v) {
                    this.stopMusic()
                }
                this._musicSwitch = v
            }
        }

        /**
         * 设置音效开关，关闭(false)将关闭所有的音效
         *
         * @memberof SoundsManager
         */
        public set effectSwitch(v: boolean) {
            if (this._effectSwitch != v) {
                if (!v) {
                    this.stopAllEffect()
                }
                this._effectSwitch = v
            }
        }
        /**
         * 播放背景音乐
         * @param url
         * @param loopCount default -1 = loop for ever,
         * @param complete
         * @param startTime 设置开始秒
         */
        public playMusic(url: string, loopCount: number = -1, complete: Handler = null, startTime: number = 0): void {
            if (!this._musicSwitch) return
            this.getAudioClip(url).then((clip: cc.AudioClip) => {
                if (clip) {
                    let loop = false
                    if (loopCount == -1) {
                        loop = true
                    }
                    let audioID = cc.audioEngine.playMusic(clip, loop)
                    this._musicID = audioID
                    cc.audioEngine.setCurrentTime(audioID, startTime)
                    cc.audioEngine.setFinishCallback(audioID, () => {
                        complete.runWith(audioID)
                        this._musicID = audioID
                    })
                }
            })
        }

        public getAudioClip(url: string): Promise<cc.AudioClip> {
            let clip = ResourceManager.Instance.getRes(url)
            if (!clip) {
                return ResourceManager.Instance.loadRes(url, cc.AudioClip).then((v) => {
                    return ResourceManager.Instance.getRes(url)
                })
            } else {
                return Promise.resolve(clip)
            }
        }
        /**
         * 播放音效
         * @param url
         * @param loopCount default -1 = loop for ever,
         * @param complete
         * @param startTime
         */
        public playEffect(url: string, loopCount: number = 1, complete: Handler = null, startTime: number = 0): void {
            if (!this._effectSwitch) return
            this.getAudioClip(url).then((clip: cc.AudioClip) => {
                if (clip) {
                    let loop = false
                    if (loopCount == -1) {
                        loop = true
                    }
                    let audioID = cc.audioEngine.playEffect(clip, loop)
                    this._audioIDs.add(audioID, url)
                    cc.audioEngine.setCurrentTime(audioID, startTime)
                    cc.audioEngine.setFinishCallback(audioID, () => {
                        complete.runWith(audioID)
                        this._audioIDs.remove(audioID)
                    })
                }
            })
        }
        /**
         * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
         * @param volume
         */
        public setMusicVolume(volume: number): void {
            cc.audioEngine.setMusicVolume(volume)
        }
        /**
         * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
         * @param volume
         * @param url
         */
        public setEffectVolume(volume: number, url: string = null): void {
            if (url != null) {
                this._audioIDs.foreach((k: number, v: string) => {
                    if (v == url) {
                        cc.audioEngine.setVolume(k, volume)
                    }
                    return true
                })
            } else {
                cc.audioEngine.setEffectsVolume(volume)
            }
        }
        /**
         * 停止所有音乐
         */
        public stopAll(): void {
            cc.audioEngine.stopAll()
            this._musicID = -1
            this._audioIDs.clear()
        }
        /**
         * 停止播放所有音效（不包括背景音乐）
         */
        public stopAllEffect(): void {
            this._audioIDs.foreach((k: number, v: string) => {
                cc.audioEngine.stopEffect(k)
                return true
            })
            this._audioIDs.clear()
        }

        /**
         * 停止播放背景音乐
         */
        public stopMusic(): void {
            cc.audioEngine.stopMusic()
            this._musicID = -1
        }

        /**
         * 暂停背景音乐
         */
        public pauseMusic(): void {
            cc.audioEngine.pauseMusic()
        }
        /**
         * 暂停播放音效
         * @param url
         */
        public pauseEffect(url: string = null): void {
            if (url == null) {
                cc.audioEngine.pauseAllEffects()
            } else {
                this._audioIDs.foreach((k: number, v: string) => {
                    if (v == url) {
                        cc.audioEngine.pause(k)
                    }
                    return true
                })
            }
        }
        /**
         * 暂停所有的
         */
        public pauseAll(): void {
            cc.audioEngine.pauseAll()
        }
        /**
         * 恢复背景音乐
         */
        public resumeMusic(): void {
            cc.audioEngine.resumeMusic()
        }
        /**
         * 恢复音效
         * @param url
         */
        public resumeEffect(url: string): void {
            if (url == null) {
                cc.audioEngine.resumeAllEffects()
            } else {
                this._audioIDs.foreach((k: number, v: string) => {
                    if (v == url) {
                        cc.audioEngine.resume(k)
                    }
                    return true
                })
            }
        }
        /**
         * 恢复所有的音乐和音效
         */
        public resumeAll(): void {
            cc.audioEngine.resumeAll()
        }
    }
}
