
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

    // 加速
    // 匀速
    // 匀速
    // 回弹






*/
