cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        executeInEditMode: true,
    },
    properties: {
        panel_line_model: {
            default:null,
            tooltip:"线",
            type: cc.Node
        },
        panel_line_parent: {
            default:null,
            tooltip:"线添加节点",
            type: cc.Node
        },
        // element_start: {
        //     default:cc.v2(0, 0),
        //     tooltip:"第一个元素",
        // },
        // element_width: {
        //     default:0,
        //     tooltip:"元素之间宽",
        // },
        // element_height: {
        //     default:0,
        //     tooltip:"元素之间高",
        // },
        // element_row_num: {
        //     default:0,
        //     tooltip:"行数",
        // },
        // element_column_num: {
        //     default:0,
        //     tooltip:"列数",
        // },
    },


    onLoad () {
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
    },

    start () {
        if(true){
            return;
        }
        // this.Graphics.lineTo(100, 0);
        // this.Graphics.lineTo(101, 0);
        // this.Graphics.lineTo(102, 0);
        // this.Graphics.lineTo(200, -100);

        // this.Graphics.stroke();


        // this.add_line([{x:100, y:100}, {x:100, y:100}, {x:100, y:100}, {x:100, y:100}, {x:100, y:100}]);
        
        let start_x = -327;
        let add_x = -163 +327;
        let start_y = 187;
        let add_y = 65 - 187;
        
        let line_obj1 = [
            {x:start_x+add_x*0, y:start_y+add_y*0},
            {x:start_x+add_x*1, y:start_y+add_y*0},
            {x:start_x+add_x*2, y:start_y+add_y*0},
            {x:start_x+add_x*3, y:start_y+add_y*0},
            {x:start_x+add_x*4, y:start_y+add_y*0},
        ];
        let line_obj2 = [
            {x:start_x+add_x*0, y:start_y+add_y*1},
            {x:start_x+add_x*1, y:start_y+add_y*1},
            {x:start_x+add_x*2, y:start_y+add_y*1},
            {x:start_x+add_x*3, y:start_y+add_y*1},
            {x:start_x+add_x*4, y:start_y+add_y*1},
        ];
        this.panel_line_parent.removeAllChildren();
        // this.add_line(line_obj1);
        // this.add_line(line_obj2);


        for (let index = 0; index < element_line.length; index++) {
            const element = element_line[index];
            let pos = [];
            for (let index2 = 0; index2 < element.length; index2++) {
                const idx = element[index2];
                let row_indx = Math.ceil(idx / 5);
                let column_indx = idx % 5;
                if(column_indx==0){
                    column_indx = 5;
                }
                pos.push({x:start_x+(column_indx-1)*add_x, y:start_y+(row_indx-1)*add_y})
            }
            // cc.log(pos);
            this.add_line(pos);
        }
    },

    update (dt) {},

    // 设置
    set_point_pos(){
        
    },
    get_color(){
        if(this.color_idx == null){
            this.color_idx = 0;
        }
        /* 
        

        let cell = Math.floor(255/(this.element_line.length/3));
        let color = cc.color(0, 0, 0, 255);
        if(this.color_idx <= 1*(this.element_line.length/3)){
            let value = Math.floor(this.color_idx-0*(this.element_line.length/3));
            value = value * cell;
            color = cc.color(value, 0, 255, 255);
            // cc.log('333333333', value);
        }else if(this.color_idx <= 2*(this.element_line.length/3)){
            let value = Math.floor(this.color_idx-1*(this.element_line.length/3));
            color = cc.color(255, value, 0, 255);
            value = value * cell;
            // cc.log('222222222', value);
        }else if(this.color_idx <= 3*(this.element_line.length/3)){
            let value = Math.floor(this.color_idx-2*(this.element_line.length/3));
            color = cc.color(0, 255, value, 255);
            value = value * cell;
            // cc.log('11111111', value);
        }
        // cc.log(this.color_idx);
        this.color_idx = this.color_idx + 1;
        return color;
        */

        let num = 5;
        let cell_value = 255/num;
        let count_color = num * num + num * num + num * num + num + num + num;
        // cc.log(count_color, this.color_idx, "count_color");

        let curr_index = this.color_idx;
        this.color_idx = this.color_idx + 1;
        // for (let index = 0; index < count_color; index++) {
            if(curr_index < 1*num){
                let color_value = cell_value * curr_index;

                color_value = Math.floor(color_value - cell_value/1);
                let color = cc.color(255, 255, color_value, 255);
                return color;
            }else if(curr_index < 2*num){
                let color_value = cell_value * (curr_index-1*num);
                color_value = Math.floor(color_value - cell_value/1);
                let color = cc.color(255, color_value, 255, 255);
                return color;
            }else if(curr_index < 3*num){
                let color_value = cell_value * (curr_index-2*num);
                color_value = Math.floor(color_value - cell_value/1);
                let color = cc.color(color_value, 255, 255, 255);
                return color;
            }else if(curr_index < 3*num + 1*num*num){
                let cur_idx = curr_index-3*num

                let row_indx = Math.ceil(cur_idx / num);  // 1,2,3行
                let column_indx = cur_idx % num;          // 1,2,3列
                if(column_indx==0){
                    column_indx = num;
                }
                let color_value_1 = (row_indx-1) * cell_value;
                let color_value_2 = (column_indx-1) * cell_value;
                color_value_1 = Math.floor(color_value_1 - cell_value/1);
                color_value_2 = Math.floor(color_value_2 - cell_value/1);

                let color = cc.color(color_value_1, color_value_2, 255, 255);
                return color;
            }else if(curr_index < 3*num + 2*num*num){
                let cur_idx = curr_index-(3*num + 1*num*num)

                let row_indx = Math.ceil(cur_idx / num);  // 1,2,3行
                let column_indx = cur_idx % num;          // 1,2,3列
                if(column_indx==0){
                    column_indx = num;
                }
                let color_value_1 = (row_indx-1) * cell_value;
                let color_value_2 = (column_indx-1) * cell_value;
                color_value_1 = Math.floor(color_value_1 - cell_value/1);
                color_value_2 = Math.floor(color_value_2 - cell_value/1);

                let color = cc.color(color_value_1, 255, color_value_2, 255);
                return color;
            }else if(curr_index < 3*num + 3*num*num){
                let cur_idx = curr_index-(3*num + 2*num*num)

                let row_indx = Math.ceil(cur_idx / num);  // 1,2,3行
                let column_indx = cur_idx % num;          // 1,2,3列
                if(column_indx==0){
                    column_indx = num;
                }
                let color_value_1 = (row_indx-1) * cell_value;
                let color_value_2 = (column_indx-1) * cell_value;
                color_value_1 = Math.floor(color_value_1 - cell_value/1);
                color_value_2 = Math.floor(color_value_2 - cell_value/1);
                let color = cc.color(255, color_value_1, color_value_2, 255);
                return color;
            }

            // curr_index = curr_index + 1;
        // }
        return cc.color(0, 0, 0, 255);
    },
    // 添加线
    add_line(point){
        let line_node = cc.instantiate(this.panel_line_model);
        line_node.parent = this.panel_line_parent;
        line_node.x = 0;
        line_node.y = 0;
        
        let Graphics = line_node.getComponent(cc.Graphics);
        let color = this.get_color();
        Graphics.strokeColor = color;//cc.color(255, 255, 0, 255);
        Graphics.fillColor = color;//cc.color(0, 0, 0, 255);//color;
        Graphics.clear();
        Graphics.moveTo(point[0].x-65, point[0].y);

        for (let index = 0; index < point.length; index++) {
            let pos = point[index];
            Graphics.lineTo(pos.x, pos.y);
        }
        Graphics.lineTo(point[point.length-1].x+65, point[point.length-1].y);
        Graphics.stroke();
    },

    // 改成立体效果
    change_to_3d(points){
        // let points = [cc.v2(-200, -300), cc.v2(100, -300), cc.v2(300, 100)];
        let Graphics_model = this.panel_line_model.getComponent(cc.Graphics);
        let line_width = Graphics_model.lineWidth;

        // 从外圈开始 画线
        let division_obj = [
            {percent_min:0.5, percent_max:1, color_min:0.8, color_max:0.2, num:4},
            {percent_min:0.1, percent_max:0.5, color_min:1, color_max:0.8, num:4},
        ];

        let color = this.get_color();

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
    // // 改成立体效果
    // change_to_3d(){
    //     let points = [cc.v2(-200, -200), cc.v2(100, -200), cc.v2(300, 200), cc.v2(400, 200)];
    //     let Graphics_model = this.panel_line_model.getComponent(cc.Graphics);
    //     let line_width = Graphics_model.lineWidth;

    //     // 对称关系 数据表示线下半部组成
    //     let division_obj = [
    //         {percent_min:0.5, percent_max:1, color_min:0.8, color_max:0.2, num:4},
    //         {percent_min:0.1, percent_max:0.5, color_min:1, color_max:0.8, num:4},
    //     ];

    //     let color = cc.color(255, 255, 0, 255);

    //     // 添加分割线
    //     let add_division_line = (param)=>{
    //         let line_node = cc.instantiate(this.panel_line_model);
    //         line_node.parent = this.node;
    //         line_node.x = 0;
    //         line_node.y = 0;

    //         let Graphics = line_node.getComponent(cc.Graphics);
    //         Graphics.lineWidth = param.width;
    //         Graphics.strokeColor = param.color;
    //         Graphics.clear();
    //         Graphics.moveTo(points[0].x-65, points[0].y);
    //         for (let index = 0; index < points.length; index++) {
    //             let pos = points[index];
    //             Graphics.lineTo(pos.x, pos.y);
    //         }
    //         Graphics.lineTo(points[points.length-1].x+65, points[points.length-1].y);
    //         Graphics.stroke();
    //     };

    //     // 分割函数
    //     let division_func = (obj)=>{
    //         for (let index = 0; index < obj.length; index++) {
    //             const element = obj[index];

    //             let cell_width = (element.percent_max - element.percent_min) / element.num;
    //             let cell_color = (element.color_max - element.color_min) / element.num;
    //             for (let index1 = 1; index1 <= element.num; index1++) {
    //                 let color_percent = element.color_max - (index1 -1) * cell_color;
    //                 let set_color = cc.color(color.r * color_percent, color.g * color_percent, color.b * color_percent, 255);
    //                 let width_percent = element.percent_max - (index1 -1) * cell_width;
    //                 let set_width = line_width * width_percent;
    //                 add_division_line({width:set_width, color:set_color});
    //             }
    //         }
    //     };
    //     division_func(division_obj);
    // },
});

// 平行线 角度小于 180 往上