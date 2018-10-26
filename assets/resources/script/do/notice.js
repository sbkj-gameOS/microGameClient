var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        count:cc.Node,
        listItem:cc.Node,
        prizeCount:cc.Node,
        prizeItem:cc.Node
    },

    onLoad () {
        var self = this;
        // cc.weijifen.authorization = "a17872f265004430b3fb5268288b1af9";
        //获取通知列表标题
        cc.weijifen.http.httpGet('/gameNotice/findActivityListGame?token='+cc.weijifen.authorization,this.noticeSuccess,this.rankingError,this);
    },
    noticeSuccess (res,object){
        res = JSON.parse(res);
        //遍历中奖信息通知
        for (let i = 0;i < res.prizeList.length;i++) {
            let list = cc.instantiate(object.listItem);
            list._name = "zj:"+res.prizeList[i].id;
            list.active = true;
            list.getChildByName('text').getComponent(cc.Label).string = res.prizeList[i].prizeName;
            list.parent = object.count;
        }

        //比赛信息通知
        for (let i = 0;i < res.list.length;i++) {
            let list = cc.instantiate(object.listItem);
            list._name = "bs:"+res.list[i].id;
            list.active = true;
            list.getChildByName('text').getComponent(cc.Label).string = res.list[i].activiteName;
            list.parent = object.count;
        }

        //其他通知
        for (let i = 0;i < res.userMessList.length;i++) {
            let list = cc.instantiate(object.listItem);
            list._name = "other:"+res.userMessList[i].id;
            list.active = true;
            list.getChildByName('text').getComponent(cc.Label).string = res.userMessList[i].prizeName;
            list.parent = object.count;
        }

        var listOne = cc.find("Canvas/menu/notice/left/New ScrollView/view/content/New ToggleContainer").children[1];
        //第一个设置为选中
        listOne.getComponent(cc.Toggle).isChecked = true;
        ;
        var json = {node:{name:listOne.name}};
        object.getDetailClick(json);
    },
    //点击左侧标题响应右边内容
    getDetailClick (target){
        var list = target.node.name.split(":");
        var goUrl= "",json = {},self = this;
        if(list[0] == "zj" || list[0] == "other"){
            goUrl = "/gameNotice/getPrizePage";//获奖信息、通知消息
            json.token = cc.weijifen.authorization;
            json.pirzeId = list[1];
        }else if(list[0] == "bs"){
            goUrl = "/gameNotice/getActivityPage";//比赛信息
            json.token = cc.weijifen.authorization;
            json.activityId = list[1];
        }
        cc.weijifen.http.httpPost(goUrl,json,function(res,object){
            let data = JSON.parse(res);
            if (data.success) {
            	cc.weijifen.prizeData = 0;
                //点击的标题信息如果是中奖信息或者其他信息
                if(list[0] == "zj" || list[0] == "other"){
                    cc.find("Canvas/menu/notice/right/ScrollView/view/content/prize").active = true;
                    cc.find("Canvas/menu/notice/right/ScrollView/view/content/bs").active = false;
                    var prizeData = data.prize;
                    var prizeContent = cc.find("Canvas/menu/notice/right/ScrollView/view/content/prize");
                    //渲染标题
                    prizeContent.getChildByName("title").getComponent(cc.Label).string = prizeData.prizeName;
                    //渲染内容
                    prizeContent.getChildByName("content").getComponent(cc.Label).string = prizeData.prizeContent;
                    //渲染时间
                    prizeContent.getChildByName("time-input").getComponent(cc.Label).string = self.getNowFormatDate(prizeData.createTime);
                    if(prizeData.isPrize == 0){
                        prizeContent.getChildByName("getPrizeBtn").active = true;
                    }else{
                        prizeContent.getChildByName("getPrizeBtn").active = false;
                    }
                    prizeContent.getChildByName("id").getComponent(cc.Label).string = prizeData.id;//领奖按钮的名称更改为id
			
					
                    //如果不是中奖信息  报名成功等信息
                    if(list[0] == "other"){
                        prizeContent.getChildByName("time").getComponent(cc.Label).string = "获得时间：";
                        //奖项标题隐藏
                        prizeContent.getChildByName("getPrizeBtn").active = false;
                        //奖项内容隐藏
                        prizeContent.getChildByName("prize").active = false;
                    }else if(list[0] == "zj"){
                    	cc.weijifen.prizeData = data.prizeData;
                    	prizeContent.getChildByName("prize").active = true;
                    	var prizeText = "";
						prizeContent.getChildByName("prize").children[0].children[data.prizeData.did].active = true;
						if(data.prizeData.did == 1){
							prizeText = " x" + data.prizeData.count + "张";
							prizeContent.getChildByName("prize").children[0].children[4].active = false;
						}else if(data.prizeData.did == 4){
							prizeText += " ￥" + data.prizeData.count + "元";
							prizeContent.getChildByName("prize").children[0].children[1].active = false;
						}
						prizeContent.getChildByName("prize").children[0].children[0].active = true;
	                    prizeContent.getChildByName("prize").children[0].children[0].getComponent(cc.Label).string = prizeText;
                    }
                }else if(list[0] == "bs"){//标题信息为比赛内容
                    var activity = data.activity;
                    //中奖信息·其他信息内容隐藏
                    cc.find("Canvas/menu/notice/right/ScrollView/view/content/prize").active = false;
                    var bs = cc.find("Canvas/menu/notice/right/ScrollView/view/content/bs");
                    bs.active = true;//比赛内容content显示
                    bs.getChildByName("title").getComponent(cc.Label).string = activity.activiteName;
                    //渲染内容
                    bs.getChildByName("content").getComponent(cc.Label).string = activity.activiteContent;
                    //开始时间
                    bs.getChildByName("startTime").getComponent(cc.Label).string = activity.startTime+"~"+activity.endTime;
                    if(activity.bmStartTime){//报名时间有值
                        bs.getChildByName("bmTime").getComponent(cc.Label).string = activity.bmStartTime+"~"+activity.bmEndTime;
                    }else{
                        //报名时间为null
                        bs.getChildByName("bmTime").active = false;//隐藏报名时间标题
                        bs.getChildByName("bmTimeTitle").active = false;//隐藏报名时间
                    }

                    //报名条件和参赛条件
                    var entryConditions = JSON.parse(activity.entryConditions);
                    for(var i = 0; i < entryConditions.bmtj.length; i++){
                        var name = "",dataCon = "";
                        if(entryConditions.bmtj[i].type == 1){
                            name = "VIP用户  ";
                        }else{
                            name = "会员      ";
                        }
                        if(entryConditions.bmtj[i].data){
                            dataCon = entryConditions.bmtj[i].data.startTime + "~" + entryConditions.bmtj[i].data.endTime + " 约局次数："+entryConditions.bmtj[i].data.count;
                        }
                        bs.getChildByName("bmtj").children[i].getComponent(cc.Label).string = name + dataCon;
                    }
                    //参赛条件
                    for(var i = 0; i < entryConditions.csTj.length; i++){
                        var name = "",dataCon = "";
                        if(entryConditions.csTj[i].type == 0){
                            name = "房卡";
                        }else{
                            name = "月赛卡";
                        }
                        if(entryConditions.csTj[i].data){
                            dataCon = "x"+entryConditions.csTj[i].data.roomCard;
                        }
                        bs.getChildByName("cstj").children[1].getComponent(cc.Label).string = name + dataCon+"、";
                    }
                    self.prizeCount.removeAllChildren();
                    //渲染奖品数据
                    var prizeData = JSON.parse(activity.prizeData);
                    for(var i = 0; i < prizeData.length;i++){
                        let list = cc.instantiate(self.prizeItem);
                        list.active = true;
                        list.getChildByName('title').getComponent(cc.Label).string = "第"+prizeData[i].num+"名";
                        list.getChildByName('con').getComponent(cc.Label).string = prizeData[i].nameValue;
                        list.parent = self.prizeCount;
                    }
                }

            }
        },self.err,self);
        
    },
    //领奖
    getPrize(target){
        var id = target.target._parent.getChildByName("id").getComponent(cc.Label).string;
        target.target.active = false;
        var self = this;
        cc.weijifen.http.httpPost("/gameNotice/getPrize",{token:cc.weijifen.authorization,prizeId:id},function(res,object){
            res = JSON.parse(res);
            if(res.success){
                self.alert("已领取");
                if(cc.weijifen.prizeData != 0){
                	//领取奖品信息为房卡时，更新全部房卡渲染数据
                	if(cc.weijifen.prizeData.did == 1){
                		var oldCard = cc.find("Canvas/main/head/5/num").getComponent(cc.Label).string;
                		cc.find("Canvas/main/head/5/num").getComponent(cc.Label).string = parseInt(oldCard) + parseInt(cc.weijifen.prizeData.count);
                		cc.weijifen.user.cards = parseInt(oldCard) + parseInt(cc.weijifen.prizeData.count);
                	}
                }
            }else{
                target.target.active = true;
            }
        },self.err,self);   
    },
    getNowFormatDate(datetime) {
        var date = new Date(datetime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    }
});
