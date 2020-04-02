// 滚轮动作

import { create } from "domain";

enum act_state{
    none = 0,
    speed_up = 1,
    speed_uniform = 2,
    speed_down = 3,
}
const {ccclass, property} = cc._decorator;

let slot = {
    game:{
        animStateData:null,
        animStateDataIsInit:false,
    },
};

@ccclass
export default class reel_act extends cc.Component {
    // @property({
    //     type: cc.Node,
    //     tooltip:"测试节点",
    // })
    // test_node: cc.Node = null;

    // 结束前回调（播音效）
    cb_reel_finish_pre:Function;
    // 停止回调
    cb_reel_finish:Function;
    // 动作停止回调
    finish_call:Function;

    animation: cc.Animation;

    copy_deep:Function;
    reel_index:number = 0;
    // config_time: { uniform: number; down: number; };
    // config_y: { uniform: number; down: number; };
    delay_node: cc.Node;   //延迟节点
    timing_node: cc.Node;   //定时节点（外部用）
    resume_node: cc.Node;   //定时节点（复活转）

	stop_lock:boolean=false; //锁住之后不能再强制停止
    is_stop:boolean=true;
    speed_state: any;
    act_state:act_state;
    is_init: boolean = false;
    event_open: boolean = false;
    reel_state: string;
    run_obj: {};
    run_obj_num: number;
    cur_act_name: string;
    cur_act_frame: number;

    // 运行标记
    run_flag: any;
    need_update_func: any;
    need_update_flag: boolean;
    update_param: {};
    stateData: any;
    time: any;
    frame_start: any;
    frame_end: any;
    is_loop: any;
    y_start: any;
    act_name: any;
    frame_event_list: any;
    step_time: any;
    node_y_start: number;
    speed: any;


    onLoad () {
        this.reel_state = 'none';
    }
    start(){
        this.init();
    }
    init(){
        if(this.is_init){
            return
        }

        // 时间动作按照 时间 为1 帧率 60 计算
        // 5 * 6 = 30    7 * 6 = 42
        //（从编辑器确定）0.30帧 转换成秒 1=60
        // this.config_time = {
        //     uniform:0.4, //30 帧 第几秒开始匀速
        //     down:0.7,   //42 帧 第几秒开始减速
        // }
        // this.config_y = {
        //     uniform:0,
        //     down:0,
        // }

        this.copy_deep = this.local_copy_deep;
        this.init_data();
        this.create_node('delay_node');
        this.create_node('timing_node');
        this.create_node('resume_node');
        this.act_state = act_state.none;
        this.node.y = 0;

        this.is_init = true;
    }

    // 滚轮 启动
    reel_start_up(){
        let param = {
            // act_name:"electric_gl_ys",
            act_name:"test_act1",
            frame_start:0,
            frame_end:45,
            frame_event_list:[
                {
                    frame:45,
                    call_func:()=>{
                        cc.log('结束回调');
                    }
                }
            ],
        };

        // 切换数据
        // param
        //     frame_event_list   帧事件列表
        //          frame
        //          call_func
        //          call_func_name
        // is_loop            是否循环(用来循环相邻帧)
        // step_time          自定义每一步的速度
        this.transfer(param);

        // this.test_node.getComponent(cc.Animation).play('test_act1');
    }
    // 滚轮 中速
    reel_speed_normal(){
    }
    // 滚轮 高速
    reel_speed_high(){
    }
    // 滚轮 低速
    reel_speed_low(){
    }
    // 滚轮 中速
    reel_stop_normal(){
    }
    // 滚轮 高速
    reel_stop_high(){
    }
    // 滚轮 低速
    reel_stop_low(){
    }

    // 切换数据
    // param
    //     frame_event_list   帧事件列表
    //          frame
    //          call_func
    //          call_func_name
    //     frame_start        开始帧
    //     frame_end          结束帧
    //     is_loop            是否循环(用来循环相邻帧)
    //     step_time          自定义每一步的速度
    // force_flag:强制切换
    transfer(param, force_flag?){
        if(force_flag == null){
            if(this.run_flag){
                // 直接执行
                this.update_param = param;
                this.need_update_flag = true;
                return;
            }
        }

        // 当前动作
        let act_name = param.act_name;
        let stateData = slot.game.animStateData[act_name];
        this.stateData = stateData;
        this.frame_event_list = param.frame_event_list;    // frame call_func_name

        this.time = 0;
        this.frame_start = param.frame_start;
        this.frame_end = param.frame_end;
        this.is_loop = param.is_loop;
        this.act_name = act_name;
        this.step_time = param.step_time || stateData.step_time;
        this.speed = param.speed || stateData.speed;
        cc.log(this.speed, "this.speed");
        this.node_y_start = this.node.y;

        this.run_flag = true;
    }

    // ----------------------------------------------------------------------------
    // 每帧刷新
    update(dt){
        if(this.run_flag == null){
            return;
        }
        this.time = this.time + dt*this.speed;
        cc.log(this.speed, this.time, "?this.time")
        let stateData = this.stateData;
        // let values = stateData.values;
        let frame_obj = stateData.frame_obj;
        let step_time = this.step_time;

        let frame_start = this.frame_start;
        let frame_end = this.frame_end;
        let add_frame = Math.floor(this.time / step_time);
        if(frame_end < frame_start){
            add_frame = -1 * add_frame;
        }
        let is_loop = this.is_loop;
        if(is_loop){
            let y_start = frame_obj[frame_start];
            let y_end = frame_obj[frame_end];
            let y_def = (y_end - y_start)*add_frame;
            this.node.y = this.node.y + y_def;
        }else{
            let frame_cur = frame_start + add_frame;
            
            if(frame_end < frame_start){
                if(frame_cur <= frame_end){
                    // 跑完了 结束了
                    frame_cur = frame_end;
                }
            }else{
                if(frame_cur >= frame_end){
                    // 跑完了 结束了
                    frame_cur = frame_end;
                }
            }

            let y_start = frame_obj[frame_start];
            let y_cur = frame_obj[frame_cur];

            let y_def = (y_cur - y_start);
            this.node.y = this.node_y_start + y_def;

            // 执行帧事件
            for (let index = 0; index < this.frame_event_list.length; index++) {
                const element = this.frame_event_list[index];
                if(element.is_down == null){
                    if(frame_end < frame_start){
                        if(frame_cur <= element.frame){
                            // 确保只执行一次
                            element.is_down = true;
                            element.call_func && element.call_func();
                            this[element.call_func_name] && this[element.call_func_name]();
                        }
                    }else{
                        if(frame_cur >= element.frame){
                            // 确保只执行一次
                            element.is_down = true;
                            element.call_func && element.call_func();
                            this[element.call_func_name] && this[element.call_func_name]();
                        }
                    }
                }
            }
            if(frame_cur == frame_end){
                this.run_flag = null;
            }
        }

        // 需要更新
        if(this.need_update_flag){
            this.need_update_flag = null;
            this.transfer(this.update_param, true);
        }
    }
    // ----------------------------------------------------------------------------


    // 滚轮音效帧
    event_reel_finish_pre(){
        if(this.node.isValid == false){
            return;
        }
        if(this.event_open == false){
            return;
        }

        this.cb_reel_finish_pre && this.cb_reel_finish_pre();
    }

    // 滚轮停止
    event_reel_finish(){
        if(this.node.isValid == false){
            return;
        }
        if(this.event_open == false){
            return;
        }
        this.reel_state = 'none';
        this.act_state = act_state.none;
        this.is_stop = true;
        this.cb_reel_finish && this.cb_reel_finish();
    }

    // 获取当前匹配数据的 时间
    get_match_time(act_name, check_value, frame1, frame2){
        let stateData = slot.game.animStateData[act_name];
        let frame_obj = stateData.frame_obj;

        let min_idx = null;
        let min_value = null;
        let deff = null;
        let start_frame = frame1 || 0;
        for (let index = start_frame; index < frame_obj.length; index++) {
            if(frame2 == null || (frame2 && frame2 != index)){
                let frame_data = frame_obj[index];
                deff = Math.abs((frame_data - check_value));
                if(min_value == null){
                    min_value = deff;
                    min_idx = index;
                }else if(min_value > deff){
                    min_value = deff;
                    min_idx = index;
                }
            }
        }
        let time = min_idx * stateData.step_time;
        return time;
    }


    // 存储动作基本数据数据
    init_data(){
        if(slot.game.animStateDataIsInit){
            cc.log("?????");
            return;
        }
        slot.game.animStateDataIsInit = true;

        if(slot.game.animStateData){
            return
        }
        let animation = this.node.getComponent(cc.Animation);
        slot.game.animStateData = {};
        let animStateData = slot.game.animStateData;
        let clips = animation.getClips();
        for (let index = 0; index < clips.length; index++) {
            let clip = clips[index];
            let animState = animation.getAnimationState(clip.name);
            let frame_num = Math.ceil(clip.duration * clip.sample);
            let step_time = clip.duration/frame_num;

            let frame_obj = [];
            // animState.play();
            animation.getAnimationState(clip.name).play();
            for (let index = 0; index <= frame_num; index++) {
                let time = index*step_time;
                animState.time = time;
                // 采样
                animation.sample(clip.name);
                // 需要保存的数据
                frame_obj.push(this.node.y);
            }
            animation.getAnimationState(clip.name).stop();
            // animState.stop();
            let obj = {
                values:this.copy_deep(animState.curves[0].values),
                frame_obj:frame_obj,
                step_time:step_time,
                speed:animState.speed,
                duration:clip.duration,
                act_name:clip.name,
            }
            animStateData[clip.name] = obj;
        }
        cc.log(animStateData);

        // 速率 X 每帧的时间

    }
    onDisable (){
        let animation = this.node.getComponent(cc.Animation);
         // 销毁前先停止动作
        if(animation.isValid == false){
            return;
        }
        let clips = animation.getClips();
        if(clips == null){
            return;
        }
        for (let index = 0; index < clips.length; index++) {
            let clip = clips[index];
            if(clip == null){
                return;
            }
            let AnimaState = animation.getAnimationState(clip.name);
            if(AnimaState){
                AnimaState.stop();
            }
        }
    }

    // 工具函数       ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    create_node(name){
        if(this[name]){
            return;
        }
        let node = new cc.Node();
        node.parent = this.node;
        this[name] = node;
    }
    // 延迟执行
    delay_do(node:cc.Node, time:number, call_func:Function){
        let delay = cc.delayTime(time);
        let call_1 = cc.callFunc(()=>{
            call_func()
        });
        let seq1 = cc.sequence(delay, call_1);
        node.runAction(seq1);
    }

    // 工具函数       ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    // param
    // type 1：按指定帧 2.按指定目标点
    // frame1           指定帧1
    // frame2           指定帧2
    // appoint_y                指定移动到的目标点
    // act_name                 动作名
    do_appoint_act(param){
        let type = param.type;
        let act_name = param.act_name;
        if(act_name == null){
            cc.error('appoint_act_name == null');
            return;
        }

        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState(act_name);
        animState.stop();
        this.node.stopAllActions();
        let stateData = slot.game.animStateData[act_name];
        if(stateData == null){
            cc.error('error act_name:'+act_name);
            return;
        }

        let values = stateData.values;
        let frame_obj = stateData.frame_obj;
        let step_time = stateData.step_time;
        let speed = stateData.speed;
        let end_call = param.end_call;
        let front_end_call = param.front_end_call;

        let time1 = null;
        let time2 = null;
        if(type == 1){
            let frame_obj1 = frame_obj[param.frame1];
            if(frame_obj1 == null){
                cc.error('error frame_obj:'+param.frame1);
            }
            let frame_obj2 = frame_obj[param.frame2];
            if(frame_obj2 == null){
                cc.error('error frame_obj:'+param.frame2);
            }
            time1 = param.frame1*step_time;
            time2 = param.frame2*step_time;

            let deff_value = this.node.y - frame_obj1;
            let set_values = []
            for (let index = 0; index < values.length; index++) {
                set_values[index] = values[index] + deff_value;
            }
            animState.curves[0].values = set_values;
            animState.play();
            animState.time = time1;
            let end_time = (time2-time1)/speed;
            this.delay_do(this.node, end_time+0.01, ()=>{
                animState.stop();
                end_call && end_call();
            });
            this.delay_do(this.delay_node, end_time*0.8, ()=>{
                front_end_call && front_end_call();
            });
        }else if(type == 2){
            let appoint_y = param.appoint_y;

            let frame_obj2 = frame_obj[param.frame2];
            if(frame_obj2 == null){
                cc.error('error frame_obj:'+param.frame2);
            }
            let deff_value = appoint_y - frame_obj2;
            let check_value = this.node.y - deff_value;
            let time1 = this.get_match_time(act_name, check_value, param.frame1, param.frame2);
            let time2 = param.frame2 * step_time;

            let set_values = []
            for (let index = 0; index < values.length; index++) {
                set_values[index] = values[index] + deff_value;
            }

            animState.curves[0].values = set_values;
            animState.play();
            animState.time = time1;
            let end_time = (time2-time1)/speed;
            this.delay_do(this.delay_node, end_time+0.01, ()=>{
                if(param.to_end == null){
                    animState.stop();
                }

                end_call && end_call();
            });
            this.delay_do(this.delay_node, end_time*0.8, ()=>{
                front_end_call && front_end_call();
            });
        }

    }
    // 采样
    act_sample(act_name, time){
        let animation = this.node.getComponent(cc.Animation);
        animation.play(act_name, time);
        animation.sample(act_name);
        
        let data = {
            y:this.node.y,
        };
        animation.stop();
        return data;
    }
    // 帧事件
    frameEvent(aaa, vvv){
        cc.log("出发帧事件");
        cc.log(aaa, vvv);
    }

    final_test(){
        cc.log("终极测试");
        // let param = {
        //     type:1,
        //     frame1:60,
        //     frame2:80,
        //     act_name:'speed_a_whole',
        // };
        // this.do_appoint_act(param);

        let param = {
            type:2,
            frame2:140,
            appoint_y:450,
            act_name:'speed_a_whole',
        };
        this.do_appoint_act(param);
        // 分段取
        
    }

    // 加速
    speed_up_a(){
		this.stop_lock = false;
        this.is_stop = false;
        this.act_state = act_state.speed_up;
        let animation = this.node.getComponent(cc.Animation);
        let param = {
            type:1,
            frame1:0,
            frame2:26,
            act_name:'speed_a_whole',
            end_call:()=>{
                animation.stop();
                this.act_state = act_state.speed_uniform;
                this.speed_uniform_a();
                this.reel_state = 'speed_uniform_a';
            },
        };
        this.do_appoint_act(param);
    }

    // 匀速
    speed_uniform_a(run_time=100, move_y?, end_call?){
        let frame1 = 26;
        let frame2 = 40;
        // cc.log("匀速");
        let stateData = slot.game.animStateData['speed_a_whole'];
        let frame_obj = stateData.frame_obj;
        let frame_obj1 = frame_obj[frame1];
        if(frame_obj1 == null){
            cc.error('error frame_obj:'+frame1);
        }
        let frame_obj2 = frame_obj[frame2];
        if(frame_obj2 == null){
            cc.error('error frame_obj:'+frame2);
        }
        let step_time = stateData.step_time;
        let uniform_vt = (frame_obj2 - frame_obj1) / (frame2*step_time - frame1*step_time);
        if(move_y){
            let time = move_y/uniform_vt;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                end_call && end_call();
            });
            this.node.stopAllActions();
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.speed_uniform_a();
            });
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }
    }

    // 减速+回弹
    speed_down_a(end_y?:any, end_call?){
        if(this.stop_lock){
            return;
        }
        this.stop_lock = true;

        if(end_y == null){
            end_y = this.node.y + 125 * 3;
        }
        let deff = end_y - this.node.y;
        let stateData = slot.game.animStateData['speed_a_whole'];
        let frame_obj = stateData.frame_obj;
        let frame1 = 40;
        let frame2 = 80;
        let frame_obj1 = frame_obj[frame1];
        let frame_obj2 = frame_obj[frame2];
        if(deff > (frame_obj2 - frame_obj1)){
            let move_y = deff - (frame_obj2 - frame_obj1);
            this.speed_uniform_a(null, move_y, ()=>{
                let param = {
                    type:2,
                    frame1:frame1,
                    frame2:frame2,
                    appoint_y:end_y,
                    act_name:'speed_a_whole',
                    to_end:true,
                    end_call:end_call,
                };
                this.do_appoint_act(param);
            });
        }else{
            let param = {
                type:2,
                frame1:frame1,
                frame2:frame2,
                appoint_y:end_y,
                act_name:'speed_a_whole',
                to_end:true,
                end_call:end_call,
            };
            this.do_appoint_act(param);
        }
    }


    // 匀速
    speed_uniform_b(run_time=100, move_y?, end_call?){
        let frame1 = 26;
        let frame2 = 40;
        // cc.log("匀速");
        let stateData = slot.game.animStateData['speed_b_whole'];
        let frame_obj = stateData.frame_obj;
        let frame_obj1 = frame_obj[frame1];
        if(frame_obj1 == null){
            cc.error('error frame_obj:'+frame1);
        }
        let frame_obj2 = frame_obj[frame2];
        if(frame_obj2 == null){
            cc.error('error frame_obj:'+frame2);
        }
        let step_time = stateData.step_time;
        let uniform_vt = (frame_obj2 - frame_obj1) / (frame2*step_time - frame1*step_time);
        if(move_y){
            let time = move_y/uniform_vt;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                end_call && end_call();
            });
            this.node.stopAllActions();
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.speed_uniform_a();
            });
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }
    }

    // 减速+回弹
    speed_down_b(end_y?:any, end_call?){
        if(this.stop_lock){
            return;
        }
        this.stop_lock = true;

        if(end_y == null){
            end_y = this.node.y + 125 * 3;
        }
        let deff = end_y - this.node.y;
        let stateData = slot.game.animStateData['speed_b_whole'];
        let frame_obj = stateData.frame_obj;
        let frame1 = 40;
        let frame2 = 80;
        let frame_obj1 = frame_obj[frame1];
        let frame_obj2 = frame_obj[frame2];
        if(deff > (frame_obj2 - frame_obj1)){
            let move_y = deff - (frame_obj2 - frame_obj1);
            this.speed_uniform_a(null, move_y, ()=>{
                let param = {
                    type:2,
                    frame1:frame1,
                    frame2:frame2,
                    appoint_y:end_y,
                    act_name:'speed_b_whole',
                    to_end:true,
                    end_call:end_call,
                };
                this.do_appoint_act(param);
            });
        }else{
            let param = {
                type:2,
                frame1:frame1,
                frame2:frame2,
                appoint_y:end_y,
                act_name:'speed_b_whole',
                to_end:true,
                end_call:end_call,
            };
            this.do_appoint_act(param);
        }
    }

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 特殊转动 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    speed_uniform_c(run_time=100, move_y?, end_call?){
        let frame1 = 26;
        let frame2 = 40;
        // cc.log("匀速");
        let stateData = slot.game.animStateData['speed_c_whole'];
        let frame_obj = stateData.frame_obj;
        let frame_obj1 = frame_obj[frame1];
        if(frame_obj1 == null){
            cc.error('error frame_obj:'+frame1);
        }
        let frame_obj2 = frame_obj[frame2];
        if(frame_obj2 == null){
            cc.error('error frame_obj:'+frame2);
        }
        let step_time = stateData.step_time;
        let uniform_vt = (frame_obj2 - frame_obj1) / (frame2*step_time - frame1*step_time);
        if(move_y){
            let time = move_y/uniform_vt;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                end_call && end_call();
            });
            this.node.stopAllActions();
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.speed_uniform_c();
            });
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }
    }
    // 减速+回弹
    speed_down_c(end_y?:any, end_call?){
        if(this.stop_lock){
            return;
        }
        this.stop_lock = true;

        if(end_y == null){
            end_y = this.node.y + 125 * 3;
        }
        let deff = end_y - this.node.y;
        let stateData = slot.game.animStateData['speed_c_whole'];
        let frame_obj = stateData.frame_obj;
        let frame1 = 40;
        // let frame2 = 63;
        let frame2 = 80;
        let frame_obj1 = frame_obj[frame1];
        let frame_obj2 = frame_obj[frame2];
        if(deff > (frame_obj2 - frame_obj1)){
            let move_y = deff - (frame_obj2 - frame_obj1);
            this.speed_uniform_c(null, move_y, ()=>{
                let param = {
                    type:2,
                    frame1:frame1,
                    frame2:frame2,
                    appoint_y:end_y,
                    act_name:'speed_c_whole',
                    to_end:true,
                    end_call:end_call,
                };
                this.do_appoint_act(param);
            });
        }else{
            let param = {
                type:2,
                frame1:frame1,
                frame2:frame2,
                appoint_y:end_y,
                act_name:'speed_c_whole',
                to_end:true,
                end_call:end_call,
            };
            this.do_appoint_act(param);
        }
    }

    speed_uniform_d(run_time=100, move_y?, end_call?){
        let frame1 = 26;
        let frame2 = 40;
        // cc.log("匀速");
        let stateData = slot.game.animStateData['speed_d_whole'];
        let frame_obj = stateData.frame_obj;
        let frame_obj1 = frame_obj[frame1];
        if(frame_obj1 == null){
            cc.error('error frame_obj:'+frame1);
        }
        let frame_obj2 = frame_obj[frame2];
        if(frame_obj2 == null){
            cc.error('error frame_obj:'+frame2);
        }
        let step_time = stateData.step_time;
        let uniform_vt = (frame_obj2 - frame_obj1) / (frame2*step_time - frame1*step_time);
        if(move_y){
            let time = move_y/uniform_vt;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                end_call && end_call();
            });
            this.node.stopAllActions();
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.speed_uniform_c();
            });
            let seq = cc.sequence(move, call_func);
            this.node.runAction(seq);
        }
    }
    // 减速+回弹
    speed_down_d(end_y?:any, end_call?){
        if(this.stop_lock){
            return;
        }
        this.stop_lock = true;

        if(end_y == null){
            end_y = this.node.y + 125 * 3;
        }
        let deff = end_y - this.node.y;
        let stateData = slot.game.animStateData['speed_d_whole'];
        let frame_obj = stateData.frame_obj;
        let frame1 = 40;
        let frame2 = 80;
        let frame_obj1 = frame_obj[frame1];
        let frame_obj2 = frame_obj[frame2];
        if(deff > (frame_obj2 - frame_obj1)){
            let move_y = deff - (frame_obj2 - frame_obj1);
            this.speed_uniform_d(null, move_y, ()=>{
                let param = {
                    type:2,
                    frame1:frame1,
                    frame2:frame2,
                    appoint_y:end_y,
                    act_name:'speed_d_whole',
                    to_end:true,
                    end_call:end_call,
                };
                this.do_appoint_act(param);
            });
        }else{
            let param = {
                type:2,
                frame1:frame1,
                frame2:frame2,
                appoint_y:end_y,
                act_name:'speed_d_whole',
                to_end:true,
                end_call:end_call,
            };
            this.do_appoint_act(param);
        }
    }
    // ↑↑↑↑↑↑↑↑↑↑↑ 特殊转动 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    // ----------------------------------------------------------------------------
    // 匀速(取加速最后一帧的速度)
    uniform_speed_act(param){
        let run_time = param.run_time || 100;
        let move_y = param.move_y;
        let end_call = param.end_call;
        let frame1 = param.frame1;
        let frame2 = param.frame2;
        let act_name = param.act_name;

        let stateData = slot.game.animStateData[act_name];
        let frame_obj = stateData.frame_obj;
        let frame_y_1 = frame_obj[frame1];
        let frame_y_2 = frame_obj[frame2];
        if(frame_y_1 == null || frame_y_2 == null){
            cc.error('error frame1:'+frame1+'frame2'+frame2);
        }
        let step_time = stateData.step_time;
        let uniform_vt = (frame_y_2 - frame_y_1) / (frame2*step_time - frame1*step_time);
        if(move_y){
            let time = move_y/uniform_vt;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                end_call && end_call();
            });
            let seq = cc.sequence(move, call_func);
            return seq;
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.uniform_speed_act(param);
            });
            let seq = cc.sequence(move, call_func);
            return seq;
        }
    }
    // 加速
    speed_up_act(){
        let param = {
            type:1,
            frame1:0,
            frame2:26,
            act_name:'speed_a_whole',
            end_call:()=>{
                this.uniform_speed_act({});
            },
        };
        this.do_appoint_act(param);
    }

    // --------------------------------------------------------------------------------

    // 停止当前动作
    stop_curr_act(){
        this.timing_node.stopAllActions(); //外部定时
        this.delay_node.stopAllActions(); // 延迟
        this.node.stopAllActions();  //匀速
        
        let animation = this.node.getComponent(cc.Animation);
        animation.getAnimationState('speed_a_whole').stop();
        animation.getAnimationState('speed_b_whole').stop();
        animation.stop();  //动作
    }
    speed_up(){
        this.speed_state = 1;
        // if(this.act_state != act_state.none){

        // }
        this.event_open = true;
        this.stop_curr_act();
        this.speed_up_a();
        this.reel_state = 'speed_up_a';
    }
    speed_down(end_y?, end_call?){
        // if(this.act_state != act_state.speed_uniform){
        //     this.stop_curr_act();
        //     if(this.speed_state == 1){
        //         this.speed_uniform_a();
        //     }else{
        //         this.speed_uniform_b();
        //     }
        // }
        this.stop_curr_act();
        if(this.speed_state == 1){
            this.speed_down_a(end_y, end_call);
            this.reel_state = 'speed_down_a';
        }else if(this.speed_state == 2){
            this.speed_down_b(end_y, end_call);
            this.reel_state = 'speed_down_b';
        }else if(this.speed_state == 3){
            this.speed_down_a(end_y, end_call);
            this.reel_state = 'speed_down_a';
        }else if(this.speed_state == 4){
            // this.speed_down_c(end_y);
            // this.reel_state = 'speed_down_c';
            this.speed_down_a(end_y, end_call);
            this.reel_state = 'speed_down_a';
        }else{
            this.speed_down_b(end_y, end_call);
            this.reel_state = 'speed_down_b';
        }
    }

    // 保持匀速
    continue_reel(){
        this.delay_node.stopAllActions(); // 延迟
        this.timing_node.stopAllActions();
        this.stop_lock = false;
        this.is_stop = false;
        if(this.act_state != act_state.speed_uniform){
            this.speed_uniform_a();
            this.reel_state = 'speed_uniform_a';
        }
    }

    // 增加速度
    increaseReelSpeed(){
        this.stop_lock = false;
        this.is_stop = false;
        this.speed_state = 2;
        this.stop_curr_act();
        this.speed_uniform_b();
        this.reel_state = 'speed_uniform_b';
    }

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 特殊转动 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // 复活转
    reelResumeRun(end_y, end_call){
        this.stop_lock = false;
        this.is_stop = false;
        this.speed_state = 3;
        this.stop_curr_act();
        // this.speed_uniform_c();
        // this.reel_state = 'speed_down_a';
        this.speed_down_d(end_y, end_call);
        this.reel_state = 'speed_down_d';
        // this.speed_down_b(end_y);
    }

    reelSlowSpeed(){
        this.stop_lock = false;
        this.is_stop = false;
        this.speed_state = 4;
        this.stop_curr_act();
        this.speed_uniform_c();
        this.reel_state = 'speed_uniform_c';
    }

    speed_down_slow(end_y?, end_call?){
        this.stop_curr_act();
        this.speed_down_c(end_y, end_call);
        this.reel_state = 'speed_down_c';
    }
    // ↑↑↑↑↑↑↑↑↑↑↑ 特殊转动 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

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
    }
}
