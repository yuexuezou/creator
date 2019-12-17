// 滚轮动作

const {ccclass} = cc._decorator;

@ccclass
export default class wheel_act extends cc.Component {
    // 结束前回调（播音效）
    pre_end_call:Function;
    // 停止回调
    end_call:Function;

    animation: cc.Animation;

    // 动作原始数据
    animStateData:object;

    copy_deep:Function;
    onLoad () {
        this.animStateData = {
            speed_a_up:null,
            speed_a_uniform:null,
            speed_a_down:null,
            stop_back:null,
        }

        this.copy_deep = this.local_copy_deep;
        let animation = this.node.getComponent(cc.Animation);
        animation.on('play',      this.onPlay,        this);
        animation.on('stop',      this.onStop,        this);
        animation.on('finished',  this.onFinished,    this);
        animation.on('pause',     this.onPause,       this);
        animation.on('resume',    this.onResume,      this);
        this.animation = animation;
        this.init_data();

        // this.time = 0;
    }
    // update(dt){
    //     if(this.time != 0){
    //         this.time = this.time + dt;
    //         if(this.time >= 2){
    //             this.time = 0;
    //         }else{
    //             return;
    //         }
    //     }
    //     this.time = this.time + dt;
    //     cc.log(this.node.y);
    // }

    // 存储动作基本数据数据
    init_data(){
        let animation = this.node.getComponent(cc.Animation);

        let animStateData = this.animStateData;
        for (const key in animStateData) {
            let animState = animation.getAnimationState(key);
            animStateData[key] = this.copy_deep(animState.curves[0].values);
            cc.log(animStateData[key]);
        }
    }

    // ----------------------------------------------
    // 动作事件
    onPlay(event_name, AnimationState?){
        // cc.log("onPlay", event_name, AnimationState.name);
    }

    onStop(event_name, AnimationState?){
        // cc.log("onStop", event_name, AnimationState.name);
    }

    onFinished(event_name, AnimationState?){
        let act_name = AnimationState.name;
        if(act_name == 'speed_a_up'){
            this.speed_a_uniform();
        }else if(act_name == 'speed_a_uniform'){
            this.speed_a_uniform();
        }else if(act_name == 'speed_a_down'){
            // 减速后
            this.pre_end_call && this.pre_end_call();
            this.stop_back();
        }else if(act_name == 'stop_back'){
            this.end_call && this.end_call();
        }
    }

    onPause(event_name, AnimationState?){
        // cc.log("onPause", event_name, AnimationState.name);
    }

    onResume(event_name, AnimationState?){
        // cc.log("onResume", event_name, AnimationState.name);
    }

    // ----------------------------------------------
    // 加速
    speed_a_up(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('speed_a_up');
        let values = this.animStateData['speed_a_up'];
        animState.curves[0].values[0] = this.node.y + values[0];
        animState.curves[0].values[1] = this.node.y + values[1];
        animation.play('speed_a_up');
    }

    speed_a_uniform(){
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_uniform');
        let values = this.animStateData['speed_a_uniform'];
        animState.curves[0].values[0] = this.node.y + values[0];
        animState.curves[0].values[1] = this.node.y + values[1];
        animation.play('speed_a_uniform');
    }

    speed_a_down(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('speed_a_down');
        let values = this.animStateData['speed_a_down'];

        animState.curves[0].values[0] = this.node.y + values[0];
        animState.curves[0].values[1] = this.node.y + values[1];
        animation.play('speed_a_down');
    }

    stop_back(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('stop_back');
        let values = this.animStateData['stop_back'];
        animState.curves[0].values[0] = this.node.y + values[0];
        animState.curves[0].values[1] = this.node.y + values[1];
        animation.play('stop_back');
    }

    // 延迟执行
    delay_do(time:number, call_func:Function){
        let delay = cc.delayTime(time);
        let call_1 = cc.callFunc(()=>{
            call_func && call_func();
        });
        let seq1 = cc.sequence(delay, call_1);
        this.node.runAction(seq1);
    }

    test_1(){
        this.speed_a_up();
    }

    test_2(){
        this.speed_a_down();
    }

    test_3(){
        this.node.y = this.node.y + 1;
    }

    test_4(){
        let animation = this.node.getComponent(cc.Animation);
        animation.pause();
    }

    test_5(){
        let animation = this.node.getComponent(cc.Animation);
        animation.resume();
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
