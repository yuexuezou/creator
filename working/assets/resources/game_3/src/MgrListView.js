cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'slot/MgrListView(暂时不支持水平滚动)',
    },
    properties: {
        itemName: {
            default: '',
            tooltip:"项的组件名, 列表更新的组件，该组件提供方法 updateItem0 （注：0为项的模板索引）",
        },
        itemTemplateList: {
            default:[],
            tooltip:"项列表模板",
            type: cc.Node
        },
        errorTemplate: {
            default: null,
            tooltip:"错误模板",
            type: cc.Node
        },
        scrollView: {
            default: null,
            tooltip:"滚动容器",
            type: cc.ScrollView
        },
        spacing: {
            default: 0,
            tooltip:"项之间的间隔",
        },
        start_spacing: {
            default: 0,
            tooltip:"开始间隔",
        },
        end_spacing: {
            default: 0,
            tooltip:"结束间隔",
        },
        bufferZone:{
            default: 0,
            tooltip:"缓冲区区域",
        },
    },

    // use this for initialization
    onLoad(){
        if(!this.scrollView){
            return;
        }
        // 注：基于容器this.scrollView.node 锚点是0.5 0.5 来算（所以容器锚点不能改）
        this.content = this.scrollView.content;
        // this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // 缓冲区数量
        this.bufferNum = 2;
        this.initTemplateBuffer();

        let data = [];
        this.upData(data);
    },

    // 计算内容总尺寸
    calculate_size(){
        let max_height = 0;
        let width = this.start_spacing;
        let height = this.start_spacing;
        let data = this.data;
        for (let index = 0; index < data.length; index++) {
            let obj = data[index];
            let item = this.itemTemplateList[obj.itemIdx];
            if(item == null){
                cc.error('cannot find itemIdx:'+obj.itemIdx+'in itemTemplateList!');
                item = this.errorTemplate;
                data[index].is_error = true;
            }

            data[index].sumSize = {width:item.width/2+width, height:item.height/2+height};
            data[index].width = item.width;
            data[index].height = item.height;
            // 初始化位置
            if(!data[index].pos){
                data[index].pos = cc.v2(0, -data[index].sumSize.height);
            }
            // 最终位置
            data[index].aim_pos = cc.v2(0, -data[index].sumSize.height);
            data[index].index = index;

            width = width + item.width + this.spacing;
            height = height + item.height + this.spacing;
            if(item.height > max_height){
                max_height = item.height;
            }
        }
        if(data.length>0){
            width = width - this.spacing + this.end_spacing;
            height = height - this.spacing + this.end_spacing;
        }
        this.max_height = max_height;
        // 数据内容总宽高
        this.data_size = {width:width, height:height};
    },

    scrollEvent(sender, event) {
        switch(event) {
            case 0:
                // "Scroll to Top";
                break;
            case 1:
                // "Scroll to Bottom";
                break;
            case 2:
                // "Scroll to Left";
                break;
            case 3:
                // "Scroll to Right";
                break;
            case 4:
                // "Scrolling";
                this.scrolling = true;
                break;
            case 5:
                // "Bounce Top";
                break;
            case 6:
                // "Bounce bottom";
                break;
            case 7:
                // "Bounce left";
                break;
            case 8:
                // "Bounce right";
                break;
            case 9:
                this.scrolling = false;
                // "Auto scroll ended";
                break;
        }
    },
    
    // 模板缓冲区
    initTemplateBuffer(){
        let obj = [];
        for (let index = 0; index < this.itemTemplateList.length; index++) {
            obj[index] = [];
        }
        this.itemTemplateBuffer = obj;
    },
    // 添加缓冲模板
    addTemplateBuffer(index, item){
        item.active = false;
        this.itemTemplateBuffer[index].push(item);
    },
    getTemplateBuffer(index){
        let template = this.itemTemplateBuffer[index];
        if(template == null){
            return null;
        }
        let item = template[0];
        if(item){
            this.itemTemplateBuffer[index].splice(0, 1);
        }
        return item;
    },
    // 未使用缓冲区模板处理
    update_TemplateBuffer(){
        for (let index = 0; index < this.itemTemplateBuffer.length; index++) {
            let element = this.itemTemplateBuffer[index];
            for (let index1 = 0; index1 < element.length; index1++) {
                let item = element[index1];
                item.active = false;
            }
        }
    },
    // 移除所有缓冲模板
    removeTemplateBuffer(){
        for (let index = 0; index < this.itemTemplateBuffer.length; index++) {
            let element = this.itemTemplateBuffer[index];
            for (let index1 = 0; index1 < element.length; index1++) {
                let item = element[index1];
                item.destroy();
            }
        }
        this.initTemplateBuffer();
    },
    checkInView(position, width, height) { // get item position in scrollview's node space
        let worldPos = this.content.convertToWorldSpaceAR(position);
        let itemPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        let item_up_y = itemPos.y+height/2;
        let item_down_y = itemPos.y-height/2;

        let view_height = this.scrollView.node.height;
        let view_up_y = view_height/2 + this.bufferZone;
        let view_down_y = -1*view_up_y;
        if(itemPos.y <= view_up_y){
            if(itemPos.y >= view_down_y || item_up_y >= view_down_y){
                return true;
            }
        }else{
            if(item_down_y <= view_up_y){
                if(item_down_y >= item_down_y){
                    return true;
                }
            }
        }
        return false;
    },
    getPositionInView(item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
    refresh_pos(){
        let move_time = 0.3;
        let data = this.data;
        for (let index = 0; index < data.length; index++) {
            if(data[index].pos.y != data[index].aim_pos.y){
                cc.tween(data[index].pos)
                .to(move_time, {y: data[index].aim_pos.y}, { easing: 'cubicInOut' })
                .start()
            }
        }

        let step_t = 0.01;
        let time = 0;
        let daley = cc.delayTime(step_t);
        let call_func = cc.callFunc(()=>{
            time = time + step_t;
            this.updateView();
            if(time > move_time){
                this.node.stopAllActions();
            }
        });
        let seq = cc.sequence(daley, call_func);
        this.node.stopAllActions();
        this.node.runAction(cc.repeatForever(seq));
    },
    updateView(){
        // 创建在视图里的容器
        let data = this.data;
        for (let index = 0; index < data.length; index++) {
            let obj = data[index];
            let sumSize = obj.sumSize;
            let in_view = this.checkInView(cc.v2(0, -sumSize.height), obj.width, obj.height);
            if(in_view){
                let item = data[index].item;
                if(data[index].is_create){
                    // cc.log('已经创建的', item.list_view_data_idx, index);
                    item.list_view_data_idx = index;
                    // let item_model = item.getComponent(this.itemName);
                    // item_model['updateItem'+obj.itemIdx](data[index]);
                }else{
                    let itemIdx = obj.itemIdx;
                    let temp_item = this.getTemplateBuffer(itemIdx);
                    if(temp_item){
                        item = temp_item;
                        temp_item.active = true;
                    }else{
                        let temp_item= this.itemTemplateList[itemIdx];
                        if(temp_item==null){
                            temp_item = this.errorTemplate;
                            data[index].is_error = true;
                        }
                        item = cc.instantiate(temp_item);
                        this.content.addChild(item);
                    }
                    data[index].item = item;
                    data[index].is_create = true;
                    item.list_view_data_idx = index;
                    let item_model = item.getComponent(this.itemName);
                    if(data[index].is_error){
                        // 错误模板
                        item_model.updateItemError(data[index]);
                    }else{
                        item_model['updateItem'+obj.itemIdx](data[index]);
                    }
                }
                item.position = cc.v2(0, data[index].pos.y);
            }else{
                // 移除
                if(data[index].is_create){
                    data[index].is_create = null;
                    // 加入模板缓冲区
                    obj.item.stopAllActions();
                    obj.item.list_view_data_idx = null;
                    this.addTemplateBuffer(obj.itemIdx, obj.item);
                }
            }
        }
        this.update_TemplateBuffer();
    },
    update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return;
        }
        this.updateTimer = 0;
        if(!this.scrolling){
            return;
        }
        this.updateView();
    },

    addItem() {
        this.data.push({itemIdx:0, data:1});
        this.upData(this.data);
    },

    removeItem() {
        // 新增列表
        // 删除对应
        // 刷新内容


        this.removeItemByIdx(0);
        this.refresh_pos();
    },
    // 根据下标移除项
    removeItemByIdx(idx) {
        let data = this.data[idx];
        if(!data){
            return;
        }
        if(data.item){
            // 加入模板缓冲区
            // this.addTemplateBuffer(data.itemIdx, data.item);
            if(data.item.list_view_data_idx == idx){
                this.addTemplateBuffer(data.itemIdx, data.item);
            }
        }

        this.data.splice(idx, 1);
        this.calculate_size();
        this.content.height = this.data_size.height;
        this.updateView();
        if(this.scrollView.node.height >= this.content.height){
            let max_pos = this.scrollView.getMaxScrollOffset();
            this.scrollView.scrollToOffset(cc.v2(0, max_pos));
        }
    },
    // 滚动到底部
    scrollToBottom(time){
        let max_pos = this.scrollView.getMaxScrollOffset();
        this.scrollView.scrollToOffset(cc.v2(0, max_pos.y/2), time);
        if(!time){
            this.updateView();
        }
    },
    // 移动到指定数据
    scrollToDataIdx(idx, time){
        let data = this.data[idx];
        if(!data){
            return;
        }
        let move_y = data.sumSize.height-data.height/2
        let max_pos = this.scrollView.getMaxScrollOffset();
        if(move_y>max_pos){
            move_y = max_pos;
        }
        this.scrollView.scrollToOffset(cc.v2(0, move_y-this.start_spacing), time);
    },
    // 数据更新 (外部调用)
    // data=[];
    // data[0] = {itemIdx:0, data:'xxxx'};
    upData(data, save_buffer){
        if(this.data){
            for (let index = 0; index < this.data.length; index++) {
                let obj = this.data[index];
                if(obj.is_create){
                    this.data[index].is_create = null;
                    // 加入模板缓冲区
                    this.addTemplateBuffer(obj.itemIdx, obj.item);
                }
            }
        }
        if(data){
            this.data = this.copy_deep(data);
        }else{
            this.data = [];
        }
        this.calculate_size();
        this.content.height = this.data_size.height;
        this.updateView();
        if(save_buffer == null){
            this.removeTemplateBuffer();
        }
    },
    copy_deep(obj){
        let result = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key]!==null) {
                    result[key] = this.copy_deep(obj[key]);   //递归复制 
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },
});
