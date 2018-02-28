(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/components/createRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '87a10oDpdxAu6wTBJJp71qE', 'createRoom', __filename);
// resources/script/components/createRoom.js

"use strict";

var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {},
    onLoad: function onLoad() {},
    mosiOrpepleClick: function mosiOrpepleClick(event) {
        var moshi = event.target.name;
        console.log(moshi);
        return moshi;
    },
    gameTypeClick: function gameTypeClick(toggle, playerData) {
        if (toggle.isChecked) {
            playerData += toggle.node.name + "@@";
        } else {
            playerData = playerData.replace(toggle.node.name + "@@", "");
        }
        return playerData;
    },

    // 创建房间按钮点击
    onClick: function onClick(garams) {
        this.loadding();
        cc.weijifen.http.httpPost('/api/room/create', garams, this.sucess, this.error, this);
    },
    sucess: function sucess(result, object) {
        var data = JSON.parse(result);
        object.closeloadding();
        if (data.room && data.playway) {
            object.getGame(data);
            cc.director.loadScene("majiang"); // 成功之后加载majiang场景
        } else if (data.error) {
            object.alert(data.msg);
        } else {
            object.alert('请求失败');
        }
        object.wrong();
    },
    error: function error(object) {
        object.wrong();
        object.closeloadding();
        object.alert('连接出错');
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
        //# sourceMappingURL=createRoom.js.map
        