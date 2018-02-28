(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/hall/js/jx/JXcreteRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a8510U9m6ZHY7o4e1kev1Dm', 'JXcreteRoom', __filename);
// module/hall/js/jx/JXcreteRoom.js

"use strict";

var creat = require("createRoom");
var moShi, playerData, userType, fengdeng, garams;
cc.Class({
    extends: creat,

    properties: {},
    // use this for initialization
    onLoad: function onLoad() {
        playerData = "both@@";
        moShi = "2";
        userType = "4";
        fengdeng = '100';
        garams = {};
    },
    clickmoshi: function clickmoshi(event) {
        moShi = this.mosiOrpepleClick(event);
    },
    clickfanshu: function clickfanshu(event) {
        fengdeng = this.mosiOrpepleClick(event);
    },
    clickPlayway: function clickPlayway(event) {
        playerData = this.gameTypeClick(event, playerData);
    },
    createClick: function createClick() {
        playerData = playerData.split("@@");
        playerData.pop();
        garams.player = playerData;
        garams.game = 'JX';
        garams.pepNums = userType;
        garams.count = moShi;
        garams.player2 = fengdeng;
        if (cc.weijifen.authorization) {
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
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
        //# sourceMappingURL=JXcreteRoom.js.map
        