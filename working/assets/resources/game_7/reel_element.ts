// 创建元素

// 协议中的结果或权重数据
interface result_obj {
    id:number,
    type?:number,
    ext?:number,
    weight?:number,
    weightRepeated?:number,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class reel_element extends cc.Component {
    @property({
        type: cc.Node,
        tooltip:"元素模板",
    })
    template_element: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip:"元素添加节点",
    })
    panel_element_parent: cc.Node = null;

    cb_custom_element_by_id:Function = null;
    cache_element_data:any = {};     //缓存元素数据
    
    onLoad () {
        
    }

    start () {

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

    // update (dt) {}
    
}
