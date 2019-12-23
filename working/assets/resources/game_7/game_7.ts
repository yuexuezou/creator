import reel_mgr from './reel_mgr';

const {ccclass, property} = cc._decorator;

@ccclass
export default class game_7 extends cc.Component {
    @property({
        type: reel_mgr,
        tooltip:"滚轮动作",
    })
    reel_mgr: reel_mgr = null;

    @property({
        type: cc.Node,
        tooltip:"img_test",
    })
    img_test: cc.Node = null;
    

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
        let result = [
            {id:13},{id:13},{id:13},{id:13},{id:13},
            {id:5},{id:5},{id:5},{id:5},{id:5},
            {id:4},{id:4},{id:4},{id:4},{id:4},
            {id:7},{id:7},{id:7},{id:7},{id:7},
        ];
        this.reel_mgr.setInitResult(result);
        // cc.log(this.reel_mgr.getElementNode(0));
        // cc.log(this.reel_mgr.getElementNode(1));
        // cc.log(this.reel_mgr.getElementNode(2));
        // cc.log(this.reel_mgr.getElementNode(3));
        

    }

    reelStart(){
        this.reel_mgr.reelStart();
    }
    reelAutoStop(){
        let result = [
            {id:1},{id:2},{id:3},{id:4},{id:5},
            {id:2},{id:3},{id:4},{id:5},{id:1},
            {id:3},{id:4},{id:5},{id:1},{id:2},
            {id:4},{id:5},{id:1},{id:2},{id:3},
        ];
        this.reel_mgr.setResult(result);
        // this.reel_mgr.reelAutoStop();
        this.reel_mgr.reelStop(true);
    }
    reelStop(){
        let result = [
            {id:1},{id:2},{id:3},{id:4},{id:5},
            {id:2},{id:3},{id:4},{id:5},{id:1},
            {id:3},{id:4},{id:5},{id:1},{id:2},
            {id:4},{id:5},{id:1},{id:2},{id:3},
        ];
        this.reel_mgr.setResult(result);
        this.reel_mgr.reelStop(false);
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
    test_act(){
        let animation = this.img_test.getComponent(cc.Animation);
        let animState = animation.getAnimationState('test_act');
        cc.log(animation);
        cc.log("-----------------------------------------------");
        cc.log(animState);

        // let obj = [];
        // obj[0] = 0.5;
        // obj[1] = 0.5;
        // obj[2] = 1.8;
        // obj[3] = 0.7;
        // animState.curves[0].types[0] = obj;
        animState.stop();
        animState.play();


        let bezierPoint = this.create3DBezier(
            { x : 0,  y : 0,   z : 0 },    // p0
            { x : 0.48, y : 0, z : 0 },    // p1
            { x : 0.695,  y : 1.225, z : 0 },    // p2
            { x : 1,   y : 1,   z : 0 },    // p3
            20,
            1.0
        );
        cc.log("bezierPoint");
        cc.log(bezierPoint);
    }

    /*
    * 生成四阶贝塞尔曲线定点数据
    * @param p0   起始点  { x : number, y : number, z : number }
    * @param p1   控制点1 { x : number, y : number, z : number }
    * @param p2   控制点2 { x : number, y : number, z : number }
    * @param p3   终止点  { x : number, y : number, z : number }
    * @param num  线条精度
    * @param tick 绘制系数
    * @returns {{points: Array, num: number}}
    */
    create3DBezier(p0, p1, p2, p3, num, tick) {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let points = [];
        for (let i = 0; i < pointMum; i++) {
            let point = this.getBezierNowPoint(p0, p1, p2, p3, i, t);
            points.push(point);
        }
    
        return points;
    }
   
    /**
     * 四阶贝塞尔曲线公式
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param t
     * @returns {*}
     * @constructor
   */
    Bezier(p0, p1, p2, p3, t) {
        let P0, P1, P2, P3;
        P0 = p0 * (Math.pow((1 - t), 3));
        P1 = 3 * p1 * t * (Math.pow((1 - t), 2));
        P2 = 3 * p2 * Math.pow(t, 2) * (1 - t);
        P3 = p3 * Math.pow(t, 3);
        return P0 + P1 + P2 + P3;
    }

    /**
     * 获取四阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param num
     * @param tick
     * @returns {{x, y, z}}
     */
    getBezierNowPoint(p0, p1, p2, p3, num, tick) {
        return {
        x : this.Bezier(p0.x, p1.x, p2.x, p3.x, num * tick),
        y : this.Bezier(p0.y, p1.y, p2.y, p3.y, num * tick),
        z : this.Bezier(p0.z, p1.z, p2.z, p3.z, num * tick),
        }
    }
    // update (dt) {}
}
