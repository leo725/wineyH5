<template>
  <div class="alert-box">
    <div class="number-alert">
      <h5>数量选择</h5>
      <div class="change">
        <i class="btn minus" @click="changeNum(false)"></i>
        <input type="text" name="" @input="handleInput"  @blur="number=number==''||number<=0?1:parseInt(number)" v-model="number">
        <i class="btn add" @click="changeNum(true)"></i>
      </div>
      <div class="btn-box clearfix">
        <div class="btn close" @click="closeFun">
          取消
          <b></b>
        </div>
        <div class="btn suer" @click="sureFun">
          确认
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    num: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      text: '',
      number:this.num
    }
  },
  methods: {
    closeFun() {
      this.$emit('closeBtn')
    },
    sureFun() {
      this.$emit('sureBtn', this.number)
    },
    changeNum(type){
      if(type){
        this.number++;
      }else{
        if(this.number>1){
          this.number--;
        }
      }
    },
    handleInput(e) {
      this.number = e.target.value.replace(/[^\d]/g, '');
      //this.number=this.number<=0?1:this.number;
    },
  }
}

</script>
<style scoped>
.alert-box {
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.number-alert {
  background: #FFFFFF;
  width: 620px;
  margin: 0 auto;
  margin-top: 30%;
}

.number-alert h5 {
  font-size: 38px;
  color: #333333;
  padding-top: 40px;
  text-align: center;
}

.change {
  text-align: center;
  margin-top: 59px;
  margin-bottom: 60px;
}

.change i {
  background: url(../assets/img/icon-jian.png) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  width: 44px;
  height: 44px;
  vertical-align: middle;
}

.change .add {
  background-image: url(../assets/img/icon-jia.png);
}

.data-list .right .minus {}

.change input {
  vertical-align: middle;
  background: #F2F2F2;
  width: 156px;
  height: 82px;
  text-align: center;
  padding: 0 5px;
  font-size: 28px;
  color: #333333;
}

.btn-box {
  border-top: 1px solid #eee;
}

.btn-box .btn {
  height: 100px;
  line-height: 100px;
  text-align: center;
  width: 50%;
  position: relative;

  color: #333;
  font-size: 30px;
  float: left;
}

.btn-box .btn b {
  position: absolute;
  right: 0;
  top: 20px;
  width: 2px;
  height: 60px;
  background-color: #eee;
  display: block;
}

.btn-box .suer {
  color: #E50026;
}

</style>
