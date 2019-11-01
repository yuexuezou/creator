cc.Class({
    extends: cc.Component,

    properties: {
        up_speed:{
            default:540,
            tooltip:"加速速度（即up_speed_time时间转多少角度）"
        },
        up_speed_time:{
            default:2.5,
            tooltip:"加速时间"
        },
        uniform_speed:{
            default:2880,
            tooltip:"匀速角度"
        },
        uniform_speed_time:{
            default:4,
            tooltip:"匀速时间"
        },
        down_speed:{
            default:540,
            tooltip:"减速角度"
        },
        down_speed_time:{
            default:2.5,
            tooltip:"减速时间"
        },
        aim_angle:{
            default:0,
            tooltip:"旋转结束停止的角度"
        },
        direction:{
            default:1,
            tooltip:"旋转方向  1:顺时针   -1:逆时针"
        },
    },
    start(){
        // 设置停止的角度
        this.set_aim_angle(-90);
        this.stop_rolling();
    },

    // 滚动 动作
    roll_act(end_call){
        let direction = this.direction;
        let aim_angle = this.aim_angle;

        let up_speed_angle = direction*this.up_speed;
        let uniform_speed_angle = direction*this.uniform_speed;
        let down_speed_angle = direction*this.down_speed;
        // 当前角度
        let cur_angle = this.node.angle%360;
        // 预计角度
        let expect_angle = (up_speed_angle + uniform_speed_angle + down_speed_angle)%360;
        // 修正角度
        let extra_angle = aim_angle - (cur_angle + expect_angle);
        uniform_speed_angle = uniform_speed_angle + extra_angle;

        let up_speed = cc.rotateBy(this.up_speed_time, up_speed_angle).easing(cc.easeCubicActionIn());
        let uniform_speed = cc.rotateBy(this.uniform_speed_time, uniform_speed_angle);

        let random_angle = - 16 + Math.random(0, 1) * 39
        let down_speed = cc.rotateBy(this.down_speed_time, down_speed_angle-random_angle).easing(cc.easeCubicActionOut());

        let re_angle = random_angle;
        let re_set = cc.rotateBy(0.5, re_angle).easing(cc.easeBackOut());
        let call_func = cc.callFunc(()=>{
            if(end_call){
                end_call();
            }
        })
        let seq = cc.sequence(up_speed, uniform_speed, down_speed, re_set, call_func);
        return seq;
    },
    // 开始旋转
    start_rolling(end_call){
        this.node.runAction(this.roll_act(end_call));
    },

    // 设置停止的角度
    set_aim_angle(angle){
        this.aim_angle = angle;
    },
    // 启动旋转
    go_rolling(max_do){
        let direction = this.direction;
        let up_speed_angle = direction*this.up_speed;
        let uniform_speed_angle = direction*this.uniform_speed;

        let up_speed = cc.rotateBy(this.up_speed_time, up_speed_angle).easing(cc.easeCubicActionIn());
        let call_func = cc.callFunc(()=>{
            if(max_do){
                max_do();
            }
            let uniform_speed = cc.rotateBy(this.uniform_speed_time, uniform_speed_angle);
            this.node.runAction(cc.repeatForever(uniform_speed));
        })
        let seq = cc.sequence(up_speed, call_func);
        this.node.runAction(seq);
    },
  
    stop_rolling(end_call){
        this.node.stopAllActions();
        let direction = this.direction;
        let aim_angle = this.aim_angle;
        let uniform_speed_angle = direction*this.uniform_speed;
        let down_speed_angle = direction*this.down_speed;
        // 当前角度
        let cur_angle = this.node.angle%360;
        // 预计角度
        let expect_angle = down_speed_angle%360;
        // 修正角度
        let extra_angle = aim_angle - (cur_angle + expect_angle);
        let uniform_s = Math.abs(this.uniform_speed_time/uniform_speed_angle);
        let uniform_speed_time =  extra_angle*uniform_s
        let uniform_speed = cc.rotateBy(uniform_speed_time, extra_angle);

        
        // 左右摆浮
        let about = 18;
        if(about>22.5){
            about = 22.5;
        }
        let random_angle = (0-about) + Math.random(0, 1) * about*2;
        
        let down_speed = cc.rotateBy(this.down_speed_time, down_speed_angle-random_angle).easing(cc.easeCubicActionOut());

        let re_angle = random_angle;
        let re_set = cc.rotateBy(0.5, re_angle).easing(cc.easeBackOut());
        let call_func = cc.callFunc(()=>{
            if(end_call){
                end_call();
            }
        })
        let seq = cc.sequence(uniform_speed, down_speed, re_set, call_func);
        this.node.runAction(seq);
    }
});
