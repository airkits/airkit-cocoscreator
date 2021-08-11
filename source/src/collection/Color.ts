// import { StringUtils } from "../utils/StringUtils";
// import { MathUtils } from "../utils/MathUtils";
namespace airkit {
    /**
     * 颜色
     * @author ankye
     * @time 2018-7-3
     */
    export class Color {
        public r: number
        public g: number
        public b: number
        public a: number

        constructor(r?: number, g?: number, b?: number, a?: number) {
            this.r = r
            this.g = g
            this.b = b
            this.a = a
        }
        public set(new_r: number, new_g: number, new_b: number, new_a: number): void {
            this.r = new_r
            this.g = new_g
            this.b = new_b
            this.a = new_a
        }

        public static add(a: Color, b: Color): Color {
            return new Color(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a)
        }

        public add(a: Color): Color {
            this.set(this.r + a.r, this.g + a.g, this.b + a.b, this.a + a.a)
            return this
        }

        public static sub(a: Color, b: Color): Color {
            return new Color(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a)
        }

        public sub(a: Color): Color {
            this.set(this.r - a.r, this.g - a.g, this.b - a.b, this.a - a.a)
            return this
        }

        public static mul(a: Color, d: number): Color {
            return new Color(a.r * d, a.g * d, a.b * d, a.a * d)
        }

        public mul(d: number): Color {
            this.set(this.r * d, this.g * d, this.b * d, this.a * d)
            return this
        }

        public static div(a: Color, d: number): Color {
            return new Color(a.r / d, a.g / d, a.b / d, a.a / d)
        }

        public div(d: number): Color {
            this.set(this.r / d, this.g / d, this.b / d, this.a / d)
            return this
        }

        public equals(other: Color): boolean {
            return this.r == other.r && this.g == other.g && this.b == other.b && this.a == other.a
        }

        public static lerp(from: Color, to: Color, t: number): Color {
            t = MathUtils.clamp(t, 0, 1)
            return new Color(from.r + (to.r - from.r) * t, from.g + (to.g - from.g) * t, from.b + (to.b - from.b) * t + (to.a - from.a) * t)
        }

        public static get zero(): Color {
            return new Color(0, 0, 0, 0)
        }

        public static get one(): Color {
            return new Color(1, 1, 1, 1)
        }

        public static get red(): Color {
            return new Color(1, 0, 0, 1)
        }

        public static get green(): Color {
            return new Color(0, 1, 0, 1)
        }

        public static get blue(): Color {
            return new Color(0, 0, 1, 1)
        }

        public static get white(): Color {
            return new Color(1, 1, 1, 1)
        }

        public static get black(): Color {
            return new Color(0, 0, 0, 1)
        }

        public static get yellow(): Color {
            return new Color(1, 0.9215686, 0.01568628, 1)
        }

        public static get cyan(): Color {
            return new Color(0, 1, 1, 1)
        }

        public static get magenta(): Color {
            return new Color(1, 0, 1, 1)
        }

        public static get gray(): Color {
            return new Color(0.5, 0.5, 0.5, 1)
        }

        public static get grey(): Color {
            return new Color(0.5, 0.5, 0.5, 1)
        }

        public static get clear(): Color {
            return new Color(0, 0, 0, 0)
        }

        public toString(): string {
            return StringUtils.format('(%d,%d,%d,%d)', this.r, this.g, this.b, this.a)
        }
    }
}
