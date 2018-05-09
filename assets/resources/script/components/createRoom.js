/*
* @创建房间公共方法
*/
var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {
        
    },
    onLoad: function () {

    },
    mosiOrpepleClick(event){
        let moshi = event.target.name;
        return moshi;
    },
    gameTypeClick(toggle,playerData){
        if(toggle.isChecked){
			playerData += toggle.node.name+"@@";
		}else{
			playerData = playerData.replace(toggle.node.name+"@@","");
        }
        return playerData;
    },
    // 创建房间按钮点击
    onClick: function(garams){
        console.log('garams',garams)
        this.loadding();
        cc.weijifen.http.httpPost('/api/room/create',garams,this.sucess,this.error,this);
    },
    sucess: function(result,object){
        var data = JSON.parse(result);
        object.closeloadding();
        if(data.room&&data.playway){
            object.getGame(data);
            cc.director.loadScene("majiang");// 成功之后加载majiang场景
        }else if(data.error){
            object.alert(data.msg);
        }else{
            object.alert('请求失败');
        }  
        object.wrong();
    },
    error:function(object){
        object.wrong();
        object.closeloadding();
        object.alert('连接出错'); 
    },
});
