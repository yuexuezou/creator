import wheel_act from './wheel_act';

const {ccclass, property} = cc._decorator;

@ccclass
export default class game_7 extends cc.Component {
    @property({
        type: wheel_act,
        tooltip:"滚轮动作",
    })
    wheel_act: wheel_act = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

    }

    // 点击事件
    click_ddddddddddddd () {
        this.wheel_act.run_speed_down(cc.v2(0, 200));

    }
    // update (dt) {}
}
