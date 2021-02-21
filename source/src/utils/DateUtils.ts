// import { StringUtils } from "./StringUtils";
namespace airkit {
    /**
     * 时间
     * @author ankye
     * @time 2018-7-11
     */

    export class DateUtils {
        /**服务器时间*/
        public static serverTimeDiff: number = 0;
        public static serverTime: number = 0;

        public static setServerTime(time: number): void {
            this.serverTime = time;

            this.serverTimeDiff = Date.now() - time;
        }

        /**获取UNIX时间 */
        public static getNow(): number {
            let now: number = Math.floor((Date.now() - this.serverTimeDiff) / 1000);
            return now;
        }
        public static getNowMS(): number {
            return Date.now() - this.serverTimeDiff;
        }

        public static isTheSameMonth(nTime: number, nSecond: number): boolean {
            let now = DateUtils.getNow();
            let curTime = now - nSecond;
            let date = new Date(curTime * 1000);
            let defineDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
            let nextTime = Math.floor(defineDate.getTime() / 1000) + nSecond;
            return nTime >= nextTime;
        }

        public static isTheSameDayByNow(nTime: number, nSecond: number): boolean {
            let date = new Date();
            let offset = date.getTimezoneOffset() * 60;
            let now = DateUtils.getNow();
            let day1 = (nTime - offset - nSecond) / 86400;
            let day2 = (now - offset - nSecond) / 86400;
            if (Math.floor(day1) === Math.floor(day2)) {
                return true;
            }

            return false;
        }

        /**计算从nTime1到nTime2过去了多少天*/
        public static passedDays(nTime1: number, nTime2: number, nSecondOffset: number = 0): number {
            let date = new Date();
            let offset = date.getTimezoneOffset() * 60;
            let day1 = (nTime1 - offset - nSecondOffset) / 86400;
            let day2 = (nTime2 - offset - nSecondOffset) / 86400;
            return Math.floor(day2) - Math.floor(day1);
        }
        public static currentYMDHMS(): string {
            return this.formatDateTime(this.getNowMS());
        }
        public static currentHour(): number {
            var date = new Date(this.getNowMS());
            return date.getHours();
        }
        //时间戳转换日期 (yyyy-MM-dd HH:mm:ss)
        public static formatDateTime(timeValue) {
            var date = new Date(timeValue);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var M = m < 10 ? "0" + m : m;
            var d = date.getDate();
            var D = d < 10 ? "0" + d : d;
            var h = date.getHours();
            var H = h < 10 ? "0" + h : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var minut = minute < 10 ? "0" + minute : minute;
            var secon = second < 10 ? "0" + second : second;
            return y + "-" + M + "-" + D + " " + H + ":" + minut + ":" + secon;
        }
        //返回时:分:秒
        public static countdown(time: number, format: string = "D天H时M分S秒") {
            let s = Math.max(0, time / 1000);
            let d = Math.floor(s / 24 / 3600);
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            let f = format.replace(/D/, d.toString());
            f = f.replace(/H/, h.toString());
            f = f.replace(/M/, m.toString());
            f = f.replace(/S/, s.toString());
            return f;
        }

        public static formatTime(time: number, format: string = "%s:%s:%s") {
            let s = Math.max(0, time);
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);

            return StringUtils.format(format, h < 10 ? "0" + h : h, m < 10 ? "0" + m : m, s < 10 ? "0" + s : s);
        }

        public static format2Time(time: number) {
            let format: string = "%s:%s";
            let s = Math.max(0, time);
            let d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return StringUtils.format("%s天", d);
            }
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            let M = m < 10 ? "0" + m : m;
            let H = h < 10 ? "0" + h : h;
            let S = s < 10 ? "0" + s : s;
            if (h > 0) {
                return StringUtils.format(format, H, M);
            } else {
                format = format.replace(":", "’");
                return StringUtils.format(format, M, S);
            }
        }
        public static format2Time2(time: number) {
            let format: string = "%s:%s";
            let s = Math.max(0, time);
            let d = Math.floor(s / 24 / 3600);
            if (d > 0) {
                return StringUtils.format("%s天", d);
            }
            let h = Math.floor((s / 3600) % 24);
            let m = Math.floor((s / 60) % 60);
            s = Math.floor(s % 60);
            let M = m < 10 ? "0" + m : m;
            let H = h < 10 ? "0" + h : h;
            let S = s < 10 ? "0" + s : s;
            if (h > 0) {
                return StringUtils.format(format, H, M);
            } else {
                format = format.replace(":", "’");
                return StringUtils.format(format, M, S);
            }
        }
    }
}
