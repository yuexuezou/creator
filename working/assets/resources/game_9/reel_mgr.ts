// 滚轮管理器
import reel_refresh from './reel_refresh';
import reel_element from './reel_element';

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
export default class reel_mgr extends cc.Component {
    @property({
        type: [reel_refresh],
        tooltip:"滚轮刷新列表",
    })
    reel_refresh_list: reel_refresh[] = [];

    @property({
        type: reel_element,
        tooltip:"滚轮元素",
    })
    reel_element: reel_element = null;

    @property({
        type: cc.Float,
        tooltip:"元素列数",
    })
    column_num: any = 0;

    @property({
        type: cc.Float,
        tooltip:"元素行数",
    })
    row_num: any = 0;

    // 结束前回调（播音效）
    cb_reel_finish_pre:Function;
    // 停止回调
    cb_reel_finish:Function;

    // 自定义创建元素（只修改id 最终还是要调用create_element_by_id）
    cb_custom_element_by_id:Function = null;
    result: any;

    force_stop: boolean;
    is_init: boolean = false;
    copy_deep: (obj: any) => {};
    onLoad () {
    }

    start () {
        
    }
    init(){
        if(this.is_init){
            return
        }
        this.is_init = true;
        this.copy_deep = this.local_copy_deep;
        this.init_reel_refresh();
        // this.init_reel_act();
    }

    init_reel_refresh(){
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            reel_refresh.item_idx = index;
            reel_refresh.init();
            let reel_act = reel_refresh.reel_act;
            reel_act.init();
            reel_act.cb_reel_finish_pre = ()=>{
                this.cb_reel_finish_pre && this.cb_reel_finish_pre(index);
            }
            reel_act.cb_reel_finish = ()=>{
                this.cb_reel_finish && this.cb_reel_finish(index);
            }
            reel_refresh.reel_element = this.reel_element;
        }
    }
    arrange_result(idx){
        let result = this.result;
        let reel_refresh_list = this.reel_refresh_list;
        let column_num = this.column_num;
        for (let index = 0; index < result.length; index++) {
            let result_obj = result[index];
            let row_idx = Math.floor(index/column_num);
            let column_idx = index%column_num;
            if(idx == null || idx == column_idx){
                let reel_refresh = reel_refresh_list[index];
                if(reel_refresh == null){
                    reel_refresh = reel_refresh_list[column_idx];
                }
                let top_element_idx = reel_refresh.get_top_element_idx();
                // cc.log(column_idx, index, row_idx, "column_idx");
                if(row_idx >= reel_refresh.element_num){
                    row_idx = 0;
                }
                reel_refresh.set_element_data(row_idx, index, result_obj, top_element_idx);
            }
        }
    }

    // 对外接口↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    create_element_by_id(result_obj:result_obj, add_parent:cc.Node, only_create?:boolean){
        return this.reel_element.create_element_by_id(result_obj, add_parent, only_create);
    }

    // 滚轮滚动随机权重
    setSymbolWeightList(symbolWeightList){
        symbolWeightList = this.copy_deep(symbolWeightList);
        let reel_refresh_list = this.reel_refresh_list;
        let column_num = this.column_num;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            let column_idx = index%column_num;
            let symbolWeight = symbolWeightList[column_idx];
            reel_refresh.symbolWeight = symbolWeight.symbolWeight;
        }
    }

    // 给指定reel_refresh 设置权重
    setSymbolWeightListByIdx(symbolWeight, idx){
        symbolWeight = this.copy_deep(symbolWeight);
        this.reel_refresh_list[idx].symbolWeight = symbolWeight;
    }
    
    // 开始视图（没有值则随机展示）
    setInitResult(result?){
        if(result==null){
            result = [];
        }else{
            result = this.copy_deep(result);
        }
        if(result.length==0){
            
        }
        let reel_refresh_list = this.reel_refresh_list;
        let column_num = this.column_num;

        for (let index = 0; index < this.row_num * column_num; index++) {
            let result_obj = result[index];
            let reel_refresh = reel_refresh_list[index];
            let row_idx = Math.floor(index/column_num);
            let column_idx = index%column_num;
            if(reel_refresh == null){
                reel_refresh = reel_refresh_list[column_idx];
            }
            let reel_act = reel_refresh.reel_act;
            reel_act.node.y = 0;
            if(result_obj==null){
                result_obj = reel_refresh.getRandomObj();
            }
            if(row_idx >= reel_refresh.element_num){
                row_idx = 0;
            }
            reel_refresh.set_element_data(row_idx, index, result_obj);
        }

        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            reel_refresh.refresh_view(true);
        }
    }
    // 获取指定位置元素
    // result_idx 索引从0开始  0 - 19
    getElementNode(result_idx){
        let reel_refresh_list = this.reel_refresh_list;
        let reel_refresh = reel_refresh_list[result_idx];
        if(reel_refresh){
            return reel_refresh.getElementNode(result_idx);
        }else{
            let column_num = this.column_num;
            let column_idx = result_idx%column_num;
            reel_refresh = reel_refresh_list[column_idx];
            return reel_refresh.getElementNode(result_idx);
        }
    }
    // result_idx 索引从0开始  0 - 19
    getElementPos(result_idx){
        let reel_refresh_list = this.reel_refresh_list;
        let reel_refresh = reel_refresh_list[result_idx];
        if(reel_refresh == null){
            let column_num = this.column_num;
            let column_idx = result_idx%column_num;
            reel_refresh = reel_refresh_list[column_idx];
        }

        let row_idx = Math.floor(result_idx/this.column_num);
        let row_num = this.row_num-row_idx;
        let x = reel_refresh.base_parent_pos.x;
        let y =  row_num*reel_refresh.element_height;
        y = y + reel_refresh.base_parent_pos.y;
        return cc.v2(x, y);
    }
    getWheelColumnX(idx){
        let reel_refresh_list = this.reel_refresh_list;
        let reel_refresh = reel_refresh_list[idx];
        return reel_refresh.node.x;
    }

    // 滚轮停止展示结果
    setResult(result:any){
        this.result = this.copy_deep(result);
    }
    // 开始滚动
    reelStart(){
        this.force_stop = false;
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            if(reel_refresh.lock_refresh == false){
                let reel_act = reel_refresh.reel_act;
                reel_act.speed_up();
            }
        }
    }
    // 自动停止滚动（收到数据调用）
    reelAutoStop(){
        if(this.result == null){
            return;
        }

        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            if(reel_refresh.lock_refresh == false){
                let reel_act = reel_refresh.reel_act;
                let reel_idx = index%this.column_num;
                reel_act.delay_do(reel_act.timing_node, 0.65 + reel_idx * 0.4, ()=>{
                    this.arrange_result(index);
                    let reel_refresh = reel_refresh_list[index];
                    reel_act.speed_down(reel_refresh.end_element_y);
                })
            }
        }
    }
    // 直接停止滚动
    reelStop(auto_flag:boolean){
        if(this.result == null){
            return;
        }
        if(auto_flag){
            this.force_stop = false;
            this.reelAutoStop();
            return;
        }
        this.force_stop = true;
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            if(reel_refresh.lock_refresh == false){
                let reel_act = reel_refresh.reel_act;
                if(reel_act.stop_lock == false){
                    reel_act.timing_node.stopAllActions();
                    this.arrange_result(index);
                    reel_act.speed_down(reel_refresh.end_element_y);
                }
            }
        }
    }
    // 增加滚轮时间
    increaseReelTime(idx, time=2){
        if(this.force_stop){
            return;
        }
 
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            if(reel_refresh.lock_refresh == false){
                let reel_act = reel_refresh.reel_act;
                if(reel_act.is_stop == false){
                    if(reel_refresh == null){
                        let column_num = this.column_num;
                        let column_idx = index%column_num;
                        reel_refresh = reel_refresh_list[column_idx];
                    }
                    reel_refresh.clean_element_data();
                    reel_act.timing_node.stopAllActions();
                    if(idx == index){
                        reel_act.increaseReelSpeed();
                    }else{
                        reel_act.continue_reel();
                    }
                    reel_act.delay_do(reel_act.timing_node, time + index * 0.4, ()=>{
                        this.arrange_result(index);
                        reel_act.speed_down(reel_refresh.end_element_y);
                    })
                }
            }
        }
    }

    // 是否所有列滚轮停止
    isAllStop(){
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_act = reel_refresh_list[index].reel_act;
            if(reel_act.is_stop == false){
                return false
            }
        }
        return true;
    }
    // 滚轮暂停（弹窗时停止）
    reelPause(){
        
    }
    // 滚轮恢复（没有弹窗恢复）
    reelResume(){
        
    }
    // 滚轮锁（锁住后不再动）
    reelLock(reel_refresh_idx, flag=true){
        let reel_refresh_list = this.reel_refresh_list;
        reel_refresh_list[reel_refresh_idx].lock_refresh = flag;
    }

    reelUnLock(){
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            reel_refresh.lock_refresh == false;
        }
    }

    // 设置元素可见
    setElementVisitable(flag){
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            let reel_refresh = reel_refresh_list[index];
            reel_refresh.setElementVisitable(flag);
        }
    }

    // 对外接口↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    // ------------------------------------------------------------------------------
    // 工具方法
    local_copy_deep(obj){
        let result = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key]!==null) {
                    result[key] = this.local_copy_deep(obj[key]);   //递归复制 
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }s
}
