<template>
<div class="userinfo">
    <common-title title="个人信息"></common-title>
    <ul class="main">
        <li class="userimg">
            <upload class="upload" accept="image/*" :multiple="false" @uploadSuccess="uploadSuccess">
                <div class="between" slot>
                    <img :src="params.avatarUrl" class="userpic" alt="">
                    <div class="right">
                        <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
                    </div>
                </div>
            </upload>

        </li>
        <li class="between" @click="changeNickName">
            <p>昵称</p>
            <div class="right">
                <span>{{userInfo.nickName}}</span>
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
        <li class="between" @click="toggleShow=true;">
            <p>性别</p>
            <div class="right">
                <span>{{params.sex=='female'?'女':params.sex=='male'?'男':''}}</span>
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
        <li>
            <router-link :to="{path:'/wcoin/userInfoTel',query:{mobileNo:userInfo.mobileNo}}" class="between">
                <p>我的手机号</p>
                <div class="right">
                    <span>{{userInfo.mobileNo}}</span>
                    <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
                </div>
            </router-link>
        </li>
    </ul>

    <ul class="main">
        <li class="between" @click="changeBirthday">
            <p>出生日期</p>
            <div class="right">
                <span v-if="!params.birthTime">出生日期</span>
                <span v-else>{{params.birthTime|changeTime('-')}}</span>
                <img src="../../assets/img/icon-right.png" class="icon-right" alt="">
            </div>
        </li>
        <li class="between">
            <p>注册日期</p>
            <div class="right">
                <span>{{userInfo.createTime|changeTime}}</span>
            </div>
        </li>
    </ul>

    <mt-popup v-model="toggleShow" position="bottom" class="sex-popup">
        <div class="popup-main">
            <p @click="changeSex('male')">男</p>
            <p @click="changeSex('female')">女</p>
        </div>
    </mt-popup>
    <!-- 弹出框 -->
    <mt-datetime-picker @confirm='selsecTimeBack' :startDate="startDate" :endDate="endDate" ref="birthdayPicker" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
import upload from '@/components/upload'
export default {
    data() {
        return {
            birthday: '',
            startDate: new Date('1930-01-01'),
            endDate: new Date(),
            params: {
                avatarUrl: '',
                sex: '',
                nickName: '',
                birthTime: ''
            },
            toggleShow: false,
            userInfo: {

            }
        }
    },
    components: {
        commonTitle,
        upload
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        // 查询用户个人信息
        getUserInfo() {
            this.$http.get('/apis' + 'user_info/info.htm').then(res => {
                if (res.retCode == 0) {
                    this.userInfo = res.data;
                    this.params.sex = res.data.sex;
                    this.params.nickName = res.data.nickName;
                    this.params.avatarUrl = res.data.avatarUrl;
                    this.params.birthTime = res.data.birthTime;
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login');
                }
            })
        },
        // 设置昵称
        changeNickName() {
            this.$router.push({
                path: '/wcoin/nickName',
                query: {
                    avatarUrl: this.params.avatarUrl,
                    sex: this.params.sex,
                    nickName: this.params.nickName,
                    birthTime: this.params.birthTime
                }
            })
        },
        // 设置生日
        changeBirthday() {
            this.$refs.birthdayPicker.open();
        },
        // 设置生日的回调函数
        selsecTimeBack(res) {
            this.params.birthTime = res;
            this.updateUserInfo();
        },
        // 改变性别
        changeSex(text) {
            this.params.sex = text;
            this.toggleShow = false;
            this.updateUserInfo();
        },
        // 上传完成回调
        uploadSuccess(res) {
            this.params.avatarUrl = res.url;
            this.updateUserInfo();
        },
        // 改变性别
        updateUserInfo() {
            var params=Object.assign({},this.params);
            if(params.avatarUrl){
                params.avatarUrl=params.avatarUrl.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/','');
            }
            this.$http.post('/apis' + 'user_info/update_info.htm', this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    this.$toast({
                        message: "修改成功",
                        className: 'success',
                        duration: 1200
                    });
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login');
                }
            })
        }
    }
}
</script>

<style scoped>
.userinfo {
    background-color: #f2f2f2;
    min-height: 100%;
}

.title {
    font-size: 54px;
    color: #000000;
    margin-bottom: 60px;
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
    line-height: 110px;
    height: 110px;
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

.userimg .userpic {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-top: 26px;
}

.userimg .right {
    padding-top: 57px;
}

.upload>>>.el-upload {
    display: block;
}

.sex-popup {
    width: 690px;
    margin-bottom: 32px;
}

.popup-main p {
    text-align: center;
    line-height: 108px;
    height: 110px;
    border-bottom: 2px solid #eee;
    font-size: 36px;
    color: #333333;
}
</style>
