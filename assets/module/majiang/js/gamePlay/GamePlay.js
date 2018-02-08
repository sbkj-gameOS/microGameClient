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
	     * 新创建牌局，首个玩家加入，进入等待状态，等待其他玩家加入，服务端会推送 players数据
	     * @param data
	     * @param context
	     */
	    //掉线 和上线
	    takecard_event:function(data , context){

	        // context = cc.find('Canvas').getComponent('MajiangDataBind');
	        // cc.sys.localStorage.removeItem('cb');          
	        // context.qujuju(data);
	        // let kongcard ; 
	        // cc.weijifen.audio.playSFX('give.mp3');
	        // let playerss = context.player(data.userid , context);
	        // if(data.ting){
	        //     if(context[playerss.tablepos+'ting'].active ==false){
	        //         context.tingting.active = true ;
	        //         setTimeout(function(){context.tingting.active = false ;},2000);
	        //         context[playerss.tablepos+'ting'].active = true ; 
	        //     }
	        // }
	        // if(data.userid == cc.weijifen.user.id) {
	        //     if(!data.ting){
	        //        context.tingnoaction();
	        // }
	        
	        // let father = cc.find('Canvas').getComponent('MajiangDataBind').selectfather;
	        // if(father.active == true){
	        //     father.active= false;
	        //     father.children[0].children[1].children.splice(0,father.children[0].children[1].children.length);
	        // }
	        

	        //     context.initcardwidth();
	        
	        //     if(data.ting){
	        //         cc.sys.localStorage.setItem('alting','true'); 
	        //         cc.sys.localStorage.setItem('altings','true');  
	        //         cc.sys.localStorage.setItem('take','true');   

	        //     }else{
	        //         cc.sys.localStorage.removeItem('alting');
	        //     }
	        //     if(data.notSend||(cc.sys.localStorage.getItem('take') != 'true'&&!data.allow)){
	        //         return;
	        //     }
	        //     cc.sys.localStorage.removeItem('altake');
	        //     cc.sys.localStorage.removeItem('take');
	        //     for (var inx = 0; inx < context.playercards.length;i++ ) {
	        //         let handcards = context.playercards[inx].getComponent("HandCards");
	        //         handcards.reinit();
	        //         if (data.card == handcards.value) {
	        //             context.playercards[inx].zIndex = 0 ;
	        //             /**
	        //              * 从数组中移除
	        //              */
	        //             context.playercards[inx].parent = null;

	        //             handcards.reinit();
	        //             /**
	        //              * 还回 对象池
	        //              */
	        //             context.cardpool.put(context.playercards[inx]);
	        //             /**
	        //              * 从数组中移除
	        //              */
	        //             context.playercards.splice(inx, 1);
	        //             /**
	        //              * 放到桌面 ， 需要重构
	        //              */
	        //             let desk_card = cc.instantiate(context.takecards_one);
	        //             let temp = desk_card.getComponent("DeskCards");
	        //             temp.init(handcards.value,'B');

	        //             context.deskcards.push(desk_card);
	        //             desk_card.parent = context.deskcards_current_panel;
	                    
	        //         }else{
	        //             handcards.reinit();
	        //             if(handcards.selectcolor == true){
	        //                 context.playercards[inx].zIndex = 1000 + handcards.value ;
	        //             }else{
	        //                 if(handcards.value >= 0){
	        //                     context.playercards[inx].zIndex = handcards.value ;
	        //                 }else{
	        //                     context.playercards[inx].zIndex = 200 + handcards.value ;
	        //                 }

	        //                 if(context.playercards[inx].children[1].active){
	        //                     context.playercards[inx].zIndex = -1;
	        //                 }
	        //             }
	        //             inx = inx + 1 ;     //遍历 ++,不处理移除的 牌
	        //         }
	        //     }
	        //     context.exchange_state("takecard" , context);  //隐藏 提示状态
	        // }else{
	        //     //其他玩家出牌   
	        //     let temp = context.player(data.userid , context) ;
	        //     let cardpanel  , cardprefab , deskcardpanel;
	        //     if(!data.notSend){
	        //     if(temp.tablepos == "right"){
	        //         for(var inx = 0 ; inx < context.right_panel.children.length ; inx++){
	        //             let right_temp = context.right_panel.children[inx].getComponent("SpecCards");
	        //             right_temp.reinit();
	        //         }
	        //         cardpanel = context.right_panel ;
	        //         cardprefab = context.takecards_right ;
	        //         deskcardpanel = context.deskcards_right_panel ;

	        //         let desk_card = cc.instantiate(cardprefab);
	        //         let desk_script = desk_card.getComponent("DeskCards");
	        //         desk_script.init(data.card,'R');
	        //         desk_card.parent = deskcardpanel ;

	        //     }else if(temp.tablepos == "left"){
	        //         for(var inx = 0 ; inx < context.left_panel.children.length ; inx++){
	        //             let left_temp = context.left_panel.children[inx].getComponent("SpecCards");
	        //             left_temp.reinit();
	        //         }
	        //         cardpanel = context.left_panel ;
	        //         cardprefab = context.takecards_left ;
	        //         deskcardpanel = context.deskcards_left_panel ;

	        //         let desk_card = cc.instantiate(cardprefab);
	        //         let desk_script = desk_card.getComponent("DeskCards");
	        //         desk_script.init(data.card,'L');
	        //         desk_card.parent = deskcardpanel ;
	        //     }else if(temp.tablepos == "top"){
	        //         for(var inx = 0 ; inx < context.top_panel.children.length ; inx++){
	        //             let top_temp = context.top_panel.children[inx].getComponent("SpecCards");
	        //             top_temp.reinit();
	        //         }
	        //         cardpanel = context.top_panel ;
	        //         cardprefab = context.takecards_one ;
	        //         deskcardpanel = context.deskcards_top_panel ;

	        //         let desk_card = cc.instantiate(cardprefab);
	        //         let desk_script = desk_card.getComponent("DeskCards");
	        //         desk_script.init(data.card,'B');
	        //         desk_card.parent = deskcardpanel ;
	        //     }
	        //     /**
	        //      * 销毁其中一个对象
	        //      */
	            
	        //         cardpanel.children[cardpanel.children.length - 1].destroy();                
	        //     }
	        // }
	    },
    }
    //出牌



    //摸牌
});
