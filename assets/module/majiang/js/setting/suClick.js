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
        time: cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },
    onBGClick:function(event){
        //var myAction = event.target.getComponent('SummartClick').action ;
       // oper.setUserData(myAction) ;
       if(cc.beimi.match == 'true'){
        this.node.dispatchEvent(new cc.Event.EventCustom('readyGM', true));
        
       }
        this.node.dispatchEvent(new cc.Event.EventCustom('restar', true));
  
    },
    endclick: function(event){
        var a = {};
        a.key = true;
        var oper = new cc.Event.EventCustom('restar', true) ;
        oper.setUserData(a) ;
        this.node.dispatchEvent( oper );
            }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
