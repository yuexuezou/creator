import wheel_mgr from './wheel_mgr';

const {ccclass, property} = cc._decorator;

@ccclass
export default class game_7 extends cc.Component {
    @property({
        type: wheel_mgr,
        tooltip:"滚轮动作",
    })
    wheel_mgr: wheel_mgr = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {
        // this.result = [
        //     {id:13},{id:13},{id:13},{id:13},{id:13},
        //     {id:5},{id:5},{id:5},{id:5},{id:5},
        //     {id:4},{id:4},{id:4},{id:4},{id:4},
        //     {id:7},{id:7},{id:7},{id:7},{id:7},
        // ];
        this.wheel_mgr.setInitResult([{id:1},{id:2},{id:3},{id:4}]);
    }

    
    // update (dt) {}
}
