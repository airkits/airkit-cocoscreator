

export default class BattleModule extends airkit.BaseModule {

    constructor() {
        super()
    }

    public setup(args: number): void {
        super.setup(args)
    }

    public enter(): void {
        super.enter()
        airkit.Log.info("Module battle enter")
    }


    public enterScene(): void {
       // airkit.SceneManager.Instance.gotoScene(SceneID.LOGIN_SCENE)
    }


    public update(dt: number): void {
        super.update(dt)
    }


    public res(): Array<{ url: string; type: typeof cc.Asset }> {
        let assets = [

        ]
        return assets
    }

    public loaderTips(): string {
        return "美术资源加载中"
    }

    /**是否显示加载界面*/
    // public loaderType(): number {
    //     return eLoaderType.FULLSCREEN
    // }

    protected signalMap() {
        return null
    }


    public dispose(): void {
        super.dispose()
    }

}
