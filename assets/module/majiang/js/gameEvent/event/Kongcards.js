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
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function(action){
        this.action = action;
        this.length = this.node.children.length;
        this.type = null;
        for(let i = 0 ; i< this.length;i++){
            var card = this.node.children[i].getComponent('DanAction');
            
            if(card.cardcolors>=-7&&card.cardcolors<=-4){
                this.type = 'wind';
                break;
            }else if(card.cardcolors<=-1 &&card.cardcolors>=-3){
                this.type = 'xi';
                break;
            }else if(parseInt((card.value%36)/4) == 8){
                this.type= 'jiu';
                break;
            }else if((card.cardtype==0||card.cardtype==1)&&parseInt((card.value%36)/4) == 0){
                this.type ='yao'
                break;
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
