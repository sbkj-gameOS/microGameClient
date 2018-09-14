var WJFCommon = require('WJFCommon');
cc.Class({
    extends: WJFCommon,

    properties: {
        turnModel: cc.Node,
        rightModel: cc.Node
    },
    onLoad () {
        cc.weijifen.activityId = 31;
        this.turnTableInit();




    },
    /**
     * 初始化转盘奖项
     */
    turnTableInit: function () {
        // 测试数据
    /* {"activityManange":{"gameType":1,"image":null,"competency":"[{\"id\":\"1\",\"name\":\"1人1天次\"},{\"id\":\"3\",\"name\":\"房卡1天多次\"}]",
     "awardData":"{\"awardData\":[{\"orgi\":\"ch\",\"createTime\":1525685580000,\"count\":\"1\",\"dname\":\"房卡\",\"id\":22,\"isDel\":0,\"did\":1,\"nameValue\":\"房卡-1张\",\"probability\":2},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"再接再厉\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"再接再厉\",\"probability\":35},
     {\"orgi\":\"ch\",\"createTime\":1525685587000,\"count\":\"3\",\"dname\":\"房卡\",\"id\":24,\"isDel\":0,\"did\":1,\"nameValue\":\"房卡-3张\",\"probability\":1},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"不要灰心\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"不要灰心\",\"probability\":25},
     {\"orgi\":\"ch\",\"createTime\":1525685594000,\"count\":\"10\",\"dname\":\"房卡\",\"id\":26,\"isDel\":0,\"did\":1,\"nameValue\":\"房卡-10张\",\"probability\":0},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"再接再厉\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"再接再厉\",\"probability\":20},
     {\"orgi\":\"ch\",\"createTime\":1525685556000,\"count\":\"1\",\"dname\":\"月赛卡\",\"id\":21,\"isDel\":0,\"did\":2,\"nameValue\":\"月赛卡-1张\",\"probability\":0},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"不要灰心\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"不要灰心\",\"probability\":17}],
     \"glData\":[[0,1,43,\"房卡-1张\",2,22],[1,45,88,\"再接再厉\",35,-1],[2,90,133,\"房卡-3张\",1,24],[3,135,178,\"不要灰心\",25,-1],[4,180,223,\"房卡-10张\",0,26],[5,225,268,\"再接再厉\",20,-1],
     [6,270,313,\"月赛卡-1张\",0,21],[7,315,358,\"不要灰心\",17,-1]]}","num":1,"content":"欢乐大转盘，转转更欢乐","orgi":"ch","createTime":1534129469000,"name":"欢乐大转盘","startTime":"2018-05-07 00:00:00.0","endTime":"2019-05-06 00:00:00.0","id":31,"userType":2,"isDel":0,"status":1},
     "prizeUser":"OOO 获得 房卡-3张, T。篮球疯子爱健身 获得 房卡-1张  , Er. 获得 房卡-1张   ,T。篮球疯子爱健身 获得 房卡-1张,  亚茹[微笑] 获得 房卡-1张 ,  宋静冰 获得 房卡-1张 ","success":true}*/
        let self = this;
        function initData (res) {
            var data1 = [];
            var data = JSON.parse(res);
            if (data.success) {



            }
        };
        cc.weijifen.http.httpPost("/gamePrizeActivity/findActivityOne",{activityId:cc.weijifen.activityId},initData,self.err,self);

    },
    err () {
        console.log('错误！')
    }
});
