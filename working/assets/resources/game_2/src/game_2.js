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
        panel_line_model: {
            default:null,
            tooltip:"线",
            type: cc.Node
        },
        img_caljian: {
            default:null,
            tooltip:"img_caljian",
            type: cc.Node
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /*
        


        */


        /*
            红  最大     中间值
                绿 中间  最小
                蓝 中间  最小
            绿  最大     中间值

            蓝  最大     中间值


            红绿  最大   ~   中间值  均分等分 该表主颜色值
                蓝  中间 ~ 最低
            红蓝
            绿蓝
        */

        // 主颜色 不变
        // 剩余可变颜色 自由组合
        // 例如：红色不变  剩下绿、蓝 平均分成等分 组合
        // 红色绿色不变  剩下蓝 平均分成等分 组合

        // 固定 红色
        let num = 10;
        let cell_value = 255/num;
        let count_color = num * num + num * num + num * num + num + num + num;
        // cc.log(count_color, "count_color");

        let curr_index = 1;
        for (let index = 0; index < count_color; index++) {
            if(curr_index < 1*num){
                let color_value = cell_value * curr_index;

                color_value = Math.floor(color_value - cell_value/2);
                let color = cc.color(255, 255, color_value, 255);
                // cc.log(cc.color(color));
            }else if(curr_index < 2*num){
                let color_value = cell_value * (curr_index-1*num);
                color_value = Math.floor(color_value - cell_value/2);
                let color = cc.color(255, color_value, 255, 255);
                // cc.color(color);
            }else if(curr_index < 3*num){
                let color_value = cell_value * (curr_index-2*num);
                color_value = Math.floor(color_value - cell_value/2);
                let color = cc.color(color_value, 255, 255, 255);
                // cc.color(color);
            }else if(curr_index < 3*num + 1*num*num){
                let cur_idx = curr_index-3*num

                let row_indx = Math.ceil(cur_idx / num);  // 1,2,3行
                let column_indx = cur_idx % num;          // 1,2,3列
                if(column_indx==0){
                    column_indx = num;
                }
                let color_value_1 = row_indx * cell_value;
                let color_value_2 = column_indx * cell_value;
                color_value_1 = Math.floor(color_value_1 - cell_value/2);
                color_value_2 = Math.floor(color_value_2 - cell_value/2);

                let color = cc.color(color_value_1, color_value_2, 255, 255);
                // cc.color(color);
            }else if(curr_index < 3*num + 2*num*num){
                let cur_idx = curr_index-(3*num + 1*num*num)

                let row_indx = Math.ceil(cur_idx / num);  // 1,2,3行
                let column_indx = cur_idx % num;          // 1,2,3列
                if(column_indx==0){
                    column_indx = num;
                }
                let color_value_1 = row_indx * cell_value;
                let color_value_2 = column_indx * cell_value;
                color_value_1 = Math.floor(color_value_1 - cell_value/2);
                color_value_2 = Math.floor(color_value_2 - cell_value/2);

                let color = cc.color(color_value_1, color_value_2, 255, 255);
                // cc.color(color);
            }else if(curr_index < 3*num + 3*num*num){
                let cur_idx = curr_index-(3*num + 2*num*num)

                let row_indx = Math.ceil(cur_idx / num);  // 1,2,3行
                let column_indx = cur_idx % num;          // 1,2,3列
                if(column_indx==0){
                    column_indx = num;
                }
                let color_value_1 = row_indx * cell_value;
                let color_value_2 = column_indx * cell_value;
                color_value_1 = Math.floor(color_value_1 - cell_value/2);
                color_value_2 = Math.floor(color_value_2 - cell_value/2);
                let color = cc.color(color_value_1, color_value_2, 255, 255);
                // cc.color(color);
            }

            curr_index = curr_index + 1;
        }


    },

    start () {
        // this.add_box();
        // this.change_to_3d();


        
        
        // cc.log("????????????", this.img_caljian.getComponent(cc.Sprite).fillRange);
        
        
        let delay = cc.delayTime(0.01);
        let func = cc.callFunc(()=>{
            // this.img_caljian.getComponent(cc.ProgressBar).progress = 0.065;
            this.img_caljian.getComponent(cc.Sprite).fillRange = 0.065;
        });
        
        this.node.runAction(cc.sequence(delay, func));

    },
    // 添加线
    add_box(point){
        let line_node = cc.instantiate(this.panel_line_model);
        line_node.parent = this.node;
        line_node.x = 0;
        line_node.y = 0;

        let Graphics = line_node.getComponent(cc.Graphics);
        Graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        Graphics.strokeColor = cc.color(255, 255, 0, 255);
        Graphics.fillColor = cc.color(255, 255, 0, 255);
        Graphics.clear();
        // Graphics.roundRect(100, 0, 20, 20);
        // Graphics.rect(0, 0, 200, 100);
        // Graphics.circle(0, 0, 200);

        // 线↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        Graphics.moveTo(0,0);
        Graphics.lineTo(300, 0);
        Graphics.stroke();
        // 线↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

        // Graphics.fill();

        // this.make_line_data();


    },
    // 改成立体效果
    change_to_3d(){
        let points = [cc.v2(-200, -200), cc.v2(100, -200), cc.v2(300, 200), cc.v2(400, 200)];
        let Graphics_model = this.panel_line_model.getComponent(cc.Graphics);
        let line_width = Graphics_model.lineWidth;

        // 对称关系 数据表示线下半部组成
        let division_obj = [
            {percent_min:0.5, percent_max:1, color_min:0.8, color_max:0.2, num:4},
            {percent_min:0.1, percent_max:0.5, color_min:1, color_max:0.8, num:4},
        ];

        let color = cc.color(255, 255, 0, 255);

        // 添加分割线
        let add_division_line = (param)=>{
            let line_node = cc.instantiate(this.panel_line_model);
            line_node.parent = this.node;
            line_node.x = 0;
            line_node.y = 0;

            let Graphics = line_node.getComponent(cc.Graphics);
            Graphics.lineWidth = param.width;
            Graphics.strokeColor = param.color;
            Graphics.clear();
            Graphics.moveTo(points[0].x-65, points[0].y);
            for (let index = 0; index < points.length; index++) {
                let pos = points[index];
                Graphics.lineTo(pos.x, pos.y);
            }
            Graphics.lineTo(points[points.length-1].x+65, points[points.length-1].y);
            Graphics.stroke();
        };

        // 分割函数
        let division_func = (obj)=>{
            for (let index = 0; index < obj.length; index++) {
                const element = obj[index];

                let cell_width = (element.percent_max - element.percent_min) / element.num;
                let cell_color = (element.color_max - element.color_min) / element.num;
                for (let index1 = 1; index1 <= element.num; index1++) {
                    let color_percent = element.color_max - (index1 -1) * cell_color;
                    let set_color = cc.color(color.r * color_percent, color.g * color_percent, color.b * color_percent, 255);
                    let width_percent = element.percent_max - (index1 -1) * cell_width;
                    let set_width = line_width * width_percent;
                    add_division_line({width:set_width, color:set_color});
                }
            }
        };
        division_func(division_obj);
    },
    // update (dt) {},

    // 生成画线数据
    make_line_data() {
        let element_line = [
            [1,2,3,4,5],
            [16,17,18,19,20],
            [6,7,8,9,10],
            [11,12,13,14,15],
            [1,7,13,9,5],
            [16,12,8,14,20],
            [11,7,3,9,15],
            [6,12,18,14,10],
            [1,7,3,9,5],
            [16,12,18,14,20],
            [6,2,8,4,10],
            [11,17,13,19,15],
            [6,12,8,14,10],
            [11,7,13,9,15],
            [1,7,8,9,5],
            [16,12,13,14,20],
            [6,2,3,4,10],
            [11,17,18,19,15],
            [6,12,13,14,10],
            [11,7,8,9,15],
            [1,2,8,4,5],
            [16,17,13,19,20],
            [6,7,3,9,10],
            [11,12,18,14,15],
            [6,7,13,9,10],
            [11,12,8,14,15],
            [1,2,13,4,5],
            [16,17,8,19,20],
            [11,12,3,14,15],
            [6,7,18,9,10],
            [1,12,13,14,5],
            [16,7,8,9,20],
            [11,2,3,4,15],
            [6,17,18,19,10],
            [6,2,13,4,10],
            [11,17,8,19,15],
            [6,12,3,14,10],
            [11,7,18,9,15],
            [1,12,3,14,5],
            [16,7,18,9,20],
            [11,2,13,4,15],
            [6,17,8,19,10],
            [1,12,3,14,5],
            [16,7,18,9,20],
            [11,2,8,4,15],
            [6,17,13,19,10],
            [1,17,3,19,5],
            [16,2,18,4,20],
            [1,2,18,4,5],
            [16,17,3,19,20],
            [16,2,3,4,20],
            [1,17,18,19,5],
            [1,7,18,4,5],
            [16,12,3,14,20],
            [16,7,3,9,20],
            [1,12,18,14,5],
            [6,2,18,4,10],
            [11,17,3,19,15],
            [1,17,13,19,5],
            [16,2,8,4,20],
            [1,17,8,19,5],
            [16,2,13,4,20],
            [11,2,18,4,15],
            [6,17,3,19,10],
            [1,2,3,9,15],
            [6,7,8,14,20],
            [11,12,13,9,5],
            [16,17,18,14,10],
            [1,2,8,14,15],
            [16,17,13,9,10],
            [6,7,3,9,15],
            [11,12,18,14,10],
            [6,7,13,19,20],
            [11,12,8,4,5],
            [6,2,3,9,15],
            [11,17,18,14,10],
            [1,7,8,14,20],
            [16,12,13,9,5],
            [6,12,13,9,5],
            [11,7,8,14,20],
        ];
        this.element_line = element_line;

        let point_line = {};
        for (let line_index = 0; line_index < this.element_line.length; line_index++) {
            let element = this.element_line[line_index];
            for (let pos_index = 0; pos_index < element.length; pos_index++) {
                let pos_idx = element[pos_index];

                if(point_line[pos_idx] == null){
                    let obj = {};
                    obj.all_line = [];
                    obj.line_idx = {};
                    point_line[pos_idx] = obj;
                }
                let curr_rc = this.get_row_and_column(element[pos_index]);
                let front_rc = this.get_row_and_column(element[pos_index-1]) || curr_rc;
                let after_rc = this.get_row_and_column(element[pos_index+1]) || curr_rc;
                let obj = {};
                obj.front_y = curr_rc.row_indx - front_rc.row_indx;
                obj.after_y = curr_rc.row_indx - after_rc.row_indx;
                obj.line_index = line_index;
                obj.pos_index = pos_index;
                point_line[pos_idx].line_idx[line_index] = obj;
                point_line[pos_idx].all_line.push(obj);
            }
        }

        // 取后一个点
        let get_after_point = (line_index, pos_index)=>{
            let line = this.element_line[line_index];

            let point_idx = line[pos_index+1];
            if(point_idx == null){
                return null
            }
            for (let index = 0; index < point_line[point_idx].all_line.length; index++) {
                const element = point_line[point_idx].all_line[index];
                if(element.line_index == line_index){
                    return element;
                }
            }

            return null;
        };
        // 比较后一个点
        let compare_after = null;
        compare_after = (line_a, line_b)=>{
            if(line_a.after_y > line_b.after_y){
                return -1;
            }else if(line_a.after_y < line_b.after_y){
                return 1;
            }
            let next_a = get_after_point(line_a.line_index, line_a.pos_index);
            if(next_a == null){
                return 0;
            }
            let next_b = get_after_point(line_b.line_index, line_b.pos_index);
            if(next_b == null){
                return 0;
            }

            return compare_after(next_a, next_b);
        };
        // 排序规则
        let sort_func = (a, b)=>{
            if(a.front_y < b.front_y){
                return 1;
            }else if(a.front_y > b.front_y){
                return -1;
            }

            return compare_after(a, b);
        };

        // 排序
        for (const key in point_line) {
            if (point_line.hasOwnProperty(key)) {
                const element = point_line[key];
                element.all_line.sort(sort_func);
            }
        }

        // 生成查询表
        for (const key in point_line) {
            if (point_line.hasOwnProperty(key)) {
                const element = point_line[key];
                for (let index = 0; index < element.all_line.length; index++) {
                    const line = element.all_line[index];
                    element.line_idx[line.line_index] = index;
                }
            }
        }

        cc.log(point_line);
    },
    // 获取行和列
    // idx 1,2,3
    get_row_and_column(idx){
        if(idx == null){
            return null;
        }

        let max_column = 5;
        let row_indx = Math.ceil(idx / max_column);  // 1,2,3行
        let column_indx = idx % max_column;          // 1,2,3列
        if(column_indx==0){
            column_indx = max_column;
        }

        let obj = {};
        obj.row_indx = row_indx;
        obj.column_indx = column_indx;
        return obj;
    },


    // ----------------------------------------------------------------------------
    run_obj_init(){
        this.run_obj = {};
        this.run_obj_num = 0;
    },
    // frame_call:(dt)=>{},
    run_obj_add(obj){
        let run_obj = this.run_obj;
        let id = 1;
        while (run_obj[id]) {
            id = id + 1;
        }
        obj.id = id;
        obj.time = obj.time || 0;
        this.run_obj[id] = obj;
        this.run_obj_num = this.run_obj_num + 1;
    },
    run_obj_remove(id){
        delete this.run_obj[id];
        this.run_obj_num = this.run_obj_num - 1;
    },
    // 每帧刷新
    update(dt){
        if(this.run_obj_num == null || this.run_obj_num <= 0){
            return;
        }
        for (const id in this.run_obj) {
            let obj = this.run_obj[id];
            obj.time = obj.time + dt;
            obj.frame_call(obj.time);
        }
    },
    // ----------------------------------------------------------------------------
});



        // 当前动作帧

        // 怎么随意切换状态
        // 开始  快速停止 （）

        // 提速

        // 统一时间停止 慢速点了停止后 后停的不能先停
            // 计算正在停止的列到停止需要的时间  与其余列停止的时间对比
            //   10             5             后者必须再走 5 才执行 5
            //   5              10            后者正常停
            //   5              5             后者正常停

        // 按照队列执行？执行完一个队列

        /*
            执行队列
                循环队列
                后面不再接受插入队列
            转换队列
                逆向转换
                结束转换
                强制转换

            定时器



        */
       // 跑动画帧
    // 开始帧
    // 结束帧
    // 速度
    //    0             42
    //    0             1130
    //    time
    // 逆向
    //    42            0
    // 无缝链接下一个阶段
    // 随时加入新的节奏？
    // 指定时间
    // 当前时间能走的帧 直接跳转对应帧
    // 0.1秒

    // 0 - 42 41 42 41 42 41 42 41 42 41 42 41 42 41 42 41 42 41 42 41 42 42 - 60

    
    // 强制执行
    // 插入时间点执行
    // 修改当前动作时间 延长或加速？

    