var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        right_ready: cc.Node,
        left_ready: cc.Node,
        top_ready:cc.Node,
        current_ready:cc.Node,
        right_player: cc.Node,
        left_player: cc.Node,
        top_player: cc.Node,
        current_player:cc.Node,
        ZM:cc.Prefab,
        FM:cc.Prefab,
        godcard:cc.Node,
        desk_cards:{
            default:null ,
            type : cc.Label
        },
        one_card_panel:{
            default:null ,
            type : cc.Node
        },
        cards_panel:{
            default:null ,
            type : cc.Node
        },
        right_panel:{
            default:null ,
            type : cc.Node
        },
        cards_right:{
            default:null ,
            type : cc.Prefab
        },
        top_panel:{
            default:null ,
            type : cc.Node
        },
        cards_top:{
            default:null ,
            type : cc.Prefab
        },
        left_panel:{
            default:null ,
            type : cc.Node
        },
        cards_left:{
            default:null ,
            type : cc.Prefab
        },
        buhua_top:cc.Prefab,
        buhua_lef:cc.Prefab,
        buhua_right:cc.Prefab,
        buhua_my:cc.Prefab,
        takecards_one:{         //我的和 对家出的牌
            default:null ,
            type : cc.Prefab
        },
        takecards_left:{
            default:null ,
            type : cc.Prefab
        },
        takecards_right:{
            default:null ,
            type : cc.Prefab
        },
        csNode:{
            default:null,
            type:cc.Node
        },
    },

    //
    onLoad: function () {
    },
    statics: {
        /**
         * 
         *
         * 方位
         *
         *
         * 色子点数
         *
         * 宝牌/财神
         */
        
        //获取所有玩家信息
        players_event:function(data,context){
            context = cc.find("Canvas").getComponent("MJDataBind");
            var gameStartInit = require('GameStartInit');
            cc.sys.localStorage.setItem(players,data.players.length);
            if(cc.weijifen.state =='init' ||cc.weijifen.state == 'ready'){
                gameStartInit.collect(context) ;    //先回收资源，然后再初始化
                gameStartInit.killPlayers(data);
            }

            //OK手势隐藏
            context.readyNoActive(context);        
            

            var inx = 0 ;
            context.arry = [];
            var players = context.playersarray; 
            // player 是 配合 joinroom  joinroom 加入房间  立即显示  然后 player 记录数据   下一个玩家 根据 player 来完成之前的渲染 用joinroom 完成之后的   一旦完成joinroom  又发起player 进行存储
            for(let i=0 ;i<data.players.length;i++){
                if(data.players[i]!=null){
                    var time = data.players[i].createtime;
                    context.arry.push(time);
                    if(data.players[i].id == cc.weijifen.user.id ){
                        var mytime = context.arry.length;
                    }
                }
            }
            if(cc.weijifen.playerNum==2){
                if(mytime==1){
                    gameStartInit.dong(0);
                    gameStartInit.publicData(0,data,'current',context.current_player,0,0,context);
                    if(data.players.length==2){          
                        gameStartInit.publicData(1,data,'top',context.top_player,1,2,context);
                    }
                }else{
                    gameStartInit.dong(2);
                    gameStartInit.publicData(0,data,'top',context.top_player,1,2,context);
                    gameStartInit.publicData(1,data,'current',context.current_player,0,0,context);
                }       
            }else if(cc.weijifen.playerNum==3){
                if(mytime==1){
                    gameStartInit.dong(0);                
                    gameStartInit.publicData(0,data,'current',context.current_player,0,0,context);
                    if(data.players.length==2){          
                        gameStartInit.publicData(1,data,'right',context.right_player,0,1,context);        
                    }else if(data.players.length==3){
                        gameStartInit.publicData(1,data,'right',context.right_player,0,1,context);        
                        gameStartInit.publicData(2,data,'top',context.top_player,1,2,context);
                    }
                }else if(mytime==2){
                    gameStartInit.dong(1);                
                    gameStartInit.publicData(0,data,'top',context.top_player,1,2,context);
                    gameStartInit.publicData(1,data,'current',context.current_player,0,0,context);
                    if(data.players.length==3){
                        gameStartInit.publicData(2,data,'right',context.right_player,0,1,context);        
                    }
                }else if(mytime==3){
                    gameStartInit.dong(2);                
                    gameStartInit.publicData(0,data,'right',context.right_player,0,1,context);
                    gameStartInit.publicData(1,data,'top',context.top_player,1,2,context);
                    gameStartInit.publicData(2,data,'current',context.current_player,0,0,context);
                }
            }else{
                if(mytime==1){
                    gameStartInit.dong(0);                
                    gameStartInit.publicData(0,data,'current',context.current_player,0,0,context);
                    if(data.players.length==2){          
                        gameStartInit.publicData(1,data,'right',context.right_player,0,1,context);         
                    }else if(data.players.length ==3){
                        gameStartInit.publicData(1,data,'right',context.right_player,0,1,context);
                        gameStartInit.publicData(2,data,'top',context.top_player,1,2,context);                         
                    }else if(data.players.length ==4){
                        gameStartInit.publicData(1,data,'right',context.right_player,0,1,context);    
                        gameStartInit.publicData(2,data,'top',context.top_player,1,2,context);                
                        gameStartInit.publicData(3,data,'left',context.left_player,2,3,context);                                      
                    }
                }else if(mytime == 2){
                    gameStartInit.dong(3);                
                    gameStartInit.publicData(0,data,'left',context.left_player,2,3,context);
                    gameStartInit.publicData(1,data,'current',context.current_player,0,0,context);         
                    if(data.players.length ==3){
                        gameStartInit.publicData(2,data,'right',context.right_player,0,1,context);
                    }else if(data.players.length ==4){
                        gameStartInit.publicData(2,data,'right',context.right_player,0,1,context);          
                        gameStartInit.publicData(3,data,'top',context.top_player,1,2,context);         
                    }
                }else if(mytime ==3){
                    gameStartInit.dong(2);                
                    gameStartInit.publicData(0,data,'top',context.top_player,1,2,context);  
                    gameStartInit.publicData(1,data,'left',context.left_player,2,3,context);
                    gameStartInit.publicData(2,data,'current',context.current_player,0,0,context);                     
                    if(data.players.length ==4){
                        gameStartInit.publicData(3,data,'right',context.right_player,0,1,context);       
                    }
                }else if(mytime == 4){
                    gameStartInit.dong(1);                
                    gameStartInit.publicData(0,data,'right',context.right_player,0,1,context);
                    gameStartInit.publicData(1,data,'top',context.top_player,1,2,context);
                    gameStartInit.publicData(2,data,'left',context.left_player,2,3,context);               
                    gameStartInit.publicData(3,data,'current',context.current_player,0,0,context);
                }
            }     
            var peo = context.playersarray;
            if(cc.weijifen.state =='ready' || cc.weijifen.state =='init'){
                //context.windFW(context);
                for(let i = 0 ; i< data.players.length;i++){
                    
                    for(let j=0; j<peo.length; j++){
                        var py = peo[j].getComponent('MaJiangPlayer');
                        if(data.players[i].id == py.data.id){
                            if(data.players[i].status&&data.players[i].status=='READY'){
                                gameStartInit.readyTrue(py.tablepos,context);                   
                            }
                        }
                    }
                }
            }
            if(cc.weijifen.state !='ready' && cc.weijifen.state !='init'){
                if(cc.weijifen.playType != "LG"){
                    // context.windFW(context);
                }
            }
        },

         /**
         * 接受新的庄家数据
         * @param data
         * @param context
         */
        banker_event:function(data, context){
            context = cc.find('Canvas').getComponent('MJDataBind');
            for(var inx = 0 ; inx<context.playersarray.length ; inx++){
                let temp = context.playersarray[inx].getComponent("MaJiangPlayer") ;
                if(data.userid == cc.weijifen.user.id){
                    cc.weijifen.bankers =true;
                }else{
                    cc.weijifen.bankers =false;
                }
                if(temp.data.id == data.userid){
                    cc.weijifen.banker = data.userid;
                    temp.banker(); 
                    break ;
                }
            }
        },

        /**
         * 接收发牌信息，需要根据玩家位置确定是哪家的牌
         * @param data
         * @param context
         */
        play_event:function(data , context){
            context = cc.find('Canvas').getComponent('MJDataBind');
            var gameEvent = require('GameEvent');
            //比赛倒计时设置为隐藏
            if(context.starttime.node.parent.active ==true){
                context.starttime.node.parent.active =false;
            }
            var gameStartInit = require('GameStartInit');
            var gameEvent = require('GameEvent');
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            gameStartInit.reinitGame(context);
            for(let h=0 ;h<data.players.length;h++){
                var players = data.players[h];
                //这里有一个判定 如果是重连的话 就不用setouttime   
                if(data.player.played||players.played||data.player.actions.length>0||players.action){
                    cc.sys.localStorage.setItem('cb','true');
                }
            }
            context.loadding();                                                
            if(cc.find('Canvas/summary')){
                cc.find('Canvas/summary').destroy();
            }
            {
                cc.sys.localStorage.setItem('clear','true');
                var bth = cc.find('Canvas/bg/center/button/readybtn');
                bth.active =true;  
                bth.x= -10;
                var laizi = cc.find('Canvas/cards/tesucards/baocard/child').children
                if(laizi){
                    for(let i =0 ; i < laizi.length ; i ++ ){
                        cc.find('Canvas/cards/tesucards/baocard/child').children[i].destroy();
                    }
                }     
            }
            if(cc.find('Canvas/notice')){
                cc.sys.localStorage.setItem('notice','true');
                cc.find('Canvas/notice').active = false;
            }
            if(cc.weijifen.playType != "LG"){
                // context.windFW(context);//显示东南西北
            }
            cc.weijifen.baopai = null;
            context.roomInfo.active = true;    
            let quanNum = cc.find('Canvas/roomNum').getChildByName('quan')._components[0];// quan节点            
            quanNum.string = (data.round+1) +'/'+context.maxRound;//圈数
            let wanfa = cc.find('Canvas/rules').getChildByName('label')._components[0];// quan节点   
            if(cc.weijifen.GameBase.gameModel == 'jx'){
                wanfa.string = '座风 座花 双头子 风字百搭 19百搭 漂百搭';
            }else{
                wanfa.string = data.op;
            }
            cc.weijifen.wanfa = data.op;
            context.readyNoActive(context);   
            /**
             * 改变状态，开始发牌
             * 
             */
            if(cc.weijifen.playerNum){
                var peoNum = cc.weijifen.playerNum;
            }
            //开局后  头像位移到相应位置
            {
            var action = cc.moveTo(0.2,570,80);
            context.right_player.runAction(action);
            var action = cc.moveTo(0.2,-570,80);
            context.left_player.runAction(action);
            var action = cc.moveTo(0.2,439,324);
            context.top_player.runAction(action);
            }
            //游戏开始 干掉打牌和听得缓存
            
            cc.sys.localStorage.removeItem('take');
            cc.sys.localStorage.removeItem('ting') ;        
            context.exchange_state("begin" , context);
            var temp_player = data.player ;
            var cards = context.decode(temp_player.cards);
            

            if(cc.weijifen.GameBase.gameModel == 'wz'){
                if(temp_player.powerCard){
                    var powerCard = context.decode(temp_player.powerCard);
                    cc.weijifen.powerCard = powerCard;
                    gameStartInitNode.csNode.active = true;
                    //切换财神图片
                    var sprite = gameStartInitNode.csNode.getComponent(cc.Sprite);
                    if(powerCard&&powerCard.length>0){
                        for(let i=0 ; i<cc.find('Canvas/cards/tesucards/baocard/child').children.length;i++){
                            cc.find('Canvas/cards/tesucards/baocard/child').children[i].destroy();
                        }
                        cc.weijifen.baopai = powerCard;
                        for(let i= 0 ; i<powerCard.length;i++){
                            cc.weijifen.caishenCard += powerCard[i]+",";
                            var laiziZM = cc.instantiate(gameStartInitNode.ZM);
                            laiziZM.parent = gameStartInitNode.godcard.children[1];
                            var LZH  = laiziZM.getComponent('DeskCards');
                            LZH.init(powerCard[i],'B',true);
                        }
                    }
                }
            }else{
                cc.find('Canvas/cards/tesucards/baocard').active =true;
                if(data.player.powerCard){
                    let cards = context.decode(data.player.powerCard);
                    //cc.find('Canvas/cards/tesucards/baocard/baocard/card').children[0].destroy();
                    for(let i= 0 ; i<cards.length;i++){
                        var laiziZM = cc.instantiate(gameStartInitNode.ZM);
                        laiziZM.parent = gameStartInitNode.godcard.children[1];
                        var LZH  = laiziZM.getComponent('DeskCards');
                        LZH.init(cards[i],'B',true);
                    }
                }else{
                    cc.find('Canvas/cards/tesucards/baocard/child').x = -560;                
                    var laiziFM = cc.instantiate(gameStartInitNode.FM);
                    var LZH = laiziFM.getComponent('DeskCards');
                    LZH.init(-3,'Z',true);
                    laiziFM.parent = gameStartInitNode.godcard.children[1];
                }
            }

            //当前玩家补花 data.player
            var buhua;
            if(temp_player.buHua){
                buhua = context.decode(temp_player.buHua);//补花
                console.log(buhua);
                let temp = gameStartInit.player(temp_player.playuser, context);
                for(var i = 0;i<buhua.length;i++){
                    gameStartInit.buhuaModle(buhua[i],temp.tablepos,'',temp.tablepos,context,"");
                }
            }

            //其他玩家补花 data.players
            for(var i = 0; i <data.players.length;i++){
                if(data.players[i].buHua){
                    buhua = context.decode(data.players[i].buHua);//补花
                    console.log(buhua);
                    let temp = gameStartInit.player(data.players[i].playuser, context);
                    //console.log(temp.tablepos);
                    for(var j = 0;j<buhua.length;j++){
                        gameStartInit.buhuaModle(buhua[j],temp.tablepos,'',temp.tablepos,context,"");
                    }
                }
            }
            

            //var cards = temp_player.cards;
            setTimeout(function(){
                gameStartInit.calcdesc_cards(gameStartInitNode , 136 , data.deskcards) ;
            } , 0) ;
            var groupNums = 0 ;
            var pTimes;
            if(cc.weijifen.GameBase.gameModel =='wz'){
                pTimes = 5;
            }else{
                pTimes = 4;
            }
            for(var times = 0 ; times < pTimes ; times++){
                for(let h=0 ;h<data.players.length;h++){
                    var players = data.players[h];
                    //这里有一个判定 如果是重连的话 就不用setouttime   
                    if(data.player.played||players.played||data.player.actions.length>0||players.action){
                        //cc.sys.localStorage.setItem('cb','true');
                        gameStartInit.initMjCards(groupNums , context , cards , temp_player.banker) ;
                        /**
                         * 初始化其他玩家数据
                         */
                        var inx = 0 ;
                        var sabi = 0;
                        for(var i=0 ; i<data.players.length ; i++){
                            if(data.players[i].playuser != cc.weijifen.user.id){               
                                //通过判断 id 来确定位置上的牌的张数
                                var arry = context.playersarray;
                                for(let j =0 ; j< arry.length;j++){
                                    var card = arry[j].getComponent('MaJiangPlayer');                            
                                    if(data.players[i].playuser==card.data.id&&card.tablepos!='current'){
                                        if(card.tablepos=='left'){
                                            sabi = 2;
                                            break;
                                        }else if(card.tablepos=='top'){
                                            sabi = 1;
                                            break;
                                        }   
                                        sabi=0;
                                        break;
                                    }
                                }
                                gameStartInit.initPlayerHandCards(groupNums , data.players[inx++].deskcards , sabi,context ,false, data.players[i].banker,peoNum);
                            }
                        }
                        groupNums = groupNums + 1 ;
                    }else{
                        setTimeout(function(){
                            gameStartInit.initMjCards(groupNums , context , cards , temp_player.banker) ;
                            /**
                             * 初始化其他玩家数据
                             */
                            var inx = 0 ;
                            var sabi = 0;
                            for(var i=0 ; i<data.players.length ; i++){
                                if(data.players[i].playuser != cc.weijifen.user.id){
                                    
                                    //通过判断 id 来确定位置上的牌的张数
                                    var arry = context.playersarray;
                                    for(let j =0 ; j< arry.length;j++){
                                        var card = arry[j].getComponent('MaJiangPlayer');                            
                                        if(data.players[i].playuser==card.data.id&&card.tablepos!='current'){
                                            if(card.tablepos=='left'){
                                                sabi = 2;
                                                break;
                                            }else if(card.tablepos=='top'){
                                                sabi = 1;
                                                break;
                                            }   
                                            sabi=0;
                                            break;
                                        }
                                    }
                                    gameStartInit.initPlayerHandCards(groupNums , data.players[inx++].deskcards , sabi,context ,false, data.players[i].banker,peoNum);
                                }
                            }
                            groupNums = groupNums + 1 ;
                        } , (times+1) * 200);
                    }    
                }
            }
            setTimeout(function(){
                // cc.weijifen.audio.playSFX('shuffle.mp3');            
                let ani = gameStartInitNode.cards_panel.getComponent(cc.Animation);
                // ani.play("majiang_reorder") ;
                var maxvalue  = -100;
                var maxvalluecard ;
                //排序 
                for(var i=0 ; i<context.playercards.length ; i++ ){
                    if(context.playercards[i].children[1].active == false){
                        let temp_script = context.playercards[i].getComponent("HandCards") ;
                        if(temp_script.value >= 0){
                            context.playercards[i].zIndex = temp_script.value ;
                        }else{
                            context.playercards[i].zIndex = 200+ temp_script.value ;
                        }
                        if(context.playercards[i].zIndex > maxvalue){
                            maxvalue = context.playercards[i].zIndex ;
                            maxvalluecard = context.playercards[i] ;
                        } 
                    }

                }
                gameStartInit.initcardwidth(); 
                if(temp_player.banker == true&&!data.player.played){
                    //maxvalluecard.getComponent("HandCards").lastone() ;
                }         
            } , 1000);
            setTimeout(function(){
                if(cc.sys.localStorage.getItem('cb')!='true'){
                    context.exchange_state("play" , context);                
                }
            } , 1500)

            /**
             * 统一处理排序 的动画
             */

            /**
             * 初始化状态，首个玩家加入，然后开始等待其他玩家 ， 如果是 恢复数据， 则不会进入
             */
            //gameStartInit.statusbtn.active = true ;
            //ljh改  神牌
            
                
            
            setTimeout(function(){
                //重连判断action
                var istake =false;
                for(let i=0;i<data.players.length;i++){
                    if(data.players[i].played){
                        istake =true;
                    }
                    if(data.players[i].actions.length>0){
                        istake=true;
                    }
                    if(data.players[i].ting){
                        let playerss = gameStartInit.player(data.players[i].playuser , context);
                        context[playerss.tablepos+'ting'].active = true;
                    }
                }
                if(data.player.banker == true){
                    let datas ={};
                    datas.userid = data.player.playuser;
                    gameStartInit.banker_event(datas,context);
                }
                if(data.player.ting){
                    context.currentting.active = true ; 
                    cc.sys.localStorage.setItem('alting','true');
                    cc.sys.localStorage.setItem('altings','true');
                    cc.sys.localStorage.setItem('take','true')
                    context.tingAction(true);                
                }
                //如果自己有已经打的牌或者其他人有打牌 或者有action的时候
                if(data.player.played||istake||data.player.actions.length>0){
                    cc.sys.localStorage.setItem('cl','true');
                    //重连判断deskcard
                    if(data.player.played){
                        var deskcards  = context.decode(data.player.played);
                        for(let i=0;i <deskcards.length;i++){
                            let desk_card = cc.instantiate(gameStartInitNode.takecards_one);
                            let temp = desk_card.getComponent("DeskCards");
                            temp.init(deskcards[i],'B');
                            context.deskcards.push(desk_card);
                            desk_card.parent = context.deskcards_current_panel;
                        }
                    }
                    var action = data.player.actions;
                    for(let i = 0;i< action.length;i++){
                        var isGang = false;
                        var cards = context.decode(action[i].card);
                        //console.log(cards);
                        
                        if(action[i].type =='an'){
                            isGang =true;
                        }
                        if(cards.length<4||isGang||action[i].action=='gang'||action[i].action=='peng'||action[i].action=='chi'){
                            if(action[i].action=='gang'&&cards.length==1){
                                let a =cards.concat(cards);
                                let b = a.concat(a)
                                gameEvent.cardModle(b,cc.find('Canvas/cards/handcards/current/kongcards'),isGang,'',context,action[i].action);  
                            }else{
                                function sortNumber(a,b){return a - b}
                                cards.sort(sortNumber);
                                gameEvent.cardModle(cards,cc.find('Canvas/cards/handcards/current/kongcards'),isGang,'',context,action[i].action);  
                            }
                        }else {
                            var a = cards.slice(0,3);
                            gameEvent.cardModle(a,cc.find('Canvas/cards/handcards/current/kongcards'),isGang,'',context,action[i].action);
                            for(let h =3 ; h<cards.length; h++){
                                gameEvent.selectaction_event({userid:cc.weijifen.user.id,cards:[cards[h]],card:-1,action:'dan'},context);            
                            }            
                        }
                    }
                }  
                    //重连判断 其他人的desk和action
                    for(let i=0 ; i< data.players.length;i++){
                        //判断谁是庄家
                    var player = gameStartInit.player(data.players[i].playuser, context);
                    var datas={}
                    if(data.players[i].banker==true){
                        datas.userid = data.players[i].playuser;
                        gameStartInit.banker_event(datas,context);
                    }
                    //其他玩家的kong 牌
                    if(data.touchPlay ){
                        let player = gameStartInit.player(data.touchPlay , context)
                        context.exchange_searchlight(player.tablepos , context);
                        if(data.touchPlay == cc.weijifen.user.id){
                            cc.sys.localStorage.setItem('take','true');
                        }   
                    }
                    if(!data.player.played&&data.player.banker){
                        //cc.sys.localStorage.setItem('take','true');
                    }
                    if(data.players[i].actions.length>0){            
                        var action = data.players[i].actions;                    
                        for(let j =0 ; j< action.length ;j++){
                            var isGang =false;
                            var cards = context.decode(action[j].card);
                            
                            if(action[j].type =='an'){
                                isGang =true;
                            }
                            if(cards<4||isGang||action[j].action=='gang'||action[j].action=='peng'||action[j].action=='chi'){
                                if(action[j].action=='gang'&&cards.length==1){
                                    let a =cards.concat(cards);
                                    let b = a.concat(a)
                                    gameEvent.cardModle(b,cc.find('Canvas/cards/handcards/'+player.tablepos+'/kongcards'),isGang,player.tablepos,context,action[j].action);   
                                }else{
                                    function sortNumber(a,b){return a - b}
                                    cards.sort(sortNumber);
                                    gameEvent.cardModle(cards,cc.find('Canvas/cards/handcards/'+player.tablepos+'/kongcards'),isGang,player.tablepos,context,action[j].action);   
                                }
                                }else {
                                let a = cards.slice(0,3);
                                gameEvent.cardModle(a,cc.find('Canvas/cards/handcards/'+player.tablepos+'/kongcards'),isGang,player.tablepos,context,action[j].action);
                                for(let h =3 ; h<cards.length; h++){
                                    gameEvent.selectaction_event({userid:player.data.id,cards:[cards[h]],card:-1,action:'dan'},context)                             
                                }                        
                            }                
                        }
                    }
                    //其他玩家的桌牌     
                    if(data.players[i].played){
                        var deskcardss = context.decode(data.players[i].played); 
                        var player = gameStartInit.player(data.players[i].playuser, context);
                        for(let j =0 ; j< deskcardss.length;j++){
                            gameStartInit.initDeskCards(deskcardss[j],player.tablepos,context)
                        }
                    }
                } 
                    context.closeloadding();
                    if(cc.weijifen.playType =='LG'){
                        context.lgdong(data);
                    }
            },2000)      
        },

        /**
         * 回收系统资源，用于清理资源
         * @param context
         */
        collect:function(context){
            for(var i=0 ; i<context.playersarray.length ; ){
                let player = context.playersarray[i] ;
                var playerscript = player.getComponent("MaJiangPlayer");
                if(playerscript.data.id != cc.weijifen.user.id){       //当前 玩家不回收，最终 Destroy 的时候会被回收
                    context.playerspool.put(player);
                    context.playersarray.splice(i,1) ;
                }else{
                    i++ ;
                }
            }
        },
        dong: function(count){
            cc.weijifen.bankercount = count;         
        },
        publicData:function(inx,data,fangwei,OPparent,int,count,context){
            if(cc.sys.localStorage.getItem(fangwei)!=data.players[inx].id){
                let player0 = context.playerspool.get();
                let playerscript0 = player0.getComponent("MaJiangPlayer");
                player0.setPosition(0,0);
                context.playersarray.push(player0) ;
                player0.parent = OPparent;
                playerscript0.init(data.players[inx] , int , fangwei,count);                
                cc.sys.localStorage.setItem(fangwei,data.players[inx].id);
                cc.sys.localStorage.setItem('count',count);                                  
            }   
        },
        killPlayers: function(data){
            cc.sys.localStorage.removeItem('top');
            cc.sys.localStorage.removeItem('left');
            cc.sys.localStorage.removeItem('right');
            let players = data.players.length;
            let count = cc.sys.localStorage.getItem('count');
            if(Number(count)==players&&cc.weijifen.match == 'true'){
                cc.sys.localStorage.setItem('count',String(Number(count)-1));
            }

            cc.weijifen.playersss = data.players.length;
        },
        initDeskCards: function(card,fangwei,context){
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            if(fangwei =='left'){
                let desk_card = cc.instantiate(gameStartInitNode.takecards_left);
                let desk_script = desk_card.getComponent("DeskCards");
                desk_script.init(card,'L');
                desk_card.parent = context.deskcards_left_panel ;
            }else if(fangwei == 'right'){
                let desk_card = cc.instantiate(gameStartInitNode.takecards_right);
                let desk_script = desk_card.getComponent("DeskCards");
                desk_script.init(card,'R');
                desk_card.parent = context.deskcards_right_panel ;
            }else if(fangwei=='top'){
                let desk_card = cc.instantiate(gameStartInitNode.takecards_one);
                let desk_script = desk_card.getComponent("DeskCards");
                desk_script.init(card,'B');
                desk_card.parent = context.deskcards_top_panel ;
            }   
        },
        reinitGame: function(context){
            context = cc.find('Canvas').getComponent('MJDataBind');
            var gameStartInit = require('GameStartInit');
            gameStartInit.tingnoaction();        
            gameStartInit.destroycards('current',context);
            gameStartInit.destroycards('left',context);
            gameStartInit.destroycards('right',context);
            gameStartInit.destroycards('top',context);
            gameStartInit.destroyPlayer(context);  
            gameStartInit.tingactivefalse();  
            gameStartInit.inintBuHuan();
            //清空补花数据
            gameStartInit.destroybuhuas('left',context);
            gameStartInit.destroybuhuas('right',context);
            gameStartInit.destroybuhuas('top',context);
            gameStartInit.destroybuhuas('current',context);

            cc.sys.localStorage.removeItem('altake');
            cc.sys.localStorage.removeItem('alting');
            cc.sys.localStorage.removeItem('altings');
            cc.sys.localStorage.removeItem('guo');
            cc.sys.localStorage.removeItem('cb');        
            
         },

        tingnoaction:function(){
            let length =cc.find('Canvas/cards/handcards/current/currenthandcards').children.length;
            for(let i =0; i<length;i++){
                let cards =cc.find('Canvas/cards/handcards/current/currenthandcards').children[i];
                let button = cc.find('Canvas/cards/handcards/current/currenthandcards').children[i].children[0];
                let handCards = cards.getComponent("HandCards");
                handCards.cardvalue.color = new cc.Color(255, 255, 255);
                button.getComponent(cc.Button).interactable= true;
            }
            if(cc.find('Canvas/tingselect')){
                cc.find('Canvas/tingselect').active = false;
            }
        },
        destroyPlayer: function(context){
            var array = context.playersarray;
            for(let i=0;i<array.length;i++){
                array[i].getComponent('MaJiangPlayer').creator.active =false;
                //array[i].getComponent('MaJiangPlayer').nowind();
            }
         },
        destroycards :function(fangwei,context){
            let handcard =cc.find('Canvas/cards/handcards/'+fangwei+'/'+fangwei+'handcards').children.length;
            let deskcard =cc.find('Canvas/cards/deskcards/'+fangwei+'').children.length;
            let kong =cc.find('Canvas/cards/handcards/'+fangwei+'/kongcards').children.length;
            if(fangwei == 'current'){
                for(let i =0 ; i< handcard; i++){
                    let handcards = context.playercards[i].getComponent("HandCards");
                    handcards.csImageTop.active = false;
                    handcards.target.zIndex = 0;
                    handcards.target.children[0].getComponent(cc.Button).enabled = true;
                    handcards.cardvalue.color = new cc.Color(255, 255, 255);
                    handcards.reinit();
                    context.cardpool.put(context.playercards[i]);
                    }
                    context.playercards = [];
            }else{
                for(let i =0 ; i< handcard; i++){
                    cc.find('Canvas/cards/handcards/'+fangwei+'/'+fangwei+'handcards').children[i].destroy();
                }
                    if(fangwei == 'leftdesk'){
                       context.leftcards=[];
                    }else if(fangwei == 'rightdesk'){
                       context.rightcards=[];
                    }else{
                       context.topcards=[];                                                          
                    }   
            }
            for(let i = 0;i< deskcard;i++ ){
                cc.find('Canvas/cards/deskcards/'+fangwei+'').children[i].destroy();
                    
            }
            for(let i = 1;i< kong;i++ ){
                cc.find('Canvas/cards/handcards/'+fangwei+'/kongcards').children[i].destroy();
            }
        },
        tingactivefalse: function(){
             // gameStartInit.currentting.active =false;
             // gameStartInit.topting.active =false;
             // gameStartInit.rightting.active =false;
             // gameStartInit.leftting.active =false;
         },
         inintBuHuan: function(){
            cc.weijifen.powerCard = null;  
         },
         destroybuhuas:function(fangwei,context){
            let buhua,buhuaList;
            buhuaList = cc.find('Canvas/cards/tesucards/huacard/'+fangwei+'');
            for(let i = 0;i< buhuaList.children.length;i++ ){
                buhuaList.children[i].destroy(); 
            }
         },
         /**
         * 显示 剩余牌
         * @param start
         * @param end
         */
        calcdesc_cards:function(context ,start , end){
            var gameStartInit = require('GameStartInit');
            start = start - 1 ;
            if(start > end){
                context.desk_cards.string = start ;
                setTimeout(function(){
                    gameStartInit.calcdesc_cards(context , start , end ) ;
                } , 5) ;
            }
        },

        initMjCards:function(group , context , cards , banker){
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            //context = cc.find('Canvas').getComponent('MajiangDataBind');        
            for(var i=group*4 ; i< cards.length && i<(group+1)*4 ; i++){
                if(context.cardpool){
                    let temp = context.cardpool.get();
                    let temp_script = temp.getComponent("HandCards") ;
        
                    context.playercards.push(temp);
        
                    temp_script.init(cards[i]);
        
                    if(banker == true && i == (cards.length - 1)){
                        temp.parent = gameStartInitNode.one_card_panel ;  //庄家的最后一张牌
                    }else{
                        temp.parent = gameStartInitNode.cards_panel ;
                    }
        
                    setTimeout(function(){
                        temp.parent = gameStartInitNode.cards_panel ;
                    } , 200) ;
                }   
            }
        },

        /**
         * 初始化其他玩家手牌，
         * @param groupNums
         * @param deskcards
         * @param inx
         * @param context
         * @param spec 是否特殊的牌，即刚抓起来的牌
         */
        initPlayerHandCards:function(groupNums , deskcards , inx , context , spec,banker,peoNum){
            var gameStartInit = require('GameStartInit');
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            let parent = gameStartInitNode.right_panel;
            let cardarray = context.rightcards;
            let prefab = gameStartInitNode.cards_right ;
            if(peoNum == 2){
                parent = gameStartInitNode.top_panel  ;
                cardarray = context.topcards   ;
                prefab = gameStartInitNode.cards_top ;
            }else if(peoNum ==3&&inx ==1){
                parent = gameStartInitNode.top_panel  ;
                cardarray = context.topcards   ;
                prefab = gameStartInitNode.cards_top ;
            }else{   
                if(inx == 1){
                    parent = gameStartInitNode.top_panel  ;
                    cardarray = context.topcards   ;
                    prefab = gameStartInitNode.cards_top ;
                }else if(inx == 2){
                    parent = gameStartInitNode.left_panel  ;
                    cardarray = context.leftcards;
                    prefab = gameStartInitNode.cards_left ;
                }
            }
          
            gameStartInit.initOtherCards(groupNums , context , deskcards , prefab , cardarray , parent , spec , inx,banker);    //左侧，
        },
        initOtherCards:function(group , context , cards , prefab , cardsarray, parent , spec , inx,banker){
            context = cc.find('Canvas').getComponent('MJDataBind');        
            for(let i = 0 ; i < parent.children.length; i ++){
                parent.children[i].getComponent('SpecCards').node.height = 0;
                parent.children[i].getComponent('SpecCards').node.width = 0 ;
            }
            for(var i=group*4 ; i< cards && i<(group+1)*4 ; i++) {
                let temp = cc.instantiate(prefab) ;
                let temp_script = temp.getComponent("SpecCards") ;
                temp_script.init(spec,inx);

                temp.parent = parent ;
                cardsarray.push(temp) ;
            }
        },
        /**
         * 此为恢复麻将状态  1、宽度 2、缩回来 3、颜色 
         * ting  true 为听牌时的状态
         */
        initcardwidth: function(ting){
            let length  = cc.find('Canvas/cards/handcards/current/currenthandcards').children.length; 
            for(let i =0; i<length;i++){
                let target =cc.find('Canvas/cards/handcards/current/currenthandcards').children[i];
                let card = target.getComponent('HandCards');
                card.take=false;
                if(cc.weijifen.cardNum > 14){ 
                    card.cardvalue.width = 67.5;
                    card.cardvalue.height = 102.5;
                    target.width=65.5;
                }else{
                    target.width=73;    
                }
                card.target.y = 0; 
                //ting牌的时候 和 财神的牌是灰色的   听牌听完恢复 财神为持续状态
                if(!ting&&!card.caishen&&cc.sys.localStorage.getItem('ting')!='true'){
                    card.cardvalue.color = new cc.Color(255, 255, 255); 
                }
            }
            cc.find('Canvas/cards/handcards/current/currenthandcards').sortAllChildren();
        },
        player:function(pid , context){
            let player ;
            context= cc.find('Canvas').getComponent('MJDataBind');
            for(var inx = 0 ; inx<context.playersarray.length ; inx++){
                let temp = context.playersarray[inx].getComponent("MaJiangPlayer") ;
                if(temp.data.id == pid){
                    player = temp ; break ;
                }
            }
            return player ;
        },
        buhuaModle:function(cards,parent,back,fangwei,context,action){
            let opParent = cc.find("Canvas/cards/tesucards/huacard/"+parent+"");
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            var card,temp;
            if(fangwei == 'top'){
                card = cc.instantiate(gameStartInitNode.buhua_top);
                temp = card.getComponent('BuHuaAction');
            }else if(fangwei == 'left'){
                card = cc.instantiate(gameStartInitNode.buhua_lef);
                temp = card.getComponent('BuHuaAction');
            }else if(fangwei == 'right'){
                card = cc.instantiate(gameStartInitNode.buhua_right);
                temp = card.getComponent('BuHuaAction');
            }else{
                card = cc.instantiate(gameStartInitNode.buhua_my);
                temp = card.getComponent('BuHuaAction');
            }
            // for(var i = 0; i<cards.length;i++){
                //填充内容元素
                temp.init(cards,fangwei);
                //挂载父节点元素
                card.parent = opParent;
            // }
        },
        readyTrue: function(fangwei,context){
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            if(fangwei == 'left'){
                gameStartInitNode.left_ready.active = true;
            }else if(fangwei=='right'){
                gameStartInitNode.right_ready.active = true;
            }else if(fangwei == 'top'){
                gameStartInitNode.top_ready.active = true ;
            }else if(fangwei == 'current'){
                gameStartInitNode.current_ready.active = true ;          
            }
        },
        findCardForKong: function(kong,card,action) {
            var resNode ;
            var isGang ;
            var cardNum;
            //遍历整个kong 的子集  cards、
            for ( let i = 0 ; i < kong.children.length ; i++ ) {
                var cards = kong.children[i] ;
                var kcards = cards.getComponent('Kongcards');
                var kaction = kcards.action;//获取 事件
                var length = kcards.length;    //获取子集长度
                var type =kcards.type; //获取类型  当为dan 事件时用来判定
                
                var cardcolors = parseInt(card/4 ) ;
                var cardtype  = parseInt(cardcolors / 9);
                var dans = cards.children ;
                //当这个牌是妖姬时
                if(cardtype==2&& parseInt((card%36)/4)==0&&cards.children.length>0&&type!='yao'&&action=='dan'&&kaction =='dan'){
                    resNode = cards ;
                    cardNum = 0;
                    isGang = false;
                    break;
                //当这个牌不是妖姬时
                }else{
                    //cards是peng   action 为gang时
                    if(action == 'gang'&&dans.length>0&kaction == 'peng'){
                        for(let j = 0 ; j<dans.length; j++){
                            var cardUnit = dans[j] ;
                            if ((parseInt((card%36)/4 ) == cardUnit.getComponent("DanAction").mjvalue &&parseInt(card / 36)==cardUnit.getComponent("DanAction").cardtype)||(card<0&&parseInt(card/4 )==cardUnit.getComponent("DanAction").cardcolors)){
                                resNode = cards ;
                                cardNum = j;
                                isGang = true;
                                break;
                            }
                        }
                    //当action 为dan
                    }else if(action == kaction&&dans.length>0){
                        isGang = false;
                        //有两种情况  一种长度为4 和长度为3   
                       
                        for(let j = 0 ; j<dans.length; j++){

                            var cardUnit = dans[j] ; 
                            
                            if(dans.length ==3 &&type=='wind'&&parseInt(card/4 )>=-7&&parseInt(card/4 )<=-4){
                                isGang =true;
                                for(let h = 0 ; h< dans.length;h++){
                                    let cardUnit = dans[h]
                                    if ( parseInt(card/4 ) == cardUnit.getComponent("DanAction").cardcolors ){
                                        isGang = false;
                                        resNode = cards;
                                        cardNum = h;
                                        break;              
                                    }
                                        resNode = cards;
                                        cardNum = h; 
                                }
                                break;  
                            }else if(card <0&&((type=='wind'&&parseInt(card/4 )>=-7&&parseInt(card/4 )<=-4)||(type =='xi'&&parseInt(card/4 )>=-3&&parseInt(card/4 )<=-1))){
                                if ( parseInt(card/4 ) == parseInt(cardUnit.getComponent("DanAction").value/4) ){   
                                    resNode = cards ;
                                    cardNum = j;
                                    break;
                                }else if(cardUnit.getComponent("DanAction").cardtype == 2 && parseInt((cardUnit.getComponent("DanAction").value%36)/4) == 0){
                                    cardUnit.getComponent("DanAction").setValue(card);
                                    resNode = cards ;
                                    cardNum = j;
                                    break;
                                }
                            }else if(card >0&&((type == 'yao'&&parseInt((card%36)/4 )==0)||(type == 'jiu'&&parseInt((card%36)/4 )==8))){
                                if(parseInt((card%36)/4 ) == parseInt((cardUnit.getComponent("DanAction").value%36)/4 )&&parseInt(cardUnit.getComponent("DanAction").value/36)==parseInt(card/36)){
                                    resNode = cards ;
                                    cardNum = j;
                                    break;
                                }else if(cardUnit.getComponent("DanAction").cardtype == 2 && parseInt((cardUnit.getComponent("DanAction").value%36)/4) == 0){
                                    cardUnit.getComponent("DanAction").setValue(card);
                                    resNode = cards ;
                                    cardNum = j;
                                    break;
                                }
                            }
                        }
                    }
                }
            }   
            return {cardNode:resNode,isGang:isGang,cardNum:cardNum} ;
        },
    },
});
