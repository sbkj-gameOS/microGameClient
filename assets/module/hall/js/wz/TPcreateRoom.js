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
        TPQiHu ='unlimitedHu';//起胡
        TPPayType ='householderPay';//支付方式
        garams={};
    },
    clickmoshi:function(event){
        if( moShi != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(moShi).children[2].setColor(cc.color(129,74,17,255));
        }

        moShi = this.mosiOrpepleClick(event);
    },
    clickPepNum:function(event){
        if( userType != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(userType).children[2].setColor(cc.color(129,74,17,255));
        }

        userType = this.mosiOrpepleClick(event);
    },
    //获得大小炮
    clickTPPlayer:function(event){
        if( TPPlayer != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(TPPlayer).children[2].setColor(cc.color(129,74,17,255));
        }
        TPPlayer = this.mosiOrpepleClick(event);
        if(TPPlayer == 'smallGun'){
            this.bigClicks(false,'10');
        }else{
            this.bigClicks(true,'15');
        }   
    },
    clickTPQiHu:function(event){

        if( TPQiHu != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(TPQiHu).children[2].setColor(cc.color(129,74,17,255));
        }
        TPQiHu = this.mosiOrpepleClick(event);
    },
    clickTPPayType:function(event){
        if( TPPayType != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(TPPayType).children[2].setColor(cc.color(129,74,17,255));
        }
        TPPayType = this.mosiOrpepleClick(event);
    },
    clickTPTaiFan:function(event){
        if( TPTaiFan != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            // TPPlayer = TPPlayer.toString();
            //2.上一个选中的字体恢复为默认色
          
            event.node._parent.getChildByName(TPTaiFan).children[2].setColor(cc.color(129,74,17,255));
        }
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
