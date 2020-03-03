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
    node_circle: cc.Node = null;
    @property(cc.Node)
    node_circle_parent: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.make_circle();
    }

    make_circle(){
        this.node_circle.active = false;
        let circle_r = 350;
        this.node_circle.width = circle_r;
        this.node_circle.height = circle_r;
        let color_sprite = cc.find('color_sprite', this.node_circle);
        color_sprite.width = circle_r;
        color_sprite.height = circle_r;

        let max_x = 412;
        let max_scale_x = 0.3;
        let make_num = 5;

        let step_x = max_x/make_num;
        let step_scale_x = max_scale_x/make_num;

        for (let index = 0; index <= make_num; index++) {
            this.add_circle({index:index, step_x:step_x, step_scale_x:step_scale_x, direction:1});
            this.add_circle({index:index, step_x:step_x, step_scale_x:step_scale_x, direction:-1});
        }
    }

    add_circle(param){
        let index = param.index;
        let step_x = param.step_x;
        let step_scale_x = param.step_scale_x;
        let direction = param.direction || 1;

        let node_circle = cc.instantiate(this.node_circle);
        node_circle.active = true;
        node_circle.parent = this.node_circle_parent;
        let set_x = index * step_x * direction;
        let set_scale_x = index * step_scale_x;

        node_circle.x = set_x;
        node_circle.scaleX = set_scale_x;
    }
    // update (dt) {}
}

/*

滚轮 本身就是一个圆
缩放x的值 让这个圆变成透视效果


圆的半径
最内层缩放比例
最外层缩放比例
通过x确定 圆


, y 确定该点在圆的







*/