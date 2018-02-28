(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/gameOver/overGameClick.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f892c3Ut+xLeIB9cdmEYEm7', 'overGameClick', __filename);
// module/majiang/js/gameOver/overGameClick.js

'use strict';

var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

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
        button: cc.Node,
        labei: cc.Node,
        txt: cc.Label,
        button2: cc.Node,
        nosure: cc.Label,
        labei2: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.button.active = true;
        this.labei.active = false;
        this.time;
    },
    // 解散游戏按钮  弹出弹窗
    // overGamenotice:function(){
    //     var mj = cc.find('Canvas').getComponent('MajiangDataBind');
    //     if(mj.alert.size()>0){
    //         var alert = mj.alert.get();
    //         alert.parent = cc.find("Canvas");
    //         let node = alert.getComponent('overGameClick') ;
    //         node.txt.string = '是否发起解散' ;

    //     }
    // },

    //离开游戏  不结束游戏
    // leaveGameClick:function(){

    //     this.scene("gameMain" , this);
    //     this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    // },
    //点击 确认结束游戏
    init: function init() {
        this.button.active = true;
        this.labei.active = false;
        this.labei2.active = false;
        this.time = 30;
    },
    overGameClick: function overGameClick() {
        /*
        * button为overGame时下部按钮
        * button2为离开但不退游戏的下部按钮
        * labei：等待玩家显示字
        */
        debugger;
        //this.scene("gameMain" , this);
        cc.sys.localStorage.setItem('unOver', 'true');
        this.button.active = false;
        this.button2.active = false;

        this.labei.active = true;
        this.labei2.active = false;
        // this.daojishi();
        // this.labei2.string = '还有'+this.time +'自动解散'
        this.node.dispatchEvent(new cc.Event.EventCustom('overGame', true));
        debugger;
    },
    //继续游戏 发送一个不退出请求
    goonGameClick: function goonGameClick() {
        debugger;
        var REFUSE = true;
        var oper = new cc.Event.EventCustom('overGame', true);
        oper.setUserData(REFUSE);
        this.node.dispatchEvent(oper);
        var mj = cc.find('Canvas').getComponent('MajiangDataBind');
        var dialog = cc.find("Canvas/isover");
        mj.alert.put(dialog);
        // dailog.destroy();

        //alert();
        debugger;
    },
    dontLeaveGameClick: function dontLeaveGameClick() {
        var mj = cc.find('Canvas').getComponent('MajiangDataBind');
        var dialog = cc.find("Canvas/isleave");
        dialog.destroy();
    },
    leaveGameClick: function leaveGameClick() {
        cc.sys.localStorage.setItem('dis', 'true');
        this.disconnect();
        if (cc.weijifen.GameBase.gameModel == 'wz') {
            this.scene("温州", this);
        } else {
            this.scene("gameMain", this);
        }
        this.node.dispatchEvent(new cc.Event.EventCustom('leaveGame', true));
    },
    daojishi: function daojishi() {
        this.time = this.time - 1;
        if (this.labei2) {
            this.labei2.getComponent(cc.Label).string = this.time;
            console.log(this.time);
        }
    }

    // setting:function(){

    //     let mjdata = cc.find('Canvas').getComponent('MajiangDataBind');
    //     var action = cc.moveTo(0.5,336,274);
    //     mjdata.setting_coin.runAction(action);
    //     this.node.dispatchEvent( new cc.Event.EventCustom('settingclick', true) );

    // }

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
        //# sourceMappingURL=overGameClick.js.map
        