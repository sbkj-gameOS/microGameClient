var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {
        headimg:cc.Node,
        count:cc.Label,
        pname:cc.Label,
        txt:cc.Node,
        banker:cc.Node,
        ting:cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function(data,tablepos){
        this.result = data;
        this.tablepos = tablepos;
        //名字
        this.pname.string = data.username;
        //分数
        this.count.string = data.goldcoins;
        //头像
        this.headImg(this.headimg,data.headimgurl,false);
        this.fangwei(tablepos);
        this.onOroff(data.online);
    },
    fangwei:function(fangwei){
        if(fangwei == 'current'){
            this.txt.x = -71;
            this.txt.y = -128;
            this.pname.node.active = false;
        }
    },
    //ting和banker
    SomeActive:function(some){
        this[some].active = true;
    },
    onOroff: function(online){
        if(!online){
            this.headimg.color = new cc.Color(42, 25, 25);
        }else{
            this.headimg.color = new cc.Color(255, 255, 255);
        }
    }
});
