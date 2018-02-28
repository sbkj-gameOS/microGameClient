(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/script/components/ShareWx.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9835ctxoxpBhajvEGrTc7zX', 'ShareWx', __filename);
// resources/script/components/ShareWx.js

"use strict";

var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        tape: cc.Button,
        tape2: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.init();
    },
    //整个游戏初始化 为优先设置为微信环境，当不是微信环境时设置为其他设备的环境。
    init: function init() {
        var selfs = this;
        selfs.talk = false;
        selfs.recordTimer = 0;
        cc.weijifen.http.httpPost("/wxController/getWxConfig", { url: window.location.href }, selfs.sucess, selfs.error, selfs);
    },
    sucess: function sucess(result, object) {
        var data = JSON.parse(result);
        wx.config({
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'translateVoice', 'onVoicePlayEnd', 'playVoice', 'uploadVoice', 'downloadVoice']
        });
        wx.ready(function () {
            //只有当时微信环境下才会调用这个方法  所以不管此时是微信 和时其他设备  都重新加载为微信环境
            if (cc.weijifen.browserTyp != "wechat") {
                var WXorBlow = require('ShareWx');
                cc.weijifen.WXorBlow = new WXorBlow();
            }
            cc.weijifen.browserType = "wechat";
            //注册微信播放录音结束事件【一定要放在wx.ready函数内】
            wx.onVoicePlayEnd({
                success: function success(res) {
                    stopWave();
                }
            });
            object.shareRoom();
        });
        //如果设备类型不等于微信浏览器的话 就执行普通浏览器的
        if (cc.weijifen.browserTyp != "wechat") {
            var WXorBlow = require('LYAudio');
            cc.weijifen.WXorBlow = new WXorBlow();
            cc.weijifen.WXorBlow.init();
            cc.weijifen.browserType = 'brow';
        }
    },
    shareRoom: function shareRoom(room) {
        var descNametitle = void 0;
        var urlType = void 0;
        var txt = '';
        if (cc.weijifen.GameBase.gameModel == 'wz') {
            descNametitle = "首游宝-温州棋牌";
            urlType = "toWZAuth";
        } else if (cc.weijifen.GameBase.gameModel == 'ch') {
            descNametitle = "巡天游-心缘长春";
            urlType = "toCHAuth";
        }
        if (cc.weijifen.room) {
            txt = '房间号：' + cc.weijifen.room;
        }
        console.log('game.bizpartner.cn/wxController/' + urlType + '?roomNum=' + room);
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: descNametitle,
            desc: "您的好友" + cc.weijifen.user.nickname + "邀请您一起游戏" + txt,
            link: 'http://game.bizpartner.cn/wxController/' + urlType + '?roomNum=' + room,
            imgUrl: cc.weijifen.user.headimgurl,
            trigger: function trigger(res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                console.log('用户点击发送给朋友');
            },
            success: function success(res) {
                console.log('已分享');
            },
            cancel: function cancel(res) {
                console.log('已取消');
            },
            fail: function fail(res) {
                console.log(JSON.stringify(res));
            }
        });
        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            title: descNametitle,
            link: 'http://game.bizpartner.cn/wxController/' + urlType + '?roomNum=' + room,
            imgUrl: cc.weijifen.user.headimgurl,
            trigger: function trigger(res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                console.log('用户点击分享到朋友圈');
            },
            success: function success(res) {
                console.log('已分享');
            },
            cancel: function cancel(res) {
                console.log('已取消');
            },
            fail: function fail(res) {
                console.log(JSON.stringify(res));
            }
        });
    },
    error: function error(object) {
        var WXorBlow = require('LYAudio');
        cc.weijifen.WXorBlow = new WXorBlow();
        cc.weijifen.WXorBlow.init();
        cc.weijifen.browserType = 'brow';
    },
    //停止录音
    touchendClick: function touchendClick(event) {
        var share = this;
        cc.find('Canvas/录音/发送语音2').active = false;
        share.END = new Date().getTime();
        var time = new Date(share.end - share.start).getSeconds();
        if (time > 3) {
            wx.stopRecord({
                success: function success(res) {
                    //录音上传到微信服务器
                    wx.uploadVoice({
                        localId: res.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function success(res) {
                            //复制微信服务器返回录音id
                            var socket = share.socket();
                            socket.emit('sayOnSound', JSON.stringify({
                                userid: cc.weijifen.user.id,
                                serverId: res.serverId,
                                start: share.START,
                                end: share.END
                            }));
                        }
                    });
                },
                fail: function fail(res) {
                    cc.find('Canvas/录音/发送语音1').active = true;
                    setTimeout(function () {
                        cc.find('Canvas/录音/发送语音1').active = false;
                    }, 1000);
                }
            });
        } else {
            cc.find('Canvas/录音/发送语音1').active = true;
            setTimeout(function () {
                cc.find('Canvas/录音/发送语音1').active = false;
            }, 1000);
        }
    },
    talkClick: function talkClick(wxButton) {
        var share = this;
        this.wxButton = wxButton;
        var wxButton = wxButton;
        if (share.talk == true) {
            share.talk = false;
            wxButton.node.children[1].active = false;
            wxButton.node.children[0].active = true;
            //cc.find('Canvas/录音/发送语音2').active =false;
            share.END = new Date().getTime();
            wx.stopRecord({
                success: function success(res) {
                    console.log(res);
                    console.log('-------');
                    //录音上传到微信服务器
                    wx.uploadVoice({
                        localId: res.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function success(res) {

                            //复制微信服务器返回录音id
                            var socket = share.socket();
                            socket.emit('sayOnSound', JSON.stringify({
                                userid: cc.weijifen.user.id,
                                serverId: res.serverId,
                                start: share.START,
                                end: share.END
                            }));
                            //cc.weijifen.serverId = res.serverId;
                        }
                    });
                }
            });
        } else {
            share.talk = true;
            wxButton.node.children[1].active = true;
            wxButton.node.children[0].active = false;
            share.START = new Date().getTime();
            share.recordTimer = setTimeout(function () {
                wx.startRecord({
                    success: function success() {
                        localStorage.rainAllowRecord = 'true';
                    },
                    cancel: function cancel() {
                        alert('用户拒绝授权录音');
                    }
                });
            }, 300);
        }
    },
    settime: function settime() {
        this.time = this.time - 1;
        if (this.time == 0) {
            this.talkClick(this.wxButton);
            clearTimeout(this.t);
        } else {
            this.wxButton.node.children[1].children[0].children[1].getComponent(cc.Label).string = this.time;
        }
    },
    talkPlay: function talkPlay(datas) {
        wx.downloadVoice({
            serverId: datas.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function success(res) {
                //dz.active = false;
                wx.playVoice({
                    localId: res.localId // 需要播放的音频的本地ID，由stopRecord接口获得
                });
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
        //# sourceMappingURL=ShareWx.js.map
        