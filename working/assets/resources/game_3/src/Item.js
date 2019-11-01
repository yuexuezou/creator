cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
    },

    onLoad () {
        this.node.on('touchend', function () {
            console.log("Item " + this.itemID + ' clicked');
        }, this);
    },
    updateItem0 (obj) {
        this.label.getComponent(cc.Label).string = 'index:' + obj.index + '  data:' + obj.data;
    },
    updateItem1 (obj) {
        this.label.getComponent(cc.Label).string = 'index:' + obj.index + '  data:' + obj.data;
    },
    updateItem2 (obj) {
        this.label.getComponent(cc.Label).string = 'index:' + obj.index + '  data:' + obj.data;
    },
    updateItem3 (obj) {
        this.label.getComponent(cc.Label).string = 'index:' + obj.index + '  data:' + obj.data;
    },
    updateItem4 (obj) {
        this.label.getComponent(cc.Label).string = 'index:' + obj.index + '  data:' + obj.data;
    },
});

// console.log(7 >> 0);
// console.log(3 >> 1);
// let x = 7;
// for (let i = 2; i<=3;i++) {
//     console.log(x >> (i - 1) );
// }


// console.log(5 << 1);
// console.log(2&1, 1&3);

// console.log((1<<0)+(1<<1)+(1<<2));
// console.log(1<<0);

// console.log(1<<0|0);

// let xxxxxx = 0;
// for (let index = 0; index < 3; index++) {
//     xxxxxx = 1<<index|xxxxxx;
//     console.log(1<<1<<index|0, xxxxxx, "-------------------");
// }

