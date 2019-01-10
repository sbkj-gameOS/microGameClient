cc.Class({
    extends: cc.Component,
    properties: {
        title:cc.Node,
        joinRoom: cc.Prefab,
        createRoom: cc.Prefab,
        setting:cc.Prefab,
        shareStep: cc.Prefab,
        ranking: cc.Prefab,
        invitation: cc.Prefab,
        notice: cc.Prefab,
        situation: cc.Prefab,
        activity: cc.Prefab,
        usermess:cc.Prefab
    },
    onLoad: function () {
        let h5CallCocos = require('h5CallCocos');
        // cc.weijifen.match = new h5CallCocos();
    },
    init:function(name,url){
        this.clearPerfab();
        let web = this.title.parent.children[2];
        web.setPosition(0,999);
        for(let i in this.title.children){
            this.title.children[i].active = false ;
        }
        
        if (name == 12) {//分享
            web.active = false;
            cc.find('Canvas/menu/share').active = true;
            cc.find('Canvas/menu/loading_03').active = false;
            cc.find('Canvas/menu/title').getChildByName(name).active = true;
            return
        }

        if(name == 'invitation'){//分享有礼
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            let invitation = cc.instantiate(this.invitation);
            invitation.parent = this.node;
            invitation.parent.name = 'invitationMenu';
            invitation.parent.zIndex = 1;
            return;
        }

        if(name != 15){

        }

        
        if(name == 10 || name == 11 || name == 9||name==30) {
            let gameroom;
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            if(name ==10){
                gameroom = cc.instantiate(this.joinRoom);
            }else if(name == 11 || name == 9||name==30){
                if (name == 9) cc.weijifen.matchFlag = true;
                gameroom = cc.instantiate(this.createRoom);
                if(name==30){
                    var create=gameroom.getComponent('createRoomPreb');
                    create.isKuaiSan=true;
                }
            }
            gameroom.parent = this.node
        }else if(name == 8){//排名
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            let ranking = cc.instantiate(this.ranking);
            ranking.parent = this.node
            return;
        }else if(name == 3){//通知
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            let notice = cc.instantiate(this.notice);
            notice.parent = this.node
            return;
        }else if(name == 7){// 战况
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            let situation = cc.instantiate(this.situation);
            situation.parent = this.node;
            return;
        }else if(name == 2){// 活动
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            let activity = cc.instantiate(this.activity);
            activity.parent = this.node;
            return;
        } else if(name == 6 || name == 13){
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            let usermess = cc.instantiate(this.usermess);
            usermess.parent = this.node;
            return;
        }else{
            var self = this ;
            self.title.parent.children[3].active = true;
            cc.weijifen.loginOut = function(data) {
                self.loginOut(data,self) ;
            };
            web.active = true;
            web = web.getComponent(cc.WebView);
            web.node.on('loaded', this.callback, this);//webview加载完成后执行的方法
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
             * 9：比赛大厅url地址
             * 10：
             * 11：
             * 12：分享
             * 13：玩家信息
             * @type {Array}
             */
            var data = [
            /* 0 */     "/help/serviceXy",
            /* 1 */     "/help/parentJhgc",
            /* 2 */     "",
            /* 3 */     "",
            /* 4 */     "/help/chHelp?orgi="+cc.weijifen.GameBase.gameModel+"",
                        // "/shop/shopPage?token=bb52eedc507149c7b3b329471bda7373"+/*cc.weijifen.authorization+*/"&type="+cc.weijifen.GameBase+"",
            /* 5 */     "",
            /* 6 */     "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+"",
            /* 7 */     "",
            /* 8 */     "",
            /* 9 */     "",
            /* 10 */    "",
            /* 11 */    "",
            /* 12 */    "",
            /* 13 */    "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+""
                    ];
                    // http://game.bizpartner.cn/userInfo/goUserInfoPage?token=46de26af98fd47f88e9d595eef8155d6
            web.url = cc.weijifen.url + data[name];
            if (name == 5) {
                web.url = data[name]
            };

            if(name == 15){
                web.url = cc.weijifen.url + url;
            }
            var title = cc.find('Canvas/menu/title');
            if(name == 0 || name == 1 || name == 4){//协议标题
                title.getChildByName(name).active = true;
            }
        }
    },
    loginOut: function(data,target){
        cc.director.loadScene('appLogin');// 通过场景名加载场景
    },
    callback:function(event){
        var webview = event.detail.url.indexOf("help/share");
        let web = this.title.parent.children[2];
        if(webview != -1){
            web.height = 500;
            web.setPosition(0,-40);
            var shareWxBtn = this.title.parent.children[4];
            shareWxBtn.active = true;
        }else{
            web.height = 500;
            web.setPosition(0,-40);
        }
    },
    //清除留下的东西
    clearPerfab: function(){
        if(cc.find('Canvas/menu/joinroom')){
            cc.find('Canvas/menu/joinroom').destroy();
        }
        if(cc.find('Canvas/menu/createroom')){
            cc.find('Canvas/menu/createroom').destroy();
        }
        if(cc.find('Canvas/menu/setting')){
            cc.find('Canvas/menu/setting').destroy();
        }
    },
    /**
     * 分享流程指引
     * @return {[type]} [description]
     */
    shareStepFn: function () {
        var share = cc.instantiate(this.shareStep);
        share.parent = cc.find('Canvas');
        cc.weijifen.menu.put(this.node);
    },
    /**
     * 关闭分享流程指引
     */
    shareStepClose: function () {
        cc.find('Canvas/shareStep').destroy();
    },
    /* 
    * 分享到微信后，微信内容显示 
    * url     多媒体方式下的点击跳转连接
    * imgUrl  图片连接
    * width   图片宽度
    * height  图片高度
    * title   多媒体标题
    * context 多媒体或者文字类型的内容
    * conType 内容类型: 1 多媒体 2 图片 3 文字
    * msgType 分享类型: 1 好友 2 朋友圈
    */
    shareWxClick:function(e, customEventData){
        var jsonData,shareUrl,shareTitle,shareText,boxId;
        var object = cc.find('Canvas')._components[1];
        var wjf = require('WJFCommon');
        var _wjf = new wjf(); 
        cc.weijifen.http.httpGet('/coupon/gain/coupon/id?userId=' + cc.weijifen.user.id,function(data){
           boxId = data;
        },function(data){boxId=data}) ;  
        let time = setTimeout(function(){
            if (customEventData == 'app') {
                cc.log('app')
                // shareUrl = "http://game.bizpartner.cn/wxController/toCHAuthAgainWx?invitationcode="+cc.weijifen.user.invitationcode;
                shareUrl = cc.weijifen.url+"/wxController/toCHAuthAgainWx?invitationcode="+cc.weijifen.user.invitationcode;
                shareTitle = "心缘竞技";
                shareText = '刺激的玩法、真实的体验，微信好友真诚邀请，快快进入游戏，一起嗨翻天！';
            } else if (customEventData == 'redBox') {
                cc.log('redBox')
                var WJFCommon = require("WJFCommon");
                var wjf = new WJFCommon();
                wjf.alert('即将开放，敬请期待！');
                return
               /* shareUrl = "http://game.bizpartner.cn/coupon/gain/share?sn_id=" + boxId;
                shareTitle = "心缘竞技-770元大礼包";
                shareText = '好友分享，10份价值77元现金大礼包，点击即可领取！';*/
                
            }
            jsonData = {
                url: shareUrl,
                title: shareTitle,
                context: shareText,
                conType: 1,
                msgType: 1
            }
            // console.log(jsonData);
            // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareEvent",JSON.stringify(jsonData));
            var res = jsb.reflection.callStaticMethod(...object.anMethodParam().shareEvent,JSON.stringify(jsonData));
        },2000);
    },
    /*阻止点击冒泡*/
    stopBubble: function (event) {
        event.bubble = false;
    },
});
 