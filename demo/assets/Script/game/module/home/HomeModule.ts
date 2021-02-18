import { eSceneType } from "../../common/SceneType"


export default class HomeModule extends ak.BaseModule {
    
    public enter(): void {
        super.enter()
        ak.Log.info("Module home enter")
    }
    public enterScene(): void {
        ak.SceneManager.Instance.gotoScene(eSceneType.HOME)
     }
 
}
