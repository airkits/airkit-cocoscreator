namespace airkit {
  export class TouchUtils {
    public static touchBreak(view: any): void {
      view.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
        e.stopPropagation();
      });
    }

    public static mouseBreak(view: any): void {
      view.on(Laya.Event.MOUSE_DOWN, view, (e: Laya.Event) => {
        e.stopPropagation();
      });
    }
  }
}
