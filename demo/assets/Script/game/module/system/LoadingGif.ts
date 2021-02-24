import UIMaskBg2 from '../../gen/ui/Loader/UIMaskBg2';


/**
 * 加载菊花
 */

export class LoadingGif extends fgui.GComponent {
    
    private _tweenTime: number = 0.6
    private _isPlaying: boolean
    private _timeCount: number

    private timerID:number;

    private _imgs: Array<fgui.GComponent>
    private _r: number = 60
    public constructor() {
        super();
    }
    public onEnable():void {
        super.onEnable();
    
        this._imgs = []
        for (var i: number = 0; i < 8; i++) {
            var img: fgui.GImage = fgui.UIPackage.createObject("Loader", "symbol_loading").asImage
            img.x = -19.5
            img.y = -19.5
            var s: fgui.GComponent = new fgui.GComponent()
            s.addChild(img)
            switch (i) {
                case 0:
                    s.x = 0
                    s.y = -this._r
                    break

                case 1:
                    s.x = this._r * 0.7
                    s.y = -this._r * 0.7
                    break

                case 2:
                    s.x = this._r
                    s.y = 0
                    break

                case 3:
                    s.x = this._r * 0.7
                    s.y = this._r * 0.7
                    break

                case 4:
                    s.x = 0
                    s.y = this._r
                    break

                case 5:
                    s.x = -this._r * 0.7
                    s.y = this._r * 0.7
                    break

                case 6:
                    s.x = -this._r
                    s.y = 0
                    break

                case 7:
                    s.x = -this._r * 0.7
                    s.y = -this._r * 0.7
                    break

            }
            this._imgs.push(s)
        }
        this.play();
    }

    public play(): void {
        this.visible = true

        if (this._isPlaying)
            return
        this._isPlaying = true
        this._timeCount = 0
        this.startTimer();
    }

    public startTimer():void {
        if(this.timerID && this.timerID >0){
            ak.TimerManager.Instance.removeTimer(this.timerID);
            this.timerID = 0;
        }
        this.timerID =  ak.TimerManager.Instance.addLoop(150,-1,this,this.onTimer)
        this.onTimer(null)
    }
    private onTimer(e: any): void {
        var s: fgui.GComponent = this._imgs[this._timeCount]
        if (!s.parent)
            this.addChild(s)
        s.alpha = 0
        s.scaleX = 0.01
        s.scaleY = 0.01
        
        ak.TweenUtils.get(s).to({alpha: 1, scaleX: 0.7, scaleY: 0.7 },this._tweenTime ,fgui.EaseType.CubicInOut,ak.Handler.create(this, this.step1, [s]))
        this._timeCount++
        if (this._timeCount >= 8)
            this._timeCount = 0
    }
  
    private step1(s: fgui.GComponent): void {
        ak.TweenUtils.get(s).to({ alpha: 0, scaleX: 0.01, scaleY: 0.01 },this._tweenTime , fgui.EaseType.CubicInOut)
    }

    public stop(): void {
        this.visible = false
        this._isPlaying = false
        for (var i: number = 0; i < this._imgs.length; i++) {
            if (this._imgs[i].parent)
                this.removeChild(this._imgs[i])
        }
        if(this.timerID){
            ak.TimerManager.Instance.removeTimer(this.timerID);
            this.timerID = 0;
        }
    }
}


