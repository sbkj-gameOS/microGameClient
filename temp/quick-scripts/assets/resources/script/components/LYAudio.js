(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/components/LYAudio.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '06d54bp3qtCzrNEe/iYixka', 'LYAudio', __filename);
// resources/script/components/LYAudio.js

'use strict';

var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {},
    // use this for initialization
    onLoad: function onLoad() {
        this.init();
    },
    init: function init() {
        var he = this;
        he.START = 0;
        he.END = 0;
        try {
            cc.promise = navigator.mediaDevices.getUserMedia({ audio: true });
            cc.promise.then(function (stream) {
                cc.recorder = new MediaRecorder(stream);
                cc.recorder.ondataavailable = function (event) {
                    //收集媒体设备 获得到的 可以使用的 媒体流数据
                    console.log(event.data);
                    var file = new FileReader();
                    file.readAsArrayBuffer(event.data);
                    console.log(file);
                    file.onloadend = function () {
                        var ab = he.ab2str(file.result);
                        var socket = he.socket();
                        socket.emit('sayOnSound', JSON.stringify({
                            userid: cc.weijifen.user.id,
                            file: ab,
                            start: he.START,
                            end: he.END
                        }));
                    };
                };
            });
        } catch (error) {
            cc.weijifen.browserType = null;
        }
    },
    talkPlay: function talkPlay(data) {
        if (typeof data.file == 'string') {
            var str = this.str2ab(data.file);
            var aud = new Audio();
            var blob = new Blob([str], { 'type': 'video/webm' });
            aud.src = URL.createObjectURL(blob);
            if (aud.play) {
                aud.play();
            }
        }
    },
    talkRecordStart: function talkRecordStart() {
        try {
            this.START = new Date().getTime();
            cc.recorder.start();
        } catch (error) {
            cc.find('Canvas/YY').active = true;
            setTimeout(function () {
                cc.find('Canvas/YY').active = false;
            }, 2000);
        }
    },
    talkRecordEnd: function talkRecordEnd() {
        try {
            if (cc.recorder.state != 'inactive') {
                this.END = new Date().getTime();
                cc.recorder.stop();
            }
        } catch (error) {}
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
        //# sourceMappingURL=LYAudio.js.map
        