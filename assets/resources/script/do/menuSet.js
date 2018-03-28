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
    init:function(name){
        this.clearPerfab();
        let web = this.title.parent.children[2];
        for(let i in this.title.children){
            this.title.children[i].active = false ;
        }
        this.title.children[name].active = true;
        if(name == 10 || name == 11){
            let gameroom;
            web.active = false;
            if(name ==10){
                gameroom = cc.instantiate(this.joinRoom);
            }else if(name == 11){
                gameroom = cc.instantiate(this.createRoom);
            }
            gameroom.parent = this.node
        }else{
            var self = this ;
            cc.weijifen.testCode = function(data) {
                        console.log("data:"+data);
                self.testCode(data,self) ;
            };
            web.active = true;
            web = web.getComponent(cc.WebView);
            var scheme = "matchList";// 这里是与内部页面约定的关键字
            web.setJavascriptInterfaceScheme(scheme);
            function jsCallback (url) {
                console.log("jsCallback");
                var str = url.replace(scheme + '://', '');
                var data = JSON.stringify(str);// {a: 0, b: 1}
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
             * 12：
             * 13：玩家信息
             * @type {Array}
             */
            var data = [
            /* 0 */     "/help/serviceXy",
            /* 1 */     "/help/parentJhgc",
            /* 2 */     "/gamePrizeActivity/prizeDzp?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"&activityId=27",
            /* 3 */     "/gameNotice/goNoticePage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"",
            /* 4 */     "/help/chHelp?orgi="+cc.weijifen.GameBase.gameModel+"",
                        // "/shop/shopPage?token=bb52eedc507149c7b3b329471bda7373"+/*cc.weijifen.authorization+*/"&type="+cc.weijifen.GameBase+"",
            /* 5 */     "http://game.cdn.bizpartner.cn/shop/shopPage.html?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel,
            /* 6 */     "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+"",
            /* 7 */     "/situation/goSituationPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
            /* 8 */     "/rankingList/goRankingPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"",
            /* 9 */     "/match/goMatchPage?token="+cc.weijifen.authorization+"",
            /* 10 */    "",
            /* 11 */    "",
            /* 12 */    "",
            /* 13 */    "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+""
                    ];
            cc.log(web);
            web.url = cc.weijifen.url + data[name];
            if (name == 5) {
                web.url = data[name]
            };
            cc.log(web.url)
            /*WebView = function(e){
                e.preventDefault();
            }*/
        }
    },
    testCode: function(data,target){
        console.log("data:"+data);
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
    }
});
