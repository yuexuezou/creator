
const {ccclass, property} = cc._decorator;

@ccclass
export default class game_6 extends cc.Component {
    aim_x: any;

    @property(cc.Node)
    ddddd: cc.Node = null;

    onLoad () {
        
    }

    start () {
        cc.log(cc.Material);
    }

    asdasdasdasdad () {
        let element_bd_spine = this.ddddd.getComponent(sp.Skeleton);
        // element_bd_spine.setAnimation(0, 'line_gg', false);
        // element_bd_spine.setCompleteListener(()=>{});

        let element_bd_spine = this.ddddd.getComponent(cc.Sprite);
        let sprite = element_bd_spine;
        let material = cc.Material.getBuiltinMaterial('2d-gray-sprite');
        material = cc.Material.getInstantiatedMaterial(material, sprite);
        sprite.setMaterial(0, material);


    }
}

/*

    层级管理器
        设置层级
        增加层级
        移除层级



    滚轮动作
        加速
        匀速
        减速
        回弹
        恢复速度
    滚轮填充  3*5   4*5   4*6  不规则   节节高？ 怎么调层级（再加一个了！）
        测试用的模板
        自定义
    滚轮开始
    滚轮停止
    滚轮增速
    滚轮加时

    滚轮列与列间的关系
    滚轮回转？

    怎么设置元素
    修改元素
    单列顶部 出现某元素怎么改















*/
