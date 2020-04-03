// 滚轮动作

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

    reel_index:number = 0;

    is_init: boolean = false;
    event_open: boolean = false;
    is_stop:boolean=true;
	stop_lock:boolean=false; //锁住之后不能再强制停止

    act_state:act_state;
    reel_state: string;

    // 运行标记
    run_flag: any;
    need_update_flag: boolean;
    update_param: {};
    stateData: any;
    time: any;
    frame_start: any;
    frame_end: any;
    is_loop: any;
    act_name: any;
    step_time: any;
    node_y_start: number;
    speed: any;
    event_list_time: any;
    event_list_frame: any;
    speed_state: number;
    y_scale: any;

    onLoad () {
        this.reel_state = '';
    }
    start(){
        this.init();
    }
    init(){
        if(this.is_init){
            return
        }

        this.init_data();

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
        this.reel_state = 'none';
        this.act_state = act_state.none;
        this.is_stop = true;
        this.cb_reel_finish && this.cb_reel_finish();
    }

    // 存储动作基本数据数据
    init_data(){
        if(slot.game.animStateDataIsInit){
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
                // values:this.copy_deep(animState.curves[0].values),
                frame_obj:frame_obj,
                step_time:step_time,
                speed:animState.speed,
                duration:clip.duration,
                events:clip.events,
                act_name:clip.name,
            }
            animStateData[clip.name] = obj;
        }
        // cc.log(animStateData);
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

    // -----------------------------------------------------------------------------------------------------------------------------------
    // 切换数据
    // param
    //     event_list_frame   帧事件列表
    //          frame
    //          call_func
    //          call_func_name
    //     event_list_time   时间事件列表
    //          time
    //          call_func
    //          call_func_name
    //     frame_start        开始帧
    //     frame_end          结束帧
    //     is_loop            是否循环(用来循环相邻帧)
    //     step_time          自定义每一步的速度
    //     speed              速度
    //     appoint_y          指定y值
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
        this.event_list_frame = param.event_list_frame || [];
        this.event_list_time = param.event_list_time || [];

        this.time = 0;
        this.frame_start = param.frame_start;
        this.frame_end = param.frame_end;
        this.is_loop = param.is_loop;
        this.act_name = act_name;
        this.step_time = param.step_time || stateData.step_time;
        this.speed = param.speed || stateData.speed;
        this.node_y_start = this.node.y;

        // 指定位置
        if(param.appoint_y){
            let frame_obj = stateData.frame_obj;
            let y_start = frame_obj[this.frame_start];
            let y_end = frame_obj[this.frame_end];
            let def_original = (y_end - y_start);
            let def_reality = (param.appoint_y - y_start);

            this.y_scale =  def_reality/def_original;
        }else{
            this.y_scale = 1;
        }

        this.run_flag = true;
        // -------------------------------------------------------------
        this.reel_state = act_name;
        // -------------------------------------------------------------
    }

    // 滚轮 启动
    reel_start_up(){
        let param = {
            act_name:"electric_gl_ys",
            frame_start:0,
            frame_end:42,
            event_list_frame:[
                {
                    frame:42,
                    call_func:()=>{
                        this.reel_speed_normal();
                    }
                }
            ],
        };
        this.transfer(param);
    }
    // 滚轮 中速
    reel_speed_normal(){
        let param = {
            act_name:"electric_gl_ys",
            frame_start:41,
            frame_end:42,
            is_loop:true,
        };
        this.transfer(param);
    }
    // 滚轮 高速
    reel_speed_high(){
        let param = {
            act_name:"electric_gl_ks",
            frame_start:42,
            frame_end:43,
            is_loop:true,
        };
        this.transfer(param);
    }
    // 滚轮 低速
    reel_speed_low(){
        let param = {
            act_name:"electric_gl_ms",
            frame_start:42,
            frame_end:43,
            is_loop:true,
        };
        this.transfer(param);
    }
    // 滚轮 中速
    reel_stop_normal(obj?){
        let param = {
            act_name:"electric_gl_ys",
            frame_start:42,
            frame_end:77,
            appoint_y:obj.end_y,
            event_list_frame:[
                {
                    frame:77,
                    call_func:()=>{
                        obj.end_call && obj.end_call();
                    }
                }
            ],
        };
        this.add_event_frame(param);
        this.transfer(param);
    }
    // 滚轮 高速
    reel_stop_high(obj){
        let param = {
            act_name:"electric_gl_ks",
            frame_start:42,
            frame_end:77,
            appoint_y:obj.end_y,
            event_list_frame:[
                {
                    frame:77,
                    call_func:()=>{
                        obj.end_call && obj.end_call();
                    }
                }
            ],
        };
        this.add_event_frame(param);
        this.transfer(param);
    }
    // 滚轮 低速
    reel_stop_low(obj){
        let param = {
            act_name:"electric_gl_ms",
            frame_start:42,
            frame_end:121,
            appoint_y:obj.end_y,
            event_list_frame:[
                {
                    frame:121,
                    call_func:()=>{
                        obj.end_call && obj.end_call();
                    }
                }
            ],
        };
        this.add_event_frame(param);
        this.transfer(param);
    }
    // 添加帧事件
    add_event_frame(param){
        let act_name = param.act_name;
        let stateData = slot.game.animStateData[act_name];
        let step_time = stateData.step_time;
        let events = stateData.events;
        if(param.event_list_frame == null){
            param.event_list_frame = [];
        }
        for (let index = 0; index < events.length; index++) {
            const element = events[index];
            let frame = Math.floor(element.frame/step_time);
            param.event_list_frame.push({frame:frame, call_func_name:element.func})
        }
    }

    // 滚轮 复活转
    reel_resume_run(obj?){
        let param = {
            act_name:"electric_gl_ys",
            frame_start:42,
            frame_end:77,
            appoint_y:obj.end_y,
            event_list_frame:[
                {
                    frame:77,
                    call_func:()=>{
                        obj.end_call && obj.end_call();
                    }
                }
            ],
        };
        this.add_event_frame(param);
        this.transfer(param);
    }
    // -----------------------------------------------------------------------------------------------------------------------------------
    // 对外接口
    speed_up(){
        this.is_stop = false;
        this.event_open = true;
        this.speed_state = 1;
        this.reel_start_up();
    }
    speed_down(end_y?, end_call?){
        this.stop_lock = true;
        if(this.speed_state == 1){
            this.reel_stop_normal({end_y:end_y, end_call:end_call});
        }else if(this.speed_state == 2){
            this.reel_stop_high({end_y:end_y, end_call:end_call});
        }else if(this.speed_state == 3){
            this.reel_stop_normal({end_y:end_y, end_call:end_call});
        }else if(this.speed_state == 4){
            this.reel_stop_low({end_y:end_y, end_call:end_call});
        }else{
            this.reel_stop_normal({end_y:end_y, end_call:end_call});
        }
    }

    // 保持匀速
    continue_reel(){
        this.stop_lock = false;
        if(this.act_state != act_state.speed_uniform){
            this.reel_speed_normal();
        }
    }

    // 增加速度
    increaseReelSpeed(){
        this.stop_lock = false;
        this.speed_state = 2;
        this.reel_speed_high();
    }

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 特殊转动 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // 复活转 (转停 转停)
    reelResumeRun(end_y, end_call){
        this.stop_lock = false;
        this.speed_state = 3;
        this.reel_resume_run({end_y:end_y, end_call:end_call});
    }

    reelSlowSpeed(){
        this.stop_lock = false;
        this.speed_state = 4;
        this.reel_speed_low();
    }

    speed_down_slow(end_y?, end_call?){
        this.stop_lock = true;
        this.reel_stop_low({end_y:end_y, end_call:end_call});
    }
    // ↑↑↑↑↑↑↑↑↑↑↑ 特殊转动 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    // ----------------------------------------------------------------------------
    // 每帧刷新
    update(dt){
        if(this.run_flag == null){
            return;
        }
        this.time = this.time + dt*this.speed;
        // 执行计时事件
        for (let index = 0; index < this.event_list_time.length; index++) {
            const element = this.event_list_time[index];
            if(this.time >= element.time){
                // 确保只执行一次
                element.is_down = true;
                element.call_func && element.call_func();
                this[element.call_func_name] && this[element.call_func_name]();
            }
        }

        let stateData = this.stateData;
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
            let y_def = Math.abs(y_end - y_start)*add_frame;
            y_def = y_def * this.y_scale;
            this.node.y = this.node_y_start + y_def;
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

            let y_def = Math.abs(y_cur - y_start);
            y_def = y_def * this.y_scale;
            this.node.y = this.node_y_start + y_def;

            // 执行帧事件
            for (let index = 0; index < this.event_list_frame.length; index++) {
                const element = this.event_list_frame[index];
                if(element.is_down == null){
                    if(frame_end < frame_start){
                        if(frame_cur <= element.frame){
                            // 确保只执行一次
                            element.is_down = true;
                            this[element.call_func_name] && this[element.call_func_name]();
                            element.call_func && element.call_func();
                        }
                    }else{
                        if(frame_cur >= element.frame){
                            // 确保只执行一次
                            element.is_down = true;
                            this[element.call_func_name] && this[element.call_func_name]();
                            element.call_func && element.call_func();
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
}
