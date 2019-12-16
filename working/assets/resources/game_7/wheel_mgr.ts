// 滚轮管理器
import wheel_refresh from './wheel_refresh';
const {ccclass, property} = cc._decorator;

@ccclass
export default class wheel_mgr extends cc.Component {
    @property({
        type: wheel_refresh,
        tooltip:"滚轮动作",
    })
    wheel_refresh: wheel_refresh[] = null;

    onLoad () {

    }

    start () {

    }

    update (dt) {
    }
}
