<template>
  <div>
    <div class="replyBox">
      <common-title :title="text" btn-text="发布" @clickFun='sureBtn'></common-title>
      <textarea v-model="inputText" autofocus="autofocus" :placeholder="placeholderText"></textarea>
    </div>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title'
export default {
  props: {

  },
  components: { commonTitle },
  data() {
    return {
      text: '',
      inputText: '',
      placeholderText: '请输入您的留言内容',
      type: '',
      id: this.$route.query.id
    }
  },
  mounted() {

  },
  created() {
    this.type = this.$route.query.type;
    if (this.type == 1) {
      this.placeholderText = '请输入您的留言内容'
      this.text = "留言"
    } else {
      this.placeholderText = '回复@' + this.$route.query.name
      this.text = "回复"
    }
  },
  methods: {
    //点击发布
    sureBtn() {
      if(this.inputText==""){
        this.$toast({
          message: '输入内容不能为空',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      if (this.type == 1) {
        //留言接口
        var params = {
          goodsId: this.id,
          content: this.inputText
        }
        this.$http.post('/apis' + 'goods_leave/save.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            this.$toast({
              message: '留言成功',
              duration: 1200,
              className: 'success'
            });
            this.$router.back(-1);
          } else if (res.retCode == "10002") {
            this.$router.replace({ path: '/wcoin/login' })
          }
        })
      } else {
        //回复接口
        var params = {
          id: this.id,
          content: this.inputText
        }
        this.$http.post('/apis' + 'goods_leave/reply.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            this.$toast({
              message: '回复成功',
              duration: 1200,
              className: 'success'
            });
            this.$router.back(-1);
          } else if (res.retCode == "10002") {
            this.$router.replace({ path: '/wcoin/login' })
          }
        })
      }
      
    }
  }
}

</script>
<style scoped>
.replyBox {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #fff;
  height: 100%;
}
textarea {
  height: 500px;
  overflow: auto;
  width: 100%;
  padding: 0 40px;
  resize: none;
  border: none;
  font-size: 30px;
  line-height: 42px;
  text-align: justify;
  color: #333;
}

</style>
