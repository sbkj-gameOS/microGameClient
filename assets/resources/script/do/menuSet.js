cc.Class({
    extends: cc.Component,
    properties: {
        title:cc.Node,
        joinRoom: cc.Prefab,
        createRoom: cc.Prefab,
        setting:cc.Prefab,
    },
    onLoad: function () {
        let h5CallCocos = require('h5CallCocos');
        // cc.weijifen.match = new h5CallCocos();
    },
    init:function(name,url){
        this.clearPerfab();
        let web = this.title.parent.children[2];
        let loadImage = this.title.parent.children[3];
        loadImage.active = true;
        var shareWxBtn = this.title.parent.children[4];
        shareWxBtn.active = false;       
        web.setPosition(0,900);
        for(let i in this.title.children){
            this.title.children[i].active = false ;
        }
        if(name != 15){
        // if(name != 15 || name != 9){
            this.title.children[name].active = true;
        }
        if(name == 10 || name == 11 || name == 9) {
            let gameroom;
            web.active = false;
            let loadImage = this.title.parent.children[3];
            loadImage.active = false;
            if(name ==10){
                gameroom = cc.instantiate(this.joinRoom);
            }else if(name == 11 || name == 9){
                if (name == 9) cc.weijifen.matchFlag = true;
                gameroom = cc.instantiate(this.createRoom);
            }
            gameroom.parent = this.node
        }else{
            var self = this ;
            cc.weijifen.loginOut = function(data) {
                self.loginOut(data,self) ;
            };
            web.active = true;
            web = web.getComponent(cc.WebView);
            web.node.on('loaded', this.callback, this);//webview加载完成后执行的方法
            var scheme = "aaaabb";// 这里是与内部页面约定的关键字
            web.setJavascriptInterfaceScheme(scheme);
            function jsCallback (url) {
                cc.director.loadScene("majiang");
                var str = url.replace(scheme + '://', '');
                var data = JSON.stringify(str);// {a: 0, b: 1}
                alert('成功拿到值',data)
                //回掉操作。当webview里操作外部方法时，通过这里调用。例如，支付。
                var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "iPayHandler",url);
            }
            web.setOnJSCallback(jsCallback);
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
            /* 2 */     "/gamePrizeActivity/prizeDzp?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
            /* 3 */     "/gameNotice/goNoticePage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
            /* 4 */     "/help/chHelp?orgi="+cc.weijifen.GameBase.gameModel+"",
                        // "/shop/shopPage?token=bb52eedc507149c7b3b329471bda7373"+/*cc.weijifen.authorization+*/"&type="+cc.weijifen.GameBase+"",
            /* 5 */     "http://game.cdn.bizpartner.cn/shop/shopPage.html?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel,
            /* 6 */     "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+"",
            /* 7 */     "/situation/goSituationPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
            /* 8 */     "/rankingList/goRankingPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
            /* 9 */     "/match/goMatchPage?token="+cc.weijifen.authorization+"",
            /* 10 */    "",
            /* 11 */    "",
            /* 12 */    "/help/share?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
            /* 13 */    "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+""
                    ];
            web.url = cc.weijifen.url + data[name];
            if (name == 5) {
                web.url = data[name]
            };

            if(name == 15){
                web.url = cc.weijifen.url + url;
            }
            cc.log(web.url);
            /*WebView = function(e){
                e.preventDefault();
            }*/
        }
    },
    loginOut: function(data,target){
        cc.director.loadScene('appLogin');// 通过场景名加载场景
    },
    callback:function(event){
        var webview = event.detail.url.indexOf("help/share");
        let web = this.title.parent.children[2];
        if(webview != -1){
            web.height = 390;
            web.setPosition(0,-49);
            var shareWxBtn = this.title.parent.children[4];
            shareWxBtn.active = true;
        }else{
            web.height = 490;
            web.setPosition(0,0);
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
    shareWxClick:function(){
        var jsonData = {
            url:"http://game.bizpartner.cn/wxController/toCHAuthAgainWx?invitationcode="+cc.weijifen.user.invitationcode,
            title:"心缘竞技",
            context:"刺激的玩法、真实的体验，微信好友真诚邀请，快快进入游戏，一起嗨翻天！",
            conType:1,
            msgType:1
        }
        var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareEvent",JSON.stringify(jsonData));
    }
});
