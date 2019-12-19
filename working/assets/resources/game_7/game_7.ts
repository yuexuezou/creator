import reel_mgr from './reel_mgr';

const {ccclass, property} = cc._decorator;

@ccclass
export default class game_7 extends cc.Component {
    @property({
        type: reel_mgr,
        tooltip:"滚轮动作",
    })
    reel_mgr: reel_mgr = null;

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
        this.reel_mgr.setInitResult([{id:4},{id:3},{id:2},{id:1}]);
        // cc.log(this.reel_mgr.getElementNode(0));
        // cc.log(this.reel_mgr.getElementNode(1));
        // cc.log(this.reel_mgr.getElementNode(2));
        // cc.log(this.reel_mgr.getElementNode(3));
        

    }

    reelStart(){
        this.reel_mgr.reelStart();
    }
    reelAutoStop(){
        this.reel_mgr.reelAutoStop();
    }
    reelStop(){
        this.reel_mgr.reelStop();
    }
    increaseReelTime(){
        this.reel_mgr.increaseReelTime();
    }
    reelPause(){
        this.reel_mgr.reelPause();
    }
    reelResume(){
        this.reel_mgr.reelResume();
    }

    // update (dt) {}
}
