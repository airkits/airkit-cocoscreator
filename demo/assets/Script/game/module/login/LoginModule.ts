import { eSceneType } from "../../common/SceneType"
export default class LoginModule extends ak.BaseModule {
    public enter(): void {
        super.enter()
        ak.Log.info("Module login enter")
    }
 
    public enterScene(): void {
        ak.SceneManager.Instance.gotoScene(eSceneType.LOGIN)
     }
 
     
}
