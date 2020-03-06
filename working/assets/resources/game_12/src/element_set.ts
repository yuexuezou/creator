// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    sprite_node: cc.Node = null;
    sprite: cc.Sprite;
    material: any;
    @property({
        tooltip:"固定坐标",
    })
    fix_pos: cc.Vec2 = cc.v2(0, 0);
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.sprite = this.sprite_node.getComponent(cc.Sprite);
        this.material = this.sprite.getMaterial(0);

        this.init_img();
    }
    init_img() {
        let parent = this.sprite_node.parent
        let pp = parent.parent;
        cc.log('pp', pp.x);
        let sprite_node = this.sprite_node;
        this.set_img_width(sprite_node.width);
        this.set_img_height(sprite_node.height);
        this.set_img_scale(sprite_node.scale);
        this.set_point_x(this.fix_pos.x+pp.x);
        this.set_point_y(this.fix_pos.y);
    }
    //图片宽
    set_img_width(value: number) {
        this.material.setProperty("width", value);
    }
    //图片高
    set_img_height(value: number) {
        this.material.setProperty("height", value);
    }
    //图片缩放
    set_img_scale(value: number) {
        this.material.setProperty("img_scale", value);
    }

    //图片坐标x
    set_point_x(value: number) {
        this.material.setProperty("point_x", value);
    }
    //图片坐标y
    set_point_y(value: number) {
        this.material.setProperty("point_y", value);
    }

    //x轴最大值
    set_max_x(value: number) {
        this.material.setProperty("max_x", value);
    }
    //最大值的缩放值
    set_max_scale_x(value: number) {
        this.material.setProperty("max_scale_x", value);
    }
    //半径
    set_circle_r(value: number) {
        this.material.setProperty("circle_r", value);
    }

    callback_point_x(slider: cc.Slider) {
        this.set_point_x((0.5-slider.progress)*400);
        cc.log((0.5-slider.progress)*400, "point_x");
    }
    callback_point_y(slider: cc.Slider) {
        this.set_point_y((0.5-slider.progress)*400);
        cc.log((0.5-slider.progress)*400, "point_y");
    }
    // update (dt) {}
}
