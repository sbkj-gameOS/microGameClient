(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/setting/settingClick.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b8b03JIEDJDNKTHYwpV7YpB', 'settingClick', __filename);
// module/majiang/js/setting/settingClick.js

'use strict';

var MJDataBind = require("MJDataBind");
cc.Class({
    extends: MJDataBind,

    properties: {
        alert2: cc.Prefab,
        summary: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        console.log('th*/**/*/*/*/*/*/*/', cc.find('Canvas/js/settingClick').getComponent('settingClick'));
    },

    //设置
    // statics: {

    settingBtnClick: function settingBtnClick(event) {
        // var action = cc.moveTo(0.5,cc.p(390,265));
        var settting_box = cc.find('Canvas/other/setting');
        cc.weijifen.settingflag = !cc.weijifen.settingflag;
        if (cc.weijifen.settingflag) {
            settting_box.active = true;
            var action = cc.moveTo(0.5, cc.p(408, 306));
            settting_box.runAction(action);
        } else {
            var action = cc.moveTo(0.5, cc.p(850, 306));
            settting_box.runAction(action);
        }
        // this.node.dispatchEvent( new cc.Event.EventCustom('settingclick', true) );
        // cc.log(settting_box)
    },
    //离开房间
    leaveClick: function leaveClick() {
        this.openAlert('是否退出房间', 'hall');
        var btn = cc.find('Canvas').getChildByName('alert').getChildByName('button');

        btn.active = false;
    },
    // 点击解散房间按钮
    overClick: function overClick() {

        cc.log('解散按钮');
        this.openAlert('是否解散房间', 'over');
        var btn = cc.find('Canvas').getChildByName('alert').getChildByName('button');
        btn.active = true;
    },

    // 弹框弹出
    openAlert: function openAlert(str, close) {

        var alert = cc.instantiate(this.alert2);
        alert.children[2].getComponent(cc.Label).string = str;
        // alert.children[3].getComponent(cc.Button).clickEvents[0].customEventData = close;
        alert.children[4].getComponent(cc.Button).clickEvents[0].customEventData = close;
        alert.parent = cc.find('Canvas');
    },

    /**
     * 一方要求解散时，向其他玩家发送请求信息
     */
    isOver_event: function isOver_event() {
        debugger;
        cc.log('isOver_event');
        var mj = cc.find('Canvas').getComponent('MJDataBind');
        cc.sys.localStorage.setItem('unOver', 'true');
        if (mj.alert.size() > 0) {
            var alert = mj.alert.get();
            alert.parent = cc.find("Canvas");
            console.log(this);
            // let node = alert.getComponent('overGameClick') ;
            var node = alert.getComponent('settingClick');
            node.waiting.string = '你的好友请求解散房间';
            node.button.active = false;
            node.button2.active = true;
            node.labei.active = false;
            node.labei2.active = true;
            node.time = 30;
            mj.t = setInterval(function () {
                node.daojishi();
            }, 1000);
        }
    },

    gameOver_event: function gameOver_event(data, context) {
        console.log('this****************', this);
        var self = cc.find('Canvas/js/settingClick').getComponent('settingClick');

        console.log('进入Game_over_event', self.endGameOver);
        var time = void 0;
        if (cc.sys.localStorage.getItem('unOver') == 'true') {
            time = 0;
            cc.sys.localStorage.removeItem('unOver');
        } else {
            time = 3000;
        }
        setTimeout(function () {
            self.endGameOver(data, context);
        }, time);
    },
    endGameOver: function endGameOver(data, context) {

        console.log('进入endGameOver');

        var temp = cc.instantiate(this.summary);
        temp.parent = context.root();
        temp.getComponent('SummaryClick').setDataEnd(data);
    },
    /**
    */
    over_event: function over_event() {

        cc.weijifen.maxRound = null;
        cc.weijifen.op = null;
        cc.weijifen.playerNum = null;
        cc.weijifen.room = null;
        cc.weijifen.cardNum = null;
        cc.sys.localStorage.setItem('dis', 'true');
        if (cc.weijifen.GameBase.gameModel == 'wz') {
            cc.director.loadScene('温州');
        } else {
            cc.director.loadScene('gameMain');
        }
        var mj = cc.find('Canvas').getComponent('MJDataBind');
        clearTimeout(mj.t);
        // var desk = require("DeskCards");
        // var jiantou = new desk();
        // jiantou.xiaochu();
    },
    unOver_event: function unOver_event() {
        var mj = cc.find('Canvas').getComponent('MJDataBind');
        cc.sys.localStorage.removeItem('unOver');
        var dialog = cc.find("Canvas/isover");
        clearTimeout(mj.t);
        mj.alert.put(dialog);
    }
    // }
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
        //# sourceMappingURL=settingClick.js.map
        