// 滚轮刷新（根据滚动动作刷新元素位置）
import wheel_act from './wheel_act';

const {ccclass, property} = cc._decorator;

// 协议中的结果或权重数据
interface result_obj {
    id:number,
    type?:number,
    ext?:number,
    weight?:number,
    weightRepeated?:number,
}


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
    cache_element_data:any = {};     //缓存数据
    symbolWeight:any = null;  //单列权重

    cb_custom_element_by_id:Function = null;
    itemSelect: any;
    base_parent_pos:cc.Vec2 = null;
    last_set_y: number;
    onLoad () {
        let pos1 = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        let pos2 = this.panel_element_parent.convertToNodeSpaceAR(pos1);
        this.base_parent_pos = pos2;
    }

    start () {
        this.refresh_view();
    }

    // 缓存元素------------------------------------------------------------------------------
    add_cache_element(node:any){
        let id = node.__custom_element_id;
        if(id == null){
            cc.error('id == null');
            return;
        }
        if(this.cache_element_data[id] == null){
            let obj = {
                allots_id:1,   //分配器id
                element_node_list:{},   //可用列表
                use_id:1,   //可用id
            };
            this.cache_element_data[id] = obj;
        }
        let cache_obj = this.cache_element_data[id];
        node.active = false;
        cache_obj.element_node_list[cache_obj.allots_id] = node;
        cache_obj.allots_id = cache_obj.allots_id + 1;
    }

    // 缓存元素
    get_cache_element(id:number){
        if(this.cache_element_data[id] == null){
            return null;
        }

        let cache_obj = this.cache_element_data[id];
        let element_node = cache_obj.element_node_list[cache_obj.use_id];
        if( element_node == null){
            return null;
        }

        delete cache_obj.element_node_list[cache_obj.use_id];
        element_node.active = true;
        cache_obj.use_id = cache_obj.use_id + 1;
        return element_node;
    }
    // 缓存元素------------------------------------------------------------------------------

    create_element_select(result_obj:result_obj){
        if(this.cb_custom_element_by_id){
            return this.cb_custom_element_by_id(result_obj);
        }else{
            return this.create_element_by_id(result_obj);
        }
    }

    // 创建元素
    create_element_by_id(result_obj:result_obj, only_create?:boolean){
        let id = result_obj.id;

        if(only_create){
            let element_node = cc.find('element_'+id, this.template_element);
            return cc.instantiate(element_node);
        }

        let element_node = null;
        element_node = this.get_cache_element(id);
        if(element_node == null){
            element_node = cc.find('element_'+id, this.template_element);
        }else{
            return element_node;
        }

        if(element_node == null){
            cc.log('cc.find(element_+id, this.template_element) id:' + id);
            element_node = cc.find('element_error', this.template_element);
        }

        let c_element_node = cc.instantiate(element_node);
        c_element_node.name = 'element_node';
        c_element_node.__custom_element_id = id;
        c_element_node.parent = this.panel_element_parent;
        return c_element_node;
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
                element_node = this.create_element_select(element_data);
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
                    element_node = this.create_element_select(item);
                }else{
                    let template_element_num = this.template_element.children.length;
                    // 设置一个随机1到N的变量。  除掉最后一个错误元素
                    id = Math.ceil(Math.random()*(template_element_num-1));
                    element_node = this.create_element_select({id:id});
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
                element_node = this.create_element_select(element_data);

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
            if(this.first_element_idx > key_idx || key_idx > (this.first_element_idx + this.element_num + 3)){
                if(this.element_obj[key] != null){
                    this.add_cache_element(this.element_obj[key].element_node);
                    delete this.element_obj[key];
                }
            }
        }
    }

    update (dt) {
        this.refresh_view();
    }


}
