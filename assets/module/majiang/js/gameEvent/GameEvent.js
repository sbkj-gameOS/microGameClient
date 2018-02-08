var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {

    },

    //初始化
    onLoad: function () {
       
    },
    statics: {
        /**
         * 接受服务端的数据，玩家杠碰、吃胡等动作
         * @param data
         * @param context
         */
        action_event:function(data, context){
            context = cc.find('Canvas').getComponent('MJDataBind');     
            cc.sys.localStorage.setItem('altake','true');
            cc.sys.localStorage.removeItem('take');
            
           // if(cc.beimi.user.id == data.userid){
            // let gang , peng , chi , hu , guo ,dan,ting;
            // if(data.chis){
            //     context.chis = data.chis;
            //     for(let i =0; i< data.chis.length; i++){
            //         context.chis[i].push(data.card);
            //     }
            // }else{
            //     context.chis =[];
            // }
            // context.gangs = data["gangs"]?data["gangs"]:[];
            // context.dans = data["dans"]?data["dans"]:[];
            // context.tings = data["tings"]?data["tings"]:[];
            // if(data.deal == true){  //发牌的动作
            //     cc.sys.localStorage.setItem('guo','true');
            //     // let desk_script = context.actionnode_two.getComponent("DeskCards") ;
            //     // desk_script.init(data.card);
            //     for(var inx = 0 ; inx < context.actionnode_two_list.children.length ; inx++){
            //         let temp = context.actionnode_two_list.children[inx] ;
            //         if(temp.name == "gang"){gang = temp ;}
            //         if(temp.name == "dan"){dan = temp ;}
            //         if(temp.name == "ting"){ting = temp ;}
            //         if(temp.name == "hu"){hu = temp ;}
            //         if(temp.name == "guo"){guo = temp ;}
            //         temp.active = false ;
                    
            //     }
            //     var count = 0;
            //     if(data.hu){
            //         hu.active = true ;
            //         hu.x = - 250 + count * 110 ;
            //         count++;
            //     }
            //     if(data.gang){
            //         gang.active = true ;
            //         gang.x = - 250 + count * 110 ;
            //         count++;
            //     }
            //     if(data.dan){
            //         dan.active = true ;
            //         dan.x = - 250 + count * 110 ;
            //         count++;
            //     }
            //     if(data.ting){
            //         ting.active = true ;
            //         ting.x = - 250 + count * 110 ;
            //         count++;
            //     }
            //     {
            //         guo.active =true;
            //         guo.x = - 250 + count * 110 ;
            //         count++;
            //     }
               
            //     var action = cc.moveTo(0.1,1140 - count*285,-100);
            //     //context.actionnode_two.active = true;
            //     context.actionnode_two.x=(840 - count*100);
            //     //context.actionnode_two.runAction(action);
            //     //context.actionnode_deal.active = true ;

            //     context.action123 = "deal" ;
            // }else{
            //     for(var inx = 0 ; inx < context.actionnode_two_list.children.length ; inx++){
            //         let temp = context.actionnode_two_list.children[inx] ;
            //         if(temp.name == "gang"){gang = temp ;}
            //         if(temp.name == "peng"){peng = temp ;}
            //         if(temp.name == "chi"){chi = temp ;}
            //         if(temp.name == "hu"){hu = temp ;}
            //         if(temp.name == "guo"){guo = temp ;}
            //         temp.active = false ;
            //     }
            //     var count = 0;
            //     if(data.hu){
            //         hu.active = true ;
            //         hu.x = - 250 + count * 110
            //         count++;
            //     }
            //     if(data.gang){
            //         gang.active = true ;
            //         gang.x = - 250 + count * 110
            //         count++;
            //     }
            //     if(data.peng){
            //         peng.active = true ;
            //         peng.x = - 250 + count * 110
            //         count++;
            //     }
            //     if(data.chi){
            //         chi.active = true ;
            //         chi.x = - 250 + count * 110
            //         count++;
            //     }
            //     if(data.deal == false){
            //         guo.active = true ;
            //         guo.x = - 250 + count * 110
            //         count++;
            //     }  
            //     var action = cc.moveTo(0.1,1040 - count*285,-100);
            //     context.actionnode_two.x=(840 - count*100);                
            //     //context.actionnode_two.runAction(action);
            //     // let ani = context.actionnode_two.getComponent(cc.Animation);
            //     // ani.play("majiang_action") ;
            //     context.action123 = "two" ;
            // }
        },
    },
    
    //吃


	//碰    
    

    //杠


    //胡


    //听
});
