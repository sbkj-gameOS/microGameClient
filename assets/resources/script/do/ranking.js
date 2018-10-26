var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        count:cc.Node,
        listItem:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        // cc.weijifen.authorization = "a17872f265004430b3fb5268288b1af9";
        //获取次数
        cc.weijifen.http.httpGet('/rankingList/findPrizeCount?token='+cc.weijifen.authorization,this.rankingSuccess,this.rankingError,this);

        //获取中奖列表
        cc.weijifen.http.httpGet('/rankingList/weekList?token='+cc.weijifen.authorization,this.listSuccess,this.rankingError,this);
    },

    rankingSuccess (res) {
        res = JSON.parse(res);
        let left = cc.find("Canvas/menu/rangking/left");//日赛
        left.children[0].children[2].getChildByName('num').getComponent(cc.Label).string = res.weekNo1;
        left.children[0].children[3].getChildByName('num').getComponent(cc.Label).string = res.weekNo2;
        left.children[0].children[4].getChildByName('num').getComponent(cc.Label).string = res.weekNo3;

        left.children[1].children[2].getChildByName('num').getComponent(cc.Label).string = res.monthNo1;
        left.children[1].children[3].getChildByName('num').getComponent(cc.Label).string = res.monthNo2;
        left.children[1].children[4].getChildByName('num').getComponent(cc.Label).string = res.monthNo3;

        left.children[2].getChildByName('num').getComponent(cc.Label).string = res.rankingCount;

        left.children[3].getChildByName('num').getComponent(cc.Label).string = res.qqCount;
    },

    listSuccess (res,object){
        res = JSON.parse(res);
        // var countPrefab = cc.instantiate(object.listItem);
        for (let i = 0;i < res.prizeList.length;i++) {
            let list = cc.instantiate(object.listItem);
            list.active = true;
            list.getChildByName('date').getComponent(cc.Label).string = res.prizeList[i].prizeName;
            list.getChildByName('date2').getComponent(cc.Label).string = object.getNowFormatDate(res.prizeList[i].createTime);
            list.getChildByName('num').getComponent(cc.Label).string = res.prizeList[i].prizeRanking;
            list.parent = object.count;
        }
        object.count.height = object.listItem.height * res.prizeList.length;
    },

    error (res) {

    },
    getNowFormatDate(datetime) {
        var date = new Date(datetime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    }

    // update (dt) {},
});
