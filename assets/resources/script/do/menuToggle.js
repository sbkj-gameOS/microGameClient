var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        gameSettingClick: cc.Prefab,
        shopPage: cc.Prefab,
        sharing:cc.Prefab,
        menu: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        
    },
    close: function(){
        let menu = cc.find("Canvas/menu") ;
        cc.weijifen.menu.put(menu);
    },
    open: function(event){
        if (event.target.name == 14) {
            let setting = cc.instantiate(this.gameSettingClick);
            let cardcolor = cc.sys.localStorage.getItem('cardcolor');
            let j;
            setting.parent = cc.find('Canvas');
            if (setting) {
                let cards = cc.find('Canvas/setting/majiang');
                for (let i = 0;i < cards.children.length;i++) {
                    if (cardcolor == 'yellow') { j = 0 } else 
                    if (cardcolor == 'blue') { j = 1 } else 
                    if (cardcolor == 'purple') { j = 2 };
                    cards.children[i].getChildByName('select_box').active = false;
                    cards.children[j].getChildByName('select_box').active = true;
                }
            }
            return 
        }
        if (event.target.name == 5) {
            let setting = cc.instantiate(this.shopPage);
            setting.parent = cc.find('Canvas');
            return 
        }


        if (event.target.name == 9) {
            this.alert("敬请期待~");
            return 
        }

     /*   // 进入比赛详情
        if (event.target.name == 'match_list') {
            let menu = cc.instantiate(this.menu);
            menu.parent = cc.find('Canvas/menu');
            menu.zIndex = 100000;
            if (menu) {
                let matchJs = event.target.getComponent('match');
                let listData = event.target.getChildByName('data').getComponent(cc.Label).string;
                let data = JSON.parse(listData);
                matchJs.goDetail(data);
            }
            return
        } 
*/
        //分享
        // if(event.target.name == 12){
            // var jsonData = {
            //     url:"http://game.bizpartner.cn/wxController/toCHAuthAgainWx",
            //     title:"心缘竞技",
            //     context:"刺激的玩法、真实的体验，微信好友真诚邀请，快快进入游戏，一起嗨翻天！"
            // }
            // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareEvent",JSON.stringify(jsonData));
        //     return;
        // }
        this.hall(event.target.name);
    },
    openMatchDetail: function (event) {
           // 进入比赛详情
        if (event.target.name == 'match_list') {
            let menu = cc.instantiate(this.menu);
            menu.parent = cc.find('Canvas/menu');
            menu.zIndex = 100000;
            if (menu) {
                let matchJs = event.target.getComponent('match');
                let listData = event.target.getChildByName('data').getComponent(cc.Label).string;
                let data = JSON.parse(listData);
            }
        } 
    }
});
