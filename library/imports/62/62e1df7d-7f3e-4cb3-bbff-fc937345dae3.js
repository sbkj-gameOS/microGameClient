"use strict";
cc._RF.push(module, '62e1d99fz5Ms7v//JNzRdrj', 'menuSet');
// resources/script/do/menuSet.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        title: cc.Node,
        joinRoom: cc.Prefab,
        createRoom: cc.Prefab,
        setting: cc.Prefab
    },
    onLoad: function onLoad() {},
    init: function init(name) {
        this.clearPerfab();
        var web = this.title.parent.children[2];
        for (var i in this.title.children) {
            this.title.children[i].active = false;
        }
        this.title.children[name].active = true;
        if (name == 10 || name == 11 || name == 14) {
            var gameroom = void 0;
            web.active = false;
            if (name == 10) {
                gameroom = cc.instantiate(this.joinRoom);
            } else if (name == 11) {
                gameroom = cc.instantiate(this.createRoom);
            } else if (name == 14) {
                gameroom = cc.instantiate(this.setting);
            }
            gameroom.parent = this.node;
        } else {
            web.active = true;
            web = web.getComponent(cc.WebView);
            /**
             * data数组
             * 0：服务协议内嵌url地址
             * 1：家长监护工程内嵌url地址
             * 2：活动内嵌url地址
             * 3：通知内嵌url地址
             * 4：帮助内嵌url地址
             * 5：商城内嵌url地址
             * 6：提现内嵌url地址
             * 7：战况内嵌url地址
             * 8：排名内嵌url地址
             * 9：
             * 10：
             * 11：
             * 12：
             * 13：玩家信息
             * @type {Array}
             */
            var data = ["服务协议内嵌url地址", "家长监护工程内嵌url地址", "/gamePrizeActivity/prizeDzp?token=" + cc.weijifen.authorization + "&type=" + cc.weijifen.GameBase + "&activityId=27", "/gameNotice/goNoticePage?token=" + cc.weijifen.authorization + "&type=" + cc.weijifen.GameBase + "", "帮助内嵌url地址", "/shop/shopPage?token=" + cc.weijifen.authorization + "&type=" + cc.weijifen.GameBase + "", "提现内嵌url地址", "/situation/goSituationPage?token=" + cc.weijifen.authorization + "&type=" + cc.weijifen.GameBase + "", "/rankingList/goRankingPage?token=" + cc.weijifen.authorization + "&type=" + cc.weijifen.GameBase + "", "", "", "", "", "/userInfo/goUserInfoPage?token=" + cc.weijifen.authorization + ""];
            web.url = cc.weijifen.url + data[name];
        }
    },
    //清除留下的东西
    clearPerfab: function clearPerfab() {
        if (cc.find('Canvas/menu/joinroom')) {
            cc.find('Canvas/menu/joinroom').destroy();
        }
        if (cc.find('Canvas/menu/createroom')) {
            cc.find('Canvas/menu/createroom').destroy();
        }
        if (cc.find('Canvas/menu/setting')) {
            cc.find('Canvas/menu/setting').destroy();
        }
    }
});

cc._RF.pop();