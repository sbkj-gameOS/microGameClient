// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {


        backLobby: {  //返回大厅btn
            default: null,
            type: cc.Node
        },
        ctrl: {    //暂停、继续
            default: null,
            type: cc.Node
        },
        sudu: {        //快进
            default: null,
            type: cc.Node
        },
        left_handCard: { //手牌存在的父节点
            default: null,
            type: cc.Node
        },
        right_handCard: {//手牌存在的父节点
            default: null,
            type: cc.Node
        },
        top_handCard: {//手牌存在的父节点
            default: null,
            type: cc.Node
        },
        cards_right: { //右侧玩家摸到的牌
            default: null,
            type: cc.Prefab
        },
        cards_left: {//左侧玩家摸到的牌
            default: null,
            type: cc.Prefab
        },
        cards_top: {//顶部玩家摸到的牌
            default: null,
            type: cc.Prefab
        },
        prepareBtn: {//准备Btn
            default: null,
            type: cc.Node
        },
        thisNode: { //本脚本所在节点
            default: null,
            type: cc.Node
        },
        roomLabel: { //房间号
            default: null,
            type: cc.Node
        },
        right_desk: { //右侧玩家的桌面牌
            default: null,
            type: cc.Node
        },
        top_desk: { //顶部玩家的桌面牌节点
            default: null,
            type: cc.Node
        },
        left_desk: { //左侧玩家的桌面牌节点
            default: null,
            type: cc.Node
        },
        my_desk: { //玩家的桌面牌节点
            default: null,
            type: cc.Node
        },
        ningLabel: { //局数
            default: null,
            type: cc.Node
        },
        _lastAction: null,
        _actionMsg: null,
        _nowIndex: 0,
        _nextPlayTime: 1,
        _replay: null,
        _isPlaying: true, //游戏界面加载好，玩家位子都初始化好，发完牌之后打开，开始播放。。。或者把每步都写到takeaction

        _roomInit: null,
        _gameStartInit: null,
        _settingClick: null,
        _settingClick: null,
        _gameEvent: null,
        _gamePlay: null,
        _gameOver: null,
        _mjDataBind: null,

        _time: 2,
        _num: 0,

        atlas: {//回放top、current玩家的牌图集
            default: null,
            type: cc.SpriteAtlas
        },

        isInit: false, //是否已经初始化所有玩家头像框

        _upid: null,
    },
    onLoad() {

        this._replay = cc.find("Canvas/rePlay");//是否显示回放控制器
        if (this.isReplay()) {
            this.init();
        }
        this._replay.active = this.isReplay();

    },

    start() {

    },
    onBtnPauseOrPlayClicked: function () {//暂停或继续
        this._isPlaying = !this._isPlaying;
        this._isPlaying ? this.ctrl.children[0].getComponent(cc.Label).string = '暂停' : this.ctrl.children[0].getComponent(cc.Label).string = '继续';

    },

    onBtnBackClicked: function () {
        this.clear();
        //清空所有需要清除的数据
        var a = {};
        a.key = true;
        var oper = new cc.Event.EventCustom('restar', true);
        oper.setUserData(a);
        this.node.dispatchEvent(oper);
    },
    onBtnGoClicked: function () {//快进
        if (this._time > 0.5) {
            this._time /= 2;
            this._num++;//1--x2  2--x4   需要修改控制器快进btn样式
            this.sudu.children[0].getComponent(cc.Label).string = '快进 x' + this._num * 2;
        }
        else {
            this._num = 0;
            this._time = 1;
            this.sudu.children[0].getComponent(cc.Label).string = '快进';
        }
    },
    clear: function () {//清空已有的数据
        this._lastAction = null;
        this._actionMsg = null;
        this._nowIndex = 0;
        cc.sys.localStorage.removeItem("replayData");
        cc.sys.localStorage.removeItem("replayRes");

        var canvasNode = cc.find("Canvas");
        // cc.eventManager.pauseTarget(canvasNode, false);
    },

    init: function () {
        var d = cc.sys.localStorage.getItem("replayData");//初始化，将需要播放的数据放入管理类，并初始化下一步动作和当前播放位置
        var e = JSON.parse(d);
        var f = cc.sys.localStorage.getItem("numQuan");
        if (typeof e != 'object') {
            e = JSON.parse(e);
        }
        this._actionMsg = e[f];
        console.log(this._actionMsg);

        if (this._actionMsg == null) {
            this._actionMsg = {};
        }
        cc.weijifen.playerNum = this._actionMsg.boardEnd.length; //本局游戏人数
        this._mjDataBind = cc.find("Canvas").getComponent("MJDataBind");

        var rooninit = require('RoomInit');
        this._roomInit = new rooninit();
        this._gameStartInit = require('GameStartInit');
        var setting = require('settingClick');
        this._settingClick = new setting();
        this._gameEvent = require('GameEvent');
        this._gamePlay = require('GamePlay');
        this._gameOver = require('GameOver');

        this._nowIndex = 0;
        this._lastAction = null;
    },

    isReplay: function () {//已有回放数据返回true，无-false
        // return this._actionMsg != null;
        return cc.sys.localStorage.getItem("replayData") != null;
    },

    getNextAction: function () {//数据没有播放完之前，返回下一步需要播放的数据
        var length = 1+this._actionMsg.boardPlay.length;
        if (this._nowIndex >= length || length == undefined) {
            return null;
        }
        var action;
        if (this._nowIndex == 0) {
            for (var i = 0; i < this._actionMsg.boardInit.length; i++) {
                var data = JSON.parse(this._actionMsg.boardInit[i]);
                if (data.player.playuser == cc.weijifen.user.id) {
                    action = this._actionMsg.boardInit[i];//需要根据当前玩家cc.weijifen.user.id来判断拿哪一条数据作为自己视角播放
                    break;
                }
            }
        }
        else if (this._nowIndex == this._actionMsg.boardPlay.length) {
            action = this._actionMsg.boardEnd[0];//需要根据当前玩家cc.weijifen.user.id来判断拿哪一条数据作为自己视角播放
        } else {
            action = this._actionMsg.boardPlay[this._nowIndex - 1];
        }
        this._nowIndex++;
        return action;
    },
    takeAction: function () {//判断下步数据类型，执行相应函数，返回一个时间段
        if (this.isInit) {
            var action = JSON.parse(this.getNextAction());
            if (action == null) {
                return - 1;
            }
            if (this._actionMsg.replacePowerCard) {//宝牌更换时重新刷新宝牌
                let cards = this._actionMsg.powerCard;
                var laiziZM = cc.find("Canvas/cards/tesucards/baocard/child").children[0];
                var LZH = laiziZM.getComponent('DeskCards');
                LZH.init(cards, 'B', true);
                // for(let i= 0 ; i<cards.length;i++){
                //     var laiziZM = cc.instantiate(gameStartInitNode.ZM);
                //     laiziZM.parent = gameStartInitNode.godcard.children[1];
                //     var LZH  = laiziZM.getComponent('DeskCards');
                //     LZH.init(cards[i],'B',true);
                // }
            }
            if (action.changeRoom) {
                this._mjDataBind.changeRoom_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.talkOnSay) {
                this._mjDataBind.talk_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.joinroom) {
                this._roomInit.joinroom_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.lasthands) {//先手出牌
                this._gamePlay.lasthands_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.command == 'allcards') {//结算信息
                this._gameOver.allcards_event(action, this._mjDataBind);
                this.closeOtherBtnClick();
                return this._time;
            }
            if (action.type == 'isOver') {
                this._settingClick.isOver_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.type == 'gameOver') {
                this._settingClick.gameOver_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.type == 'over') {
                this._settingClick.over_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.type == 'unOver') {
                this._settingClick.unOver_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.type == 'banker') {//庄家
                this._gameStartInit.banker_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.type == 'players') {//房间中玩家的信息
                this._gameStartInit.players_event(action, this._mjDataBind);
                return this._time;
            }
            if (action.command == 'play') {//所有玩家手牌
                action.player.powerCard[0] = this._actionMsg.powerCard;
                this.play_event(JSON.stringify(action), this._mjDataBind);
                var res = JSON.parse(cc.sys.localStorage.getItem("replayRes"));
                this.roomLabel.getComponent(cc.Label).string = res.playUserList[0].gameResult.roomNumber;
                this.ningLabel.getComponent(cc.Label).string = '第' + Number(cc.sys.localStorage.getItem("numQuan") + 1) + '局';
                return this._time + 1;
            }
            if (action.takeCards || action.command == 'takeCards') {//出牌
                if (action.user != cc.weijifen.user.id) {
                    this.delCardOnCardArr(action.user, action);
                    this.sortHandCard(action.user);
                }
                this._upid = action.user;
                this._gamePlay.takecard_event(action.takeCards, this._mjDataBind);
                return this._time - 0.2;
            }
            if (action.dealCard) { //摸牌
                action.user != null ? action.userId = action.user : null;
                this._gamePlay.dealcard_event(action.dealCard, this._mjDataBind);
                if (action.userId != cc.weijifen.user.id) {
                    var context = this._mjDataBind;
                    let playerss = this._gameStartInit.player(action.userId, context);
                    var fangwei = 'B';
                    var indexs = 'top';
                    var deskCard;
                    var x = 0;
                    var y = 20;
                    var lastCard = this.top_handCard.children[this.top_handCard.childrenCount - 1];
                    if (playerss.tablepos == 'left') {
                        fangwei = 'L';
                        indexs = 'left';
                        x = 6;
                        y = 190;
                        lastCard = this.left_handCard.children[this.left_handCard.childrenCount - 1];
                    } else if (playerss.tablepos == 'right') {
                        fangwei = 'R';
                        indexs = 'right';
                        lastCard = this.right_handCard.children[this.right_handCard.childrenCount - 1];
                        x = -20;
                        y = -150;
                    }
                    deskCard = lastCard.getComponent('DeskCards');
                    lastCard.zIndex = 800;
                    lastCard.x = x;
                    lastCard.y = y;
                    // cc.eventManager.pauseTarget(lastCard, true);
                    deskCard.init(action.dealCard.card, fangwei, undefined, indexs);//渲染别的玩家摸到的牌
                    return this._time + 1;
                }
                return this._time;
            }
            if (action.action) {
                action.user != null ? action.userId = action.user : null;
                if (action.action == "guo") {
                    return this._time;
                }
                if (action.action == "ting") {
                    return this._time + 1;
                }
                if (action.userId != cc.weijifen.user.id) {
                    if (action.action == 'dan' || action.action == 'peng' || action.action == 'chi' || action.action == 'gang') {
                        this.delCardOnCardArr(action.userId, action);
                        if (action.action == 'peng') {//别的玩家碰的时候，传来的card中只有一张牌，所以按照int值处理
                            action.actionCard.push(action.actionCard[0]);
                            action.actionCard.push(action.actionCard[0]);
                        }
                    }
                } else {
                    if (action.action == 'peng') {//自己碰的时候，传来的card中只有一张牌，所以按照int值处理
                        action.actionCard.push(action.actionCard[0]);
                        action.actionCard.push(action.actionCard[0]);
                    }
                }
                var data = {
                    action: action.action,
                    cards: action.actionCard,//action的几张牌
                    // card:1,  //被吃牌的值。或者蛋牌的值
                    command: "selectaction",
                    userid: action.userId,
                    target: action.target,//被吃牌的人的id
                    time: 0,
                    banker: null,
                    cardvalue: action.actionCard.length,
                }
                this._gameEvent.selectaction_event(data, this._mjDataBind);
                var context = this._mjDataBind;
                if (action.userId == cc.weijifen.user.id && action.action == 'peng') {//自己碰的时候删除自己手牌中的action牌
                    for (let i = 0; i < data.cards.length - 1; i++) {
                        for (let inx = 0; inx < context.playercards.length; inx++) {
                            let temp = context.playercards[inx].getComponent("HandCards");
                            var Va, Vb;
                            if (data.cards[i] >= 0) {
                                Va = parseInt(data.cards[i] / 4);
                            } else {
                                Va = 26 - parseInt(data.cards[i] / 4);;
                            }
                            if (temp.value >= 0) {
                                Vb = parseInt(temp.value / 4);
                            } else {
                                Vb = 26 - parseInt(temp.value / 4);
                            }
                            if (Va == Vb) {
                                context.cardpool.put(context.playercards[inx]);
                                context.playercards.splice(inx, 1);
                            }
                        }
                    }
                }
                return this._time + 1;
            }
        } else {
            this.thisNode.zIndex = 9999;
            this.closeOtherBtnClick();
            this.roomLabel.getComponent(cc.Label).string = cc.weijifen.room;
            this.ningLabel.getComponent(cc.Label).string = '第' + Number(cc.sys.localStorage.getItem("numQuan") + 1) + '局';
            var res = JSON.parse(cc.sys.localStorage.getItem("replayRes"));
            //cc.weijifen.user.id = res.playUserList[0].gameResult.userId;//因为直接用token拿到的战绩，不是自己的所以需要改变默认id以适应gameevent中删除手牌js
            var roomInit = this._roomInit;
            var context = this._mjDataBind;
            var me = 1;
            for (var i = 0; i < res.playUserList.length; i++) {//加载所有玩家头像单位
                var player = context.playerspool.get();
                var playerscript = player.getComponent("MaJiangPlayer");
                var inx = null, tablepos = "";
                if (res.playUserList.length == 2) {
                    if (res.playUserList[i].gameResult.userId == cc.weijifen.user.id) {
                        tablepos = 'current';
                        roomInit.playerPosition(player, { x: -586, y: -130 }, context.root(), 'current', { id: res.playUserList[i].gameResult.userId }, '0');
                    } else {
                        tablepos = 'top';
                        roomInit.playerPosition(player, { x: 389, y: 270 }, context.root(), 'top', { id: res.playUserList[i].gameResult.userId }, '2');
                    }
                } else {
                    if (res.playUserList[i].gameResult.userId == cc.weijifen.user.id) {
                        tablepos = 'current';
                        roomInit.playerPosition(player, { x: -586, y: -130 }, context.root(), 'current', { id: res.playUserList[i].gameResult.userId }, '0');
                    } else if (me == 1) {
                        me++;
                        tablepos = 'right';
                        roomInit.playerPosition(player, { x: 570, y: 80 }, context.root(), 'right', { id: res.playUserList[i].gameResult.userId }, '1');
                    } else if (me == 2) {
                        me++;
                        tablepos = 'top';
                        roomInit.playerPosition(player, { x: 389, y: 270 }, context.root(), 'top', { id: res.playUserList[i].gameResult.userId }, '2');
                    } else if (me == 3) {
                        tablepos = 'left';
                        roomInit.playerPosition(player, { x: -590, y: 80 }, context.root(), 'left', { id: res.playUserList[i].gameResult.userId }, '3');
                    }
                }
                var data = {
                    online: true,
                    id: res.playUserList[i].gameResult.userId,
                    headimgurl: res.userImgUrl[res.playUserList[i].gameResult.userId],
                    username: res.playUserList[i].gameResult.nickname,
                    goldcoins: 520,
                    playerlevel: 1
                }
                playerscript.init(data, inx, tablepos, Number(cc.sys.localStorage.getItem('count')));
                context.playersarray.push(player);
            }
            this.prepareBtn.active = false; //隐藏准备brn等
            this.isInit = true; //因为初始化和游戏数据不在一个数据单位中，加个标识，已经初始化
            this._isPlaying = true;
            return 0.6;
        }
    },
    //关闭不需要的点击响应
    closeOtherBtnClick: function () {
        // //onload 中不行
        // var canvasNode = cc.find("Canvas");
        // cc.eventManager.pauseTarget(canvasNode, true);
        // //然后单独恢复只要点击的这个目标按钮
        // cc.eventManager.resumeTarget(this.backLobby, false);
        // cc.eventManager.resumeTarget(this.sudu, false);
        // cc.eventManager.resumeTarget(this.ctrl, false);
        // //后面记得把整个canvasNode resume回来
    },
    //给别人的手牌排序
    sortHandCard: function (userid) {
        let playerss = this._gameStartInit.player(userid, this._mjDataBind);
        var arr = this.top_handCard.children;
        var x = 0;//微调新抓到牌位子，因为和普通局使用的预制体不一样
        if (playerss.tablepos == 'left') {
            arr = this.left_handCard.children;
            x = 6;
        }
        if (playerss.tablepos == 'right') {
            arr = this.right_handCard.children;
            x = -20;
        }
        for (var i = 0; i < arr.length; i++) {
            var deskcard = arr[i].getComponent('DeskCards');
            arr[i].zIndex = deskcard.value + 200;
            arr[i].x = x;
        }
    },
    //碰、蛋、杠、吃、出牌从非本玩家手牌array中destory对应的牌
    delCardOnCardArr: function (userId, action) {
        var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
        let playerss = this._gameStartInit.player(userId, this._mjDataBind);
        var arr = gameStartInitNode.top_panel.children;
        var fangweis = "top";
        var temp = this.cards_top;
        var index = "B";
        if (playerss.tablepos == 'left') {
            fangweis = "left";
            index = "L";
            temp = this.cards_left;
            arr = gameStartInitNode.left_panel.children;
        } else if (playerss.tablepos == 'right') {
            fangweis = "right";
            temp = this.cards_right;
            index = "R";
            arr = gameStartInitNode.right_panel.children;
        }
        var deskcard;
        if (action.takeCards) { //别人出牌时从别人手牌中删除相应的牌
            for (var inx = 0; inx < arr.length; inx++) {
                deskcard = arr[inx].getComponent("DeskCards");
                if (action.takeCards.card == deskcard.value) {
                    arr[inx].destroy();
                }
            }
            return;
        }
        if (action.action == 'peng') {
            //     var data =JSON.parse(this._actionMsg.boardPlay[this._nowIndex - 2]);
            var card;
            if (action.actionCard[0] >= 0) {
                card = parseInt(action.actionCard[0] / 4);
            } else {
                card = 26 - parseInt(action.actionCard[0] / 4);
            }
            //     let playerss = this._gameStartInit.player(data.user, this._mjDataBind);
            //     var deskArray = this.top_desk.children
            //     if (playerss.tablepos == 'left') {
            //         deskArray = this.left_desk.children;
            //     } else if (playerss.tablepos == 'right') {
            //         deskArray = this.right_desk.children;
            //     }else if(playerss.tablepos == 'current'){
            //         deskArray = this.my_desk.children;
            //     }
            //     for (var i = 0; i < deskArray.length; i++) {//删除被碰的牌
            //         var deskcard = deskArray[inx].getComponent("DeskCards");
            //         if (parseInt(deskcard.value/4) == card) {
            //             deskArray[i].destroy();
            //             break;
            //         }
            //     }
            var count = 0;
            for (var i = 0; i < arr.length; i++) {//删除别的玩家手牌中碰牌
                var deskcard = arr[i].getComponent("DeskCards");
                var values;
                if (deskcard.value >= 0) {
                    values = parseInt(deskcard.value / 4);
                } else {
                    values = 26 - parseInt(deskcard.value / 4);
                }
                if (values == card) {
                    count++;
                    arr[i].destroy();
                    if (count == 2) {
                        break;
                    }
                }
            }
            // var nodes=cc.find("Canvas/cards/handcards/"+fangweis+"/kongcards");
            // var parent=nodes.children[nodes.childrenCount-1];
            // for(let i=0;i<2;i++){
            //     var prefabs=cc.instantiate(temp);
            //     var desks=prefabs.getComponent("DeskCards");
            //     desks.init(action.actionCard[0],index,undefined,fangweis);
            //     prefabs.parent=parent;
            // }
            return;
        }
        for (var i = 0; i < action.actionCard.length; i++) {//别人碰、蛋、杠、吃等时从别人手牌中删除相应的牌
            for (var inx = 0; inx < arr.length; inx++) {
                deskcard = arr[inx].getComponent("DeskCards");
                if (action.actionCard[i] == deskcard.value) {
                    arr[inx].destroy();
                    break;
                }
            }
        }
    },
    play_event: function (data, context, self) {

        self = this;
        if (cc.sys.localStorage.getItem('isPlay') == 'true') {
            cc.sys.localStorage.setItem('zuomangjikai', '1');
        }
        var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
        var gameStartInit = require('GameStartInit');
        cc.sys.localStorage.setItem('isPlay', 'true');
        cc.sys.localStorage.setItem('isGotwsurlPlay', 'true');
        cc.weijifen.zuomangjikai = null;
        gameStartInit.readyTrue('current');
        gameStartInit.readyTrue('right');
        gameStartInit.readyTrue('top');
        gameStartInit.readyTrue('left');
        if (cc.weijifen.match == 'true' || typeof cc.weijifen.match == 'function') {
            cc.find('Canvas/headImg').active = false;
            cc.find('Canvas/players').active = true;
        }
        if (cc.weijifen.playerNum == 2) {
            context.right_player.active = false;
            context.left_player.active = false;
        } else if (cc.weijifen.playerNum == 3) {
            context.left_player.active = false;
        }
        context.loadding();//加载动画
        // 反作弊提示
        let ipTimer = setTimeout(function () {
            let userIp = cc.find("Canvas/userIp");
            if (userIp) userIp.active = false;
            clearTimeout(ipTimer);
        }, 5000);
        //比赛倒计时设置为隐藏
        if (context.starttime.node.parent.active == true) {
            context.starttime.node.parent.active = false;
        }

        if (cc.find('Canvas/summary')) {
            cc.find('Canvas/summary').destroy();
        }

        if (cc.find('Canvas/notice')) {
            cc.sys.localStorage.setItem('notice', 'true');
            cc.find('Canvas/notice').active = false;
        }

        //初始化数据
        cc.weijifen.baopai = null;
        context.roomInfo.active = true;
        cc.sys.localStorage.removeItem('bankerId');
        cc.sys.localStorage.removeItem("roomNo1");
        cc.sys.localStorage.removeItem("matchTime");
        cc.sys.localStorage.removeItem("appTime");
        cc.sys.localStorage.setItem('waitting', 1);
        if (cc.weijifen.playerNum) {
            var peoNum = cc.weijifen.playerNum;
        }
        let cardTime = setTimeout(function () {
            gameStartInit.calcdesc_cards(gameStartInitNode, 136, data.deskcards);
            clearTimeout(cardTime);
        }, 0);

        context = cc.find('Canvas').getComponent('MJDataBind');

        var data = JSON.parse(data);//获取json数据
        context.play_flag = true;
        if (cc.weijifen.wanfa) {
            context.wanfa.getComponent(cc.Label).string = cc.weijifen.wanfa;
        }
        //移动头像到对应位置
        var action = cc.moveTo(0.2, 570, 80);
        context.right_player.runAction(action);
        var action = cc.moveTo(0.2, -590, 80);
        context.left_player.runAction(action);
        var action = cc.moveTo(0.2, 389, 270);
        context.top_player.runAction(action);

        cc.sys.localStorage.setItem('clear', 'true');
        gameStartInit.reinitGame(context);
        //设置圈数、玩法
        cc.find('Canvas/roomNum').getChildByName('quanText').x = 80;//quan节点位置            
        // quanNum.string = (data.round + 1) + '/' + cc.weijifen.maxRound;//圈数
        let wanfa = cc.find('Canvas/rules').getChildByName('label')._components[0];//wanfa节点位置  
        wanfa.string = data.op;
        cc.weijifen.wanfa = data.op;
        context.readyNoActive(context);

        //游戏开始 干掉打牌和听得缓存
        cc.sys.localStorage.removeItem('take');
        cc.sys.localStorage.removeItem('ting');
        context.exchange_state("begin", context);

        /*
        * temp_player 为当前用户的信息
        * cards       当前用户手牌的信息
        */
        var temp_player = data.player;
        var cards = data.player.cards;

        //设置包牌
        if (cc.weijifen.GameBase.gameModel == 'wz' || cc.weijifen.GameBase.gameModel == 'ls') {
            if (temp_player.powerCard) {
                // var powerCard = context.decode(temp_player.powerCard);
                var powerCard = temp_player.powerCard;
                cc.weijifen.powerCard = powerCard;
                gameStartInitNode.csNode.active = true;
                //切换财神图片
                var sprite = gameStartInitNode.csNode.children[0].getComponent(cc.Sprite);
                //sprite.spriteFrame = gameStartInitNode.caishenNode;
                if (powerCard && powerCard.length > 0) {
                    for (let i = 0; i < cc.find('Canvas/cards/tesucards/baocard/child').children.length; i++) {
                        cc.find('Canvas/cards/tesucards/baocard/child').children[i].destroy();
                    }
                    cc.weijifen.baopai = powerCard;
                    for (let i = 0; i < powerCard.length; i++) {
                        cc.weijifen.caishenCard += powerCard[i] + ",";
                        var laiziZM = cc.instantiate(gameStartInitNode.ZM);
                        laiziZM.parent = gameStartInitNode.godcard.children[1];
                        var LZH = laiziZM.getComponent('DeskCards');
                        LZH.init(powerCard[i], 'B', true);
                    }
                }
            }
        } else {
            if (cc.weijifen.GameBase.gameModel != 'nj') {
                // 宝牌显示
                cc.find('Canvas/cards/tesucards/baocard').active = true;
                if (data.player.powerCard) {
                    // 可以看到牌值
                    let cards = data.player.powerCard;
                    // let cards = context.decode(data.player.powerCard);
                    //cc.find('Canvas/cards/tesucards/baocard/baocard/card').children[0].destroy();
                    for (let i = 0; i < cards.length; i++) {
                        var laiziZM = cc.instantiate(gameStartInitNode.ZM);
                        laiziZM.parent = gameStartInitNode.godcard.children[1];
                        var LZH = laiziZM.getComponent('DeskCards');
                        LZH.init(cards[i], 'B', true);
                    }
                }
                //  else {
                //     // 看不到牌值
                //     cc.find('Canvas/cards/tesucards/baocard/child').x = -585;
                //     var laiziFM = cc.instantiate(gameStartInitNode.FM);
                //     var LZH = laiziFM.getComponent('DeskCards');
                //     LZH.init(-3, 'Z', true);
                //     laiziFM.parent = gameStartInitNode.godcard.children[1];
                // }
            }
        }

        var groupNums = 0;
        var pTimes;//便利牌数据
        if (cc.weijifen.GameBase.gameModel == 'wz') {
            pTimes = 5;
        } else {
            pTimes = 4;
        }
        for (var times = 0; times < pTimes; times++) {
            for (let h = 0; h < data.players.length; h++) {
                var players = data.players[h];
                if (data.player.played || players.played || data.player.actions.length > 0 || players.action) {
                    //渲染当前玩家手牌
                    gameStartInit.initMjCards(groupNums, context, cards, temp_player.banker);

                    //初始化其他玩家手牌
                    var inx = 0;
                    var sabi = 0;
                    var gender_fw;
                    for (var i = 0; i < data.players.length; i++) {
                        if (data.players[i].playuser != cc.weijifen.user.id) {   //me      
                            //通过判断 id 来确定位置上的牌的张数
                            var arry = context.playersarray;
                            for (let j = 0; j < arry.length; j++) {
                                var card = arry[j].getComponent('MaJiangPlayer');  //玩家头像框JS   
                                if (data.players[i].playuser == card.data.id && card.tablepos != 'current') {
                                    data.players[i].gender == 2 ? gender_fw = 'w' : gender_fw = 'm';
                                    cc.weijifen.genders[card.tablepos] = gender_fw;
                                    if (card.tablepos == 'left') {
                                        sabi = 2;
                                        break;
                                    } else if (card.tablepos == 'top') {
                                        sabi = 1;
                                        break;
                                    }
                                    sabi = 0;
                                    break;
                                } else if (card.tablepos == 'current') {
                                    data.player.gender == 2 ? gender_fw = 'w' : gender_fw = 'm';
                                    cc.weijifen.genders['current'] = gender_fw;
                                }
                            }
                            this.initPlayerHandCards(groupNums, data.players[inx++].deskcards, sabi, context, false, data.players[i].banker, peoNum, data.players[i].playuser, data.players[i].history);
                        }
                    }
                    groupNums = groupNums + 1;
                } else {
                    gameStartInit.initMjCards(groupNums, context, cards, temp_player.banker);
                    /**
                     * 初始化其他玩家数据
                     */
                    var inx = 0;
                    var sabi = 0;
                    var gender_fw;
                    for (var i = 0; i < data.players.length; i++) {
                        if (data.players[i].playuser != cc.weijifen.user.id) {
                            //通过判断 id 来确定位置上的牌的张数
                            var arry = context.playersarray;
                            if (arry) {
                                for (let j = 0; j < arry.length; j++) {
                                    var card = arry[j].getComponent('MaJiangPlayer');
                                    if (data.players[i].playuser == card.data.id && card.tablepos != 'current') {
                                        data.players[i].gender == 2 ? gender_fw = 'w' : gender_fw = 'm';
                                        cc.weijifen.genders[card.tablepos] = gender_fw;
                                        if (card.tablepos == 'left') {
                                            sabi = 2;
                                            break;
                                        } else if (card.tablepos == 'top') {
                                            sabi = 1;
                                            break;
                                        }
                                        sabi = 0;
                                        break;
                                    } else if (card.tablepos == 'current') {
                                        data.player.gender == 2 ? gender_fw = 'w' : gender_fw = 'm';
                                        cc.weijifen.genders['current'] = gender_fw;
                                    }
                                }
                                this.initPlayerHandCards(groupNums, data.players[inx++].deskcards, sabi, context, false, data.players[i].banker, peoNum, data.players[i].playuser, data.players[i].history);
                            }
                        }
                    }
                    groupNums = groupNums + 1;
                }

            }
        }


        cc.weijifen.audio.playSFX('shuffle.mp3');
        var mp3Music = cc.weijifen.audio.getSFXVolume();
        // let ani = gameStartInitNode.cards_panel.getComponent(cc.Animation);
        // ani.play("majiang_reorder") ;
        var maxvalue = -130;
        var maxvalluecard;
        //排序 ---设置牌的zIndex（官方排序方法要用到）
        if (context.playercards) {
            for (var i = 0; i < context.playercards.length; i++) {
                if (context.playercards[i].children[1].active == false) {
                    let temp_script = context.playercards[i].getComponent("HandCards");
                    if (temp_script.value >= 0) {
                        context.playercards[i].zIndex = temp_script.value;
                    } else {
                        context.playercards[i].zIndex = 200 + temp_script.value;
                    }
                    if (context.playercards[i].zIndex > maxvalue) {
                        maxvalue = context.playercards[i].zIndex;
                        maxvalluecard = context.playercards[i];
                    }
                }
            }
        }
        gameStartInit.initcardwidth();
        if (cc.sys.localStorage.getItem('cb') != 'true') {
            context.exchange_state("play", context);
        }

        if (data.player.banker == true) {//当前玩家是庄家
            let datas = {};
            datas.userid = data.player.playuser;
            gameStartInit.banker_event(datas, context);
        }

        cc.weijifen.audio.setSFXVolume(0);
        //重连判断action
        var istake = false;
        for (let i = 0; i < data.players.length; i++) {
            if (data.players[i].played) {
                istake = true;
            }
            if (data.players[i].actions.length > 0) {
                istake = true;
            }
            if (data.players[i].ting) {
                let playerss = gameStartInit.player(data.players[i].playuser, context);
                context[playerss.tablepos + 'ting'].active = true;
            }

            //判断谁是庄家
            var datas = {};
            if (data.players[i].banker == true) {
                datas.userid = data.players[i].playuser;
                gameStartInit.banker_event(datas, context);
            }
        }

        //渲染自己的排面数据
        if (data.player.played || istake || data.player.actions.length > 0) {
            cc.sys.localStorage.setItem('cl', 'true');//重连状态设置为true
            if (data.player.played) {
                //渲染已经打出去的牌面数据
                var deskcards = data.player.played;
                for (let i = 0; i < deskcards.length; i++) {
                    let desk_card = cc.instantiate(gameStartInitNode.takecards_one);
                    let temp = desk_card.getComponent("DeskCards");
                    temp.init(deskcards[i], 'B');
                    context.deskcards.push(desk_card);
                    desk_card.parent = context.deskcards_current_panel;
                }
            }

            //渲染当前玩家   吃 碰 杠等数据
            var action = data.player.actions;
            gameStartInit.actionCards(cc.weijifen.user.id, action, context, "current");

            if (data.player.ting) {//当前玩家状态为听牌状态
                context.currentting.active = true;
                cc.sys.localStorage.setItem('alting', 'true');
                cc.sys.localStorage.setItem('altings', 'true');
                cc.sys.localStorage.setItem('take', 'true')
                context.tingAction(true);
            }

            //渲染其他玩家吃 碰 杠等数据
            for (let i = 0; i < data.players.length; i++) {
                //其他玩家的kong 牌
                if (data.touchPlay) {
                    let player = gameStartInit.player(data.touchPlay, context)
                    context.exchange_searchlight(player.tablepos, context);
                    if (data.touchPlay == cc.weijifen.user.id) {
                        cc.sys.localStorage.setItem('take', 'true');
                    }
                }
                // 是否庄家，是否打牌
                if (!data.player.played && data.player.banker) {
                    cc.sys.localStorage.setItem('take', 'true');
                }
                var player = gameStartInit.player(data.players[i].playuser, context);


                if (data.players[i].actions.length > 0) {//其他玩家有吃碰杠
                    var action = data.players[i].actions;
                    gameStartInit.actionCards(player.data.id, action, context, player.tablepos);
                }

                //其他玩家的打出去的牌    
                if (data.players[i].played) {
                    var deskcardss = data.players[i].played;
                    var player = gameStartInit.player(data.players[i].playuser, context);
                    for (let j = 0; j < deskcardss.length; j++) {
                        gameStartInit.initDeskCards(deskcardss[j], player.tablepos, context)
                    }
                }
            }


            if (gameStartInitNode.head_right_parent.children.length > 5) {
                cc.director.loadScene('majiang');
            }
        }
        //当前玩家补花 data.player
        var buhua;
        if (temp_player.buHua && temp_player.buHua.length) {
            // buhua = context.decode(temp_player.buHua);//补花
            buhua = temp_player.buHua;
            let temp = gameStartInit.player(temp_player.playuser, context);
            for (var i = 0; i < buhua.length; i++) {
                gameStartInit.buhuaModle(buhua[i], temp.tablepos, '', temp.tablepos, context, "");
            }
        }

        //其他玩家补花 data.players
        for (var i = 0; i < data.players.length; i++) {
            if (data.players[i].buHua) {
                // buhua = context.decode(data.players[i].buHua);//补花
                buhua = data.players[i].buHua;
                let temp = gameStartInit.player(data.players[i].playuser, context);
                for (var j = 0; j < buhua.length; j++) {
                    gameStartInit.buhuaModle(buhua[j], temp.tablepos, '', temp.tablepos, context, "");
                }
            }
        }
        context.closeloadding();
        if (cc.find('Canvas/cards/tesucards/baocard/child').children.length > 1 && cc.weijifen.GameBase.gameModel == 'ch') {
            cc.find('Canvas/cards/tesucards/baocard/child').children[1].destroy();
        }
    },
    initPlayerHandCards: function (groupNums, deskcards, inx, context, spec, banker, peoNum, playerId, cardsArrays) {
        var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
        let parent = gameStartInitNode.right_panel;
        let cardarray = context.rightcards;
        let prefab = this.cards_right;
        if (peoNum == 2) {
            parent = gameStartInitNode.top_panel;
            cardarray = context.topcards;
            prefab = this.cards_top;
        } else if (peoNum == 3 && inx == 1) {
            parent = gameStartInitNode.top_panel;
            cardarray = context.topcards;
            prefab = this.cards_top;
        } else {
            if (inx == 1) {
                parent = gameStartInitNode.top_panel;
                cardarray = context.topcards;
                prefab = this.cards_top;
            } else if (inx == 2) {
                parent = gameStartInitNode.left_panel;
                cardarray = context.leftcards;
                prefab = this.cards_left;
            }
        }
        /*if (peoNum == 3 && cc.weijifen.match == 'true') {
            if (playerId == cc.sys.localStorage.getItem('top')) {
                parent = gameStartInitNode.top_panel;
                cardarray = context.topcards;
                prefab = gameStartInitNode.cards_top ;
            }
            if (playerId == cc.sys.localStorage.getItem('right')) {
                parent = gameStartInitNode.right_panel;
                cardarray = context.rightcards;
                prefab = gameStartInitNode.cards_right ;
            }
        }*/

        this.initOtherCards(groupNums, context, deskcards, prefab, cardarray, parent, spec, inx, banker, peoNum, cardsArrays);    //左侧，
    },
    initOtherCards: function (group, context, cards, prefab, cardsarray, parent, spec, inx, banker, peoNum, cardsArrays) {
        context = cc.find('Canvas').getComponent('MJDataBind');
        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].getComponent('SpecCards').node.height = 0;
            parent.children[i].getComponent('SpecCards').node.width = 0;
        }
        for (var i = group * 4; i < cards && i < (group + 1) * 4; i++) {
            let temp = cc.instantiate(prefab);
            let temp_script = temp.getComponent("SpecCards");
            temp_script.init(spec, inx);
            let desk = temp.getComponent("DeskCards"); //渲染牌需要的图集
            if (cardsArrays) {
                if (inx == 1 || peoNum == 2) {
                    temp.y += 45;
                    desk.init(cardsArrays[i], 'B', undefined, 'top');
                } else if (inx == 2) {
                    temp.x = 6;
                    desk.init(cardsArrays[i], 'L', undefined, 'left');
                } else {
                    temp.x = -20;
                    desk.init(cardsArrays[i], 'R', undefined, 'right');
                }
            }
            temp.zIndex = 200 + cardsArrays[i];
            temp.parent = parent;
            cardsarray.push(temp);
        }
    },
    update(dt) {
        if (this._isPlaying && this.isReplay() == true && this._nextPlayTime > 0) {
            this._nextPlayTime -= dt;
            if (this._nextPlayTime < 0) {
                this._nextPlayTime = this.takeAction();
            }
        }
    },
});
