(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/do/menuToggle.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bae74URcBVIN5EEmAukqFWa', 'menuToggle', __filename);
// resources/script/do/menuToggle.js

"use strict";

var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},
    close: function close() {
        var menu = cc.find("Canvas/menu");
        cc.weijifen.menu.put(menu);
    },
    open: function open(event) {
        this.hall(event.target.name);
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
        //# sourceMappingURL=menuToggle.js.map
        