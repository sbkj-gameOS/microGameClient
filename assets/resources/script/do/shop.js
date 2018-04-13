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
        cc.weijifen.authorization = "e8f180d756fc4a969ebe95ae0c209d14";
        cc.weijifen.http.httpGet('/shop/findShopList?token='+cc.weijifen.authorization,this.shopSuccess,this.shopError,this);
    },
    shopSuccess: function(result,object){
        var data = JSON.parse(result);
        var content = cc.find("Canvas/setting/content");
        for(let i= 0; i<data.shopList.length;i++){
            var shopOne = cc.instantiate(object.shopOne);
            var idvalue = shopOne.getChildByName("idvalue").getComponent(cc.Label);
            var roomNum = shopOne.getChildByName("roomNum").getComponent(cc.RichText);
            var price = shopOne.getChildByName("shop_btn").getChildByName("price").getComponent(cc.RichText);
            idvalue.string = data.shopList[i].id;
            roomNum.string = "<b>"+data.shopList[i].name+data.shopList[i].count+"张</b>";
            price.string = "<b>"+data.shopList[i].price+"元</b>";
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
        var idvalue = event.target.getChildByName("idvalue").getComponent(cc.Label).string;
        //模拟调用支付接口,调用后台数据{token:token,shopId:id}
        cc.weijifen.pay(idvalue);
    },
    
    /*
    * 阻止弹出层穿透
    */
    stopThrough: function (event) {
        event.bubbles = false
    },


});
