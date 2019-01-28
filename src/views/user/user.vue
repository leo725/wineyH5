<template>
<div class="container">
    <header class="user-header">
        <div class="top" @click="gotoUserInfo">
            <div class="top-img-box">
                <img :src="userInfo.avatarUrl" class="userimg" alt="">
            </div>
            <span class="name">{{userInfo.nickName}}</span>
            <!-- <img class="message" src="../../assets/img/icon-message-white.png" @click.stop="gotoMessageCenter" alt=""> -->
        </div>
        <div class="info between">
            <div class="left">
                <router-link to="/wcoin/myPublish" class="item">
                    <span class="font-top">发布</span>
                    <p class="font-foot">{{userNum.releaseNumber}}</p>
                </router-link>
                <router-link to="/wcoin/mySell" class="item">
                    <span class="font-top">卖出</span>
                    <p class="font-foot">{{userNum.sellOutNumber}}</p>
                </router-link>
            </div>
            <router-link to="/wcoin/myCollect" class="right">
                <span class="font-top">收藏</span>
                <p class="font-foot">{{userNum.favouriteNumber}}</p>
            </router-link>
        </div>
    </header>
    <div class="main">
        <p class="title">我的服务</p>
        <ul class="my-service">
            <li class="service">
                <router-link to="/wcoin/myWine">
                    <div class="img-box">
                        <img src="../../assets/img/winey.png" alt="">
                    </div>
                    <p>我的红酒</p>
                </router-link>
            </li>
            <li class="service" @click="gotoSellWine">
                <div class="img-box">
                    <img src="../../assets/img/sell.png" alt="">
                </div>
                <p>我要出售</p>
                <!-- <router-link to="/wcoin/sellWine">
                    
                </router-link> -->
            </li>
            <li class="service">
                <router-link to="/wcoin/transferAccounts">
                    <div class="img-box">
                        <img src="../../assets/img/icon-tran.png" class="img3" alt="">
                    </div>
                    <p>快速转账</p>
                </router-link>
            </li>
            <li class="service">
                <router-link to="/wcoin/certification">
                    <div class="img-box">
                        <img src="../../assets/img/id.png" class="img4" alt="">
                    </div>
                    <p>身份认证</p>
                </router-link>
            </li>
        </ul>
    </div>
    <ul class="list">
        <li>
            <router-link to="/wcoin/myAddress">
                <span>我的收货地址</span>
                <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
            </router-link>
        </li>
        <li>
            <router-link to="/wcoin/myCard">
                <span>我的银行卡</span>
                <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
            </router-link>
        </li>
        <li @click="servicePopup=true;">
            <span>联系我们</span>
            <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
        </li>
        <li>
            <router-link to="/wcoin/setting">
                <span>设置</span>
                <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
            </router-link>
        </li>
    </ul>
    <mt-popup v-model="servicePopup" popup-transition="popup-fade" position="bottom" class="pop-box">
        <a class="pop-item" @click.stop="onlineService">在线客服</a>
        <a href="tel:12345678901" class="pop-item">客服热线</a>
        <div class="cancel" @click="servicePopup=false">取消</div>
    </mt-popup>
    <footer-tab></footer-tab>
</div>
</template>
<script>
import footerTab from '@/components/footer-tab'
export default {
    data() {
        return {
            userInfo: {},
            servicePopup: false,
            userNum: {}
        }
    },
    components: {
        footerTab
    },
    created() {
        this.getUserInfo();
        this.getUserNum();
    },
    methods: {
        // 查询用户个人信息
        getUserInfo() {
            this.$http.get('/apis' + 'user_info/info.htm').then(res => {
                if (res.retCode == 0) {
                    this.userInfo = res.data;
                    this.globalData.userInfo = this.userInfo;
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login');
                }
            })
        },
        // 跳转个人信息
        gotoUserInfo() {
            this.$router.push({
                path: '/wcoin/userInfo'
            })
        },
        // 跳转消息中心
        gotoMessageCenter() {
            this.$router.push({
                path: '/wcoin/messageCenter'
            })
        },
        // 跳转到红酒出售
        gotoSellWine() {
            sessionStorage.removeItem('sellWineObj');
            this.$router.push({
                path: '/wcoin/sellWine'
            })
        },
        //个人中心，收藏、卖出、发布 数量
        getUserNum() {
            this.$http.post('/apis' + '/user_info/goods_info.htm', this.Qs.stringify({})).then(res => {
                if (res.retCode == 0) {
                    this.userNum = res.data;
                } else if (res.retCode == "10002") {
                    this.$router.replace({
                        path: '/wcoin/login'
                    })
                }
            })
        },
        // 在线客服
        onlineService() {
            var newBridge = document.getElementById('nb_icon_wrap');
            if (newBridge) {
                newBridge.click();
            }
            this.servicePopup = false;
        }
    }
}
</script>

<style scoped>
.container {
    padding-bottom: 120px;
}

.user-header {
    background: #333333;
    padding: 60px 0 0 60px;
    height: 388px;
    width: 100%;
}

.user-header .top .userimg {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    vertical-align: middle;
    object-fit: cover;
}

.top .name {
    color: #fff;
    font-size: 38px;
    vertical-align: middle;
}

.top .message {
    float: right;
    width: 42px;
    margin-top: 39.5px;
    margin-right: 40px;
}

.user-header .info {
    margin-top: 80px;
}

.top-img-box {
    display: inline-block;
    width: 120px;
    height: 120px;
    vertical-align: middle;
    margin-right: 30px;
}

.info .right {
    width: 287px;
    text-align: center;
}

.info .left {
    overflow: hidden;
    width: 460px;
    position: relative;
}

.info .left::after {
    position: absolute;
    right: 0;
    top: 20px;
    content: "";
    width: 0;
    height: 50px;
    border-right: 2px solid #fff;
}

.info .left .item {
    float: left;
    width: 50%;
    text-align: center;
}

.font-top {
    font-size: 28px;
    color: #cccccc;
}

.font-foot {
    font-size: 32px;
    color: #ffffff;
    margin-top: 4px;
    min-height: 30px;
}

.title {
    font-size: 38px;
    color: #000000;
    margin-top: 40px;
    margin-bottom: 50px;
    padding-left: 40px;
}

.my-service {
    overflow: hidden;
}

.service {
    width: 25%;
    float: left;
    text-align: center;
}

.service>a {
    display: block;
}

.img-box {
    height: 66px;
    line-height: 66px;
    margin-bottom: 10px;
}

.service img {
    height: 66px;
}

.service .img3 {
    height: 58px;
    margin-top: 4px;
}

.service .img4 {
    height: 38px;
    margin-top: 14px;
}

.service p {
    font-size: 28px;
    color: #666666;
}

.list {
    padding-left: 40px;
    margin-top: 51px;
}

.list li {
    height: 110px;
    border-top: 2px solid #eee;
    overflow: hidden;
}

.list li a {
    display: block;
    line-height: 108px;
}

.list li span {
    font-size: 32px;
    color: #333333;
    line-height: 108px;
}

.list li .icon-right {
    float: right;
    height: 25.2px;
    margin-top: 42px;
    margin-right: 31px;
}

.pop-box {
    width: 100%;
    padding: 30px;
    background-color: transparent;
}

.pop-box .pop-item {
    background-color: #fff;
    display: block;
    text-align: center;
    height: 110px;
    line-height: 110px;
    font-size: 32px;
    color: #000000;
}

.pop-box .pop-item:first-child {
    border-bottom: 2px solid #eee;
}

.pop-box .cancel {
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 32px;
    color: #999999;
    background-color: #fff;
    margin-top: 30px;
}
</style>
