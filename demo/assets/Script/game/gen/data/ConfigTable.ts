export class LangPacks { 
	//中文简体
	public static readonly ZH_CN :string = "zh_cn.json"; 
	//中文繁体
	public static readonly ZH_TW :string = "zh_tw.json"; 
	//英文
	public static readonly EN_US :string = "en_us.json"; 
}; 

export class ConfigTable {
	//扩建配置
	public static readonly EQUIP_UPGRADE: string = "equip_upgrade.json";
	//客人配置
	public static readonly GUEST: string = "guest.json";
	//甜品配置
	public static readonly FOOD: string = "food.json";
	//雇员技能配置
	public static readonly EMPLOY: string = "employ.json";
	//图鉴奖励配置
	public static readonly GRAPH_AWARD: string = "graph_award.json";
	//推广配置
	public static readonly GUEST_ACTION: string = "guest_action.json";
	//装饰物技能配置
	public static readonly SKILL: string = "skill.json";
	//客人分布配置
	public static readonly GUEST_GROUP: string = "guest_group.json";
	//店铺默认等级配置
	public static readonly EQUIP: string = "equip.json";
	//店员皮肤
	public static readonly EMPLOY_SKIN: string = "employ_skin.json";
	//厨师服务员数量配置
	public static readonly EMPLOY_NUMS: string = "employ_nums.json";
	//技能类型配置
	public static readonly JINENGLEIXINGPEIZHI: string = "jinengleixingpeizhi.json";
	//新手引导
	public static readonly GUIDE: string = "guide.json";
	//剧情对话
	public static readonly GUEST_GUIDE: string = "guest_guide.json";
	//任务
	public static readonly TASK: string = "task.json";
	//特殊客人和事件
	public static readonly EVENT: string = "event.json";

	public static keys(): {[key:string]:string|string[]} {
		let c = {};
		c[this.EQUIP_UPGRADE] = "id";
		c[this.GUEST] = ["guest_id","level"];
		c[this.FOOD] = "id";
		c[this.EMPLOY] = "id";
		c[this.GRAPH_AWARD] = "id";
		c[this.GUEST_ACTION] = "id";
		c[this.SKILL] = "id";
		c[this.GUEST_GROUP] = "star";
		c[this.EQUIP] = "id";
		c[this.EMPLOY_SKIN] = "id";
		c[this.EMPLOY_NUMS] = "store_star_min";
		c[this.JINENGLEIXINGPEIZHI] = "id";
		c[this.GUIDE] = ["id","step"];
		c[this.GUEST_GUIDE] = ["id","step"];
		c[this.TASK] = ["type","step"];
		c[this.EVENT] = "id";
		c[LangPacks.ZH_CN] = "id";
		c[LangPacks.ZH_TW] = "id";
		c[LangPacks.EN_US] = "id";
		return c;
	}
}
