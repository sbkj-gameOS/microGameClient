cc.Class({
    extends: cc.Component,
    properties: {
        title:cc.Node,
        joinRoom: cc.Prefab,
        createRoom: cc.Prefab,
        setting:cc.Prefab,
    },
    onLoad: function () {
    },
    init:function(name){
        this.clearPerfab();
        let web = this.title.parent.children[2];
        for(let i in this.title.children){
            this.title.children[i].active = false;
        }
        this.title.children[name].active = true;
        if(name == 10 || name == 11 || name ==14){
            let gameroom;
            web.active = false;
            if(name ==10){
                gameroom = cc.instantiate(this.joinRoom);
            }else if(name == 11){
                gameroom = cc.instantiate(this.createRoom);
            }else if(name == 14){
                gameroom = cc.instantiate(this.setting);
            }
            //根据状态将获取到的PreFab挂载到弹框上(即：此节点上)
            gameroom.parent = this.node
        }else{
            web.active = true;
        }
    },
    //清除留下的东西---即摧毁节点
    clearPerfab: function(){
        if(cc.find('Canvas/menu/joinroom')){
            cc.find('Canvas/menu/joinroom').destroy();
        }
        if(cc.find('Canvas/menu/createroom')){
            cc.find('Canvas/menu/createroom').destroy();
        }
        if(cc.find('Canvas/menu/setting')){
            cc.find('Canvas/menu/setting').destroy();
        }
    }
});
