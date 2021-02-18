import { eSceneType } from "../../common/SceneType"


export default class BattleModule extends ak.BaseModule {
    
    public enter(): void {
        super.enter()
        ak.Log.info("Module battle enter")
    }
    public enterScene(): void {
        ak.SceneManager.Instance.gotoScene(eSceneType.BATTLE)
     }
 
     
}
