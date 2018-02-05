var WJFCommon = require("WJFCommon"),
    RoomInitFn = require('RoomInit'),
doMJ;
cc.Class({
    extends: WJFCommon,
    properties: {
        actionnode_two_list:cc.Node,
        bkLogoImg: {
            default: null,
            type: cc.Node
        },
      
    },
    onLoad: function () {
        let room = new RoomInitFn();
        room.onLoad();
        console.log('this',this)
        // debugger
        // 准备就绪之后
        if (this.ready()) {
            let socket = this.socket();
            /**
             * 接受指令
             */
           /* this.map("joinroom" , this.joinroom_event) ;          //加入房间
            this.map("players" , this.players_event) ;            //接受玩家列表*/

            /*this.map("banker" , this.banker_event) ;          // 1、庄家；开局后获取庄家的信息

            this.map("play" , this.play_event) ;          //人齐了，接收发牌信息

          //  this.map("selectcolor" , this.selectcolor_event) ;          //从服务端发送的 定缺的 指令，如果服务端玩法里不包含定缺， 可以不发送这个指令而是直接开始打牌

          //  this.map("selectresult" , this.selectresult_event) ;          //从服务端发送的 定缺的 指令，如果服务端玩法里不包含定缺， 可以不发送这个指令而是直接开始打牌

            this.map("lasthands" , this.lasthands_event) ;              // 3、庄家开始打牌了，允许出牌

            this.map("takecards" , this.takecard_event) ;                // 4、打出我出的牌

            this.map("action" , this.action_event) ;                     // 2、蛋、gang等操作。服务端发送的 动作事件，有杠碰吃胡过可以选择

            this.map("selectaction" , this.selectaction_event) ;        //我选择的动作， 杠碰吃胡

            this.map("dealcard" , this.dealcard_event) ;                // 5、从手牌中清除我已经打出的牌

            this.map("allcards" , this.allcards_event) ;                // 6、我出的牌
            this.map("isOver" , this.isOver_event);                     // 解散房间
            this.map("over" , this.over_event);
            this.map("unOver" , this.unOver_event);
            this.map("gameOver",this.gameOver_event);
            this.map("changeRoom",this.changeRoom_event);*/
            

            //初始化 干掉所有缓存
            //cc.sys.localStorage.removeItem('take') ;
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
        }

        this.disconnect();
    },
    updata: function () {
        if(!navigator.onLine&&cc.sys.localStorage.getItem('duankai')!='true'){
            this.node.dispatchEvent( new cc.Event.EventCustom('duankai', true) )
            cc.sys.localStorage.removeItem('chonglian');
        }else if(navigator.onLine&&cc.sys.localStorage.getItem('chonglian')!='true'){
            cc.sys.localStorage.setItem('chonglian','true');
            cc.sys.localStorage.removeItem('duankai');
            this.node.dispatchEvent( new cc.Event.EventCustom('chonglian', true) )
        };
        if(this.readybth.active == true){
            cc.sys.localStorage.removeItem('already');                    
        }else{
            cc.sys.localStorage.setItem('already',true);
        }
    },
    /*
    * 初始化对象池
    */
    init_pool: function () {
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
        ////debugger
         
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
        this.leave.put(cc.instantiate(this.leave_alert));
        /**
         *
         * 初始化玩家 的 对象池
         */
        for(var i=0 ; i<4 ; i++){
            this.playerspool.put(cc.instantiate(this.playerprefab));
        }
        ////debugger
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

 /*   players_event: function(data,context){},         //接受玩家列表
    banker_event: function(data,context){},          //庄家
    play_event: function(data,context){},          //人齐了，接收发牌信息
    lasthands_event: function(data,context){},              //庄家开始打牌了，允许出牌
    takecard_event: function(data,context){},                //我出的牌
    action_event: function(data,context){ doMJ.action(data,context)},                       //服务端发送的 动作事件，有杠碰吃胡过可以选择
    selectaction_event: function(data,context){},        //我选择的动作， 杠碰吃胡
    dealcard_event: function(data,context){},                 //我出的牌
    allcards_event: function(data,context){},                 //我出的牌
    isOver_event: function(data,context){},  
    over_event: function(data,context){},  
    unOver_event: function(data,context){},  
    gameOver_event: function(data,context){},  
    changeRoom_event: function(data,context){},  */
});




