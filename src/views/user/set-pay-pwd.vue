<template>
    <div class="container">
        <common-title :title="isChange?'重置支付密码':'设置支付密码'" sub-text="支付密码为6位数字" class="pay-title"></common-title>
        <div class="input-box">
            <div class="item" @click="openKeyboard(true)">
                <input v-model="pwd" type="password" maxlength="6" readonly placeholder="请输入支付密码">
            </div>
                <div class="item" @click="openKeyboard(false)">
                    <input v-model="rePwd" type="password" maxlength="6" readonly placeholder="确认密码">
            </div>
                    <div class="common-btn" @click="confirm">确定</div>
                </div>
                <!-- 支付键盘 -->
                <keyboard :title="keyboardTitle" @changeNum="enterOver" v-show="keyboardShow" @closePwd="closekeyboard"></keyboard>
            </div>
</template>

<script>
import commonTitle from '@/components/common-title';
import keyboard from '@/components/keyboard'
export default {
    data() {
        return {
            flag: true, // true 设置密码 false 确认密码
            keyboardShow: false,
            keyboardTitle: '设置支付密码',
            pwd: '',
            rePwd: '',
            isChange: this.$route.query.code ? true : false // 是否重置
        }
    },
    components: { commonTitle, keyboard },
    methods: {
        // 确定
        confirm() {
            if (!this.pwd || !this.rePwd) {
                return false;
            }
            if (this.pwd != this.rePwd) {
                this.$toast({
                    message: '密码不一致',
                    className: "warning",
                    duration: 1200
                })
                return false;
            }
            var params = {
                password: this.pwd,
                confirmPassword: this.rePwd
            }
            var url = 'user_info/set_pay_password.htm';
            if (this.isChange) {
                params.code = this.$route.query.code
                url = 'user_info/reset_pay_password.htm'
            }
            this.$http.post('/apis' + url, this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    this.$toast({
                        message: '设置成功',
                        className: "success",
                        duration: 1200
                    })
                    this.$router.back(-1);
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login')
                }
            })
        },
        enterOver(res) {
            this.keyboardShow = false;
            if (this.flag) {
                this.pwd = res;
            } else {
                this.rePwd = res;
            }
        },
        closekeyboard(res) {
            if (this.flag) {
                this.pwd = res;
            } else {
                this.rePwd = res;
            }
            this.keyboardShow = false;
        },
        openKeyboard(flag) {
            this.flag = flag;
            if (flag) {
                // 设置支付密码
                this.pwd = '';
                this.keyboardTitle = '设置支付密码'
            } else {
                //确认支付密码
                this.rePwd = '';
                this.keyboardTitle = '确认密码'
            }
            this.keyboardShow = true;
        }
    }
}
</script>

<style scoped>
.pay-title {
  margin-bottom: 55px;
}
.input-box {
  padding-left: 40px;
}
.item {
  border-bottom: 2px solid #eee;
}
.item input {
  height: 110px;
  line-height: 110px;
  font-size: 32px;
  color: #333;
}
.item input:-moz-placeholder,
.item input::-webkit-input-placeholder {
  color: #999;
}
.common-btn {
  margin-top: 100px;
}
</style>
