
import reel_mgr from './reel_mgr';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({
        type: reel_mgr,
        tooltip:"滚轮动作",
    })
    reel_mgr: reel_mgr = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.reel_mgr.init();
        this.reel_mgr.cb_reel_finish_pre = this.cb_reel_finish_pre.bind(this);
        this.reel_mgr.cb_reel_finish = this.cb_reel_finish.bind(this);
        this.reel_mgr.reel_element.cb_custom_element_by_id = this.cb_custom_element_by_id.bind(this);
        // this.reel_mgr.setElementVisitable(false);
    }

    start () {

    }

    // 自定义元素
    cb_custom_element_by_id(result_obj, add_parent){
        let id = result_obj.id;
        // let type = result_obj.type;
        let ext = result_obj.ext;
        let element_node = this.reel_mgr.create_element_by_id(result_obj, add_parent);
        return element_node;
    }

    cb_reel_finish_pre(index){
        cc.log(index, "音效停")
    }
    cb_reel_finish(index){
        cc.log(index, "滚轮停")
        let element_node = this.reel_mgr.getElementNode(index);
        cc.log(element_node, index);
    }

    setInitResult(a, id){
        cc.log(a, id)
        let result = [];
        result = [
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
        ];
        for (let index = 0; index < result.length; index++) {
            if(id){
                result[index].id = id;
            }
        }

        this.reel_mgr.setInitResult(result);
    }

    setResult(a, id){
        cc.log(a, id)
        let result = [];
        result = [
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
        ];
        for (let index = 0; index < result.length; index++) {
            if(id){
                result[index].id = id;
            }
            if(index > 5){
                // this.reel_mgr.reelLock(index);
            }
        }
        this.reel_mgr.setResult(result);
    }

    reelStart(){
        cc.log('reelStart')
        // this.reel_mgr.reelLock(index, false);
        let result = [];
        result = [
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
            {id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},{id:1, ext:1},
        ];
        for (let index = 0; index < result.length; index++) {
            if(index > 5){
                this.reel_mgr.reelLock(index);
            }
        }
        this.reel_mgr.reelStart();
    }

    reelStop(){
        cc.log('reelStop')
        this.reel_mgr.reelStop(true);
    }
    
    

    // update (dt) {}
}
