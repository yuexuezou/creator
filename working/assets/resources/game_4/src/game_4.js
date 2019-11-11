
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {},

    start () {

    },
    // 切换场景
    switch_scene() {
        cc.director.preloadScene("game_5", function (userData, scene) {
            // scene.getC();
            let node_game_5 = cc.find('Canvas/game_5', scene.scene);

            let game_5_js = node_game_5.getComponent('game_5');
            let res_num = 46;
            let num = 0; 
            game_5_js.preLoad(()=>{
                res_num = res_num - 1;
                num = num + 1;
                cc.log(num);
                if(res_num ==0){
                    cc.director.loadScene("game_5", ()=>{
                        cc.log("加载成功");
                    });
                }
            });
            cc.log("预加载成功", game_5_js);
        });

        // cc.director.loadScene("game_5", ()=>{
        //     cc.log("加载成功");
        // });
    },

    update (dt) {},
});
