<template>
  <div class="container">
    <common-title title="发货"></common-title>
    <div class="main">
      <div class="input-box">
        <input type="tel" v-model="params.deliverMobileNo" placeholder="请输入联系方式">
      </div>
      <div class="input-box" @click="$refs.picker.open();">
        <div class="between">
          <span>取件时间</span>
          <img src="../../assets/img/icon-right.png" alt="">
        </div>
        <p class="gary">{{params.deliverPartTime?params.deliverPartTime:'暂未选择取件时间'}}</p>
      </div>
      <div class="input-box" @click="selectAddress">
        <div class="between">
          <span>取件地址</span>
          <img src="../../assets/img/icon-right.png" alt="">
        </div>
        <p class="gary left">{{params.deliverAddress?params.deliverAddress:'暂未选择取件地址'}}</p>
      </div>
      <p class="common-btn" @click="submit">
        确认提交
      </p>
    </div>
    <mt-popup v-model="timeShow" position='bottom'>
      <div class="time-picker">
        <div class="time-picker-box">
          <span class="cancle mint-datetime-action" @click="cancel">取消</span>
          <span class="confirm mint-datetime-action" @click="confirm">确定</span>
        </div>
        <mt-picker :slots="timeList" @change="onTimeChange" ref="timePicker"></mt-picker>
      </div>
    </mt-popup>
    <mt-datetime-picker type="date" @confirm='selsecTimeBack' :startDate="startDate" year-format="{value}年"
      month-format="{value}月" date-format="{value}日" hour-format="{value}时" minuteFormat="{value}分" ref="picker"></mt-datetime-picker>
  </div>
</template>

<script>
  import commonTitle from '@/components/common-title'
  export default {
    data() {
      return {
        params: {
          goodsWineryOrderId: this.$route.query.id,
          deliverMobileNo: '',
          deliverPartTime: '',
          deliverAddress: ''
        },
        pickerTime: '',
        selectedAddress: '',
        startDate: new Date(),
        timeList: [{
          flex: 1,
          values: ['09:00 至 11:00', '11:00 至 13:00', '13:00 至 15:00', '15:00 至 17:00']
        }],
        timeShow: false
      }
    },
    components: {
      commonTitle
    },
    created() {
      // 获取选择的地址
      var selectedAddress = sessionStorage.getItem('selectedAddress');
      var shipmentsParams = sessionStorage.getItem('shipmentsParams');
      if (selectedAddress) {
        this.selectedAddress = JSON.parse(selectedAddress);
      }
      if (shipmentsParams) {
        this.params = JSON.parse(shipmentsParams);
        this.params.goodsWineryOrderId = this.$route.query.id;
      }
      this.params.deliverAddress = this.selectedAddress.provinceName + this.selectedAddress.cityName + this.selectedAddress
        .areaName + this.selectedAddress.address;
    },
    beforeDestroy() {
      sessionStorage.setItem('shipmentsParams', JSON.stringify(this.params))
    },
    methods: {
      // 时间选择回调
      selsecTimeBack(res) {
        var year = res.getFullYear() + '';
        var month = res.getMonth() + 1 < 10 ? '0' + (res.getMonth() + 1) : res.getMonth() + 1 + '';
        var day = res.getDate() < 10 ? '0' + res.getDate() : res.getDate() + '';
        // this.params.deliverPartTime = year + '-' + month + '-' + day;
        this.pickerTime = year + '-' + month + '-' + day;
        this.timeShow = true;
      },
      confirm() {
        var time = this.$refs.timePicker.getSlotValue(0);
        time = time.replace(' 至 ', '-');
        var endTime = time.substring(time.length-5,time.length);
        if(new Date(this.pickerTime+' '+endTime)<new Date()){
          this.$toast({
            message: '请选择当前时间之后的时间段',
            duration: 1200,
            className: 'warning'
          });
          return false;
        }
        this.params.deliverPartTime = this.pickerTime + ' ' + time;
        this.timeShow = false;
      },
      cancel() {
        //   this.params.deliverPartTime = '';
        this.timeShow = false;
      },
      onTimeChange(res) {
        // this.params.deliverPartTime = '';
      },
      // 选择取件地址
      selectAddress() {
        this.$router.push({
          path: '/wcoin/myAddress',
          query: {
            selectAdd: true
          }
        })
      },
      // 提交
      submit() {
        if (!this.params.deliverMobileNo || !this.params.deliverPartTime || !this.params.deliverAddress) {
          this.$toast({
            message: '请完善信息',
            duration: 1200,
            className: 'warning'
          });
          return false;
        }
        if (!this.validate('mobile', this.params.deliverMobileNo)) {
          this.$toast({
            message: '手机号格式不正确',
            duration: 1200,
            className: 'warning'
          });
          return false;
        }
        this.$http.post('/apis' + 'sell_order/update.htm', this.Qs.stringify(this.params)).then(res => {
          if (res.retCode == 0) {
            res.data.deliverPartTime = this.params.deliverPartTime;
            res.data.deliverAddress = this.params.deliverAddress;
            sessionStorage.setItem('maildetailObj', JSON.stringify(res.data));
            sessionStorage.removeItem('shipmentsParams');
            this.$router.replace({
              path: '/wcoin/maildetail'
            })

          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
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

  .input-box {
    min-height: 110px;
    border-bottom: 2px solid #eee;
    line-height: 110px;
    padding-right: 40px;
    overflow: hidden;
  }

  .input-box input,
  .input-box span {
    color: #333;
    line-height: 108px;
    font-size: 32px;
  }

  .input-box input {
    width: 100%;
  }

  .input-box img {
    width: 13.3px;
    height: 25.2px;
    margin-top: 42px;
  }

  .gary {
    background: #F7F7F7;
    min-height: 88px;
    text-align: center;
    padding: 24px 40px;
    font-size: 28px;
    color: #999999;
    margin-bottom: 40px;
  }

  .gary.left {
    text-align: justify;
  }

  .mint-datetime {
    height: 580px;
  }

  .mint-popup {
    width: 100%;
  }

  .time-picker {
    width: 100% !important;
    height: 500px;
    width: 40%;
    text-align: center;
  }

  .time-picker-box {
    height: 80px;
    line-height: 80px;
    font-size: 0;
    border-bottom: solid 2px #eaeaea;
  }

  .time-picker-box span {
    line-height: 80px;
    font-size: 32px;
  }

  .time-picker .picker {
    height: 500px;
  }

</style>
