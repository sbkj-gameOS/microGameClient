"use strict";
cc._RF.push(module, 'd687d/F2I9HkrkXGTqAzG5C', 'IOUtils');
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