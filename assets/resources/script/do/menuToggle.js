var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        gameSettingClick: cc.Prefab,
        shopPage: cc.Prefab,
        sharing:cc.Prefab,
        menu: cc.Prefab,
        match: cc.Prefab,
        alts: cc.SpriteAtlas,
        packgeMenu: cc.Prefab,
        activityMenu: cc.Prefab
     },

    // use this for initialization
    onLoad: function () {
        
    },
    close: function(){
        let menu = cc.find("Canvas/menu") ;
        cc.weijifen.menu.put(menu);
    },
    open: function(event){
        // 活动（抽奖）
        if (event.target.name == 666) {
            var activityMenu = cc.instantiate(this.activityMenu);
            activityMenu.parent = cc.find('Canvas');
            return
        }
        if (event.target.name == 20) {
            this.packageMenu();
            return
        }
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
            if(cc.weijifen.GameBase.gameModel == "ch"){
                let match = cc.instantiate(this.match);
                match.parent = cc.find('Canvas');
                return 
            }else{
                this.alert("敬请期待~");
                return 
            }
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
        cc.weijifen.menuNum = event.target.name;
        this.hall(event.target.name);
    },
    /*
    * 到比赛详情
    * @param event  1、当前mach_list节点
    *               2、事件对象
    * 
    * 
    */
    openMatchDetail: function (event) {
        let data1;
        let menu = cc.instantiate(this.menu);
        function showDetail (dataStr) {
            var self = cc.find('Canvas/js/menuToggle').getComponent('menuToggle');
            data1 = JSON.parse(dataStr);
            menu.parent = cc.find('Canvas');
            menu.zIndex = 100000;
            var content = menu.getChildByName('main').children[0].children[1].children[0];// 概述后代元素---content
            var rewardTxt = menu.getChildByName('main').children[1].children[1].children[0];// 奖励下的后代元素---content
            cc.sys.localStorage.setItem('activityId',data1.id);
            // 报名费用
            // data1.entryConditions = JSON.stringify([{"id":"2","name":"用户","num":'卡2张'},{"id":"2","name":"VIP用户"}]);
            if (data1.entryConditions) {
                var bmtj;
                var conditions = content.children[0];
                var entryConditions = JSON.parse(data1.entryConditions);
                var name =  '';
                let m = -1;
                for (var ele of entryConditions) {
                    m++;
                    if (ele.num) {
                        cc.sys.localStorage.setItem('prizeNum',ele.num);// 支付房卡的数量
                        name += ' ' + ele.name + ele.num;
                    } else {
                        name += ' ' + ele.name;
                    }
                    //约局指定时间段胜场
                    //"[{"id":"4","name":"约局指定时间段胜场数","data":{"yjStartTime":"2018-07-01","yjEndTime":"2018-07-11","yjWin":"0"}}]"
                    if (ele.id == 4) {
                        var data2 = ele.data;
                        data2 = ':' + data2.yjStartTime + '至' + data2.yjEndTime + ' 胜:' + data2.yjWin;
                        name += data2;
                    }
                    conditions.children[2].getComponent(cc.Label).string = name;
                }

            }
            // 报名时间
            var time = content.children[1].children[2].getComponent(cc.Label);
            time.string = data1.bmStartTime + '至' + data1.bmEndTime;
             // 开赛时间
            var num = content.children[2].children[2].getComponent(cc.Label);
            num.string = data1.startTime + '至' + data1.endTime;
            // 奖品信息
            var prizeData = JSON.parse(data1.prizeData);
            if (prizeData.length) {
                var Match = require('match');
                var match = new Match();
                for (var i = 0;i < prizeData.length;i++) {
                    var reward = cc.instantiate(rewardTxt.children[1]);
                    reward.children[0].getComponent(cc.Label).string = '第' + prizeData[i].num + '名';
                    reward.children[1].getComponent(cc.Label).string = prizeData[i].nameValue;
                    if (i > 0) {
                        reward.y = rewardTxt.children[i+1].y - 70;
                    }
                    if (i == 0) {
                        reward.children[2].getComponent(cc.Sprite).spriteFrame = self.alts.getSpriteFrame('crown-1');
                    } else if (i == 1) {
                        reward.children[2].getComponent(cc.Sprite).spriteFrame = self.alts.getSpriteFrame('crown-2');
                    }
                    reward.parent = rewardTxt;
                    reward.active = true;
                }
            }
            // 比赛内容
            var match_content = content.children[4].children[1].getComponent(cc.Label);
            match_content.string = data1.activiteContent;

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
        cc.sys.localStorage.setItem('matchData',dataStr);
    },
    /*
    * 背包功能
    */
    packageMenu: function(){
        let self = this;
        function packageSucces (res) {
            let data = JSON.parse(res);
            data = {
                "packageGoods": [
                {
                  "linkedId": null,//2（满100减2）；若值为-1、null，没有该优惠
                  "useStartTime": null,//使用开始时间
                  "num": 0,//该优惠券数量
                  "description": "连胜10场增加",
                  "sort": "CARD",
                  "type": "MONTHRACINGCARD",// MONTHRACINGCARD(1, "月赛卡"),COUPON(2,"优惠券");
                  "userId": "c464bebe43c74a6fbd7b4581357016e1",
                  "division": "PERMANENT",//是否是有过期时间
                  "useEndTime": null,
                  "orgi": "ch",
                  "createTime": 1534411927000,//领取时间
                  "faceValue": null,//100（满100减2）
                  "id": 83
                },
                {
                  "linkedId": 9,
                  "useStartTime": 1534312130000,
                  "num": 195,
                  "description": "系统赠送的优惠券",
                  "sort": "OTHER",
                  "type": "COUPON",
                  "userId": "c464bebe43c74a6fbd7b4581357016e1",
                  "division": "DISPOSABLE",
                  "useEndTime": 1536040131000,
                  "orgi": "ch",
                  "createTime": 1534388077000,
                  "faceValue": 10,
                  "id": 70
                },
                {
                  "linkedId": 17,
                  "useStartTime": 1534312130000,
                  "num": 39,
                  "description": "系统赠送的优惠券",
                  "sort": "OTHER",
                  "type": "COUPON",
                  "userId": "c464bebe43c74a6fbd7b4581357016e1",
                  "division": "DISPOSABLE",
                  "useEndTime": 1536040131000,
                  "orgi": "ch",
                  "createTime": 1534312131000,
                  "faceValue": 50,
                  "id": 71
                },
                {
                  "linkedId": 50,
                  "useStartTime": 1534312130000,
                  "num": 39,
                  "description": "系统赠送的优惠券",
                  "sort": "OTHER",
                  "type": "COUPON",
                  "userId": "c464bebe43c74a6fbd7b4581357016e1",
                  "division": "DISPOSABLE",
                  "useEndTime": 1536040131000,
                  "orgi": "ch",
                  "createTime": 1534312131000,
                  "faceValue": 177,
                  "id": 72
                }
              ]
            };
            let menu1 = cc.instantiate(self.packgeMenu);
            let listModel = menu1.getChildByName('main').children[0].children[0].getChildByName('listModel');
            for (let ele of data.packageGoods) {
                let model = cc.instantiate(listModel);
                if (ele.type == 'COUPON') {
                    // 优惠券
                    model.children[0].getChildByName('linkedNum').getComponent(cc.Label).string = ele.linkedId;
                    model.children[0].getChildByName('couponMsg').getComponent(cc.Label).string = '满' + ele.faceValue + '减' + ele.linkedId;
                    model.children[0].getChildByName('useEndTime').getComponent(cc.Label).string = self.timestampToTime(ele.useEndTime,2) + '过期';
                } else {
                    model.children[0].getChildByName('couponMsg').getComponent(cc.Label).string = '月赛卡';
                    model.children[0].getChildByName('linkedNum').active = false;
                    model.children[0].getChildByName('img3').active = false;
                    model.children[0].getChildByName('useEndTime').active = false;
                    model.children[0].getChildByName('$').active = false;
                }
                model.children[1].getComponent(cc.Label).string = 'x' + ele.num;
                model.active = true;
                model.parent = listModel.parent;
            }
            menu1.parent = cc.find('Canvas');
        };
        function packgeError () {
            alert('失败');
        };
        cc.weijifen.http.httpGet('/package_goods/gain/' + cc.weijifen.authorization,packageSucces,packageSucces)
    }
});
