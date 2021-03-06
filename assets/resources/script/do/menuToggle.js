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
        activityMenu: cc.Prefab,
        situationMenu: cc.Prefab,
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
            var content = menu.getChildByName('main').children[0].children[0].children[0];// 概述后代元素---content
            var rewardTxt = menu.getChildByName('main').children[1].children[0].children[0];// 奖励下的后代元素---content
            cc.sys.localStorage.setItem('activityId',data1.id);
            // 报名费用
            // data1.entryConditions = JSON.stringify({"bmtj":[{"type":"2","data":{"startTime":"2018-09-01","endTime":"2018-09-30","count":"0"}},{"type":"1"}],"csTj":[{"type":"0","data":{"roomCard":"5"}},{"type":"1","data":{"roomCard":"1"}}]});
            // data1.entryConditions = JSON.stringify({"bmtj":[{"type":"2"}],"csTj":[{"type":"0","data":{"roomCard":"5"}},{"type":"1","data":{"roomCard":"1"}}]});
            
            if (data1.entryConditions) {
                var bmtj;
                var conditions = content.children[0];
                var entryConditions = JSON.parse(data1.entryConditions);
                var name =  '';
                let m = -1;
                /*for (var ele of entryConditions) {
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
                }*/
                // 报名条件
                if (entryConditions.bmtj) { 
                    if (entryConditions.bmtj.length == 1) {
                        conditions.children[2].y = -30;
                        conditions.children[3].y = -30;
                    }
                    let bmStr = '';
                    for (let ele of entryConditions.bmtj) {
                        if (ele.type == 1) {// vip 
                            conditions.children[2].getComponent(cc.Label).string = 'VIP用户 ';
                        } else {// 普通
                            let str = '';
                            if (ele.data) {
                                if ((ele.data.startTime || ele.data.endTime) && ele.data.count != undefined) {
                                    str = '会员 ' + ele.data.startTime + '至' + ele.data.endTime + ',' + '约局次数:' + ele.data.count ;
                                } else if (ele.data.count == undefined || ele.data.count) {
                                    str = '会员 ' + ele.data.startTime + '至' + ele.data.endTime ;
                                }
                            } else {
                                str = '会员';
                            }
                            conditions.children[3].getComponent(cc.Label).string = str;
                        }
                    }
                }
                 // 参赛条件
                if (entryConditions.csTj) { 
                    let bmStr = '';
                    for (let ele of entryConditions.csTj) {
                        if (ele.type == 0 && ele.data) {// 房卡
                            bmStr += '房卡X' + ele.data.roomCard + ',';
                        } else {// 月赛卡
                            if (ele.data) {
                                let str = '月赛卡X' + ele.data.roomCard + ',';
                                bmStr += str;
                            }
                        }
                    }
                    content.getChildByName('cstj').children[2].getComponent(cc.Label).string = bmStr;
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
                        reward.children[2].getComponent(cc.Sprite).spriteFrame = self.alts.getSpriteFrame('ranking1');
                    } else if (i == 1) {
                        reward.children[2].getComponent(cc.Sprite).spriteFrame = self.alts.getSpriteFrame('ranking2');
                    } else if (i == 2) {
                        reward.children[2].getComponent(cc.Sprite).spriteFrame = self.alts.getSpriteFrame('ranking3');
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
    * 更多功能
    */
    moreClick(e) {
    	const moreNode = e.target.getChildByName('moreNode');
    	moreNode.active = !moreNode.active;
    	// console.log(.active);
    },
    /*
    * 背包功能
    */
    packageMenu: function(){
        let self = this;
        let menu1 = cc.instantiate(self.packgeMenu);
        menu1.parent = cc.find('Canvas');
        //数据加载图显示
        cc.find("Canvas/packge_menu/main/view/data/load").active = true;
        cc.find("Canvas/packge_menu/main/view/data/loaddata").active = true;
        function packageSucces (res) {
            let data = JSON.parse(res);
            let listModel = menu1.getChildByName('main').children[0].children[0].getChildByName('listModel');
            let isNullData = false;
            if(data.packageGoods.length > 0){
                for (let ele of data.packageGoods) {
                    let model = cc.instantiate(listModel);
                    if (ele.type == 'COUPON') {
                        // 优惠券
                        model.children[0].children[0].getChildByName('linkedNum').getComponent(cc.Label).string = ele.linkedId;
                        model.children[0].children[0].getChildByName('couponMsg').getComponent(cc.Label).string = '满' + ele.faceValue + '减' + ele.linkedId;
                    } else if(ele.type == 'MONTHRACINGCARD') {
                        if (ele.num < 1) {break}
                        model.children[0].children[0].active = false;//优惠卷样式隐藏
                        model.children[0].getChildByName('month').active = true;
                    }else{//日赛卡
                        if (ele.num < 1) {break}
                        model.children[0].children[0].active = false;//优惠卷样式隐藏
                        model.children[0].getChildByName('day').active = true;
                    }
                    model.children[0].getChildByName('useEndTime').getComponent(cc.Label).string = self.timestampToTime(ele.useEndTime,2) + '过期';
                    model.children[2].getComponent(cc.Label).string = 'x' + ele.num;
                    model.active = true;
                    model.parent = listModel.parent;
                    isNullData = true;
                }
            }else{
                cc.find("Canvas/packge_menu/main/view/data/loaddata").active = false;
                cc.find("Canvas/packge_menu/main/view/data/nulldata").active = true;
            }
            

            if(isNullData){
                cc.find("Canvas/packge_menu/main/view/data").active = false;
            }
        };
        function packgeError () {
            self.alert('失败');
        };
        // cc.weijifen.authorization = "90c4fbbeafd24c78a71ce2750629f7f5";
        cc.weijifen.http.httpGet('/package_goods/gain/' + cc.weijifen.authorization,packageSucces,packgeError);
    }
});
