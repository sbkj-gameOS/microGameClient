cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        miao: cc.Label,
        list: cc.Prefab,// 每把牌结束后，玩家牌列表
        endlist: cc.Prefab,// 最终结束玩家输赢列表
        layout: cc.Node,// list节点父元素---小局结算
        layout2: cc.Node, // 大局---结算       
        action: { default: null },
        win: cc.Node,
        lose: cc.Node,
        liuju: cc.Node,
        bp: cc.Prefab,
        bpb: cc.Prefab,
        bpp: cc.Node,
        num: cc.Label,
        dabaopai: cc.Node,
        gameend: cc.Node,
        op: cc.Label,
        time: cc.Label,


        close: {             //总结算panel的关闭btn
            default: null,
            type: cc.Node
        },
         base: {             //总结算panel的关闭btn
            default: null,
            type: cc.Node
        },
        close1: cc.Node,
        close2: cc.Node,

        goon1: cc.Node, // 继续游戏按钮
        goon2: cc.Node, //返回大厅按钮
        //分享按钮
        share: {
            default: null,
            type: cc.Node
        },
        csNode: {
            default: null,
            type: cc.Node
        },
        cs1: {
            default: null,
            type: cc.SpriteFrame
        },
        layout2Sprite: cc.SpriteFrame,

    },

    // use this for initialization
    onLoad: function () {
        this.times = 20;
        if (cc.weijifen.wanfa) {
            this.op.string = cc.weijifen.wanfa;
        }
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        //切换游戏财神图片
        var sprite = this.csNode.getComponent(cc.Sprite);
        if (cc.weijifen.GameBase.gameModel == 'wz') {
            sprite.spriteFrame = this.cs1;
            this.csNode.width = this.csNode.width - 40;
            this.csNode.y = this.csNode.y - 10;
            this.csNode.x = this.csNode.x + 10;
        }

        this.time.string = '时间：' + time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + '  ' + hours + ': ' + minutes;

    },
    daojishi: function () {
        this.times = this.times - 1;
        if (this.miao) {
            this.miao.string = this.times;
            //console.log(this.time);
            if (cc.find('Canvas/big_cards').children) {
                cc.find('Canvas/big_cards').removeAllChildren();
            }
            if (this.times < 0) {
                clearInterval(this.t);
                if (cc.weijifen.matchOver) {
                    cc.weijifen.matchOver = null;
                    this.miao.string = '';
                    return
                }
                cc.find('Canvas/summary').destroy();
            }
        }
    },
    /*
    * 一圈游戏结束，点击继续按钮回到游戏中
    */
    init: function () {
        let he = this;
       
        this.goon1.active = true;
        this.goon2.active = false;
        this.share.active = true;
        this.gameend.active = false;
        this.close.active = false;
         if(cc.sys.localStorage.getItem("replayData")!=null){
            this.goon1.active = false;
            this.share.active = false;
        }
       // this.close1.active = true;
        var basesprite=this.base.getComponent(cc.Sprite);
        basesprite.spriteFrame= this.layout2Sprite;        
        if (cc.weijifen.match == 'true' || typeof cc.weijifen.match == 'function') {
            this.t = setInterval(function () { he.daojishi() }, 1000);
        } else {
            this.miao.node.active = false;
        }
        var userInfo = this.data;
        // if(userInfo.gameOver==true){
        //     var a = this.goon1.children[0].getComponent(cc.Label);
        //     a.string = '查看总成绩';
        //     a.fontSize = 30;
        // }
        this.dabaopai.active = true;
        let card, baopai;
        if (cc.weijifen.GameBase.gameModel == 'wz') {
            this.dabaopai.children[3].getComponent(cc.Label).string="";
            this.dabaopai.children[1].y+=65;
            this.dabaopai.children[2].y+=65;
            if (cc.weijifen.baopai) {
                for (var i = 0; i < cc.weijifen.baopai.length; i++) {
                    card = cc.instantiate(this.bp);
                    baopai = card.getComponent('DeskCards');
                    if (cc.weijifen.powerCard != null) {
                        baopai.node.children[1].active = true;
                    }
                    baopai.init(cc.weijifen.baopai[i], 'B', true);
                    card.parent = this.bpp;
                }
            } else {
                card = cc.instantiate(this.bpb);
                card.parent = this.bpp;
            }
        }
        this.num.string = cc.find('Canvas').getComponent('MJDataBind').gddesk_cards;
        if (userInfo.playOvers) {
            let win = false;
            let lose = false;
            let liuju;
            for (let i = 0; i < userInfo.playOvers.length; i++) {
                var list = cc.instantiate(this.list);
                list.getComponent('EndCards').setData(userInfo.playOvers[i]);
                list.parent = this.layout;              
                if (userInfo.playOvers[i].user == cc.weijifen.user.id) {
                    if (userInfo.playOvers[i].win == true) {
                        this.win.active = true;
                        this.lose.active = false;
                        this.liuju.active = false;
                    } else{
                        this.lose.active = true;
                        this.win.active = false;
                        this.liuju.active = false;
                    }                   
                }
            }
            if (userInfo.unHu == true) {
                this.liuju.active = true;
                this.lose.active = false;
                this.win.active = false;
            }
        }

    },
    /*
    * 房间游戏结束，可返回大厅
    */
    init2: function () {
       this.goon1.active = false;
        this.goon2.active = true;
        this.close2.active = false;
        var userInfo = this.data;
        this.gameend.active = true;
        this.close.active = true;
        if(cc.sys.localStorage.getItem("replayData")!=null){
            this.share.active = false;
            this.goon2.active = false;
            this.close.active = false;
        }
        var basesprite=this.base.getComponent(cc.Sprite);
        basesprite.spriteFrame= null;     
        if (userInfo.players) {
            let win = false;
            let lose = false;
            let liuju;
            let count = 0;
            for (let i = 0; i < userInfo.players.length; i++) {
                var list = cc.instantiate(this.endlist);
                var dayingjia = this.dayingjia('pointCount', i);
                var paoshou = this.dayingjia('dianCount', i);
                list.getComponent('endUserInfo').setData(userInfo.players[i], dayingjia, paoshou);
                list.parent = this.layout2;
            }
            //this.layout2.parent.getChildByName('dajubg').getComponent(cc.Sprite).spriteFrame = this.layout2Sprite;
        }

    },
    dayingjia: function (counts, inx) {
        let zhen = true;
        let count = this.data.players[inx][counts];
        for (let i = 0; i < this.data.players.length; i++) {
            if (count == 0 || (i != inx && this.data.players[i][counts] > count)) {
                zhen = false;
                break;
            }
        }
        return zhen;
    },
    /**
     * 结算页面上的 背景的 点击事件，主要是用于事件拦截，禁用冒泡
     * @param event
     */
    onBGClick: function (event) {

        //后期这里加个判定  当 数小于开局设定局数时 发射这个事件  当局数满了 发送游戏结束的事件，并且退出房间。
        this.node.dispatchEvent(new cc.Event.EventCustom('restar', true));
    },
    /**
     * 结算页面上的关闭按钮 的 点击事件 , 关闭按钮 和 继续按钮 功能是一样的，都是继续游戏
     */
    onCloseClick: function () {

    },
    setData: function (data) {
        // 此处的data为返回的值，有事件、玩家的信息。
        this.data = data;
        this.init();
    },
    setDataEnd: function (data) {

        this.data = data;
        this.init2();
    },
    stopBubble: function (event) {
        event.bubble = false;
    },
});
