(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/components/IOUtils.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd687d/F2I9HkrkXGTqAzG5C', 'IOUtils', __filename);
// resources/script/components/IOUtils.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {},
    statics: {
        get: function get(key) {
            return cc.sys.localStorage.getItem(key);
        },
        put: function put(key, value) {
            cc.sys.localStorage.setItem(key, value);
        },
        remove: function remove(key) {
            cc.sys.localStorage.removeItem(key);
        }
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
        //# sourceMappingURL=IOUtils.js.map
        