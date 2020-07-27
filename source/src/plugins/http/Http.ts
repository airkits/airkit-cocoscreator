// import { Log } from "../../log/Log";
// import { Utils } from "../../utils/Utils";

namespace airkit {
    /**     HTTP 请求 wapper
     *      for example
     *	    Http.get("https://one.xxx.com/api/user.php?oid=112",null,null,RESPONSE_TYPE_JSON).then(function(data){
     *		    Log.info("Get :")
     *			Log.Dump(data)
     *		 }).catch(function(reason:any){
     *			Log.Dump(reason)
     *		 })
     *		var params = {}
     *		params["uuid"]= "1111111"
     *		params["oid"]="222222"
     *		params["secret"]="cccc"
     *		params["nickname"]="xxx"
     *		Http.post("https://one.xxx.com/api/login.php",params).then(function(data){
     *			Log.info("Post :")
     *			Log.Dump(data)
     *		}).catch(function(reason:any){
     *			Log.Dump(reason)
     *		})
     */
    export enum eHttpRequestType {
        TypeText,
        TypeJson,
        TypePB,
    }

    export const POST = "POST";
    export const GET = "GET";

    export const CONTENT_TYPE_TEXT = "application/x-www-form-urlencoded";
    export const CONTENT_TYPE_JSON = "application/json";
    export const CONTENT_TYPE_PB = "application/octet-stream"; // "application/x-protobuf"  //

    //responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
    export const RESPONSE_TYPE_TEXT = "text";
    export const RESPONSE_TYPE_JSON = "json";
    export const RESPONSE_TYPE_XML = "xml";
    export const RESPONSE_TYPE_BYTE = "arraybuffer";

    export const HTTP_REQUEST_TIMEOUT = 10000; //设置超时时间
    export class Http {
        public static currentRequsts: number = 0;
        public static maxRequest: number = 6;
        /**
         * 请求request封装
         *
         * @static
         * @param {string} url
         * @param {string} method
         * @param {eHttpRequestType} reqType
         * @param {any[]} header  (default = []) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         * @param {*} [data]
         * @param {string} [responseType]  responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @returns {Promise<any>}
         * @memberof Http
         */
        static request(url: string, method: string, reqType: eHttpRequestType, header: any[], data?: any, responseType?: string): Promise<any> {
            return new Promise((resolve, reject) => {
                if (Http.currentRequsts > Http.maxRequest) {
                    Log.error("reached max request {0}", Http.currentRequsts);
                }
                if (Http.currentRequsts < 0) Http.currentRequsts = 0;
                Http.currentRequsts++;
                if (responseType == undefined) {
                    responseType = "text";
                }
                if (method != POST && method != GET) {
                    Http.currentRequsts--;
                    reject("method error");
                }
                if (!header) header = [];
                let key = "Content-Type";
                switch (reqType) {
                    case eHttpRequestType.TypeText:
                        header.push(key, CONTENT_TYPE_TEXT);
                        break;
                    case eHttpRequestType.TypeJson:
                        header.push(key, CONTENT_TYPE_JSON);
                        break;
                    case eHttpRequestType.TypePB:
                        header.push(key, CONTENT_TYPE_PB);
                        break;
                    default:
                        header.push(key, CONTENT_TYPE_TEXT);
                }
                // header.push("Accept-Encoding","gzip, deflate, br")
                var request: HttpRequest = new HttpRequest();
                request.http.timeout = HTTP_REQUEST_TIMEOUT;
                request.http.ontimeout = function () {
                    Log.error("request timeout {0}", url);
                    request.targetOff(request);
                    Http.currentRequsts--;
                    reject("timeout");
                };
                request.once(Event.COMPLETE, this, function (event: Event): void {
                    let data: any;
                    switch (responseType) {
                        case RESPONSE_TYPE_TEXT:
                            data = request.data;
                            break;
                        case RESPONSE_TYPE_JSON:
                            //  data = JSON.parse(request.data)
                            data = request.data;
                            break;
                        case RESPONSE_TYPE_BYTE:
                            var bytes: Byte = new Byte(request.data);
                            bytes.endian = Byte.BIG_ENDIAN;
                            var body: Uint8Array = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos);
                            data = body;

                            break;
                        default:
                            data = request.data;
                    }
                    request.targetOff(request);
                    Http.currentRequsts--;
                    resolve(data);
                });
                request.once(Event.ERROR, this, function (event: Event): void {
                    Log.error("req:{0} error:{1}", url, event);
                    request.targetOff(request);

                    Http.currentRequsts--;
                    reject(event);
                });
                request.on(Event.PROGRESS, this, function (event: Event): void {});

                if (method == GET) {
                    request.send(url, null, method, responseType, header);
                } else {
                    request.send(url, data, method, responseType, header);
                }
            });
        }

        /**
         * Get 请求
         *
         * @static
         * @param {string} url
         * @param {eHttpRequestType} [reqType] (default = []) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
         * @param {*} [header]
         * @param {string} [responseType]  responseType  (default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         * @returns {Promise<any>}
         * @memberof Http
         */
        static get(url: string, reqType?: eHttpRequestType, header?: any, responseType?: string): Promise<any> {
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            if (responseType == undefined) {
                responseType = RESPONSE_TYPE_TEXT;
            }
            return this.request(url, GET, reqType, header, null, responseType);
        }

        /**
         * POST请求
         *
         * @static
         * @param {string} url
         * @param {*} params
         * @param {eHttpRequestType} [reqType]
         * @param {*} [header]
         * @param {string} [responseType]
         * @returns {Promise<any>}
         * @memberof Http
         */
        static post(url: string, params: any, reqType?: eHttpRequestType, header?: any, responseType?: string): Promise<any> {
            var data: any = null;
            if (reqType == undefined) {
                reqType = eHttpRequestType.TypeText;
            }
            switch (reqType) {
                case eHttpRequestType.TypeText:
                    if (params) data = Utils.obj2query(params);
                    break;
                case eHttpRequestType.TypeJson:
                    if (params) data = JSON.stringify(params);
                    break;
                case eHttpRequestType.TypePB:
                    if (params) data = params;
            }

            if (responseType == undefined) {
                responseType = RESPONSE_TYPE_TEXT;
            }

            return this.request(url, POST, reqType, header, data, responseType);
        }
    }
}
