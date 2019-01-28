<template>
<div class="userinfo">
    <common-title title="设置" class="setting-title"></common-title>
    <ul class="main">
        <li class="between" @click="setPayPwd">
            <p>设置支付密码</p>
            <div class="right">
                <span>{{hadSetPwd?'已设置':'未设置'}}</span>
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
    </ul>

    <ul class="main">
        <li class="between">
            <p>服务条款</p>
            <div class="right">
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
        <li class="between">
            <p>关于Wcoin</p>
            <div class="right">
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
    </ul>

    <ul class="main">
        <li>
            <router-link to="/wcoin/feedback" class="between">
                <p>意见反馈</p>
                <div class="right">
                    <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
                </div>
            </router-link>
        </li>
    </ul>
    <ul class="main">
        <li class="between" @click="logOut">
            <p>退出登录</p>
            <div class="right">
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
    </ul>
</div>
</template>

<script>
import commonTitle from '@/components/common-title';
export default {
    data() {
        return {
            hadSetPwd: false,
        }
    },
    components: {
        commonTitle
    },
    created() {
        this.initData();
    },
    methods: {
        // 初始化数据
        initData() {
            // 是否设置支付密码
            this.$http.post('/apis' + 'user_info/check_password.htm').then(res => {
                if (res.retCode == 0) {
                    this.hadSetPwd = res.data == 'n' ? false : true;
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login')
                }
            })
        },
        // 设置密码
        setPayPwd() {
            var url = this.hadSetPwd ? '/wcoin/changePayPwd' : '/wcoin/setPayPwd'
            this.$router.push(url)
        },
        // 退出登录
        logOut() {
            this.$http.post('/apis' + 'account/logout.htm').then(res => {
                if (res.retCode == 0) {
                    this.$router.replace('/wcoin/login')
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login')
                }
            })
        }
    }
}
</script>

<style scoped>
.userinfo {
    background-color: #f2f2f2;
    height: 100%;
}

.setting-title {
    padding-left: 40px;
}

.main {
    padding-left: 40px;
    background-color: #fff;
    margin-bottom: 30px;
}

.main li {
    height: 110px;
    border-bottom: 2px solid #eee;
}

.main li:last-child {
    border-bottom: 0;
}

.main li p {
    font-size: 32px;
    color: #333333;
    height: 108px;
    line-height: 108px;
}

.icon-right {
    height: 25.3px;
    position: relative;
    top: 3px;
    padding-left: 40px;
}

.right {
    padding-top: 41.6px;
    padding-right: 30.7px;
}

.right span {
    line-height: 0;
    font-size: 30px;
    color: #999999;
}

.main .userimg {
    height: 142px;
}

.userimg>img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-top: 26px;
}

.userimg .right {
    padding-top: 57px;
}
</style>
