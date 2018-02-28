"use strict";
cc._RF.push(module, 'bae74URcBVIN5EEmAukqFWa', 'menuToggle');
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