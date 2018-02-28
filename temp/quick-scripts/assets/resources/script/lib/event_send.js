(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/lib/event_send.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ed130e6LixB4K2PmZzSZtpC', 'event_send', __filename);
// resources/script/lib/event_send.js

"use strict";

var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},
    command: function command() {
        //this.doSomethingBH({action:'buhua'},this);
        /* 每次操作之后。向后端发送command事件，返回对应的command值，然后去匹配上面的值，并执行对应的事件
            即后端返回的command为’joinroom‘，则执行指令为’joinroom‘的事件---this.joinroom_event
        */
        socket.on("command", function (result) {
            var data = self.getSelf().parse(result);
            console.log(data.command);
            console.log(data);
            self.getSelf().route(data.command)(data, self);
        });
    },
    /**
      * 接受传送的 玩家列表（含AI）
      */
    players: function players() {
        socket.on("players", function (result) {
            var data = self.getSelf().parse(result);
            //     console.log('players');
            //     console.log(data);
            //     /**
            //      * 处理 Players
            //      */
            self.getSelf().route("players")(data, self);
        });
    },
    talkOnSay: function talkOnSay() {
        socket.on("talkOnSay", function (result) {
            self.talk_event(result, null);
        });
    },
    /*
    * 断开连接，发送事件
    */
    disconnect: function disconnect() {
        cc.weijifen.socket.on("disconnect", function () {
            var mjs = cc.find('Canvas');
            if (mjs) {
                var mj = mjs.getComponent('MajiangDataBind');
                mj.duankai2.active = true;
                mj.duankai.active = false;
                if (cc.sys.localStorage.getItem('dis') != 'true') {
                    cc.director.loadScene('majiang');
                }
            }
        });
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
        //# sourceMappingURL=event_send.js.map
        