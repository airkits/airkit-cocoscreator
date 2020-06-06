// import { SDictionary } from "../collection/Dictionary";
// import { Log } from "../log/Log";
namespace airkit {
    /**
     * 工具类
     * @author ankye
     * @time 2018-7-11
     */

    export class ZipUtils {
        // public static async unzip(ab: ArrayBuffer): Promise<any> {
        //   let resultDic = {};
        //   let zip = await ZipUtils.parseZip(ab);
        //   let jszip = zip.jszip;
        //   let filelist = zip.filelist;
        //   if (jszip && filelist) {
        //     for (let i = 0; i < filelist.length; i++) {
        //       let content = await ZipUtils.parseZipFile(jszip, filelist[i]);
        //       resultDic[filelist[i]] = content;
        //     }
        //   }
        //   zip = null;
        //   jszip = null;
        //   filelist = null;
        //   return resultDic;
        // }
        public static unzip(ab: ArrayBuffer): Promise<any> {
            return new Promise((resolve, reject) => {
                let resultDic = {};
                ZipUtils.parseZip(ab)
                    .then((zip) => {
                        let jszip = zip.jszip;
                        let filelist = zip.filelist;
                        if (jszip && filelist) {
                            let count = 0;
                            for (let i = 0; i < filelist.length; i++) {
                                ZipUtils.parseZipFile(jszip, filelist[i])
                                    .then((content) => {
                                        count++;
                                        resultDic[filelist[i]] = content;
                                        if (count == filelist.length) {
                                            zip = null;
                                            jszip = null;
                                            filelist = null;
                                            resolve(resultDic);
                                        }
                                    })
                                    .catch((e) => {
                                        Log.error(e);
                                        reject(e);
                                    });
                            }
                        }
                    })
                    .catch((e) => {
                        Log.error(e);
                        reject(e);
                    });
            });
        }
        public static parseZip(ab: ArrayBuffer): Promise<any> {
            return new Promise((resolve, reject) => {
                let dic = new SDictionary<string>();
                let fileNameArr = new Array<string>();

                (window as any).JSZip.loadAsync(ab)
                    .then((jszip) => {
                        for (var fileName in jszip.files) {
                            fileNameArr.push(fileName);
                        }
                        resolve({
                            jszip: jszip,
                            filelist: fileNameArr,
                        });
                    })
                    .catch((e) => {
                        Log.error(e);
                    });
            });
        }
        public static parseZipFile(jszip: any, filename: string): Promise<any> {
            return new Promise((resolve, reject) => {
                jszip
                    .file(filename)
                    .async("text")
                    .then((content) => {
                        resolve(content);
                    })
                    .catch((e) => {
                        reject(e);
                        Log.error(e);
                    });
            });
        }
    }
}
