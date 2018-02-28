(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/gameEvent/event/GangAction.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0fe67JecMpLz5GGCrRtpy0D', 'GangAction', __filename);
// module/majiang/js/gameEvent/event/GangAction.js

"use strict";

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
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        beimi0: {
            default: null,
            type: cc.SpriteAtlas
        },
        card_one: {
            default: null,
            type: cc.Node
        },
        card_two: {
            default: null,
            type: cc.Node
        },
        card_three: {
            default: null,
            type: cc.Node
        },
        card_four: {
            default: null,
            type: cc.Node
        },
        card_last: {
            default: null,
            type: cc.Node
        },
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(cvalue, gang) {
        this.value = cvalue;

        var cardcolors = parseInt(this.value / 4);
        var cardtype = parseInt(cardcolors / 9);

        this.mjtype = cvalue;;
        this.mjvalue = parseInt(this.value % 36 / 4);

        var deskcard = void 0,
            cardframe = void 0;
        if (cardcolors < 0) {
            deskcard = "wind" + (cardcolors + 8); //东南西北风 ， 中发白
        } else {
            if (cardtype == 0) {
                //万
                deskcard = "wan" + (parseInt(this.value % 36 / 4) + 1);
            } else if (cardtype == 1) {
                //筒
                deskcard = "tong" + (parseInt(this.value % 36 / 4) + 1);
            } else if (cardtype == 2) {
                //条
                deskcard = "suo" + (parseInt(this.value % 36 / 4) + 1);
            }
        }
        if (deskcard == "suo2") {
            cardframe = this.beimi0.getSpriteFrame('麻将牌-牌面-' + deskcard);
        } else {
            cardframe = this.atlas.getSpriteFrame('麻将牌-牌面-' + deskcard);
        }

        this.card_one.getComponent(cc.Sprite).spriteFrame = cardframe;
        if (this.card_two) {
            this.card_two.getComponent(cc.Sprite).spriteFrame = cardframe;
        }
        if (this.card_three) {
            this.card_three.getComponent(cc.Sprite).spriteFrame = cardframe;
        }
        if (this.card_four) {
            this.card_four.getComponent(cc.Sprite).spriteFrame = cardframe;
        }
        if (this.card_last) {
            if (gang == false) {
                this.card_last.active = false;
            } else {
                this.card_last.active = true;
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
        //# sourceMappingURL=GangAction.js.map
        