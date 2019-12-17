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
    animStateData:{
        speed_a_up:any;
        speed_a_uniform:any;
        speed_a_down:any;
        stop_back:any;
    };

    copy_deep:Function;
    onLoad () {
        this.copy_deep = this.local_copy_deep;
        let animation = this.node.getComponent(cc.Animation);
        animation.on('play',      this.onPlay,        this);
        animation.on('stop',      this.onStop,        this);
        animation.on('finished',  this.onFinished,    this);
        animation.on('pause',     this.onPause,       this);
        animation.on('resume',    this.onResume,      this);
        this.animation = animation;
        this.init_data();

    }

    // 存储动作基本数据数据
    init_data(){
        let animation = this.node.getComponent(cc.Animation);

        let animStateData = this.animStateData;
        for (const key in animStateData) {
            let animState = animation.getAnimationState(key);
            animStateData[key] = this.copy_deep(animState.curves[0].values);
        }
    }

    // ----------------------------------------------
    // 动作事件
    onPlay(event_name, AnimationState?){
        cc.log("onPlay", event_name, AnimationState.name);
    }

    onStop(event_name, AnimationState?){
        cc.log("onStop", event_name, AnimationState.name);
    }

    onFinished(event_name, AnimationState?){
        let act_name = AnimationState.name;
        if(act_name == 'speed_a_up'){
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
        cc.log("onPause", event_name, AnimationState.name);
    }

    onResume(event_name, AnimationState?){
        cc.log("onResume", event_name, AnimationState.name);
    }

    // ----------------------------------------------
    // 加速
    speed_a_up(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('speed_a_up');
        animState.curves[0].values[0] = 0;
        animState.curves[0].values[1] = 2000;
        animation.play('speed_a_up');
    }

    speed_a_uniform(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('speed_a_uniform');
        animState.curves[0].values[0] = 0;
        animState.curves[0].values[1] = 2000;
        animation.play('speed_a_uniform');
    }

    speed_a_down(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('speed_a_down');
        animState.curves[0].values[0] = 0;
        animState.curves[0].values[1] = 2000;
        animation.play('speed_a_down');
    }

    stop_back(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        let animState = animation.getAnimationState('stop_back');
        animState.curves[0].values[0] = 0;
        animState.curves[0].values[1] = 2000;
        animation.play('stop_back');
    }




    //加速
    run_speed_up () {
        // 0.1 * 200
        let move1 = cc.moveBy(0.5, cc.v2(0, 1000));
        move1.easing(cc.easeSineIn());

        let call_func = cc.callFunc(()=>{
            this.run_speed_uniform ();
        });
        let seq = cc.sequence(move1, call_func);
        this.node.stopAllActions();
        this.node.runAction(seq);
        // this.delay_do(0.5-0.02, ()=>{
        //     this.record_a = this.node.y;
        //     cc.log(this.record_a)
        // });
        // this.delay_do(0.5, ()=>{
        //     this.record_b = this.node.y;
        //     cc.log(this.record_b - this.record_a, "----------")
        // });
    }

    // 匀速
    run_speed_uniform () {
        let move1 = cc.moveBy(2, cc.v2(0, 5600));
        let call_func = cc.callFunc(()=>{
            this.run_speed_uniform ();
        });
        let seq = cc.sequence(move1, call_func);
        this.node.runAction(seq);
    }

    // 减速
    run_speed_down (aim_pos:cc.Vec2) {
        let aim_pos1 = cc.v2(0, aim_pos.y-152);
        // let aim_pos1 = cc.v2(0, aim_pos.y);
        // cc.log(aim_pos.y-this.node.y);
        let move1 = cc.moveTo(0.23, aim_pos1);
        let move2 = cc.moveTo(0.28, aim_pos);
        move2.easing(cc.easeBackOut());
        let call_func = cc.callFunc(()=>{
            this.end_call && this.end_call();
        });
        let seq = cc.sequence(move1, move2, call_func);
        // let seq = cc.sequence(move1, call_func);
        this.node.stopAllActions();
        this.node.runAction(seq);

        this.delay_do(0.28, this.pre_end_call);
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

    // 开始旋转
    start_wheel(){
        this.run_speed_up();
    }

    // 停止旋转
    stop_wheel (param) {
        this.end_call = param.end_call;
        this.pre_end_call = param.pre_end_call;

        this.run_speed_down(param.aim_pos);
    }
    // 继续
    continue_wheel(){
        this.node.stopAllActions();
        this.run_speed_uniform()
    }

    test_1(){
        let anim = this.node.getComponent(cc.Animation);
        anim.stop();
        let animState = anim.getAnimationState('speed_a_up');
        // animState.curves[0].types[0] = [0.2, 0.3, 0.5, 1.9];

        cc.log(animState.curves);
        // cc.log(animState.curves[0].types);
        // animState.curves[0].types[0] = [0.2, 0.3];//, 0.5, 1.9

        animState.curves[0].values[0] = 0;    //new cc.Vec3(0, 0, 0);
        animState.curves[0].values[1] = 2000; //new cc.Vec3(0, 2000, 0);//{x: -400, y: 100, z: 0};
        anim.play('speed_a_up');

        // cc.log(animState);
        // animState.time = 0.9;

        
        // onPlay
        // onPause
        // onResume
        // onStop
        // onError
        // play 播放动画。
        // stop 停止动画播放。
        // pause 暂停动画。
        // resume 重新播放动画。
        // step 执行一帧动画。
    }

    test_2(){
        let anim = this.node.getComponent(cc.Animation);
        let animState = anim.getAnimationState('speed_a_down');
        // animState.curves[0].types[0] = [0.2, 0.3, 0.5, 1.9];

        cc.log(animState.curves);
        // cc.log(animState.curves[0].types);
        // animState.curves[0].types[0] = [0.2, 0.3];//, 0.5, 1.9
        animState.curves[0].values[0] = new cc.Vec3(0,0,0);
        animState.curves[0].values[1] = new cc.Vec3(0,900,0);//{x: -400, y: 100, z: 0};
        anim.play('speed_a_down');

        cc.log(animState);
        animState.time = 0;
    }

    test_3(){
        this.node.y = this.node.y + 5;
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
