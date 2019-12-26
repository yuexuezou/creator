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

    // 存储动作基本数据数据
    init_data(){
        let animation = this.node.getComponent(cc.Animation);
        this.animStateData = {};
        let animStateData = this.animStateData;
        let clips = animation.getClips();
        for (let index = 0; index < clips.length; index++) {
            let clip = clips[index];
            let animState = animation.getAnimationState(clip.name);
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
            let frame_obj2 = frame_data[param.appoint_frame1];
            if(frame_obj2 == null){
                cc.error('error frame_data:'+param.appoint_frame2);
            }
            time1 = frame_obj1.frame;
            time2 = frame_obj2.frame;
        }

        // this.node.y
        // time1
        // time1

        // param.appoint_y                指定移动到的目标点
        // param.appoint_act_name         指定动作名

        // if(){

        // }

        // 采样时间 1  的坐标y1值
        // 采样时间 2  的坐标y2值

        // 计算起始坐标y（对应第0帧的坐标y）
        // 计算结束坐标y（对应最后一帧的坐标y）
        // 播放动作（根据动作名）
        // 修改时间appoint_time1
        // 添加帧事件
        // 1个动画就加一个帧事件

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
