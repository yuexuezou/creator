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
        ListView: {
            default:null,
            tooltip:"ListView",
            type: cc.Node
        },
        img_1: {
            default:null,
            tooltip:"img_1",
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.MgrListView = this.ListView.getComponent('MgrListView');


        
    },

    start () {
        let data=[];

        for (let index = 0; index < 1000; index++) {
            let str = ' '+ (index + 1);
            str = str + str + str + str + str + str;
            if(index<50){
                data.push({itemIdx:0, data:str});
            }else if(index<100){
                data.push({itemIdx:1, data:str});
            }else if(index<150){
                data.push({itemIdx:2, data:str});
            }else if(index<200){
                data.push({itemIdx:3, data:str});
            }
        }
        this.data = data;
        this.MgrListView.upData(this.data);
    },
    test_tween(){
        
        let node = this.img_1;
        const t = cc.tween;


        
        // cc.tween(node)
        // .delay(0.5)
        // .to(0.8, { rotation: 360 }, { easing: 'cubicInOut' })
        // .delay(1)
        // .to(0.3, { opacity: 0, scale: 3 }, { easing: "quintIn" })
        // .delay(1)
        // .start()

        


        let obj = {add_speed:0};
        cc.tween(obj)
        .to(10, { add_speed: 360 }, { easing: 'cubicInOut' })
        .start()


        let daley = cc.delayTime(0.01);
        let call_func = cc.callFunc(()=>{
            cc.log("dOK", obj.add_speed);
        });
        let seq = cc.sequence(daley, call_func);
        cc.tween(node)
        .repeatForever(seq)
        .start()

        // var overshoot = 0.90158;
        // time1 = time1 - 1;
        // return time1 * time1 * ((overshoot + 1) * time1 + overshoot) + 1;
    },
    // update (dt) {},
});
