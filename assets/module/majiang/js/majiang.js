cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function(){},
    statics:{
        comeRoom: function(){
            var param = {
                token:cc.weijifen.authorization,
                playway:cc.weijifen.playway,
                orgi:cc.weijifen.user.orgi
            } ;
            if ( cc.weijifen.room ) {
                param.room = cc.weijifen.room ;
            }else{
                param.match = 1 ; 
            }
            return param            
        },
        joinroom: function(data,context){

        },         //加入房价
        players: function(data,context){},         //接受玩家列表
        banker: function(data,context){},          //庄家
        play: function(data,context){},          //人齐了，接收发牌信息
        lasthands: function(data,context){},              //庄家开始打牌了，允许出牌
        takecard: function(data,context){},                //我出的牌
        action: function(data,context){   
            let gang , peng , chi , hu , guo ,dan,ting;
            if(data.chis){
                context.chis = data.chis;
                for(let i =0; i< data.chis.length; i++){
                    context.chis[i].push(data.card);
                }
            }else{
                context.chis =[];
            }
            context.gangs = data["gangs"]?data["gangs"]:[];
            context.dans = data["dans"]?data["dans"]:[];
            context.tings = data["tings"]?data["tings"]:[];
            for(var inx = 0 ; inx < context.actionnode_two_list.children.length ; inx++){
                let temp = context.actionnode_two_list.children[inx] ;
                if(temp.name == "gang"){gang = temp ;}
                if(temp.name == "dan"){dan = temp ;}
                if(temp.name == "peng"){peng = temp ;}
                if(temp.name == "chi"){chi = temp ;}
                if(temp.name == "ting"){ting = temp ;}
                if(temp.name == "hu"){hu = temp ;}
                if(temp.name == "guo"){guo = temp ;}
                temp.active = false ;
            }
            var count = 0;
            if(data.hu){
                hu.active = true ;
                hu.x = - 250 + count * 110 ;
                count++;
            }
            if(data.gang){
                gang.active = true ;
                gang.x = - 250 + count * 110 ;
                count++;
            }
            if(data.dan){
                dan.active = true ;
                dan.x = - 250 + count * 110 ;
                count++;
            }
            if(data.ting){
                ting.active = true ;
                ting.x = - 250 + count * 110 ;
                count++;
            }
            if(data.peng){
                peng.active = true ;
                peng.x = - 250 + count * 110
                count++;
            }
            if(data.chi){
                chi.active = true ;
                chi.x = - 250 + count * 110
                count++;
            }
            {
                guo.active =true;
                guo.x = - 250 + count * 110 ;
                count++;
            }
            var action = cc.moveTo(0.1,1140 - count*285,-100);
            context.actionnode_two.x=(840 - count*100);
        },                       //服务端发送的 动作事件，有杠碰吃胡过可以选择
        selectaction: function(data,context){},        //我选择的动作， 杠碰吃胡
        dealcard: function(data,context){},                 //我出的牌
        allcards: function(data,context){},                 //我出的牌
        isOver: function(data,context){},  
        over: function(data,context){   cc.director.loadScene('gameMain');  },  
        unOver: function(data,context){ },  
        gameOver: function(data,context){},  
        changeRoom: function(data,context){},  
    },


});
