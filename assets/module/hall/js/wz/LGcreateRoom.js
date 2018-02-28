var creat = require("createRoom");
var moShi,playerData,playerData2,userType,garams;
cc.Class({
    extends: creat,

    properties: {
        jushu:cc.Node,
        people:cc.Node,
    },
    // use this for initialization
    onLoad: function () {
        playerData = "classic";
        playerData2="3-6-9-12";
        moShi = "8";
        userType = "4";
        garams={};
    },
    clickmoshi:function(event){
        moShi = this.mosiOrpepleClick(event);
    },
    clickPepNum:function(event){
        userType = this.mosiOrpepleClick(event);
    },
    clickPlayway1:function(event){
        playerData = event.target.name;
        if( playerData == 'yiGu'){
            this.toggleClick(false);
        }else{
            this.toggleClick(true);
        }
        playerData = this.mosiOrpepleClick(event);
    },
    clickPlayway2:function(event){
        playerData2 = this.mosiOrpepleClick(event);
    },
    createClick:function(){
        playerData = playerData.split("@@");
        playerData.pop();
        //游戏模式
        garams.player = playerData;
        garams.player2 = playerData2;
        //人数
        garams.pepNums = userType;
        //局数
        garams.modeltype = moShi;
        garams.game = 'LG';
        cc.weijifen.playType='LG';
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    },
    toggleClick:function(bol){
        for(let i = 1 ;i<3;i++){
            this.people.children[i].active = bol;
        }
        this.jushu.active = bol;   
        userType = 4;
    }
    
});
