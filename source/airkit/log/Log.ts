// import { StringUtils } from "../utils/StringUtils";
// import { DateUtils } from "../utils/DateUtils";
// import { LogLevel } from "../common/Constant";
namespace airkit {
    /**
     * 日志类处理
     * @author ankye
     * @time 2018-7-8
     */

    export class Log {
        public static LEVEL: LogLevel = LogLevel.INFO

        public static format(format, ...args: any[]): string {
            if (format == null) return "null"
            if (StringUtils.isString(format)) {
                let arr = []
                for (let i = 0; i < args.length; i++) {
                    let arg = args[i]
                    if (StringUtils.isString(arg)) {
                        arr.push(arg)
                    } else {
                        arr.push(JSON.stringify(arg, null, 4))
                    }
                }
                let content = StringUtils.format(format, ...arr)
                return content
            } else {
                if (typeof format == "object" && format.message) {
                    return format.message
                } else {
                    return JSON.stringify(format, null, 4)
                }
            }
        }
        public static debug(format, ...args: any[]): string {
            if (this.LEVEL < LogLevel.DEBUG) return
            let content = this.format(format, ...args)
            console.log(DateUtils.currentYMDHMS(), "[debug]", content)
            return content
        }
        public static info(format, ...args: any[]): string {
            if (this.LEVEL < LogLevel.INFO) return
            let content = this.format(format, ...args)
            console.log(DateUtils.currentYMDHMS(), "[info]", content)
            return content
        }
        public static warning(format, ...args: any[]): string {
            if (this.LEVEL < LogLevel.WARNING) return
            let content = this.format(format, ...args)
            console.warn(DateUtils.currentYMDHMS(), "[warn]", content)
            return content
        }
        public static error(format, ...args: any[]): string {
            if (this.LEVEL < LogLevel.ERROR) return
            let content = this.format(format, ...args)
            console.error(DateUtils.currentYMDHMS(), "[error]", content)
            return content
        }
        public static exception(format, ...args: any[]): string {
            if (this.LEVEL < LogLevel.EXCEPTION) return
            let content = this.format(format, ...args)
            console.exception(DateUtils.currentYMDHMS(), "[exce]", content)
            return content
        }

        public static dump(value: any): void {
            if (this.LEVEL < LogLevel.INFO) return
            if (value instanceof Object) {
                try {
                    value = JSON.stringify(value, null, 4)
                } catch (error) {
                    console.error(error)
                }
            }
            console.log(DateUtils.currentYMDHMS(), "[Dump]", value)
        }
    }
}
