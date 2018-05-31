let WJFCommon = require("WJFCommon");
// 创建房间之后进入
cc.Class({
    extends: WJFCommon,
    properties: {
         //ljh追加 房号 
        room_num:{
            default:null,
            type: cc.Node
        },

    },
    onLoad: function () {
        // 建立scoket连接
     

    },
    statics: {
        /**
         * 新创建牌局，首个玩家加入，进入等待状态，等待其他玩家加入，服务端会推送 players数据
         * @param data
         * @param context
         */
        joinroom_event:function(data , context){
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            var fangweiNode = cc.find('Canvas/bg/center') ;
            //如果是2人的模式  就只加自己和对家
            context = cc.find('Canvas').getComponent('MJDataBind') ;
            if(data.msg){
            	cc.find("Canvas/userIp").active = true;
            	cc.find("Canvas/userIp/label").getComponent(cc.Label).string = data.msg;
            	setTimeout(function(){cc.find("Canvas/userIp").active = false;},3000)
            }
            if(cc.weijifen.playerNum == 2){
                if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('top')){

                    var player = context.playerspool.get();
                    var playerscript = player.getComponent("MaJiangPlayer");
                    var inx = null , tablepos = "";
                    if(data.id == cc.weijifen.user.id){
                        player.setPosition(-596 , -269);
                        player.parent = context.root();
                        tablepos = "current" ;
                        cc.sys.localStorage.setItem('current',data.id);
                        cc.sys.localStorage.setItem('count','0');

                    }else{
                        player.parent= context.top_player;
                        tablepos = "top" ;
                        cc.sys.localStorage.setItem('top',data.id);
                        player.setPosition(0,0);
                        cc.sys.localStorage.setItem('count','2')
                        
                    }
                    playerscript.init(data , inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                    context.playersarray.push(player) ;
                    if(data.status == 'READY'){    
                        cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                        if(data.id == cc.weijifen.user.id){
                            context.readybth.active = false ;
                            context.ready2.active = false ;
                        }  
                    }
                    
                }else{
                    var playerarray = context.playersarray;
                    if(playerarray){
                        for(let i =0 ; i< playerarray.length;i++){
                            var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                            var tablepos = playerinfo.tablepos;      
                            var on_off_line = playerinfo.on_off_line;     
                            var headimg = playerinfo.headimg;
                            if(data.id == playerinfo.data.id) {
                                if(data.status == 'READY'){    
                                    cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                                }
                                if(data.online == false){
                                    on_off_line.active = true;
                                    // headimg.color = new cc.Color(42, 25, 25);
                                }else{
                                    on_off_line.active = false;
                                    // headimg.color = new cc.Color(255, 255, 255);
                                }
                                if(gameStartInitNode.desk_cards.string!='136'){
                                    context.readyNoActive(context);
                                }
                            }
                        }
                    }
                }
                //如果人满了 要求好友的按钮自动消失
                // if(context.playersarray.length == 2){
                //     context.ready2.active = false;
                //     context.readybth.x = -13;
                // }

            }else if(cc.weijifen.playerNum == 3){
                if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('top')){
                    var player = context.playerspool.get();
                    var playerscript = player.getComponent("MaJiangPlayer");
                    tablepos = "";
                    var inx = cc.sys.localStorage.getItem('count');
                    if(data.id == cc.weijifen.user.id){
                        player.setPosition(-596 , -269);
                        player.parent = context.root();
                        tablepos = "current" ;
                        cc.sys.localStorage.setItem('current',data.id);
                        
                    }else{
                        if(inx == 0||inx ==2){
                            player.parent= context.right_player;
                            tablepos = "right" ;
                            cc.sys.localStorage.setItem('right',data.id);
                            cc.sys.localStorage.setItem('count','1');
                        }else if(inx == 1){
                            player.parent= context.top_player;
                            tablepos = "top" ;
                            cc.sys.localStorage.setItem('top',data.id);
                            cc.sys.localStorage.setItem('count','2');   
                        }
                        player.setPosition(0,0);
                    }
                    playerscript.init(data , context.inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                    context.playersarray.push(player) ;
                    //这里是用来判定自己重连的时候 如果已经准备了 则准备按钮消失
                    if(data.status == 'READY'){    
                        cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                        if(data.id == cc.weijifen.user.id){
                            context.readybth.active = false ;
                            context.ready2.active = false ;
                        }  
                    }
                }else{
                    var playerarray = context.playersarray;
                    if(playerarray){
                        for(let i =0 ; i< playerarray.length;i++){
                            var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                            var tablepos = playerinfo.tablepos;      
                            var on_off_line = playerinfo.on_off_line;     
                            var headimg = playerinfo.headimg;
                            if(data.id == playerinfo.data.id) {
                                if(data.status == 'READY'){    
                                    cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                                    if(data.id == cc.weijifen.user.id){
                                        context.readybth.active = false ;
                                        context.ready2.active = false ;
                                    }  
                                }
                                if(data.online == false){
                                    on_off_line.active = true;
                                    // headimg.color = new cc.Color(42, 25, 25);
                                }else{
                                    on_off_line.active = false;
                                    // headimg.color = new cc.Color(255, 255, 255);
                                }
                                //如果已经过了发牌阶段  则隐藏所有的准备状态
                                if(gameStartInitNode.desk_cards.string !='136'){
                                    context.readyNoActive(context);
                                }
                            }    
                        }
                    }
                }
            }else{
                // 这是默认的4人模式 
                // 因为 加入会触发 改变状态也会触发该事件，所以用getitem保存一个数据 如果有了这个数据则 只判断状态的改变  如果没有则表示新玩家加入
                if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('left')&&data.id!=cc.sys.localStorage.getItem('top')){
                    var player = context.playerspool.get();
                    var playerscript = player.getComponent("MaJiangPlayer");
                    tablepos = "";
                    var inx = cc.sys.localStorage.getItem('count');
                    if(data.id == cc.weijifen.user.id){
                        // player.setPosition(-584 , -269);
                        player.setPosition(-596 , -269);
                        player.parent = context.root();
                        tablepos = "current" ;
                        cc.sys.localStorage.setItem('current',data.id);
                        
                    }else{
                        if(inx == 0||inx ==3){
                            player.parent= context.right_player;
                            tablepos = "right" ;
                            cc.sys.localStorage.setItem('right',data.id);
                            cc.sys.localStorage.setItem('count','1')
                        }else if(inx == 1){
                            player.parent= context.top_player;
                            tablepos = "top" ;
                            cc.sys.localStorage.setItem('top',data.id);
                            cc.sys.localStorage.setItem('count','2')   
                        }else if(inx == 2){
                            player.parent= context.left_player;
                            tablepos = "left" ;
                            cc.sys.localStorage.setItem('left',data.id);
                            cc.sys.localStorage.setItem('count','3')
                        }
                        player.setPosition(0,0);
                    }
                    playerscript.init(data , context.inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                    context.playersarray.push(player) ;
                    //这里是用来判定自己重连的时候 如果已经准备了 则准备按钮消失
                    if(data.status == 'READY'){    
                        cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                        if(data.id == cc.weijifen.user.id){
                            context.readybth.active = false ;
                            context.ready2.active = false ;
                        }  
                    }
                }else{
                    var playerarray = context.playersarray;
                    if(playerarray){
                        for(let i =0 ; i< playerarray.length;i++){
                            var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                            var tablepos = playerinfo.tablepos;      
                            var on_off_line = playerinfo.on_off_line;     
                            var headimg = playerinfo.headimg;
                            if(data.id == playerinfo.data.id) {
                                if(data.status == 'READY'){    
                                    cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                                    if(data.id == cc.weijifen.user.id){
                                        context.readybth.active = false ;
                                        //context.ready2.active = false ;
                                    }  
                                }
                                if(data.online == false){
                                    on_off_line.active = true;
                                    // headimg.color = new cc.Color(42, 25, 25);
                                }else{
                                    on_off_line.active = false;
                                    // headimg.color = new cc.Color(255, 255, 255);
                                }
                                //如果已经过了发牌阶段  则隐藏所有的准备状态
                                if(gameStartInitNode.desk_cards.string !='136'){
                                    context.readyNoActive(context);
                                }
                            }    
                        }
                    }
                }
                // if(context.playersarray.length == 4){
                //     context.ready2.active = false;
                //     var action = cc.moveTo(0.2,-21,-151);
                //     context.readybth.runAction(action);
                }   
        },
    },
    
    onClick: function (event) {
        //开始匹配
        //cc.sys.localStorage.setItem('already','true');
        let mjdata = cc.find('Canvas').getComponent('MJDataBind');
        // var action = cc.moveTo(0.5,880,274);
        // mjdata.setting_coin.runAction(action);
        // var count = event.target.getComponent('Ready').count;

        let socket = this.socket();
        var param = {
            token:cc.weijifen.authorization,
            playway:cc.weijifen.playway,
            orgi:cc.weijifen.user.orgi
        } ;
        if ( cc.weijifen.room ) {
            param.room = cc.weijifen.room ;
        }
        // let majiang = this.target.getComponent("MJDataBind");
        this.waittingForPlayers();
        // if(count == 0){
        //     event.target.getComponent('Ready').count=count+1;
        //     socket.emit("joinroom" ,JSON.stringify(param)) ;
        // }else{
            this.node.dispatchEvent(new cc.Event.EventCustom('readyGM', true));       
        // }
    },
    waittingForPlayers:function(){
        let context = cc.find('Canvas').getComponent('MJDataBind');
        context.exchange_state("ready" , context);
    },
    /*分享好友*/
    showActive: function () {
        // let mj = cc.find('Canvas').getComponent('MJDataBind').noticeShare.active = true;
        // 
        var jsonData = {
            url:"http://game.bizpartner.cn/wxController/toCHAuthAgainWx?roomNum="+cc.weijifen.room,
            title:"心缘竞技",
            context:"房间号："+cc.weijifen.room+"  好友邀请您进入房间"
        }
        var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareEvent",JSON.stringify(jsonData));
        return;
    },
    unactive: function(event){
        event.target.active = false;
    },
});



