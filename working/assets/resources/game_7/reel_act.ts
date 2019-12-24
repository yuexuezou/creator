// 滚轮动作

enum act_state{
    none = 0,
    speed_a_up = 1,
    speed_a_uniform = 2,
    speed_a_down = 3,
    speed_b_up = 4,
    speed_b_uniform = 5,
    speed_b_down = 6,
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
    config_time: { uniform: number; down: number; };
    config_y: { uniform: number; down: number; };
    uniform_node: cc.Node;
    down_node: cc.Node;
    end_time_call: Function;
    down_time_call: Function;
    uniform_time_call: Function;
    act_uniform: cc.Action;
    act_state:act_state;
    onLoad () {
        // 时间动作按照 时间 为1 帧率 60 计算
        // 5 * 6 = 30    7 * 6 = 42
        //（从编辑器确定）0.30帧 转换成秒 1=60
        this.config_time = {
            uniform:0.5, //30 帧 第几秒开始匀速
            down:0.7,   //42 帧 第几秒开始减速
        }
        this.config_y = {
            uniform:0,
            down:0,
        }

        this.node.y = 0;
        this.copy_deep = this.local_copy_deep;
        this.init_data();
        let animation = this.node.getComponent(cc.Animation);
        animation.on('finished',  this.onFinished,    this);
        this.create_node('uniform_node');
        this.create_node('down_node');
        this.act_state = act_state.none;
    }
    event_uniform_time(){
        cc.log(this.uniform_time_call);
        this.uniform_time_call && this.uniform_time_call();
        this.uniform_time_call = null;
        cc.log('event_uniform_time');
    }
    event_down_time(){
        cc.log(this.down_time_call);
        this.down_time_call && this.down_time_call();
        this.down_time_call = null;
        cc.log('event_down_time');
    }
    event_end_time(){
        cc.log(this.end_time_call);
        this.end_time_call && this.end_time_call();
        this.end_time_call = null;
        cc.log('event_end_time');
    }

    onFinished(event_name, AnimationState?){
        let act_name = AnimationState.name;
        if(act_name == 'speed_a_whole'){
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
            const clip = clips[index];
            let animState = animation.getAnimationState(clip.name);

            let config_y = {};
            let time_obj = {};
            for (const key in this.config_time) {
                let time = this.config_time[key] * animState.duration;
                animation.play(clip.name, time);
                // 采样
                animation.sample(clip.name);
                config_y[key] = this.node.y;
                animation.stop();
                time_obj[key] = time;
            }

            let obj = {
                values:this.copy_deep(animState.curves[0].values),
                // types:this.copy_deep(animState.curves[0].types[0]),
                duration:animState.duration,
                config_y:config_y,
                time_obj:time_obj,
            }
            animStateData[clip.name] = obj;
        }
        cc.log(this.config_time);
        cc.log(this.animStateData);
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


    // 加速
    speed_a_whole(){
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;
        animState.curves[0].values[0] = this.node.y + values[0];
        animState.curves[0].values[1] = this.node.y + values[1];
        animState.speed = 1;
        animation.play('speed_a_whole');

    }

    speed_b_whole(){
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_b_whole');
        let stateData = this.animStateData['speed_b_whole'];
        let values = stateData.values;
        animState.curves[0].values[0] = this.node.y + values[0];
        animState.curves[0].values[1] = this.node.y + values[1];
        animState.speed = 1;
        animation.play('speed_b_whole');
    }
    // 加速
    speed_up_a(){
        if(this.act_state != act_state.none){
            return;
        }
        cc.log("加速");
        this.act_state = act_state.speed_a_up;
        this.uniform_node.stopAllActions();
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;

        animState.curves[0].values[0] = this.node.y;
        animState.curves[0].values[1] = this.node.y + values[1];
        animState.duration = stateData.duration;
        animState.wrapMode = cc.WrapMode.Normal;
        animation.play('speed_a_whole');
        cc.log('匀速uniform', stateData.time_obj.uniform);
        this.delay_do(this.uniform_node, stateData.time_obj.uniform, ()=>{
            cc.log('匀速');
            animation.stop();
            this.act_state = act_state.speed_a_uniform;
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
            // let move = cc.moveBy(time, cc.v2(0, move_y));
            // let call_func = cc.callFunc(()=>{
            //     end_call && end_call();
            // });
            // let seq = cc.sequence(move, call_func);
            // this.act_uniform = this.node.runAction(seq);

            // let seq = cc.sequence(move, call_func);
            // this.act_uniform = this.node.runAction(seq);

            this.delay_do(this.uniform_node, time, ()=>{
                this.node.stopAllActions();
                end_call && end_call();
            });
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.speed_uniform_a();
            });
            let seq = cc.sequence(move, call_func);
            this.act_uniform = this.node.runAction(seq);
        }
    }

    // 减速+回弹
    speed_down_a(end_y?:any){
        if(this.act_state != act_state.speed_a_uniform){
            return;
        }
        this.act_state = act_state.speed_a_down;
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();

        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;

        // animState.curves[0].values[1] = this.node.y + values[1];

        // 减速距离 小于设定值
        // 按比例播放
        // 大于等于设定值 则再匀速一段时间

        // let end_y = this.node.y + 125*10;
        // let end_y = this.node.y + values[1];
        if(end_y == null){
            end_y = this.node.y + 125*5;
        }
        let deff_y = end_y - this.node.y;
        let default_down_y = values[1] - stateData.config_y.down;
        if(deff_y >= default_down_y){
            
            let move_y = deff_y - default_down_y;
            cc.log("???", move_y);
            this.speed_uniform_a(null, move_y, ()=>{
                cc.log("减速");
                animState.curves[0].values[0] = this.node.y - stateData.config_y.down; //(stateData.config_y.down/scale_y);
                animState.curves[0].values[1] = this.node.y + values[1] - stateData.config_y.down;
                animation.play('speed_a_whole');
                animState.time = stateData.time_obj.down;
                this.finish_call = ()=>{
                    this.finish_call = null;
                    cc.log("完成");
                };
                return;
            });
        }else{
            this.uniform_node.stopAllActions();
            if(this.act_uniform){
                this.node.stopAction(this.act_uniform);
            }
            let scale_y = values[1]/deff_y;
            animState.curves[0].values[0] = this.node.y-(stateData.config_y.down/scale_y); //(stateData.config_y.down/scale_y);
            animState.curves[0].values[1] = end_y;
            animState.duration = stateData.duration/scale_y;
            animation.play('speed_a_whole');
            animState.time = stateData.time_obj.down/scale_y;
            this.finish_call = ()=>{
                this.finish_call = null;
                cc.log("完成");
            };
        }

        // cc.log(this.node.y, stateData.config_y.down, "ago y");
        // animState.curves[0].values[0] = this.node.y - stateData.config_y.down; //(stateData.config_y.down/scale_y);
        // animState.curves[0].values[1] = this.node.y + values[1] - stateData.config_y.down;
        // // animState.duration = stateData.duration/scale_y;
        // animation.play('speed_a_whole');
        // animState.time = this.config_time.down;

        // cc.log(animState.time, this.config_time.down, this.node.y, "time  ==? this.config_time.down");

        // this.delay_do(this.down_node, animState.duration - animState.time, ()=>{
        //     animation.stop();
        //     this.cb_reel_finish && this.cb_reel_finish();
        //     cc.log("结束");
        // });

        // this.finish_call = null;
    }


    test_1(){
        // this.speed_a_whole();
        this.speed_up_a();
    }

    test_2(){
        this.speed_down_a();
    }

    test_3(){
        this.node.y = this.node.y + 1;
        cc.log(this.node.y);
    }

    test_4(){
        let animation = this.node.getComponent(cc.Animation);
        animation.pause();
    }

    test_5(){
        let animation = this.node.getComponent(cc.Animation);
        animation.resume();
    }

    // 加速
    speed_up_b(){
        cc.log("加速b");
        this.act_state = act_state.speed_a_up;
        this.uniform_node.stopAllActions();
        this.node.stopAllActions();
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('speed_b_whole');
        let stateData = this.animStateData['speed_b_whole'];
        let values = stateData.values;

        animState.curves[0].values[0] = this.node.y;
        animState.curves[0].values[1] = this.node.y + values[1];
        animState.duration = stateData.duration;
        animState.wrapMode = cc.WrapMode.Normal;
        animation.play('speed_b_whole');
        cc.log('匀速uniform', stateData.time_obj.uniform);
        this.delay_do(this.uniform_node, stateData.time_obj.uniform, ()=>{
            cc.log('匀速');
            animation.stop();
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
            // let move = cc.moveBy(time, cc.v2(0, move_y));
            // let call_func = cc.callFunc(()=>{
            //     end_call && end_call();
            // });
            // let seq = cc.sequence(move, call_func);
            // this.act_uniform = this.node.runAction(seq);

            // let seq = cc.sequence(move, call_func);
            // this.act_uniform = this.node.runAction(seq);

            this.delay_do(this.uniform_node, time, ()=>{
                this.node.stopAllActions();
                end_call && end_call();
            });
        }else{
            let time = run_time;
            let end_y = this.node.y + uniform_vt*time;
            let move = cc.moveTo(time, cc.v2(0, end_y));
            let call_func = cc.callFunc(()=>{
                this.speed_uniform_b();
            });
            let seq = cc.sequence(move, call_func);
            this.act_uniform = this.node.runAction(seq);
        }
    }

    test_6(){
        this.speed_up_b();

    }

    test_7(){
        // let animation = this.node.getComponent(cc.Animation);
        // animation.stop();

        // let animState = animation.getAnimationState('speed_b_whole');
        // animState.stop();
        // let stateData = this.animStateData['speed_b_whole'];
        // let values = stateData.values;
        // animation.playAdditive('speed_b_whole');
        cc.log("7777777");
        if(this.act_uniform){
            if(this.act_uniform.isDone){
                cc.log("????");
            }else{
                cc.log("OK");
                
            }
            cc.speed(this.act_uniform_seq, 30);
        }
        cc.log("888888888");
        
    }

    test_8(){

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
