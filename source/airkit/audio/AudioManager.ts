// import { Singleton } from "../collection/Singleton";
// import { SDictionary, NDictionary } from "../collection/Dictionary";
// import { Timer } from "../timer/Timer";
///<reference path="../collection/Singleton.ts"/>

namespace airkit {
  /*
   * 声音管理
   */
  export class AudioManager extends Singleton {
    //{
    //     0:{id:0, "url": "res/sound/bgm.mp3", "desc": "游戏背景" }
    // }
    private musicsConfig: NDictionary<{
      id: number;
      url: string;
      desc: string;
    }>;
    // {
    //    0: {id:0, "url": "res/sound/click.mp3", "desc": "点击音效" },
    // }
    private effectConfig: NDictionary<{
      id: number;
      url: string;
      desc: string;
    }>;

    private effectChannelDic: SDictionary<Laya.SoundChannel>;
    private effectChannelNumDic: SDictionary<number>;
    private _effectSwitch: boolean;
    private _musicSwitch: boolean;

    constructor() {
      super();
      this.effectChannelDic = new SDictionary<Laya.SoundChannel>();
      this.effectChannelNumDic = new SDictionary<number>();
      this._effectSwitch = true;
      this._musicSwitch = true;
      Laya.SoundManager.useAudioMusic = false;
      Laya.SoundManager.autoReleaseSound = false;
    }

    private static instance: AudioManager = null;
    public static get Instance(): AudioManager {
      if (!this.instance) this.instance = new AudioManager();
      return this.instance;
    }

    public registerMusic(obj: { id: number; url: string; desc: string }): void {
      if (this.musicsConfig == null) {
        this.musicsConfig = new NDictionary<{
          id: number;
          url: string;
          desc: string;
        }>();
      }
      this.musicsConfig.add(obj.id, obj);
    }
    public registerEffect(obj: {
      id: number;
      url: string;
      desc: string;
    }): void {
      if (this.effectConfig == null) {
        this.effectConfig = new NDictionary<{
          id: number;
          url: string;
          desc: string;
        }>();
      }
      this.setEffectVolume(0.3, obj.url);
      this.effectConfig.add(obj.id, obj);
    }
    /**
     * 设置背景音乐开关，关闭(false)将关闭背景音乐
     *
     * @memberof SoundsManager
     */
    public set musicSwitch(v: boolean) {
      if (this._musicSwitch != v) {
        if (!v) {
          this.stopMusic();
        }
        this._musicSwitch = v;
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
          this.stopAllEffect();
        }
        this._effectSwitch = v;
      }
    }
    /**
     * 播放背景音乐
     * @param url
     * @param loops
     * @param complete
     * @param startTime
     */
    public playMusic(
      url: string,
      loops: number = 0,
      complete: Laya.Handler = null,
      startTime: number = 0
    ): void {
      if (!this._musicSwitch) return;

      Laya.SoundManager.playMusic(url, loops, complete, startTime);
      Laya.SoundManager.setMusicVolume(0.5);
    }
    /**
     * 播放音效
     * @param url
     * @param loops
     * @param complete
     * @param soundClass
     * @param startTime
     */
    public playEffect(
      url: string,
      loops: number = 1,
      complete: Laya.Handler = null,
      soundClass: any = null,
      startTime: number = 0
    ): void {
      if (!this._effectSwitch) return;
      let num = this.effectChannelNumDic.getValue(url);
      if (num == null) {
        this.effectChannelNumDic.add(url, 1);
      } else {
        this.effectChannelNumDic.set(url, num + 1);
      }

      var soundChannel: Laya.SoundChannel = this.effectChannelDic.getValue(url);
      if (soundChannel) {
        // soundChannel.stop()
        // this.removeChannel(url, soundChannel)
        return;
      }
      num = this.effectChannelNumDic.getValue(url);
      this.effectChannelNumDic.remove(url);
      // if (num > 3) num = 3
      let scale = Timer.timeScale;
      if (scale > 1.5) scale = 1.5;
      Laya.SoundManager.playbackRate = scale;
      this.effectChannelDic.add(
        url,
        Laya.SoundManager.playSound(
          url,
          num,
          Laya.Handler.create(null, () => {
            this.effectChannelDic.remove(url);
          }),
          soundClass,
          startTime
        )
      );

      Laya.SoundManager.setSoundVolume(0.5, url);
      //  Laya.SoundManager.playSound(url, loops, complete, soundClass, startTime)
    }
    /**
     * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
     * @param volume
     */
    public setMusicVolume(volume: number): void {
      Laya.SoundManager.setMusicVolume(volume);
    }
    /**
     * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
     * @param volume
     * @param url
     */
    public setEffectVolume(volume: number, url: string = null): void {
      Laya.SoundManager.setSoundVolume(volume, url);
    }
    /**
     * 停止所有音乐
     */
    public stopAll(): void {
      Laya.SoundManager.stopAll();
    }
    /**
     * 停止播放所有音效（不包括背景音乐）
     */
    public stopAllEffect(): void {
      // Laya.SoundManager.stopAllSound()
      this.effectChannelDic.foreach((url, channel) => {
        if (channel != null) channel.stop();
        this.removeChannel(url, channel);
        return true;
      });
      this.effectChannelNumDic.clear();
    }
    /**
     * 停止播放背景音乐
     */
    public stopMusic(): void {
      Laya.SoundManager.stopMusic();
    }
    /**
     * 移除播放的声音实例。
     * @param channel
     */
    public removeChannel(url: string, channel: Laya.SoundChannel): void {
      this.effectChannelDic.remove(url);
      Laya.SoundManager.removeChannel(channel);
    }

    /**播放背景音乐 */
    public playMusicByID(
      eId: number,
      loops: number = 0,
      complete: Laya.Handler = null,
      startTime: number = 0
    ): void {
      var config = this.musicsConfig.getValue(eId);
      this.playMusic(config.url, loops, complete, startTime);
    }
    /**播放音效 */
    public playEffectByID(
      eId: number,
      loops: number = 1,
      complete: Laya.Handler = null,
      startTime: number = 0
    ): void {
      var config = this.effectConfig.getValue(eId);
      this.playEffect(config.url, loops, complete, startTime);
    }
  }
}
