import { LangPacks } from "../gen/data/LK"

export class ConfigTable {
    public static EQUIP_UPGRADE: string = "equip_upgrade.json"
    public static GUEST: string = "guest.json"
    public static FOOD: string = "food.json"
    public static EMPLOY: string = "employ.json"
    public static GRAPH_AWARD: string = "graph_award.json"
    public static GUEST_ACTION: string = "guest_action.json"
    public static SKILL: string = "skill.json"
    public static GUEST_GROUP: string = "guest_group.json"
    public static EQUIP: string = "equip.json"
    public static EMPLOY_SKIN: string = "employ_skin.json"
    public static EMPLOY_NUMS: string = "employ_nums.json"
    public static SKILL_TYPE: string = "jinengleixingpeizhi.json"
    public static GUIDE: string = "guide.json"
    public static GUEST_GUIDE: string = "guest_guide.json"
    public static TASK: string = "task.json"
    public static EVENT: string = "event.json"

    public static keys(): any {
        let c = {}
        c[LangPacks.ZH_CN] = "id"
        c[LangPacks.EN_US] = "id"
        c[LangPacks.ZH_TW] = "id"
        c[this.EQUIP_UPGRADE] = "id"
        c[this.GUEST] = ["guest_id", "level"]
        c[this.FOOD] = "id"
        c[this.EMPLOY] = "id"
        c[this.GRAPH_AWARD] = "id"
        c[this.GUEST_ACTION] = "id"
        c[this.SKILL] = "id"
        c[this.GUEST_GROUP] = "star"
        c[this.EQUIP] = "id"
        c[this.EMPLOY_SKIN] = "id"
        c[this.EMPLOY_NUMS] = "store_star_min"
        c[this.SKILL_TYPE] = "id"
        c[this.GUIDE] = ["id", "step"]
        c[this.GUEST_GUIDE] = ["id", "step"]
        c[this.TASK] = ["type", "step"]
        c[this.EVENT] = ["id"]
        return c
    }
}
