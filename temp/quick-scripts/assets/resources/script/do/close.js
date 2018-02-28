(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/do/close.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '803fcuwAIBI1Y4mhUz6+tAB', 'close', __filename);
// resources/script/do/close.js

'use strict';

var allclose = require('allclose');
cc.Class({
    extends: allclose,

    properties: {
        button: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log(this.button);
        if (this.button) {
            this.button.node.on('click', this.callback, this);
        }
    },
    callback: function callback(event) {
        var name = this.button.clickEvents[0].customEventData;
        this[name]();
    },
    //关闭alert
    alert: function alert() {
        this.closeAlert();
    },
    //关闭菜单
    menu: function menu() {
        this.closeMenu();
    },

    //退出之后返回房间
    hall: function hall() {
        this.leavaNotice();
        this.toHall();
    },
    //关闭当前弹窗
    wind: function wind() {
        this.closeWIND();
    },
    //确定结束游戏
    over: function over() {
        this.overNotice();
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
        //# sourceMappingURL=close.js.map
        