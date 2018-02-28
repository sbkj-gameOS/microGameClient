(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/hall/js/ch/CHcreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '605e7sCEkRAo6blEnOH259t', 'CHcreateRoom', __filename);
// module/hall/js/ch/CHcreateRoom.js

"use strict";

var creat = require("createRoom"); //导入components目录下的createRoom
var moShi, playerData, userType, garams;
cc.Class({
    extends: creat,
    properties: {},
    // use this for initialization
    onLoad: function onLoad() {
        // 一下为默认选中的选项
        playerData = "both@@";
        moShi = "2";
        userType = "4";
        garams = {};
    },
    // 选择模式
    clickmoshi: function clickmoshi(event) {
        moShi = this.mosiOrpepleClick(event);
    },
    // 选择玩家人数
    clickPepNum: function clickPepNum(event) {
        userType = this.mosiOrpepleClick(event);
    },
    // 选择玩法
    clickPlayway: function clickPlayway(event) {
        playerData = this.gameTypeClick(event, playerData);
    },
    // 点击创建按钮
    createClick: function createClick() {
        console.log('开始创建长春麻将，CHcreateRoom');
        playerData = playerData.split("@@");
        playerData.pop();
        garams.waytype = playerData;
        garams.game = 'CH';
        garams.pepNums = userType;
        garams.modeltype = moShi;
        if (cc.weijifen.authorization) {
            garams.token = cc.weijifen.authorization;
        }
        // 此处的onClick是createRoom中的方法
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
        //# sourceMappingURL=CHcreateRoom.js.map
        