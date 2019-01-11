/*
* 麻将场景初始化
*/
var WJFCommon = require("WJFCommon");
var videoList = [];
cc.Class({
    extends: WJFCommon,
    properties: {
        right_player: cc.Node,
        left_player: cc.Node,
        top_player: cc.Node,
        current_player:cc.Node,
        godcard:cc.Node,
        playerprefab:{
            default : null ,
            type : cc.Prefab
        },
        cards_current:{
            default:null ,
            type : cc.Prefab
        },
        statebtn:{
            default : null ,
            type : cc.Node
        },
        deskcards_current_panel:{
            default:null ,
            type : cc.Node
        },
        deskcards_right_panel:{
            default:null ,
            type : cc.Node
        },
        deskcards_top_panel:{
            default:null ,
            type : cc.Node
        },
        deskcards_left_panel:{
            default:null ,
            type : cc.Node
        },
        desk_tip:{
            default:null ,
            type : cc.Node
        },
        actionnode_deal:{      //动作节点
            default:null ,
            type : cc.Node
        },
        searchlight:{
            default:null ,
            type : cc.Node
        },
        left_panel:{
            default:null ,
            type : cc.Node
        },
        right_panel:{
            default:null ,
            type : cc.Node
        },
        top_panel:{
            default:null ,
            type : cc.Node
        },
        setting_coin: cc.Node, 
        right_ready: cc.Node,
        left_ready: cc.Node,
        top_ready:cc.Node,
        current_ready:cc.Node,
        starttime: cc.Label,
        roomInfo: cc.Node,
        mjtimer:{
            default:null ,
            type:cc.Label
        },
        selectfather:cc.Node,
        actionnode_two:{        //动作节点
            default:null ,
            type : cc.Node
        },
        dan_childrend: cc.Node,
        mjUnit:cc.Prefab,
        card4:cc.Node,
        cards_panel:{
            default:null ,
            type : cc.Node
        },
        tingSelect:cc.Node,
        tingSelectch:cc.Prefab,
        tingting: cc.Node,
        currentting: cc.Node,
        topting: cc.Node,
        rightting: cc.Node,
        leftting: cc.Node,
        ready2: cc.Node,
        readybth: cc.Node,
        isOver: cc.Prefab,
        gameSettingClick: cc.Prefab,
        setting_coin: cc.Node, 
        room_num:{
            default:null,
            type: cc.Node
        },
        noticeShare: cc.Node,
        menuPrefab: {
            default: null,
            type: cc.Prefab
        },
        fangweiAltas:{
            default:null,
            type:cc.SpriteAtlas
        },
        chatMsg: {
            default: null,
            type: cc.Node
        },
        // 动画emojiGif
        emojiShow: {
            default: null,
            type: cc.Node
        },
        // 显示在出牌玩家所展示的大牌
        bigModel: {
            default: null,
            type: cc.Prefab
        },
        callingSign: {
            default: null,
            type: cc.Node
        },
        recording: cc.Prefab,
        prizeBox: cc.Prefab,// 比赛结束后弹出比赛结果事件
        actionBox: cc.Node,// 事件按钮父元素
        cards_play_flag: cc.Node,
        handCards: cc.Node,
        wanfa: cc.Node,
        current_kong: cc.Node,
        mask: cc.Node,// 比赛开牌时，手牌初始慢给出的提示
        prohibit_mask: cc.Node,// 比赛倒计时结束时，禁止玩家任何操作
        overCount: cc.Prefab,
        refuseBtn: cc.SpriteFrame,
        headImgCenter: cc.Node,
        fangweiAltas2:{
            default:null,
            type:cc.SpriteAtlas
        },
    },
    onLoad: function () {
        if (cc.sys.localStorage.getItem('matchOver') == 'true' || cc.weijifen.room == null) {
            cc.director.loadScene('gameMain');
            cc.sys.localStorage.removeItem('matchOver');
            cc.sys.localStorage.removeItem("jiesanTime");
            return
        }
        var listenFlag,hasAlert;// 网络情况，是否有网络提示
        let self = this ;
        cc.weijifen.mp3Music = cc.weijifen.audio.getSFXVolume();
        this.actionBox.zIndex = 1000;
        cc.weijifen.isPLayVideo = false;
        this.yuyin_flag;
        //let socket = this.socket(self);
        self.msg = null;//反作弊提示信息
        // 初始化对象池
        this.init_pool();
        self.prohibit_mask.active = false;
        this.gameModelMp3 = "";//播放声音
        if(cc.weijifen.GameBase.gameModel == "wz"){
            this.gameModelMp3 = "wz";
        }
        if(cc.weijifen.match!='true'){
             cc.find('Canvas/other/setting/退出').active = true;
        }
        var roomInit,gameStartInit,gamePlay,gameEvent,settingClick,gameOver;
        //初始化房间信息
        if(cc.weijifen.match == 'true' || typeof cc.weijifen.match == 'function'){
            self.setting_coin.children[1].active = false;//解散按钮隐藏
            self.room_num.getComponent(cc.Label).string = '比赛模式';
            self.ready2.active = false;
            self.readybth.active = false;
            // this.readybth.x = -4;
            self.current_ready.active = true;

            self.headImgCenter.active = true;
            self.headImgCenter.getChildByName('username').getComponent(cc.Label).string = cc.weijifen.user.username;

            if(cc.weijifen.user.headimgurl){
                self.headImg(self.headImgCenter.getChildByName('img'),cc.weijifen.user.headimgurl,true,true);
            }
        }
        if (cc.sys.localStorage.getItem('gotWsUrl') || cc.sys.localStorage.getItem('isPlay') || cc.weijifen.match == 'false' || cc.sys.localStorage.getItem('matchType') == 5) {
            var socket = this.connect() ;
            
            socket.on('connect', function () {
                self.playerIsReady(self);
                roomInit = require('RoomInit');
                gameStartInit = require('GameStartInit');
                self.map("joinroom" , roomInit.joinroom_event,self);//加入房间
                self.map("banker" , gameStartInit.banker_event,self);//庄家
                self.map("players" , gameStartInit.players_event,self);//接受玩家列表
                self.map("play" , gameStartInit.play_event,self);//人齐了，接收发牌信息
                self.map("changeRoom" , self.changeRoom_event,self);// 比赛
                self.map("talkOnSay" , self.talk_event,self);//语音  文字   表情
               

                gamePlay = require('GamePlay');
                self.map("lasthands" , gamePlay.lasthands_event,self);//庄家开始打牌了，允许出牌
                self.map("takecards" , gamePlay.takecard_event,self);//我出的牌  
                self.map("dealcard" , gamePlay.dealcard_event,self) ;                //我拿的牌
                gameEvent = require('GameEvent');
                self.map("action" , gameEvent.action_event,self);//服务端发送的 动作事件，有杠碰吃胡过可以选择
                self.map("selectaction" , gameEvent.selectaction_event,self) ;        //我选择的动作， 杠碰吃胡 
                settingClick = require('settingClick');
                settingClick = new settingClick();
                // var settingClick = cc.find('Canvas/js/settingClick');
                gameOver = require('GameOver');
                self.map("allcards" , gameOver.allcards_event,self) ;
                self.map("isOver" , settingClick.isOver_event,self);
                self.map("gameOver",settingClick.gameOver_event,self);
                self.map("over" , settingClick.over_event,self);
                self.map("unOver" , settingClick.unOver_event,self);
               
            });
            // if(this.ready()){
            //     let socket = this.socket();
            //     *
            //      * 接受指令
            // }
            socket.on('quit_refresh',function(result){
                if(result){ 
                    var msg;
                    typeof result == 'object' ? msg=result:msg=JSON.parse(result);
                    var arr=['left','right','top'];
                    for(var i=0;i<arr.length;i++){
                     if(msg.userId== cc.sys.localStorage.getItem(arr[i])){
                        cc.sys.localStorage.removeItem(arr[i]);
                        var string='ok_'+arr[i];
                        var ok=cc.find('Canvas/players/'+string);
                        ok.active=false;
                     }
                    }
                    var labels=cc.find("Canvas/playerExitTip");
                    for(var inx = 0 ; inx<self.playersarray.length ; inx++){
                        let temp = self.playersarray[inx].getComponent("MaJiangPlayer") ;
                        if(temp.data.id == msg.userId){
                            labels.children[0].getComponent(cc.Label).string='玩家：'+temp.username.string+' 离开了房间!';
                            var action=cc.moveTo(0.3,0,-320);
                            labels.runAction(action);
                            var func=function(){
                                var action2=cc.moveTo(0.3,0,-420);
                                labels.runAction(action2);
                                self.unschedule(func);
                            }
                            self.schedule(func,3.5,1);
                            // temp.refresh();
                            self.playerspool.push(temp.node);
                            // temp.node.destroy();
                            self.playersarray.splice(inx,1);
                            break ;
                        }
                    }
                }               
            });
            socket.on("command" , function(result){
                var data = self.getSelf().parse(result);
                if (data.replacePowerCard && data.action == 'ting') {
                    cc.find('Canvas/tip').active = true;
                    var timer;
                    timer = setTimeout(function(){
                        cc.find('Canvas/tip').active = false;
                        clearTimeout(timer);
                    },3000);
                }

                if (data.command == 'ComingToAnEnd') {
                     /**
                     * 比赛模式中，距离比赛结束30s时收到，并显示倒计时
                     */
                    let seconds = 30;
                    let str = self.wanfa.getComponent(cc.Label);
                    str.string = '距离比赛结束还有30秒';
                    let time = setInterval(function(){
                        seconds--;
                        str.string = '距离比赛结束还有' + seconds + '秒';
                        if (seconds < 1) {
                            self.prohibit_mask.active = true;
                            clearInterval(time);
                        }
                    },1000);
                    let mask_time = setTimeout(function(){
                        self.prohibit_mask.active = false;
                        clearTimeout(mask_time);
                    },5000);
                }else{
                    self.getSelf().route(data.command,self)(data , self);
                }
                if(cc.weijifen.match == 'true'){
                    // 网络心跳包
                 if (data == 'well') {
                     listenFlag = false;
                     hasAlert = false;
                     socket.emit("healthListen" ,'');
                  }  
                }
            });
            // if (cc.sys.localStorage.getItem('appTime')) self.setCountDown();

            if (cc.weijifen.match == 'true') {
                var listenTime = setInterval(function(){
                    if (cc.director.getScene().name == 'gameMain') {
                        clearInterval(listenTime);
                        return
                    }
                    if (hasAlert) {return };
                    listenFlag == false ? listenFlag = true : listenFlag = false;
                    // 若为false则为网络正常,true为网络出现正常
                    if (listenFlag == false && cc.weijifen.dialog.size() > 0) {
                        if (hasAlert) {return};
                        self.__proto__.__proto__.alert('当前网络环境较差！');
                        hasAlert = true;
                    } else if (listenFlag == true && cc.find('Canvas/alert') && cc.find('Canvas/alert').length < 6) {
                        cc.weijifen.dialog.put(cc.find('Canvas/alert'));
                    }
                },6000);
            }
            socket.on("OverPosition",function(result){
                cc.sys.localStorage.setItem('matchOver','true');
                typeof result == 'object' ? cc.sys.localStorage.setItem('matchPrize',JSON.stringify(result)) 
                                          : cc.sys.localStorage.setItem('matchPrize',result);

            })
            socket.on("play",function(result){
                var data = self.getSelf().parse(result);
                self.getSelf().route('play',self)(data , self);
            })
            socket.on("takecards",function(result){
                var data = self.getSelf().parse(result);
                data = JSON.parse(data);
                self.getSelf().route('takecards',self)(data , self);
                // 手牌缺少，出牌之后，牌面缺失查找缺失牌面，并进行补充
                let h_cards2 = self.handCards;
                if (data.userid == cc.weijifen.user.id && data.cards && data.cards.length != h_cards2.children.length) {
                    cc.log('手牌有误，开始更正！！！！！！');
                    //cc.log('h_cards2手牌---',h_cards2.length);
                    // data.cards.push(36);// 测试数据
                    // data.cards.splice(2,1);// 测试数据
                    let handcard =cc.find('Canvas/cards/handcards/'+'current'+'/'+'current'+'handcards').children.length;
                    for(let i =0 ; i< handcard; i++){
                        let handcards = self.playercards[i].getComponent("HandCards");
                        handcards.csImageTop.active = false;
                        handcards.target.zIndex = 0;
                        handcards.target.children[0].getComponent(cc.Button).enabled = true;
                        handcards.cardvalue.color = new cc.Color(255, 255, 255);
                        handcards.reinit();
                        self.cardpool.put(self.playercards[i]);
                        }
                        self.playercards = [];
                    for(var i=0 ; i< data.cards.length ; i++){
                        if(self.cardpool){
                            let temp = self.cardpool.get();
                            if(temp==undefined||temp==null){
                                temp=cc.instantiate(self.cards_current);
                            }
                            let temp_script = temp.getComponent("HandCards") ;
                            if(data.cards[i] >= 0){
                                temp.zIndex = data.cards[i] ;
                            }else{
                                temp.zIndex = 200+data.cards[i] ;
                            }
                            self.playercards.push(temp);
                            temp_script.init(data.cards[i]);
                            temp.parent =h_cards2 ;
                        }   
                    }
                    h_cards2.sortAllChildren();
                  //  cc.director.loadScene('majiang');
                    // self.mask.active = true;
                    // let time = setTimeout(function(){
                    //     if (self.mask) {
                    //         self.mask.active = false;
                    //     }
                    //     clearTimeout(time);
                    // },3000);
                }
            })

            socket.on("action",function(result){
                var data = self.getSelf().parse(result);
                self.getSelf().route('action',self)(JSON.parse(data) , self);
            })
            socket.on("allcards",function(result){
                var data = self.getSelf().parse(result);
                self.getSelf().route('allcards',self)(JSON.parse(data) , self);
            })
            /**
             * 接受传送的 玩家列表（含AI）
             */
            socket.on("players" , function(result){
                var data = self.getSelf().parse(result) ;
                self.getSelf().route("players",self)(data, self);
            });

            socket.on("talkOnSay" , function(result){
                var data = self.getSelf().parse(result) ;
                self.getSelf().route("talkOnSay",self)(data, self);
            });

            socket.on("StrongGameOver" , function(result){
                result = JSON.parse(result);
                self.__proto__.__proto__.alert(result.gameOverReason);
            }); 
            // 监听解散进程
            socket.on("overInfo",function(result){
                // result = '{"overCount":"1","refuseCount":"0"}';
               /* var data = self.getSelf().parse(result);
                self.getSelf().route('play',self)(data , self);*/
                var data = JSON.parse(result);
                if (cc.find('Canvas/overCount')) {
                    cc.find('Canvas/overCount').destroy();
                }
                if (cc.find('Canvas/alert')) {
                    cc.find('Canvas/alert').zIndex = 100;
                }
                var countPrefab = cc.instantiate(self.overCount);
                for (let i = 1;i < cc.weijifen.playerNum + 1;i++) {
                   
                    let list = cc.instantiate(countPrefab.getChildByName('count').getChildByName('list'));
                    // i=0 count=1
                    // i=1 count=1
                    // i=2 count=1
                    list.active = true;
                    list.parent = countPrefab.getChildByName('count');
                    countPrefab.getChildByName('count').parent = countPrefab;
                    if (data.overCount < i) {
                        // 只添加节点不改变精灵兔
                        list.getComponent(cc.Sprite).spriteFrame = self.refuseBtn;
                    }
                }
                countPrefab.parent = cc.find('Canvas');
                if (cc.weijifen.playerNum == (Number(data.overCount) + Number(data.refuseCount))) {
                    countPrefab.destroy();
                }
            })

            self.node.on('overGame',function(event){
                let socket = self.getSelf().socket();
                if(event.getUserData()){
                    socket.emit('overGame',JSON.stringify({
                        REFUSE : event.getUserData()
                    }))
                }else{
                    socket.emit('overGame',JSON.stringify({
                    }))
                }
            });

            self.node.on('readyGM',function(event){ 
                //alert();
                var context = cc.find('Canvas').getComponent('MJDataBind'); 
                context.current_ready.active = true ;    
                let socket = self.getSelf().socket();
                socket.emit('readyGame',JSON.stringify({
                }))
            });

            // 监听出牌拿牌
            self.node.on('takecard', function (event) {
                cc.sys.localStorage.removeItem('guo');
                var context = cc.find('Canvas').getComponent('MJDataBind');             
                cc.weijifen.audio.playSFX('select.mp3');            

                if(cc.sys.localStorage.getItem('take') == 'true'){
                    let card = event.target.getComponent("TakeMJCard");
                    if(card != null){
                        let cardValue = card.target.getComponent('HandCards');
                        gamePlay.takecard_event({userid:cc.weijifen.user.id,card:cardValue.value},self);

                        self.cards_play_flag.active = false;
                        let card_script = card.target.getComponent("HandCards") ;
                        /**
                         * 提交数据，等待服务器返回
                         */
        
                            //开始匹配
                        let socket = self.getSelf().socket();
                        
                        if (cc.sys.localStorage.getItem('ting') == 'true') {  
                            cc.find('Canvas/ting').active = true;
                            var anim = cc.find("Canvas/ting/ting_action");
                            anim = anim.getComponent(cc.Animation);
                            anim.play('ting');
                            setTimeout(function(){
                                cc.find('Canvas/ting').active = false;
                                anim.stop('ting');
                            },1500);
                            cc.weijifen.audio.playSFX('nv/'+self.gameModelMp3+'ting' + '_' +cc.weijifen.genders['current'] + '.mp3');                                
                            let socket = self.getSelf().socket();
                            cc.sys.localStorage.removeItem('ting') ;
                            socket.emit("selectaction" , JSON.stringify({
                                action:"ting",
                                actionCard:[card_script.value]
                            }));
                            self.getSelf().tingAction();    

                            self.cards_play_flag.active = true;

                        } else {
                            socket.emit("doplaycards" , card_script.value) ;
                        }
                        //cc.find("");
                        // self.getSelf().shouOperationMune();
                    }
                    event.stopPropagation();
                }
            });


            self.node.on('mjSelection',function(event){
                let father = cc.find('Canvas').getComponent('MJDataBind').selectfather;
                father.active= false;
                father.children[0].children[1].children.splice(0,father.children[0].children[1].children.length);
                let socket = self.getSelf().socket();
                let params = [];
                let sendEvent ;
                if ( event.getUserData() ) {
                    sendEvent = event.getUserData().name ;
                    params = event.getUserData().params ;
                }
                socket.emit("selectaction" , JSON.stringify({
                    action:sendEvent,
                    actionCard:params
                }));
                //cc.find("");
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });
            /**
             * ActionEvent发射的事件 ， 点击 碰
             */
            self.node.on("peng",function(event){
                cc.sys.localStorage.removeItem('guo');            
                let socket = self.getSelf().socket();
                socket.emit("selectaction" , JSON.stringify({
                    action:"peng",
                    actionCard:[]
                }));
                //cc.find("");
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });
            self.node.on("dan",function(event){
                cc.sys.localStorage.removeItem('guo');            
                var context = cc.find('Canvas').getComponent('MJDataBind'); 
                if ( context.dans && context.dans.length > 1 ) {
                    cc.sys.localStorage.removeItem('take');
                    context.mjOperation('dan', context.dans,context);
                } else {
                    let socket = self.getSelf().socket();
                    let danParam = [];
                    if ( context.dans ) {
                        danParam = context.dans[0] ;
                    }
                    socket.emit("selectaction" , JSON.stringify({
                        action:'dan',
                        actionCard:danParam
                    }));
                }
                //cc.find("");
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });
            self.node.on("gang",function(event){
                cc.sys.localStorage.removeItem('guo');            
                var context = cc.find('Canvas').getComponent('MJDataBind'); 
                if ( context.gangs && context.gangs.length > 1 ) {
                    cc.sys.localStorage.removeItem('take');                
                    context.mjOperation('gang', context.gangs,context);
                } else {
                    let socket = self.getSelf().socket();
                    let gangParam = [];
                    if ( context.gangs ) {
                        gangParam = context.gangs[0] ;
                    }
                    socket.emit("selectaction" , JSON.stringify({
                        action:'gang',
                        actionCard:gangParam
                    }));
                }
                //cc.find("");
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });

            /**
             * ActionEvent发射的事件 ， 点击 吃
             */
            self.node.on("chi",function(event){
                cc.sys.localStorage.removeItem('guo');            
                var context = cc.find('Canvas').getComponent('MJDataBind'); 
                if ( context.chis && context.chis.length > 1 ) {
                    cc.sys.localStorage.removeItem('take');
                    let array = [];
                    let array2 = [];
                    function sortNumber(a,b){return a - b}   
                    function sortNum(a,b){return b.id - a.id}              
                    for(let i = 0 ;i<context.chis.length;i++){
                        let b = {};
                        context.chis[i].sort(sortNumber);
                        b.id = context.chis[i][0];
                        b.value = context.chis[i];
                        array.push(b);
                    }
                    array.sort(sortNum);
                    for(let i = 0 ; i<array.length;i++){
                        array2.push(array[i].value);
                    }
                    

                    context.mjOperation('chi',array2,context);
                } else {
                    let socket = self.getSelf().socket();
                    socket.emit("selectaction" , JSON.stringify({
                        action:'chi',
                        actionCard:context.chis[0]
                    }));
                }
                //cc.find("");
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });
            /**
             * ActionEvent发射的事件 ， 点击 听
             */
            self.node.on("ting",function(event){
                cc.sys.localStorage.removeItem('guo');            
                /*let socket = self.getSelf().socket();
                socket.emit("selectaction" , JSON.stringify({
                    action:"ting",
                    actionCard:[]
                }));*/
                //记录听得状态后，在出牌阶段判断状态并发送听牌事件。
                var context = cc.find('Canvas').getComponent('MJDataBind'); 
                var gameStartInit = require('GameStartInit');
                cc.sys.localStorage.setItem('ting','true') ;
                cc.sys.localStorage.setItem('alting','true') ;
                gameStartInit.initcardwidth(true);
                self.getSelf().tingAction();                 
                if (context.tings){
                    let length =cc.find('Canvas/cards/handcards/current/currenthandcards').children.length;
                    for(let j = 0 ; j< context.tings.length;j++){
                        let cv = context.tings[j].card;                                    
                        for(let i =0; i<length;i++){
                            let cards =cc.find('Canvas/cards/handcards/current/currenthandcards').children[i];
                            let button = cc.find('Canvas/cards/handcards/current/currenthandcards').children[i].children[0];
                            let handCards = cards.getComponent("HandCards");
                            if((cv<0&&parseInt(cv/4 )== parseInt(handCards.value/4 ))||(cv>=0&&handCards.mjtype==parseInt(cv/36)&&parseInt((handCards.value%36)/4)==parseInt((cv%36)/4))){
                                 handCards.cardvalue.color = new cc.Color(255, 255, 255);
                                 button.getComponent(cc.Button).interactable= true;   
                            }   
                        }
                    }
                }
                event.stopPropagation();
                self.getSelf().shouOperationMune();            
            });
            /**
             * ActionEvent发射的事件 ， 点击 胡
             */
            self.node.on("hu",function(event){
                cc.sys.localStorage.removeItem('guo');            
                let socket = self.getSelf().socket();
                socket.emit("selectaction" , JSON.stringify({
                    action:"hu",
                    actionCard:[]
                }));
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });
            /**
             * ActionEvent发射的事件 ， 点击 过
             */
            self.node.on("guo",function(event){
                //当自己收到的事件是guo时  为true  别人
                if(cc.sys.localStorage.getItem('guo')!='true'||cc.sys.localStorage.getItem('alting')=='true'){
                    cc.sys.localStorage.removeItem('altake');
                    let socket = self.getSelf().socket();
                    socket.emit("selectaction" , JSON.stringify({
                        action:"guo",
                        actionCard:[]
                    }));
                }else{
                    cc.sys.localStorage.setItem('take','true');    
                }
                cc.sys.localStorage.removeItem('guo');
                self.getSelf().shouOperationMune();
                event.stopPropagation();
            });
            // gameStartInit.players_event();

            self.node.on('restar',function(event){
                var gameStartInit = require('GameStartInit');
                if(event.getUserData()){     
                    cc.weijifen.menu = new cc.NodePool();
                    cc.weijifen.menu.put(cc.instantiate(self.menuPrefab));//菜单框
                   /* if(cc.weijifen.GameBase.gameModel=='wz'){
                        cc.director.loadScene('温州');
                    }else{
                        cc.director.loadScene('gameMain');                    
                    }*/
                    cc.weijifen.gongaoAlertNum = undefined;       
                    cc.director.loadScene('gameMain');         
                }else{
                    // 初始化
                    if(cc.sys.localStorage.getItem('clear') != 'true'){
                        var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
                        var bth = cc.find('Canvas/bg/center/button/readybtn');
                        if(cc.weijifen.match != 'true'){
                            // bth.active =true;  
                            bth.x= -10;
                        }
                        var laizi = cc.find('Canvas/cards/tesucards/baocard/child').children;
                        if(laizi){
                            for(let i =0 ; i < laizi.length ; i ++ ){
                                cc.find('Canvas/cards/tesucards/baocard/child').children[i].destroy();
                            }
                        }     
                        gameStartInit.reinitGame(context);
                    }
                    cc.sys.localStorage.removeItem('clear');
                    if (cc.weijifen.GameBase.gameModel == 'wz') {
                        self.shouOperationMune();
                    } else {
                        self.getSelf().shouOperationMune();
                    }
                    // self.getSelf().shouOperationMune();
                    event.target.parent.destroy(); 
                }        
            });
              // 查看玩家是否离线（主监测电话中）
            cc.weijifen.offline = function(status){
                //status    0:在线   1：离线  2：电话中
                let param = {
                    userId: cc.weijifen.user.id,
                    // userId: '37a538a553bf4e88820893274669992f',
                    type: 4,
                    status: status
                };
                socket.emit("sayOnSound" ,JSON.stringify(param));
            }
            // cc.weijifen.offline(2);
            // 主监测游戏进入后台
            // 监听到该事件说明玩家已经离线，此时status为1
            let startTime,endTime;
            cc.game.on(cc.game.EVENT_HIDE, function () {
                console.log('监听到hide事件，游戏进入后台运行！');
                cc.sys.localStorage.setItem("isHide",1);
                let param = {
                    userId: cc.weijifen.user.id,
                    // userId: '37a538a553bf4e88820893274669992f',
                    type: 4,
                    status: 1
                };
                socket.emit("sayOnSound" ,JSON.stringify(param));
            });
            cc.game.on(cc.game.EVENT_SHOW, function () {
                console.log('监听到SHOW事件，游戏进入后台运行！');
                cc.sys.localStorage.setItem("isHide",0);
                let param = {
                    userId: cc.weijifen.user.id,
                    // userId: '37a538a553bf4e88820893274669992f',
                    type: 4,
                    status: 0
                };
                socket.emit("sayOnSound" ,JSON.stringify(param));
                if (cc.weijifen.room) {
                    cc.director.loadScene('majiang');
                }
            });
            
            self.node.on("touchend",function(){
               if(Number(cc.sys.localStorage.getItem("isHide"))==1){
                   cc.sys.localStorage.setItem("isHide",0);
                   console.log('监听到SHOW事件，游戏进入后台运行1234！');
                   let param = {
                       userId: cc.weijifen.user.id,
                       // userId: '37a538a553bf4e88820893274669992f',
                       type: 4,
                       status: 0
                   };
                   socket.emit("sayOnSound" ,JSON.stringify(param));
                   if (cc.weijifen.room) {
                      cc.director.loadScene('majiang');
                   }
               }
           });
            // 发送录音
            cc.weijifen.player_recording = function(param){
                var param1 = {
                    type:3,
                    userId: cc.weijifen.user.id,
                    content:param
                };
                socket.emit("sayOnSound" ,JSON.stringify(param1));
            }
            // 播放语音队列
            cc.weijifen.playVideo = function () {
                if(videoList.length == 0){
                    cc.weijifen.isPLayVideo = false;
                }else{
                    var params = {
                        act: 4,
                        url: videoList[0]// 语音播放地址
                    }; 
                    videoList.shift();
                    // var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", 'recorderApi',JSON.stringify(params));
                    var jsonRes = JSON.stringify(params);
                    var result = jsb.reflection.callStaticMethod(...self.anMethodParam().recorderApi,jsonRes);
                }
                
            }
            cc.sys.localStorage.setItem('count','0');
            cc.sys.localStorage.removeItem('current');
            cc.sys.localStorage.removeItem('right');
            cc.sys.localStorage.removeItem('left');
            cc.sys.localStorage.removeItem('top');
            cc.sys.localStorage.removeItem('isHide');//游戏切到后台时添加
            cc.sys.localStorage.removeItem('altake');      
            cc.sys.localStorage.removeItem('alting');
            cc.sys.localStorage.removeItem('guo');  
            cc.sys.localStorage.removeItem('unOver');      
            cc.sys.localStorage.removeItem('clear');   
            cc.sys.localStorage.removeItem('cb');   
            cc.sys.localStorage.removeItem('timeIsClose');
            if (cc.sys.localStorage.getItem('zuomangjikai') == '1') {
                cc.sys.localStorage.setItem('zuomangjikai','0');
                cc.sys.localStorage.setItem('zuomangjikai2','0');
            } if (cc.sys.localStorage.getItem('zuomangjikai') == 'true' && cc.sys.localStorage.getItem('zuomangjikai2') == 'true') {
                cc.sys.localStorage.getItem('zuomangjikai') == '1'
            }

        }
        if (cc.weijifen.match != 'false' && cc.sys.localStorage.getItem('appTime')) {
            cc.game.on(cc.game.EVENT_SHOW, function () {
                self.reloadMaJiang();
            });
            cc.game.on(cc.game.EVENT_HIDE, function () {
                for (let i = 0;i < 10*60;i++) {
                    clearInterval(i);
                }
            });
        }
    },
    getSelf: function(){
        var self =cc.find("Canvas").getComponent("MJDataBind");
        return self;
    },
    shouOperationMune: function(){
        var action = cc.moveTo(0.5,1122,-100);
        this.actionnode_two.x=1122;
        cc.sys.localStorage.removeItem('altake');
       //this.actionnode_two.runAction(action);
        //this.actionnode_two.active = false;
        
    },
    /*
    * 初始化房间信息
    */
    playerIsReady:function (self) {
        cc.weijifen.playersss = 0;  
        if(cc.weijifen.browserType=="wechat"){
            self.wxButton.node.active = true ;
            let room ='';//房间号
            if(cc.weijifen.match != 'true'){
                room = cc.weijifen.room
            }
            cc.weijifen.WXorBlow.shareRoom(room);                    
        }else if(cc.weijifen.browserType != null){
            self.ggButton.node.active = true ;
        }
        
        //设置游戏玩家数量
        if(cc.weijifen.playerNum == 2){
            self.left_player.active = false;
            self.right_player.active = false;
            self.deskcards_current_panel.width = 650;
            self.deskcards_top_panel.width = 650;
            // this.deskcards_top_panel.y =10;
        }else if(cc.weijifen.playerNum == 3){
            self.left_player.active = false;      
           /* self.deskcards_current_panel.width = 600;
            self.deskcards_top_panel.width = 600;  
            self.deskcards_current_panel.x = -154;
            self.deskcards_top_panel.x = -144;     
            self.deskcards_right_panel.x = -83;  
            self.deskcards_top_panel.y =10;   */
        }

        //房间号显示
        if(cc.weijifen.match =='false'){
            cc.find('Canvas/players').active = true;
            let roomNum = cc.find('Canvas/roomNum').getChildByName('room')._components[0];// roomNum节点
            roomNum.string = cc.weijifen.room;
        }else if(cc.weijifen.match == 'true'){
            self.setting_coin.children[1].active = false;//解散按钮隐藏
            self.room_num.getComponent(cc.Label).string = '比赛模式';
            self.ready2.active = false;
            self.readybth.active = false;
            // this.readybth.x = -4;
            self.current_ready.active = true;

            self.headImgCenter.active = true;
            self.headImgCenter.getChildByName('username').getComponent(cc.Label).string = cc.weijifen.user.username;

            if(cc.weijifen.user.headimgurl){
                self.headImg(self.headImgCenter.getChildByName('img'),cc.weijifen.user.headimgurl,true,true);
            }
        };

        /*设置圈数，圈数条显示*/
        let quanNum = cc.find('Canvas/roomNum').getChildByName('quan')._components[0];// quan节点
        self.maxRound = 0;
        if(cc.weijifen.maxRound){
            self.maxRound = cc.weijifen.maxRound;
        }
        // this.totaljs.string = '圈数  '+ this.maxRound;
        self.routes = {};
        quanNum.string = '0/' + self.maxRound;



        self.joinRoom(self);

    },
    /*
    * 初始化对象池
    */
    init_pool: function (context) {
        var self = this;
        cc.weijifen.shareRoomNum = "";     //1111
        /**
         * 已初始的玩家对象池 ， 牌局结束 或者 有新玩家加入， 老玩家离开 等事件的时候，需要做对象池回收
         * @type {Array}
         */
        this.playersarray = new Array();        //玩家列表

        this.playercards = new Array();         //手牌对象

        this.leftcards = new Array();           //左侧玩家手牌
        this.rightcards = new Array();          //右侧玩家手牌
        this.topcards = new Array() ;           //对家手牌

        this.deskcards = new Array();           //当前玩家和 对家 已出牌

        this.chis = [];
        this.gangs = [];
        this.dans = [];

        this.right ='';// 用户信息
        this.left = '';
        this.top = '';
        cc.weijifen.wanfa = null;//玩法

        this.centertimer = null ;//中间时间
         
        /**
         * 预制的 对象池
         * @type {cc.NodePool}
         */
        this.playerspool = new cc.NodePool();
        /**
         * 当前玩家的 麻将牌的 对象池
         * @type {cc.NodePool}
         */
        this.cardpool = new cc.NodePool();
        this.alert = new cc.NodePool();
        this.setting = new cc.NodePool();
        this.leave = new cc.NodePool();
        
        // 操作按钮
        this.alert.put(cc.instantiate(this.isOver));
        this.setting.put(cc.instantiate(this.gameSettingClick));
        // this.leave.put(cc.instantiate(this.leave_alert));
        /**
         *
         * 初始化玩家 的 对象池
         */
        for(var i=0 ; i<5 ; i++){
            this.playerspool.put(cc.instantiate(this.playerprefab));
        }
        /**
         * 初始化当前玩家的麻将牌 对象池
         * 将麻将放到对象池
         */
        if(cc.weijifen.cardNum){
            for(var i=0;i<cc.weijifen.cardNum+1;i++){
                this.cardpool.put(cc.instantiate(this.cards_current));
            }
        }else{
            for(var i=0 ; i<14 ; i++){
                this.cardpool.put(cc.instantiate(this.cards_current));
            }
        }
        this.exchange_state("init" , this);
        let t_Start = cc.find("Canvas/bg/right_menu/语音") ;
        let luyin_anim = cc.find('Canvas/luyin/luyin_anim');
        let luyin_com = luyin_anim.getComponent(cc.Animation);
        let m = 1,timer;
        t_Start.on('touchstart',function(e){
            m++;
            var json = {
                act:1,
                token:cc.weijifen.authorization
            };
            cc.find('Canvas/bg/right_menu').children[2].zIndex = 100000;
            cc.find('Canvas/luyin').active = true;
            console.log("1248");
            luyin_com.play('luyin_anim');
            this.yuyin_flag = true;
            if (m) {
                timer = setInterval(function(){
                    m++;
                    if (m > 16) {
                        var json = {
                            act:2,
                            token:cc.weijifen.authorization
                        };
                        luyin_com.stop('luyin_anim');
                        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;","recorderApi",JSON.stringify(json));
                        // jsb.reflection.callStaticMethod(self.anMethodParam().recorderApi,JSON.stringify(json));
                        var jsonRes = JSON.stringify(json);
                        jsb.reflection.callStaticMethod(...self.anMethodParam().recorderApi,jsonRes);
                       
                        cc.find('Canvas/luyin').active = false;
                        m = 0;
                        clearInterval(timer);
                        return
                    }
                },1000);
            }
            /*jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;"
                    ,"recorderApi",JSON.stringify(json));*/
            var jsonRes = JSON.stringify(json);
            jsb.reflection.callStaticMethod(...self.anMethodParam().recorderApi,jsonRes);
        });
        t_Start.on('touchend',function(e){
            if (timer) clearInterval(timer);
            var json = {
                act:2,
                token:cc.weijifen.authorization
            };
            luyin_com.stop('luyin_anim');
            this.yuyin_flag = false;
            console.log("1249");
            /*jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;"
                    ,"recorderApi",JSON.stringify(json));*/
                    var jsonRes = JSON.stringify(json);
            jsb.reflection.callStaticMethod(...self.anMethodParam().recorderApi,jsonRes);
            cc.find('Canvas/luyin').active = false;
            m = 0;
        });
    },
    /*
    * 分发joinroom事件（房间初始化时）
    *
    */
    joinRoom:function(context){
        //开始匹配
        let socket = this.socket();
        let params = {
            token:cc.weijifen.authorization,
            lng: '',//j
            lat: ''//w
        }
        /*cc.weijifen.http.httpPost('/userInfo/position/save',params,getPosition,getErr,this) ;  
        function getPosition () {}
        function getErr () {}*/
        // 地理位置
        // 调用android方法名：getLocation
        // 返回地址位置：lo经度；alt，海拔；t时间
        // if (cc.sys.localStorage.getItem('tips') == 'false') {
           /* var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", 'getLocation','');
            if (result) {
                console.log('res',res)
                let res = JSON.parse(result);
                let params = {
                    token:cc.weijifen.authorization,
                    lng: res.lo,//j
                    lat: res.la//w
                }
                // cc.sys.localStorage.setItem('tips','true');
                cc.weijifen.http.httpPost('/userInfo/position/save',params,this.getPosition,this.getErr,this) ;            
            }*/
        // } 
        var param = {
            token:cc.weijifen.authorization,
            playway:cc.weijifen.playway,
            orgi:cc.weijifen.user.orgi
        } ;
        if ( cc.weijifen.room ) {
            param.room = cc.weijifen.room ;
        }else{
            param.playway = '402888815e6f0177015e71529f3a0001',
            param.match = 1 ; 
        }
        setTimeout(function(){
            socket.emit("joinroom" ,JSON.stringify(param)) ;
        },300);
    },
    /**
     * 状态切换，使用状态参数 切换，避免直接修改 对象状态，避免混乱
     */
    exchange_state:function(state , object){
        cc.weijifen.state = state;
        object = cc.find('Canvas').getComponent('MJDataBind');
        let readybtn = null , waitting = null , selectbtn = null , banker = null ,ready2 = null ;

        for(var i=0 ; i<object.statebtn.children.length ; i++){
            let target = object.statebtn.children[i] ;
            if(target.name == "readybtn"){
                readybtn = target ;
            }else if(target.name == "waitting"){
                waitting = target ;
            }else if(target.name == "select"){
                selectbtn = target ;
            }else if(target.name == "banker"){
                banker = target ;
            }else if(target.name == 'friendButton'){
                ready2 = target;
            }
            target.active = false ;
        };
        switch(state){
            case "init" :
                object.desk_tip.active = false;
                if(cc.weijifen.match == 'true'){//非比赛模式准备按钮显示
                    readybtn.active = false ;
                }else{
                    readybtn.active = true ;
                }
                if(cc.weijifen.room && cc.weijifen.room.length ==6){
                    ready2.active = true ;
                }
                // object.actionnode_deal.active =false ;

                /**
                 * 探照灯 熄灭
                 */
                object.exchange_searchlight("none",object);

                break;
            case "ready" :
                waitting.active = true ;
                //ljh改 开局60s
                //object.timer(object , 60) ;
                break;
            case "begin" :
                object.readyNoActive(object); 
                //waitting.active = false ;
                /**
                 * 显示 当前还有多少张底牌
                 * @type {boolean}
                 */
                object.desk_tip.active = true;
                /**
                 * 开始发牌动画，取消所有进行中的计时器
                 */
                object.canceltimer(object);
                break;
            case "play" :
                /**
                 * 一个短暂的状态，等待下一步指令是 定缺 还是直接开始打牌 ， 持续时间的计时器是 2秒
                 */
                if(cc.weijifen.bankers){
                    banker.active = true ;
                }
                object.readyNoActive(object); 
                object.timer(object , 0) ;
                break   ;
            case "selectcolor" :
                /**
                 * 定缺 ，由服务端确定是否有此个节点，下个版本将会实现流程引擎控制 游戏 节点，一切都在服务端 进行配置工作
                 * @type {boolean}
                 */
                object.exchange_searchlight("current",object);
                selectbtn.active = true ;
                object.timer(object , 0) ;
                break   ;
            case "selectresult" :
                /**
                 * 选择了定缺结果，关闭选择按钮
                 * @type {boolean}
                 */
                selectbtn.active = false ;
                object.canceltimer(object) ;
                break   ;
            case "lasthands" :
                /**
                 * 选择了定缺结果，关闭选择按钮
                 * @type {boolean}
                 */
                banker.active = true ;
                /**
                 * 计时器方向
                 */
                if(cc.weijifen.match == 'true' || typeof cc.weijifen.match == 'function'){
                    object.timer(object , 10) ;             
                } else {
                    object.timer(object , 15) ;             
                }

                // object.timer(object , 8) ; 
                
                break   ;
            case "otherplayer" :
            
                /**
                 * 计时器方向
                 */
                if(cc.weijifen.match){
                    object.timer(object , 15) ;             
                }else{
                    object.timer(object , 8) ; 
                }

                if(cc.weijifen.match == 'true' || typeof cc.weijifen.match == 'function'){
                    object.timer(object , 10) ;             
                }
                break   ;
            case "takecard" :
                /**
                 * 选择了定缺结果，关闭选择按钮
                 * @type {boolean}
                 */
                banker.active = false;
                //object.canceltimer(object) ;
                break   ;
            case "nextplayer" :
                if(object.action ){
                    if(object.action == "two"){
                        // let ani = object.actionnode_two.getComponent(cc.Animation);
                        // ani.play("majiang_action_end") ;
                    }else if(object.action == "three") {
                        let ani = object.actionnode_three.getComponent(cc.Animation);
                        ani.play("majiang_three_action_end") ;
                    }else if(object.action == "deal") {
                        object.actionnode_deal.active = false ;
                    }
                }
                object.action = null ;
                /**
                 * 选择了定缺结果，关闭选择按钮
                 * @type {boolean}
                 */
                if(cc.weijifen.match){
                    object.timer(object , 15) ;             
                }else{
                    object.timer(object , 8) ; 
                }


                if(cc.weijifen.match == 'true' || typeof cc.weijifen.match == 'function'){
                    object.timer(object , 10) ;             
                }
                break   ;
        }
    },
    mjOperation : function(event,params,context){
        this.selectfather.active = true;
        //context.card4.getComponent('operation').setAction(event);
        for(var i = 0 ; i < params.length;i++ ){
            var b = cc.instantiate(context.card4);
            b.getComponent('operation').setAction({'name':event,'params':params[i]});
            b.parent = context.dan_childrend;
            for(var j = 0 ; j< params[i].length; j++){
                var a = cc.instantiate(context.mjUnit);
                a.getComponent('HandCards').init(params[i][j],true);
                a.parent = b;
            }
        }
    },
    exchange_searchlight:function(direction , context){
        cc.sys.localStorage.removeItem('cl');      
        context = cc.find('Canvas').getComponent('MJDataBind');
        let time = setTimeout(function(){
            if (context.searchlight) {
                for(var inx = 0 ; inx<context.searchlight.children.length ; inx++){
                    if(direction == context.searchlight.children[inx].name){
                            context.searchlight.children[inx].active = true ;
                            cc.sys.localStorage.setItem('take','true');
                    }else{
                            context.searchlight.children[inx].active = false ;
                            cc.sys.localStorage.removeItem('take');
                    }
                }
            }
            clearTimeout(time); 
        },400);
    },
    readyNoActive: function(context){
        context.right_ready.active = false;
        context.left_ready.active = false;
        context.top_ready.active = false;
        context.current_ready.active =false;  
    },
    tingactivefalse: function(context){
         context.currentting.active =false;
         context.topting.active =false;
         context.rightting.active =false;
         context.leftting.active =false;
         
    },
    canceltimer:function(object){
        object.unscheduleAllCallbacks();
        object.mjtimer.string = "00" ;
    },
    timer:function(object , times){
        if(times > 9){
            object.mjtimer.string = times ;
        }else{
            object.mjtimer.string = "0"+times ;
        }

        object.callback = function(){
            times = times - 1 ;
            if(times >= 0){
                let text = times ;
                if(times < 10){
                    text = "0"+times ;
                    if (cc.weijifen.match == 'true' && times < 1) {
                        let current_cards = cc.find('Canvas/cards/handcards/current/currenthandcards');
                        if (current_cards.children[0]) {// 改条件：手牌未初始化，防止重新加载majiang场景时报错。
                            cc.weijifen.cardPostion = {
                                x: current_cards.x + current_cards.width - current_cards.children[0].width,
                                y: -(current_cards.y + current_cards.height)
                            };
                        }
                    }
                }
                object.mjtimer.string = text ;
                // if(times< 5){
                //     cc.weijifen.audio.playSFX('timeup_alarm.mp3');                    
                // }
            }
        }
        object.unscheduleAllCallbacks();
        /**
         * 启动计时器，应该从后台传入 配置数据，控制 等待玩家 的等待时长
         */
        object.schedule(object.callback, 1, times, 0);
    },
    /*exchange_searchlight:function(direction , context){
        cc.sys.localStorage.removeItem('cl');      
        context = cc.find('Canvas').getComponent('MJDataBind');
        for(var inx = 0 ; inx<context.searchlight.children.length ; ix++){
            if(direction == context.searchlight.children[inx].name){
                context.searchlight.children[inx].active = true ;
            }else{
                context.searchlight.children[inx].active = false ;
            }
        }
    },*/
    tingAction: function(dd){
        let length =cc.find('Canvas/cards/handcards/current/currenthandcards').children.length;
        for(let i =0; i<length;i++){
            let cards =cc.find('Canvas/cards/handcards/current/currenthandcards').children[i];
            let button = cc.find('Canvas/cards/handcards/current/currenthandcards').children[i].children[0];
            let handCards = cards.getComponent("HandCards");
            if(dd){
                handCards.cardvalue.color = new cc.Color(255, 255, 255); 
            }else{
                handCards.cardvalue.color = new cc.Color(118, 118, 118);                
            }
            button.getComponent(cc.Button).interactable= false;
        }
    },
    onDestroy:function(){
        if(this.ready()) {
            let socket = this.socket();
            socket.disconnect();
        }
    },
    /*
    * 比赛模式，进入房间1分钟之后接收
    */
    changeRoom_event: function(data,context){
        cc.weijifen.playerNum = data.playerNum;
        cc.weijifen.room  = data.roomId;
        //cc.log('changeRoom_event--data',data);
        //cc.log('玩家数量---changeRoom',data.playerNum,cc.weijifen.playerNum);
        cc.director.loadScene('majiang');
    },
    /*
    * 获取聊天列表，添加到父节点
    * @param chatStr  玩家名字和所发文字
    * @param chatShow 聊天列表窗口
    * @param mj       MJDataBind节点
    */
    addChatList: function (chatStr,chatShow,mj) {
        if (chatShow.children.length > 1) mj.clear(chatShow);
        let msgMode = cc.instantiate(mj.chatMsg);
        let label = msgMode.getComponent(cc.Label);
        label.string = chatStr;
        label.fontSize = 20;
        msgMode.parent = chatShow;
        cc.find('Canvas/chat').active = false;
        chatShow.active = true;
        setTimeout(function(){
            chatShow.active = false;
            mj.clear(chatShow);
        },5000);
    },
    /*
    * 文字聊天事件处理
    * { type:
    *      1：文字
    *      2：表情
    *      3：语音
    *      4：是否离线（0:在线   1：离线  2：电话中）
    * }
    */
    talk_event: function (res1,obj) {
        let chatShow = cc.find('Canvas/chatShow');
        let res = JSON.parse(res1);
        // 文字
        if (res.type == 1) {
            let content = JSON.parse(res.content);
            let msg = content.username + '：' + content.msg;
            let gameStartInit = require('GameStartInit');
            let player = gameStartInit.player(content.userid , obj)
            obj.addChatList(msg,chatShow,obj);
            if (content.musicName) cc.weijifen.audio.playSFX('nv/' + content.musicName + '_' + cc.weijifen.genders[player.tablepos] + '.mp3');
            cc.weijifen.isPLayVideo = true;
            let timer = setTimeout(function(){
                cc.weijifen.isPLayVideo = false;
                clearTimeout(timer);
            },3800);
            return
        }
        // 表情
        if (res.type == 2) {
           //获取返回json数据
            let main = JSON.parse(res.content);
            let emojiShow = obj.emojiShow;//克隆表情
            let startX,startY;
            let endUserX = "",endUserY = "";//表情移动的位置
            let gameStartInit = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            var anim = cc.find("Canvas/emojiGif/"+main.animationName);
            let players = cc.find('Canvas/players');
            let numRoom = cc.weijifen.playerNum;//房间可以容纳几人
            let num = cc.weijifen.playersss;//已进入房间人数
            for (let i = 0;i < obj.playersarray.length;i++) {
                let userId = obj.playersarray[i].getChildByName('id').getComponent(cc.Label).string;// 玩家id
                let name = obj.playersarray[i].parent.name ;
                if(userId == main.mineId){//当前用户id是发送表情的用户id
                    if (obj.playersarray[i].parent.name == 'Canvas') {
                        startX = -580;
                        startY = -236;
                    } else {
                        startX = obj.playersarray[i].parent.x;
                        startY = obj.playersarray[i].parent.y;
                    }
                    anim.setPosition(startX,startY);
                    emojiShow.active = true;
                }
                if(userId == main.targetId){//当前用户id是发送表情的用户id
                    if (name == 'Canvas') {
                        endUserX = -580;
                        endUserY = -236;
                        emojiShow.zIndex = 100000;
                    } else {
                        endUserX = obj.playersarray[i].parent.x;
                        endUserY = obj.playersarray[i].parent.y;
                    }
                }
                
            }
            anim = anim.getComponent(cc.Animation);
            anim.play(main.animationName);
            let action = cc.moveTo(0.5,endUserX,endUserY);
            cc.find("Canvas/emojiGif/"+main.animationName).runAction(action);
            setTimeout(function(){
                emojiShow.active = false;
                anim.stop('ting');
            },2000)
         
            return
        }
        // 语音
        if (res.type == 3) {
            videoList.push(res.content);
            if(cc.weijifen.isPLayVideo == false){
                var params = {
                    act:4,
                    url:videoList[0]// 语音播放地址
                };
                cc.weijifen.isPLayVideo = true;
                videoList.shift();
                // var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", 'recorderApi',JSON.stringify(params));
                var jsonRes = JSON.stringify(params);
                var result = jsb.reflection.callStaticMethod(...obj.anMethodParam().recorderApi,jsonRes);  
            }
            
            let id_c,id_t,id_r,id_l; 
            if (cc.weijifen.playerNum == 2) {
                let id_c = cc.find('Canvas').getChildByName('player_head').getChildByName('id').getComponent(cc.Label).string;
                if (cc.find('Canvas/players/head_top').getChildByName('player_head')){
                    var id_t = cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('id').getComponent(cc.Label).string;
                    if (res.userId == id_t) {
                        cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                        let timer = setTimeout(function(){
                            cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                            clearTimeout(timer);
                        },7000);   
                    } 
                }
                if (res.userId == id_c) {
                    cc.find('Canvas').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                    let timer = setTimeout(function(){
                        cc.find('Canvas').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                        clearTimeout(timer);
                    },7000);   
                } 
            }
            if (cc.weijifen.playerNum == 3) {
                let id_c = cc.find('Canvas').getChildByName('player_head').getChildByName('id').getComponent(cc.Label).string;
                if (cc.find('Canvas/players/head_top').getChildByName('player_head')){
                    var id_t = cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('id').getComponent(cc.Label).string;
                    if (res.userId == id_t) {
                        cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                        let timer = setTimeout(function(){
                            cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                            clearTimeout(timer);
                        },7000);   
                    } 
                }
                if (cc.find('Canvas/players/head_right').getChildByName('player_right')){
                    var id_r = cc.find('Canvas/players/head_right').getChildByName('player_right').getChildByName('id').getComponent(cc.Label).string;
                    if (res.userId == id_r) {
                        cc.find('Canvas/players/head_right').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                        let timer = setTimeout(function(){
                            cc.find('Canvas/players/head_right').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                            clearTimeout(timer);
                        },7000);   
                    } 
                }
                if (res.userId == id_c) {
                    cc.find('Canvas').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                    let timer = setTimeout(function(){
                        cc.find('Canvas').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                        clearTimeout(timer);
                    },7000);   
                } 
            }
            if (cc.weijifen.playerNum == 4) {
                let id_c = cc.find('Canvas').getChildByName('player_head').getChildByName('id').getComponent(cc.Label).string;
                if (cc.find('Canvas/players/head_top').getChildByName('player_head')){
                    var id_t = cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('id').getComponent(cc.Label).string;
                    if (res.userId == id_t) {
                        cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                        let timer = setTimeout(function(){
                            cc.find('Canvas/players/head_top').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                            clearTimeout(timer);
                        },7000);   
                    } 
                }
                if (cc.find('Canvas/players/head_left').getChildByName('player_left')){
                    var id_l = cc.find('Canvas/players/head_left').getChildByName('player_left').getChildByName('id').getComponent(cc.Label).string;
                    if (res.userId == id_l) {
                        cc.find('Canvas/players/head_left').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                        let timer = setTimeout(function(){
                            cc.find('Canvas/players/head_left').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                            clearTimeout(timer);
                        },7000);   
                    }
                }
                if (cc.find('Canvas/players/head_right').getChildByName('player_right')){
                    var id_r = cc.find('Canvas/players/head_right').getChildByName('player_right').getChildByName('id').getComponent(cc.Label).string;
                    if (res.userId == id_r) {
                        cc.find('Canvas/players/head_right').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                        let timer = setTimeout(function(){
                            cc.find('Canvas/players/head_right').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                            clearTimeout(timer);
                        },7000);   
                    } 
                }
                if (res.userId == id_c) {
                    cc.find('Canvas').getChildByName('player_head').getChildByName('luyin_flag').active = true;
                    let timer = setTimeout(function(){
                        cc.find('Canvas').getChildByName('player_head').getChildByName('luyin_flag').active = false;
                        clearTimeout(timer);
                    },7000);   
                } 
            }
            return
        }
        
        // 是否离线
        if (res.type == 4) {
            // player  头像框父节点;
            // userId  状态发生改变的用户id
            // status  用户状态
            function playerId (player,userId,status) {
                let id;
                if (player.children[4]) {
                    id = player.children[4].getChildByName('id').getComponent(cc.Label).string;
                    if (status == 0 && id == userId) {
                        player.children[4].getChildByName('off_line_sign').active = false;
                        player.children[4].getChildByName('callingSign').active = false;
                        player.children[4].children[1].color = new cc.Color(255,255,255);
                    } else if(status == 1 && id == userId) {
                        player.children[4].getChildByName('off_line_sign').active = true;
                        player.children[4].getChildByName('callingSign').active = false;
                        player.children[4].children[1].color = new cc.Color(100,100,100);
                    } else if(status == 2 && id == userId) {
                        player.children[4].getChildByName('off_line_sign').active = false;
                        player.children[4].getChildByName('callingSign').active = true;
                        player.children[4].children[1].color = new cc.Color(100,100,100);
                    }
                }
            }
            function stateFn (userId,status) {
                if (num == 2) {
                    playerId(obj.top_player,userId,status);
                    return
                }
                if (num == 3) {
                    playerId(obj.right_player,userId,status);
                    playerId(obj.top_player,userId,status);
                    return
                }
                if (num == 4) {
                    playerId(obj.right_player,userId,status);
                    playerId(obj.top_player,userId,status);
                    playerId(obj.left_player,userId,status);
                    return
                }
            }
            let num = cc.weijifen.playerNum;
            let time = setTimeout(function(){
                stateFn(res.userId,res.status);
                clearTimeout(time);
            },500);
        } 
    },
    /*
    * 常用聊天语
    */   
    commonMsg: function (event) {
        if (cc.weijifen.isPLayVideo) { return };
        let name = event.target.name;
        let msg = event.target.children[0].getComponent(cc.Label).string;
        let chatShow = cc.find('Canvas/chatShow');
        let socket = this.socket();
        let chat = cc.find('Canvas/chat');

        let content = JSON.stringify({
            msg: msg,
            musicName: name,
            username: cc.weijifen.user.username,
            userid: cc.weijifen.user.id
        })
        // type为文字
        let param = {
            type: 1,
            content: content
        }
        socket.emit("sayOnSound" ,JSON.stringify(param)) ;
        chat.active = false;
    },
    /*
    * 清空聊天显示列表
    * @param chatShow 聊天列表窗口
    */
    clear: function (chatShow) {
        for (let i = 1;i < chatShow.children.length;i++) {
            chatShow.children[i].destroy();
        }
    },
    headImageClick:function(event){
        let context = cc.find('Canvas').getComponent('MJDataBind') ;
        var headImgPositionX = cc.find("Canvas/players/"+event.target.name).x;
        var headImgPositiony = cc.find("Canvas/players/"+event.target.name).y;
        if(event.target.name == "head_top"){
            headImgPositionX = headImgPositionX - 182;
            headImgPositiony = headImgPositiony - 55;
        }else if(event.target.name == "head_left"){
            headImgPositionX = headImgPositionX + 190;
            headImgPositiony = headImgPositiony - 50;
        }else if(event.target.name == "head_right"){
            headImgPositionX = headImgPositionX - 171;
            headImgPositiony = headImgPositiony - 52;
        }
        if(event.target.children[4]){
            cc.weijifen.emjioUserId = event.target.children[4].getChildByName('id').getComponent(cc.Label).string;
        }

        //弹出表情框    移动位置到头像位置
        var emoji = cc.find("Canvas/emoji");
        cc.find("Canvas/emoji/emojiBox").setPosition(headImgPositionX,headImgPositiony);
        if(emoji.active){
            emoji.active = false;
        }else{
            emoji.active = true;    
        }
    },
    /**
     * 录音功能
     * 逻辑：1、在录音按钮上按下、抬起，都要向后端；
     *      2、
     *  方法名：recorderApi
     *  返回数据（json）： 
                        {"act":"1", //1: 开始录音, 2: 结束录音, 3: 取消录音, 4: 播放录音
                        "token":"zxfdgdrherhtr", //当前的token
                        "url":"xxxxx" //获取到的文件url
                        }
     */
    recording_no: function (event) {
        let wjf = new WJFCommon();
        wjf.alert('即将开放，敬请期待！');
    },
     /**
     * 获取玩家地理位置成功
     */
    getPosition: function (result,obj) {
        let res = JSON.parse(result);
        obj.positionMsg = res.msg;
    },
    getErr: function (result,obj) {
        obj.alert('获取位置')
    },
    /**
     * 比赛模式：退出房间、退出房间再次进入后，倒计时
     */
    setCountDown: function () {
        let t = new Date();// 当前时间
        let d = new Date(Number(cc.sys.localStorage.getItem('appTime')));// 比赛开始的本地时间
        let a = d - t;
        cc.sys.localStorage.setItem('matchTime',a);
    },
    /*重新加载*/
    reloadMaJiang () {
        this.disconnect();
        cc.director.loadScene('majiang');
    },
      
});



 