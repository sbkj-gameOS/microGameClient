var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        content:{
            default:null ,
            type : cc.Node
        },
        shopOne:{
            default:null ,
            type : cc.Node
        },
    },

    onLoad: function () {
        // cc.weijifen.authorization = "efa908002cdd499688aa205812259365";   测试token
        cc.weijifen.http.httpGet('/shop/findShopList?token='+cc.weijifen.authorization,this.shopSuccess,this.shopError,this);
    },
    shopSuccess: function(result,object){
        var data = JSON.parse(result);
        var content = cc.find("Canvas/setting/content");
        for(let i= 0; i<data.shopList.length;i++){
            var shopOne = cc.instantiate(object.shopOne);
            var idvalue = shopOne.getChildByName("idvalue").getComponent(cc.Label);
            var roomNum = shopOne.getChildByName("roomNum").getComponent(cc.Label);
            var price = shopOne.getChildByName("shop_btn").getChildByName("price").getComponent(cc.Label);
            idvalue.string = data.shopList[i].id;
            roomNum.string = data.shopList[i].name+data.shopList[i].count+"张";
            price.string = data.shopList[i].price+"元";
            shopOne.parent = content;
        }
        var shopBox = cc.find('Canvas/setting/content');
        var shopPay = cc.find('Canvas/setting/content').children;
        shopPay[1].x = shopPay[0].x - 10;
        shopPay[2].x = shopPay[1].x + 208 + 50;
        shopPay[3].x = shopPay[2].x + 208 + 50;
        shopPay[4].x = shopPay[3].x + 208 + 50;
        content.children[0].active = false;
    },
    shopError: function(object){
        
    },
    shopOneClick:function(event){
        var idvalue = event.target.getChildByName("idvalue").getComponent(cc.Label).string;
        //模拟调用支付接口,调用后台数据{token:token,shopId:id}
        var self = this ;
        cc.weijifen.http.httpGet("/ipay/sign?token="+cc.weijifen.authorization+"&shopId="+idvalue, self.signSucess , self.error , self);
    },
    signSucess:function(result , object){
        //object.alert(result);
        //document.location = 'matchList://${data}';
        var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "iPayHandler",result);
        //document.location = 'matchList://{"code": "${data}"}';
    },
    error:function(result , object) {
    }

});
