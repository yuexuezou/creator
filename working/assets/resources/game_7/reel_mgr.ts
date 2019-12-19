// 滚轮管理器
import reel_refresh from './reel_refresh';
import reel_act from './reel_act';
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
        type: [reel_act],
        tooltip:"滚轮动作",
    })
    reel_act_list: reel_act[] = [];

    @property({
        type: reel_element,
        tooltip:"滚轮元素",
    })
    reel_element: reel_element = null;

    // 结束前回调（播音效）
    cb_reel_finish_pre:Function;
    // 停止回调
    cb_reel_finish:Function;

    // 自定义创建元素（只修改id 最终还是要调用create_element_by_id）
    cb_custom_element_by_id:Function = null;
    result: any;

    // onLoad () {
    // }

    // start () {

    // }

    init_reel_element(){
        this.reel_element.cb_custom_element_by_id = (result_obj:result_obj)=>{
            if(this.cb_custom_element_by_id){
                return this.cb_custom_element_by_id(result_obj);
            }else{
                return this.reel_element.create_element_by_id(result_obj);
            }
        }
    }

    init_reel_act(){
        let reel_act_list = this.reel_act_list;
        for (let index = 0; index < reel_act_list.length; index++) {
            let reel_act = reel_act_list[index];
            reel_act.reel_index = index;
            reel_act.cb_reel_finish_pre = ()=>{
                this.cb_reel_finish_pre && this.cb_reel_finish_pre(index);
            }
            reel_act.cb_reel_finish = ()=>{
                this.cb_reel_finish && this.cb_reel_finish(index);
            }
        }
    }

    arrange_result(idx){
        let result = this.result;
        let reel_refresh_list = this.reel_refresh_list;
        let column_num = reel_refresh_list.length;
        for (let index = 0; index < result.length; index++) {
            let result_obj = result[index];
            let reel_refresh = reel_refresh_list[index];
            let row_idx = Math.floor(index/column_num);
            let column_idx = index%column_num;
            if(idx == null || idx == column_idx){
                if(reel_refresh == null){
                    reel_refresh = reel_refresh_list[column_idx];
                }
                let top_element_idx = null;
                if(column_idx == 0){
                    top_element_idx = reel_refresh.get_top_element_idx(null);
                }else{
                    let before_refresh = reel_refresh_list[column_idx-1];
                    top_element_idx = reel_refresh.get_top_element_idx(before_refresh.before_y);
                }

                reel_refresh.set_element_data(row_idx, index, result_obj, top_element_idx);
            }
        }
        if(idx == null){
            let reel_act_list = this.reel_act_list;
            for (let index = 0; index < reel_act_list.length; index++) {

                let reel_refresh = reel_refresh_list[index];
                let reel_act = reel_act_list[index];
                reel_act.speed_down_a(reel_refresh.end_element_y);
            }
        }else{

        }
    }

    // 对外接口↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

    create_element_by_id(result_obj:result_obj){
        return this.reel_element.create_element_by_id(result_obj);
    }

    // 滚轮滚动随机权重
    setSymbolWeightList(symbolWeightList){
        let reel_refresh_list = this.reel_refresh_list;
        for (let index = 0; index < reel_refresh_list.length; index++) {
            const reel_refresh = reel_refresh_list[index];
            let reel_index = reel_refresh.reel_act.reel_index;
            reel_refresh.symbolWeight = symbolWeightList[reel_index];
        }
    }

    // 给指定reel_refresh 设置权重
    setSymbolWeightListByIdx(symbolWeight, idx){
        this.reel_refresh_list[idx].symbolWeight = symbolWeight;
    }
    
    // 开始视图（没有值则随机展示）
    setInitResult(result?){
        if(result==null){
            result = {};
        }

        let reel_refresh_list = this.reel_refresh_list;
        let column_num = reel_refresh_list.length;
        for (let index = 0; index < result.length; index++) {
            let result_obj = result[index];
            let reel_refresh = reel_refresh_list[index];
            if(result_obj==null){
                result_obj = reel_refresh.getRandomObj();
            }
            let row_idx = Math.floor(index/column_num);
            let column_idx = index%column_num;
            if(reel_refresh == null){
                reel_refresh = reel_refresh_list[column_idx];
            }

            reel_refresh.set_element_data(row_idx, index, result_obj);
        }

        for (let index = 0; index < reel_refresh_list.length; index++) {
            const reel_refresh = reel_refresh_list[index];
            reel_refresh.refresh_view();
        }
    }
    // 获取指定位置元素
    // result_idx 索引从0开始  0 - 20
    getElementNode(result_idx){
        let reel_refresh_list = this.reel_refresh_list;
        let reel_refresh = reel_refresh_list[result_idx];
        if(reel_refresh){
            return reel_refresh.getElementNode(result_idx);
        }else{
            let column_num = reel_refresh_list.length;
            let column_idx = result_idx%column_num;
            let reel_refresh = reel_refresh_list[column_idx];
            return reel_refresh.getElementNode(result_idx);
        }
    }

    // 滚轮停止展示结果
    setResult(result:any){
        this.result = result;
    }
    // 开始滚动
    reelStart(){
        let reel_act_list = this.reel_act_list;
        for (let index = 0; index < reel_act_list.length; index++) {
            let reel_act = reel_act_list[index];
            reel_act.speed_up_a();
        }
    }
    // 自动停止滚动（收到数据调用）
    reelAutoStop(){
        if(this.result == null){
            return;
        }
        // this.prepare_stop()
        // let reel_act_list = this.reel_act_list;
        // for (let index = 0; index < reel_act_list.length; index++) {
        //     let reel_act = reel_act_list[index];
        //     reel_act.speed_down_a();
        // }
    }
    // 直接停止滚动
    reelStop(){
        if(this.result == null){
            return;
        }
        this.arrange_result(null);
    }
    // 增加滚轮时间
    increaseReelTime(time=2){
        
    }
    // 是否所有列滚轮停止
    isAllStop(){
        
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


    // 对外接口↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
}
