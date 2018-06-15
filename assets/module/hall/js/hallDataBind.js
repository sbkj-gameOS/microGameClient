/*
* @主菜单页（gameMain场景）
*/
var WJFCommon = require("WJFCommon");

cc.Class({
    extends: WJFCommon,

    properties: {
        username: {
            default: null,
            type: cc.Label
        },
        goldcoins: {
            default: null,
            type: cc.Label
        },
        cards: {
            default: null,
            type: cc.Label
        },
        headimg:{
            default:null,
            type:cc.Node
        },     
        message:{
			default: null,
            type: cc.Label
		},
		backRoomImg:{
			default:null,
			type:cc.SpriteFrame
        },  
        backRoom: cc.Node,
        chJoinRoomImg:{
            default:null,
            type:cc.SpriteFrame
        },  
        noticePrefab: cc.Prefab,
        matchNode: {
            default: null,
            type: cc.Node
        },
        headBorder: cc.SpriteAtlas
    },
    onLoad: function () {
        //如果weijifen已经加载好了
        if(this.ready()){   
            if (cc.weijifen.gongaoAlertNum || cc.weijifen.gongaoAlertNum == undefined) {
                cc.weijifen.http.httpGet('/gonggaoGame/queryGonGaoUrl?token='+cc.weijifen.authorization,this.noticeSuccess,this.noticeError,this);
            }
            // 牌局类型
            if (cc.weijifen.GameBase.gameModel == 'ch') {
                //获取要更换的图片
                var object = this.chJoinRoomImg;
                //获取更换图片地址
                var sprite = cc.find("Canvas/main/game/11").getComponent(cc.Sprite);
                //图片地址内的图片路径 = 要更换的图片路径
                sprite.spriteFrame = object;
            }
            if (cc.weijifen.GameBase.gameModel != 'ch') {
                cc.find('Canvas/main/menu/top/logo').active = false
            }


            //重置分享按钮的设置
            if(cc.weijifen.browserType=="wechat"){
                cc.weijifen.WXorBlow.shareRoom();
            }   
            //如果有这个变量代表之前有充值 且充值成功
            if(cc.weijifen.paystatus){
                if( cc.weijifen.paystatus=='true'){
                    this.alert('充值成功');
                    cc.weijifen.paystatus = null;
                }else{
                    this.alert('充值失败');
                    cc.weijifen.paystatus = null;
                }  
            };
            //玩家名字 没有时设置为游客
			if(cc.weijifen.user.nickname == null || cc.weijifen.user.nickname == ""){
				cc.weijifen.user.nickname = "游客_"+Date.parse(new Date());
			}

            // this.username ? this.username = {} : this.username={};
            //
            this.username.string = cc.weijifen.user.nickname;
            //玩家头像
			this.headImg(this.headimg,cc.weijifen.user.headimgurl,true);

            // 玩家头像边框
            cc.weijifen.http.httpGet('/userInfo/query/vip/level/'+cc.weijifen.authorization,this.headBorderSuccess,this.headBorderErr,this);

            // this.cards.string = cc.weijifen.user.cards + "张" ;
            // this.goldcoins.string = cc.weijifen.user.goldcoins + '个';
            //请求获取当前用户是否已经参加了房间
            cc.weijifen.http.httpGet('/api/room/reConnection?token='+cc.weijifen.authorization,this.roomSuccess,this.roomError,this);

            cc.weijifen.http.httpGet('/api/room/queryRoomCard?token='+cc.weijifen.authorization,this.cardsucess,this.carderror,this);
            this.gundongText();
            //获取是否有新的通知
            // cc.weijifen.http.httpGet('/activity/findActivityListGame?token='+cc.weijifen.authorization,this.tzsucess,this.tzerror,this);  
            cc.weijifen.http.httpGet('/gameAnnouncement/findAnno?token='+cc.weijifen.authorization,this.tzsucess,this.tzerror,this) ;            

        }

        var self = this ;
        cc.weijifen.iPayBack = function(result) {
            result = encodeURIComponent(result);
            cc.weijifen.http.httpGet('/ipay/checkSign?sign='+result,self.signSucess,self.signError,self);
        };
        // 点击分享卡片进入房间
        cc.weijifen.shareData = function(roomNum){
            let inputNumJs = require("inputNum");
            let input = new inputNumJs();
            roomNum.length == 6 ? input.click(roomNum)
                                : self.alert('进入房间失败！');
        }
    },
    /*
    * 玩家等级判定，根据等级显示不同的头像框
    */
    headBorderSuccess: function (res,obj) {
        var data = JSON.parse(res);
        if (data.vip == undefined) {return};
        var headBorder = cc.find("Canvas/main/head").children[1].getComponent(cc.Sprite);//头像框节点Sprite组件
        // vip是玩家等级，2-普通vip（充值177元）
                      // 1、下级有1777人
                      // 0、下级有17777人
        cc.weijifen.level = data.vip;
        // cc.weijifen.level = 0;

        if (data.vip == 2) {
            headBorder.spriteFrame = obj.headBorder.getSpriteFrame('333333333');//充值
            return
        } 
        if (data.vip == 1) {
            headBorder.spriteFrame = obj.headBorder.getSpriteFrame('111111111');//前人
            return
        } 
        if (data.vip == 0) {
            headBorder.spriteFrame = obj.headBorder.getSpriteFrame('222222');//万人
            return
        } 
    },
    headBorderErr: function (res,obj) {

    },
    carderror: function(result,object){
        // this.alert('充值失败');
    },
    cardsucess:function(result,object){
        var data = JSON.parse(result) ;
        var mainUserCards = cc.find("Canvas/main/head/5/num").getComponent(cc.Label);
        mainUserCards.string = data.cards;
        cc.weijifen.user.cards = data.cards;
        object.cards.string = cc.weijifen.user.cards ;
        object.goldcoins.string = cc.weijifen.user.goldcoins;

    },
    signSucess:function(result,object){
        //支付成功提示,重新获取用户数据刷新数据。
        if ( 'error' == result ) {
            object.alert("失败!");
        } else {
            //验证返回的签名是否正确
            cc.weijifen.http.httpGet('/api/room/queryRoomCard?token='+cc.weijifen.authorization,object.cardsucess,object.carderror,object);
            object.alert("充值成功!");
        }
    },
    signError: function(result,object){
        object.alert("失败!");
    },
    tzsucess: function(result,object){
		let data = JSON.parse(result);  
        let message = cc.find('Canvas').getComponent('hallDataBind').message;
        // if (data.context) {}
            // message = 
        data.context ? message.string = data.context : message.string = '暂无公告！';
        if(data.tz){
            object.hall(3);
        }// 通知弹框
	},
	tzerror: function(result,object){	

    },
    roomSuccess: function(result,object){
		let data = JSON.parse(result);
        if(data.room){
			object.getGame(data);
            var sprite = object.backRoom.getComponent(cc.Sprite);
        	sprite.spriteFrame = object.backRoomImg;
        } else {
            //有值代表用户是通过分享进入的游戏
            if(cc.weijifen.shareRoomNum){
                var inputNum = require("inputNum");
                inputNum = new inputNum();
                inputNum.click(cc.weijifen.shareRoomNum);
            }else{
                cc.weijifen.room = null;
            }
		}
    },
    roomError: function(object){
        object.alert("网络异常");
    },
	//滚动公告字幕
	gundongText:function(){
        //
		var self = this;
        var text = self.message;
        var width = self.message.node.parent.width;
        text.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(text.node.width/width*10,cc.p(-text.node.width-width/5,text.node.y)),
            cc.callFunc(function(){
                text.node.x = width;
            })
        )),1000);	
	},
	//创建包厢
	createRoom:function(){
        //当前玩家不存在未结束的游戏   
		if(cc.weijifen.room !='null' &&cc.weijifen.room != null){
			cc.director.loadScene('majiang');// 通过场景名加载场景
		}else{
			this.hall(11);
		}		
	},
	//加入包厢
	joinInRoom:function(){
        this.hall(10);
		/*if(cc.weijifen.room !='null' &&cc.weijifen.room != null){
			cc.director.loadScene('majiang');
		}else{
            cc.director.loadScene('majiang');
			// this.hall(10);
      	}*/
	},
    /* 游戏公告
    * @param 
    */
    noticeSuccess: function (res,object) {
        var webView,noticeNode,menu;
        var data = JSON.parse(res);
        var arrUrl = data.url.split('@@@');
        arrUrl.pop();
        cc.weijifen.gongaoAlertNum = arrUrl.length;
        if (res && res.length) {
            for (var i = 0;i < arrUrl.length;i++) {
                cc.weijifen.menu.put(cc.instantiate(object.noticePrefab));
                object.hall(15,arrUrl[i]);
            }
        }
    },
    noticeError: function (res,object) {
        object.alert('公告获取失败！');
    },
   /* matchHall: function () {
        let matchNode = this.matchNode;
        matchNode.active = true;
    }*/
    match: function () {
        // 长春麻将打开比赛大厅，其他弹出‘敬请期待’
        cc.weijifen.GameBase.gameModel == 'ch' ? this.hall(9)
                                               : this.hall(90);
        
    }
});






 