"use strict";
cc._RF.push(module, '08fa0KWg0RERqOAYA8JcbIf', 'closeAlert');
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