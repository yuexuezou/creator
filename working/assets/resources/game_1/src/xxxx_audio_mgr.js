cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad(){
        // bgm 背景音类型
        // effect 音效类型
        // other 音频类型
        this.config = {};
        this.config['lion_base_spin_bgm'] = {bgm:1, level:0};
        this.config['lion_medium_show'] = {effect:1};
        this.config['lion_free_chose_bgm'] = {other:1};

        this.config['shz_room'] = {bgm:1, level:0};
        this.config['shz_room_1'] = {effect:1};
        this.config['shz_room_2'] = {effect:1};
        this.config['shz_room_3'] = {other:1};

        this.path = 'game_1/res/sound/';
    },
    start(){
        this.test_btn_1();

        // this.test_ppppppppp();

        
        this.test_layout();
    },
    // 测试布局
    test_layout(){
        let panel_layout = cc.find('panel_layout', this.node);

        let load_num = 5;
        let cur_num = 0;
        let width = 0;
        let load_call = (node)=>{
            cur_num = cur_num + 1;
            width = width + node.width;
            if(cur_num === load_num){
                panel_layout.width = width;
            }
        };

        let path = 'game_1/res/element/sdad';
        this.add_sprite({parent:panel_layout, path:path, load_call:load_call});
        this.add_gap_node({parent:panel_layout, gap:100, load_call:load_call})
        this.add_sprite({parent:panel_layout, path:path, load_call:load_call});
        this.add_gap_node({parent:panel_layout, gap:10, load_call:load_call})
        let path1 = 'game_1/res/element/b15';
        let act_name = 'line';
        this.add_spine({parent:panel_layout, path:path1, act_name:act_name, loop:true, load_call:load_call})
    },
    add_gap_node(param){
        let parent = param.parent;
        let gap = param.gap;
        let load_call = param.load_call;
        let node = new cc.Node();
        node.parent = parent;
        node.width = gap;
        if(load_call){
            // cc.log(node.width);
            load_call(node);
        }
    },
    add_spine(param){
        let parent = param.parent;
        let path = param.path;
        let act_name = param.act_name;
        let loop = param.loop || false;
        let end_call = param.end_call;
        let load_call = param.load_call;

        let node = new cc.Node();
        node.parent = parent;
        let spine = node.addComponent(sp.Skeleton);
        cc.loader.loadRes(path,sp.SkeletonData,(err,asset)=>{
            if(err){
                return;
            }
            if(!node){
                return;
            }
            spine.skeletonData = asset;
            spine.setAnimation(0, act_name, loop);
            spine.premultipliedAlpha = false;
            spine.setCompleteListener(()=>{
                if(end_call){
                    end_call();
                }
            });
            if(load_call){
                load_call(node);
            }
        });
        return node;
    },
    add_sprite(param){
        let parent = param.parent;
        let path = param.path;
        let load_call = param.load_call;

        let node = new cc.Node();
        node.parent = parent;
        cc.loader.loadRes(path, cc.SpriteFrame, (err, asset)=>{
            if(err){
               return;
            }
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = asset;
            if(load_call){
                load_call(node);
            }
        })
        return node;
    },

    test_ppppppppp(){
        let node2 = new cc.Node();
        node2.parent = this.node;
        let path2 = 'game_1/res/element/sdad';
        
        cc.loader.loadRes(path2, cc.SpriteFrame, (err, asset)=>{
            if(err){
               return;
            }

            let sprite = node2.addComponent(cc.Sprite);
            sprite.spriteFrame = asset;
            sprite.type = cc.Sprite.Type.SLICED;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;

            sprite.size = cc.size(500, 600);
        })

        let node = new cc.Node();
        node.parent = this.node;
        let path = 'game_1/res/element/fzdw_ysbk_dj';
        cc.loader.loadRes(path, cc.SpriteFrame, (err, asset)=>{
            if(err){
               return;
            }

            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = asset;
            // sprite.type = cc.Sprite.Type.SLICED;
            // sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;

            // node.width = 167;
            // node.height = 130;
            node.y = 3;
            node.scale = 2;
            sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;

            this.add_animation(node, 'game_1/res/element/ysbk_dj', "act_frame");
        })
    },
    add_animation(node, clip_path, act_name){
        let ani = node.addComponent(cc.Animation);
        // 加载 AnimationClip
        cc.loader.loadRes(clip_path, function (err, clip) {
            if(!node){
                return;
            }
            ani.addClip(clip, act_name);
            ani.play(act_name);
        });
    },
    test_btn_1(){
        let btn = cc.find('test_btn_1', this.node);
        btn.on('touchend', ()=>{
            this.event_play_sound('lion_base_spin_bgm');
        }, this);
        let Background = cc.find('Background', btn);
        let Label = cc.find('Label', Background);
        Label.getComponent(cc.Label).string = 'lion_base_spin_bgm';
    },


    // 播放音频
    event_play_sound(name){
        let url = this.path + name;
        let config_obj = this.config[name];
        let type = "effect";
        if(config_obj){
            if(config_obj.bgm){
                type = 'bgm'
            }else if(config_obj.other){
                type = 'other'
            }
        }
        if(type === "effect"){
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if(err){
                    console.log(err);
                    return;
                }
                var audioID = cc.audioEngine.playEffect(clip, false);
            });
        }else if(type === "bgm"){
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if(err){
                    console.log(err);
                    return;
                }
                var audioID = cc.audioEngine.playMusic(clip, true);
            });
        }else if(type === "other"){
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if(err){
                    console.log(err);
                    return;
                }
                var audioID = cc.audioEngine.play(clip, false, 0.5);
            });
        }

    },
    // 停止播放音频
    event_stop_sound(name){

    }

    // update (dt) {},
});
/*

play 播放音频
setLoop 设置音频是否循环。
isLoop 获取音频的循环状态。
setVolume 设置音量（0.0 ~ 1.0）。
getVolume 获取音量（0.0 ~ 1.0）。
setCurrentTime 设置当前的音频时间。
getCurrentTime 获取当前的音频播放时间。
getDuration 获取音频总时长。
getState 获取音频状态。
setFinishCallback 设置一个音频结束后的回调
pause 暂停正在播放音频。
pauseAll 暂停现在正在播放的所有音频。
resume 恢复播放指定的音频。
resumeAll 恢复播放所有之前暂停的所有音频。
stop 停止播放指定音频。
stopAll 停止正在播放的所有音频。
setMaxAudioInstance 设置一个音频可以设置几个实例
getMaxAudioInstance 获取一个音频可以设置几个实例
uncache 卸载预加载的音频。
uncacheAll 卸载所有音频。
preload 预加载一个音频
setMaxWebAudioSize 设置一个以 KB 为单位的尺寸，大于这个尺寸的音频在加载的时候会强制使用 dom 方式加载

playEffect 播放音效
setEffectsVolume 设置音效音量（0.0 ~ 1.0）。
getEffectsVolume 获取音效音量（0.0 ~ 1.0）。
pauseEffect 暂停播放音效。
pauseAllEffects 暂停播放所有音效。
resumeEffect 恢复播放音效音频。
resumeAllEffects 恢复播放所有之前暂停的音效。
stopEffect 停止播放音效。
stopAllEffects 停止播放所有音效。


playMusic 播放背景音乐
stopMusic 停止播放背景音乐。
pauseMusic 暂停播放背景音乐。
resumeMusic 恢复播放背景音乐。
getMusicVolume 获取音量（0.0 ~ 1.0）。
setMusicVolume 设置背景音乐音量（0.0 ~ 1.0）。
isMusicPlaying 背景音乐是否正在播放



    // 背景音乐 类型
        1.不会被打断 一直播
        2.会被打断，终止后会恢复播放
        3.会被打断，终止后不会恢复播放

        后加的背景音优先播放

        音效也有层级？
        音效只播一次？


        打断原先背景音

        弹出新界面


    // 被打断

    // 当前播放的背景音乐

    // 切换背景音乐 恢复播放音乐

    播放背景音   级别 类似 zindex 类型
        同级别会被替换掉


    暂停背景音




    接口
        1.播放背景音乐（背景音名字）
        2.停止播放背景音（背景音名字）
        3.播放音效（音效名）
        4.停止音效（音效名）


        只提供接口
            添加类型 1.播放的背景音乐  与正在播放的背景音 一样不会重新播放
            播放音频
            停止音频

        音频的类型 在配置中指定


        事件派发
            打开界面
            关闭界面





*/
