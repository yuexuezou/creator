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

    @property(cc.Node)
    node_circle: cc.Node = null;
    @property(cc.Node)
    node_circle_parent: cc.Node = null;
    @property(cc.Node)
    node_point: cc.Node = null;

    @property(cc.Node)
    light1: cc.Node = null;
    @property(cc.Node)
    light2: cc.Node = null;
    set_y: number;
    set_x: number;
    point_x: number;
    point_y: number;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        cc.dynamicAtlasManager.enabled = false;
        // this.make_circle();
        // this.make_point();
        // for (let index = 1; index <= 10; index++) {
        //     for (let index1 = 1; index1 <= 10; index1++) {
        //         if(index%1 == 0 && index1%1==0){
        //             let v_uv0 = {x:index/10, y:index1/10};
        //             this.test_shader_data(v_uv0);
        //         }
        //     }
        // }
    }
    // test_shader_data(v_uv0){
    //     // 图片宽、高、对应圆半径、横轴x
    //     let width = 512.;
    //     let height = 512.;
    //     let img_scale = 0.25;
    //     width = width * img_scale;
    //     height = height * img_scale;

    //     let max_x = 412.;
    //     let max_scale_x = 0.3;
    //     let max_scale_y = 0.3;
    //     let circle_r = 250.;
    //     let point_x = 0.;
    //     let point_y = 0.;
    //     point_x = point_x + (v_uv0.x-0.5)*width;
    //     point_y = point_y - (v_uv0.y-0.5)*height;
    //     let scale_x = (point_x/max_x)*max_scale_x;
    //     if(point_x < 0.){
    //         scale_x = -1. * scale_x;
    //     }
    //     if(point_y>=circle_r){
    //         point_y = circle_r;
    //     }
        
    //     // 转换滚轴坐标
    //     let switch_x = circle_r*circle_r - point_y*point_y;
    //     switch_x = Math.sqrt(switch_x); //理论应在
    //     cc.log(switch_x, "switch_x", scale_x, "scale_x", point_x, "point_x", point_y, "point_y");
    //     switch_x = switch_x * scale_x; //实际在
    //     let x = v_uv0.x + switch_x/width;
    //     if(point_x < 0.){
    //         x = v_uv0.x - switch_x/width;
    //     }

    //     let set_x = point_x+(x-0.5)*width;
    //     let set_y = point_y+(0.5-v_uv0.y)*height;

    //     // cc.log(set_x, set_y, "set_y");
    //     this.add_point(set_x, set_y, cc.color(255, 255, 0, 255));
    // }
    
    callback_test_x(slider: cc.Slider) {
        let set_y = this.set_y || 0.5;
        this.test_data({x:slider.progress, y:set_y});
        this.set_x = slider.progress;
    }
    callback_test_y(slider: cc.Slider) {
        let set_x = this.set_x || 0.5;
        this.test_data({x:set_x, y:slider.progress});
        this.set_y = slider.progress;
    }
    callback_test_point_x(slider: cc.Slider) {
        let set_x = this.set_x || 0.5;
        let set_y = this.set_y || 0.5;
        this.point_x = -1*(0.5-slider.progress)*900;
        cc.log("this.point_x", this.point_x);
        this.test_data({x:set_x, y:set_y});
    }
    callback_test_point_y(slider: cc.Slider) {
        let set_x = this.set_x || 0.5;
        let set_y = this.set_y || 0.5;
        this.point_y = -1*(0.5-slider.progress)*900;
        cc.log("this.point_y", this.point_y);
        this.test_data({x:set_x, y:set_y});
    }
    test_data(v_uv0){
        // 图片宽、高、对应圆半径、横轴x
        let width = 512.;
        let height = 512.;
        let img_scale = 1;
        let set_width = width * img_scale;
        let set_height = height * img_scale;

        let max_x = 412.;
        let max_scale_x = 0.5;
        let max_scale_y = 0.3;
        let circle_r = 250.;
        let point_x = this.point_x || 0.;
        let point_y = this.point_y || 0.;

        let set_x = point_x + (v_uv0.x-0.5)*set_width;
        let set_y = point_y + (v_uv0.y-0.5)*set_height;
        let switch_y = set_y;
        if(switch_y < 0.){
            switch_y = -1. * switch_y;
        }
        if(switch_y >= circle_r){
            switch_y = max_scale_y * set_y;
        }else{
            let temp_x = circle_r*circle_r - switch_y*switch_y;
            temp_x = Math.sqrt(temp_x);
            let scale_y = 1.-((circle_r - temp_x)/circle_r)*(1.-max_scale_y);
            switch_y = scale_y * set_y;
        }
        let y = v_uv0.y - (set_y-switch_y)/set_height;

        // set_y = point_y - (y-0.5)*set_height;
        let scale_x = (set_x/max_x)*max_scale_x;
        if(set_x < 0.){
            scale_x = -1. * scale_x;
        }
        if(switch_y>=circle_r){
            switch_y = circle_r;
        }
        // 转换滚轴坐标
        let switch_x = circle_r*circle_r - switch_y*switch_y;
        switch_x = Math.sqrt(switch_x); //理论应在

        switch_x = switch_x * scale_x; //实际在
        // let x = v_uv0.x + switch_x/set_width;
        // if(set_x < 0.){
        //     x = v_uv0.x - switch_x/set_width;
        // }
        let x = v_uv0.x + switch_x/set_width;
        if(set_x < 0.){
            x = v_uv0.x - switch_x/set_width;
        }
        cc.log("in x:", v_uv0.x);
        cc.log("in y:", v_uv0.y);
        cc.log("x:", x);
        cc.log("y:", y);
    }
    make_point(){
        this.node_point.active = false;

        let start_x = 0;
        let start_y = -350/2;

        for (let index = 0; index < 1600; index++) {
            if(start_x != 90 && start_x != 250){
                this.calculation_xy(start_x, start_y);
            }

            // this.add_point(pos.x, pos.y);
            start_x = start_x + 10;
            if(start_x >= 420){
                start_x = 0;
                start_y = start_y + 10;
            }
        }
    }
    // 计算坐标
    calculation_xy(set_x, set_y){
        let max_x = 412; // 横轴x
        let max_scale_x = 0.3;
        let circle_r = 350/2;

        // 给定一个坐标
        let point_x = set_x||0;
        let point_y = set_y||0;
        let scale_x = (point_x/max_x)*max_scale_x;
        // 转换滚轴坐标
        let switch_x = circle_r*circle_r - point_y*point_y;
        switch_x = Math.sqrt(switch_x);
        switch_x = switch_x * scale_x;
        switch_x = switch_x + point_x;
        let switch_y = point_y;

        this.add_point(switch_x, switch_y, cc.color(255, 255, 0, 255));
        return {x:switch_x, y:switch_y};
    }
    add_point(x, y, color?){
        let node_point = cc.instantiate(this.node_point);
        node_point.active = true;
        node_point.parent = this.node_circle_parent;
        node_point.x = x;
        node_point.y = y;
        if(color){
            let sprite = cc.find('sprite', node_point);
            sprite.color = color;
        }
    }

    make_circle(){
        this.node_circle.active = false;
        let circle_r = 350;
        this.node_circle.width = circle_r;
        this.node_circle.height = circle_r;
        let color_sprite = cc.find('color_sprite', this.node_circle);
        color_sprite.width = circle_r;
        color_sprite.height = circle_r;

        let max_x = 412;
        let max_scale_x = 0.3;
        let make_num = 5;

        let step_x = max_x/make_num;
        let step_scale_x = max_scale_x/make_num;

        for (let index = 0; index <= make_num; index++) {
            if(index != 2 && index !=4){
                this.add_circle({index:index, step_x:step_x, step_scale_x:step_scale_x, direction:1});
                this.add_circle({index:index, step_x:step_x, step_scale_x:step_scale_x, direction:-1});
            }

            // for (let idx = 0; idx < 10; idx++) {
                // let pos = this.calculation_xy(index * step_x, idx * 10);
                // this.add_point(pos.x, pos.y);
            // }
        }
    }

    add_circle(param){
        let index = param.index;
        let step_x = param.step_x;
        let step_scale_x = param.step_scale_x;
        let direction = param.direction || 1;

        let node_circle = cc.instantiate(this.node_circle);
        node_circle.active = true;
        node_circle.parent = this.node_circle_parent;
        let set_x = index * step_x * direction;
        let set_scale_x = index * step_scale_x;

        node_circle.x = set_x;
        node_circle.scaleX = set_scale_x;
    }
    // update (dt) {}

    

}


/*

滚轮 本身就是一个圆
缩放x的值 让这个圆变成透视效果


圆的半径
最内层缩放比例
最外层缩放比例
通过x确定 圆


, y 确定该点在圆的


给定图片坐标 x, y
    x 的取值范围
        无限制
    y 的取值范围
        正负圆的半径








*/