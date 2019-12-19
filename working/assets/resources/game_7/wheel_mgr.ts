// 滚轮管理器
import wheel_refresh from './wheel_refresh';
import wheel_act from './wheel_act';
import wheel_element from './wheel_element';

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
export default class wheel_mgr extends cc.Component {
    @property({
        type: [wheel_refresh],
        tooltip:"滚轮刷新列表",
    })
    wheel_refresh_list: wheel_refresh[] = [];

    @property({
        type: [wheel_act],
        tooltip:"滚轮动作",
    })
    wheel_act_list: wheel_act[] = [];

    @property({
        type: wheel_element,
        tooltip:"滚轮元素",
    })
    wheel_element: wheel_element = null;

    // 结束前回调（播音效）
    cb_wheel_finish_pre:Function;
    // 停止回调
    cb_wheel_finish:Function;

    // 自定义创建元素（只修改id 最终还是要调用create_element_by_id）
    cb_custom_element_by_id:Function = null;

    onLoad () {
    }

    start () {

    }

    init_wheel_element(){
        this.wheel_element.cb_custom_element_by_id = (result_obj:result_obj)=>{
            if(this.cb_custom_element_by_id){
                return this.cb_custom_element_by_id(result_obj);
            }else{
                return this.wheel_element.create_element_by_id(result_obj);
            }
        }
    }

    create_element_by_id(result_obj:result_obj){
        return this.wheel_element.create_element_by_id(result_obj);
    }

    init_wheel_act(){
        let wheel_act_list = this.wheel_act_list;
        for (let index = 0; index < wheel_act_list.length; index++) {
            let wheel_act = wheel_act_list[index];
            wheel_act.wheel_index = index;
            wheel_act.cb_wheel_finish_pre = ()=>{
                this.cb_wheel_finish_pre && this.cb_wheel_finish_pre(index);
            }
            wheel_act.cb_wheel_finish = ()=>{
                this.cb_wheel_finish && this.cb_wheel_finish(index);
            }
        }
    }

    // 对外接口↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

    // 滚轮滚动随机权重
    setSymbolWeightList(symbolWeightList){
        let wheel_refresh_list = this.wheel_refresh_list;
        for (let index = 0; index < wheel_refresh_list.length; index++) {
            const wheel_refresh = wheel_refresh_list[index];
            let wheel_index = wheel_refresh.wheel_act.wheel_index;
            wheel_refresh.symbolWeight = symbolWeightList[wheel_index];
        }
    }

    // 给指定wheel_refresh 设置权重
    setSymbolWeightListByIdx(symbolWeight, idx){
        this.wheel_refresh_list[idx].symbolWeight = symbolWeight;
    }
    
    // 开始视图（没有值则随机展示）
    setInitResult(result?){
        if(result==null){
            result = {};
        }

        let wheel_refresh_list = this.wheel_refresh_list;
        let column_num = wheel_refresh_list.length;
        for (let index = 0; index < result.length; index++) {
            let result_obj = result[index];
            let wheel_refresh = wheel_refresh_list[index];
            if(result_obj==null){
                result_obj = wheel_refresh.getRandomObj();
            }
            let row_idx = Math.floor(index/column_num);
            let column_idx = index%column_num;
            if(wheel_refresh == null){
                wheel_refresh = wheel_refresh_list[column_idx];
            }

            wheel_refresh.set_element_data(row_idx, index, result_obj);
        }

        for (let index = 0; index < wheel_refresh_list.length; index++) {
            const wheel_refresh = wheel_refresh_list[index];
            wheel_refresh.refresh_view();
        }
    }

    getElementNode(idx){

    }

    // 滚轮停止展示结果
    setResult(){
        
    }
    // 开始滚动
    wheelStart(){
        
    }
    // 自动停止滚动（收到数据调用）
    wheelAutoStop(){
        
    }
    // 直接停止滚动
    wheelStop(){
        
    }
    // 增加滚轮时间
    increaseWheelTime(){
        
    }
    // 是否所有列滚轮停止
    isAllStop(){
        
    }
    // 滚轮暂停（弹窗时停止）
    wheelPause(){
        
    }
    // 滚轮恢复（没有弹窗恢复）
    wheelResume(){
        
    }

    // 对外接口↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
}
