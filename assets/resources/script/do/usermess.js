var WJFCommon = require("WJFCommon");
var match_timer;
cc.Class({
    extends: WJFCommon,

    properties: {
        headimg:{
            default:null,
            type:cc.Node
        }, 
        qrcode:{
            default:null,
            type:cc.Node
        }, 
        headBorder: {
            default: [],
            type: cc.SpriteFrame,
        },
        txItem:cc.Node,
        txContent:cc.Node,
        playerItem:cc.Node,
        playerContent:cc.Node,
        userName: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

// 提款金额、总佣金额度


    onLoad () {
    	var self = this;
    	self.prceStatus = 0;
    	var imgurl = cc.weijifen.user.headimgurl;
    	if(imgurl){//渲染头像
    		let sprite = this.headimg.getComponent(cc.Sprite);
	    	cc.loader.load({url:imgurl,type:'jpg'},function(err,texture){
	            sprite.spriteFrame = new cc.SpriteFrame(texture);
	        })
        }

        var headBorder = this.headimg.parent.getComponent(cc.Sprite);
        let vipLevel = cc.sys.localStorage.getItem('vipLevel');
        // vip是玩家等级，2-普通vip（充值177元）
                      // 1、下级有1777人
                      // 0、下级有17777人
        if (vipLevel == 2) {
            headBorder.spriteFrame = self.headBorder[0];//vip
        } else if (vipLevel == 1) {
            headBorder.spriteFrame = self.headBorder[1];//千人vip
        } else if (vipLevel == 0) {
            headBorder.spriteFrame = self.headBorder[2];//万人vip
        }

        //获取房卡数据
        cc.weijifen.http.httpGet('/userInfo/getUserCard?token='+cc.weijifen.authorization,this.cardSuccess,this.userError,this);
        //获取可提现金额  总金额   好友数量数据
        cc.weijifen.http.httpGet('/presentapp/runSummary?token='+cc.weijifen.authorization,this.sumSuccess,this.userError,this);
    },
     /*退出登录*/
    changeAccount: function () {
        cc.director.loadScene('appLogin'); 
        cc.sys.localStorage.clear();
        cc.weijifen = null;
        cc.audioEngine.stopAll();
    },
    //窗口切换
    windowSwitching:function(evnet,customEventData){
    	var right = cc.find("Canvas/menu/usermess/right");
    	if(customEventData.indexOf("b") > 0){//返回按钮
    		right.getChildByName("right0").active = true;
    		var bid = customEventData.replace("b","");
    		right.getChildByName("right"+bid).active = false;
    	}else{
    		right.getChildByName("right0").active = false;
    		right.getChildByName("right"+customEventData).active = true;
    	}

    	if(customEventData == 2){//获取提现历史数据
			cc.weijifen.http.httpGet('/userInfo/queryTxListData?token='+cc.weijifen.authorization+"&status=3",this.txListSuccess,this.userError,this);
    	}else if(customEventData == 3){//获取邀请好友列表数据
    		cc.weijifen.http.httpGet('/userInfo/querChildrenList?token='+cc.weijifen.authorization,this.childrenListSuccess,this.userError,this);
    	}else if(customEventData == 5){//加载个人二维码
            var obj = this;
            if (obj.clientPlatForm() == 'ANDROID') {
                cc.weijifen.http.httpGet("/registerPlayer/getQRImage?token=" + cc.weijifen.authorization, function(res) {
                    var imgurl = res;
                    let sprite = obj.qrcode.getComponent(cc.Sprite);
                    cc.loader.load({url:imgurl,type:'jpg'},function(err,texture){
                        sprite.spriteFrame = new cc.SpriteFrame(texture);
                    })
                } , obj.error , obj);
            } else {
                var imgurl = "http://game.bizpartner.cn/registerPlayer/getEWMImage?token="+cc.weijifen.authorization;
                // var imgurl = "http://game.bizpartner.cn/registerPlayer/getEWMImage?token="+ 'c1007879917b44af8f42875add2643de';
                let sprite = obj.qrcode.getComponent(cc.Sprite);
                cc.loader.load({url:imgurl,type:'jpg'},function(err,texture){
                    sprite.spriteFrame = new cc.SpriteFrame(texture);
                })
            }
    	}
    },
    //发起提现申请
    submitTx(evnet){
    	var self = this;
    	if(self.prceStatus == 0){
    		self.prceStatus = 1;
			var right = cc.find("Canvas/menu/usermess/right/right1");
	    	var inputPrice = right.children[1].children[1].children[0].getComponent(cc.EditBox).string;
	    	if(inputPrice == null || inputPrice == "" || inputPrice == undefined){
	    		self.alert("请填写提现金额");
                self.prceStatus = 0;
	    	}else if(parseInt(inputPrice) < 10){
				self.alert("最低提现金额为10元！");
                self.prceStatus = 0;
	    	}else{
	    		cc.weijifen.http.httpPost("/presentapp/appForCash",{token:cc.weijifen.authorization,amountMoney:parseInt(inputPrice)},function(res,object){
		            res = JSON.parse(res);
		            self.prceStatus = 0;
		            if(res.success){
		                self.alert("已提现");
		            }else{
		                self.alert(res.msg);
		            }
		        },self.err,self); 
	    	}
    	}
    	
    },
    cardSuccess (res,object){
        res = JSON.parse(res);
        var mess1 = cc.find("Canvas/menu/usermess/right/right0");
        mess1.getChildByName("item1").children[1].children[0].getComponent(cc.Label).string = res.cards;//房卡
        mess1.getChildByName("item2").children[1].children[0].getComponent(cc.Label).string = res.monthCards;//月赛卡
    },
    sumSuccess (res,object){
        res = JSON.parse(res);
        object.userName.getComponent(cc.Label).string = cc.weijifen.user.nickname;
        var mess1 = cc.find("Canvas/menu/usermess/right/right0");
        if(res.data.trtProfit){
        	mess1.getChildByName("item3").children[1].children[0].getComponent(cc.Label).string = res.data.trtProfit.toFixed(2);//总佣金额度
        }

        if(res.data.amountPaid){
        	mess1.getChildByName("item4").children[1].children[0].getComponent(cc.Label).string = res.data.amountPaid.toFixed(2);//已提现总额
        }

        if(res.data.subCount){
        	mess1.getChildByName("item5").children[1].children[0].getComponent(cc.Label).string = res.data.subCount;//邀请成功好友数量
        }
        
    },
    //提现历史列表数据
    txListSuccess (res,object){
    	object.txContent.removeAllChildren();
        res = JSON.parse(res);
        for (let i = 0;i < res.list.length;i++) {
            let list = cc.instantiate(object.txItem);
            list.active = true;
            list.getChildByName('date').getComponent(cc.Label).string = object.getNowFormatDate(res.list[i].presentAppTime,1);//提现时间
            list.getChildByName('price').getComponent(cc.Label).string = res.list[i].amountMoney.toFixed(2);//提现金额
            list.getChildByName('type').getComponent(cc.Label).string = "微信";//提现方式
            res.list[i].applicationNum = res.list[i].applicationNum.substring(7,res.list[i].applicationNum.length);
            list.getChildByName('num').getComponent(cc.Label).string = "**"+res.list[i].applicationNum;//提现单号
            if(res.list[i].preState == 0){
            	res.list[i].preState= "待审核";
            }else if(res.list[i].preState == 1){
				res.list[i].preState= "已通过";
            }else if(res.list[i].preState == 2){
				res.list[i].preState= "已拒绝";
            }
            list.getChildByName('status').getComponent(cc.Label).string = res.list[i].preState;//提现状态
            list.parent = object.txContent;
        }
        //设置滚动区域高度
        object.txContent.height = object.txItem.height * res.list.length;
    },
    //邀请好友列表
    childrenListSuccess (res,object){
        res = JSON.parse(res);
        object.playerContent.removeAllChildren();
        for (let i = 0;i < res.subPlays.length;i++) {
            let list = cc.instantiate(object.playerItem);
            list.active = true;
            list.getChildByName('date').getComponent(cc.Label).string = object.getNowFormatDate(res.subPlays[i].updatetime,2);//提现时间
            list.getChildByName('nickname').getComponent(cc.Label).string = res.subPlays[i].username;//提现方式
            list.parent = object.playerContent;
        }
        //设置滚动区域高度
        object.playerContent.height = object.playerItem.height * res.subPlays.length;
    },
    getNowFormatDate(datetime,type) {
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
        if(type== 1){
        	return y + '.' + m + '.' + d;
        }else if(type == 2){
			return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        }
    }
});
