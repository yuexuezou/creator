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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bb_node = cc.find('BB', this.node);

        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        // 显示物理组件代码
        physicsManager.debugDrawFlags = 
            // 0;
            // cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;
        this.physicsManager = physicsManager;


        this.dt_win_jblz = cc.find('dt_win_jblz', this.node);
        let particle = this.dt_win_jblz.getComponent(cc.ParticleSystem);

        this.img_coin = cc.find('img_coin', this.node);

        this.btn_test_1 = cc.find('btn_test_1', this.node);
        
        this.btn_test_1.on('touchend', (event)=>{
            // let param = {};
            // param.x = 0;
            // param.y = -350;
            // param.x_speed = Math.random()*2000;
            // param.y_speed = 1500+Math.random()*500;
            // param.parent = this.node;
            // // param.zIndex = 0;
            // this.make_coin(param);

            // for (let index = 0; index < 150; index++) {
            //     this.delay_do(this.node, 0.01*index, ()=>{
                    
            //     });
            // }

            
        }, this);


        this.panel_gold_ani = cc.find('panel_gold_ani', this.node);
        this.superwin = cc.find('superwin', this.node);

        this.btn_test_2 = cc.find('btn_test_2', this.node);
        this.btn_test_2.on('touchend', (event)=>{
            this.superwin.active = !this.superwin.active;
        })

        // 0.5 0.4 0.3
        let delay = cc.delayTime(0.4);
        let call_1 = cc.callFunc(()=>{
            this.make_coin({parent:this.node, x:0, y:-350, x_speed:Math.random()*10, y_speed:1800+Math.random()*200, zIndex:-1});
            this.make_coin({parent:this.node, x:10+Math.random()*10, y:-350, x_speed:50+Math.random()*50, y_speed:1300+Math.random()*700, zIndex:-1});
            this.make_coin({parent:this.node, x:10+Math.random()*10, y:-350, x_speed:100+Math.random()*50, y_speed:1300+Math.random()*700, zIndex:-1});
            this.make_coin({parent:this.node, x:10+Math.random()*10, y:-350, x_speed:150+Math.random()*50, y_speed:1300+Math.random()*700, zIndex:-1});
            this.make_coin({parent:this.node, x:15+Math.random()*10, y:-350, x_speed:250+Math.random()*50, y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:15+Math.random()*10, y:-350, x_speed:300+Math.random()*100, y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:20+Math.random()*10, y:-350, x_speed:400+Math.random()*100, y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:20+Math.random()*10, y:-350, x_speed:500+Math.random()*100, y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:20+Math.random()*10, y:-350, x_speed:600+Math.random()*100, y_speed:1300+Math.random()*600, zIndex:-1});

            this.make_coin({parent:this.node, x:-1*(10+Math.random()*10), y:-350, x_speed:-1*(50+Math.random()*50), y_speed:1300+Math.random()*700, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(10+Math.random()*10), y:-350, x_speed:-1*(100+Math.random()*50), y_speed:1300+Math.random()*700, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(10+Math.random()*10), y:-350, x_speed:-1*(150+Math.random()*50), y_speed:1300+Math.random()*700, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(15+Math.random()*10), y:-350, x_speed:-1*(250+Math.random()*50), y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(15+Math.random()*10), y:-350, x_speed:-1*(300+Math.random()*100), y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(20+Math.random()*10), y:-350, x_speed:-1*(400+Math.random()*100), y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(20+Math.random()*10), y:-350, x_speed:-1*(500+Math.random()*100), y_speed:1300+Math.random()*600, zIndex:-1});
            this.make_coin({parent:this.node, x:-1*(20+Math.random()*10), y:-350, x_speed:-1*(600+Math.random()*100), y_speed:1300+Math.random()*600, zIndex:-1});

            this.make_coin({parent:this.node, x:Math.random()*20, y:440, x_speed:Math.random()*900, y_speed:0, zIndex:1, delay:0.5});
            this.make_coin({parent:this.node, x:-1*(Math.random()*20), y:440, x_speed:-1*(Math.random()*900), y_speed:0, zIndex:1, delay:0.5});
        });
        let seq1 = cc.sequence(delay, call_1);
        this.node.runAction(cc.repeatForever(seq1));
    },
    // 延迟执行
    delay_do(node, time, call_func){
        let delay = cc.delayTime(time);
        let call_1 = cc.callFunc(()=>{
            call_func()
        });
        let seq1 = cc.sequence(delay, call_1);
        node.runAction(seq1);
    },
    // 球 刚体
    create_gold() {
        let node = new cc.Node();
        let body = node.addComponent(cc.RigidBody);
        body.gravityScale = 8;
        return node;
    },
    // 生成金币
    make_coin(param){
        let parent = param.parent;
        let x = param.x;
        let y = param.y;
        let x_speed = param.x_speed;
        let y_speed = param.y_speed;
        let zIndex = param.zIndex || 0;
        let delay = Math.random()*0.5;
        if(param.delay){
            delay = param.delay + delay;
        }

        let shot_func = ()=>{
            let copy_img_coin = this.create_gold();
            copy_img_coin.parent = parent;
            this.add_gold_ani(copy_img_coin);
            this.delay_do(copy_img_coin, 3, ()=>{
                copy_img_coin.destroy();
            });

            copy_img_coin.zIndex = zIndex;
            copy_img_coin.x = x;
            copy_img_coin.y = y;

            let rigidBody = copy_img_coin.getComponent(cc.RigidBody);
            rigidBody.linearVelocity = cc.v2(x_speed, y_speed);
            if(y_speed>=1800){
                if(Math.random()>=0.5){
                    this.delay_do(this.node, 0.5, ()=>{
                        copy_img_coin.zIndex = 1;
                    });
                }
            }
        };
        if(delay===0){
            shot_func();
            return;
        }
        this.delay_do(this.node, delay, ()=>{
            shot_func();
        });
    },
    start () {
        // let result = [
        //     {id:2},{id:5},{id:2},{id:4},{id:4},{id:4},
        //     {id:2},{id:2},{id:2},{id:4},{id:4},{id:4},
        //     {id:2},{id:2},{id:2},{id:4},{id:4},{id:4},
        //     {id:2},{id:2},{id:2},{id:2},{id:2},{id:4},
        // ];

        // let play_ani = [
        //     1,  2,  3,  4,  5,  6,
        //     7,  8,  9, 10, 11, 12,
        //    13, 14, 15, 16, 17, 18,
        //    19, 20, 21, 22, 23, 24,
        // ];

        // this.combine_element(result, play_ani);
        this.load_gold_res();
    },
    load_gold_res(){
        this._listSpriteFrame = [
            'game_1/res/effect_ani/coin_effect/01',
            'game_1/res/effect_ani/coin_effect/02',
            'game_1/res/effect_ani/coin_effect/03',
            'game_1/res/effect_ani/coin_effect/04',
            'game_1/res/effect_ani/coin_effect/05',
            'game_1/res/effect_ani/coin_effect/06',
            'game_1/res/effect_ani/coin_effect/07',
            'game_1/res/effect_ani/coin_effect/08',
            'game_1/res/effect_ani/coin_effect/09',
            'game_1/res/effect_ani/coin_effect/10',
            'game_1/res/effect_ani/coin_effect/11',
            'game_1/res/effect_ani/coin_effect/12',
            'game_1/res/effect_ani/coin_effect/13',
            'game_1/res/effect_ani/coin_effect/14',
            'game_1/res/effect_ani/coin_effect/15',
            'game_1/res/effect_ani/coin_effect/16',
            'game_1/res/effect_ani/coin_effect/17',
            'game_1/res/effect_ani/coin_effect/18',
            'game_1/res/effect_ani/coin_effect/19',
            'game_1/res/effect_ani/coin_effect/20',
            'game_1/res/effect_ani/coin_effect/21',
            'game_1/res/effect_ani/coin_effect/22',
            'game_1/res/effect_ani/coin_effect/23',
            'game_1/res/effect_ani/coin_effect/24',
            'game_1/res/effect_ani/coin_effect/25',
            'game_1/res/effect_ani/coin_effect/26',
            'game_1/res/effect_ani/coin_effect/27',
            'game_1/res/effect_ani/coin_effect/28',
            'game_1/res/effect_ani/coin_effect/29',
            'game_1/res/effect_ani/coin_effect/30',
        ]
        cc.loader.loadResArray(this._listSpriteFrame,cc.SpriteFrame,(err,assets)=>{
            if(err){
                console.log(err);
                return;
            }
            this.assets = assets;
        });
    },
    // 添加金币动画
    add_gold_ani(parent){
        let assets = this.assets;
        let node = new cc.Node();
        node.parent = parent;
        node.addComponent(cc.Sprite).spriteFrame = assets[0];
        let ani = node.addComponent(cc.Animation);
        let arr3=[];
        let arrLength = this._listSpriteFrame.length;
        let idx = Math.floor(Math.random()*(arrLength-1));
        for(let j=idx;j<arrLength+idx;j++){
            arr3.push(assets[j%arrLength]);
        }
        let clip = cc.AnimationClip.createWithSpriteFrames(arr3, arr3.length);
        clip.name = 'ani';
        clip.wrapMode = cc.WrapMode.Loop;
        ani.addClip(clip);
        ani.play('ani');
        return node;
    },
    
    // 合并元素成大动画
    combine_element(result, play_ani){
        let data = {};
        data.result = result;
        data.play_ani = play_ani;

        this.combine_step_1(data);
        // let play_idx = data.play_idx;  //播放索引表
        let play_id = data.play_id;   //不同id 列表

        data.row_data = [];  //连续元素 集合
        for (let index = 1; index <= 4; index++) {
            data.row_data[index] = [];
        }

        // 插入连续元素
        for (const key in play_id) {
            let id = play_id[key];
            for (let index = 1; index <= 4; index++) {
                this.combine_step_2(id, index, data);
            }
        }
        // console.log(data.row_data);

        // 合并列
        data.compare_data = [];
        for (let index = 1; index <= 4; index++) {
            let row_data = data.row_data[index];
            for (let index1 = 0; index1 < row_data.length; index1++) {
                let element_obj = row_data[index1];
                this.combine_step_3(element_obj, index, data);
            }
        }
        // console.log(data.compare_data);

        // 排除冲突项
        this.combine_step_4(data);
        // console.log(data.compare_data);
         
        return data.compare_data;
    },
    // 生成列表
    combine_step_1(data){
        let play_ani = data.play_ani;
        let result = data.result;

        let play_idx = {};
        let play_id = {};
        for (let index = 0; index < play_ani.length; index++) {
            let idx = play_ani[index];
            let id = result[idx-1].id;
            play_idx[idx] = id;
            if(id!=2){
                play_id[id] = id;
            }
        }
        data.play_idx = play_idx;
        data.play_id = play_id;
    },
    combine_step_2(find_id, row_index, data){
        let row_data = data.row_data[row_index];
        let play_idx = data.play_idx;

        let find_num = 1;
        let start_idx = 0;
        let count_func = ()=>{
            // 记录超过三条的数据
            if(find_num>=3){
                row_data.push({start_idx:start_idx, id:find_id, width:find_num, height:0});
            }

            start_idx = 0;
            find_num = 1;
        }
        for (let index = 1; index <= 6; index++) {
            let id = play_idx[index + 6*(row_index-1)];
            if(id){
                if(id===find_id||id === 2){
                    if(start_idx === 0){
                        start_idx = index;
                        find_num = 1;
                    }else{
                        find_num = find_num + 1;
                    }
                    if(index===6){
                        // 统计
                        count_func();
                    }
                }else{
                    // 统计
                    count_func();
                }
            }else{
                // 统计
                count_func();
            }
        }
    },
    combine_step_3(element_obj, idx, data){
        let row_data = data.row_data;
        let compare_data = data.compare_data;
        
        let element_start_idx = element_obj.start_idx;
        let element_end_idx = element_obj.start_idx + element_obj.width - 1;
        let count_height = 1;
        for (let index = idx+1; index <= 4; index++) {
            let row_obj = row_data[index];
            for (let index1 = 0; index1 < row_obj.length; index1++) {
                let compare_element = row_obj[index1];
                if(compare_element.id===element_obj.id){
                    // 合并数据 取交互数据
                    // start_idx:start_idx, id:find_id, width:find_num
                    let temp_start_idx = element_start_idx > compare_element.start_idx ? element_start_idx:compare_element.start_idx;
                    let compare_end_idx = compare_element.start_idx + compare_element.width - 1;
                    let temp_end_idx = element_end_idx < compare_end_idx ? element_end_idx:compare_end_idx;
                    let temp_width = (temp_end_idx - temp_start_idx) + 1;
                    if(temp_width>=3){
                        count_height = count_height + 1;
                        if(count_height>=3){
                            compare_data.push({start_idx:temp_start_idx, row_idx:idx, id:element_obj.id, width:temp_width, height:count_height})
                            element_start_idx = temp_start_idx;
                            element_end_idx = temp_end_idx;
                        }
                    }
                }
            }
        }
    },
    // 排除冲突项
    combine_step_4(data){
        let compare_data = data.compare_data;
        for (let index = 0; index < compare_data.length; index++) {
            let element_obj_1 = compare_data[index];
            if(!element_obj_1.is_remove){
                for (let index1 = index+1; index1 < compare_data.length; index1++) {
                    let element_obj_2 = compare_data[index1];
                    let is_clash = this.check_clash(element_obj_1, element_obj_2);

                    // 冲突操作
                    if(is_clash){
                        let size1 = element_obj_1.width * element_obj_1.height;
                        let size2 = element_obj_2.width * element_obj_2.height;
                        if(size1<size2){
                            element_obj_1.is_remove = true;
                            break;
                        }else if(size1>size2){
                            element_obj_2.is_remove = true;
                        }else{
                            if(element_obj_1.id<element_obj_2.id){
                                element_obj_2.is_remove = true;
                            }else{
                                element_obj_1.is_remove = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    // 校验冲突
    check_clash(element_obj_1, element_obj_2){
        // {start_idx: 1, row_idx: 1, id: 1, width: 6, height: 3}
        let a1 = {x:element_obj_1.start_idx, y:element_obj_1.row_idx};
        let b1 = {x:a1.x + element_obj_1.width - 1, y:a1.y};
        let c1 = {x:a1.x, y:a1.y + element_obj_1.height - 1};

        let a2 = {x:element_obj_2.start_idx, y:element_obj_2.row_idx};
        let b2 = {x:a1.x + element_obj_2.width - 1, y:a1.y};
        let c2 = {x:a1.x, y:a1.y + element_obj_2.height - 1};
        let d2 = {x:b2.x, y:c2.y};
        
        if((a1.x <= a2.x && a2.x <= b1.x) && (a1.y <= a2.y && a2.y <= c1.y)){
            return true;
        }
        if((a1.x <= b2.x && b2.x <= b1.x) && (a1.y <= b2.y && b2.y <= c1.y)){
            return true;
        }
        if((a1.x <= c2.x && c2.x <= b1.x) && (a1.y <= c2.y && c2.y <= c1.y)){
            return true;
        }
        if((a1.x <= d2.x && d2.x <= b1.x) && (a1.y <= d2.y && d2.y <= c1.y)){
            return true;
        }
        return false;
    },
    // update (dt) {},
});







/*

顺序执行管理器

添加执行
执行完毕
取消执行
// 插队执行


// 执行函数管理器
do_func_mgr

let param = {}
param.do_func =  0;
param.priority =  low;  'low'  'normal'   'high'  'promptly'
param.name =  0;
param.end_func =  0;
sysEvent.emit('event_xxxx_func_add', param);

ddd.end_func(
    sysEvent.emit('event_xxxx_func_finish', param);
    sysEvent.emit('event_xxxx_func_cancel', param);
)

param.do_func =  0;
param.priority =  low;  'low'  'normal'   'high'  'promptly'



event_xxxx_func_add(param){

},
event_xxxx_func_finish(param){

},
event_xxxx_func_cancel(param){

},



add_call_func(){
    let param = {};
    let end_call = ()=>{
        sysEvent.emit('event_pirate_func_finish', param);
    };
    param.do_func = ()=>{
        slot.ui.showNoAni('hall/ui/bigwin/hall_big_win', 1, 500000, end_call);
    }
    sysEvent.emit('event_pirate_func_add', param);
},





















*/


