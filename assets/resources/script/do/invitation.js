var WJFCommon = require("WJFCommon");
var succRes = {};
cc.Class({
    extends: WJFCommon,

    properties: {

    },

    onLoad () {
        // cc.weijifen.http.httpGet('/gameReward/findRewardByInvite?token=6c4e16cfd21b4741bc3f7f13dc85d8ed', this.invitationSucc.bind(this), this.invitationError.bind(this) , this);
        cc.weijifen.http.httpGet('/gameReward/findRewardByInvite?token='+ cc.weijifen.authorization, this.invitationSucc.bind(this), this.invitationError.bind(this) , this);
    },

    invitationSucc(res) {
        // res = '{"reward":{"orgi":"ch","rewardName":"邀请好友得红包","createTime":"1543818306000","rewardType":"1","del":"0","rewardContent":"123","startTime":"2017-01-03 00:00:00","updateTime":"","endTime":"2019-02-03 00:00:00","id":"5","prize":"","rewardStatus":"0"},"success":"true","childrenPlayers":[{"headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKXA5unTWbytpksjBGe3YLJ6joOzqvVoXp1I1HHa8K2fGCFlkSQNMZBSYr8xjCiagS2Qy6BJTLL7Ew/132","username":"运河弯","createtime":"1543216846000"},{"headimgurl":"http://wx.qlogo.cn/mmopen/vi_32/icfB3j55O9KhbNOjLHEwnctXGzgn5gQCs1FqAAPcHnwghtU5c62GiaORZzD2TrFVkxZ0PPfjp701lOOH6Da2wEpQ/0","username":"欢的欢","createtime":"1543216846000"}],"moneyCount":"20.51"}';
        res = JSON.parse(res);
        const inviNode =  cc.find('Canvas/invitationMenu/invitation');
        // console.log(res);
        if(res.success && res.success != "false") {
            succRes = Object.assign({}, res);

            // 加载二维码
            const QRCodeUrl = 'https://shangban-game.oss-cn-hangzhou.aliyuncs.com/app/kefuWxImg/' + cc.weijifen.GameBase.gameModel +'Kefu.jpg';
            cc.weijifen.GameBase.gameModel && cc.loader.load({url: QRCodeUrl, type: 'jpg'}, function(suc,texture){
                const QRCodeNode = cc.find('Canvas/invitationMenu/invitation/content/QRCode');
                QRCodeNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                QRCodeNode.width = 160;
                QRCodeNode.height = 160;
            });

            const childrenPlayNum = res.childrenPlayers.length;// 计算邀请的人数

            inviNode.getChildByName('content').getComponent(cc.Label).string = res.reward.rewardContent; // 修改活动描述
            cc.find('Canvas/invitationMenu/invitation/details/num').getComponent(cc.Label).string = childrenPlayNum + '/30'; // 修改邀请的人数
            // 对头像列表的处理
            const headNode = cc.find('Canvas/invitationMenu/invitation/headerList');
            const itemNode = headNode.getChildByName('item');
            this.cloneItem(itemNode, itemNode.parent, 9, res);


            // 对金钱的处理
            cc.find('Canvas/invitationMenu/invitation/bottom/money').getComponent(cc.Label).string = res.moneyCount + '元'; // 修改邀请的人数

        } else{
            console.log(res.msg, this);
            this.hiddenNode();
        } 
    },

    detailsBtnClick() {
        // succRes.childrenPlayers = [{"headimgurl":"http://wx.qlogo.cn/mmopen/vi_32/icfB3j55O9KhbNOjLHEwnctXGzgn5gQCs1FqAAPcHnwghtU5c62GiaORZzD2TrFVkxZ0PPfjp701lOOH6Da2wEpQ/0","username":"欢的欢","createtime":"1543216846000"},{"headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKXA5unTWbytpksjBGe3YLJ6joOzqvVoXp1I1HHa8K2fGCFlkSQNMZBSYr8xjCiagS2Qy6BJTLL7Ew/132","username":"运河弯","createtime":"1543216846000"},{"headimgurl":"http://wx.qlogo.cn/mmopen/vi_32/icfB3j55O9KhbNOjLHEwnctXGzgn5gQCs1FqAAPcHnwghtU5c62GiaORZzD2TrFVkxZ0PPfjp701lOOH6Da2wEpQ/0","username":"欢的欢","createtime":"1543216846000"}];
        // console.log(succRes);
        const inviNode =  cc.find('Canvas/invitationMenu/invitation');
        // 隐藏活动内容节点
        inviNode.getChildByName('inviteTitle').active = false;
        this.hiddenNode();
        // 显示好友列表节点  
        inviNode.getChildByName('fridendNode').active = true;
        // 数据处理
        const parentNode = cc.find('Canvas/invitationMenu/invitation/fridendNode/content');
        const itemNode = cc.find('Canvas/invitationMenu/invitation/fridendNode/itemCopy');
        parentNode.removeAllChildren();
        this.cloneItem(itemNode, parentNode, 30, succRes, 90);
    },

    goBack() {
        const inviNode =  cc.find('Canvas/invitationMenu/invitation');
        // 显示活动内容节点
        inviNode.getChildByName('inviteTitle').active = true;
        inviNode.getChildByName('content').active = true;
        inviNode.getChildByName('details').active = true;
        inviNode.getChildByName('headerList').active = true;
        inviNode.getChildByName('bottom').active = true;
        // 隐藏好友列表节点  
        inviNode.getChildByName('fridendNode').active = false;

    },

    /* clone节点
       @param  itemNode   节点模板
       @param  parentNode   clone节点的父节点
       @param  forNum 需要克隆的个数
       @param  res    目标数据
       @param  imgWd  头像宽高 选填
    */
    cloneItem(itemNode, parentNode,forNum, res, imgWH = 100) {
        const childrenPlayNum = res.childrenPlayers.length;// 计算头像的个数
        for(let i = 0; i< forNum;i++) {
            const item = cc.instantiate(itemNode);
            item.active = true;
            const textNode = item.getChildByName('text').getComponent(cc.Label); // 获取名称节点
            if(i < childrenPlayNum) {
                // 名字处理
                let username = res.childrenPlayers[i].username;
                if(username.length > 5) {
                   username = username.substring(0,5) + "...";
                }
                textNode.string = username;
                // 修改头像
                // const imgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKXA5unTWbytpksjBGe3YLJ6joOzqvVoXp1I1HHa8K2fGCFlkSQNMZBSYr8xjCiagS2Qy6BJTLL7Ew/132';
                const imgUrl = res.childrenPlayers[i].headimgurl;
                imgUrl && cc.loader.load({url: imgUrl, type: 'jpg'}, function(suc,texture){
                    const head = item.getChildByName('headImg');
                    head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    head.width = imgWH;
                    head.height = imgWH;
                });
            } else {
                textNode.string = 'XXX';
            }
            item.parent = parentNode;
        }
    },

    hiddenNode() {
        const inviNode =  cc.find('Canvas/invitationMenu/invitation');
        // 隐藏活动内容节点
        inviNode.getChildByName('content').active = false;
        inviNode.getChildByName('details').active = false;
        inviNode.getChildByName('headerList').active = false;
        inviNode.getChildByName('bottom').active = false;
    },

    invitationError(err) {
        this.hiddenNode();
        console.log(err);
    },

    // update (dt) {},
});
