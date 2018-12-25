var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        count: cc.Node,//content
        listItem: cc.Node,//初始的一个空的item
        scrollNode: cc.Node,
    },
    onLoad() {
        var self = this;
        // cc.weijifen.authorization = "fce05d5cba664ff696bcf9d25b68bdac";
        this.scrollNode.on("touch-up", this.onScrollViewBounceTop, this);
        this.scrollNode.on("bounce-bottom", this.onScrollViewBounceBottom, this);
        //获取次数
        cc.weijifen.http.httpGet('/rankingList/findPrizeCount?token=' + cc.weijifen.authorization, this.rankingSuccess, this.rankingError, this);

        //获取中奖列表
        cc.weijifen.http.httpGet('/rankingList/weekList?token=' + cc.weijifen.authorization, this.listSuccess, this.rankingError, this);
    },
    rankingSuccess(res) {
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

    listSuccess(res, object) {
        res = JSON.parse(res);
        object.count.children[0].active = true;
        if (res.prizeList && res.prizeList.length > 0) {  //请求到的数据组>0也就是有排行信息 
            cc.sys.localStorage.setItem("rankingData", JSON.stringify(res));
            var lastchildren = object.count.children;
            var L = lastchildren.length;
            //刷新之前，先删除原有数据
            for (var i = L - 1; i > 0; i--) {
                if (i <= 7) {
                    var good = lastchildren[i].children[0];
                    good.getChildByName('date').getComponent(cc.Label).string = res.prizeList[i].prizeName;
                    good.getChildByName('date2').getComponent(cc.Label).string = object.getNowFormatDate(res.prizeList[i].createTime);
                    good.getChildByName('num').getComponent(cc.Label).string = res.prizeList[i].prizeRanking;
                    good.active = true;
                } else {
                    object.count.removeChild(object.count.children[i]);
                    //cc.removeSelf(object.count.children[i]);
                    object.count.height -= 82;
                }
            }
            for (let i = 0; i < res.prizeList.length; i++) {
                if (object.count.y - object.count.height > -500) {
                    break; //当视口的底部坐标大于一定值时停止加载
                }
                let list; let items;
                if (i > 6) {
                    list = cc.instantiate(object.listItem);
                    items = list.children[0];
                } else {
                    items = lastchildren[i + 1].children[0];
                }
                items.active = true;
                items.getChildByName('date').getComponent(cc.Label).string = res.prizeList[i].prizeName;
                items.getChildByName('date2').getComponent(cc.Label).string = object.getNowFormatDate(res.prizeList[i].createTime);
                items.getChildByName('num').getComponent(cc.Label).string = res.prizeList[i].prizeRanking;
                if (i > 6) {
                    list.parent = object.count;
                    object.count.height += object.listItem.height;
                    list.x = 0;
                    list.y = lastchildren[object.count.childrenCount - 1].y - 82;
                }
            }
            // object.count.height = object.listItem.height * res.prizeList.length;
            cc.find("Canvas/menu/rangking/right/ScrollView/view/data").active = false;
        } else {
            cc.find("Canvas/menu/rangking/right/ScrollView/view/data/loaddata").active = false;
            cc.find("Canvas/menu/rangking/right/ScrollView/view/data/nulldata").active = true;
        }
    },
    rankingError: function (err) {
        this.count.children[0].active = true;
        console.log(err);
    },
    /**当scrollview在顶部回弹时回调函数*/
    onScrollViewBounceTop: function () {
        if (this.count.y > 170) {
            return;
        }
        this.count.children[0].active = false;
        for (var i = 1; i < this.count.childrenCount; i++) {
            this.count.children[i].children[0].active = false;
        }
        cc.find("Canvas/menu/rangking/right/ScrollView/view/data").active = true;
        cc.weijifen.http.httpGet('/rankingList/weekList?token=' + cc.weijifen.authorization, this.listSuccess, this.rankingError, this);
    },
    /**底部回弹时调用 */
    onScrollViewBounceBottom: function () {
        var res = JSON.parse(cc.sys.localStorage.getItem("rankingData"));
        if (res == null) {
            return;
        }
        if (res.prizeList && res.prizeList.length > 0) {  //请求到的数据组>0也就是有排行信息  
            var over = this.count.childrenCount - 1;
            var length = res.prizeList.length - over //最多加载=所有数据-已加载数据
            for (let i = over; i < length; i++) {
                if (i - over > 3) {//上拉加载每次加载4个
                    break;
                }
                let list = cc.instantiate(this.listItem);
                let items = list.children[0];
                items.active = true;
                items.getChildByName('date').getComponent(cc.Label).string = res.prizeList[i].prizeName;
                items.getChildByName('date2').getComponent(cc.Label).string = this.getNowFormatDate(res.prizeList[i].createTime);
                items.getChildByName('num').getComponent(cc.Label).string = res.prizeList[i].prizeRanking;
                this.count.height += this.listItem.height;
                list.parent = this.count;
                list.y = this.count.children[i].y - 82;
            }
        }
    },

    error(res) {
        console.log(res);

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
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }

    // update (dt) {},
});
