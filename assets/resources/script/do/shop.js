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
        // cc.weijifen.authorization = "efa908002cdd499688aa205812259365";
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
        var shopPay = cc.find('Canvas/setting/content').children;
        for (let j = 0;j < shopPay.length-1;j++) {
            j == 0 ? shopPay[1].x = shopPay[0].x - 10
                   : shopPay[j+1].x = shopPay[j].x + shopPay[j].width + 50; 
           /* if (j == 0) {
                shopPay[1].x = shopPay[0].x - 10;
            } else if (j < 6) {
                shopPay[j+1].x = shopPay[j].x + shopPay[j].width + 50;
            }*/
        }
        content.children[0].active = false;
    },
    shopError: function(object){
        
    },
    shopOneClick(event){
        console.log(event)
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
    },
    /*
    * 阻止弹出层穿透
    */
    stopThrough: function (event) {
        event.bubbles = false
    },


});
