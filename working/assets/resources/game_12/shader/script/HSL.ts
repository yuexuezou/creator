// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class HSL extends cc.Component {

    @property({ range: [-180, 180], slide: true })
    dH: number = -180;

    @property({ range: [-1, 1], slide: true })
    dS: number = 0;

    @property({ range: [-1, 1], slide: true })
    dL: number = 0;


    private sprite: cc.Sprite;
    private material: any;

    @property(cc.Node)
    sprite_node: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.material = this.sprite.getMaterial(0);


        // let spine = this.node.getComponent(sp.Skeleton);
        // this.material = spine.getMaterial(0);

        this.Hue(this.dH);
        this.Saturation(this.dS);
        this.Lightness(this.dL);

        // this.load_gold_res();
    }

    //色相
    Hue(value: number) {
        this.material.setProperty("u_dH", value);
    }

    //亮度
    Lightness(value: number) {
        this.material.setProperty("u_dL", value);
    }

    //饱和度
    Saturation(value: number) {
        this.material.setProperty("u_dS", value);
    }

    callbackH(slider: cc.Slider) {
        this.Hue(Number(slider.progress * 360))
    }

    callbackS(slider: cc.Slider) {
        this.Saturation(Number(slider.progress))
    }

    callbackL(slider: cc.Slider) {
        this.Lightness(Number(slider.progress))
    }
    // 添加金币动画
    add_gold_ani(){
        let assets = this.assets;

        this.sprite_node.getComponent(cc.Sprite).spriteFrame = assets[0];

        let ani = this.sprite_node.addComponent(cc.Animation);
        let arr3=[];
        let arrLength = this._listSpriteFrame.length;
        let idx = Math.floor((Math.random() * arrLength - 1));
        for(let j=idx;j<arrLength+idx;j++){
            arr3.push(assets[j%arrLength]);
        }
        // let clip = cc.AnimationClip.createWithSpriteFrames(arr3, arr3.length);
        // clip.name = 'ani';
        // clip.wrapMode = cc.WrapMode.Loop;
        // ani.addClip(clip);
        // ani.play('ani');

        this.time = 0;

        this.image_ID = 0;
    }
    update(dt){
        // if(this.image_ID == null){
        //     return;
        // }
        // this.time = this.time + dt;
        // if(this.time <= 0.3){
        //     return;
        // }
        // let assets = this.assets;
        // this.time = 0;
        // cc.log(this.image_ID);
        // this.sprite_node.getComponent(cc.Sprite).spriteFrame = assets[this.image_ID];
        // this.image_ID = this.image_ID + 1;
        // if(this.image_ID >= this._listSpriteFrame.length - 1){
        //     this.image_ID = 0;
        // }
    }
    load_gold_res(){
        this._listSpriteFrame = [
            'game_11/res/coin_effect/01',
            'game_11/res/coin_effect/02',
            'game_11/res/coin_effect/03',
            'game_11/res/coin_effect/04',
            'game_11/res/coin_effect/05',
            'game_11/res/coin_effect/06',
            'game_11/res/coin_effect/07',
            'game_11/res/coin_effect/08',
            'game_11/res/coin_effect/09',
            'game_11/res/coin_effect/10',
            'game_11/res/coin_effect/11',
            'game_11/res/coin_effect/12',
            'game_11/res/coin_effect/13',
            'game_11/res/coin_effect/14',
            'game_11/res/coin_effect/15',
            'game_11/res/coin_effect/16',
            'game_11/res/coin_effect/17',
            'game_11/res/coin_effect/18',
            'game_11/res/coin_effect/19',
            'game_11/res/coin_effect/20',
            'game_11/res/coin_effect/21',
            'game_11/res/coin_effect/22',
            'game_11/res/coin_effect/23',
            'game_11/res/coin_effect/24',
            'game_11/res/coin_effect/25',
            'game_11/res/coin_effect/26',
            'game_11/res/coin_effect/27',
            'game_11/res/coin_effect/28',
            'game_11/res/coin_effect/29',
            'game_11/res/coin_effect/30',
        ]

        cc.loader.loadResArray(this._listSpriteFrame, cc.SpriteFrame, (err,assets)=>{
            if(err){
                cc.log(err);
            }else{
                this.assets = assets;
                this.add_gold_ani();
            }
        });
    }
}