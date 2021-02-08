// import { ResourceManager } from "../loader/ResourceManager";
// import { SDictionary } from "../collection/Dictionary";
// import { BaseModule } from "./BaseModule";
// import { Log } from "../log/Log";
// import { EventID } from "../event/EventID";

namespace airkit {
    export class Mediator {
        public static modules: SDictionary<BaseModule> = new SDictionary<BaseModule>();

        private static instance: Mediator = null;
        public static get Instance(): Mediator {
            if (!this.instance) this.instance = new Mediator();
            return this.instance;
        }

        public setup(): void {
            this.registerEvent();
        }

        /**
         * 注册模块
         * @param name
         * @param cls
         */
        public static register(name: string, cls: any): void {
            ClassUtils.regClass(name, cls);
        }
        //远程调用
        public static call(name: string, funcName?: string, ...args: any[]): Promise<any> {
            return new Promise((resolve, reject) => {
                let m = this.modules.getValue(name);
                if (m == null) {
                    m = ClassUtils.getInstance(name) as BaseModule;
                    let clas = ClassUtils.getClass(name);

                    if (m == null) {
                        Log.warning("Cant find module {0}", name);
                        reject("Cant find module" + name);
                    }

                    this.modules.add(name, m);
                    m.name = name;
                    this.loadResource(m, clas)
                        .then((v) => {
                            var onInitModuleOver: Function = () => {
                                m.enter();
                                if (funcName == null) {
                                    resolve(m);
                                } else {
                                    let result = this.callFunc(m, funcName, args);
                                    resolve(result);
                                }
                            };
                            m.once(EventID.BEGIN_MODULE, onInitModuleOver, null);
                            m.setup(null);
                        })
                        .catch((e) => {
                            Log.warning("Load module Resource Failed {0}", name);
                            reject("Load module Resource Failed " + name);
                        });
                } else {
                    if (funcName == null) {
                        resolve(m);
                    } else {
                        let result = this.callFunc(m, funcName, args);
                        resolve(result);
                    }
                }
            });
        }

        protected static callFunc(m: BaseModule, funcName: string, args: any[]): any {
            if (funcName == null) {
                return;
            }
            var func: Function = m[funcName];
            let result = null;
            if (func) {
                if (args) {
                    result = func.apply(m, args);
                } else {
                    result = func.apply(m);
                }
            } else {
                Log.error("cant find funcName {0} from Module:{1}", funcName, m.name);
            }
            return result;
        }

        /**处理需要提前加载的资源*/
        protected static loadResource(m: BaseModule, clas: any): Promise<any> {
            let assets = [];
            let res_map = clas.res();
            if (res_map && res_map.length > 0) {
                for (let i = 0; i < res_map.length; ++i) {
                    let res = res_map[i];
                    if (!ResourceManager.Instance.getRes(res[0])) {
                        assets.push({ url: res[0], type: res[1] ,refCount:res[2]});
                    }
                }
            }
            return new Promise((resolve, reject) => {
                if (assets.length > 0) {
                    let load_view = clas.loaderType();
                    let tips = clas.loaderTips();
                    ResourceManager.Instance.loadArrayRes(assets, load_view, tips, 1, true)
                        .then((v) => {
                            resolve(v);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                } else {
                    resolve([]);
                }
            });
        }

        public destroy(): void {
            this.unRegisterEvent();
            this.clear();
        }
        public clear(): void {
            if (Mediator.modules) {
                Mediator.modules.foreach((k, v) => {
                    v.exit();
                    v.dispose();
                    return true;
                });
                Mediator.modules.clear();
            }
        }
        public update(dt: number): void {
            Mediator.modules.foreach((k, v) => {
                v.update(dt);
                return true;
            });
        }

        private registerEvent(): void {}
        private unRegisterEvent(): void {}
    }
}
