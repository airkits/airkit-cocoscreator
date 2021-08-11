/**
 * 数学工具类
 * @author ankye
 * @time 2018-7-8
 * 坐标系：y轴向下，顺时针方向
 * 					|
 * 					|
 * 					|
 * -----------------|---------------->x
 *  				|
 * 					|
 * 					|
 * 					y
 */
namespace airkit {
    export enum OrbitType {
        Line = 3, //多点折线移动
        Curve = 2, //3个点或者4个点控制的贝塞尔曲线移动
    }
    export class MathUtils {
        /**字节转换M*/
        public static BYTE_TO_M: number = 1 / (1024 * 1024)
        /**字节转换K*/
        public static BYTE_TO_K: number = 1 / 1024

        public static Deg2Rad: number = 0.01745329
        public static Rad2Deg: number = 57.29578

        public static Cycle8Points: Array<[number, number]> = [
            [-200, 0],
            [-127, -74],
            [0, -100],
            [127, -74],
            [200, 0],
            [127, 74],
            [0, 100],
            [-127, 74],
        ]
        public static Cycle9Points: Array<[number, number]> = [
            [0, 0],
            [-200, 0],
            [-127, -74],
            [0, -100],
            [127, -74],
            [200, 0],
            [127, 74],
            [0, 100],
            [-127, 74],
        ]

        public static sign(n: number): number {
            n = +n
            if (n === 0 || isNaN(n)) {
                return n
            }
            return n > 0 ? 1 : -1
        }

        /**
         * 限制范围
         */
        public static clamp(n: number, min: number, max: number): number {
            if (min > max) {
                let i: number = min
                min = max
                max = i
            }
            return n < min ? min : n > max ? max : n
        }

        public static clamp01(value: number): number {
            if (value < 0) return 0
            if (value > 1) return 1
            return value
        }

        public static lerp(from: number, to: number, t: number): number {
            return from + (to - from) * MathUtils.clamp01(t)
        }

        public static lerpAngle(a: number, b: number, t: number): number {
            let num: number = MathUtils.repeat(b - a, 360)
            if (num > 180) num -= 360
            return a + num * MathUtils.clamp01(t)
        }

        public static repeat(t: number, length: number): number {
            return t - Math.floor(t / length) * length
        }

        /**
         * 产生随机数
         * 结果：x>=param1 && x<param2
         */
        public static randRange(param1: number, param2: number): number {
            let loc: number = Math.random() * (param2 - param1) + param1
            return loc
        }
        /**
         * 产生随机数
         * 结果：x>=param1 && x<=param2
         */
        public static randRange_Int(param1: number, param2: number): number {
            let loc: number = Math.random() * (param2 - param1 + 1) + param1
            return Math.floor(loc)
        }
        /**
         * 从数组中产生随机数[-1,1,2]
         * 结果：-1/1/2中的一个
         */
        public static randRange_Array<T>(arr: Array<T>): T {
            if (arr.length == 0) return null
            let loc: T = arr[MathUtils.randRange_Int(0, arr.length - 1)]
            return loc
        }
        /**
         * 转换为360度角度
         */
        public static clampDegrees(degrees: number): number {
            while (degrees < 0) degrees = degrees + 360
            while (degrees >= 360) degrees = degrees - 360
            return degrees
        }
        /**
         * 转换为360度弧度
         */
        public static clampRadians(radians: number): number {
            while (radians < 0) radians = radians + 2 * Math.PI
            while (radians >= 2 * Math.PI) radians = radians - 2 * Math.PI
            return radians
        }
        /**
         * 两点间的距离
         */
        public static getDistance(x1: number, y1: number, x2: number, y2: number): number {
            return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))
        }
        public static getSquareDistance(x1: number, y1: number, x2: number, y2: number): number {
            return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)
        }
        /**
         * 两点间的弧度：x正方形为0，Y轴向下,顺时针为正
         */
        public static getLineRadians(x1: number, y1: number, x2: number, y2: number): number {
            return Math.atan2(y2 - y1, x2 - x1)
        }
        public static getLineDegree(x1: number, y1: number, x2: number, y2: number): number {
            let degree: number = MathUtils.toDegree(MathUtils.getLineRadians(x1, y1, x2, y2))
            return MathUtils.clampDegrees(degree)
        }

        public static getPointRadians(x: number, y: number): number {
            return Math.atan2(y, x)
        }

        public static getPointDegree(x: number, y: number): number {
            let degree: number = MathUtils.toDegree(MathUtils.getPointRadians(x, y))
            return MathUtils.clampDegrees(degree)
        }
        // /**
        //  * 弧度转向量
        //  * @param 	radians 	弧度
        //  */
        // public static GetLineFromRadians(radians:number):Vector2
        // {
        // 	let x:number = Math.cos(radians)
        // 	let y:number = Math.sin(radians)
        // 	let dir:Vector2 = new Vector2(x, y)
        // 	Vec2Normal(dir)
        // 	return dir
        // }
        /**
         * 弧度转化为度
         */
        public static toDegree(radian: number): number {
            return radian * (180.0 / Math.PI)
        }
        /**
         * 度转化为弧度
         */
        public static toRadian(degree: number): number {
            return degree * (Math.PI / 180.0)
        }

        public static moveTowards(current: number, target: number, maxDelta: number): number {
            if (Math.abs(target - current) <= maxDelta) {
                return target
            }
            return current + MathUtils.sign(target - current) * maxDelta
        }

        //求两点的夹角（弧度）
        public static radians4point(ax, ay, bx, by): number {
            return Math.atan2(ay - by, bx - ax)
        }

        // 求圆上一个点的位置
        public static pointAtCircle(px, py, radians, radius): cc.Vec2 {
            return new cc.Vec2(px + Math.cos(radians) * radius, py - Math.sin(radians) * radius)
        }

        /**
         * 根据位置数组，轨迹类型和时间进度来返回对应的位置
         * @param pts 位置数组
         * @param t 时间进度[0,1]
         * @param type Line:多点折线移动,Curve:贝塞尔曲线移动
         */
        static getPos(pts: cc.Vec2[], t: number, type: OrbitType): cc.Vec2 {
            if (pts.length == 0) return null
            if (pts.length == 1) return pts[0]
            t = Math.min(t, 1) //限定时间值范围,最大为1
            let target: cc.Vec2 = new cc.Vec2()
            let count = pts.length
            if (type == OrbitType.Line) {
                let unitTime: number = 1 / (count - 1) //每两个顶点之间直线所用的时间
                let index = Math.floor(t / unitTime)
                if (index + 1 < count) {
                    let start: cc.Vec2 = pts[index]
                    let end: cc.Vec2 = pts[index + 1]
                    let time: number = (t - index * unitTime) / unitTime //每两点之间曲线移动时间[0,1]
                    target.x = start.x + (end.x - start.x) * time
                    target.y = start.y + (end.y - start.y) * time
                } else {
                    target.x = pts[pts.length - 1].x
                    target.y = pts[pts.length - 1].y
                }
            } else if (type == OrbitType.Curve) {
                target = this.getBezierat(pts, t)
            }
            return target
        }

        /**
         * 获取两点之间连线向量对应的旋转角度
         * 注意: 只适合图片初始方向向上的情况,像鱼资源头都是向上
         *     2  |  1
         *   =====|=====
         *     3  |  4
         * 假设原点是起点
         * 终点在第一象限，顺时针移动，角度[-90,0]
         * 终点在第二象限，顺时针移动，角度[0,90]
         * 终点在第三象限，顺时针移动，角度[-90,0]
         * 终点在第四象限，顺时针移动，角度[0, 90]
         * @param startX 起始点X
         * @param startY 起始点Y
         * @param endX 终点X
         * @param endY 终点Y
         *
         */
        static getRotation(startX: number, startY: number, endX: number, endY: number): number {
            let deltaX = endX - startX
            let deltaY = endY - startY
            let angle: number = (Math.atan(deltaY / deltaX) * 180) / Math.PI
            if (deltaX >= 0) {
                angle += 90
            } else {
                angle += 270
            }
            return angle
        }

        /**
         * 根据顶点数组来生成贝塞尔曲线(只支持二阶和三阶)，根据t返回对应的曲线位置
         * @param pts 顶点数组：第一个和最后一个点是曲线轨迹的起点和终点，其他点都是控制点，曲线不会经过这些点
         * @param t 整个轨迹的时间[0-1]
         */
        public static getBezierat(pts: cc.Vec2[], t: number): cc.Vec2 {
            let target: cc.Vec2 = new cc.Vec2()
            if (pts.length == 3) {
                //二阶贝塞尔
                target.x = Math.pow(1 - t, 2) * pts[0].x + 2 * t * (1 - t) * pts[1].x + Math.pow(t, 2) * pts[2].x
                target.y = Math.pow(1 - t, 2) * pts[0].y + 2 * t * (1 - t) * pts[1].y + Math.pow(t, 2) * pts[2].y
            } else if (pts.length == 4) {
                //三阶贝塞尔
                target.x = Math.pow(1 - t, 3) * pts[0].x + 3 * t * Math.pow(1 - t, 2) * pts[1].x + 3 * Math.pow(t, 2) * (1 - t) * pts[2].x + Math.pow(t, 3) * pts[3].x
                target.y = Math.pow(1 - t, 3) * pts[0].y + 3 * t * Math.pow(1 - t, 2) * pts[1].y + 3 * Math.pow(t, 2) * (1 - t) * pts[2].y + Math.pow(t, 3) * pts[3].y
            }
            return target
        }

        /**
         * 根据旋转角度返回二维方向向量(单位化过)
         * @param angle
         */
        public static getDirection(angle: number): cc.Vec2 {
            let dir = new cc.Vec2()
            if (angle == 0 || angle == 180) {
                dir.x = 0
                dir.y = angle == 0 ? -1 : 1
            } else if (angle == 90 || angle == 270) {
                dir.y = 0
                dir.x = angle == 90 ? 1 : -1
            } else {
                let idx: number = Math.floor(angle / 90)
                let rad = ((90 - angle) * Math.PI) / 180
                if (idx == 0 || idx == 1) dir.x = 1
                else dir.x = -1
                if (idx == 1 || idx == 2) {
                    dir.y = Math.abs(Math.tan(rad))
                } else {
                    dir.y = -Math.abs(Math.tan(rad))
                }
                dir = this.normalize(dir)
            }
            return dir
        }

        /**
         * 单位化向量
         * @param vec
         */
        public static normalize(vec: cc.Vec2): cc.Vec2 {
            let k: number = vec.y / vec.x
            let x: number = Math.sqrt(1 / (k * k + 1))
            let y: number = Math.abs(k * x)
            vec.x = vec.x > 0 ? x : -x
            vec.y = vec.y > 0 ? y : -y
            return vec
        }

        /**
         * 求两点之间的距离长度
         */
        public static distance(startX: number, startY: number, endX: number, endY: number): number {
            return Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
        }

        /**
         * 根据起始和终点连线方向，计算垂直于其的向量和连线中心点的位置，通过raise来调整远近，越远贝塞尔曲线计算的曲线越弯
         *  @param start 起始点坐标
         *  @param end   终点坐标
         *  @param raise 调整离中心点远近
         *
         */
        private static getVerticalVector(start: cc.Vec2, end: cc.Vec2, raise: number): cc.Vec2 {
            let dir: cc.Vec2 = new cc.Vec2()
            dir.x = end.x - start.x
            dir.y = end.y - start.y
            dir.normalize()
            let vertial: cc.Vec2 = new cc.Vec2()
            vertial.x = 1
            vertial.y = -dir.x / dir.y
            let target: cc.Vec2 = new cc.Vec2()
            target.x = (start.x + end.x) / 2 + vertial.x * raise
            target.y = (start.y + end.y) / 2 + vertial.y * raise
            return target
        }

        /**
         * 根据起始点和终点获得控制点
         *
         * @param start 起始点坐标
         * @param end 终点坐标
         * @param raise 控制弯曲度,越大越弯曲
         * @param xOffset 控制弯曲X方向偏移量
         * @param yOffset 控制弯曲Y方向偏移量
         */
        public static getCtrlPoint(start: cc.Vec2, end: cc.Vec2, raise: number = 100, xOffset: number = 50, yOffset: number = 50): cc.Vec2 {
            let ctrlPoint: cc.Vec2 = this.getVerticalVector(start, end, raise)
            ctrlPoint.x += xOffset
            ctrlPoint.y += yOffset
            return ctrlPoint
        }

        public static getDefaultPoints(start: cc.Vec2, end: cc.Vec2, xOffset: number = 150, yOffset: number = 150, raise: number = 150): Array<cc.Vec2> {
            if (start.x > displayWidth() / 2) {
                xOffset = -xOffset
            }
            if (start.y > end.y) {
                yOffset = -yOffset
            }
            let ctrlPt1 = this.getCtrlPoint(start, end, raise, xOffset, yOffset)

            return [start, ctrlPt1, end]
        }
    }
}
