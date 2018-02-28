(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/do/allclose.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8e3d8OELiJCdKhO35O3haDr', 'allclose', __filename);
// resources/script/do/allclose.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {},
    // use this for initialization
    onLoad: function onLoad() {},
    closeAlert: function closeAlert() {
        var dialog = cc.find("Canvas/alert");
        cc.weijifen.dialog.put(dialog);
    },
    closeMenu: function closeMenu() {
        var menu = cc.find("Canvas/menu");
        cc.weijifen.menu.put(menu);
    },
    toHall: function toHall() {
        cc.director.loadScene("gameMain");
    },
    closeWIND: function closeWIND() {
        // 摧毁弹出框
        cc.find('Canvas/alert').destroy();
    },
    leavaNotice: function leavaNotice() {
        this.node.dispatchEvent(new cc.Event.EventCustom('leaveGame', true));
    },
    //离开游戏  不结束游戏
    leaveGameClick: function leaveGameClick() {
        var WJFFn = require('WJFCommon');
        var WJF = new WJFFn();
        WJF.scene("gameMain", WJF);
        this.node.dispatchEvent(new cc.Event.EventCustom('leaveGame', true));
    },
    /*确定结束游戏*/
    overNotice: function overNotice() {
        debugger;
        console.log('***********进入overNotice');
        this.node.dispatchEvent(new cc.Event.EventCustom('overGame', true));
        debugger;
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
        //# sourceMappingURL=allclose.js.map
        