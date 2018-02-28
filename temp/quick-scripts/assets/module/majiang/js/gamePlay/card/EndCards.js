(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/module/majiang/js/gamePlay/card/EndCards.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'add31U5TpRABZmtKeG+Qze+', 'EndCards', __filename);
// module/majiang/js/gamePlay/card/EndCards.js

'use strict';

var WJFCommon = require("WJFCommon");

cc.Class({
    extends: WJFCommon,
    properties: {
        headimgs: cc.Node,
        peoname: cc.Label,
        count: cc.Label,
        mjloyad: cc.Node,
        mjloyad2: cc.Node,
        mjkong: cc.Node,
        jifan: cc.Label,
        card: cc.Prefab,
        win: cc.Node,
        hu: cc.Label,
        dong: cc.Node,
        xi: cc.Node,
        nan: cc.Node,
        bei: cc.Node,
        redwin: cc.SpriteFrame,
        diaopao: cc.SpriteFrame,
        target: cc.Node,
        hua: cc.Prefab,
        buhua: cc.Prefab,
        huaParent: cc.Node,
        banker: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init() {
        var headimg = void 0;
        var gang = 0;
        var fan = 0;
        var units = void 0;
        var drop = '';
        var noTing = '';
        var hucards = -111;
        var tai = '';
        var hua = void 0;
        this.hu.string = '';
        if (this.data.point) {
            var id = this.data.user;
            var players = cc.find('Canvas').getComponent('MJDataBind').playersarray;
            for (var i = 0; i < players.length; i++) {
                var _player = players[i].getComponent('MaJiangPlayer');
                if (id == _player.data.id) {
                    _player.goldcoins.string = this.data.point;
                }
            }
        }
        if (this.data.gang) {
            gang = this.data.gang.count;
        }
        if (this.data.balance) {
            var huaCards = void 0;
            var card = void 0;
            var baopai = void 0;
            var summary = cc.find('Canvas/summary').getComponent('SummaryClick');
            if (this.data.balance.bu) {
                huaCards = this.decode(this.data.balance.bu);
                for (var _i = 0; _i < huaCards.length; _i++) {
                    var _card = cc.instantiate(this.buhua);
                    _card.getComponent('BuHuaAction').init(huaCards[_i]);
                    _card.parent = this.huaParent;
                }
            }
            if (this.data.balance.bao != -1) {
                card = cc.instantiate(summary.bp);
                baopai = card.getComponent('DeskCards');
                baopai.init(this.data.balance.bao, 'B', true);
                card.parent = summary.bpp;
            }
            if (this.data.balance.huCard) {
                hucards = this.data.balance.huCard;
            }
            if (this.data.balance.drop == true) {
                drop = '点炮';
                this.target.getComponent(cc.Sprite).spriteFrame = this.diaopao;
                this.target.color = new cc.Color(255, 255, 255);
            }
            if (this.data.balance.taishu) {
                tai = ' ' + this.data.balance.taishu + '台';
            }
            units = this.data.balance.units;
            fan = this.data.balance.count;

            if (units) {
                var point = '';
                for (var _i2 = 0; _i2 < units.length; _i2++) {
                    if (cc.beimi.GameBase.gameModel == 'wz') {
                        point = units[_i2].point;
                    }
                    this.hu.string += units[_i2].tip + ' ' + point + ' ';
                }
            }
            if (cc.beimi.GameBase.gameModel != 'wz') {
                this.jifan.string = fan + '番' + '   ' + gang + '杠   ';
                if (this.data.balance.noTing == true) {
                    noTing = '未上听';
                } else {
                    noTing = '上听';
                }
            }
        }

        this.hu.string += noTing + '  ' + drop + ' ' + tai;
        var player = cc.find('Canvas').getComponent('MJDataBind').playersarray;
        var cardsss = this.decode(this.data.cards);
        function sortNumber(a, b) {
            return a - b;
        }
        cardsss.sort(sortNumber);

        for (var _i3 = 0; _i3 < player.length; _i3++) {
            var pl = player[_i3].getComponent('MaJiangPlayer');
            if (pl.data.id == this.data.user) {
                if (this[pl.wind]) {
                    this[pl.wind].active = true;
                }
                if (this.data.user == cc.beimi.banker) {
                    this.banker.active = true;
                }
                headimg = pl.data.headimgurl;
                this.peoname.string = pl.data.username;
            }
        }
        if (headimg) {
            var imgurl = headimg;
            var sprite = this.headimgs.getComponent(cc.Sprite);
            var head = this.headimgs;
            cc.loader.load({ url: imgurl, type: 'jpg' }, function (suc, texture) {
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                head.width = 52;
                head.height = 47;
            });
        }
        this.count.string = this.data.count;
        if (this.data.win == true) {
            //cc.beimi.audio.playSFX('nv/hu.mp3');
            this.target.getComponent(cc.Sprite).spriteFrame = this.redwin;
            this.win.active = true;
        }
        for (var _i4 = 0; _i4 < this.data.actions.length; _i4++) {
            var _sortNumber = function _sortNumber(a, b) {
                return a - b;
            };

            var kong = cc.instantiate(this.mjkong);
            kong.parent = this.mjloyad;
            var action = this.decode(this.data.actions[_i4].card);
            ;
            action.sort(_sortNumber);
            if (this.data.actions[_i4].action == 'gang' && action.length == 1) {
                var c = [action[0], action[0], action[0], action[0]];
                for (var h = 0; h < 4; h++) {
                    var _card2 = cc.instantiate(this.card);
                    //console.log(cd[j]);
                    var a = false;
                    if (this.data.actions[_i4].type == 'an' && h != 2) {
                        a = true;
                    }
                    var b = _card2.getComponent('DanAction');
                    b.init(c[h], a, '', '1');
                    b.target.height = 53;
                    b.target.width = 32;
                    _card2.parent = kong;
                }
            } else if (this.data.actions[_i4].action == 'dan') {
                var mj = cc.find('Canvas').getComponent('MJDataBind');
                var _player2 = mj.player(this.data.user, mj);
                var _card3 = void 0;
                if (_player2.tablepos == 'current') {
                    _card3 = cc.find('Canvas/content/handcards/deskcard/kong').children[_i4 + 1];
                } else {
                    _card3 = cc.find('Canvas/content/handcards/' + _player2.tablepos + 'desk/kong').children[_i4 + 1];
                }
                for (var q = 0; q < _card3.children.length; q++) {
                    var xiao = cc.instantiate(this.card);
                    var xiaocard = xiao.getComponent('DanAction');
                    var da = _card3.children[q].getComponent('DanAction');
                    xiaocard.init(da.mjtype, false, '', da.count.string);
                    xiaocard.target.height = 53;
                    xiaocard.target.width = 32;
                    xiao.parent = kong;
                }
            } else {
                for (var j = 0; j < action.length; j++) {
                    var _card4 = cc.instantiate(this.card);
                    //console.log(cd[j]);
                    var _a = false;
                    var _c = action[j];
                    var _b = _card4.getComponent('DanAction');
                    _b.init(_c, _a, '', '1');
                    _b.target.height = 53;
                    _b.target.width = 32;
                    _card4.parent = kong;
                }
            }
        }
        {

            var _kong = cc.instantiate(this.mjkong);
            for (var _i5 = 0; _i5 < cardsss.length; _i5++) {
                _kong.parent = this.mjloyad;
                if (cardsss[_i5] > -32) {
                    var _card5 = cc.instantiate(this.card);
                    var _b2 = _card5.getComponent('DanAction');
                    _b2.init(cardsss[_i5], false, '', '1', '', true);
                    _b2.target.height = 53;
                    _b2.target.width = 32;
                    _card5.parent = _kong;
                } else {
                    var _card6 = cc.instantiate(this.hua);
                    var _b3 = _card6.getComponent('BuHuaAction');
                    _b3.init(cardsss[_i5], '', true);
                    _b3.target.height = 53;
                    _b3.target.width = 32;
                    _card6.parent = _kong;
                }
            }
        }
        {
            if (this.data.win) {
                var _kong2 = cc.instantiate(this.mjkong);
                _kong2.parent = this.mjloyad;
                if (this.data.balance.huCard > -32) {
                    var _card7 = cc.instantiate(this.card);
                    var _b4 = _card7.getComponent('DanAction');
                    _b4.init(this.data.balance.huCard, false, '', '1', '', true);
                    _b4.target.height = 53;
                    _b4.target.width = 32;
                    _card7.parent = _kong2;
                } else {
                    var _card8 = cc.instantiate(this.hua);
                    var _b5 = _card8.getComponent('BuHuaAction');
                    _b5.init(this.data.balance.huCard, '', true);
                    _b5.target.height = 53;
                    _b5.target.width = 32;
                    _card8.parent = _kong2;
                }
            }
        }
    },
    setData: function setData(data) {
        this.data = data;
        this.init();
    },
    isDan: function isDan(action) {

        var type = 'yao';
        for (var i = 0; i < action.length; i++) {
            if (action[i] < 0) {
                if (parseInt(action[i] / 4) < -3) {
                    type = 'wind';
                    break;
                } else {
                    type = 'xi';
                    break;
                }
            } else {
                if (parseInt(action[i] % 36 / 4) == 8 && (parseInt(parseInt(action[i] / 4) / 9) == 0 || parseInt(parseInt(action[i] / 4) / 9) == 1 || parseInt(parseInt(action[i] / 4) / 9) == 2)) {
                    type = 'jiu';
                    break;
                }
            }
        }
        return type;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=EndCards.js.map
        