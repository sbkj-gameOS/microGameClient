var creat = require("createRoom");
var moShi,playerData,userType,fengdeng,garams;
cc.Class({
    extends: creat,

    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        playerData = "both@@";
        moShi = "2";
        userType = "4";
        fengdeng = '100';
        garams={};
    },
    clickmoshi:function(event){
        moShi = this.mosiOrpepleClick(event);
    },
    clickfanshu:function(event){
        fengdeng = this.mosiOrpepleClick(event);
    },
    clickPlayway:function(event){
        playerData = this.gameTypeClick(event,playerData);
    },
    createClick:function(){
        playerData = playerData.split("@@");
        playerData.pop();
        garams.player = playerData;
        garams.game = 'JX';
        garams.pepNums = userType;
        garams.count = moShi;
        garams.player2 = fengdeng;
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    }
    
    
});