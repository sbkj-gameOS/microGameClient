var WJFCommon = require("WJFCommon");
let m = 0;
cc.Class({
    // extends: cc.Component,
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
        dianpao: cc.Node,
        dayingjia: cc.Node,
        username : cc.Label,
        myself: cc.Node,
        totalcount: cc.Label,
        
        huCount: cc.Label,
        dianCount: cc.Label,
        touchBao: cc.Label,
        bankerCount :cc.Label,
        bk:cc.Node,
        yinse: cc.SpriteFrame,
        yintiao: cc.SpriteFrame,
        headimgs:cc.Node,
        prizeBox: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
    },
    /**
     * 游戏结束
     */
    init:function(){
        
        let player = cc.find('Canvas').getComponent('MJDataBind').playersarray;
        let userInfo = this.data;
        let headimg;
        this.huCount.string = userInfo.huCount;
        this.dianCount.string = userInfo.dianCount;
        this.touchBao.string = userInfo.touchBao;
        if (cc.weijifen.GameBase.gameModel == 'nj') {
            this.touchBao.node._parent.active = false;
        }
        this.bankerCount.string = userInfo.bankerCount;
        this.totalcount.string = '总分：'+userInfo.pointCount;
        for(let i = 0;i<player.length;i++){
            let pl = player[i].getComponent('MaJiangPlayer');
            if(pl.data.id == this.data.user){
                headimg = pl.data.headimgurl;
                this.username.string = pl.data.username;
            }
            if(this.data.user == cc.weijifen.user.id){
                this.myself.active = true;
            }
        }
        //如果分数低于0的时候就是银色的框
        if(userInfo.pointCount<0){
            this.bk.getComponent(cc.Sprite).spriteFrame = this.yinse;
            // this.huCount.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;
            // this.dianCount.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;
            // this.touchBao.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;            
            // this.bankerCount.node.parent.getComponent(cc.Sprite).spriteFrame = this.yintiao;

        }
        //这个值代表大赢家
        if(this.dyj){
            this.dayingjia.active = true;
        }
        //大赢家和点炮不能同时出现  这个是点炮高手
        if(this.dp&&!this.dyj){
            this.dianpao.active =true;
        }
        //头像
        if(headimg){
            var imgurl = headimg;
            var sprite = this.headimgs.getComponent(cc.Sprite);
            var head = this.headimgs;
            cc.loader.load({url:imgurl,type:'jpg'},function(suc,texture){
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                head.width = 90;
                head.height = 90;
            });
        }
        let self = this;
        // 比赛结束弹出中奖信息
        

        // 比赛结束后弹出提示
        if (cc.weijifen.match == "true") {
        /* 例子数据：
        * {
                "name": "Guest_0ZVI5N",
                "activityName": "房卡赛",
                "activityTime": "2018-07-05 19:08:00 到 2018-07-05 19:08:40",
                "prizeName": "谢谢参与", // 比赛奖励(如果值为‘谢谢参与’则没有中奖，领取奖品按钮不会显示)
                "url": "http://game.bizpartner.cn/registerPlayer/getEWMImage?token=2022e1ec72434c05b840f17c8ba2eb67",
                "position": "7"
            }*/
            cc.sys.localStorage.removeItem('signUp');
            if (cc.sys.localStorage.getItem('matchOver') && cc.sys.localStorage.getItem('matchPrize')) {
                cc.weijifen.endMatchFlag++;
                if (cc.weijifen.endMatchFlag > 1) return;
                let data = JSON.parse(cc.sys.localStorage.getItem('matchPrize'));
                let box = cc.instantiate(self.prizeBox);
                let timer1 = setTimeout(function() {
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('match_name').children[1].getComponent(cc.Label).string = data.activityName;
                    let time = data.activityTime;
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('match_time').children[1].getComponent(cc.Label).string = '(' + time.toString().substring(0,10) + '场)';
                    if (data.position != null) {
                        box.getChildByName('base').getChildByName('msg_box').getChildByName('position').children[1].getComponent(cc.Label).string = data.position;
                    }
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('palyer_name').getComponent(cc.Label).string = '恭喜' + data.name + '在';
                    if (data.prizeName) {
                        box.getChildByName('base').getChildByName('msg_box').getChildByName('prize').active = true;
                        box.getChildByName('base').getChildByName('msg_box').getChildByName('prize').children[2].getComponent(cc.Label).string = data.prizeName;
                    } else {
                        box.getChildByName('base').getChildByName('msg_box').getChildByName('num').active = true;
                        box.getChildByName('base').getChildByName('msg_box').getChildByName('num').children[0].getComponent(cc.Label).string = '第' + data.position + '名';
                    }
                    if (data.prizeName == '谢谢参与') {
                        box.getChildByName('base').getChildByName('getprize').active = false;   
                    }
                                        // 二维码
                    /*let img = box.getChildByName('base').getChildByName('msg_box').getChildByName('erweima');
                    if(data.url){
                        var imgurl = data.url;
                        // 测试数据
                        // var imgurl = 'http://game.bizpartner.cn/registerPlayer/getEWMImage?token=5399d111b3f940c8843dd75fd6c27690';
                        var sprite = img.getComponent(cc.Sprite);
                        cc.loader.load({url:imgurl,type:'jpg'},function(suc,texture){
                            sprite.spriteFrame = new cc.SpriteFrame(texture);
                            img.width = 294;
                            img.height = 266;
                        });
                    }*/
                    box.parent = cc.find('Canvas');
                    box.zIndex = 1000000000;
                    cc.sys.localStorage.removeItem('matchOver');
                    clearTimeout(timer1);
                },1000);
            } else {
                let timer = setTimeout(function() {
                    // cc.weijifen.matchTime = null;
                    cc.sys.localStorage.removeItem('matchTime');
                    var msg = '比赛结束后，系统会对数据进行统计，获奖玩家可在【通知】中查看中奖信息';
                    self.alert(msg);
                    clearTimeout(timer);
                },1000);
            }


            cc.find('Canvas/summary/base').children[0].active = false;
            cc.find('Canvas/summary/base').children[3].active = true;
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
 
    setData:function(data,dayingjia,dianpao){
        this.data = data ; 
        this.dyj = dayingjia;
        this.dp = dianpao;
        this.init();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
