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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let TableData = {
            innerTableData:[
                {idx:0,num:[2]},{idx:1,num:[3]},{idx:2,num:[2]},
                {idx:3,num:[3]},{idx:4,num:[2]},{idx:5,num:[4]},
                {idx:6,num:[3]},{idx:7,num:[5]}
            ],
            outerTableData:[
                {idx:0,num:[2,4]},{idx:1,num:[1,2,3]},
                {idx:2,num:[2,5]},{idx:3,num:[1,5]},
                {idx:4,num:[4,5]},{idx:5,num:[1]},
                {idx:6,num:[2,3,4,5]},{idx:7,num:[1,3]
                }
            ],
            innerdefaultIdx:1,
            outerdefaultIdx:2,
            symbolWeightList:[
                {symbolWeight:[
                    {id:1,weight:0,weightRepeated:[40,30,30]},{id:2,weight:3000,weightRepeated:[40,30,30]},{id:3,weight:3000,weightRepeated:[50,30,20]},{id:4,weight:4000,weightRepeated:[20,30,50]},{id:5,weight:5000,weightRepeated:[20,30,50]},{id:6,weight:4000,weightRepeated:[20,30,50]},{id:7,weight:3000,weightRepeated:[60,30,10]},{id:8,weight:2000,weightRepeated:[60,30,10]},{id:9,weight:2000,weightRepeated:[70,20,10]},{id:10,weight:2000,weightRepeated:[70,20,10]},{id:11,weight:1000,weightRepeated:[80,10,10]},{id:12,weight:1000,weightRepeated:[80,10,10]}]},{symbolWeight:[{id:2,weight:1,weightRepeated:[100]}]},{symbolWeight:[{id:1,weight:3000,weightRepeated:[80,10,10]},{id:2,weight:3000,weightRepeated:[80,10,10]},{id:3,weight:3000,weightRepeated:[90,10,0]},{id:4,weight:4000,weightRepeated:[90,10,0]},{id:5,weight:5000,weightRepeated:[40,30,30]},{id:6,weight:4000,weightRepeated:[40,30,30]},{id:7,weight:3000,weightRepeated:[50,30,20]},{id:8,weight:2000,weightRepeated:[20,30,50]},{id:9,weight:2000,weightRepeated:[20,30,50]},{id:10,weight:2000,weightRepeated:[20,30,50]},{id:11,weight:1000,weightRepeated:[60,30,10]},{id:12,weight:1000,weightRepeated:[60,30,10]}]},{symbolWeight:[{id:1,weight:3000,weightRepeated:[70,20,10]},{id:2,weight:3000,weightRepeated:[70,20,10]},{id:3,weight:3000,weightRepeated:[80,10,10]},{id:4,weight:4000,weightRepeated:[80,10,10]},{id:5,weight:5000,weightRepeated:[90,10,0]},{id:6,weight:4000,weightRepeated:[90,10,0]},{id:7,weight:3000,weightRepeated:[40,30,30]},{id:8,weight:2000,weightRepeated:[40,30,30]},{id:9,weight:2000,weightRepeated:[50,30,20]},{id:10,weight:2000,weightRepeated:[20,30,50]},{id:11,weight:1000,weightRepeated:[20,30,50]},{id:12,weight:1000,weightRepeated:[20,30,50]}]},{symbolWeight:[{id:2,weight:1,weightRepeated:[100]}]}],betValue:100};
    },

    start () {
        console.log(1<<2);

        let obj = {}

        obj[10] = {aadad:10, ccc:20};
        obj[11] = {aadad:100, ccc:200};
        obj[18] = {aadad:10000, ccc:20000};
        obj[14] = {aadad:1000, ccc:2000};
        obj.asdasd = 11121;

        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                console.log(element);
            }
        }
        

    },

    // update (dt) {},
});



/*

    如何无缝连接速度

    在减速的时候增速


*/

