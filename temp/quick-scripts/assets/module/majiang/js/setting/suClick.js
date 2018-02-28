(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/setting/suClick.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '16a46hQTYBIsKllkbfiQxe+', 'suClick', __filename);
// module/majiang/js/setting/suClick.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        time: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onBGClick: function onBGClick(event) {
        //var myAction = event.target.getComponent('SummartClick').action ;
        // oper.setUserData(myAction) ;
        // console.log('已经点击返回大厅按钮')
        if (cc.beimi.match == 'true') {
            this.node.dispatchEvent(new cc.Event.EventCustom('readyGM', true));
        }
        this.node.dispatchEvent(new cc.Event.EventCustom('restar', true));
    },
    endclick: function endclick(event) {
        console.log('已经点击返回大厅按钮');
        var a = {};
        a.key = true;
        var oper = new cc.Event.EventCustom('restar', true);
        oper.setUserData(a);
        this.node.dispatchEvent(oper);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=suClick.js.map
        