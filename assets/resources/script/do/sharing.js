cc.Class({
    extends: cc.Component,

    properties: {
        img:{
            default:null,
            type:cc.Node
        },
        headimg:{
            default:null,
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        //设置头像
        // cc.weijifen.user.headimgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKWmyUG3MkgzEibE8S6k4IvcJqUhoeaPOQ3lbw2FQXJ5bTHZOlRIZEBJwOqeJgI4zEQEnMtUV4eseQ/132';
        if(cc.weijifen.user.headimgurl){
            var imgurl = cc.weijifen.user.headimgurl;
            var sprite1 = this.headimg.getComponent(cc.Sprite);
            cc.loader.load({url:imgurl,type:'jpg'},function(err,texture){
                sprite1.spriteFrame = new cc.SpriteFrame(texture);
            })
        }
        //设置二维码
        if(cc.weijifen.authorization){
            // cc.weijifen.authorization = "59797e01957b4dad801415e6aafd6332";
            var imgurl = "http://game.bizpartner.cn/registerPlayer/getEWMImage?gameType="+ cc.weijifen.GameBase.gameModel+"&token="+cc.weijifen.authorization;    
            //var imgurl = "http://192.168.199.203/registerPlayer/getEWMImage?token=bb9f75b4c88b4f3d8b3ab5b0ef505e9a";
                var sprite = this.img.getComponent(cc.Sprite);
                cc.loader.load({url:imgurl,type:'jpg'},function(err,texture){
                    sprite.spriteFrame = new cc.SpriteFrame(texture);               
                })
        }     
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
