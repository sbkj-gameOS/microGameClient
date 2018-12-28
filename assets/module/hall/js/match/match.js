/*
* 比赛
*/
var WJFCommon = require("WJFCommon");
var match_timer;
cc.Class({
    extends: WJFCommon,

    properties: {
        matchParent: cc.Prefab,
        matchListPrefab: cc.Prefab,
        detailMatch: cc.Prefab,
        jinagli: cc.Node,
        timeNode:cc.Label,
        roomCard:cc.Label,
    },
    onLoad: function () {
        this.btnSelectData = 2;

    },
    /* 获取比赛列表 */
    getMatchList: function (event,data) {
        if (event.target.name == 9 && cc.weijifen.GameBase.gameModel != 'ch') {
            return;
        }
        //定时器每秒更新下时间
        match_timer = setInterval(function(){
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
            if (!cc.find('Canvas/match/title/left/time')) {
                clearInterval(match_timer);
                return
            }
            cc.find("Canvas/match/title/left/time").getComponent(cc.Label).string = hour+":"+minutes+":"+seconds;
            cc.find("Canvas/match/title/right/card/roomCard").getComponent(cc.Label).string = cc.weijifen.user.cards;
        },1000);

        // var json = [{"type":"2","value":"日赛"},{"type":"4","value":"月赛"},{"type":"5","value":"坐满开"}];
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
        this.getListData(data);  
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
        this.getListData(this.btnSelectData);
    },
    getListData:function(type){
        cc.sys.localStorage.setItem('matchType',type);
        var parent = cc.find("Canvas/match/count/right/background-right/lists/view/content");
        parent.removeAllChildren();
        let token = {token:cc.weijifen.authorization};
        // cc.weijifen.http.httpPost('/match/getMatchList',token,this.getListSuccess,this.getListErr,this) ;//获取所有列表
        cc.weijifen.http.httpPost('/match/query/list/'+type,token,this.getListSuccess,this.getListErr,this) ;
    },
    /*
    * activiteType值为2，日赛；4为月赛
    */
    getListSuccess: function (res,object) {

        let flag;   
        let data = JSON.parse(res);
        if (!data.success) return;
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
            // 已报名人数
            // listOne.getChildByName('signUpNum').getComponent(cc.Label).string = ele.signUpNum;
            //开赛人数
            listOne.getChildByName('people').children[1].getComponent(cc.Label).string = ele.signUpNum + '/' +ele.userNum + '人';
            if (prizeData.length) {//比赛奖励
                listOne.getChildByName('prize').children[0].getComponent(cc.Label).string = '第' + prizeData[0].num + '名';
                listOne.getChildByName('prize').children[1].getComponent(cc.Label).string = prizeData[0].nameValue;
            }
            var parent = cc.find("Canvas/match/count/right/background-right/lists/view/content");
            list.parent = parent;
            cc.find("Canvas/match/count/right/no_data").active = false;
        }
    },
    getListErr: function (res,obj) { },
    /*
    * 加入比赛
    */
    joinMatch: function (event) {
        // 判断是否是VIP，若不是VIP则提示用户充值升级为VIP
        let self = this;
        let matchJs = cc.find('Canvas/js/match').getComponent('match');
        let listData = event.target.parent.parent.getChildByName('data').getComponent(cc.Label).string;
        // 当前比赛信息存放在缓存中
        cc.sys.localStorage.setItem('matchData',listData);
        let data = JSON.parse(listData);
        cc.sys.localStorage.setItem('activityId',data.id);
        if (cc.sys.localStorage.getItem('matchType') == 5) {
            this.signUp();
            return
        }
        let params = {
            token: cc.weijifen.authorization,
            activityId: data.id
        }
        // 判断是否时VIP，是否是VIP场
        cc.weijifen.http.httpPost('/gameNotice/check_activity_vip',params,function(res,obj){
            let data = JSON.parse(res);
            if (!data.success) {
                obj.alert(data.msg);
                return
            }
            // cc.weijifen.http.httpPost('/match/codeMatch',params,self.joinSuccess,self.joinErr,self) ;            
            cc.weijifen.http.httpPost('/match/timeWait',params,self.joinSuccess,self.joinErr,self) ;            
        },self.joinErr,self);
    },
    joinSuccess: function (res,obj) {

        if (!cc.sys.localStorage.getItem('isPlay') && cc.find('Canvas/player_head')) {
            cc.find('Canvas/player_head').destroy();
        }
        var res = JSON.parse(res);
        if (res.statrtSec)  {
            cc.sys.localStorage.setItem('matchTime',res.statrtSec);//比赛开始的毫秒数
            // 比赛开始的本地时间
            let appTimeStr = new Date().getTime();
            let appTime = new Date(appTimeStr + parseInt(res.statrtSec)).getTime();
            cc.sys.localStorage.setItem('appTime',appTime);
            // cc.sys.localStorage.setItem('matchStart','true');
            console.log('waitTime返回的时间戳---',appTime);
        }
        // cc.weijifen.matchTime = res.statrtSec;
        // 玩家没有报名，跳转到详情页报名
        if (!res.success) {
            clearTimeout(match_timer);
            obj.alert(res.msg);

            let menuToggle = cc.find('Canvas/js/menuToggle');
            if (!menuToggle) return;
            let me = menuToggle.getComponent('menuToggle');
            me.openMatchDetail(obj.node.getComponent('match'));
        } else {
            clearTimeout(match_timer);
            let h5CallCo = require('h5CallCocos');
            let toMjSence = new h5CallCo();  
            toMjSence.matchListOneClick(res);
        }
    },
    joinErr: function (res) {
        let data = JSON.parse(res);
        obj.alert(data.msg);
    },
    closeDetail: function () {
        let detail_match = cc.find('Canvas/detail_match');
        detail_match.destroy();
        cc.sys.localStorage.removeItem('activityId');
    },
    /*
    * 报名
    */
    signUp: function () {
        if (cc.sys.localStorage.getItem('matchType') == 5) {
            cc.director.loadScene('majiang');
            cc.weijifen.match = 'true';
            return
        }
        var obj = this;
        let activityId = cc.sys.localStorage.getItem('activityId');
        let params = {
            token: cc.weijifen.authorization,
            activityId: activityId
        }
        cc.weijifen.http.httpPost("/gameNotice/saveUserActivity",params,function(data){
            var data1 = JSON.parse(data);
            if (data1.success) {
                // obj.alert('报名成功!');
                cc.sys.localStorage.setItem('signUp','true');
                obj.alert(data1.msg);

                // let prizeNum = cc.sys.localStorage.getItem('prizeNum');//房卡
                let oldNum = Number(cc.find('Canvas/match/title/right/card/roomCard').getComponent(cc.Label).string);
                let prizeNum = Number(oldNum);
                if (prizeNum > 1) {
                    cc.find('Canvas/match/title/right/card/roomCard').getComponent(cc.Label).string = prizeNum - 1;
                    cc.find('Canvas/main/head/5/num').getComponent(cc.Label).string =  prizeNum - 1;
                    cc.weijifen.user.cards = prizeNum - 1;
                }
            } else {
                obj.alert(data1.msg);
            }
        },function(data1){
            // obj.alert(data1.msg);
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
        if (event.node.name == "toggle1") {
            event.node.parent.parent.getChildByName("main").children[0].active = true;
            event.node.parent.parent.getChildByName("main").children[1].active = false;
        } else {
            event.node.parent.parent.getChildByName("main").children[0].active = false;
            event.node.parent.parent.getChildByName("main").children[1].active = true;
        }
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
        clearTimeout(match_timer);
        cc.find('Canvas/match').destroy();
        cc.find('Canvas/matchTip').active = false; 
        cc.weijifen.endMatchFlag = 0;
        cc.sys.localStorage.removeItem('signUp');
        cc.sys.localStorage.removeItem('prizeNum');
        cc.sys.localStorage.removeItem('matchPrize');
        if (cc.sys.localStorage.getItem('matchData')) {
            cc.sys.localStorage.removeItem('matchData');
        }
    }
});




  