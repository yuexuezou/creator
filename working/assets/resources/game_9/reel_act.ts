// 滚轮动作

enum act_state{
    none = 0,
    speed_up = 1,
    speed_uniform = 2,
    speed_down = 3,
}
const {ccclass} = cc._decorator;

@ccclass
export default class reel_act extends cc.Component {
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

	stop_lock:boolean=false; //锁住之后不能再强制停止
    is_stop:boolean=true;
    speed_state: any;
    act_state:act_state;
    is_init: boolean = false;
    event_open: boolean = false;
    animStateData: any;
    animStateDataIsInit: boolean;
    onLoad () {
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
        this.act_state = act_state.none;
        this.node.y = 0;

        this.is_init = true;
    }

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

        this.act_state = act_state.none;
        this.is_stop = true;
        this.cb_reel_finish && this.cb_reel_finish();
    }

    // 获取当前匹配数据的 时间
    get_match_time(act_name, check_value, frame1, frame2){
        let stateData = this.animStateData[act_name];
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
        if(this.animStateDataIsInit){
            return;
        }
        this.animStateDataIsInit = true;

        if(this.animStateData){
            return
        }
        let animation = this.node.getComponent(cc.Animation);
        this.animStateData = {};
        let animStateData = this.animStateData;
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
            }
            animStateData[clip.name] = obj;
        }
        // cc.log(animStateData);
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
        let stateData = this.animStateData[act_name];
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
            this.delay_do(this.node, end_time, ()=>{
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
            this.delay_do(this.delay_node, end_time, ()=>{
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
            },
        };
        this.do_appoint_act(param);
    }

    // 匀速
    speed_uniform_a(run_time=100, move_y?, end_call?){
        let frame1 = 26;
        let frame2 = 40;
        // cc.log("匀速");
        let stateData = this.animStateData['speed_a_whole'];
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
    speed_down_a(end_y?:any){
        if(this.stop_lock){
            return;
        }
        this.stop_lock = true;

        if(end_y == null){
            end_y = this.node.y + 125 * 3;
        }
        let deff = end_y - this.node.y;
        let stateData = this.animStateData['speed_a_whole'];
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
            };
            this.do_appoint_act(param);
        }
    }


    // 匀速
    speed_uniform_b(run_time=100, move_y?, end_call?){
        let frame1 = 26;
        let frame2 = 40;
        // cc.log("匀速");
        let stateData = this.animStateData['speed_b_whole'];
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
    speed_down_b(end_y?:any){
        if(this.stop_lock){
            return;
        }
        this.stop_lock = true;

        if(end_y == null){
            end_y = this.node.y + 125 * 3;
        }
        let deff = end_y - this.node.y;
        let stateData = this.animStateData['speed_b_whole'];
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
            };
            this.do_appoint_act(param);
        }
    }

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
    }
    speed_down(end_y?){
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
            this.speed_down_a(end_y);
        }else{
            this.speed_down_b(end_y);
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
        }
    }

    // 增加速度
    increaseReelSpeed(){
        this.stop_lock = false;
        this.is_stop = false;
        this.speed_state = 2;
        this.stop_curr_act();
        this.speed_uniform_b();
    }

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
