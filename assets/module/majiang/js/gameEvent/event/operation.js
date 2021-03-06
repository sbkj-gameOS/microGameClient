cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        action : {default:null}
    },

    // use this for initialization
    onLoad: function () {
    },
    setAction:function(a){
        this.action = a ;
    },
    click: function(event){
            // event.target.y = event.target.y+20;
            // event.target.scaleX=1.2;
            // event.target.scaleY=1.2;
            var myAction = event.target.getComponent('operation').action ;
            if(cc.sys.localStorage.getItem('altake')!=true){
                cc.sys.localStorage.setItem('take','true');                             
            }
            var oper = new cc.Event.EventCustom('mjSelection', true) ;
            oper.setUserData(myAction) ;
            this.node.dispatchEvent( oper );
    },
    quxiao: function(event){
        let father = cc.find('Canvas').getComponent('MJDataBind').selectfather;
        father.active= false;
        father.children[0].children[1].children.splice(0,father.children[0].children[1].children.length);
        cc.sys.localStorage.setItem('take','true'); 
        this.node.dispatchEvent( new cc.Event.EventCustom('guo', true) );
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
