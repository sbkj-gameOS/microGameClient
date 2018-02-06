cc.Class({
    extends: cc.Component,

    properties: {
        right_ready: cc.Node,
        left_ready: cc.Node,
        top_ready:cc.Node,
        current_ready:cc.Node,
    },

    //
    onLoad: function () {

    },

    /**
     * 获取所有玩家信息
     *
     * 方位
     *
     * 庄家
     *
     * 色子点数
     *
     * 宝牌/财神
     */
    
    players_event:function(data,context){
        
        context = cc.find("Canvas").getComponent("MJDataBind") ;
        //cc.sys.localStorage.setItem(players,data.players.length);
        cc.sys.localStorage.setItem(players,data.players.length);
        if(cc.weijifen.state =='init' ||cc.weijifen.state == 'ready'){
            context.collect(context) ;    //先回收资源，然后再初始化
            context.killPlayers(data);
            
        }

        //OK手势隐藏
        context.allReadyFalse();        
        

        var inx = 0 ;
        context.arry = [];
        var players = context.playersarray; 
        // player 是 配合 joinroom  joinroom 加入房间  立即显示  然后 player 记录数据   下一个玩家 根据 player 来完成之前的渲染 用joinroom 完成之后的   一旦完成joinroom  又发起player 进行存储
        for(let i=0 ;i<data.players.length;i++){
            if(data.players[i]!=null){
                var time = data.players[i].createtime;
                context.arry.push(time);
                if(data.players[i].id == cc.weijifen.user.id ){
                    var mytime = context.arry.length;
                }
            }
        }
        if(cc.weijifen.playerNum==2){
            if(mytime==1){
                context.dong(0);
                context.publicData(0,data,'current',context.current_player,0,0,context);
                if(data.players.length==2){          
                    context.publicData(1,data,'top',context.top_player,1,2,context);
                }
            }else{
                context.dong(2);
                context.publicData(0,data,'top',context.top_player,1,2,context);
                context.publicData(1,data,'current',context.current_player,0,0,context);
            }       
        }else if(cc.weijifen.playerNum==3){
            if(mytime==1){
                context.dong(0);                
                context.publicData(0,data,'current',context.current_player,0,0,context);
                if(data.players.length==2){          
                    context.publicData(1,data,'right',context.right_player,0,1,context);        
                }else if(data.players.length==3){
                    context.publicData(1,data,'right',context.right_player,0,1,context);        
                    context.publicData(2,data,'top',context.top_player,1,2,context);
                }
            }else if(mytime==2){
                context.dong(1);                
                context.publicData(0,data,'top',context.top_player,1,2,context);
                context.publicData(1,data,'current',context.current_player,0,0,context);
                if(data.players.length==3){
                    context.publicData(2,data,'right',context.right_player,0,1,context);        
                }
            }else if(mytime==3){
                context.dong(2);                
                context.publicData(0,data,'right',context.right_player,0,1,context);
                context.publicData(1,data,'top',context.top_player,1,2,context);
                context.publicData(2,data,'current',context.current_player,0,0,context);
            }
        }else{
            if(mytime==1){
                context.dong(0);                
                context.publicData(0,data,'current',context.current_player,0,0,context);
                if(data.players.length==2){          
                    context.publicData(1,data,'right',context.right_player,0,1,context);         
                }else if(data.players.length ==3){
                    context.publicData(1,data,'right',context.right_player,0,1,context);
                    context.publicData(2,data,'top',context.top_player,1,2,context);                         
                }else if(data.players.length ==4){
                    context.publicData(1,data,'right',context.right_player,0,1,context);    
                    context.publicData(2,data,'top',context.top_player,1,2,context);                
                    context.publicData(3,data,'left',context.left_player,2,3,context);                                      
                }
            }else if(mytime == 2){
                context.dong(3);                
                context.publicData(0,data,'left',context.left_player,2,3,context);
                context.publicData(1,data,'current',context.current_player,0,0,context);         
                if(data.players.length ==3){
                    context.publicData(2,data,'right',context.right_player,0,1,context);
                }else if(data.players.length ==4){
                    context.publicData(2,data,'right',context.right_player,0,1,context);          
                    context.publicData(3,data,'top',context.top_player,1,2,context);         
                }
            }else if(mytime ==3){
                context.dong(2);                
                context.publicData(0,data,'top',context.top_player,1,2,context);  
                context.publicData(1,data,'left',context.left_player,2,3,context);
                context.publicData(2,data,'current',context.current_player,0,0,context);                     
                if(data.players.length ==4){
                    context.publicData(3,data,'right',context.right_player,0,1,context);       
                }
            }else if(mytime == 4){
                context.dong(1);                
                context.publicData(0,data,'right',context.right_player,0,1,context);
                context.publicData(1,data,'top',context.top_player,1,2,context);
                context.publicData(2,data,'left',context.left_player,2,3,context);               
                context.publicData(3,data,'current',context.current_player,0,0,context);
            }
        }     
        var peo = context.playersarray;
        if(cc.weijifen.state =='ready' || cc.weijifen.state =='init'){
            //context.windFW(context);
            for(let i = 0 ; i< data.players.length;i++){
                
                for(let j=0; j<peo.length; j++){
                    var py = peo[j].getComponent('MaJiangPlayer');
                    if(data.players[i].id == py.data.id){
                        if(data.players[i].status&&data.players[i].status=='READY'){
                            context.readyTrue(py.tablepos,context);                   
                        }
                    }
                }
            }
        }
        if(cc.weijifen.state !='ready' && cc.weijifen.state !='init'){
            if(cc.weijifen.playType != "LG"){
                context.windFW(context);
            }
        }
    },

     /**
     * 接受新的庄家数据
     * @param data
     * @param context
     */
    banker_event:function(data, context){
        context = cc.find('Canvas').getComponent('MJDataBind');
        for(var inx = 0 ; inx<context.playersarray.length ; inx++){
            let temp = context.playersarray[inx].getComponent("MaJiangPlayer") ;
            if(data.userid == cc.weijifen.user.id){
                cc.weijifen.bankers =true;
            }else{
                cc.weijifen.bankers =false;
            }
            if(temp.data.id == data.userid){
                cc.weijifen.banker = data.userid;
                temp.banker(); 
                break ;
            }
        }
    },


    allReadyFalse: function(){
        this.left_ready.active = false;
        this.right_ready.active = false;
        this.top_ready.active = false;
        this.current_ready.active = false;        
    },

    /**
     * 回收系统资源，用于清理资源
     * @param context
     */
    collect:function(context){
        for(var i=0 ; i<context.playersarray.length ; ){
            let player = context.playersarray[i] ;
            var playerscript = player.getComponent("MaJiangPlayer");
            if(playerscript.data.id != cc.beimi.user.id){       //当前 玩家不回收，最终 Destroy 的时候会被回收
                context.playerspool.put(player);
                context.playersarray.splice(i,1) ;
            }else{
                i++ ;
            }
        }
    },

});
