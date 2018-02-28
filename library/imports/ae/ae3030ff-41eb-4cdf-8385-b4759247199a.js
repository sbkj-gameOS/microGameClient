"use strict";
cc._RF.push(module, 'ae303D/QetM34OFtHWSRxma', 'TakeCards');
// module/majiang/js/gameStartInit/card/TakeCards.js

'use strict';

var mjcard = require('MJCardsValue');
cc.Class({
    extends: mjcard,
    properties: {
        target: cc.Node,
        majing: cc.Node,
        atlas: cc.SpriteAtlas,
        chun: cc.SpriteFrame,
        ju: cc.SpriteFrame,
        lan: cc.SpriteFrame,
        xia: cc.SpriteFrame,
        zhu: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(value, fangwei) {
        var atlas = void 0;
        this.majiangValue(value, fangwei);
    },

    majiangValue: function majiangValue(value, fangwei) {
        if (fangwei == 'B') {
            atlas = [this.chun, this.ju, this.lan, this.xia, this.zhu, this.atlas];
        } else {
            atlas = this.atlas;
        }
        this.mjcardvalue(cvalue, fangwei, this.target, atlas);
    }
});

cc._RF.pop();