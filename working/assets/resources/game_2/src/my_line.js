

cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        executeInEditMode: true,
    },
    properties: {
        draw_line_node: {
            default:null,
            tooltip:"画线逻辑",
            type: cc.Node
        },
    },


    onLoad () {
        this.Graphics = this.node.getComponent(cc.Graphics);
        this.draw_line = this.draw_line_node.getComponent('draw_line');
    },

    start () {
        // this.Graphics.strokeColor = cc.color(255, 255, 255, 255);
        // this.Graphics.clear();
        // this.Graphics.moveTo(0, 0);

        // this.Graphics.lineTo(100, 0);
        // this.Graphics.lineTo(101, 0);
        // this.Graphics.lineTo(102, 0);
        // this.Graphics.lineTo(200, -100);

        // this.Graphics.stroke();
        // this.time = 0;
        // this.time_gap = 1;
        // this.add_x = 0;
        // this.continue_find();
    },

    update (dt) {
        // this.time = this.time + dt;
        // if(this.time < this.time_gap){
        //     return;
        // }
        // this.time = 0;

        // this.add_x = this.add_x + 1;
        // this.Graphics.lineTo(this.add_x, 0);
        // this.Graphics.stroke();
    },

    check_line(){
        // 确定连数
        // 万能元素

        // 第一位 第二位 第三位 第四位 第五位 第六位
        // 万能元素随意切换元素
        // 万能元素顶替最高元素
        // 所有满足万能元素先算出 再筛选

        // 先找 再校验
        // 0  0  0  0  0
        // 0  0  0  0  0
        // 0  0  0  0  0
        // 0  0  0  0  0


        // 行数
        for (let index = 0; index < array.length; index++) {

        }
        // 列数
        for (let index = 0; index < array.length; index++) {

        }
        // 没有元素 先确定元素 万能元素
        // 该列是否存在该元素或者 万能元素
        // 继续下一列

    },
    set_line_config(){
        //元素连线倍数
        let elementPayTable = [
            {id:4,  length:5,   rate:750},
            {id:4,  length:4,   rate:150},
            {id:4,  length:3,   rate:35},
            {id:5,  length:5,   rate:500},
            {id:5,  length:4,   rate:100},
            {id:5,  length:3,   rate:25},
            {id:6,  length:5,   rate:250},
            {id:6,  length:4,   rate:75},
            {id:6,  length:3,   rate:20},
            {id:7,  length:5,   rate:200},
            {id:7,  length:4,   rate:50},
            {id:7,  length:3,   rate:15},
            {id:8,  length:5,   rate:150},
            {id:8,  length:4,   rate:40},
            {id:8,  length:3,   rate:10},
            {id:9,  length:5,   rate:150},
            {id:9,  length:4,   rate:40},
            {id:9,  length:3,   rate:10},
            {id:10, length:5,   rate:80},
            {id:10, length:4,   rate:20},
            {id:10, length:3,   rate:5},
            {id:11, length:5,   rate:80},
            {id:11, length:4,   rate:20},
            {id:11, length:3,   rate:5},
            {id:12, length:5,   rate:80},
            {id:12, length:4,   rate:20},
            {id:12, length:3,   rate:5},
            {id:13, length:5,   rate:80},
            {id:13, length:4,   rate:20},
            {id:13, length:3,   rate:5},
        ];

        // 转格式
        // this.elementPayTable = {};
        // [4] = {length:{[3]:35,[4]:150,[5]:750}};
        let element_data = {};
        for (let index = 0; index < elementPayTable.length; index++) {
            const element = elementPayTable[index];
            if(element_data[element.id] == null){
                element_data[element.id] = {length:{}};
            }
            if(element_data[element.id].length[element.length]==null){
                element_data[element.id].length[element.length] = element.rate;
            }
        }
        this.element_data = element_data;

        //元素连线配置
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

        let element_line_idx = {};
        for (let index = 0; index < element_line.length; index++) {
            const element = element_line[index];
            let last_obj = null;
            for (let index1 = 0; index1 < element.length; index1++) {
                const idx = element[index1];
                if(last_obj == null){
                    if(element_line_idx[idx] == null){
                        element_line_idx[idx] = {};
                    }
                    last_obj = element_line_idx[idx];
                }else{
                    if((index1+1) == element.length){
                        last_obj[idx] = index+1;  //最后一位是序号
                    }else{
                        if(last_obj[idx] == null){
                            last_obj[idx] = {};
                        }
                        last_obj = last_obj[idx];
                    }
                }
            }
        }
        // 连线id
        cc.log(element_line_idx);
        this.element_line = element_line;
        this.element_line_idx = element_line_idx;
    },
    // 连线是否有效
    check_line_work(line_idx){
        let element_line_idx = this.element_line_idx;
        let last_element = element_line_idx;
        for (let index = 0; index < line_idx.length; index++) {
            let idx = line_idx[index];
            if(last_element[idx] == null){
                return false;
            }
            last_element = last_element[idx];
        }
        return true;
    },
    // 连线数是否有效
    check_num_work(id, num){
        if(num<=2){
            return true;
        }
        let element_data = this.element_data;
        if(element_data[id] == null){
            return false;
        }
        if(element_data[id][num] == null){
            return false;
        }
        return true;
    },
    //
    continue_find(){
        this.set_line_config();
        let num_line = 0;

        let max_row_num = 4;            //最大行数
        let max_column_num = 5;         //最大列数
        let wild_list = {[2]:true,[3]:true};  //万能元素列表
        let result = [
            {id:1},  {id:1},  {id:2},  {id:1},  {id:1},
            {id:1},  {id:2},  {id:2},  {id:1},  {id:1},
            {id:1},  {id:1},  {id:1},  {id:1},  {id:1},
            {id:1},  {id:1},  {id:1},  {id:1},  {id:1},
        ];
        let check_child_func = null;
        // param
        // id:当前的元素id;
        // next_id:指定下一个元素id null（可以任意）
        // count:最大连数
        // str_idx:连成线的组合
        // row_index:所处行索引
        // column_index:所处列索引
        check_child_func = (param)=>{
            // let id = param.id;
            // let row_index = param.row_index;
            let column_index = param.column_index;
            let next_id = param.next_id;
            let count = param.count;
            let line_idx = param.line_idx;

            // 执行总结
            if(column_index == max_column_num){
                // cc.log("已经是最后一列 总结", param.line_idx);
                this.draw_line_list.push(param.line_idx);

                // let start_x = -327;
                // let add_x = -163 +327;
                // let start_y = 187;
                // let add_y = 65 - 187;
                // // for (let index = 0; index < param.line_idx.length; index++) {
                // //     const element = param.line_idx[index];
                //     let pos = [];
                //     for (let index2 = 0; index2 < param.line_idx.length; index2++) {
                //         const idx = param.line_idx[index2];
                //         let row_indx = Math.ceil(idx / 5);
                //         let column_indx = idx % 5;
                //         if(column_indx==0){
                //             column_indx = 5;
                //         }
                //         pos.push({x:start_x+(column_indx-1)*add_x + num_line*0, y:start_y+(row_indx-1)*add_y - num_line*1})
                //     }
                //     num_line = num_line + 1;
                //     cc.log(pos);
                //     this.draw_line.change_to_3d(pos);
                // // }

                return;
            }

            for (let index = 1; index <= max_row_num; index++) {
                let result_idx = (column_index + 1) + (index-1)*max_column_num;

                let element = result[result_idx-1];
                let pre_param = {};
                pre_param.row_index = index;
                pre_param.column_index = column_index + 1;
                pre_param.id = element.id;
                pre_param.next_id = next_id;
                pre_param.count = count;
                let line_obj = [];
                for (let line_index = 0; line_index < line_idx.length; line_index++) {
                    line_obj.push(line_idx[line_index]);
                }
                pre_param.line_idx = line_obj;

                // 核心逻辑
                let is_break = false;
                let is_wild = wild_list[element.id] || false;
                if(next_id == null){
                    pre_param.count = pre_param.count + 1;
                    pre_param.line_idx.push(result_idx);
                    if(is_wild == false){
                        pre_param.next_id = element.id;
                    }
                }else if(next_id == element.id || is_wild){
                    pre_param.count = pre_param.count + 1;
                    pre_param.line_idx.push(result_idx);
                }else{
                    // 不连续
                    is_break = true;
                }

                // 连线路径是否有效（过滤不必要的遍历）
                let line_work = this.check_line_work(pre_param.line_idx);
                if(line_work){
                    // if(is_break){
                    //     // 已经连续是否 大于最低连线 3
                    //     cc.log("不连续了 总结", pre_param.line_idx);
                    // }else{
                    //     check_child_func(pre_param);
                    // }
                    check_child_func(pre_param);
                }
            }
        };

        let param = {};
        param.row_index = 0;
        param.column_index = 0;
        param.id = 0;
        param.next_id = null;
        param.count = 0;
        param.line_idx = [];
        param.line_id = [];

        this.draw_line_list = [];
        check_child_func(param);
        // 删除线
        // for (let index = 0; index < this.draw_line_list.length; index++) {
        //     if(index > 20){
        //         this.draw_line_list.splice(index, this.draw_line_list.length-20);
        //         break;
        //     }
        // }
        this.make_line_data();
        // this.draw_line_data = {};

        let start_x = -327;
        let add_x = -163 +327;
        let start_y = 187;
        let add_y = 60 - 187;

        for (let index = 0; index < this.draw_line_list.length; index++) {
            let line = this.draw_line_list[index];

            let pos = [];
            for (let index1 = 0; index1 < line.length; index1++) {
                let point_idx = line[index1];
                let line_data = this.draw_line_data[point_idx];

                let max_count = line_data.all_line.length; //最大线数
                let curr_idx = line_data.line_idx[index];  //所属序号

                // cc.log(max_count, curr_idx, "ssss");
                let line_obj = line_data.all_line[curr_idx];
                let row_indx = line_obj.row_indx;
                let column_indx = line_obj.column_indx;

                let line_add_x = 0;//(max_count*3)/2 - curr_idx*3;
                let line_add_y = (max_count*3)/2 - curr_idx*3;
                pos.push({x:start_x+(column_indx-1)*add_x + line_add_x, y:start_y+(row_indx-1)*add_y + line_add_y});
            }
            this.draw_line.change_to_3d(pos);
        }

        // // for (let index = 0; index < param.line_idx.length; index++) {
        // //     const element = param.line_idx[index];
        //     let pos = [];
        //     for (let index2 = 0; index2 < param.line_idx.length; index2++) {
        //         const idx = param.line_idx[index2];
        //         let row_indx = Math.ceil(idx / 5);
        //         let column_indx = idx % 5;
        //         if(column_indx==0){
        //             column_indx = 5;
        //         }
        //         pos.push({x:start_x+(column_indx-1)*add_x + num_line*0, y:start_y+(row_indx-1)*add_y - num_line*1})
        //     }
        //     num_line = num_line + 1;
        //     cc.log(pos);
        //     this.draw_line.change_to_3d(pos);
        // // }
        
    },


    // 连线 （不连续的也要接上线）
    // 按照配置顺序 播放单线动画
    // 过滤不需要的连线
    // 生成画线数据
    make_line_data() {
        let draw_line_list = this.draw_line_list || this.element_line;

        let point_line = {};
        for (let line_index = 0; line_index < draw_line_list.length; line_index++) {
            let element = draw_line_list[line_index];
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
                obj.row_indx = curr_rc.row_indx;
                obj.column_indx = curr_rc.column_indx;

                point_line[pos_idx].all_line.push(obj);
            }
        }

        // 取后一个点
        let get_after_point = (line_index, pos_index)=>{
            let line = draw_line_list[line_index];

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

        this.draw_line_data = point_line;
        // cc.log(point_line);
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


});

