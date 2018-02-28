(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/gameStartInit/card/BuHuaAction.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f6d9dxkh+5Px4wnEJ49Wi6I', 'BuHuaAction', __filename);
// module/majiang/js/gameStartInit/card/BuHuaAction.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        weijifen0: {
            default: null,
            type: cc.SpriteAtlas
        },
        target: {
            default: null,
            type: cc.Node
        },
        b_chun: {
            default: null,
            type: cc.SpriteFrame
        },
        b_ju: {
            default: null,
            type: cc.SpriteFrame
        },
        b_lan: {
            default: null,
            type: cc.SpriteFrame
        },
        b_xia: {
            default: null,
            type: cc.SpriteFrame
        },
        b_zhu: {
            default: null,
            type: cc.SpriteFrame
        },
        hua: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(cvalue, fangwei, dd) {
        this.cardcolor();
        this.value = cvalue;
        this.fangwei = fangwei;

        var deskcard, cardframe;
        var cardcolors = parseInt(this.value / 4);
        var csType1 = void 0,
            csType2 = void 0;
        var csCardColors1 = void 0,
            csCardColors2 = void 0;
        var csValue1 = void 0,
            csValue2 = void 0;
        if (cc.weijifen.powerCard) {
            csCardColors1 = parseInt(cc.weijifen.powerCard[0] / 4);
            csType1 = parseInt(csCardColors1 / 9); //第一张财神牌类型 
            csValue1 = parseInt(cc.weijifen.powerCard[0] % 36 / 4) + 1;
            if (cc.weijifen.powerCard.length == 2) {
                csCardColors2 = parseInt(cc.weijifen.powerCard[1] / 4);
                csType2 = parseInt(csCardColors2 / 9); //第二张财神牌类型
                csValue2 = parseInt(cc.weijifen.powerCard[1] % 36 / 4) + 1;
            }
        }

        //确定牌的花色
        var fw = 'B';
        if (fangwei == 'left') {
            fw = 'L';
        } else if (fangwei == 'right') {
            fw = 'R';
        }
        if (fw == 'B') {
            if (cvalue == -38) {
                deskcard = fw + '_autumn'; //秋
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            } else if (cvalue == -35) {
                deskcard = this.b_zhu; //竹
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if (cvalue == -34) {
                deskcard = this.b_ju; //菊
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if (cvalue == -33) {
                deskcard = this.b_lan; //兰
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if (cvalue == -32) {
                deskcard = fw + '_plum'; //梅
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            } else if (cvalue == -36) {
                deskcard = this.b_chun; //春
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if (cvalue == -37) {
                deskcard = this.b_xia; //夏
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if (cvalue == -39) {
                deskcard = fw + '_winter'; //冬
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            }
            if (dd && (cardcolors == csCardColors1 || csCardColors2 != null && cardcolors == csCardColors2 || this.value >= -39 && this.value <= -36)) {
                this.caishenCards();
            }
        } else {
            if (cvalue == -38) {
                deskcard = fw + '_autumn'; //秋
            } else if (cvalue == -35) {
                deskcard = fw + '_bamboo'; //竹
            } else if (cvalue == -34) {
                deskcard = fw + '_chrysanthemum'; //菊
            } else if (cvalue == -33) {
                deskcard = fw + '_orchid'; //兰
            } else if (cvalue == -32) {
                deskcard = fw + '_plum'; //梅
            } else if (cvalue == -36) {
                deskcard = fw + '_spring'; //春
            } else if (cvalue == -37) {
                deskcard = fw + '_summer'; //夏
            } else if (cvalue == -39) {
                deskcard = fw + '_winter'; //冬
            } else if (cvalue <= -4 || cvalue >= -7) {
                deskcard = fw + '_white'; //白
            }

            cardframe = this.weijifen0.getSpriteFrame(deskcard);
            this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
        }
    },

    caishenCards: function caishenCards() {
        this.hua.active = true;
        this.target.zIndex = -999 + this.value;
    },
    cardcolor: function cardcolor() {
        if (cc.sys.localStorage.getItem('cardcolor') == 'yellow') {
            this.target.children[0].active = false;
            this.target.children[1].active = false;
        } else if (cc.sys.localStorage.getItem('cardcolor') == 'green') {
            this.target.children[0].active = true;
            this.target.children[1].active = false;
        } else if (cc.sys.localStorage.getItem('cardcolor') == 'red') {
            this.target.children[0].active = false;
            this.target.children[1].active = true;
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
        //# sourceMappingURL=BuHuaAction.js.map
        