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
    },
    onLoad: function () {
        
        //如果weijifen已经加载好了
        if(this.ready()){   
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
            //debugger
            this.username.string = cc.weijifen.user.nickname;
            //玩家头像
			this.headImg(this.headimg,cc.weijifen.user.headimgurl,true);
            // this.cards.string = cc.weijifen.user.cards + "张" ;
            // this.goldcoins.string = cc.weijifen.user.goldcoins + '个';
            //请求获取当前用户是否已经参加了房间
            cc.weijifen.http.httpGet('/api/room/reConnection?token='+cc.weijifen.authorization,this.roomSuccess,this.roomError,this);

            cc.weijifen.http.httpGet('/api/room/queryRoomCard?token='+cc.weijifen.authorization,this.cardsucess,this.carderror,this)   
            this.gundongText();
            //获取是否有新的通知
            cc.weijifen.http.httpGet('/activity/findActivityListGame?token='+cc.weijifen.authorization,this.tzsucess,this.tzerror,this);            
        }
        console.log('cc.weijifen---handDataBind',cc.weijifen)

    },
    carderror: function(result,object){
        // this.alert('充值失败');
    },
    cardsucess:function(result,object){
        var data = JSON.parse(result) ;
            cc.weijifen.user.cards = data.cards;
            object.cards.string = cc.weijifen.user.cards ;
            object.goldcoins.string = cc.weijifen.user.goldcoins;

    },
    tzsucess: function(result,object){
		var data = JSON.parse(result);  
        if(data.tz){
            object.hall(3);
        }
	},
	tzerror: function(result,object){	
    },
    roomSuccess: function(result,object){
        debugger
		let data = JSON.parse(result);
        if(data.room){
			object.getGame(data);
            var sprite = object.backRoom.getComponent(cc.Sprite);
        	sprite.spriteFrame = object.backRoomImg;
        } else {
			cc.weijifen.room = null;
		}
        
    },
    roomError: function(object){
        object.alert("网络异常");
    },
	//滚动公告字幕
	gundongText:function(){
        //debugger
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

});








