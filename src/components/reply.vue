<template>
  <div>
    <div class="replyBox">
      <common-title title="留言" btn-text="发布" @clickFun='sureBtn'></common-title>
      <textarea v-model="text" autofocus="autofocus" :placeholder="placeholderText"></textarea>
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
      placeholderText: '请输入您的留言内容'
    }
  },
  methods: {
    sureBtn() {
      this.$emit('sureFun')
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
