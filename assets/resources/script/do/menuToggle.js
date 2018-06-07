var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        gameSettingClick: cc.Prefab,
        shopPage: cc.Prefab,
        sharing:cc.Prefab,
        menu: cc.Prefab,
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
    /*
    * 到比赛详情
    * @param event  1、当前mach_list节点
    *               2、事件对象
    * 
    */
    openMatchDetail: function (event) {
        let data1;
        let menu = cc.instantiate(this.menu);
        function showDetail (dataStr) {
            data1 = JSON.parse(dataStr);
            menu.parent = cc.find('Canvas/menu');
            menu.zIndex = 100000;
            var content = menu.getChildByName('main').children[0].children[1].children[0];// 概述后代元素---content
            var rewardTxt = menu.getChildByName('main').children[1].children[1].children[0];// 奖励下的后代元素---content
            cc.sys.localStorage.setItem('activityId',data1.id);
            // 场次标题（如：vip用户专场）
            var title = menu.getChildByName('title')/*.getComponent(cc.Label)*/;
            title.getComponent(cc.Label).string = data1.activiteName;
            // 报名费用
            if (data1.entryConditions) {
                var bmtj;
                var conditions = content.children[0];
                var entryConditions = JSON.parse(data1.entryConditions);
                for (var ele of entryConditions) {
                    if (ele.id == data1.bisaiType) {
                        conditions.children[2].getComponent(cc.Label).string = ele.name;
                    }
                }
            }
            // 报名时间
            var time = content.children[1].children[2].getComponent(cc.Label);
            time.string = data1.bmStartTime + '至' + data1.endTime;
             // 参赛人数
            var num = content.children[2].children[2].getComponent(cc.Label);
            num.string = data1.userNum + '人';
            // 奖品信息
            var prizeData = JSON.parse(data1.prizeData);
            if (prizeData.length) {
                var Match = require('match');
                var match = new Match();
                for (var i = 0;i < prizeData.length;i++) {
                    var reward = cc.instantiate(rewardTxt.children[1]);
                    reward.children[0].getComponent(cc.Label).string = '第' + prizeData[i].num + '名';
                    reward.children[1].getComponent(cc.Label).string = prizeData[i].nameValue;
                    if (i > 0) reward.y = reward.y - reward.width - 15;
                    reward.active = true;
                    reward.parent = rewardTxt;
                }
            }
        }

        // 点击列表进入
        if (event.target && event.target.name == 'match_list') {
            if (menu) {
                let listData = event.target.getChildByName('data').getComponent(cc.Label).string;//存储被点击比赛信息
                showDetail(listData);                
            }
            return
        } 
        // 点击参赛进入
        let dataStr = event.node.getChildByName('data').getComponent(cc.Label).string;
        showDetail(dataStr);
    },
  
});
