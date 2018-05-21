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
    openMatchDetail: function (event) {
        // 进入比赛详情
        if (event.target.name == 'match_list') {
            let menu = cc.instantiate(this.menu);
            menu.parent = cc.find('Canvas/menu');
            menu.zIndex = 100000;
            if (menu) {
                let matchJs = event.target.getComponent('match');
                let listData = event.target.getChildByName('data').getComponent(cc.Label).string;
                let content = menu.getChildByName('main').children[0].children[1].children[0];// 概述后代元素---content
                let rewardTxt = menu.getChildByName('main').children[1].children[1].children[0];// 奖励下的后代元素---content
                let data = JSON.parse(listData);
                cc.sys.localStorage.setItem('activityId',data.id);
               /* let match = require('match');
                let matchNode = new matchNode();
                let node = matchNode.detailMatch;*/
                // 场次标题（如：vip用户专场）
                let title = menu.getChildByName('title').getComponent(cc.Label).string;
                if (data.bisaiType == 1) {
                    title = 'vip专场'   
                } else if (data.bisaiType == 2) {
                    title = '房卡专场'   
                } else if (data.bisaiType == 3) {
                    title = '比赛卡专场'   
                }
                // 报名费用
                if (data.entryConditions) {
                    let bmtj;
                    let conditions = content.children[0];
                    let entryConditions = JSON.parse(data.entryConditions);
                    for (let ele of entryConditions) {
                        if (ele.id == data.bisaiType) {
                            conditions.children[2].getComponent(cc.Label).string = ele.name;
                        }
                    }
                }
                // 报名时间
                let time = content.children[1].children[2].getComponent(cc.Label);
                time.string = data.bmStartTime + '至' + data.endTime;
                 // 参赛人数
                let num = content.children[2].children[2].getComponent(cc.Label);
                num.string = data.userNum + '人';
                // 奖品信息
                // let prizeData = JSON.parse(data.prizeData);
                let prizeData = [
                    {
                        "orgi":"ch",
                        "createTime":1525685556000,
                        "count":"1",
                        "dname":"月赛排位赛卡",
                        "id":21,
                        "isDel":0,
                        "did":2,
                        "nameValue":"月赛排位赛卡-1张",
                        "num":"1"
                    },
                    {
                        "orgi":"ch",
                        "createTime":1525685580000,
                        "count":"1",
                        "dname":"房卡",
                        "id":22,
                        "isDel":0,
                        "did":1,
                        "nameValue":"房卡-1张",
                        "num":"2-30"
                    }
                ];
              /*  for (let i = 0;i < prizeData.length;i++) {
                    let reward = cc.instantiate();
                    reward.children[0].getComponent(cc.Label).string = prizeData[i].num;
                    reward.children[1].getComponent(cc.Label).string = prizeData[i].nameValue;

                    if (i > 0) reward.y = reward.y - reward.width - 15;
                    reward.parent = rewardTxt.children[1];
                }
                // reward.string = '' + data.activiteContent;*/
            }
        } 
    }
});
