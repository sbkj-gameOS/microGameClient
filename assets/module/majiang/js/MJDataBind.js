var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {

    },
    onLoad: function () {

        /**
         * 初始化房间信息
         * 1.房间号
         * 2.显示游戏规则
         * 3.用户头像
         * 4.游戏logo
         */

        //加载调用方法js
        var RoomInitFn = require('RoomInit');

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
    },
});




