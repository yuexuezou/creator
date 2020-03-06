// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property({
        tooltip:"显示滑动条",
    })
    show_slider: boolean=false;

    // onLoad () {}
    
    start () {

        let children = this.node.children;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            for (let index1 = 0; index1 < element.children.length; index1++) {
                const element2 = element.children[index1];
                if(element2.name == 'node_slider'){

                    element2.active = this.show_slider;
                }
            }
        }
    }

    // update (dt) {}
}
