var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        
    },
    close: function(){
        let menu = cc.find("Canvas/menu") ;
        cc.weijifen.menu.put(menu);
    },
    open: function(event){
        this.hall(event.target.name);
    },
});
