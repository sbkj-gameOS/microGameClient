(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/components/WJFCommon.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '71dcfAMsIxGvo2RVGEC9OQN', 'WJFCommon', __filename);
// resources/script/components/WJFCommon.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},
    //判断是否有初始化创建wjf全局变量
    ready: function ready() {
        var check = false;
        if (cc.weijifen) {
            check = true;
        } else {
            this.scene("login", this);
        }
        return check;
    },
    connect: function connect() {
        /**
         * 登录成功后，创建 Socket链接，
         */
        this.disconnect();
        cc.weijifen.socket = window.io.connect(cc.weijifen.http.wsURL + '/bm/game');
        cc.weijifen.socket.ondisconnect = function () {
            console.log('user disconnected');
        };
        return cc.weijifen.socket;
    },
    disconnect: function disconnect() {
        if (cc.weijifen.socket != null) {
            cc.weijifen.socket.disconnect();
            cc.weijifen.socket = null;
        }
    },
    getCommon: function getCommon(common) {
        var object = cc.find("Canvas/script/" + common);
        return object.getComponent(common);
    },
    loadding: function loadding() {
        if (cc.weijifen.loadding.size() > 0) {
            this.loaddingDialog = cc.weijifen.loadding.get();
            this.loaddingDialog.parent = cc.find("Canvas");

            this._animCtrl = this.loaddingDialog.getComponent(cc.Animation);
            var animState = this._animCtrl.play("loadding");
        }
    },
    alert: function alert(message) {
        if (cc.weijifen.dialog.size() > 0) {
            this.alertdialog = cc.weijifen.dialog.get();
            this.alertdialog.parent = cc.find("Canvas");
            var node = this.alertdialog.getChildByName("message");
            if (node != null && node.getComponent(cc.Label)) {
                node.getComponent(cc.Label).string = message;
            }
        }
        return this.alertdialog;
    },
    closeloadding: function closeloadding() {
        cc.weijifen.loadding.put(cc.find("Canvas/loadding"));
    },
    closealert: function closealert() {
        if (cc.find("Canvas/alert")) {
            cc.weijifen.dialog.put(cc.find("Canvas/alert"));
        }
    },
    scene: function scene(name, self) {
        cc.director.preloadScene(name, function () {
            if (cc.weijifen) {
                self.closeloadding(self.loaddingDialog);
            }
            cc.director.loadScene(name);
        });
    },
    root: function root() {
        return cc.find("Canvas");
    },
    decode: function decode(data) {
        var cards = new Array();
        if (!cc.sys.isNative) {
            var dataView = new DataView(data);
            for (var i = 0; i < data.byteLength; i++) {
                cards[i] = dataView.getInt8(i);
            }
        } else {
            var Base64 = require("Base64");
            var strArray = Base64.decode(data);
            if (strArray && strArray.length > 0) {
                for (var i = 0; i < strArray.length; i++) {
                    cards[i] = strArray[i];
                }
            }
        }
        return cards;
    },
    parse: function parse(result) {
        var data;
        if (!cc.sys.isNative) {
            data = result;
        } else {
            data = JSON.parse(result);
        }
        return data;
    },

    reset: function reset(data, result) {
        //放在全局变量
        if (data.token) {
            if (data.token.id) {
                cc.weijifen.authorization = data.token.id;
            } else {
                cc.weijifen.authorization = data.token;
            }
        };

        if (data.data) {
            cc.weijifen.user = data.data;
        }
        if (data.playUser) {
            cc.weijifen.user = data.playUser;
        }

        if (data.game) {
            cc.weijifen.games = data.games;
        }
        cc.weijifen.playway = null;
        cc.weijifen.localStorage.put("userinfo", result);
    },
    logout: function logout() {
        if (cc.weijifen.dialog != null) {
            cc.weijifen.dialog.destroy();
            cc.weijifen.dialog = null;
        }
        cc.weijifen.authorization = null;
        cc.weijifen.user = null;
        cc.weijifen.games = null;

        cc.weijifen.playway = null;

        this.disconnect();
    },
    socket: function socket() {
        var socket = cc.weijifen.socket;
        if (socket == null) {
            socket = this.connect();
        }
        return socket;
    },
    map: function map(command, callback) {
        this.routes[command] = callback || function () {};
    },
    route: function route(command) {
        return this.routes[command] || function () {};
    },
    talkPlay: function talkPlay() {},
    talkRecord: function talkRecord() {},
    ab2str: function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    },
    str2ab: function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    },
    getGame: function getGame(data, room) {
        if (data.match) {
            cc.weijifen.match = data.match;
        }
        if (data.room) {
            cc.weijifen.room = data.room;
        } else if (room) {
            cc.weijifen.room = data.room;
        }
        if (data.playway) {
            cc.weijifen.playway = data.playway;
        }
        if (data.playerNum) {
            cc.weijifen.playerNum = data.playerNum;
        }
        if (data.cardNum) {
            cc.weijifen.cardNum = data.cardNum;
        }
        if (data.maxRound) {
            cc.weijifen.maxRound = data.maxRound;
        }
    },
    //加载玩家头像
    headImg: function headImg(img, pic, bol) {
        if (pic) {
            var imgurl = pic;
            var sprite = img.getComponent(cc.Sprite);
            cc.loader.load({ url: imgurl, type: 'jpg' }, function (err, texture) {
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                img.width = 64;
                img.height = 64;
                if (bol == true) {
                    img.radius = 10;
                }
            });
        }
    },
    //点击打开弹窗
    hall: function hall(num) {
        var menu = cc.weijifen.menu.get(); //拿到公用弹框PreFab
        var single = menu.getComponent('menuSet'); //获取当前PreFab中名字为menuSet  js文件
        menu.parent = cc.find('Canvas'); // 将节点放在Canvas节点下面。
        single.init(num); //调用js文件中的init方法
    },
    wrong: function wrong() {
        var menu = cc.find("Canvas/menu"); // 在cocos对象下找到menu节点
        cc.weijifen.menu.put(menu);
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
        //# sourceMappingURL=WJFCommon.js.map
        