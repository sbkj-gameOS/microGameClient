/*
* @房间创建（长春麻将）
*/
var creat = require("createRoom");//导入components目录下的createRoom
var moShi,playerData,userType,garams;
cc.Class({
    extends: creat,
    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        // 一下为默认选中的选项
        playerData = "both@@";
        moShi = "2";
        userType = "4";
        garams={};
    },
    // 选择模式
    clickmoshi:function(event){
        if( moShi != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(moShi).children[2].setColor(cc.color(255,255,255,255));
        }

        //3.更新moshi的值
        moShi = this.mosiOrpepleClick(event);
        
    },
    // 选择玩家人数
    clickPepNum:function(event){
        if(userType != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }
            //上一个选中的字体恢复为默认色
             event.node._parent.getChildByName(userType).children[2].setColor(cc.color(255,255,255,255));
        
        }
       
        userType = this.mosiOrpepleClick(event);
    },
    // 选择玩法
    clickPlayway:function(event){
        playerData = this.gameTypeClick(event,playerData);
         //选中改变颜色
         if(event.isChecked==true){    
            event.node.children[2].setColor(cc.color(255,210,90,255));
        }else{
            event.node.children[2].setColor(cc.color(255,255,255,255));
        }
    },
    // 点击创建按钮
    createClick:function(){
        playerData = playerData.split("@@");
        playerData.pop();
        garams.waytype = playerData;
        garams.game = 'CH';
        garams.pepNums = userType;
        garams.modeltype = moShi;
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        // 此处的onClick是createRoom中的方法
        this.onClick(garams);
    }
});
