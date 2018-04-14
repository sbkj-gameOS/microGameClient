var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        gameSettingClick: cc.Prefab,
        shopPage: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        
    },
    close: function(){
        let menu = cc.find("Canvas/menu") ;
        cc.weijifen.menu.put(menu);
    },
    open: function(event){
        if (event.target.name == 14) {
            let setting = cc.instantiate(this.gameSettingClick);
            setting.parent = cc.find('Canvas');
            return 
        }
        if (event.target.name == 5) {
            let setting = cc.instantiate(this.shopPage);
            setting.parent = cc.find('Canvas');
            return 
        }

        if (event.target.name == 9) {
            this.alert("敬请期待~");
            return 
        }
        this.hall(event.target.name);
    },
});
