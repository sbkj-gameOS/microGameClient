(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/gameStartInit/card/TakeCards.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ae303D/QetM34OFtHWSRxma', 'TakeCards', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=TakeCards.js.map
        