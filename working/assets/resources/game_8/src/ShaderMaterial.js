
const renderEngine = cc.renderer.renderEngine;
const Material = renderEngine.Material;

var material = cc.Class({
    extends: Material,

    callFunc (name, vert, frag, defines) {
    	let renderer = cc.renderer;
        let lib = renderer._forward._programLib;
        cc.log(renderer);
        cc.log(lib, "/////////////////////////////////////");
        cc.log(name, vert, frag, defines);
        
        
        lib.define({name:name, vert:vert, frag:frag, defines:defines});
        // !lib._templates[name] && lib.define(name, vert, frag, defines);
        this.init(name);
    },

    init(name) {
        // let renderer = cc.renderer.renderEngine;
        let renderer = cc.renderer;
        let gfx = cc.gfx;
        cc.log(renderer);
        cc.log("-----------------------------------------");
        let pass = new cc.renderer.Pass(name);
        
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
        );
        
        let mainTech = new renderer.Technique(
            ['transparent'],
            [
                { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
                { name: 'color', type: renderer.PARAM_COLOR4 },
                { name: 'pos', type: renderer.PARAM_FLOAT3 },
                { name: 'size', type: renderer.PARAM_FLOAT2 },
                { name: 'time', type: renderer.PARAM_FLOAT },
                { name: 'num', type: renderer.PARAM_FLOAT }
            ],
            [pass]
        );

        this._texture = null;
        this._color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        this._pos = { x: 0.0, y: 0.0, z: 0.0 };
        this._size = { x: 0.0, y: 0.0 };
        this._time = 0.0;
        this._num = 0.0;
        this._effect = this.effect = new renderer.Effect([mainTech], { 
            'color': this._color,
            'pos': this._pos,
            'size': this._size,
            'time': this._time,
            'num': this._num
        }, []);
        this._mainTech = mainTech;
    },

    setTexture(texture) {
        this._texture = texture;
        this._texture.update({ flipY: false, mipmap: false });
        this._effect.setProperty('texture', texture.getImpl());
        this._texIds['texture'] = texture.getId();
    },

    setColor(r, g, b, a) {
        this._color.r = r;
        this._color.g = g;
        this._color.b = b;
        this._color.a = a;
        this._effect.setProperty('color', this._color);
    },

    setPos(x, y, z) {
        this._pos.x = x;
        this._pos.y = y;
        this._pos.z = z;
        this._effect.setProperty('pos', this._pos);
    },

    setSize(x, y) {
        this._size.x = x;
        this._size.y = y;
        this._effect.setProperty('size', this._size);
    },

    setTime(time) {
        this._time = time;
        this._effect.setProperty('time', this._time);
    },

    setNum(num) {
        this._num = num;
        this._effect.setProperty('num', this._num);
    },
});

module.exports = material;