// 滚轮刷新（根据滚动动作刷新元素位置）
import wheel_act from './wheel_act';
import wheel_element from './wheel_element';

const {ccclass, property} = cc._decorator;

@ccclass
export default class wheel_refresh extends cc.Component {
    @property({
        type: wheel_act,
        tooltip:"滚轮动作",
    })
    wheel_act: wheel_act = null;

    @property({
        type: wheel_element,
        tooltip:"滚轮元素",
    })
    wheel_element: wheel_element = null;

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
    // cache_element_data:any = {};     //缓存数据
    symbolWeight:any = null;  //单列权重（没有设置权重使用本地数据）

    cb_custom_element_by_id:Function = null;
    itemSelect: any;
    base_parent_pos:cc.Vec2 = null;
    last_set_y: number;
    onLoad () {
        let pos1 = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        let pos2 = this.wheel_element.panel_element_parent.convertToNodeSpaceAR(pos1);
        this.base_parent_pos = pos2;
    }

    start () {
        this.refresh_view();
    }

    // 随机结果
    getRandomObj(){
        if(this.symbolWeight){
            if(!this.itemSelect || !this.itemSelect.length){
                // this.itemSelect = slot.math.randomHallSymbolWeight(this.symbolWeight);
            }
            let item = this.itemSelect.shift();
            return item;
        }else{
            let template_element_num = this.wheel_element.template_element.children.length;
            // 设置一个随机1到N的变量。  除掉最后一个错误元素
            let id = Math.ceil(Math.random()*(template_element_num-1));
            return {id:id};
        }
    }

    // row_index 索引0开始
    // result_idx 索引0开始
    set_element_data(row_index, result_idx, result_obj){
        let element_idx = this.element_num - row_index;
        this.element_data[element_idx] = result_obj;
        this.element_data[element_idx].result_idx = result_idx;
    }

    up_element_node(offset_y:any, element_node:cc.Node, index:number){
        let set_y =  (index-1)*this.element_height - offset_y;
        set_y = set_y + this.base_parent_pos.y;
        // 更新坐标
        element_node.x = this.base_parent_pos.x;
        element_node.y = set_y;

        let custom_zIndex = -1*index + this.item_idx*10;
        // cc.log("设置权重", offset_y, custom_zIndex, element_node.y);
        // sysEvent.emit(slot.game.event_name+'set_zIndex', {node:element_node, name:'wheel', custom_zIndex:custom_zIndex});
    }

    // 设置元素模板
    // offset_y 偏移量
    // index 滚轮索引
    set_element_node(offset_y:any, index:number){
        let element_idx = this.first_element_idx + (index-1);

        let element_obj = this.element_obj[element_idx];
        let element_data = this.element_data[element_idx];

        let id = 1;
        let element_node = null;
        if(element_obj == null){
            if(element_data){
                id = element_data.id;
                element_node = this.wheel_element.create_element_select(element_data);
                if(element_data.result_idx){
                    this.element_node_by_data[element_data.result_idx] = element_node;
                }
                // 用完就删
                delete this.element_data[element_idx];
            }else{
                if(this.symbolWeight){
                    if(!this.itemSelect || !this.itemSelect.length){
                        // this.itemSelect = slot.math.randomHallSymbolWeight(this.symbolWeight);
                    }
                    let item = this.itemSelect.shift();
                    id = item.id;
                    element_node = this.wheel_element.create_element_select(item);
                }else{
                    let template_element_num = this.wheel_element.template_element.children.length;
                    // 设置一个随机1到N的变量。  除掉最后一个错误元素
                    id = Math.ceil(Math.random()*(template_element_num-1));
                    element_node = this.wheel_element.create_element_select({id:id});
                }
            }
            let obj = {
                id:id,
                element_node:element_node,
            };
            this.element_obj[element_idx] = obj;
        }else{
            if(element_data){
                element_obj.element_node.destroy();
                element_node = this.wheel_element.create_element_select(element_data);

                id = element_data.id;
                if(element_data.result_idx){
                    this.element_node_by_data[element_data.result_idx] = element_node;
                }
                // 用完就删
                delete this.element_data[element_idx];

                let obj = {
                    id:id,
                    element_node:element_node,
                };
                this.element_obj[element_idx] = obj;
            }else{
                element_node = element_obj.element_node;
            }
        }
        this.up_element_node(offset_y, element_node, index);
    }

    refresh_view(){
        let y = this.wheel_act.node.y;
        
        if(this.last_set_y == y){
            return;
        }

        this.last_set_y = y;
        // 有几个不在视野了
        let disappear_num = Math.floor(y/this.element_height);
        // y坐标偏移
        let offset_y = y-disappear_num*this.element_height;
        this.first_element_idx = disappear_num+1;
        for (let index = 1; index <= this.element_num + 3; index++) {
            this.set_element_node(offset_y, index);
        }

        let element_obj = this.element_obj;
        for (const key in element_obj) {
            let key_idx = parseInt(key);
            if(this.first_element_idx > key_idx || key_idx > (this.first_element_idx - 1 + this.element_num + 3)){
                if(this.element_obj[key] != null){
                    this.wheel_element.add_cache_element(this.element_obj[key].element_node);
                    delete this.element_obj[key];
                }
            }
        }
    }

    update (dt) {
        this.refresh_view();
    }
}
