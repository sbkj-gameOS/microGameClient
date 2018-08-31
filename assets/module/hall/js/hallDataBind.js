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
		/*backRoomImg:{
			default:null,
			type:cc.SpriteFrame
        },  */
        backRoomTxt: cc.Label,
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
        headBorder: cc.SpriteAtlas,
        prizeBox: cc.Prefab
    },
    onLoad: function () {
        var self = this ;
        //如果weijifen已经加载好了
        if(this.ready()){   
            if (cc.weijifen.gongaoAlertNum || cc.weijifen.gongaoAlertNum == undefined) {
                cc.weijifen.http.httpGet('/gonggaoGame/queryGonGaoUrl?token='+cc.weijifen.authorization,this.noticeSuccess,this.noticeError,this);
            }
            // 牌局结束比赛未结束，玩家退出游戏。再次进入时，弹出上次比赛结果
            let prizeBoxData = cc.sys.localStorage.getItem('matchPrize');
            cc.sys.localStorage.removeItem('matchPrize');

            // 比赛结束后消息提示
            if (prizeBoxData) {
                let data = JSON.parse(prizeBoxData);
                let box = cc.instantiate(this.prizeBox);
                box.getChildByName('base').getChildByName('msg_box').getChildByName('match_name').children[1].getComponent(cc.Label).string = data.activityName;
                let time = data.activityTime;
                box.getChildByName('base').getChildByName('msg_box').getChildByName('match_time').children[1].getComponent(cc.Label).string = '(' + time.toString().substring(0,10) + '场)';
                box.getChildByName('base').getChildByName('msg_box').getChildByName('position').children[1].getComponent(cc.Label).string = data.position;
                box.getChildByName('base').getChildByName('msg_box').getChildByName('palyer_name').getComponent(cc.Label).string = '恭喜' + data.name + '在';
                if (data.prizeName) {
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('prize').active = true;
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('prize').children[2].getComponent(cc.Label).string = data.prizeName;
                } else {
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('num').active = true;
                    box.getChildByName('base').getChildByName('msg_box').getChildByName('num').children[0].getComponent(cc.Label).string = '第' + data.position + '名';
                }
                if (data.prizeName == '谢谢参与') {
                    box.getChildByName('base').getChildByName('getprize').active = false;   
                }

               /* // 二维码
                let img = box.getChildByName('base').getChildByName('msg_box').getChildByName('erweima');
                if(data.url){
                    var imgurl = data.url;
                    // 测试数据
                    // var imgurl = 'http://game.bizpartner.cn/registerPlayer/getEWMImage?token=5399d111b3f940c8843dd75fd6c27690';
                    var sprite = img.getComponent(cc.Sprite);
                    cc.loader.load({url:imgurl,type:'jpg'},function(suc,texture){
                        sprite.spriteFrame = new cc.SpriteFrame(texture);
                        img.width = 294;
                        img.height = 266;
                    });
                }*/
                box.parent = cc.find('Canvas');
                box.zIndex = 1;
                cc.sys.localStorage.removeItem('matchOver');
                cc.sys.localStorage.removeItem('prizeBoxData');
            }
            // 牌局类型
            if (cc.weijifen.GameBase.gameModel == 'ch') {
                //获取要更换的图片
                /*var object = this.chJoinRoomImg;
                //获取更换图片地址
                var sprite = cc.find("Canvas/main/game/11").getComponent(cc.Sprite);
                //图片地址内的图片路径 = 要更换的图片路径
                sprite.spriteFrame = object;*/
                this.backRoomTxt.getComponent(cc.Label).string = '麻友圈';
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
            cc.game.on(cc.game.EVENT_SHOW, function () {
                //获取分享进入的时候，是否分享的游戏房间
                // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareParam","");
                var res = jsb.reflection.callStaticMethod(...object.anMethodParam().shareParam);
                console.log('主动调用了geme.on方法--res',res);
                console.log('参数--shareParam',...object.anMethodParam().shareParam);
                // object.alert("res:"+res);
                if(res && !cc.weijifen.shareParam){
                    var result1 = JSON.parse(res);
                    if (object.clientPlatForm() == 'IOS') {
                        cc.weijifen.shareRoomNum = res;
                    } else if (self.clientPlatForm() == 'ANDROID' && result1.code != "10086" && result1.roomNum) {
                        cc.weijifen.shareRoomNum = result1.roomNum;
                    }
                    cc.weijifen.http.httpGet('/userInfo/query/token?userId='+cc.weijifen.user.id,object.tokenSuccess,object.carderror,object);
                }
            });
            //请求获取当前用户是否已经参加了房间
            var roomTime = setTimeout(function(){
                cc.weijifen.http.httpGet('/api/room/reConnection?token='+cc.weijifen.authorization,self.roomSuccess,self.roomError,self);       
                clearTimeout(roomTime);
            },2000);
            

            cc.weijifen.http.httpGet('/api/room/queryRoomCard?token='+cc.weijifen.authorization,this.cardsucess,this.carderror,this);
            this.gundongText();
            //获取是否有新的通知
            // cc.weijifen.http.httpGet('/activity/findActivityListGame?token='+cc.weijifen.authorization,this.tzsucess,this.tzerror,this);  
            cc.weijifen.http.httpGet('/gameAnnouncement/findAnno?token='+cc.weijifen.authorization,this.tzsucess,this.tzerror,this) ;            

        }

        cc.weijifen.iPayBack = function(result) {
            result = encodeURIComponent(result);
            cc.weijifen.http.httpGet('/ipay/checkSign?sign='+result,self.signSucess,self.signError,self);
        };
        var time = setInterval(function(){
            cc.weijifen.http.httpGet('/gameAnnouncement/findAnno?token='+cc.weijifen.authorization,self.tzsucess,self.tzerror,self) ;            
        },10000);
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
        /*cc.game.on(cc.game.EVENT_SHOW, function () {
            //获取分享进入的时候，是否分享的游戏房间
            // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareParam","");
            var res = jsb.reflection.callStaticMethod(...object.anMethodParam().shareParam);
            // object.alert("res:"+res);
            if(res){
                var result1 = JSON.parse(res);
                if (object.clientPlatForm() == 'IOS') {
                    cc.weijifen.shareRoomNum = res;
                } else if (self.clientPlatForm() == 'ANDROID' && result1.code != "10086" && result1.roomNum) {
                    cc.weijifen.shareRoomNum = result1.roomNum;
                }
                cc.weijifen.http.httpGet('/userInfo/query/token?userId='+cc.weijifen.user.id,object.tokenSuccess,object.carderror,object);
            }
        });*/

		let data = JSON.parse(result);
        if(data.message){
            object.alert(data.message);//如果当前玩家离线状态下，房间解散掉了，登录后给予提示信息
        }
        if(data.room){
			object.getGame(data);
          /*  var sprite = object.backRoom.getComponent(cc.Sprite);
        	sprite.spriteFrame = object.backRoomImg;*/
            object.backRoomTxt.getComponent(cc.Label).string = '返回房间';
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
        var offset_x = 0,action;
        var self = this;
        var text = self.message;
        var width = self.message.node.parent.width;
        var timer = setInterval(function(){
            if (!text.node) {
                clearInterval(timer);
                return
            }
            offset_x -= 5;
            if (-offset_x > text.node.width) {
                offset_x = 0;
                text.node.x = 0;
            } else {
                text.node.x = offset_x;
            }
        },30);
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
    /* 游戏公告弹窗
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
    tokenSuccess:function(res,object){
        if(res){
            cc.weijifen.authorization = res;
        }
        if(cc.weijifen.shareRoomNum){
            var inputNum = require("inputNum");
            inputNum = new inputNum();
            inputNum.click(cc.weijifen.shareRoomNum);
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
    },
     /*退出登录*/
    changeAccount: function () {
        cc.director.loadScene('appLogin'); 
        cc.sys.localStorage.clear();
        cc.weijifen = null;
        cc.audioEngine.stopAll();
    },
    /*获取房卡*/
    getRoomCards: function () {
        let token = {token:cc.weijifen.authorization};
        cc.weijifen.http.httpPost('/api/room/queryRoomCard',token,this.getRoomSuccess,this.tzerror,this) ;            
    },
    getRoomSuccess: function (res,obj) {
        let result = JSON.parse(res);
        let fangka = cc.find('Canvas/main/head/5/num');
        fangka.getComponent(cc.Label).string = result.cards;
        cc.weijifen.user.cards = result.cards;
    }
});






 