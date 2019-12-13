// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.aim_x = 0;
        this.tween_act_list = [];
    },

    start () {
        this.create_speed_up();
        this.create_speed_uniform();
        this.create_speed_down();
    },
    //加速
    create_speed_up () {
        let speed_up= cc.tween();
        speed_up.by(2, {x:1000}); 
        speed_up.call(()=>{
            cc.log("执行匀速");
            this.speed_uniform.start();
        });
        this.speed_up = speed_up;
        this.tween_act_list.push(speed_up);
    },

    // 匀速
    create_speed_uniform () {
        let speed_uniform= cc.tween({x:0});
        speed_uniform.by(4, {x:4000});
        speed_uniform.call(()=>{
            cc.log("执行匀速");
            this.speed_uniform.start();
        });
        this.speed_uniform = speed_uniform;
        this.tween_act_list.push(speed_uniform);
    },

    // 减速
    create_speed_down () {
        cc.log(this.aim_x);
        let speed_down= cc.tween({x:0});
        speed_down.to(1, {x:this.aim_x});
        speed_down.call(()=>{
            cc.log("停止");
        });
        this.speed_down = speed_down;
        this.tween_act_list.push(speed_down);
    },

    // 开始旋转
    start_wheel(obj){
        this.run_target = obj;
        this.stop_all_tween();
        this.speed_up.target(this.run_target);
        this.speed_uniform.target(this.run_target);
        this.speed_up.start();
    },

    // 停止旋转
    stop_wheel (obj) {
        this.run_target = obj;
        this.stop_all_tween();
        this.aim_x = 90;
        this.speed_down.target(this.run_target);
        this.speed_down.start();
    },

    // 停止所有动作
    stop_all_tween(){
        for (let index = 0; index < this.tween_act_list.length; index++) {
            let act = this.tween_act_list[index];
            if(act._finalAction && act._finalAction.target != null){
                act.stop();
            }
        }
    },

    // update(){
    //     cc.log(this.run_target);
    // }

    // 节点不可用 停止正在执行的动作
    onDisable(){
        this.stop_all_tween();
    },
});
