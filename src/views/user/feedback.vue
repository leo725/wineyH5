<template>
  <div class="container">
    <common-title title="意见反馈"></common-title>
    <div class="main">
      <upload accept="image/*" class="upload" @uploadSuccess="uploadSuccess">
        <img src="../../assets/img/camera1.png" v-if="!picture" slot alt="" />
        <img v-else :src="picture" alt="" />
      </upload>
      <div class="box">
        <textarea v-model="content" class="textarea" placeholder="请输入遇到的问题或建议"></textarea>
      </div>
      <div class="box input-box">
        <label>联系电话</label>
        <input v-model="mobileNo" type="tel" placeholder="便于我们联系（必填）">
      </div>
      <div class="common-btn" @click="submit">
        确定
      </div>
    </div>
  </div>
</template>

<script>
  import commonTitle from '@/components/common-title'
  import upload from '@/components/upload'
  export default {
    data() {
      return {
        picture: '',
        content: '',
        mobileNo: ''
      }
    },
    components: {
      commonTitle,
      upload
    },
    methods: {
      // 文件上传成功
      uploadSuccess(res) {
        this.picture = res.url;
      },
      // 确定
      submit() {
        if (!this.mobileNo || !this.picture || !this.content) {
          this.$toast({
            message: '请完善意见反馈',
            className: "warning",
            duration: 1200
          })
          return false;
        }
        if (!this.validate('mobile', this.mobileNo)) {
          this.$toast({
            message: '手机号格式不正确',
            className: "warning",
            duration: 1200
          })
          return false;
        }
        if (this.content.length > 200) {
          this.$toast({
            message: '意见返回不超过200字',
            className: "warning",
            duration: 1200
          })
          return false;
        }
        var params = {
          mobileNo: this.mobileNo,
          picture: this.picture.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/', ''),
          content: this.content
        }
        this.$http.post('/apis' + 'sys_feedback/save.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            this.$toast({
              message: '操作成功',
              className: "success",
              duration: 1200
            });
            this.picture = '';
            this.content = '';
            this.mobileNo = '';
          }
        })
      }
    }
  }

</script>

<style scoped>
  .main {
    padding-left: 40px;
  }

  .upload img {
    width: 210px;
    height: 210px;
  }

  .textarea {
    width: 100%;
    border: 0;
    height: 160px;
    padding-bottom: 30px;
    margin-top: 70px;
    font-size: 30px;
    color: #333;
    padding-right: 40px;
  }

  .box {
    border-bottom: 2px solid #eee;
  }

  .input-box {
    height: 110px;
    line-height: 108px;
    font-size: 0;
  }

  .input-box label,
  .input-box input {
    font-size: 32px;
    color: #666666;
    line-height: 108px;
  }

  .input-box input {
    color: #333;
    padding-left: 40px;
    width: 500px;
  }

</style>
