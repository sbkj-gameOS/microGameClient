cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
    },
    statics: {
    	lasthands_event:function(data, context){
	        context = cc.find('Canvas').getComponent('MJDataBind');        
	        if(data.userid == cc.weijifen.user.id){    //该我出牌 , 庄家出牌，可以不用判断是否庄家了 ，不过，庄家数据已经传过来了
	            context.exchange_state("lasthands" , context);
	            context.exchange_searchlight("current",context);
	            if(cc.sys.localStorage.getItem('altake')!='true'){
	                cc.sys.localStorage.setItem('take','true');            
	            }
	        }else{
	            context.exchange_state("otherplayer" , context);    //当前玩家出牌，计时器开始计时，探照灯照向该玩家
	            for(var inx = 0 ; inx<context.playersarray.length ; inx++){
	                let temp = context.playersarray[inx].getComponent("MaJiangPlayer") ;
	                if(temp.data.id == data.userid){
	                    context.exchange_searchlight(temp.tablepos,context);; break ;
	                }
	            }
	        }
	    },

	    /**
	     * 出牌
	     * 新创建牌局，首个玩家加入，进入等待状态，等待其他玩家加入，服务端会推送 players数据
	     * @param {Object} data  
	     * @param {cc.Component} context
	     * @param {Boolean} peng    玩家蛋牌被其他玩家抢碰
	     */
	    takecard_event:function(data , context, peng){
	    	cc.weijifen.audio.setSFXVolume(parseInt(cc.weijifen.mp3Music));
	    	clearTimeout(context.clock);
	    	cc.weijifen.clock = null;
	        context = cc.find('Canvas').getComponent('MJDataBind');
	        var gameStartInit = require('GameStartInit');
	        var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
	        var gamePlay = require('GamePlay');
	        cc.sys.localStorage.removeItem('cb');          
	        gamePlay.qujuju(data);
	        let kongcard ; 
	        cc.weijifen.audio.playSFX('give.mp3');
         	let playerss = gameStartInit.player(data.userid , context);


         	// 蛋牌被抢碰之后的手牌处理
            if (!data.cards) {
            	cc.weijifen.danOrPeng = true;
            	cc.weijifen.danOrPengData = data;
            	if (peng) {
            		for (let inx = 0; inx < context.playercards.length;i++ ) {
		                let handcards = context.playercards[inx].getComponent("HandCards");
		                handcards.reinit();
		                if (data.card == handcards.value) {
		                    context.playercards[inx].zIndex = 0 ;
		                    context.playercards[inx].parent = null;

		                    handcards.reinit();
		                    context.cardpool.put(context.playercards[inx]);
		                    context.playercards.splice(inx, 1);
		                    let desk_card = cc.instantiate(gameStartInitNode.takecards_one);
		                    let temp = desk_card.getComponent("DeskCards");
		                    temp.init(handcards.value,'B',undefined,'current');

           					desk_card.active = false;
		                    desk_card.children[0].children[0].width = 90;//122
		                    desk_card.children[0].children[0].height = 128;//150
		                    context.deskcards.push(desk_card);
	                    	desk_card.parent = context.deskcards_current_panel;
		                }else{
		                    handcards.reinit();
		                    if(handcards.selectcolor == true){
		                        context.playercards[inx].zIndex = 1000 + handcards.value ;
		                    }else{
		                        if(handcards.value >= 0){
		                            context.playercards[inx].zIndex = handcards.value ;
		                        }else{
		                            context.playercards[inx].zIndex = 200 + handcards.value ;
		                        }

		                        if(context.playercards[inx].children[1].active){
		                            context.playercards[inx].zIndex = -1;
		                        }
		                    }
		                    inx = inx + 1 ;     //遍历 ++,不处理移除的 牌
		                }
	            	}

            		cc.weijifen.danOrPeng = null;
            		cc.weijifen.danOrPengData = null;
            		return
            	}
            } 



	        if(data.ting){
	            if(context[playerss.tablepos+'ting'].active ==false){
	            	cc.find('Canvas/ting').active = true;
                    var anim = cc.find("Canvas/ting/ting_action");
                    if (playerss.tablepos == 'top') {
		                anim.x = 280;
		                anim.y = 200;
		            } else if (playerss.tablepos == 'left') {
		                anim.x = -400;
		                anim.y = 80;
		            } else if (playerss.tablepos == 'right') {
		                anim.x = 400;
		                anim.y = 80;
		            } else {
		                anim.x = -450;
		                anim.y = -200;
		            }
                    anim = anim.getComponent(cc.Animation);
                    anim.play('ting');
                    setTimeout(function(){
                        cc.find('Canvas/ting').active = false;
                    },2000);
	                // context.tingting.active = true ;
	                // setTimeout(function(){context.tingting.active = false ;},2000);
	                context[playerss.tablepos+'ting'].active = true ; 
	            }
	        }
	        if(data.userid == cc.weijifen.user.id) {
	            if(!data.ting){
	               gameStartInit.tingnoaction();
	        	}
	        	let father = cc.find('Canvas').getComponent('MJDataBind').selectfather;
		        if(father.active == true){
		            father.active= false;
		            father.children[0].children[1].children.splice(0,father.children[0].children[1].children.length);
		        }
	        

	            gameStartInit.initcardwidth();
	        
	            if(data.ting){
	                cc.sys.localStorage.setItem('alting','true'); 
	                cc.sys.localStorage.setItem('altings','true');  
	                cc.sys.localStorage.setItem('take','true');  
        			if (cc.find('Canvas/big_cards').children) {
	    				cc.find('Canvas/big_cards').removeAllChildren();
        			}
	            }else{
	                cc.sys.localStorage.removeItem('alting');
	            }
	            if(data.notSend||(cc.sys.localStorage.getItem('take') != 'true'&&!data.allow)){
	                return;
	            }
	            cc.sys.localStorage.removeItem('altake');
	            cc.sys.localStorage.removeItem('take');
	            for (var inx = 0; inx < context.playercards.length;i++ ) {
	            	// if (context.playercards[inx]) {
		                let handcards = context.playercards[inx].getComponent("HandCards");
		                handcards.reinit();
		                if (data.card == handcards.value) {
		                    context.playercards[inx].zIndex = 0 ;
		                    /**
		                     * 从数组中移除
		                     */
		                    context.playercards[inx].parent = null;

		                    handcards.reinit();
		                    /**
		                     * 还回 对象池
		                     */
		                    context.cardpool.put(context.playercards[inx]);
		                    /**
		                     * 从数组中移除
		                     */
		                    context.playercards.splice(inx, 1);
		                    /**
		                     * 放到桌面 ， 需要重构
		                     */
		                    let desk_card = cc.instantiate(gameStartInitNode.takecards_one);
		                    let temp = desk_card.getComponent("DeskCards");
		                    temp.init(handcards.value,'B',undefined,'current');

		                    // if (desk_card.children) {
		                    	// 大牌显示
		                    	let big_card = cc.instantiate(context.bigModel);
		                    	let big_handcards = big_card.getComponent("HandCards");
		                    	big_handcards.init(handcards.value,'B');
		                    	/*big_card.x = 410;
		                    	big_card.y = -240;*/
		                    	/*big_card.x = 0;
		                    	big_card.y = -200;
		               			// cc.find('Canvas/mask').active = true;
		                    	let move = cc.moveTo(0.2,cc.p(0,-160));
			                    big_card.runAction(move);*/
			                    let h_cards = cc.find('Canvas/cards/handcards/current/currenthandcards').children;
			                   /* if (cc.weijifen.match == 'true') {
			                    	var newVec2 = h_cards[h_cards.length - 1].convertToNodeSpaceAR(cc.v2(667,375));
			                    	big_card.x = -newVec2.x;
			                    	big_card.y = -newVec2.y;
			                    } else {
			                    	big_card.x = cc.weijifen.cardPostion.x;
			                    	big_card.y = cc.weijifen.cardPostion.y;
			                    }*/
			                    if (cc.weijifen.cardPostion) {
				                    big_card.x = cc.weijifen.cardPostion.x;
			                    	big_card.y = cc.weijifen.cardPostion.y;
			                    	cc.weijifen.cardPostion = {x:null,y:null};
			                    } 
			                    if (data.ting) {
			                    	var newVec2 = h_cards[h_cards.length - 1].convertToNodeSpaceAR(cc.v2(667,375));
			                    	big_card.x = -newVec2.x;
			                    	big_card.y = -newVec2.y;
			                    }
		                    	big_card.parent = cc.find('Canvas/big_cards');
		                    	

		                    	let move = cc.moveTo(0.2,cc.p(0,-150));
			                    big_card.runAction(move);

	           					desk_card.active = false;
			                    desk_card.children[0].children[0].width = 90;//122
			                    desk_card.children[0].children[0].height = 128;//150
			                    context.deskcards.push(desk_card);
		                    	desk_card.parent = context.deskcards_current_panel;
		                    // }
		                }else{
		                    handcards.reinit();
		                    if(handcards.selectcolor == true){
		                        context.playercards[inx].zIndex = 1000 + handcards.value ;
		                    }else{
		                        if(handcards.value >= 0){
		                            context.playercards[inx].zIndex = handcards.value ;
		                        }else{
		                            context.playercards[inx].zIndex = 200 + handcards.value ;
		                        }

		                        if(context.playercards[inx].children[1].active){
		                            context.playercards[inx].zIndex = -1;
		                        }
		                    }
		                    inx = inx + 1 ;     //遍历 ++,不处理移除的 牌
		                }
	            	// }
	            }
	            context.exchange_state("takecard" , context);  //隐藏 提示状态
	        }else{
	        	// 碰牌玩家执行该处代码
	        	cc.sys.localStorage.removeItem('take');
	            //其他玩家出牌   
	            let temp = gameStartInit.player(data.userid , context) ;
	            let cardpanel  , cardprefab , deskcardpanel;

	            if(!data.notSend && temp){
		            if(temp.tablepos == "right"){
		                for(var inx = 0 ; inx < gameStartInitNode.right_panel.children.length ; inx++){
		                    let right_temp = gameStartInitNode.right_panel.children[inx].getComponent("SpecCards");
		                    right_temp.reinit();
		                }
		                cardpanel = gameStartInitNode.right_panel ;
		                cardprefab = gameStartInitNode.takecards_right ;
		                deskcardpanel = context.deskcards_right_panel ;


	                 	let desk_card = cc.instantiate(cardprefab);
	                    let temp = desk_card.getComponent("DeskCards");
	                    temp.init(data.card,'R',undefined,'right');
		                let big_card = cc.instantiate(context.bigModel);
                    	let big_handcards = big_card.getComponent("HandCards");
                    	big_handcards.init(data.card,'R');
                    	big_card.x = 380;
                    	big_card.y = 0;
                    	big_card.parent = cc.find('Canvas/big_cards');
                    	
                    	
                    	let move = cc.moveTo(0.2,cc.p(320,0));
	                    big_card.runAction(move);

           				// if (desk_card.children) {
           					desk_card.active = false;
	  						desk_card.children[0].children[0].width = 128;
		                    desk_card.children[0].children[0].height = 100;
	                    	context.deskcards.push(desk_card);
	                    	desk_card.parent = deskcardpanel;
	                    // }

		            }else if(temp.tablepos == "left"){
		                for(var inx = 0 ; inx < gameStartInitNode.left_panel.children.length ; inx++){
		                    let left_temp = gameStartInitNode.left_panel.children[inx].getComponent("SpecCards");
		                    left_temp.reinit();
		                }
		                cardpanel = gameStartInitNode.left_panel ;
		                cardprefab = gameStartInitNode.takecards_left ;
		                deskcardpanel = context.deskcards_left_panel ;

		                
	                 	let desk_card = cc.instantiate(cardprefab);
	                    let temp = desk_card.getComponent("DeskCards");
	                    temp.init(data.card,'L',undefined,'left');
		                let big_card = cc.instantiate(context.bigModel);
                    	let big_handcards = big_card.getComponent("HandCards");
                    	big_handcards.init(data.card,'L');
                    	big_card.x = -380;
                    	big_card.y = 0;
                    	big_card.parent = cc.find('Canvas/big_cards');
                    	
                    	// cc.find('Canvas/mask').active = true;
                    	let move = cc.moveTo(0.2,cc.p(-320,0));
	                    big_card.runAction(move);

           				// if (desk_card.children) {
           					desk_card.active = false;
	  						desk_card.children[0].children[0].width = 128;
		                    desk_card.children[0].children[0].height = 100;
	                    	context.deskcards.push(desk_card);
	                    	desk_card.parent = deskcardpanel;
	                    // }
		            }else if(temp.tablepos == "top"){
		                for(var inx = 0 ; inx < gameStartInitNode.top_panel.children.length ; inx++){
		                    let top_temp = gameStartInitNode.top_panel.children[inx].getComponent("SpecCards");
		                    top_temp.reinit();
		                }
		                cardpanel = gameStartInitNode.top_panel ;
		                cardprefab = gameStartInitNode.takecards_one ;
		                deskcardpanel = context.deskcards_top_panel ;
		           
		                let desk_card = cc.instantiate(gameStartInitNode.takecards_one);
	                    let temp = desk_card.getComponent("DeskCards");
	                    temp.init(data.card,'B',undefined,'top');
		                let big_card = cc.instantiate(context.bigModel);
                    	let big_handcards = big_card.getComponent("HandCards");
                    	big_handcards.init(data.card,'B');
                    	big_card.x = 0;
                    	big_card.y = 250;
                    	/*let x;
                    	let top = cc.find('Canvas/cards/handcards/top');
                    	let topNode = top.getChildByName('tophandcards');
                    	if (topNode.x > 0) {
                    		x = topNode.x;
                    	} else {
                    		x = topNode.x + topNode.children[topNode.children.length - 1].x;
                    	}
                    	big_card.x = x;
                    	big_card.y = top.y;*/
                    	big_card.parent = cc.find('Canvas/big_cards');
                    	

                    	// cc.find('Canvas/mask').active = true;
                    	let move = cc.moveTo(0.2,cc.p(0,160));
	                    big_card.runAction(move);

           				// if (desk_card.children) {
           					desk_card.active = false;
	  						desk_card.children[0].children[0].width = 90;
		                    desk_card.children[0].children[0].height = 128;
	                    	context.deskcards.push(desk_card);
	                    	desk_card.parent = deskcardpanel;
	                    // }
		            }
		            /**
		             * 销毁其中一个对象
		             */
		            
		            if (cardpanel.children[cardpanel.children.length - 1]) cardpanel.children[cardpanel.children.length - 1].destroy();                
	            }
	        }
	    },
	    /**
	     * 下一个玩家抓牌的事件， 如果上一个玩家出牌后，没有其他玩家杠、碰、吃、胡等动作，则会同时有一个抓牌的事件，否则，会等待玩家 杠、碰、吃、胡完成
	     * @param data
	     * @param context
	     */
	    dealcard_event:function(data , context){
	    	cc.weijifen.audio.setSFXVolume(parseInt(cc.weijifen.mp3Music));
            if (data.replacePowerCard) {
            	cc.find('Canvas/bg/ReplacePowerCard').active = true;
            	let timer_flag = setTimeout(function(){
            		cc.find('Canvas/bg/ReplacePowerCard').active = false;
            	},1500);
            }
            var handCards = cc.find('Canvas/cards/handcards/current/currenthandcards');
            var length = handCards.children.length ;
            if (length > 3 && cc.weijifen.user.id == data.userid && handCards.children[length-1].zIndex == 2000) {
            	let val = handCards.children[length-1].getComponent('HandCards').value;
            	val > -1 ? handCards.children[length-1].zIndex = val
            		     : handCards.children[length-1].zIndex = val + 200;
		        handCards.sortAllChildren();
            }

    		context.clock = setTimeout(function(){
    			if (cc.find('Canvas/big_cards').children) {
    				cc.find('Canvas/big_cards').removeAllChildren();
        		}
	            let desk_c = cc.find('Canvas/cards/deskcards/current');
	            let desk_r = cc.find('Canvas/cards/deskcards/right');
	            let desk_t = cc.find('Canvas/cards/deskcards/top');
	            let desk_l = cc.find('Canvas/cards/deskcards/left');
	            if (desk_c.children.length > 0) desk_c.children[desk_c.children.length-1].active = true;
	            if (desk_r.children.length > 0) desk_r.children[desk_r.children.length-1].active = true;
	            if (desk_t.children.length > 0) desk_t.children[desk_t.children.length-1].active = true;
	            if (desk_l.children.length > 0) desk_l.children[desk_l.children.length-1].active = true;
    				// clearTimeout(context.clock);
    		},500)

	      	var gamePlay = require('GamePlay');
	        if(cc.sys.localStorage.getItem('cb') == 'true'&&cc.sys.localStorage.getItem('altings') != 'true'){
	            setTimeout(function(){gamePlay.dealcards(data,context)},2100);
	        }else{
	            gamePlay.dealcards(data,context);
	        }
	    },
	    dealcards: function(data,context){
	        cc.sys.localStorage.removeItem('cb');  
	        var gamePlay = require('GamePlay');
	        var gameStartInit = require('GameStartInit');
	        var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
	        context=cc.find('Canvas').getComponent('MJDataBind');
	        context.closeloadding();
	        if(cc.weijifen.playerNum){
	            var peoNum = cc.weijifen.playerNum;
	        }
	        let player = gameStartInit.player(data.userid , context);
	        gamePlay.select_action_searchlight(data, context , player);

	        //摸牌补花
	        //补花值为bet数组时
	        if(data.bu){
	            // var buhua = context.decode(data.bu);//补花
	            var buhua = data.bu;//补花
	            for(var i = 0;i<buhua.length;i++){
	                gameStartInit.buhuaModle(buhua[i],player.tablepos,'',player.tablepos,context,"");
	            }
	        }
	      
	        if(data.userid == cc.weijifen.user.id){
	            if(cc.sys.localStorage.getItem('altings') != 'true'){
	                gameStartInit.tingnoaction();
	            }
	            if(cc.sys.localStorage.getItem('altake')!='true'){
	                cc.sys.localStorage.setItem('take','true');
	            }else{
	                cc.sys.localStorage.removeItem('altake');                
	            }
	            gamePlay.initDealHandCards(context , data);   
	            if(context.action123 !='deal'){
	                context.shouOperationMune();                                    
	            }
	        }else{
	        	if (player) {
		            context.shouOperationMune();                    
		            let inx = 0 ;
		            if(player.tablepos == "top"){
		                inx = 1 ;
		            }else if(player.tablepos == "left"){
		                inx = 2 ;
		            }
		            gameStartInit.initPlayerHandCards(0 , 1 , inx , context , true,peoNum);
	        	}
	        }
	        gameStartInitNode.desk_cards.string = data.deskcards ;
	        if(data.power){
	            if(data.powerCard&&data.powerCard.length>0){
	                for(let i=0 ; i<cc.find('Canvas/cards/tesucards/baocard/child').children.length;i++){
	                    cc.find('Canvas/cards/tesucards/baocard/child').children[i].destroy();
	                }
	                cc.weijifen.baopai = data.powerCard;
	                /*for(let i= 0 ; i<data.powerCard.length;i++){
	                    var laiziZM = cc.instantiate(gameStartInitNode.ZM);
	                    laiziZM.parent = gameStartInitNode.godcard.children[1];
	                    var LZH  = laiziZM.getComponent('DeskCards');
	                    LZH.init(data.powerCard[i],'B',true);
	                    // cc.weijifen.baopai = data.powerCard[i];
	                }*/
	                cc.find('Canvas/cards/tesucards/baocard/child').x = -580;                
                    var laiziFM = cc.instantiate(gameStartInitNode.FM);
                    var LZH = laiziFM.getComponent('DeskCards');
                    LZH.init(-3,'Z',true);
                    laiziFM.parent = gameStartInitNode.godcard.children[1];
	            }else{
	                var laiziFM = cc.instantiate(gameStartInitNode.FM);
	                var LZH = laiziFM.getComponent('DeskCards');
	                //LZH.init(-4);
	                laiziFM.parent = gameStartInitNode.godcard.children[1];
	            }
	        }
	    },
	    select_action_searchlight:function(data , context , player){
	    	context=cc.find('Canvas').getComponent('MJDataBind');
	        if (player) context.exchange_searchlight(player.tablepos , context);
	        context.exchange_state("nextplayer" , context); 

	    },
	    initDealHandCards:function(context , data){
	    	var gameStartInit = require('GameStartInit');
	    	context=cc.find('Canvas').getComponent('MJDataBind');
	        gameStartInit.initcardwidth();
            let temp = context.cardpool.get();
	        if(temp){
	            let temp_script = temp.getComponent("HandCards") ;
	            context.playercards.push(temp);
	            temp_script.init(data.card);
	            temp_script.lastone();
	            temp.zIndex = 2000; //直接放到最后了，出牌后，恢复 zIndex
	            temp.parent = context.cards_panel ;  //庄家的最后一张牌
	        }   
    	},
    	qujuju: function(data){
    		var gameStartInit = require('GameStartInit');
	        let player = gameStartInit.player(data.userid , this);
	        if (!player) {
	        	return
	        }
	        let opParent;
	        if(player.tablepos == 'current'){
	            opParent = cc.find("Canvas/cards/handcards/current/kongcards") ;
	        }else{
	            opParent = cc.find("Canvas/cards/handcards/"+player.tablepos+"/kongcards") ;
	        }
	        if(opParent.children.length>1){
	            try{
	                opParent.children[opParent.children.length-1].children[1].getComponent('DanAction').jujufei();                  
	            }catch(e){
	                console.log('ohuo');
	            }
	        }
	    },
    }
});
