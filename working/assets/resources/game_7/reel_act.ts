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

    // 动作原始数据
    animStateData:object;

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
    onLoad () {
        this.init();
    }

    init(){
        if(this.is_init){
            return
        }
        this.is_init = true;
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
        let animation = this.node.getComponent(cc.Animation);
        animation.on('finished',  this.onFinished,    this);
        this.create_node('delay_node');
        this.create_node('timing_node');
        this.act_state = act_state.none;
        this.node.y = 0;
    }

    onFinished(event_name, AnimationState?){
        let act_name = AnimationState.name;
        if(act_name == 'speed_a_whole'){
            this.is_stop = true;
            this.finish_call && this.finish_call();
            this.act_state = act_state.none;
        }else if(act_name == 'speed_b_whole'){
            this.is_stop = true;
            this.finish_call && this.finish_call();
            this.act_state = act_state.none;
        }
    }

    init_animStateData(node){
        let animation = node.getComponent(cc.Animation);
        this.animStateData = {};
        let animStateData = this.animStateData;
        let clips = animation.getClips();
        for (let index = 0; index < clips.length; index++) {
            const clip = clips[index];
            let animState = animation.getAnimationState(clip.name);
            let frame_num = Math.ceil(clip.duration * clip.sample);
            let step_time = clip.duration/frame_num;

            let frame_obj = [];
            animState.play();
            for (let index = 0; index <= frame_num; index++) {
                let time = index*step_time;
                animState.time = time;
                // 采样
                animation.sample(clip.name);
                // 需要保存的数据
                frame_obj.push(node.y);
            }
            animState.stop();

            let obj = {
                values:slot.copy_deep(animState.curves[0].values),
                duration:animState.duration,
                frame_obj:frame_obj,
                step_time:step_time,
            }
            animStateData[clip.name] = obj;
        }
    }
    // 获取当前匹配数据的 时间
    get_match_time(act_name){
        let check_value = this.panel_move.y;
        let stateData = this.animStateData[act_name];
        let frame_obj = stateData.frame_obj;

        let min_idx = null;
        let min_value = null;
        let deff = null;
        for (let index = 0; index < frame_obj.length; index++) {
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
        let time = min_idx * stateData.step_time;
        return time;
    }

    // 存储动作基本数据数据
    init_data(){
        let animation = this.node.getComponent(cc.Animation);
        this.animStateData = {};
        let animStateData = this.animStateData;
        let clips = animation.getClips();
        for (let index = 0; index < clips.length; index++) {
            let clip = clips[index];
            let animState = animation.getAnimationState(clip.name);
            cc.log(animState);
            // frame_data  帧数据
            // 0: {frame: 0, value: 0, curve: "quadIn"}
            // 1: {frame: 1, value: 2000}
            // 2: {frame: 1.3333333333333333, value: 1900}
            let obj = {
                values:this.copy_deep(animState.curves[0].values),
                frame_data:this.copy_deep(animState.clip.curveData.props.y),
                duration:animState.duration,
            }
            animStateData[clip.name] = obj;
        }
        cc.log(animStateData);
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

    /*
    curveData:
    props:
    y: Array(3)
    0: {frame: 0, value: 0, curve: "quadIn"}
    1: {frame: 1, value: 2000}
    2: {frame: 1.3333333333333333, value: 1900}
    length: 3
    duration: 1.3333333333333333
    events: []
    frameRate: 60
    loaded: true
    sample: 60
    speed: 1

    // 添加帧事件
    clip.events.push({
        frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
        func: "frameEvent",     // 回调函数名称
        params: [1, "hello"]    // 回调参数
    });




    let total_y = deff_y / ((stateData.duration-stateData.time_obj.down)/stateData.duration);
    let scale_y = values[1]/total_y;

    animState.curves[0].values[0] = this.node.y-(total_y-deff_y);
    animState.curves[0].values[1] = end_y;
    animState.duration = stateData.duration/scale_y;
    animation.play('speed_b_whole');
    animState.time = stateData.time_obj.down/scale_y;
    let reel_sound_time = (stateData.duration/scale_y - stateData.time_obj.down/scale_y) * 0.8;
    this.delay_do(this.delay_node, reel_sound_time, ()=>{
        this.cb_reel_finish_pre && this.cb_reel_finish_pre();
    });
    this.finish_call = ()=>{
        this.finish_call = null;
        this.cb_reel_finish && this.cb_reel_finish();
    };
    */


    // 工具函数       ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    // param
    // type 1：按指定时间 2：按指定帧
    // appoint_time1            指定时间1
    // appoint_time2            指定时间2
    // appoint_frame1           指定帧1（必须是存在的关键帧）
    // appoint_frame2           指定帧2（必须是存在的关键帧）
    // appoint_y                指定移动到的目标点
    // appoint_act_name         指定动作名
    do_appoint_act(param){
        let type = param.type;
        let appoint_act_name = param.appoint_act_name;
        if(appoint_act_name == null){
            cc.error('appoint_act_name == null');
            return;
        }

        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState(appoint_act_name);
        let stateData = this.animStateData[appoint_act_name];
        if(stateData == null){
            cc.error('error act_name:'+appoint_act_name);
            return;
        }
        let values = stateData.values;
        let frame_data = stateData.frame_data;
        let duration = stateData.duration;

        let time1 = null;
        let time2 = null;
        if(type == 1){
            time1 = param.appoint_time1;
            time2 = param.appoint_time2;
        }else if(type == 2){
            let frame_obj1 = frame_data[param.appoint_frame1];
            if(frame_obj1 == null){
                cc.error('error frame_data:'+param.appoint_frame1);
            }
            let frame_obj2 = frame_data[param.appoint_frame2];
            if(frame_obj2 == null){
                cc.error('error frame_data:'+param.appoint_frame2);
            }
            time1 = frame_obj1.frame;
            time2 = frame_obj2.frame;
        }

        let ago_y = this.node.y;
        let set_values = [];
        for (let index = 0; index < values.length; index++) {
            if(index == 0){
                let value = this.node.y;
                set_values.push(value);
            }else{
                let value = set_values[0] + (values[index]-values[index-1]);
                set_values.push(value);
            }
        }
        animState.curves[0].values = set_values;
        let sample_data1 = this.act_sample(appoint_act_name, time1);
        let sample_data2 = this.act_sample(appoint_act_name, time2);
        let deff_y = sample_data1.y - ago_y;
        cc.log(sample_data1, time1, deff_y);
        cc.log(sample_data2, time2);

        set_values = [];
        for (let index = 0; index < values.length; index++) {
            if(index == 0){
                let value = ago_y - deff_y;
                set_values.push(value);
            }else{
                let value = set_values[index-1]+(values[index]-values[index-1]);
                set_values.push(value);
            }
        }
        animState.curves[0].values = set_values;

        let appoint_y = param.appoint_y;
        let set_duration = duration;
        let time = time1;
        // let set_values = [];
        // for (let index = 0; index < values.length; index++) {
        //     let value = values[index];
        //     set_values.push(value);
        // }
        // animState.curves[0].values = set_values;
        animState.duration = set_duration;
        animation.play(appoint_act_name, time);
        this.delay_do(this.node, time2-time1, ()=>{
            animation.stop();
        })

        cc.log(animation);

        // if(){

        // }

        // 采样时间 1  的坐标y1值
        // 采样时间 2  的坐标y2值

        // 采样坐标1
        // 采样坐标2

        // 100
        // 120


        // 150
        // 300
        // 当前坐标node.y
        // 移动到目标点

        // 计算起始坐标y（对应第0帧的坐标y）
        // 计算结束坐标y（对应最后一帧的坐标y）
        // 播放动作（根据动作名）
        // 修改时间appoint_time1




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
        //     appoint_time1:0,
        //     appoint_time2:0.5,
        //     appoint_frame1:0,
        //     appoint_frame2:0.5,
        //     appoint_act_name:'speed_a_whole',
        // };
        // this.do_appoint_act(param);

        let animation = this.node.getComponent(cc.Animation);
        animation.play('speed_a_whole');
        this.node.y = 100
        animation.sample('speed_a_whole');
        let animState = animation.getAnimationState('speed_a_whole');
        cc.log(animState.time, "animState.time");
        animation.stop();
        
        // 分段取
        
    }

    // 加速
    speed_up_a(){
		this.stop_lock = false;
        this.is_stop = false;
        this.act_state = act_state.speed_up;
        this.delay_node.stopAllActions();
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;

        animState.curves[0].values[0] = this.node.y;
        animState.curves[0].values[1] = this.node.y + values[1];
        animState.duration = stateData.duration;
        animState.wrapMode = cc.WrapMode.Normal;
        animation.play('speed_a_whole');
        this.delay_do(this.delay_node, stateData.time_obj.uniform, ()=>{
            animation.stop();
            this.act_state = act_state.speed_uniform;
            this.speed_uniform_a();
        });
    }

    // 匀速
    speed_uniform_a(run_time=100, move_y?, end_call?){
        // cc.log("匀速");
        let stateData = this.animStateData['speed_a_whole'];

        let uniform_vt = (stateData.config_y.down - stateData.config_y.uniform)/(stateData.time_obj.down - stateData.time_obj.uniform);
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
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        this.act_state = act_state.speed_down;
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;

        if(end_y == null){
            end_y = this.node.y + 125*5;
        }
        let deff_y = end_y - this.node.y;
        let default_down_y = values[1] - stateData.config_y.down;
        if(deff_y >= default_down_y){
            let move_y = deff_y - default_down_y;
            this.speed_uniform_a(null, move_y, ()=>{
                animState.curves[0].values[0] = end_y-values[1];
                animState.curves[0].values[1] = end_y;
                animState.duration = stateData.duration;
                animation.play('speed_a_whole');
                animState.time = stateData.time_obj.down;
                let reel_sound_time = (stateData.duration - stateData.time_obj.down) * 0.8;
                this.delay_do(this.delay_node, reel_sound_time, ()=>{
                    this.cb_reel_finish_pre && this.cb_reel_finish_pre();
                });
                this.finish_call = ()=>{
                    this.finish_call = null;
                    this.cb_reel_finish && this.cb_reel_finish();
                };
                return;
            });
        }else{
            this.delay_node.stopAllActions();
            this.node.stopAllActions();

            let total_y = deff_y / ((stateData.duration-stateData.time_obj.down)/stateData.duration);
            let scale_y = values[1]/total_y;

            animState.curves[0].values[0] = this.node.y-(total_y-deff_y);
            animState.curves[0].values[1] = end_y;
            animState.duration = stateData.duration/scale_y;
            animation.play('speed_a_whole');
            animState.time = stateData.time_obj.down/scale_y;
            let reel_sound_time = (stateData.duration/scale_y - stateData.time_obj.down/scale_y) * 0.8;
            this.delay_do(this.delay_node, reel_sound_time, ()=>{
                this.cb_reel_finish_pre && this.cb_reel_finish_pre();
            });
            this.finish_call = ()=>{
                this.finish_call = null;
                this.cb_reel_finish && this.cb_reel_finish();
            };
        }
    }

    // 加速
    speed_up_b(){
        this.delay_node.stopAllActions();
        this.node.stopAllActions();
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        this.act_state = act_state.speed_up;
        let animState = animation.getAnimationState('speed_b_whole');
        let stateData = this.animStateData['speed_b_whole'];
        let values = stateData.values;

        animState.curves[0].values[0] = this.node.y;
        animState.curves[0].values[1] = this.node.y + values[1];
        animState.duration = stateData.duration;
        animState.wrapMode = cc.WrapMode.Normal;
        animation.play('speed_b_whole');
        this.delay_do(this.delay_node, stateData.time_obj.uniform, ()=>{
            animation.stop();
            this.act_state = act_state.speed_uniform;
            this.speed_uniform_b();
        });
    }

    // 匀速
    speed_uniform_b(run_time=100, move_y?, end_call?){
        // cc.log("匀速");
        let stateData = this.animStateData['speed_b_whole'];

        let uniform_vt = (stateData.config_y.down - stateData.config_y.uniform)/(stateData.time_obj.down - stateData.time_obj.uniform);
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
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        this.act_state = act_state.speed_down;
        let animState = animation.getAnimationState('speed_b_whole');
        let stateData = this.animStateData['speed_b_whole'];
        let values = stateData.values;

        if(end_y == null){
            end_y = this.node.y + 125*5;
        }
        let deff_y = end_y - this.node.y;
        let default_down_y = values[1] - stateData.config_y.down;
        if(deff_y >= default_down_y){
            let move_y = deff_y - default_down_y;
            this.speed_uniform_a(null, move_y, ()=>{
                animState.curves[0].values[0] = end_y-values[1];
                animState.curves[0].values[1] = end_y;
                animState.duration = stateData.duration;
                animation.play('speed_b_whole');
                animState.time = stateData.time_obj.down;
                let reel_sound_time = (stateData.duration - stateData.time_obj.down) * 0.8;
                this.delay_do(this.delay_node, reel_sound_time, ()=>{
                    this.cb_reel_finish_pre && this.cb_reel_finish_pre();
                });
                this.finish_call = ()=>{
                    this.finish_call = null;
                    this.cb_reel_finish && this.cb_reel_finish();
                };
                return;
            });
        }else{
            this.delay_node.stopAllActions();
            this.node.stopAllActions();

            let total_y = deff_y / ((stateData.duration-stateData.time_obj.down)/stateData.duration);
            let scale_y = values[1]/total_y;

            animState.curves[0].values[0] = this.node.y-(total_y-deff_y);
            animState.curves[0].values[1] = end_y;
            animState.duration = stateData.duration/scale_y;
            animation.play('speed_b_whole');
            animState.time = stateData.time_obj.down/scale_y;
            let reel_sound_time = (stateData.duration/scale_y - stateData.time_obj.down/scale_y) * 0.8;
            this.delay_do(this.delay_node, reel_sound_time, ()=>{
                this.cb_reel_finish_pre && this.cb_reel_finish_pre();
            });
            this.finish_call = ()=>{
                this.finish_call = null;
                this.cb_reel_finish && this.cb_reel_finish();
            };
        }
    }

    // 停止当前动作
    stop_curr_act(){
        this.delay_node.stopAllActions(); // 延迟
        this.node.stopAllActions();  //匀速
        this.timing_node.stopAllActions(); //外部定时
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();  //动作
    }
    speed_up(){
        this.speed_state = 1;
        if(this.act_state != act_state.none){
            this.stop_curr_act();
        }
        this.speed_up_a();
    }
    speed_down(end_y?){
        if(this.act_state != act_state.speed_uniform){
            this.stop_curr_act();
            if(this.speed_state == 1){
                this.speed_uniform_a();
            }else{
                this.speed_uniform_b();
            }
        }
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
