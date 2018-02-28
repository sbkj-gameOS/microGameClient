(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/do/closeAlert.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '08fa0KWg0RERqOAYA8JcbIf', 'closeAlert', __filename);
// resources/script/do/closeAlert.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.button.node.on('click', this.closeAlert, this);
    },
    closeAlert: function closeAlert() {
        var dialog = cc.find("Canvas/alert");
        cc.weijifen.dialog.put(dialog);
    },
    toHall: function toHall() {
        cc.director.loadScene("gameMain");
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
        //# sourceMappingURL=closeAlert.js.map
        