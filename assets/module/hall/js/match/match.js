/*
* 比赛
*/
var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        matchParent: cc.Prefab,
        matchListPrefab: cc.Prefab,
        detailMatch: cc.Prefab,
        jinagli: cc.Node,
        timeNode:cc.Label,
        roomCard:cc.Label
    },
    onLoad: function () {
        this.btnSelectData = 2;

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
    getMatchList: function (event,data) {
        if (event.target.name == 9 && cc.weijifen.GameBase.gameModel != 'ch') {
            return;
        }
        //定时器每秒更新下时间
        setInterval(function(){
            var date=new Date();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if(hour >= 0 && hour <= 9){
                hour = "0"+hour;
            }
            if(minutes >= 0 && minutes <= 9){
                minutes = "0"+minutes;
            }
            if(seconds>= 0 && seconds <= 9){
                seconds = "0"+seconds;
            }
            cc.find("Canvas/match/title/left/time").getComponent(cc.Label).string = hour+":"+minutes+":"+seconds;
            cc.find("Canvas/match/title/right/card/roomCard").getComponent(cc.Label).string = cc.weijifen.roomCard;
        },1000);

        var json = [{"type":"2","value":"日赛"},{"type":"4","value":"月赛"}];
        for(var i = 0; i < json.length; i++){
            var leftBtnList = cc.find("Canvas/match/count/leftbtn");
            let list = cc.instantiate(leftBtnList);
            if(i == 0){
                list.children[0].active = true;
                list.setPosition(0,-60);
            }else{
                list.children[1].active = true;
                var y = -60 -(i*114);
                list.setPosition(0,y);
            }
            list.getChildByName("text").getComponent(cc.Label).string = json[i].value;
            list.getChildByName("type").getComponent(cc.Label).string = json[i].type;
            var parent = cc.find("Canvas/match/count/left/background-left/btnList/view/content");
            list.parent = parent;
        }
        this.listdata = cc.find("Canvas/match/count/right/background-right/lists/view/content");
        this.getListData();  
    },
    leftBtnListOne:function(event){
        var btnlist = event.target.parent.children;
        for(var i = 0; i < btnlist.length;i++){
            if(btnlist[i].getChildByName("type").getComponent(cc.Label).string == this.btnSelectData){
                btnlist[i].children[0].active = false;
                btnlist[i].children[1].active = true;
            }
        }
        event.target.children[1].active = false;
        event.target.children[0].active = true;
        this.btnSelectData = event.target.getChildByName("type").getComponent(cc.Label).string;
        this.getListData();
    },
    getListData:function(){
        let token = {token:cc.weijifen.authorization};
        cc.weijifen.http.httpPost('/match/getMatchList',token,this.getListSuccess,this.getListErr,this) ;
    },
    /*
    * activiteType值为2，日赛；4为月赛
    */
    getListSuccess: function (res,object) {
        let flag;   
        let data = JSON.parse(res);
        if (data.matchList.length) flag = false;
        if (flag) return;
        for (let ele of data.matchList) {
            let list = cc.instantiate(object.matchListPrefab);
            let entryConditions = JSON.parse(ele.entryConditions);
            let prizeData = JSON.parse(ele.prizeData);// 名次
            list.getChildByName('data').getComponent(cc.Label).string = JSON.stringify(ele);// 每个比赛信息
            var listOne = list.getChildByName('background-join');
            // 活动名称
            listOne.getChildByName('leftName').children[0].getComponent(cc.Label).string = ele.activiteName;
            // 开赛时间
            listOne.getChildByName('leftName').children[1].getComponent(cc.Label).string = ele.startTime;
            //开赛人数
            listOne.getChildByName('people').children[1].getComponent(cc.Label).string = ele.userNum + '人';
            if (prizeData.length) {//比赛奖励
                listOne.getChildByName('prize').children[0].getComponent(cc.Label).string = '第' + prizeData[0].num + '名';
                listOne.getChildByName('prize').children[1].getComponent(cc.Label).string = prizeData[0].nameValue;
            }
            var parent = cc.find("Canvas/match/count/right/background-right/lists/view/content");
            list.parent = parent;
            parent.getChildByName('no_data').active = false;
        }
    },
    getListErr: function (res,obj) {
        let data = JSON.parse(res);
        obj.alert(data.msg)
    },
    /*
    * 加入比赛
    */
    joinMatch: function (event) {
        let matchJs = event.target.parent.parent.parent.children[1].getComponent('match');
        let listData = event.target.parent.parent.getChildByName('data').getComponent(cc.Label).string;
        // 当前比赛信息存放在缓存中
        cc.sys.localStorage.setItem('matchData',listData);
        let data = JSON.parse(listData);
        let params = {
            token: cc.weijifen.authorization,
            activityId: data.id
        }
        cc.weijifen.http.httpPost('/match/codeMatch',params,this.joinSuccess,this.joinErr,this) ;            
    },
    joinSuccess: function (res,obj) {
        var res = JSON.parse(res);
        // cc.sys.localStorage.setItem('matchTime',res.statrtSec);//比赛开始的毫秒数
        cc.weijifen.matchTime = res.statrtSec;
        // 玩家没有报名，跳转到详情页报名
        if (!res.success) {
            obj.alert(res.msg);

            let menuToggle = cc.find('Canvas/js/menuToggle');
            let me = menuToggle.getComponent('menuToggle');
            me.openMatchDetail(obj.node.getComponent('match'));
            setTimeout(function () {
                obj.closealert();
            },2000)
            return
        }
        let h5CallCo = require('h5CallCocos');
        let toMjSence = new h5CallCo();  
        toMjSence.matchListOneClick(res);
    },
    joinErr: function (res) {
        let data = JSON.parse(res);
        obj.alert(data.msg);
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
        var obj = this;
        let activityId = cc.sys.localStorage.getItem('activityId');
        let params = {
            token: cc.weijifen.authorization,
            // activityId: activityId
            activityId: activityId
        }
        cc.weijifen.http.httpPost("/gameNotice/saveUserActivity",params,function(data){
            let data1 = JSON.parse(data);
            if (data1.success) {
                obj.alert('报名成功!');
            } 
        },function(data){
            obj.alert(data1.msg);
        },obj);
    },
    /*
    * 退出比赛大厅
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
    },
      /*打开注意事项*/
    openTips: function () {
        cc.find('Canvas').getChildByName('matchTip').zIndex = 1000000000;
        cc.find('Canvas').getChildByName('matchTip').active = true;
    },
    closeTips: function () {
        cc.find('Canvas').getChildByName('matchTip').active = false;
    },
    closeBtn:function(){
        cc.find('Canvas/match').destroy();
    }
});








  