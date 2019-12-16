// 滚轮动作


const {ccclass, property} = cc._decorator;

@ccclass
export default class wheel_act extends cc.Component {
    // 结束前回调（播音效）
    pre_end_call:Function;
    // 停止回调
    end_call:Function;


    // onLoad () {}

    start () {

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
        let animState = anim.getAnimationState('speed_a_down');
        // animState.curves[0].types[0] = [0.2, 0.3, 0.5, 1.9];

        cc.log(animState.curves);
        // cc.log(animState.curves[0].types);
        // animState.curves[0].types[0] = [0.2, 0.3];//, 0.5, 1.9
        animState.curves[0].values[0] = new cc.Vec3(0,100,0);
        animState.curves[0].values[1] = new cc.Vec3(0,-900,0);//{x: -400, y: 100, z: 0};
        anim.play('speed_a_down');

        cc.log(animState);
        animState.time = 0.9;
    }

    test_2(){
        let anim = this.node.getComponent(cc.Animation);
        let animState = anim.getAnimationState('speed_a_down');
        // animState.curves[0].types[0] = [0.2, 0.3, 0.5, 1.9];

        cc.log(animState.curves);
        // cc.log(animState.curves[0].types);
        // animState.curves[0].types[0] = [0.2, 0.3];//, 0.5, 1.9
        animState.curves[0].values[0] = new cc.Vec3(0,0,0);
        animState.curves[0].values[1] = new cc.Vec3(0,-900,0);//{x: -400, y: 100, z: 0};
        anim.play('speed_a_down');

        cc.log(animState);
        animState.time = 0;
    }

    /*
        通过动作列表更新动作

        开始滚动加速
            时间
            距离

        切换匀速
            时间
            距离
        开始停止减速
            时间
            距离

        停止中断
            时间
            距离
        加快旋转
            时间
            距离

        无缝切换动作

        获取对等的速度的时间
        移动距离计算


        怎么做的无缝 加减速
            减速中点了加速（开始减速后被告知要加速）
                以相同的速度曾速

            加速中点了减速（不想看期待点了停止）

            匀速中点了减速（正常停）

            匀速中点了加速（正常加速）





    */


}
