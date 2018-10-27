var WJFCommon = require('WJFCommon');

cc.Class({
    extends: WJFCommon,
    properties: {
    	mjType: {
    		default: null,
    		type: cc.Node,
    	},
    	roomList: {
    		default: null,
    		type: cc.Node,
    	},
    	playerNode: {
    		default: null,
    		type: cc.Node,
    	},
    	rightContent: cc.Node,
    	detail_title_:  {
    		default: null,
    		type: cc.Node,
    	},
    	detail_pla:  {
    		default: null,
    		type: cc.Node,
    	},
    	detail_box:  {
    		default: null,
    		type: cc.Node,
    	},
    	detail_item:  {
    		default: null,
    		type: cc.Node,
    	},
    	detail_content:  {
    		default: null,
    		type: cc.Node,
    	},
    	detail_player: {
    		default: null,
    		type: cc.Node,
    	},
    	nodeModel: {
    		default: null,
    		type: cc.Node,
    	},
    	totalScores: {
    		default: null,
    		type: cc.Node,
    	},
    	detail_item_bg: cc.SpriteFrame
    },
    onLoad: function () {
    	this.initData();
    },
    /*初始化战况数据*/
    initData () {
        // cc.weijifen.authorization = "73d2364791ab4c7bb757beced6787ef2";
    	var params = {
            token: cc.weijifen.authorization,
    		type: 1,// 默认约局
    		page: 1
    	}
        cc.weijifen.http.httpPost('/situation/getGameRoomList',params,this.situationSuccess,this.err,this);
    },
    situationSuccess (res,obj) {
		var result = JSON.parse(res);  
		// setString    设置对应元素的txt
		// @param name  子节点的name
		// @param str   更改过后的字段
		function setString (list,name,str) {
			list.getChildByName(name).getComponent(cc.Label).string = str;
		}
		function subStr (str) {
			var res = "";
            if(str){
                res = str.slice(0,4) + '...';
            }
            return res;
		}
		if (result.success) {
			var data = result.data;

            if (data.length) {
    			for (let i = 0;i < data.length;i++) {
    				var arr = [],scores = [];
    				var list = cc.instantiate(obj.roomList);
    				var date = data[i].gameResult.createTime;
    				setString(list,'roomNum',data[i].gameResult.roomNumber);
    				setString(list,'quanNum',data[i].gameResult.countNum + '/' + data[i].gameResult.countNum);
    				setString(list,'date',obj.timestampToTime(date,1));
    				setString(list.getChildByName('detailBtn'),'roomId',data[i].gameResultList[0].roomId);
    				setString(list.getChildByName('detailBtn'),'roomNum',data[i].gameResultList[0].roomNumber);
    				setString(list.getChildByName('detailBtn'),'quanNum',data[i].gameResultList[0].countNum);
    				setString(list.getChildByName('detailBtn'),'date',obj.timestampToTime(date,1));

    			
    				for (var j = 0;j < data[i].gameResultList.length;j++) {
    					let pla = cc.instantiate(obj.playerNode);
    					var name = subStr(data[i].gameResultList[j].nickname);
    					setString(pla,'nickName',name);
    					setString(pla,'totalScores',data[i].gameResultList[j].totalScores);
    					pla.active = true;
    					pla.parent = list.getChildByName('playersBox');
    					arr.push(name);
    					scores.push(data[i].gameResultList[j].totalScores);
    				}

    				setString(list.getChildByName('detailBtn'),'playerArr',JSON.stringify(arr));
    				setString(list.getChildByName('detailBtn'),'totalScores',JSON.stringify(scores));
    				list.parent = obj.rightContent;
    				list.active = true;
    			}
                obj.rightContent.height = obj.roomList.height * data.length;
                cc.find("Canvas/menu/situation/right/view/data").active = false;
            } else {
                cc.find("Canvas/menu/situation/right/view/data/loaddata").active = false;
                cc.find("Canvas/menu/situation/right/view/data/nulldata").active = true;
            }
		}  	
    },
    goDetail (event) {
    	// 红色---   #8e290a 
    	var roomId = event.target.getChildByName('roomId').getComponent(cc.Label).string;
    	var roomNum = event.target.getChildByName('roomNum').getComponent(cc.Label).string;
    	var quanNum = event.target.getChildByName('quanNum').getComponent(cc.Label).string;
    	var date = event.target.getChildByName('date').getComponent(cc.Label).string;
    	var playerArr = JSON.parse(event.target.getChildByName('playerArr').getComponent(cc.Label).string);
    	var scoresArr = JSON.parse(event.target.getChildByName('totalScores').getComponent(cc.Label).string);
    	function detailSuccess (result,obj) {
			obj.detail_content.parent.parent.active = true;
    		obj.rightContent.parent.parent.active = false;
    		obj.totalScores.active = true;

    		function setString (list,name,str) {
				list.getChildByName(name).getComponent(cc.Label).string = str;
			}
			function subStr (str) {
                var res = "";
                if(str){
                    res = str.slice(0,4) + '...';
                }
				return res;
			}
    		var res = JSON.parse(result);
    		if (res.success) {
    			var quan;

    			obj.detail_title_.active = true;
    			obj.detail_box.active = true;
    			obj.detail_pla.active = true;
    			// 标题
    			setString(obj.detail_box.parent.getChildByName('detail_title_'),'roomNum',roomNum);
    			setString(obj.detail_box.parent.getChildByName('detail_title_'),'quanNum',quanNum);
    			setString(obj.detail_box.parent.getChildByName('detail_title_'),'date',date);

    			for (var i = 0;i < res.playUserList.length;i++) {
    				if (i == 0) {
    					var scores_0 = cc.instantiate(obj.nodeModel);// 分数
	    				scores_0.x = 0;
	    				scores_0.y = 0;
	    				scores_0.parent = obj.totalScores;
	    				scores_0.active = true;
						setString(obj.totalScores,'nodeModel','总分');
    				}
    				// 玩家昵称
    				var player = cc.instantiate(obj.nodeModel);
    				player.getComponent(cc.Label).string = playerArr[i];
    				player.x = 0;
    				player.y = 0;
    				player.width = 150;
    				player.parent = obj.detail_pla;

    				// 总分数
					var scores_t = cc.instantiate(obj.nodeModel);// 分数
    				scores_t.x = 0;
    				scores_t.y = 0;
    				scores_t.name = 's' + i;
    				scores_t.parent = obj.totalScores;
    				obj.totalScores.active = true;
					setString(obj.totalScores,scores_t.name,scoresArr[i]);
    				if (scoresArr[i] < 0) {
						scores_t.setColor(cc.color(142,41,10,255));
					}
    				// 每圈数
    				for (var j = 0;j < res.playUserList[i].userRoomDetailList.length;j++) {
	    				var scores = cc.instantiate(obj.nodeModel);// 分数
	    				scores.x = 0;
	    				scores.y = 0;
	    				scores.width = 150;
    					scores.name = 'p' + i;
    					quan = '第' + (j + 1) + '圈';
    					
    					if (i % res.playUserList.length == 0) {
    						var list = cc.instantiate(obj.detail_item);// 圈
		    				list.parent = obj.detail_content;
							scores.parent = obj.detail_content.children[j];
    						setString(obj.detail_content.children[j],scores.name,res.playUserList[i].userRoomDetailList[j].overPoint);
    					} else {
							scores.parent = obj.detail_content.children[j];
		    				list.parent = obj.detail_content;
    						setString(obj.detail_content.children[j],scores.name,res.playUserList[i].userRoomDetailList[j].overPoint);
    					}

    					if (j % 2 != 0) {
    						obj.detail_content.children[j].getComponent(cc.Sprite).spriteFrame = obj.detail_item_bg;
    					}
    					if (res.playUserList[i].userRoomDetailList[j].overPoint < 0) {
    						scores.setColor(cc.color(142,41,10,255));
    					}

    					setString(obj.detail_content.children[j],'quan',quan);
	    				list.active = true;
	    				obj.detail_content.active = true;
    				}	
    			}

                obj.detail_content.height = obj.detail_item.height * res.playUserList[0].userRoomDetailList.length;
    		}
    	}
    	
        cc.weijifen.http.httpPost('/situation/getGameRoomDetail',{roomId: roomId},detailSuccess,this.err,this);
    },
    err () {

    },
    close (event) {
    	if (event.target.getComponent(cc.Button).clickEvents[0].customEventData == 'close_detail' ) {
    		event.target.parent.active = false;
    		this.rightContent.parent.parent.active = true;
    		this.detail_content.parent.parent.active = false;
    		this.detail_pla.active = false;
			this.totalScores.active = false;
    		this.totalScores.removeAllChildren();
    		this.detail_pla.removeAllChildren();
    		this.detail_content.removeAllChildren();
    		return
    	}
    	event.target.parent.destroy();
    }
})
 