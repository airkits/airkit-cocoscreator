// import { SDictionary } from "../collection/Dictionary";
// import { Log } from "../log/Log";
namespace airkit {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */

    export class ZipUtils {
        public static unzip(ab: ArrayBuffer): Promise<any> {
            let resultDic = {}
            return ZipUtils.parseZip(ab).then((zip) => {
                let jszip = zip.jszip
                let filelist = zip.filelist
                let reqs = []
                if (jszip && filelist) {
                    for (let i = 0; i < filelist.length; i++) {
                        reqs.push(ZipUtils.parseZipFile(jszip, filelist[i]))
                    }
                    return Promise.all(reqs).then((results) => {
                        for (let i = 0; i < results.length; i++) {
                            if (results[i] && results[i][1] != null) {
                                resultDic[results[i][0]] = results[i][1]
                            } else {
                                Log.info('解析zip file:%s error', results[i][0])
                            }
                        }
                        reqs = null
                        results = null
                        return resultDic
                    })
                }
                zip = null
                jszip = null
                filelist = null
                return resultDic
            })
        }
        // public static unzip(ab: ArrayBuffer): Promise<any> {
        //     return new Promise((resolve, reject) => {
        //         let resultDic = {};
        //         ZipUtils.parseZip(ab)
        //             .then((zip) => {
        //                 let jszip = zip.jszip;
        //                 let filelist = zip.filelist;
        //                 if (jszip && filelist) {
        //                     let count = 0;
        //                     for (let i = 0; i < filelist.length; i++) {
        //                         ZipUtils.parseZipFile(jszip, filelist[i])
        //                             .then((content) => {
        //                                 count++;
        //                                 resultDic[filelist[i]] = content;
        //                                 if (count == filelist.length) {
        //                                     zip = null;
        //                                     jszip = null;
        //                                     filelist = null;
        //                                     resolve(resultDic);
        //                                 }
        //                             })
        //                             .catch((e) => {
        //                                 Log.error(e);
        //                                 reject(e);
        //                             });
        //                     }
        //                 }
        //             })
        //             .catch((e) => {
        //                 Log.error(e);
        //                 reject(e);
        //             });
        //     });
        // }
        public static parseZip(ab: ArrayBuffer): Promise<any> {
            let fileNameArr = new Array<string>()
            return JSZip.loadAsync(ab)
                .then((jszip) => {
                    for (var fileName in jszip.files) {
                        fileNameArr.push(fileName)
                    }
                    return {
                        jszip: jszip,
                        filelist: fileNameArr,
                    }
                })
                .catch((e) => {
                    Log.error(e)
                    return null
                })
        }
        public static parseZipFile(jszip: any, filename: string): Promise<[string, any]> {
            return jszip
                .file(filename)
                .async('text')
                .then((content) => {
                    return [filename, content]
                })
                .catch((e) => {
                    Log.error(e)
                    return [filename, null]
                })
        }
    }
}
