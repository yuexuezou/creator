// 滚轮刷新（根据滚动动作刷新元素位置）
import wheel_act from './wheel_act';
const {ccclass, property} = cc._decorator;

@ccclass
export default class wheel_refresh extends cc.Component {
    @property({
        type: wheel_act,
        tooltip:"滚轮动作",
    })
    wheel_act: wheel_act = null;

    @property({
        type: cc.Node,
        tooltip:"元素添加节点",
    })
    panel_element_parent: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip:"元素模板",
    })
    template_element: cc.Node = null;

    @property({
        type: cc.Float,
        tooltip:"元素高度（包括间隔）",
    })
    element_height: any = 150;


    onLoad () {

    }

    start () {

    }

    refresh_view(){
        let y = this.wheel_act.node.y;
    }

    update (dt) {
        this.refresh_view();
    }
}
