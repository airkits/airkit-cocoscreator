/*
 * @Author: ankye
 * @since: 2021-08-11 14:42:41
 * @lastTime: 2021-08-11 16:01:45
 * @LastAuthor: ankye
 * @message:
 * @文件相对于项目的路径: /source/src/collection/Size.ts
 */
namespace airkit {
    /**
     * Size大小 宽高
     * @author ankye
     * @time 2018-7-3
     */
    export class Size {
        private _width: number
        private _height: number

        constructor(w: number = 0, h: number = 0) {
            this._width = w
            this._height = h
        }

        public set(w: number, h: number) {
            this._width = w
            this._height = h
        }

        public get width(): number {
            return this._width
        }

        public get height(): number {
            return this._height
        }
    }
}
