"use strict";
cc._RF.push(module, 'd51b9dEnnJCD61Ot0jdE4XH', 'SpecCards');
// module/majiang/js/gamePlay/card/SpecCards.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        cardvalue: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    /**
     * 记录牌的 特殊属性， 是否刚抓起来的牌，已经玩家位置 ， 右、上、左
     * @param spec
     * @param inx
     */
    init: function init(spec, inx) {
        this.cardcolor();
        this.spec = spec;
        this.inx = inx;
        if (this.spec == true) {
            if (this.inx == 0 || this.inx == 2) {
                this.node.height = this.node.height + 50;
            } else {
                this.node.width = this.node.width + 30;
            }
        }
    },
    reinit: function reinit() {

        this.node.height = this.node.height = 0;
        this.node.width = this.node.width = 0;
        this.spec = false;
    },
    cardcolor: function cardcolor() {
        if (cc.sys.localStorage.getItem('cardcolor') == 'yellow') {
            this.cardvalue.children[0].active = false;
            this.cardvalue.children[1].active = false;
        } else if (cc.sys.localStorage.getItem('cardcolor') == 'green') {
            this.cardvalue.children[0].active = true;
            this.cardvalue.children[1].active = false;
        } else if (cc.sys.localStorage.getItem('cardcolor') == 'red') {
            this.cardvalue.children[0].active = false;
            this.cardvalue.children[1].active = true;
        }
    }
});

cc._RF.pop();