var creat = require("createRoom");
var moShi,TPPlayer,userType,TPTwoF,TPQiHu,TPPayType,TPTaiFan,garams;
cc.Class({
    extends: creat,

    properties: {
        shuang:cc.Node,
        taishu:cc.Node,
    },
    // use this for initialization
    onLoad: function () {
        TPPlayer = "bigGun";//大炮小炮
        TPTaiFan ='15';//台番
        moShi = "8";//局数
        userType = "4";//人数
        TPTwoF = false;//是否双翻
        TPQiHu ='unlimited';//起胡
        TPPayType ='householderPay';//支付方式
        garams={};
    },
    clickmoshi:function(event){
        moShi = this.mosiOrpepleClick(event);
    },
    clickPepNum:function(event){
        userType = this.mosiOrpepleClick(event);
    },
    //获得大小炮
    clickTPPlayer:function(event){
        TPPlayer = this.mosiOrpepleClick(event);
        if(TPPlayer == 'smallGun'){
            this.bigClicks(false,'10');
        }else{
            this.bigClicks(true,'15');
        }   
    },
    clickTPQiHu:function(event){
        TPQiHu = this.mosiOrpepleClick(event);
    },
    clickTPPayType:function(event){
        TPPayType = this.mosiOrpepleClick(event);
    },
    clickTPTaiFan:function(event){
        if(TPPlayer == 'smallGun'){
            TPTaiFan = 10;
        }else{
            TPTaiFan = this.mosiOrpepleClick(event);
        }
    },
    dobleClick: function(){
        TPTwoF = !TPTwoF;
    },
    createClick:function(){
        garams.game = 'TP';
        cc.weijifen.playType='TP';
        garams.player = TPPlayer;
         //台番
        garams.taiFan = TPTaiFan;
         //起胡
        garams.QiHu = TPQiHu;
         //人数
        garams.pepNums = userType;
         //支付方式
        garams.pay = TPPayType;
         //局
        garams.count = moShi;
         //双翻
        garams.twoFan = TPTwoF;
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    },
    //切换大小炮的按钮
    bigClicks: function(bool,num){
        this.shuang.active = bool;
        this.shuang.getComponent(cc.Toggle).isChecked =false;
        TPTwoF = false;
        TPTaiFan = num;
        this.taishu.children[1].active = bool;
        this.taishu.children[0].children[2].getComponent(cc.Label).string = num+'台番';
}  
});
