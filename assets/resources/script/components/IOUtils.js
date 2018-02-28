cc.Class({
    extends: cc.Component,
    properties: {
    },
    statics:{
        get:function(key){
            return cc.sys.localStorage.getItem(key) ;
        },
        put:function(key , value){
            cc.sys.localStorage.setItem(key, value) ;
        },
        remove:function(key){
            cc.sys.localStorage.removeItem(key) ;
        }
    }
});
