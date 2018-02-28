(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/components/createRoomPreb.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9d5caHRhklIHaA5JwZPRXtK', 'createRoomPreb', __filename);
// resources/script/components/createRoomPreb.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        ch: cc.Prefab,
        lanzi: cc.Node,
        left: cc.Node,
        lg: cc.Prefab,
        tp: cc.Prefab,
        ph: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log('ppp');
        if (cc.weijifen.GameBase.gameModel == 'ch') {
            this.allfunction(['长春'], [this.ch]);
        } else if (cc.weijifen.GameBase.gameModel == 'wz') {
            this.allfunction(['龙港', '台炮'], [this.lg, this.tp]);
        } else if (cc.weijifen.GameBase.gameModel == 'jx') {
            this.allfunction(['平湖'], [this.ph]);
        }
    },
    allfunction: function allfunction(name, value) {
        for (var i in name) {
            var he = cc.instantiate(this.lanzi);
            he.active = true;
            he.parent = this.left;
            he.children[2].getComponent(cc.Label).string = name[i];
            var her = cc.instantiate(value[i]);
            her.parent = he.children[1];
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=createRoomPreb.js.map
        