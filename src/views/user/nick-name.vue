<template>
  <div class="container">
    <p class="title">修改昵称</p>
    <div class="input-box">
      <input type="text" v-model="params.nickName" placeholder="请输入昵称">
      <div class="detail-box" @click.stop="clear">
        <img src="../../assets/img/icon-close.png" alt="" class="delete">
      </div>
    </div>
      <div class="common-btn" @click="confirm">确定</div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      params: {}
    }
  },
  created() {
    this.params = this.$route.query;
  },
  methods: {
    clear() {
      this.params.nickName = '';
    },
    confirm() {
      if (!this.params.nickName) {
        this.$toast({
          message: "请输入昵称",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      var params = Object.assign({}, this.params);
      if (params.avatarUrl) {
        params.avatarUrl = params.avatarUrl.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/', '');
      }
      this.$http.post('/apis' + 'user_info/update_info.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.$toast({
            message: "修改成功",
            className: 'success',
            duration: 1200
          });
          this.$router.back(-1);
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login')
        }
      })
    }
  }
}

</script>
<style scoped>
.container {
  padding-top: 60px;
  padding-left: 40px;
}

.title {
  font-size: 54px;
  color: #000000;
  margin-bottom: 60px;
}

.input-box {
  position: relative;
  border-bottom: 2px solid #eee;
}

.input-box input {
  width: 100%;
  padding: 33px 0;
  font-size: 32px;
  color: #333333;
  padding-right: 80px;
}

.input-box .detail-box {
  position: absolute;
  right: 0;
  width: 70px;
  bottom: 0;
  z-index: 10;
  padding-bottom: 43.7px;
  padding-top: 43.7px;
  font-size: 0;
}

.input-box .detail-box img{
  width: 23.3px;
}

</style>
