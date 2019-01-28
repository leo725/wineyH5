<template>
<div class="container">
    <common-title title="登录">
        <img src="../../assets/img/close.png" alt="" class="slot" slot @click="goBack">
    </common-title>
    <div class="main">
        <div class="input-box label-box">
            <label>+86</label>
            <input type="tel" v-model="mobileNo" placeholder="输入手机号">
        </div>
        <div class="input-box between input-box-code">
            <input type="text" v-model="code" placeholder="输入验证码">
            <p class="get-code" @click="getCode">
                <span v-if="showBtn">获取验证码</span>
                <span v-else class="default">重新获取{{timeNum}}s</span>
            </p>
        </div>
        <p class="other">
            温馨提示：首次使用该手机号登录则等于同意注册
        </p>
        <div class="common-btn" :class="!mobileNo||!code ? 'disabled':''" @click="login">登录</div>
    </div>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
var timer;
export default {
    data() {
        return {
            mobileNo: '',
            code: '',
            timeNum: 60,
            showBtn: true
        }
    },
    components: {
        commonTitle
    },
    methods: {
        // 获取验证码
        getCode() {
            if (!this.showBtn) {
                return false;
            }
            if (!this.mobileNo) {
                this.$toast({
                    message: '请输入手机号',
                    className: 'warning',
                    duration: 1200
                })
                return false;
            }
            if (!this.validate('mobile', this.mobileNo)) {
                this.$toast({
                    message: '手机号格式不正确',
                    className: 'warning',
                    duration: 1200
                })
                return false;
            }
            var params = {
                mobileNo: this.mobileNo,
                smsEnum: 'login'
            }
            this.showBtn = false;
            this.$http.post('/apis' + 'sms/send.htm', this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    this.$toast({
                        message: '验证码发送成功',
                        className: 'success',
                        duration: 1200
                    })
                    clearInterval(timer);
                    timer = setInterval(() => {
                        if (this.timeNum > 1) {
                            this.timeNum--;
                        } else {
                            this.timeNum = 60;
                            this.showBtn = true;
                            clearInterval(timer);
                        }
                    }, 1000)
                }
            })
        },
        // 登录
        login() {
            if (!this.mobileNo || !this.code) {
                return false;
            }
            var params = {
                mobileNo: this.mobileNo,
                code: this.code
            }
            this.$http.post('/apis' + 'account/login.htm', this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    sessionStorage.clear(); // 登录清空本地缓存
                    sessionStorage.setItem('wcoinMobile', this.mobileNo);
                    this.globalData.wcoinMobile = this.mobileNo;
                    this.globalData.hasRealInfo = false;
                    this.$router.push('/wcoin/home')
                }
            })
        },
        goBack() {
            this.$router.back(-1);
        }
    }
}
</script>

<style scoped>
.main {
    padding-left: 40px;
    margin-top: 73px;
}

.input-box {
    height: 110px;
    line-height: 110px;
    border-bottom: 2px solid #eee;
    overflow: hidden;
    font-size: 0;
}

.input-box input {
    font-size: 32px;
    color: #333;
    padding-right: 40px;
    line-height: 110px;
    width: 100%;
}

.input-box label {
    position: absolute;
    left: 0;
    top: 25px;
    font-size: 32px;
    color: #333333;
    border-right: 2px solid #eee;
    padding-right: 28px;
    line-height: 60px;
    height: 60px;
    z-index: 1;
}

.input-box-code input {
    width: 400px;
}

.label-box {
    position: relative;
}

.label-box input {
    padding-left: 120px;
}

.get-code span {
    line-height: 60px;
    font-size: 32px;
    color: #e50026;
    text-align: center;
    width: 280px;
    margin-top: 25px;
    border-left: 2px solid #eee;
    display: block;
}

.get-code .default {
    color: #999999;
}

.common-btn {
    margin-top: 150px;
    margin-bottom: 60px;
}

.slot {
    width: 30px;
    height: 30px;
    margin-right: 40px;
    margin-top: 10px;
}

.other {
    font-size: 28px;
    color: #999999;
    margin-top: 30px;
}
</style>
