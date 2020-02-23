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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // this.sprite = this.node.getComponent(cc.Sprite);
        // this.material = this.sprite.getMaterial(0);
        

        let spine = this.node.getComponent(sp.Skeleton);
        this.material = spine.getMaterial(0);

        this.Hue(this.dH);
        this.Saturation(this.dS);
        this.Lightness(this.dL);
    }

    //色相
    Hue(value: number) {
        this.material.setProperty("u_dH", value);
    }

    //饱和度
    Saturation(value: number) {
        this.material.setProperty("u_dS", value);
    }

    //亮度
    Lightness(value: number) {
        this.material.setProperty("u_dL", value);
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
}