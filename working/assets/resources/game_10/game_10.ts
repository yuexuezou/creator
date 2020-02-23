
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    node_sound: cc.Node = null;

    audioID: any;
    need_up_volume: boolean;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let animation = this.node_sound.getComponent(cc.Animation);
        // 注册
        animation.on('play',      this.onPlay,        this);
        animation.on('finished',  this.onFinished,    this);
        this.need_up_volume = false;
    }

    start () {
    }
    
    actDownMusic(){
        let animation = this.node_sound.getComponent(cc.Animation);
        animation.play("actDownMusic");
    }
    actUpMusic(){
        let animation = this.node_sound.getComponent(cc.Animation);
        animation.play("actUpMusic");
    }
    actPauseMusic(){
        let animation = this.node_sound.getComponent(cc.Animation);
        animation.play("actPauseMusic");
    }
    actResumeMusic(){
        let animation = this.node_sound.getComponent(cc.Animation);
        animation.play("actResumeMusic");
    }

    onPlay(name, AnimationState?){
        this.need_up_volume = true;
        if(AnimationState.name == "pauseMusicAct"){
            cc.audioEngine.setMusicVolume(1);
        }else if(AnimationState.name == "resumeMusicAct"){
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.resumeMusic();
        }
    }
    onFinished(name, AnimationState?){
        if(AnimationState.name == "pauseMusicAct"){
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.pauseMusic();
        }else if(AnimationState.name == "resumeMusicAct"){
            cc.audioEngine.setMusicVolume(1);
        }
        this.need_up_volume = false;
    }
    update(){
        if(this.need_up_volume == false){
            return;
        }
        // cc.log(this.node_sound.y, );
        let volume = this.node_sound.y/100;
        cc.audioEngine.setMusicVolume(volume);
    }
    // 播放背景音
    play_bgm2 () {
        cc.loader.loadRes('game_10/pirate_spin_bgm', cc.AudioClip, function (err, clip) {
            cc.log(err, clip);
            let audioID = cc.audioEngine.playMusic(clip, true);
            // cc.log(audioID, "audioID");
        });
    }
    // ----------------------------------------------------------------------------------------------
    // 播放背景音
    play_bgm () {
        cc.loader.loadRes('game_10/kitty_bj_spin', cc.AudioClip, function (err, clip) {
            cc.log(err, clip);
            let audioID = cc.audioEngine.playMusic(clip, true);
            // cc.log(audioID, "audioID");
        });
    }
    
    // 暂停背景音
    pause_bgm () {
        cc.audioEngine.pauseMusic();
        let volume = cc.audioEngine.getMusicVolume();
        cc.log(volume);
    }

    // 恢复背景音
    resume_bgm () {
        cc.audioEngine.resumeMusic();
        let volume = cc.audioEngine.getMusicVolume();
        cc.log(volume);
        // isMusicPlaying
    }

    // 停止背景音
    stop_bgm(){
        cc.audioEngine.stopMusic();
        let volume = cc.audioEngine.getMusicVolume();
        cc.log(volume);

        // 音量调到最低
        // 暂停
        // 走一个动作
        // 恢复
        // 音量调到最大
        // 走另一个动作
    }
    switch_bgm(){

    }
    // 淡出背景音
    fadeOut_bgm(){

    }

    // 淡入背景音
    fadeIn_bgm(){

    }

    // update (dt) {}
}
