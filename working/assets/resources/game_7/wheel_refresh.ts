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

    @property({
        type: cc.Float,
        tooltip:"元素个数（行数）",
    })
    element_num: any = 4;
    // 滚轮列索引
    item_idx:number = 0;

    element_obj:any = {};   
    element_data:any = {};
    element_node_by_data:any = {};
    first_element_idx:number = 0;
    end_element_idx:number = 0;
    wheel_is_stop:boolean = false;   //滚轮已经停止
    is_auto_stop:boolean = false;    //滚轮自动停止（在停的路上）

    onLoad () {
    }

    start () {

    }

    refresh_view(){
        let y = this.wheel_act.node.y;
        // 有几个不在视野了
        let disappear_num = Math.floor(y/this.element_height);
        // y坐标偏移
        let offset_y = y-disappear_num*this.element_height;
        this.first_element_idx = disappear_num;
        for (let index = 1; index <= this.element_num + 3; index++) {
            let element_idx = this.first_element_idx + index;


        }

        
        // 0 1 2 3
        // 0.1 0.5 1.1 1.5 2


        

        for (let index = 1; index <= this.element_num; index++) {

        }
    }

    update (dt) {
        // this.refresh_view();
    }
}
