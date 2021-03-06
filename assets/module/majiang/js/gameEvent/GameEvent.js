var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        actionnode_two:{        //动作节点
            default:null ,
            type : cc.Node
        },
        actionnode_two_list:{        //动作节点
            default:null ,
            type : cc.Node
        },
        action_gang_ming_prefab:{
            default:null ,
            type : cc.Prefab
        },
        action_gang_an_prefab:{
            default:null ,
            type : cc.Prefab
        },
        gang_current:{        //动作节点
            default:null ,
            type : cc.Node
        },
        dan_topcurrent:cc.Prefab,
        dan_leftcurrent:cc.Prefab,
        dan_rightcurrent:cc.Prefab,
        dan_mycurrent:cc.Prefab,
        left_danLoyad: cc.Node,
        right_danLoyad: cc.Node,
        top_danLoyad: cc.Node,
        one_card_panel:{
            default:null ,
            type : cc.Node
        },
        action_imgs: cc.SpriteAtlas,
    },

    //初始化
    onLoad: function () {

    },
    onClick:function(event , data){  
        if (cc.find('Canvas/big_cards').children) {
           cc.find('Canvas/big_cards').removeAllChildren();
        }
        this.node.dispatchEvent( new cc.Event.EventCustom(data, true) );
    },
    click: function(event){
        event.target.active = false;
    },
    // 选牌框消失
    select_cards_box () {
        let self = this;
        let gameEvent = require('GameEvent');
        cc.find('Canvas/other/New Node').active = false;
        cc.find('Canvas/other/New Node/New Node/select').removeAllChildren();
        self.node.dispatchEvent( new cc.Event.EventCustom('guo', true) );
        cc.sys.localStorage.setItem('take','true');                
    },
    statics: {
        /**
         * 接受服务端的数据，玩家杠碰、吃胡等动作
         * @param data 包含事件信息
         * @param context
         */
        action_event:function(data, context){
           
            
            /*
                定义一个全局变量

                1、收到事件就赋值
                2、在点过时初始化该值
                3、若没有点击过，而是直接出的牌，那么在出牌时进行判断。若变量有值就将其初始化，并向后端发送选择的事件
             */
            cc.weijifen.isGuo = 'meiguo';
            cc.weijifen.audio.setSFXVolume(parseInt(cc.weijifen.mp3Music));
            // cc.find('Canvas/mask').active = true;
            if (!data.dan) {
                clearTimeout(context.clock);
            }
           
            var gameEventNode = cc.find('Canvas/js/GameEvent').getComponent('GameEvent');
            context = cc.find('Canvas').getComponent('MJDataBind');     
            cc.sys.localStorage.setItem('altake','true');
            cc.sys.localStorage.removeItem('take');
            
            let gang , peng , chi , hu , guo ,dan,ting;
            if(data.chis){
                context.chis = data.chis;
                for(let i =0; i< data.chis.length; i++){
                    context.chis[i].push(data.card);
                }
            }else{
                context.chis =[];
            }
            context.gangs = data["gangs"]?data["gangs"]:[];
            context.dans = data["dans"]?data["dans"]:[];
            context.tings = data["tings"]?JSON.parse(data["tings"]):[];
            if(data.deal == true){  //发牌的动作
                if (data.ting) {
                    cc.weijifen.receiveTing = true;
                }
                cc.sys.localStorage.setItem('guo','true');
                // let desk_script = context.actionnode_two.getComponent("DeskCards") ;
                // desk_script.init(data.card);
                for(var inx = 0 ; inx < gameEventNode.actionnode_two_list.children.length ; inx++){
                    let temp = gameEventNode.actionnode_two_list.children[inx] ;
                    if(temp.name == "gang"){gang = temp ;}
                    if(temp.name == "dan"){dan = temp ;}
                    if(temp.name == "ting"){ting = temp ;}
                    if(temp.name == "hu"){hu = temp ;}
                    if(temp.name == "guo"){guo = temp ;}
                    temp.active = false ;
                    
                }
                var count = 0;
                // 胡按钮出现
                if(data.hu){
                    hu.active = true ;
                    // hu.x = - 200 + count * 110 ;
                    hu.x = -140 + count * 110 ;
                    count++;
                }
                if(data.gang){
                    gang.active = true ;
                    gang.x = -140 + count * 110 ;
                    count++;
                }
                if(data.dan){
                    dan.active = true ;
                    dan.x = - 140 + count * 110 ;
                    count++;
                }
                if(data.ting){
                    ting.active = true ;
                    ting.x = - 140 + count * 110 ;
                    count++;
                }
                /*if(data.guo) {
                    guo.active =true;
                    guo.x = - 200 + count * 110 ;
                    count++;
                }*/
                if(data.deal) {
                    guo.active =true;
                    // guo.x = - 200 + count * 110 ;
                    guo.x = - 140 + count * 110 ;
                    count++;
                }
               
                var action = cc.moveTo(0.1,800 - count*285,-100);
                //context.actionnode_two.active = true;
                gameEventNode.actionnode_two.x=(-250 - count*100);
                //context.actionnode_two.runAction(action);
                //context.actionnode_deal.active = true ;

                context.action123 = "deal" ;
            }else{
                for(var inx = 0 ; inx < gameEventNode.actionnode_two_list.children.length ; inx++){
                    let temp = gameEventNode.actionnode_two_list.children[inx] ;
                    if(temp.name == "gang"){gang = temp ;}
                    if(temp.name == "peng"){peng = temp ;}
                    if(temp.name == "chi"){chi = temp ;}
                    if(temp.name == "hu"){hu = temp ;}
                    if(temp.name == "guo"){guo = temp ;}
                    temp.active = false ;
                }
                var count = 0;
                if(data.hu){
                    hu.active = true ;
                    hu.x = - 140 + count * 110
                    // hu.x = - 400 + count * 110
                    count++;
                }
                if(data.gang){
                    gang.active = true ;
                    gang.x = - 140 + count * 110
                    count++;
                }
                if(data.peng){
                    peng.active = true ;
                    peng.x = - 140 + count * 110
                    count++;
                }
                if(data.chi){
                    chi.active = true ;
                    chi.x = - 140 + count * 110
                    count++;
                }
                if(!data.deal && !data.action){
                    guo.active = true ;
                    guo.x = - 140 + count * 110
                    // guo.x = - 200 + count * 110
                    count++;
                }  
                var action = cc.moveTo(0.1,800 - count*285,-100);
                gameEventNode.actionnode_two.x=(-350 - count*100);                
                //context.actionnode_two.runAction(action);
                // let ani = context.actionnode_two.getComponent(cc.Animation);
                // ani.play("majiang_action") ;
                context.action123 = "two" ;
            }
        },
        selectaction_event:function(data , context){
            // cc.find('Canvas/card_play_flag').active = false;
            cc.weijifen.audio.setSFXVolume(parseInt(cc.weijifen.mp3Music));
            if (cc.find('Canvas/big_cards').children) {
               cc.find('Canvas/big_cards').removeAllChildren();
            }
          
            context = cc.find('Canvas').getComponent('MJDataBind');     
            var gameStartInit = require('GameStartInit');
            var gameEvent = require('GameEvent');
            var gameModelMp3 = "";//播放声音
          
            //触发音效
            /*cc.weijifen.audio.playSFX('nv/'+gameModelMp3+data.action+'.mp3');        
            let player = gameStartInit.player(data.userid , context), opParent, count = 0;*/
            let player = gameStartInit.player(data.userid , context), opParent, count = 0;
            if(cc.weijifen.GameBase.gameModel == "wz"){
                gameModelMp3 = "wz";
                cc.weijifen.genders[player.tablepos]='';
                cc.weijifen.audio.playSFX('nv/'+gameModelMp3+data.action + cc.weijifen.genders[player.tablepos] +'.mp3');
            }else{
                cc.weijifen.audio.playSFX('nv/'+gameModelMp3+data.action + '_' + cc.weijifen.genders[player.tablepos] +'.mp3');
            }
            
                   

            let jiantou;
            if(data.target){
                jiantou = gameStartInit.player(data.target , context).tablepos;
            }
            
            context.exchange_searchlight(player.tablepos , context);
            /**
             * 杠碰吃，胡都需要将牌从 触发玩家的 桌牌 里 移除，然后放入当前玩家 桌牌列表里，如果是胡牌，则放到 胡牌 列表里，首先
             * 首先，需要找到触发对象，如果触发对象不是 all ， 则 直接找到 对象对应的玩家 桌牌列表，并找到 桌牌里 的最后 的 牌，
             * 然后将此牌 移除即可，如果对象是 all， 则不用做任何处理即可
             */

            if(cc.weijifen.user.id == data.userid){   
                if(cc.sys.localStorage.getItem('cb')!='true'){
                    cc.sys.localStorage.setItem('take','true');             
                    
                }
                /**
                 * 碰，显示碰的动画，
                 * 杠，显示杠的动画，杠分为：明杠，暗杠，弯杠，每种动画效果不同，明杠/暗杠需要扣三家分，弯杠需要扣一家分
                 * 胡，根据玩法不同，推倒胡和血流/血战
                 */
                if(data.target == "all") {
                    let rightpre = cc.instantiate(context.action_gang_ming_prefab);
                    rightpre.parent = context.deskcards_right_panel.parent;
                    let toppre = cc.instantiate(context.action_gang_ming_prefab);
                    toppre.parent = context.deskcards_top_panel.parent;
                    let leftpre = cc.instantiate(context.action_gang_ming_prefab);
                    leftpre.parent = context.deskcards_left_panel.parent;
                }else{
                    //碰的特效
                    gameEvent.select_action_searchlight(data, context , player) ;
                }
                gameEvent.handCardRemove(data,context);//碰、点杠等情况只有data.card的情况需要处理。

            }
             // 显示杠、吃、碰动画
            let self = cc.find('Canvas/js/GameEvent').getComponent('GameEvent'); 
            let actionName = data.action;
            if(actionName == "dan"){
                actionName = "gang";
            }
            let img = cc.find("Canvas/"+actionName);
            img.active = true;
            var imgAnim = img.getComponent(cc.Animation);
            if(imgAnim!=null){
                 imgAnim.play(actionName);
            }           
            if (player.tablepos == 'top') {
                img.x = 0;
                img.y = 160;
            } else if (player.tablepos == 'left') {
                img.x = -320;
                img.y = 0;
            } else if (player.tablepos == 'right') {
                img.x = 320;
                img.y = 0;
            } else {
                img.x = 0;
                img.y = -160;
            }
            img.width = 128;
            img.height = 128;
            setTimeout(function(){
                img.active = false;
            },2200)
            opParent = cc.find("Canvas/cards/handcards/"+player.tablepos+"/kongcards") ;
            gameEvent.otherHandCardRemove(data,context,player.tablepos);
            let opCards , back = false , fangwei = player.tablepos ;
            if(data.action =='chi'){
                function sortNumber(a,b){return a - b}
                data.cards.sort(sortNumber);
                data.cards.splice(1,0,data.card);                
                opCards = data.cards;
            }else if(data.action == 'peng'){
                data.cards.push(data.card); 
                opCards = data.cards;
                // 自己蛋牌被别人抢碰
                if (cc.weijifen.danOrPeng && cc.weijifen.danOrPengData.userid == cc.weijifen.user.id) {
                    let GamePlay = require('GamePlay');
                    let gamePlay = new GamePlay();
                    GamePlay.takecard_event(cc.weijifen.danOrPengData,context,true);
                }
            }else if(data.action == 'gang'){
                if ( data.card && data.card != -1 ) {
                    data.cards.push(data.card);
                }
                if ( data.actype == 'an' ){
                    // alert('暗杠');
                    back = true ;
                }
                opCards = data.cards;
            }else if(data.action == 'dan'){
                opCards = data.cards;
            }
            gameEvent.cardModle(opCards,opParent,back,fangwei,context,data.action,jiantou);

            if( cc.sys.localStorage.getItem('cb')!='true'&&(data.action == 'peng'||(data.action == 'gang'&&data.card!=-1)||data.action=='chi'||data.action == 'hu')){
                //以下代码是用于找到 杠/碰/吃/胡牌的 目标牌  ， 然后将此牌 从 桌面牌中移除
                if(cc.sys.localStorage.getItem("replayData")!=null&&data.target==data.userid){
                    return;
                }
                let temp = gameStartInit.player(data.target, context), deskcardpanel=null;
                if (temp.tablepos == "right") {
                    deskcardpanel = context.deskcards_right_panel;
                } else if (temp.tablepos == "left") {
                    deskcardpanel = context.deskcards_left_panel;
                } else if (temp.tablepos == "top") {
                    deskcardpanel = context.deskcards_top_panel;
                }else{
                    deskcardpanel = context.deskcards_current_panel;
                }
                if (deskcardpanel.children.length > 0) {
                    deskcardpanel.children[deskcardpanel.children.length - 1].destroy();
                }
               
            }
           
        },
        select_action_searchlight:function(data , context , player){
            context.exchange_searchlight(player.tablepos , context);
            context.exchange_state("nextplayer" , context);
        },
        handCardRemove: function(data,context){
            if ( data.cards ) {
                for(let i =0 ;i< data.cards.length; i++){
                    for(let inx = 0 ; inx < context.playercards.length ; inx++ ){
                        let temp = context.playercards[inx].getComponent("HandCards");
                        if(data.cards[i]== temp.value){
                            context.cardpool.put(context.playercards[inx]) ;
                            context.playercards.splice(inx, 1) ;
                        }
                    }
                }
            }
            if ( data.card != -1 ) {
                for(var inx = 0 ; inx < context.playercards.length ; ){
                    let temp = context.playercards[inx].getComponent("HandCards");
                    if(data.card == temp.value){
                        context.cardpool.put(context.playercards[inx]) ;
                        context.playercards.splice(inx, 1) ;
                        break ;
                    }else{
                        inx++ ;
                    }
                }
            }
        },
        otherHandCardRemove: function(data,context,tablepos){           
            if(cc.sys.localStorage.getItem("replayData") != null){
                return;
            }
            var gameStartInit = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            for(let i = 0 ; i<data.cards.length; i++){
                if(tablepos =='top' && gameStartInit.top_panel.children){
                    gameStartInit.top_panel.children[i].destroy();
                    context.topcards.splice(i,1);
                }else if(tablepos =='right' && gameStartInit.right_panel.children){
                    gameStartInit.right_panel.children[i].destroy();
                    context.rightcards.splice(i,1);
                }else if(tablepos =='left' && gameStartInit.left_panel.children){
                    gameStartInit.left_panel.children[i].destroy();
                    context.leftcards.splice(i,1);
                }
            }      
        },
        /**
         * 点击事件按钮之后，蛋牌
         * @param  {Array}   cards   操作的牌值
         * @param  {cc.Node} parent  挂载的节点
         * @param  {Boolean} back    
         * @param  {String}  fangwei 
         * @param  {cc.Node} context
         * @param  {String}  action  
         * @param  {String}  target  
         * @param  {Array}   action_data 事件数据
         */
        cardModle: function(cards,parent,back,fangwei,context,action,target,action_data){
            // console.log('cardModle中传入的cards值---',cards)
            var gameStartInit = require('GameStartInit');
            var gameEventNode = cc.find('Canvas/js/GameEvent').getComponent('GameEvent');
           
            // 蛋
            if(cards.length == 1){
                var cardOp,card,temp;
                if(fangwei == 'top'){
                    cardOp = gameStartInit.findCardForKong(parent,cards[0],action) ;
                    card = cc.instantiate(gameEventNode.dan_topcurrent);
                    temp = card.getComponent('DanAction');
                }else if(fangwei == 'left'){
                    cardOp = gameStartInit.findCardForKong(parent,cards[0],action) ;
                    card = cc.instantiate(gameEventNode.dan_leftcurrent);
                    temp = card.getComponent('DanAction');
                }else if(fangwei == 'right'){
                    cardOp = gameStartInit.findCardForKong(parent,cards[0],action) ;
                    card = cc.instantiate(gameEventNode.dan_rightcurrent);
                    temp = card.getComponent('DanAction');
                }else{
                    cardOp = gameStartInit.findCardForKong(parent,cards[0],action) ;
                    card = cc.instantiate(gameEventNode.dan_mycurrent);
                    temp = card.getComponent('DanAction');
                } 
                // temp.init(cards[i],false,fangwei,'1');
                /*if ( cardOp.isGang ) {
                    card.zIndex=1;
                    card.parent = cardOp.cardNode ;
                    cardOp.cardNode.sortAllChildren();
                } else {
                    var dan = cardOp.cardNode.children[cardOp.cardNum].getComponent('DanAction');
                    dan.count.string = Number(Number(dan.count.string)+1);
                    dan.countactive();
                }*/

                // 1、将当前值转化为牌值类型和名字
                var cardName ;
                var cardcolors = parseInt(cards[0] / 4 ) ;
                var cardtype  = parseInt(cardcolors / 9);
                if (cardcolors < 0) {
                    if(cardcolors==-7){
                        cardName = '_wind_east';
                    } else if(cardcolors==-6){
                        cardName = '_wind_south';
                    } else if(cardcolors==-5){
                        cardName = '_wind_west';
                    } else if(cardcolors == -4){
                        cardName = '_wind_north';
                    }else if(cardcolors == -3){
                        cardName = '_red';
                    }else if(cardcolors == -2){
                        cardName = '_green';
                    }else if(cardcolors == -1){
                        cardName = '_white';
                    }       
                } else {
                    if(cardtype == 0){ //万
                        cardName = '_character_' + (parseInt((cards[0] % 36 ) / 4) + 1);
                    }else if(cardtype == 1){ //筒        
                        cardName = '_dot_' + (parseInt((cards[0] % 36 ) / 4) + 1);
                    }else if(cardtype == 2){  //条
                        cardName = '_bamboo_' + (parseInt((cards[0] % 36) / 4) + 1);
                    }   
                }
                // 3、kongcard中查找蛋牌
                if (cardOp.cardNode) {
                    temp.init(cards[0],false,fangwei,'1');
                    var cardValueArr = [],cardValueArr2 = [];
                    var cardValues = cardOp.cardNode.children;
                    for (let m = 0;m < cardValues.length;m++) {
                        let name = cardValues[m].getComponent('DanAction').cardName;
                        var ind = cardValueArr.indexOf(name);
                        if (ind == -1) {
                            cardValues[m].active = true;
                            cardValueArr.push(name);
                            cardValueArr2.push(cardValues[m]);
                        } 
                    }
                    for (var j = 0;j < cardValueArr.length;j++) {
                        let name = cardOp.cardNode.children[j].getComponent('DanAction').cardName;
                        let idx = cardValueArr.indexOf(cardName);
                        if (idx >= 0) {
                            if ( cardOp.isGang ) {
                                card.zIndex=1;
                                card.parent = cardOp.cardNode ;
                                temp.init(cards[0],false,fangwei,'1');
                                cardOp.cardNode.sortAllChildren();
                                // break;
                            } 
                            if (cardOp.cardNode.children[j].getComponent('DanAction').cardcolors == cardcolors && action != 'gang') {
                                var dan = cardOp.cardNode.children[idx].getComponent('DanAction');
                                dan.count.string = Number(Number(dan.count.string)+1);
                                dan.countactive();
                                // break;
                            }
                        } else {
                            card.zIndex=1;
                            card.parent = cardOp.cardNode ;
                            temp.init(cards[0],false,fangwei,'1');
                            cardOp.cardNode.sortAllChildren();
                        }
                    }
                }

                // 4、蛋牌自身去重
                if (action != 'gang' && cardValues) {
                    // 蛋牌去重
                    for (var i = 0;i < cardValues.length;i++) {
                        var n = 0;
                        var dan1 = cardValues[i];
                        for (var j = 0;j < cardValues.length;j++) {
                            var dan2 = cardValues[j];
                            if (dan1.getComponent('DanAction').cardName == dan2.getComponent('DanAction').cardName) {
                                if (n && dan2.getComponent('DanAction').count.string == 1) { 
                                    cardValues[j].destroy();
                                    var dan = cardOp.cardNode.children[j - 1].getComponent('DanAction');
                                    dan.count.string = Number(Number(dan.count.string)+1);
                                    dan.countactive();
                                    return
                                }
                                if (dan1.getComponent('DanAction').count.string == dan2.getComponent('DanAction').count.string && dan1.getComponent('DanAction').count.string == 1) {
                                    n++;
                                }
                                if (dan1.getComponent('DanAction').count.string >  dan2.getComponent('DanAction').count.string && n == 0) {
                                    dan2.destroy();
                                } else if (dan1.getComponent('DanAction').count.string < dan2.getComponent('DanAction').count.string && n == 0) {
                                    dan1.destroy();
                                } 
                            }
                            
                        }
                    }
                }
            }else{
                let cardParent = null ;
                if(fangwei == 'top'){
                    cardParent = cc.instantiate(gameEventNode.top_danLoyad);
                }else if(fangwei == 'left'){
                    cardParent = cc.instantiate(gameEventNode.left_danLoyad);
                }else if(fangwei == 'right'){
                    cardParent = cc.instantiate(gameEventNode.right_danLoyad);
                }else{
                    cardParent = cc.instantiate(gameEventNode.one_card_panel) ;
                }
                for(let i = 0 ; i< cards.length;i++){
                    if(cards[i]!=undefined){                        
                                   
                    if(fangwei == 'top'){
                        var card = cc.instantiate(gameEventNode.dan_topcurrent);
                    }else if(fangwei == 'left'){
                        var card = cc.instantiate(gameEventNode.dan_leftcurrent);
                    }else if(fangwei == 'right'){
                        var card = cc.instantiate(gameEventNode.dan_rightcurrent);
                    }else{
                        var card = cc.instantiate(gameEventNode.dan_mycurrent);             
                    }          
                    var temp = card.getComponent('DanAction');
                    // 暗杠第三张牌显示花色
                   if ( i == 2 && back == true && fangwei != 'right' && fangwei != 'top' && fangwei != 'left') {
                        temp.init(cards[i],false,fangwei,'1');
                      /*  card.width = 70;
                        card.height = 110;*/
                    }else if(action!='dan'&& i == 1&&back != true){
                        temp.init(cards[i],false,fangwei,'1',target);                    
                    }else {
                        temp.init(cards[i],back,fangwei,'1');
                    }
                    if(71<cards[i]&&cards[i]<76&&action!='chi'){                  
                        card.zIndex =9999;
                    }else {
                        card.zIndex =0;
                    }
                    card.parent = cardParent;
                    //马上进行排序如果不这个方法 会在所有方法执行完后再排序---官方排序方法
                    cardParent.sortAllChildren(); 
                }              
                }
                cardParent.getComponent('Kongcards').init(action);
                cardParent.parent = parent ;
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
