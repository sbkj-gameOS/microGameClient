var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
       
    },
    command: function () {
    	 //this.doSomethingBH({action:'buhua'},this);
        /* 每次操作之后。向后端发送command事件，返回对应的command值，然后去匹配上面的值，并执行对应的事件
            即后端返回的command为’joinroom‘，则执行指令为’joinroom‘的事件---this.joinroom_event
        */
        socket.on("command" , function(result){
            var data = self.getSelf().parse(result);
            self.getSelf().route(data.command)(data , self);
        });
    },
  	/**
     * 接受传送的 玩家列表（含AI）
     */
    players: function () {
    	socket.on("players" , function(result){
            var data = self.getSelf().parse(result) ;
        //     console.log('players');
        //     console.log(data);
        //     /**
        //      * 处理 Players
        //      */
            self.getSelf().route("players")(data, self);
        });
    },
    talkOnSay: function () {
        socket.on("talkOnSay" , function(result){
            self.talk_event(result,null) ;
        });
    },
    /*
    * 断开连接，发送事件
    */
    disconnect: function () {
        cc.weijifen.socket.on("disconnect" , function(){
            let mjs = cc.find('Canvas');   
            if(mjs){
                var mj = mjs.getComponent('MajiangDataBind');
                mj.duankai2.active = true;
                mj.duankai.active = false;                
                if(cc.sys.localStorage.getItem('dis')!='true'){                  
                    cc.director.loadScene('majiang');
                }
            }         
        });
    },

});
