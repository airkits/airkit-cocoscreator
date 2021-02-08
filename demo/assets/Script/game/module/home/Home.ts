import M from '../../gen/M';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
 
    onLoad() {
       
 
      
    }
    update(dt:number):void {
        ak.Framework.Instance.update(dt);
    }

    start() { }
}
