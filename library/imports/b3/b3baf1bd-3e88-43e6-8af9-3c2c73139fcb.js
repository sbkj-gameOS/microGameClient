"use strict";
cc._RF.push(module, 'b3bafG9PohD5or5PCxzE5/L', 'endUserInfo');
// module/majiang/js/gameOver/endUserInfo.js

'use strict';

cc.Class({
    extends: cc.Component,

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
        dianpao: cc.Node,
        dayingjia: cc.Node,
        username: cc.Label,
        myself: cc.Node,
        totalcount: cc.Label,

        huCount: cc.Label,
        dianCount: cc.Label,
        touchBao: cc.Label,
        bankerCount: cc.Label,
        bk: cc.Node,
        yinse: cc.SpriteFrame,
        yintiao: cc.SpriteFrame,
        headimgs: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init() {

        var player = cc.find('Canvas').getComponent('MJDataBind').playersarray;
        var userInfo = this.data;
        var headimg = void 0;
        console.log(this.data);
        this.huCount.string = userInfo.huCount;
        this.dianCount.string = userInfo.dianCount;
        this.touchBao.string = userInfo.touchBao;
        this.bankerCount.string = userInfo.bankerCount;
        this.totalcount.string = '总分：' + userInfo.pointCount;
        for (var i = 0; i < player.length; i++) {
            var pl = player[i].getComponent('MaJiangPlayer');
            if (pl.data.id == this.data.user) {
                headimg = pl.data.headimgurl;
                this.username.string = pl.data.username;
            }
            if (this.data.user == cc.weijifen.user.id) {
                this.myself.active = true;
            }
        }
        //如果分数低于0的时候就是银色的框
        if (userInfo.pointCount < 0) {
            this.bk.getComponent(cc.Sprite).spriteFrame = this.yinse;
            // this.huCount.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;
            // this.dianCount.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;
            // this.touchBao.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;            
            // this.bankerCount.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;
        }
        //这个值代表大赢家
        if (this.dyj) {
            this.dayingjia.active = true;
        }
        //大赢家和点炮不能同时出现  这个是点炮高手
        if (this.dp && !this.dyj) {
            this.dianpao.active = true;
        }
        //头像
        if (headimg) {
            var imgurl = headimg;
            var sprite = this.headimgs.getComponent(cc.Sprite);
            var head = this.headimgs;
            cc.loader.load({ url: imgurl, type: 'jpg' }, function (suc, texture) {
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                head.width = 90;
                head.height = 90;
            });
        }
        //     this.username.string = userInfo.userName;
        //     if(userInfo.cur != 'true' ){
        //         this.myself.active = false;
        //         this.bk.color = new cc.Color(213,197,197);
        //    }
        //    if(userInfo.balance){
        //     for(let i = 0; i<userInfo.balance.units.length;i++){
        //         var gang = cc.instantiate(this.loyou);
        //         this.updateItem(userInfo.balance.units[i]);
        //         gang.parent = this.content ;
        //     }

        // }

        //     console.log(userInfo.cur);
        //     if(userInfo.gang){
        //         for(let i = 0; i<userInfo.gang.units.length;i++){
        //             //bei += userInfo.gang.details[i].point
        //             var gang = cc.instantiate(this.loyou);
        //             this.updateItem(userInfo.gang.units[i]);
        //             gang.parent = this.content;
        //         }      
        //     };

    },
    // updateItem:function(data){
    //     this.label1.string = data.type;
    //     this.label2.string = data.tip;
    //     this.label3.string = data.point;
    //     this.label1.node.height = 40;
    //     this.label2.node.height = 40;
    //     this.label3.node.height = 40;
    //     //this.label3.string = data.count;
    // },

    setData: function setData(data, dayingjia, dianpao) {
        this.data = data;
        this.dyj = dayingjia;
        this.dp = dianpao;
        this.init();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();