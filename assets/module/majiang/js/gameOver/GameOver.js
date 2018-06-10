cc.Class({
    extends: cc.Component,

    properties: {
    	current_hu:cc.Node,
    	top_hua: cc.Node,
        liuju: cc.Node,
    },

    //初始化相关数据
    onLoad: function () {
    	
    },

    //结束游戏    结算
    statics: {
    	allcards_event:function(data , context){
		    // 胡动画
		    if (!data.unHu) {
	       		var gameStartInit = require('GameStartInit');
	       		let player = gameStartInit.player(cc.weijifen.user.id , context);
	            cc.find('Canvas/huAnimation').active = true;
	            var hu = cc.find("Canvas/huAnimation/hu_action");
	            if (player.tablepos == 'top') {
	                hu.x = 280;
	                hu.y = 200;
	            } else if (player.tablepos == 'left') {
	                hu.x = -400;
	                hu.y = 80;
	            } else if (player.tablepos == 'right') {
	                hu.x = 400;
	                hu.y = 80;
	            } else {
	                hu.x = -450;
	                hu.y = -200;
	            }
	            // let anim = hu.getChildByName('ting_action').getComponent(cc.Animation);
	            let anim = hu.getComponent(cc.Animation);
	            // anim.play('ting');
	            anim.play('hu');
	            setTimeout(function(){
	                cc.find('Canvas/huAnimation').active = false;
	                if (cc.find('Canvas/big_cards').children) {
			            for (let i = 0;i < cc.find('Canvas/big_cards').children.length;i++) {
			                cc.find('Canvas/big_cards').children[i].destroy();
			            }
			            // cc.find('Canvas/mask').active = false;
			        }
	            },2000);
		    }

    		context = cc.find('Canvas').getComponent('MJDataBind');
    		var gameOverNode = cc.find('Canvas/js/GameOver').getComponent('GameOver');
    		var gameOver = require('GameOver');
	        //结算界面，
	        let playerid;
	        cc.sys.localStorage.removeItem('clear');
	        for(let i = 0;i<data.playOvers.length;i++){
	            if(data.playOvers[i].win==true){
	                playerid = data.playOvers[i].user;
	                if(data.playOvers[i].balance.huCard>-32){
	                    var dan = gameOverNode.current_hu.children[1].getComponent('DanAction');
	                    dan.init(data.playOvers[i].balance.huCard,false,'current','1');                
	                    break;
	                }else{
	                    gameOverNode.current_hu.children[1].active = false;
	                    gameOverNode.top_hua.active = true;
	                    var dan = gameOverNode.top_hua.getComponent('BuHuaAction');
	                    dan.init(data.playOvers[i].balance.huCard,'',false);
	                    break;
	                }
	            }
	        }

	        gameOver.huaction(playerid);
	        setTimeout(function(){gameOver.endList(data,context,playerid)},3000)
	    },
	    endList:function(data,context,playerid,a){
	    	var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
	    	var gameOver = require('GameOver');
	    	var gameOverNode = cc.find('Canvas/js/GameOver').getComponent('GameOver');
	    	var settingClickNode = cc.find('Canvas/js/settingClick').getComponent('settingClick');
	        context.gddesk_cards = gameStartInitNode.desk_cards.string;
	        gameStartInitNode.desk_cards.string = '136';
	        let temp = cc.instantiate(settingClickNode.summary) ;
	        temp.parent = context.root() ;
	        temp.getComponent('SummaryClick').setData(data); 
	        temp.zIndex = 999;
	        if(playerid){
	            gameOver.huaction2(playerid);
	        }else{
	            gameOverNode.liuju.active = false;
	        }
	        
	    },
	    /*
	    * 胡牌处理
	    */
	    huaction: function(playerid){
	    	var gameOverNode = cc.find('Canvas/js/GameOver').getComponent('GameOver');
	    	var gameStartInit = require('GameStartInit');
	        if(playerid){
	            cc.weijifen.audio.playSFX('nv/hu.mp3');                    
	            let hu_hu = gameOverNode.current_hu.getComponent(cc.Animation);
	            let player = gameStartInit.player(playerid , this);
	            let action = cc.scaleTo(1.5,1.5);
	            player.target.runAction(action);// 胡牌玩家头像，放大
	            // 
	            if(player.tablepos == 'top'){
	                hu_hu.node.children[0].x = 7 ;
	                hu_hu.node.children[0].y = 142 ;
	                hu_hu.node.children[1].x = 7 ;
	                hu_hu.node.children[1].y = 142 ;

	                hu_hu.node.children[2].x = 11 ;
	                hu_hu.node.children[2].y = 121 ;
	                hu_hu.node.children[3].x = -156 ;
	                hu_hu.node.children[3].y = 146 ;
	            }else if(player.tablepos == 'left'){
	                hu_hu.node.children[0].x = -369 ;
	                hu_hu.node.children[0].y = 76 ;
	                hu_hu.node.children[1].x = -369 ;
	                hu_hu.node.children[1].y = 76 ;

	                hu_hu.node.children[2].x = -365 ;
	                hu_hu.node.children[2].y = 55 ;
	                hu_hu.node.children[3].x = -358 ;
	                hu_hu.node.children[3].y = -72 ;              
	            }else if(player.tablepos == 'right'){
	                hu_hu.node.children[0].x = 383 ;
	                hu_hu.node.children[0].y = -31 ;
	                hu_hu.node.children[1].x = 383 ;
	                hu_hu.node.children[1].y = -31 ;
	                hu_hu.node.children[2].x = 387 ;
	                hu_hu.node.children[2].y = -52 ;   
	                hu_hu.node.children[3].x = 372 ;
	                hu_hu.node.children[3].y = 115 ;             
	            }else{
	                hu_hu.node.children[0].x = 7 ;
	                hu_hu.node.children[0].y = -69 ;
	                hu_hu.node.children[1].x = 7 ;
	                hu_hu.node.children[1].y = -69 ;
	                hu_hu.node.children[2].x = 11 ;
	                hu_hu.node.children[2].y = -90 ;
	                hu_hu.node.children[3].x = 219 ;
	                hu_hu.node.children[3].y = -65 ;              
	            }
	            gameOverNode.current_hu.active =true;
	            let ani = gameOverNode.current_hu.getComponent(cc.Animation);
	            ani.play("current_hu") ;
	        }else{
	            gameOverNode.liuju.active = true;
	        }
	    },
	    huaction2:function(playerid){
	    	var gameStartInit = require('GameStartInit');
	    	var gameOverNode = cc.find('Canvas/js/GameOver').getComponent('GameOver');
	        let ani = gameOverNode.current_hu.getComponent(cc.Animation);
	        gameOverNode.current_hu.active =false;
	        ani.stop("current_hu") ;
	        let player = gameStartInit.player(playerid , this);
	        // player.target.scale = 0.91;
	        player.target.scale = 1;
	    },
    }
});
