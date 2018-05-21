/*
* 比赛
*/
var WJFCommon = require("WJFCommon");
var wfj = new WJFCommon();
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
        let data = JSON.parse(res);
        alert(data.msg)
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
        let flag;
        let parent_ri = cc.find('Canvas/menu/createroom/background1/toggleGroup').children[1].children[1].children[0]//matchhall
        let parent_yue = cc.find('Canvas/menu/createroom/background1/toggleGroup').children[2].children[1].children[0]//matchhall        
        cc.weijifen.matchNodeArr[2] = parent_ri;
        cc.weijifen.matchNodeArr[4] = parent_yue;
        let data = JSON.parse(res);
        if (data.matchList.length) flag = false;
        if (flag) return;

        for (let ele of data.matchList) {
       /* let arr = [1,2,3,4,5,6,7,8,9]
        for (let ele of arr) {*/

            let list = cc.instantiate(obj.matchListPrefab);
            let entryConditions = JSON.parse(ele.entryConditions);
            let prizeData = JSON.parse(ele.prizeData);// 名次
            list.getChildByName('data').getComponent(cc.Label).string = JSON.stringify(ele);
            list.getChildByName('label').children[0].getComponent(cc.Label).string = ele.activiteName;
            list.getChildByName('label').children[1].getComponent(cc.Label).string = entryConditions[0].name;
            list.getChildByName('kaijurenshu').children[0].getComponent(cc.Label).string = ele.userNum + '人';
            if (prizeData.length) {
                list.getChildByName('jiangjin').children[0].getComponent(cc.Label).string = '第' + prizeData[0].num + '名';
                list.getChildByName('jiangjin').children[1].getComponent(cc.Label).string = prizeData[0].nameValue;
            }
            if (ele.activiteType == 2) {
                let pa = parent_ri.children[1].children[0].children[1].children[0];
                pa.getChildByName('no_data').active = false;
                list.parent = pa;
            } else if (ele.activiteType == 4){
                let pa = parent_yue.children[1].children[0].children[1].children[0];
                pa.getChildByName('no_data').active = false;
                list.parent = pa;
            }
        }
    },
    getListErr: function (res,obj) {
        let data = JSON.parse(res);
        wfj.alert(data.msg)
    },
    /*
    * 加入比赛
    */
    joinMatch: function (event) {
        let matchJs = event.target.parent.getComponent('match');
        let listData = event.target.parent.getChildByName('data').getComponent(cc.Label).string;
        let data = JSON.parse(listData);
        let params = {
            token: cc.weijifen.authorization,
            activityId: data.id
        }
        cc.weijifen.http.httpPost('/match/codeMatch',params,this.joinSuccess,this) ;            
    },
    joinSuccess: function (res,obj) {
        var res = JSON.parse(res);
        if (!res.success) {
            wfj.alert(res.msg)
            return
        }
        let h5CallCo = require('h5CallCocos');
        let toMjSence = new h5CallCo();  
        toMjSence.matchListOneClick(res);
    },
    closeDetail: function () {
        let detail_match = cc.find('Canvas/menu/detail_match');
        detail_match.destroy();
        cc.sys.localStorage.removeItem('activityId');
    },
    /*
    * 报名
    */
    signUp: function () {
        let activityId = cc.sys.localStorage.getItem('activityId');
        let params = {
            token: cc.weijifen.authorization,
            // activityId: activityId
            activityId: activityId
        }
        cc.weijifen.http.httpPost("/gameNotice/saveUserActivity",params,function(data){
            let data1 = JSON.parse(data);
            if (data1.success) {
                wfj.alert('报名成功!');
            } else {
                wfj.alert(data1.msg);
            }
        });
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
    },
    /*
    * 比赛详情页tab切换
    */
    detail_tab: function (event) {
        let mainBox = event.node.parent.parent.getChildByName('main').children;//底部切换主体
        let idx = parseInt(event.node.name);
        mainBox[idx].active = true;
        idx ? mainBox[0].active = false : mainBox[1].active = false;
    }
});








  