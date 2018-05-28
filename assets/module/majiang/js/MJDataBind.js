/*
* 麻将场景初始化
*/
var WJFCommon = require("WJFCommon");
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
        }
    },
    onLoad: function () {
        let self = this ;
        //let socket = this.socket(self);
        let socket = this.connect() ;

        // //初始化对象池
        this.init_pool();



        // dealcard、action  


        var roomInit,gameStartInit,gamePlay,gameEvent,settingClick,gameOver;
        //初始化房间信息
        socket.on('connect', function () {
            self.playerIsReady(self);
            roomInit = require('RoomInit');
            gameStartInit = require('GameStartInit');
            self.map("joinroom" , roomInit.joinroom_event,self);//加入房间
            self.map("banker" , gameStartInit.banker_event,self);//庄家
            self.map("players" , gameStartInit.players_event,self);//接受玩家列表
            self.map("play" , gameStartInit.play_event,self);//人齐了，接收发牌信息
            self.map("changeRoom" , self.changeRoom_event,self);// 比赛
            gamePlay = require('GamePlay');
            self.map("lasthands" , gamePlay.lasthands_event,self);//庄家开始打牌了，允许出牌
            self.map("takecards" , gamePlay.takecard_event,self);//我出的牌  
            self.map("dealcard" , gamePlay.dealcard_event,self) ;                //我出的牌
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
            self.getSelf().route(data.command,self)(data , self);
        });
        socket.on("play",function(result){
            var data = self.getSelf().parse(result);
            self.getSelf().route('play',self)(data , self);
        })
        socket.on("takecards",function(result){
            var data = self.getSelf().parse(result);
            self.getSelf().route('takecards',self)(JSON.parse(data) , self);
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
            console.log(99)
            self.talk_event(result,null) ;
        });

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
            var context = cc.find('Canvas').getComponent('MJDataBind');             
            cc.weijifen.audio.playSFX('select.mp3');            

            if(cc.sys.localStorage.getItem('take') == 'true'){
                let card = event.target.getComponent("TakeMJCard");
                if(card != null){
                    let cardValue = card.target.getComponent('HandCards');
                    gamePlay.takecard_event({userid:cc.weijifen.user.id,card:cardValue.value},self);
                    let card_script = card.target.getComponent("HandCards") ;
                    /**
                     * 提交数据，等待服务器返回
                     */
    
                        //开始匹配
                    let socket = self.getSelf().socket();
                    
                    if (cc.sys.localStorage.getItem('ting') == 'true') {  
                        context.tingting.active = true ;
                        setTimeout(function(){context.tingting.active = false},2000);
                        cc.weijifen.audio.playSFX('nv/ting.mp3');                                
                        let socket = self.getSelf().socket();
                        cc.sys.localStorage.removeItem('ting') ;
                        socket.emit("selectaction" , JSON.stringify({
                            action:"ting",
                            actionCard:[card_script.value]
                        }));
                        self.getSelf().tingAction();    
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
            cc.weijifen.audio.playSFX('nv/hu.mp3');  
            cc.sys.localStorage.removeItem('guo');            
            let socket = self.getSelf().socket();
            socket.emit("selectaction" , JSON.stringify({
                action:"hu",
                actionCard:[]
            }));
            //cc.find("");
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
                if(cc.sys.localStorage.getItem('clear') != 'true'){
                    var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
                    var bth = cc.find('Canvas/bg/center/button/readybtn');
                    if(cc.weijifen.match != 'true'){
                        bth.active =true;  
                        bth.x= -10;
                    }
                    var laizi = cc.find('Canvas/cards/tesucards/baocard/child').children
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


        cc.sys.localStorage.setItem('count','0');
        cc.sys.localStorage.removeItem('current');
        cc.sys.localStorage.removeItem('right');
        cc.sys.localStorage.removeItem('left');
        cc.sys.localStorage.removeItem('top');
        cc.sys.localStorage.removeItem('altake');      
        cc.sys.localStorage.removeItem('alting');
        cc.sys.localStorage.removeItem('guo');  
        cc.sys.localStorage.removeItem('unOver');      
        cc.sys.localStorage.removeItem('clear');   
        cc.sys.localStorage.removeItem('cb');   

        self.joinRoom();

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
            // cc
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
            let roomNum = cc.find('Canvas/roomNum').getChildByName('room')._components[0];// roomNum节点
            roomNum.string = cc.weijifen.room;
        }else if(cc.weijifen.match == 'true'){
            self.setting_coin.children[1].active = false;//解散按钮隐藏
            self.room_num.getComponent(cc.Label).string = '比赛模式';
            self.ready2.active = false;
            self.readybth.active = false;
            // this.readybth.x = -4;
            self.current_ready.active = true;
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






    },
    /*
    * 初始化对象池
    */
    init_pool: function (context) {
        cc.weijifen.shareRoomNum = "";
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
        for(var i=0 ; i<4 ; i++){
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
        // let self = this ;
    },
    /*
    * 分发joinroom事件（房间初始化时）
    *
    */
    joinRoom:function(){
        //开始匹配
        let socket = this.socket();
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
      
        socket.emit("joinroom" ,JSON.stringify(param)) ;
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
               
                object.timer(object , 8) ; 
                
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
        for(var inx = 0 ; inx<context.searchlight.children.length ; inx++){
            if(direction == context.searchlight.children[inx].name){
                context.searchlight.children[inx].active = true ;
            }else{
                context.searchlight.children[inx].active = false ;
            }
        }
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
        context = cc.find('Canvas').getComponent('MJDataBind');n
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
        cc.director.loadScene('majiang');
        context.disconnect();
    },
    /*
    * 文字聊天事件处理
    */
    talk_event: function (res,obj) {
        let chatShow = cc.find('Canvas/chatShow');
        chatShow.active = true;
        chatShow.getChildByName('msg').getComponent(cc.Label).string = cc.weijifen.user.username + ": " + cc.weijifen.msg;
        setTimeout(function(){
            chatShow.active = false;
        },2000);
    }   
});




