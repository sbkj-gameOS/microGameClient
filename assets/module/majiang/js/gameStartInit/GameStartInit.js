cc.Class({
    extends: cc.Component,

    properties: {

    },

    //
    onLoad: function () {

    },

    /**
     * 获取所有玩家信息
     *
     * 方位
     *
     * 庄家
     *
     * 色子点数
     *
     * 宝牌/财神
     */

     /**
     * 接受新的庄家数据
     * @param data
     * @param context
     */
    banker_event:function(data, context){
        context = cc.find('Canvas').getComponent('MJDataBind');
        for(var inx = 0 ; inx<context.playersarray.length ; inx++){
            let temp = context.playersarray[inx].getComponent("MaJiangPlayer") ;
            if(data.userid == cc.beimi.user.id){
                cc.beimi.bankers =true;
            }else{
                cc.beimi.bankers =false;
            }
            if(temp.data.id == data.userid){
                cc.beimi.banker = data.userid ; 
                temp.banker(); 
                break ;
            }
        }
    },


});
