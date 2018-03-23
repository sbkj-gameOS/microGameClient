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
            web.active = true;
            web = web.getComponent(cc.WebView);
            var scheme = "matchList";// 这里是与内部页面约定的关键字
            web.setJavascriptInterfaceScheme(scheme);
            function jsCallback (url) {
                console.log("jsCallback");
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
                        "/help/serviceXy",
                        "/help/parentJhgc",
                        "/gamePrizeActivity/prizeDzp?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"&activityId=27",
                        "/gameNotice/goNoticePage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"",
                        "/help/chHelp?orgi="+cc.weijifen.GameBase.gameModel+"",
                        "/shop/shopPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"",
                        "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+"",
                        "/situation/goSituationPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase.gameModel+"",
                        "/rankingList/goRankingPage?token="+cc.weijifen.authorization+"&type="+cc.weijifen.GameBase+"",
                        "/match/goMatchPage?token="+cc.weijifen.authorization+"",
                        "",
                        "",
                        "",
                        "/userInfo/goUserInfoPage?token="+cc.weijifen.authorization+""
                    ];
            cc.log(web);
            web.url = cc.weijifen.url + data[name];
            WebView = function(e){
                e.preventDefault();
            }
        }
    },
    testCode: function(){
        console.log("testCode");
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
