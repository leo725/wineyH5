<template>
    <div class="container">
        <common-title :title="mobileNo?'更换手机号':'绑定手机号'" :sub-text="mobileNo?'当前手机号：'+mobileNo+'。更换手机后，下次登录可使用新手机号':'您尚未绑定手机号'"></common-title>
        <div class="main">
            <div class="input-box">
                <input type="tel" v-model="telNumber" placeholder="输入手机号">
            </div>
                <div class="input-box between input-box-code">
                    <input type="text" v-model="code" placeholder="输入验证码">
                    <p class="get-code" @click="getCode">
                        <span v-if="showBtn">获取验证码</span>
                        <span v-else class="default">重新获取{{timeNum}}s</span>
                    </p>
                </div>
                <div class="common-btn" @click="confirm">确认</div>
                <!-- <p class="other">收不到验证码？</p> -->
            </div>
        </div>
</template>

<script>
import commonTitle from '@/components/common-title'
var timer;
export default {
    data() {
        return {
            mobileNo: this.$route.query.mobileNo,
            telNumber: '',
            code: '',
            timeNum: 60,
            showBtn: true
        }
    },
    components: { commonTitle },
    methods: {
        // 获取验证码
        getCode() {
            if (!this.showBtn) {
                return false;
            }
            if (!this.validate('mobile', this.telNumber)) {
                this.$toast({
                    message: "手机号格式不正确",
                    className: 'warning',
                    duration: 1200
                });
                return false;
            }
            var params = {
                mobileNo: this.telNumber,
                smsEnum: 'mobileno'
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
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login');
                }
            })
        },
        // 确认
        confirm() {
            if (!this.validate('mobile', this.telNumber)) {
                this.$toast({
                    message: "手机号格式不正确",
                    className: 'warning',
                    duration: 1200
                });
                return false;
            }
            if (!this.code) {
                this.$toast({
                    message: "请输入验证码",
                    className: 'warning',
                    duration: 1200
                });
                return false;
            }
            var params = {
                mobileNo: this.telNumber,
                code: this.code
            }
            this.$http.post('/apis' + 'user_info/replace_mobile_no.htm', this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    this.$toast({
                        message: "修改成功",
                        className: 'success',
                        duration: 1200
                    });
                    this.$router.replace('/wcoin/userInfo')
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login');
                }
            })
        }
    }
}
</script>

<style scoped>
.main {
  padding-left: 40px;
  margin-top: 7px;
}
.input-box {
  height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  overflow: hidden;
}
.input-box input {
  font-size: 32px;
  color: #333;
  width: 100%;
  padding-right: 40px;
  line-height: 110px;
}
.input-box-code input {
  width: 400px;
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
.get-code span.default {
  color: #999999;
}
.common-btn {
  margin-top: 150px;
  margin-bottom: 60px;
}
.other {
  font-size: 32px;
  color: #333333;
  text-decoration: underline;
}
</style>
