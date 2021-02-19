import { LoadingGif } from "./LoadingGif";

export class NetLoader2Dlg extends ak.LoaderDialog {
    public constructor() {
        super();
    }

    public createDlgView():fgui.GComponent {
        return new LoadingGif()
    }

    public get view(): LoadingGif {
        return <LoadingGif>this.contentPane
    }
    public setup(type:ak.eLoaderType): void {
        super.setup(type);
  
    }
    protected doHideAnimation(): void {
       
        fgui.GTween.to(1, 0, 0.3)
            .setTarget(this, this.alpha)
            .setEase(fgui.EaseType.SineOut)
            .onComplete(this.hideImmediately, this);
    }
   
    public onOpen(total: number): void {
        
        console.log("full screen onOpen")
    }
    public setTips(s: string): void{
       // this.view.tips.text = s;
    }
    public setProgress(cur: number, total: number): void{
        console.log("full screen setProgress")
    }
    public onClose(): boolean{
        return super.onClose();
    }
}
