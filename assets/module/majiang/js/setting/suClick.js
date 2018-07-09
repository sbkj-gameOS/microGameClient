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
        time: cc.Label,
        // 显示截图的精灵
        show: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },
    onBGClick:function(event){
        //var myAction = event.target.getComponent('SummartClick').action ;
       // oper.setUserData(myAction) ;
       // console.log('已经点击返回大厅按钮')
        if (cc.find('Canvas/big_cards').children) {
            cc.find('Canvas/big_cards').removeAllChildren();
        }
       if(cc.weijifen.match == 'true'){
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
    },
    //分享结算图片image
    shareImage:function(event){
        // 创建 renderTexture
        var renderTexture = cc.RenderTexture.create(1280, 720);
        //实际截屏的代码
        renderTexture.begin();
        //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
        var canvas= cc.find("Canvas").getComponent(cc.Canvas);
        canvas.node._sgNode.visit();
        renderTexture.end();

        // 获取SpriteFrame
        var nowFrame = renderTexture.getSprite().getSpriteFrame();

        // 赋值给需要截图的精灵
        this.show.spriteFrame = nowFrame;

        // 翻转得到的纹理
        var action = cc.flipY(true);
        this.show.node.runAction(action);
        // 保存截图到本地
        
        renderTexture.saveToFile("demo.png", cc.ImageFormat.PNG, true, function (event) {

        	let windowSize=cc.view.getVisibleSize();  
			cc.log("width="+windowSize.width+",height="+windowSize.height);
        	//打印本地的地址   
	        cc.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii:"+jsb.fileUtils.getWritablePath())
	        var jsonData = {
	            title:"心缘竞技",
	            imgUrl:jsb.fileUtils.getWritablePath()+"demo.png",
	            width:windowSize.width,
	            height:windowSize.height,
	            conType:2,
	            msgType:1
	        }
	        var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareEvent",JSON.stringify(jsonData));
        });
        
        return;
    },
     /*关闭中奖提示*/
    closePrizeBox: function () {
        cc.find('Canvas/prizeBox').destroy();
        cc.sys.localStorage.removeItem('matchPrize');
    },
     /**
     * 点击领取奖品
     */
    getPrize: function (event,data) {
        var wjf = require('WJFCommon');
        var w = new wjf();
        w.hall(data);
    }
});
