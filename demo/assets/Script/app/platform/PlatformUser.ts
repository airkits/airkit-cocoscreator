module app.platform {
    export class PlatformUser {
        public openId: string;
        public avatarUrl: string;
        public nickname: string;
        public gender: number; //性别 0：未知、1：男、2：女
        public data: {}; //平台需要数据
        public authed:boolean; //是否认证

        constructor(name?:string,avatar?:string){
            this.openId = "";
            this.avatarUrl = avatar || "";
            this.nickname = name || "";
            this.gender = 0;
            this.authed = false;
            this.data = {}
        }
    }
}
