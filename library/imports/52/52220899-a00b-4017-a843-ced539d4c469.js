"use strict";
cc._RF.push(module, '52220iZoAtAF6hDztU51MRp', 'GamePlay');
// module/majiang/js/gamePlay/GamePlay.js

'use strict';

cc.Class({
	extends: cc.Component,

	properties: {},

	// use this for initialization
	onLoad: function onLoad() {},
	statics: {
		lasthands_event: function lasthands_event(data, context) {
			context = cc.find('Canvas').getComponent('MJDataBind');
			if (data.userid == cc.weijifen.user.id) {
				//该我出牌 , 庄家出牌，可以不用判断是否庄家了 ，不过，庄家数据已经传过来了
				context.exchange_state("lasthands", context);
				context.exchange_searchlight("current", context);
				if (cc.sys.localStorage.getItem('altake') != 'true') {
					cc.sys.localStorage.setItem('take', 'true');
				}
			} else {
				context.exchange_state("otherplayer", context); //当前玩家出牌，计时器开始计时，探照灯照向该玩家
				for (var inx = 0; inx < context.playersarray.length; inx++) {
					var temp = context.playersarray[inx].getComponent("MaJiangPlayer");
					if (temp.data.id == data.userid) {
						context.exchange_searchlight(temp.tablepos, context);;break;
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
		takecard_event: function takecard_event(data, context) {

			context = cc.find('Canvas').getComponent('MJDataBind');
			var gameStartInit = require('GameStartInit');
			var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
			var gamePlay = require('GamePlay');
			cc.sys.localStorage.removeItem('cb');
			gamePlay.qujuju(data);
			var kongcard = void 0;
			// cc.weijifen.audio.playSFX('give.mp3');
			var playerss = gameStartInit.player(data.userid, context);
			if (data.ting) {
				if (context[playerss.tablepos + 'ting'].active == false) {
					context.tingting.active = true;
					setTimeout(function () {
						context.tingting.active = false;
					}, 2000);
					context[playerss.tablepos + 'ting'].active = true;
				}
			}
			if (data.userid == cc.weijifen.user.id) {
				if (!data.ting) {
					gameStartInit.tingnoaction();
				}

				var father = cc.find('Canvas').getComponent('MJDataBind').selectfather;
				if (father.active == true) {
					father.active = false;
					father.children[0].children[1].children.splice(0, father.children[0].children[1].children.length);
				}

				gameStartInit.initcardwidth();

				if (data.ting) {
					cc.sys.localStorage.setItem('alting', 'true');
					cc.sys.localStorage.setItem('altings', 'true');
					cc.sys.localStorage.setItem('take', 'true');
				} else {
					cc.sys.localStorage.removeItem('alting');
				}
				if (data.notSend || cc.sys.localStorage.getItem('take') != 'true' && !data.allow) {
					return;
				}
				cc.sys.localStorage.removeItem('altake');
				cc.sys.localStorage.removeItem('take');
				for (var inx = 0; inx < context.playercards.length; i++) {
					var handcards = context.playercards[inx].getComponent("HandCards");
					handcards.reinit();
					if (data.card == handcards.value) {
						context.playercards[inx].zIndex = 0;
						/**
       * 从数组中移除
       */
						context.playercards[inx].parent = null;

						handcards.reinit();
						/**
       * 还回 对象池
       */
						context.cardpool.put(context.playercards[inx]);
						/**
       * 从数组中移除
       */
						context.playercards.splice(inx, 1);
						/**
       * 放到桌面 ， 需要重构
       */
						var desk_card = cc.instantiate(gameStartInitNode.takecards_one);
						var temp = desk_card.getComponent("DeskCards");
						temp.init(handcards.value, 'B');

						context.deskcards.push(desk_card);
						desk_card.parent = context.deskcards_current_panel;
					} else {
						handcards.reinit();
						if (handcards.selectcolor == true) {
							context.playercards[inx].zIndex = 1000 + handcards.value;
						} else {
							if (handcards.value >= 0) {
								context.playercards[inx].zIndex = handcards.value;
							} else {
								context.playercards[inx].zIndex = 200 + handcards.value;
							}

							if (context.playercards[inx].children[1].active) {
								context.playercards[inx].zIndex = -1;
							}
						}
						inx = inx + 1; //遍历 ++,不处理移除的 牌
					}
				}
				context.exchange_state("takecard", context); //隐藏 提示状态
			} else {
				//其他玩家出牌   
				var _temp = gameStartInit.player(data.userid, context);
				var cardpanel = void 0,
				    cardprefab = void 0,
				    deskcardpanel = void 0;
				if (!data.notSend) {
					if (_temp.tablepos == "right") {
						for (var inx = 0; inx < gameStartInitNode.right_panel.children.length; inx++) {
							var right_temp = gameStartInitNode.right_panel.children[inx].getComponent("SpecCards");
							right_temp.reinit();
						}
						cardpanel = gameStartInitNode.right_panel;
						cardprefab = gameStartInitNode.takecards_right;
						deskcardpanel = context.deskcards_right_panel;

						var _desk_card = cc.instantiate(cardprefab);
						var desk_script = _desk_card.getComponent("DeskCards");
						desk_script.init(data.card, 'R');
						_desk_card.parent = deskcardpanel;
					} else if (_temp.tablepos == "left") {
						for (var inx = 0; inx < gameStartInitNode.left_panel.children.length; inx++) {
							var left_temp = gameStartInitNode.left_panel.children[inx].getComponent("SpecCards");
							left_temp.reinit();
						}
						cardpanel = gameStartInitNode.left_panel;
						cardprefab = gameStartInitNode.takecards_left;
						deskcardpanel = context.deskcards_left_panel;

						var _desk_card2 = cc.instantiate(cardprefab);
						var _desk_script = _desk_card2.getComponent("DeskCards");
						_desk_script.init(data.card, 'L');
						_desk_card2.parent = deskcardpanel;
					} else if (_temp.tablepos == "top") {
						for (var inx = 0; inx < gameStartInitNode.top_panel.children.length; inx++) {
							var top_temp = gameStartInitNode.top_panel.children[inx].getComponent("SpecCards");
							top_temp.reinit();
						}
						cardpanel = gameStartInitNode.top_panel;
						cardprefab = gameStartInitNode.takecards_one;
						deskcardpanel = context.deskcards_top_panel;

						var _desk_card3 = cc.instantiate(cardprefab);
						var _desk_script2 = _desk_card3.getComponent("DeskCards");
						_desk_script2.init(data.card, 'B');
						_desk_card3.parent = deskcardpanel;
					}
					/**
      * 销毁其中一个对象
      */

					cardpanel.children[cardpanel.children.length - 1].destroy();
				}
			}
		},
		/**
   * 下一个玩家抓牌的事件， 如果上一个玩家出牌后，没有其他玩家杠、碰、吃、胡等动作，则会同时有一个抓牌的事件，否则，会等待玩家 杠、碰、吃、胡完成
   * @param data
   * @param context
   */
		dealcard_event: function dealcard_event(data, context) {
			var gamePlay = require('GamePlay');
			if (cc.sys.localStorage.getItem('cb') == 'true' && cc.sys.localStorage.getItem('altings') != 'true') {
				setTimeout(function () {
					gamePlay.dealcards(data, context);
				}, 2100);
			} else {
				gamePlay.dealcards(data, context);
			}
		},
		dealcards: function dealcards(data, context) {
			cc.sys.localStorage.removeItem('cb');
			var gamePlay = require('GamePlay');
			var gameStartInit = require('GameStartInit');
			var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
			context = cc.find('Canvas').getComponent('MJDataBind');
			context.closeloadding();
			if (cc.weijifen.playerNum) {
				var peoNum = cc.weijifen.playerNum;
			}
			var player = gameStartInit.player(data.userid, context);
			gamePlay.select_action_searchlight(data, context, player);

			//摸牌补花
			if (data.bu) {
				var buhua = context.decode(data.bu); //补花
				for (var i = 0; i < buhua.length; i++) {
					gameStartInit.buhuaModle(buhua[i], player.tablepos, '', player.tablepos, context, "");
				}
			}

			if (data.userid == cc.weijifen.user.id) {
				if (cc.sys.localStorage.getItem('altings') != 'true') {
					gameStartInit.tingnoaction();
				}
				if (cc.sys.localStorage.getItem('altake') != 'true') {
					cc.sys.localStorage.setItem('take', 'true');
				} else {
					cc.sys.localStorage.removeItem('altake');
				}
				gamePlay.initDealHandCards(context, data);
				if (context.action123 != 'deal') {
					context.shouOperationMune();
				}
			} else {
				context.shouOperationMune();
				var inx = 0;
				if (player.tablepos == "top") {
					//context.right_panel ;
					inx = 1;
				} else if (player.tablepos == "left") {
					inx = 2;
				}
				gameStartInit.initPlayerHandCards(0, 1, inx, context, true, peoNum);
			}
			gameStartInitNode.desk_cards.string = data.deskcards;
			if (data.power) {
				if (data.powerCard && data.powerCard.length > 0) {
					for (var _i = 0; _i < cc.find('Canvas/cards/tesucards/baocard/child').children.length; _i++) {
						cc.find('Canvas/cards/tesucards/baocard/child').children[_i].destroy();
					}
					cc.weijifen.baopai = data.powerCard;
					for (var _i2 = 0; _i2 < data.powerCard.length; _i2++) {
						var laiziZM = cc.instantiate(gameStartInitNode.ZM);
						laiziZM.parent = gameStartInitNode.godcard.children[1];
						var LZH = laiziZM.getComponent('DeskCards');
						LZH.init(data.powerCard[_i2], 'B', true);
						// cc.weijifen.baopai = data.powerCard[i];
					}
				} else {
					var laiziFM = cc.instantiate(gameStartInitNode.FM);
					var LZH = laiziFM.getComponent('DeskCards');
					//LZH.init(-4);
					laiziFM.parent = gameStartInitNode.godcard.children[1];
				}
			}
		},
		select_action_searchlight: function select_action_searchlight(data, context, player) {
			context = cc.find('Canvas').getComponent('MJDataBind');
			context.exchange_searchlight(player.tablepos, context);
			context.exchange_state("nextplayer", context);
		},
		initDealHandCards: function initDealHandCards(context, data) {
			var gameStartInit = require('GameStartInit');
			context = cc.find('Canvas').getComponent('MJDataBind');
			gameStartInit.initcardwidth();
			if (true) {
				var temp = context.cardpool.get();
				var temp_script = temp.getComponent("HandCards");
				context.playercards.push(temp);
				temp_script.init(data.card);
				temp_script.lastone();
				temp.zIndex = 2000; //直接放到最后了，出牌后，恢复 zIndex
				temp.parent = context.cards_panel; //庄家的最后一张牌
			}
		},
		qujuju: function qujuju(data) {
			var gameStartInit = require('GameStartInit');
			var player = gameStartInit.player(data.userid, this);
			var opParent = void 0;
			if (player.tablepos == 'current') {
				opParent = cc.find("Canvas/cards/handcards/current/kongcards");
			} else {
				opParent = cc.find("Canvas/cards/handcards/" + player.tablepos + "/kongcards");
			}
			if (opParent.children.length > 1) {
				try {
					opParent.children[opParent.children.length - 1].children[1].getComponent('DanAction').jujufei();
				} catch (e) {
					console.log('ohuo');
				}
			}
		}
		//出牌


		//摸牌
	} });

cc._RF.pop();