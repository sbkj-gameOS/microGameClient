/*
* @主菜单页（gameMain场景）
*/
var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        matchParent: cc.Prefab,
        matchListPrefab: cc.Prefab,
        detailMatch: cc.Prefab
    },
    onLoad: function () {
        
    },
    /*
    * 获取房卡
    */
    getRoomCards: function () {
        let token = {token:cc.weijifen.authorization};
        cc.weijifen.http.httpPost('/match/matchNum',token,this.getListSuccess,this.getListErr,this) ;            
    },
    getRoomSuccess: function (res,obj) {
        let fangka = cc.find('Canvas/main/matchhall/top/fangka').children[0];
        fangka.getComponent(cc.Label).string = res.weekNo1;
    },
    getRoomErr: function (res,obj) {
        this.alert(res.msg);
    },
    /*
    * 获取比赛列表
    *
    */
    getMatchList: function () {
        let token = {token:cc.weijifen.authorization};
        cc.weijifen.http.httpPost('/match/getMatchList',token,this.getListSuccess,this.getListErr,this) ;            
    },
    /*
    * activiteType值为2，日赛；4为月赛
    */
    getListSuccess: function (res,obj) {
        let time,fenNode,miaoNode;
        let parent_ri = cc.find('Canvas/menu/createroom/background1/toggleGroup').children[1].children[1].children[0]//matchhall
        let parent_yue = cc.find('Canvas/menu/createroom/background1/toggleGroup').children[2].children[1].children[0]//matchhall        
        cc.weijifen.matchNodeArr[2] = parent_ri;
        cc.weijifen.matchNodeArr[4] = parent_yue;
        let data = JSON.parse(res);
        for (let ele of data.matchList) {
       /* let arr = [1,2,3,4,5,6,7,8,9]
        for (let ele of arr) {*/

            let list = cc.instantiate(obj.matchListPrefab);
            let entryConditions = JSON.parse(ele.entryConditions);
            let prizeData = JSON.parse(ele.prizeData);// 名次
            list.getChildByName('data').getComponent(cc.Label).string = JSON.stringify(ele);
            list.getChildByName('label').children[0].getComponent(cc.Label).string = ele.activiteName;
            list.getChildByName('label').children[1].getComponent(cc.Label).string = entryConditions[0].name;
            if (prizeData.length) {
                list.getChildByName('jiangjin').children[0].getComponent(cc.Label).string = prizeData[0].num;
                list.getChildByName('jiangjin').children[1].getComponent(cc.Label).string = prizeData[0].nameValue;
            }
            obj.countDown(ele.endTime,ele.startTime,list);
            console.log('type',ele.activiteType)
            if (ele.activiteType == 2) {
                list.parent = parent_ri.children[1].children[0].children[1].children[0];
            } else if (ele.activiteType == 4){
                list.parent = parent_yue.children[1].children[0].children[1].children[0];
            }
        }
    },
    getListErr: function (res,obj) {
        alert('列表失败')
    },
    /*
    * 加入比赛
    */
    joinMatch: function (event) {
        let params = {
            token: cc.weijifen.authorization,
            // activityId: 
            activityId: 20
        }
        cc.weijifen.http.httpPost('/gameAnnouncement/findAnno',params,this.joinErr,this.joinErr,this) ;            
    },
    joinSuccess: function (res,obj) {
        res.gameRoom = JSON.parse(res.gameRoom);
        parent.cc.weijifen.match.matchListOneClick(res.gameRoom);
    },
    joinErr: function (res,obj) {
        alert('加入失败');
    },
    matchType: function (type) {
        if (type == 'risai') {
            this.getMatchList();
        } else if (type == 'yuesai') {
            alert('p')
        }
    },
    /*
    * 到比赛详情
    * @param data 单个比赛列表的所有数据
    */
    goDetail: function (event) {
        let node = cc.instantiate(this.detailMatch);
        let listData = event.currentTarget.getChildByName('data').getComponent(cc.Label).string;
        let data = JSON.parse(listData);

        if (data.activiteType == 2) {
            node.parent = cc.weijifen.matchNodeArr[2];
        } else {
            node.parent = cc.weijifen.matchNodeArr[4];

        }

        // node.parent = cc.weijifen.matchNodeArr[0];
    },
    closeDetail: function () {
        let detail_match = cc.find('Canvas/main/matchhall/detail_match');
        detail_match.destroy();
    },
    /*
    * 比赛倒计时
    * @param list 比赛列表的父节点
    */
    countDown: function (endTime,startTime,list) {
        let times = new Date(endTime).getTime() - new Date().getTime();
        var timer=null;
        var fenNode = list.getChildByName('time').getChildByName('f').getComponent(cc.Label);
        var miaoNode = list.getChildByName('time').getChildByName('m').getComponent(cc.Label);
        if(times<=0){
            clearInterval(timer);
        }
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        timer=setInterval(function(){
            if(times > 0){
                day = Math.floor(times / (60 * 60 * 24));
                hour = Math.floor(times / (60 * 60)) - (day * 24);
                minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            times--;
            fenNode.string = minute;
            miaoNode.string = second;
        },1000);
    },
    /*
    * 退出游戏大厅
    */
    outMatchHall: function () {
        let matchNode = cc.find('Canvas/main/matchhall');
        let lists = cc.find('Canvas/main/matchhall/bottom_list/lists/view/content').children;
        matchNode.active = false;
        for (let ele of lists) {
            ele.destroy();
        }
    }

});








 