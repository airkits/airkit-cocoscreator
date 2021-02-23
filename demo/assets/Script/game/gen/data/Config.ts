//扩建配置
export interface CEquipUpgrade {
    id : number ;// 装饰id
    store_id : number ;// 对应店铺
    index : number ;// 位置编号
    name : string ;// 名字
    desc : string ;// 描述
    level : number ;// 等级
    need_star : number ;// 升级条件
    add_star : number ;// 升级后星级增加值
    skill_id : number ;// 升级后技能id
    skill_value : number ;// 升级后buff数值
    next_id : number ;// 下级id
    skin_id : number ;// 对应美术资源id
    icon_id : number ;// 对应图标资源id
    need_coin : number ;// G币价格
    type : number ;// 类型
}; 
//客人配置
export interface CGuest {
    guest_id : number ;// 客人id
    type : number ;// 客人类型
    store_id : number ;// 对应店铺
    name : string ;// 客人名字
    desc : string ;// 客人描述
    level : number ;// 对应等级
    food_id : number ;// 对应甜品
    coin : number ;// 携带G币
    vip_action_coin : number ;// 每次服务掉落代用G币
    score : number ;// 每次掉落扭蛋币
    tips_coin : number ;// 携带小费G币
    wait_time : number ;// 耐心
    waitfood_time : number ;// 等待食物耐心
    service_times_min : number ;// 要求服务次数下限
    service_times_max : number ;// 要求服务次数上限
    skin_id : number ;// 皮肤id
    upgrade_times : number ;// 升级需要服务次数
    piece_id : number ;// 对应扭蛋礼券id
    piece_count1 : number ;// 升级需要礼券数1
    piece_tips1 : string ;// 礼券数1文字
    piece_count2 : number ;// 升级需要礼券数2
    piece_tips2 : string ;// 礼券数2文字
    piece_count3 : number ;// 升级需要礼券数3
    piece_tips3 : string ;// 礼券数3文字
    taici : string ;// 待机台词
    taici_diandan : string ;// 点单成功台词
    juqin_id : number ;// 剧情台词id
    icon : number ;// 图标资源id
    maidan_taici : string ;// 结账台词
}; 
//甜品配置
export interface CFood {
    id : number ;// 甜品id
    type : number ;// 类型
    store_id : number ;// 对应店铺
    name : string ;// 甜点名字
    desc : string ;// 甜点描述
    skin_id : number ;// 对应美术资源id
    make_time : number ;// 制作时长
    eat_time : number ;// 食用时长
    need_star : number ;// 解锁星星需求下限
    need_decoration_id : number ;// 解锁需求装饰物id
}; 
//雇员技能配置
export interface CEmploy {
    id : number ;// 技能id
    store_id : number ;// 对应店铺
    desc : string ;// 技能描述
    skill_value : number ;// 技能数值
    skin_id : number ;// 技能图标资源id
    use_time : number ;// 技能持续时间
    cd_time : number ;// 技能CD时间
    weight : number ;// 刷新概率
    type : number ;// 对应雇员
    skill_type : number ;// 技能类型
}; 
//图鉴奖励配置
export interface CGraphAward {
    id : number ;// 图鉴组合名id
    store_id : number ;// 对应店铺
    name : string ;// 图鉴组合名
    type : number ;// 类型
    guest1_id : number ;// 需要id之一
    guest1_level : number ;// 对应等级
    guest2_id : number ;// 需要id之二
    guest2_level : number ;// 对应等级
    guest3_id : number ;// 需要id之三
    guest3_level : number ;// 对应等级
    guest4_id : number ;// 需要id之四
    guest4_level : number ;// 对应等级
    award1_id : number ;// 奖品1的id
    award1_num : number ;// 奖品1的数量
    award2_id : number ;// 奖品2的id
    award2_num : number ;// 奖品2的数量
}; 
//推广配置
export interface CGuestAction {
    id : number ;// 推广id
    store_id : number ;// 对应店铺
    name : string ;// 推广名
    desc : string ;// 推广描述
    times : number ;// 需要点击次数
    use_time : number ;// 推广持续时长
    guest_num : number ;// 普通客人数
    adv_guest_factor : number ;// 明星客人概率
    adv_guest_num_min : number ;// 明星客人下限数
    adv_guest_num_max : number ;// 明星客人上限数
    max_use_times : number ;// 最多积累数
    need_coin : number ;// G币价格
    need_money : number ;// M币价格
    use_count : number ;// 次数
    offline_reward_buff : number ;// 离线收益加成
    min_star : number ;// 开放星级下限
}; 
//明星客人刷新概率表
export interface CAdvGuestCreator {
    store_id : number ;// 对应店铺
}; 
//普通客人刷新概率表
export interface CGuestCreator {
    store_id : number ;// 对应店铺
}; 
//装饰物技能配置
export interface CSkill {
    id : number ;// 技能id
    desc : string ;// 技能描述
    store_id : number ;// 对应店铺
    skill_type : number ;// 技能类型
}; 
//客人分布配置
export interface CGuestGroup {
    star : number ;// 星级上限
    store_id : number ;// 对应店铺
    guest1_id : number ;// 客人1id
    guest2_id : number ;// 客人2id
    guest3_id : number ;// 客人3id
    guest4_id : number ;// 客人4id
    guest5_id : number ;// 客人5id
    guest6_id : number ;// 客人6id
    guest7_id : number ;// 客人7id
    guest8_id : number ;// 客人8id
    guest9_id : number ;// 客人9id
    guest10_id : number ;// 客人10id
}; 
//店铺默认等级配置
export interface CEquip {
    id : number ;// 装饰id
    store_id : number ;// 对应店铺
}; 
//店员皮肤
export interface CEmploySkin {
    id : number ;// 皮肤id
    type : number ;// 对应的种类
    gender : number ;// 对应男女
    store_id : number ;// 对应店铺
    icon : number ;// 图标id
}; 
//厨师服务员数量配置
export interface CEmployNums {
    store_star_min : number ;// 店铺星级下限
    store_star_max : number ;// 店铺星级上限
    store_id : number ;// 对应店铺
    nums_waiter : number ;// 服务员数量
    nums_chif : number ;// 厨师数量
    max_work_waiter : number ;// 工作中服务员数量
    max_work_chif : number ;// 工作中厨师数量
}; 
//技能类型配置
export interface CJinengleixingpeizhi {
    id : number ;// 技能类型
    desc : string ;// 说明
    xianshi : number ;// 广告牌显示方式
}; 
//新手引导
export interface CGuide {
    id : number ;// 引导id
    step : number ;// 引导顺序
    res : number ;// 人物资源
    event : number ;// 事件
    desc : string ;// 台词
    light : number ;// 高亮圆圈
    hands : number ;// 引导手势
    hands_tips : string ;// 引导手势tips
    award_id : number ;// 奖品的id
    award_num : number ;// 奖品的数量
    open_id : number ;// 开放功能id
}; 
//剧情对话
export interface CGuestGuide {
    id : number ;// 引导id
    step : number ;// 引导顺序
    res : number ;// 人物资源
    event : number ;// 事件
    desc : string ;// 台词
}; 
//任务
export interface CTask {
    id : number ;// 任务id
    type : number ;// 类型
    step : number ;// 类型顺序
    desc : string ;// 描述
    num : number ;// 数量
    award_id : number ;// 奖励id
    award_num : number ;// 奖励数量
}; 
//特殊客人和事件
export interface CEvent {
    id : number ;// 事件id
    type : number ;// 类型
    skin_id : number ;// 皮肤或图标id
    intval : number ;// 间隔
    max_times : number ;// 每日上限
    index : number ;// 出现地点
    award_id : number ;// 奖励id
    award_num : number ;// 奖励数值
    award_times : number ;// 奖励次数
    times : number ;// 需要点击次数
    video : number ;// 点击是否需要看视频
    desc : string ;// 描述
    intval_add : number ;// 间隔的增加值
    store_id : number ;// 对应店铺
    need_equip : number ;// 对应触发装饰物
}; 
