/*
* @房间创建（南京麻将）
*/
var creat = require("createRoom");//导入components目录下的createRoom
// var moShi,playerData,userType,garams;
var fufei,playerData,moShi,quanshu,userType,garams;
cc.Class({
    extends: creat,
    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        fufei = "AAPay";
        playerData = 'jyz';
        moShi = 'bs';
        quanshu = '1';
        userType = '4';
        garams = {};
    },
    /*选择付费方式*/
    clickfufei: function (event) {
        if( fufei != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(fufei).children[2].setColor(cc.color(129,74,17,255));
        }

        //3.更新moshi的值
        fufei = this.mosiOrpepleClick(event);
    },
       // 选择玩法
    clickPlayway:function(event){
        if( playerData != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(playerData).children[2].setColor(cc.color(129,74,17,255));
        }

        //3.更新moshi的值
        playerData = this.mosiOrpepleClick(event);
    },
    // 选择模式
    clickmoshi:function(event){
        if( moShi != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(moShi).children[2].setColor(cc.color(129,74,17,255));
        }

        //3.更新moshi的值
        moShi = this.mosiOrpepleClick(event);
        
    },
    /*选择圈数*/
    clickquanshu:function(event){
        if(quanshu != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
             event.node._parent.getChildByName(quanshu).children[2].setColor(cc.color(129,74,17,255));
        
        }
       
        quanshu = this.mosiOrpepleClick(event);
    },
    // 选择玩家人数
    clickPepNum:function(event){
        if(userType != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
             event.node._parent.getChildByName(userType).children[2].setColor(cc.color(129,74,17,255));
        
        }
       
        userType = this.mosiOrpepleClick(event);
    },
 
    // 点击创建按钮
    createClick:function(){
        /*playerData = playerData.split("@@");
        playerData.pop();
        garams.waytype = playerData;
        garams.game = 'CH';
        garams.pepNums = userType;
        garams.modeltype = moShi;*/


        garams.game = 'NJ';
        cc.weijifen.playType='NJ';
         //支付方式
        garams.pay = fufei;
        // 玩法
        garams.player = playerData;
        // 模式
        garams.modeltype = quanshu;
        // 圈数
        // garams.count = ;
        // 人数
        garams.pepNums = userType;
        console.log('garams',garams)
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        // 此处的onClick是createRoom中的方法
        this.onClick(garams);
    }
});
