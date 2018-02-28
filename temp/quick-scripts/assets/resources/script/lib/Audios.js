(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/lib/Audios.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd2ca5yf5NVPc5X0HINJSlpc', 'Audios', __filename);
// resources/script/lib/Audios.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        bgAudioID: -1 //   背景 音乐  id
    },

    // use this for initialization
    init: function init() {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if (cc.sys.localStorage.getItem('nobgm') != 'true') {
                cc.audioEngine.resumeAll();
            }
        });
    },
    _getUrl: function _getUrl(url) {
        return cc.url.raw("resources/sounds/" + url);
    },
    playBGM: function playBGM(url) {
        var audioUrl = this._getUrl(url);
        if (this.bgAudioID >= 0) {
            cc.audioEngine.stop(this.bgAudioID);
        }
        this.bgAudioID = cc.audioEngine.play(audioUrl, true, this.bgVolume);
    },
    playSFX: function playSFX(url) {
        var audioUrl = this.getUrl(url);
        if (this.deskVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.deskVolume);
        }
    },

    getState: function getState() {
        return cc.audioEngine.getState(this.bgAudioID);
    },
    pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
    },
    resumeAll: function resumeAll() {
        cc.audioEngine.resumeAll();
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
        //# sourceMappingURL=Audios.js.map
        