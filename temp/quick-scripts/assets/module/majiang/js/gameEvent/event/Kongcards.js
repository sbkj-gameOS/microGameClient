(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/gameEvent/event/Kongcards.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5bb73H496ZHXpQn0JDXqghM', 'Kongcards', __filename);
// module/majiang/js/gameEvent/event/Kongcards.js

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
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(action) {
        this.action = action;
        this.length = this.node.children.length;
        this.type = null;
        for (var i = 0; i < this.length; i++) {
            var card = this.node.children[i].getComponent('DanAction');

            if (card.cardcolors >= -7 && card.cardcolors <= -4) {
                this.type = 'wind';
                break;
            } else if (card.cardcolors <= -1 && card.cardcolors >= -3) {
                this.type = 'xi';
                break;
            } else if (parseInt(card.value % 36 / 4) == 8) {
                this.type = 'jiu';
                break;
            } else if ((card.cardtype == 0 || card.cardtype == 1) && parseInt(card.value % 36 / 4) == 0) {
                this.type = 'yao';
                break;
            }
        }
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
        //# sourceMappingURL=Kongcards.js.map
        