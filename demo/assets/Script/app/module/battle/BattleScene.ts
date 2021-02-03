import { eLoaderType } from "../system/loader/LoaderType";
import { API } from '../../manager/API';
import M from '../M';



/**
 * 登陆场景
 * @author ankye
 * @time 2017-7-14
 */
export default class BattleScene extends airkit.BaseView {

    public pkgName: string = "Home"
    public resName: string = "Home"
    // public map: GameMap
    private list: fgui.GList
    private listArray: Array<any>;
    constructor() {
        super()
    }

    onEnter(): void {
        airkit.Log.info("tower scene onEnter")
        this.createPanel(this.pkgName, this.resName)


        // this.initMap()



        this.listArray = new Array<any>()
        let panel = this._view
        this.list = panel.getChild("list").asList
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false)
        this.list.itemProvider = Laya.Handler.create(this, this.getListItemResource, null, false)

        this.list.defaultItem = this.getListItemResource(0)
        //  this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.list.setVirtual()


        panel.getController("ctrl").selectedIndex = 1
        // API.Instance.exchangeOrderList(1).then(v => {
        //     console.log(v);
        //     if (v && v.data.list) {
        //         for (let i = 0; i < v.data.list.length; i++) {
        //             this.listArray.push(v.data.list[i]);
        //         }
        //         this.list.numItems = this.listArray.length
        //         this.list.refreshVirtualList();
        //     }
        // })
        this.resize()
        let btn = this.getGObject("btnGo").asButton;
        btn.onClick(this, this.onGoClick);
    }
    public onGoClick(): void {
        M.home().then(v => {
            v.enterScene()
        })
    }

    public renderListItem(index: number, obj: fgui.GObject) {
        let item = obj.asCom
        let info = this.listArray[index]
        item.getChild("lblName").asLabel.text = info["name"];
        item.getChild("lblState").asLabel.text = info["order_status"];
        item.getChild("lblTips").asLabel.text = info["order_msg"];
        item.getChild("imgIcon").asLoader.url = info["icon"];

    }

    private getListItemResource(index: number): string {

        return "ui://Home/OrderItem"
    }

    // public initMap() {
    //     let map = new GameMap() //.Instance
    //     map.sortingOrder = 3
    //     this.addChild(map)

    //     let view = fgui.UIPackage.createObjectFromURL("ui://Battle1/GameMap1")
    //     map.setup({ layer: view })

    //     let tileW = 64
    //     let tileH = 64
    //     let row = 14
    //     let col = 13
    //     let mapData = []
    //     for (let i = 0; i < row; i++) {
    //         for (let j = 0; j < col; j++) {
    //             if (mapData[i] == null) mapData[i] = []
    //             mapData[i][j] = eTileBlock.FLOOR
    //         }
    //     }
    //     let objsData = []

    //     let data = {
    //         "terrain": mapData,
    //         "mode": eMapMode.Normal,
    //         "rows": row,
    //         "cols": col,
    //         "tw": tileW,
    //         "th": tileH,
    //         "objsData": objsData
    //     }
    //     map.initMap("1000001", data)
    //     Log.info("Map size {0},{1}", map.width, map.height)
    //     map.debug()
    //     map.addRelation(this, fgui.RelationType.Top_Top)
    //     map.addRelation(this, fgui.RelationType.Center_Center)
    //     this.map = map

    // }

    public res(): Array<[string, string]> {
        let list: Array<[string, string]> = [

            ["res/ui/Home_atlas0.png", Laya.Loader.IMAGE],
            ["res/ui/Home.bin", Laya.Loader.BUFFER],

        ]

        return list
    }
    public loaderType(): number {
        return eLoaderType.WINDOW
    }
    public loaderTips(): string {
        return "资源加载"
    }
    protected eventMap(): Array<[any, any, any]> {
        return [

        ]
    }

    public onDestroy(): void {
        airkit.DisplayUtils.removeAllChild(this)
        super.onDestroy()

    }



    onDisable(): void {
        airkit.Log.info("tower scene onDisable")

    }

    public update(dt: number): boolean {


        return super.update(dt)
    }
    public resizeMap(): void {


        // if (this.map) {
        //     this.map.setXY((this.width - this.map.width) / 2.0, 200)
        // }
    }


    public resize(): void {
        this.resizeMap()

        this._view.setSize(this.width, this.height)
    }

}
