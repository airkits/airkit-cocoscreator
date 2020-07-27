namespace airkit {
    /**数组排序方式*/
    export enum eArraySortOrder {
        ASCENDING, //升序
        DESCENDING, //降序
    }

    /**
     * 数组工具类
     * @author ankye
     * @time 2018-7-6
     */

    export class ArrayUtils {
        /** 插入元素
         * @param arr 需要操作的数组
         * @param value 需要插入的元素
         * @param index 插入位置
         */
        public static insert(arr: any[], value: any, index: number): void {
            if (index > arr.length - 1) {
                arr.push(value);
            } else {
                arr.splice(index, 0, value);
            }
        }

        /**
         * Checks if the given argument is a Array.
         * @function
         */
        public static isArray(obj: any): boolean {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }

        public static equip(arr: any[], v: any[]): boolean {
            // if the other array is a falsy value, return
            if (!arr || !v) return false;
            // compare lengths - can save a lot of time
            if (arr.length != v.length) return false;
            for (var i = 0, l = arr.length; i < l; i++) {
                // Check if we have nested arrays
                if (arr[i] instanceof Array && v[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!arr[i].equals(v[i])) return false;
                } else if (arr[i] != v[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        }
        /**从数组移除元素*/
        public static removeValue(arr: any[], v: any): void {
            if (Array.isArray(v)) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (this.equip(arr[i], v)) {
                        arr.splice(i, 1);
                    }
                }
            } else {
                let i: number = arr.indexOf(v);
                if (i != -1) {
                    arr.splice(i, 1);
                }
            }
        }
        /**移除所有值等于v的元素*/
        public static removeAllValue(arr: any[], v: any): void {
            let i: number = arr.indexOf(v);
            while (i >= 0) {
                arr.splice(i, 1);
                i = arr.indexOf(v);
            }
        }

        /**包含元素*/
        public static containsValue(arr: any[], v: any): boolean {
            return arr.length > 0 ? arr.indexOf(v) != -1 : false;
        }

        /**复制*/
        public static copy(arr: any[]): any[] {
            // return arr.slice()
            return JSON.parse(JSON.stringify(arr));
        }
        /**
         * 排序
         * @param arr 需要排序的数组
         * @param key 排序字段
         * @param order 排序方式
         */
        public static sort(arr: any[], key: string, order: eArraySortOrder = eArraySortOrder.DESCENDING): void {
            if (arr == null) return;
            arr.sort(function (info1, info2) {
                switch (order) {
                    case eArraySortOrder.ASCENDING: {
                        if (info1[key] < info2[key]) return -1;
                        if (info1[key] > info2[key]) return 1;
                        else return 0;
                    }
                    case eArraySortOrder.DESCENDING: {
                        if (info1[key] > info2[key]) return -1;
                        if (info1[key] < info2[key]) return 1;
                        else return 0;
                    }
                }
            });
        }
        /**清空数组*/
        public static clear(arr: any[]): void {
            let i: number = 0;
            let len: number = arr.length;
            for (i = 0; i < len; ++i) {
                arr[i] = null;
            }
            arr.splice(0);
        }
        /**数据是否为空*/
        public static isEmpty(arr: any[]): Boolean {
            if (arr == null || arr.length == 0) {
                return true;
            }
            return false;
        }
    }
}
