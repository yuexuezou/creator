// 滚轮动作

const {ccclass} = cc._decorator;

@ccclass
export default class wheel_act extends cc.Component {
    // 结束前回调（播音效）
    pre_end_call:Function;
    // 停止回调
    end_call:Function;
    // 动作停止回调
    finish_call:Function;

    animation: cc.Animation;

    // 动作原始数据
    animStateData:object;

    copy_deep:Function;
    onLoad () {
        this.copy_deep = this.local_copy_deep;
        this.init_data();
        // this.time = 0;
        let animation = this.node.getComponent(cc.Animation);
        animation.on('finished',  this.onFinished,    this);
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

    onFinished(event_name, AnimationState?){
        let act_name = AnimationState.name;
        if(act_name == 'speed_a_whole'){
            this.finish_call && this.finish_call();
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
            let obj = {
                values:this.copy_deep(animState.curves[0].values),
                types:this.copy_deep(animState.curves[0].types[0]),
            }
            animStateData[clip.name] = obj;
        }
        cc.log(this.animStateData);
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
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;
        let types = stateData.types;

        let obj = [];
        obj[0] = types[0];
        obj[1] = types[1];
        obj[2] = types[1];
        obj[3] = types[1];
        animState.curves[0].types[0] = obj;
        animState.curves[0].values[0] = this.node.y;
        animState.curves[0].values[1] = this.node.y + values[1];
        animation.play('speed_a_whole');
        animState.speed = 1;
        this.finish_call = ()=>{
            this.finish_call = null;
            this.speed_uniform_a();
        }
    }
    // 匀速
    speed_uniform_a(){
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;
        let types = stateData.types;

        let obj = [];
        obj[0] = types[1];
        obj[1] = types[1];
        obj[2] = types[1];
        obj[3] = types[1];
        animState.curves[0].types[0] = obj;
        animState.curves[0].values[0] = this.node.y;
        animState.curves[0].values[1] = this.node.y + values[1];
        animation.play('speed_a_whole');
        animState.speed = 1;
        this.finish_call = ()=>{
            this.finish_call = null;
            this.speed_uniform_a();
        }
    }
    // 减速+回弹
    speed_down_a(){
        let animation = this.node.getComponent(cc.Animation);
        let animState = animation.getAnimationState('speed_a_whole');
        let stateData = this.animStateData['speed_a_whole'];
        let values = stateData.values;
        let types = stateData.types;

        let obj = [];
        obj[0] = types[2]*0.92;
        obj[1] = types[2]*0.92;
        obj[2] = types[2]*0.92;
        obj[3] = types[3]*0.92;
        animState.curves[0].types[0] = obj;
        animState.curves[0].values[0] = this.node.y;
        // animState.curves[0].values[1] = this.node.y + values[1];
        
        let end_y = this.node.y + 125*100;
        // let end_y = this.node.y + values[1];
        
        let deff_y = end_y - this.node.y;
        let speed = values[1]/deff_y;
        // let speed = 0.6;
        

        animState.curves[0].values[1] = end_y;
        animState.play();
        cc.log(speed, animState.duration, animState.duration/speed);
        animState.speed = speed;
        this.finish_call = ()=>{
            this.finish_call = null;
            this.end_call && this.end_call();
        };

        this.delay_do(animState.duration/speed, ()=>{
            cc.log("finish");
        });
    }

    test_1(){
        // this.speed_a_wholeup();
        // this.speed_a_whole();
        this.speed_up_a();
    }

    test_2(){
        this.speed_down_a();
    }

    test_3(){
        // this.node.y = this.node.y + 1;
    }

    test_4(){
        let animation = this.node.getComponent(cc.Animation);
        animation.pause();
    }

    test_5(){
        let animation = this.node.getComponent(cc.Animation);
        animation.resume();
    }

    test_6(){
        this.speed_b_whole();
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
