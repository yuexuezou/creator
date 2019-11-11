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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        element_node: {
            default:null,
            tooltip:"ListView",
            type: cc.Node
        },
        
    },

    // 预加载
    preLoad(call_func){
        // this.preLoad1(call_func);
        // this.preLoad2(call_func);
        // this.preLoad3(call_func);
    },
    preLoad1(call_func){
        cc.log("先行1");
        let start_x = -300;
        let add_x = 160;
        let start_y = 150;
        let add_y = 90;
        for (let index = 1; index <= 12; index++) {
            let path = 'game_5/res/element1/a0'+index;
            if(index >= 10){
                path = 'game_5/res/element1/a'+index;
            }
            let ani_node = new cc.Node();
            ani_node.parent = this.element_node;
            ani_node.x = start_x + index%5*add_x;
            ani_node.y = start_y - Math.floor(index/5)*add_y;
            if(index%5 == 0){
                start_x = -300;
            }
            ani_node.addComponent(cc.Sprite);
            cc.loader.loadRes(path, cc.SpriteFrame, (err, asset)=>{
                ani_node.getComponent(cc.Sprite).spriteFrame = asset;
                cc.log('加载资源', path);
                call_func && call_func();
            })
        }
    },
    preLoad2(call_func){
        cc.log("先行2");
        let start_x = -300;
        let add_x = 160;
        let start_y = 150;
        let add_y = 90;
        for (let index = 1; index <= 20; index++) {
            let path = 'game_5/res/element2/a0'+index;
            if(index >= 10){
                path = 'game_5/res/element2/a'+index;
            }
            let ani_node = new cc.Node();
            ani_node.parent = this.element_node;
            ani_node.x = start_x + index%5*add_x;
            ani_node.y = start_y - Math.floor(index/5)*add_y;
            if(index%5 == 0){
                start_x = -300;
            }
            ani_node.addComponent(cc.Sprite);
            cc.loader.loadRes(path, cc.SpriteFrame, (err, asset)=>{
                ani_node.getComponent(cc.Sprite).spriteFrame = asset;
                cc.log('加载资源', path);
                call_func && call_func();
            })
        }
    },
    preLoad3(call_func){
        
        cc.log("先行");
        let start_x = -300;
        let add_x = 160;
        let start_y = 150;
        let add_y = 90;
        for (let index = 1; index <= 14; index++) {
            let path = 'game_5/res/element/a0'+index;
            if(index >= 10){
                path = 'game_5/res/element/a'+index;
            }
            let ani_node = new cc.Node();
            ani_node.parent = this.element_node;
            ani_node.x = start_x + index%5*add_x;
            ani_node.y = start_y - Math.floor(index/5)*add_y;
            if(index%5 == 0){
                start_x = -300;
            }
            ani_node.addComponent(cc.Sprite);
            cc.loader.loadRes(path, cc.SpriteFrame, (err, asset)=>{
                ani_node.getComponent(cc.Sprite).spriteFrame = asset;
                cc.log('加载资源', path);
                call_func && call_func();
            })
        }
    },
    onLoad () {
        cc.log("11111");
    },

    start () {
        cc.log("222222");
    },

    // update (dt) {},
});
