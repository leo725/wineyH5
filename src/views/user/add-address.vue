<template>
  <div class="container">
    <common-title title="收货地址" btn-text="保存" :has-line='true' @clickFun='addAddress'></common-title>
    <div class="main">
      <div class="input-box">
        <input type="text" placeholder="收货人姓名"   v-model="nickName">
      </div>
      <div class="input-box">
        <input type="number" v-model="phone" maxlength="11" placeholder="手机号码">
      </div>
      <div class="input-box local between" @click="toggleLocal=true">
        <input type="text" placeholder="所在地区" v-model="addressInput" readonly>
        <img src="../../assets/img/local.png" alt="">
      </div>
      <div class="input-box">
        <textarea v-model="address"  maxlength="150" class="textarea" placeholder="街道 小区门牌详细地址"></textarea>
      </div>
      <p class="default-add" @click="change">
        <input type="checkbox" class="common-checkbox" ref="checkbox" :checked="checkbox" :disabled="checkbox">
        <span>设为默认地址</span>
      </p>
      <div class="common-btn-box" v-if="isEdit">
        <div v-if="type==2" class="common-btn" @click="deleteAdd">删除</div>
      </div>
    </div>
    <mt-popup v-model="toggleLocal" position="bottom" class="local-popup">
      <addressMask @getAddress='AddressFun'></addressMask>
    </mt-popup>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title'
import addressMask from '@/components/address-mask'
export default {
  data() {
    return {
      list: {},
      type: this.$route.query.type,
      nickName: '', //收货人
      phone: '',
      address: '',
      toggleLocal: false,
      isEdit: true, // 是否编辑
      addressInput: '',
      provinceId: '', // 选中的省id
      cityId: '', // 选中的市id
      areaId: '', // 选中的区id
      isDefault: 'n', //是否默认地址
      checkbox: false,
      id:this.$route.query.id
    }
  },
  components: { commonTitle, addressMask },
  created() {
    console.log(this.id)
    var type = this.$route.query.type;
    if (type == 2) {
      var arr = JSON.parse(sessionStorage.getItem("addrssList"));
      this.list = arr;
      if (arr) {
        this.nickName = arr.nickName;
        this.phone = arr.phone;
        this.provinceId = arr.provinceId;
        this.cityId = arr.cityId;
        this.areaId = arr.areaId;
        this.address = arr.address;
        this.isDefault = arr.isDefault;
        this.addressInput = arr.provinceName + arr.cityName + arr.areaName;
        if (this.isDefault == 'y') {
          this.checkbox = true
        }
      }
    }

  },
  mounted() {

  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  methods: {
    //设置默认地址
    change(){
      if (this.checkbox) {
        this.$toast({
          message: '默认地址不允许取消',
          duration: 1200,
          className: 'warning'
        });
        this.checkbox = true
      }
    },
    // 保存
    addAddress() {
      //判断收货人写了没
      if (!this.nickName) {
        this.$toast({
          message: '请输入收货人',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      //手机号
      if (!this.phone) {
        this.$toast({
          message: '请输入手机号',
          duration: 1200,
          className: 'warning'
        });
        return false;
      } else {
        if (!this.validate('mobile', this.phone)) {
          this.$toast({
            message: '手机号格式不正确',
            className: 'warning',
            duration: 1200
          })
          return false;
        }
      }
      //判断省市区
      if (!this.addressInput) {
        this.$toast({
          message: '请选择省市区',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      //详细地址
      if (!this.address) {
        this.$toast({
          message: '请输入详细地址',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      //判断是否勾选默认地址
      if (this.$refs.checkbox.checked) {
        this.isDefault = 'y';
      } else {
        this.isDefault = 'n';
      }
      var params = {
        nickName: this.nickName,
        phone: this.phone,
        provinceId: this.provinceId,
        cityId: this.cityId,
        areaId: this.areaId,
        address: this.address,
        isDefault: this.isDefault,
        id:this.id
      }
      this.$http.post('/apis' + 'user_address/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.$router.go(-1);
        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    },
    //删除收货地址
    deleteAdd() {
      this.$messagebox.confirm('', {
        title: '确认删除？',
        message: '是否确认删除该收货地址？',
      }).then(action => {
        if (action == 'confirm') { //确认的回调
          var params = {
            id: this.list.id
          }
          this.$http.post('/apis' + 'user_address/delete.htm', this.Qs.stringify(params)).then(res => {
            if (res.retCode == 0) {
              this.$router.go(-1);
            } else if (res.retCode == "10002") {
              this.$router.replace({ path: '/wcoin/login' })
            }
          })
        }
      }).catch(err => {
        if (err == 'cancel') { //取消的回调
        }
      });

    },
    //获取选择完成后的省市区
    AddressFun(address, provinceId, cityId, areaId) {
      this.toggleLocal = !this.toggleLocal;
      this.addressInput = address;
      this.provinceId = provinceId;
      this.cityId = cityId;
      this.areaId = areaId;
    }
  }
}

</script>
<style scoped>
.mint-popup {
  height: 500px;
}

.main {
  padding-left: 40px;
}
.input-box {
  padding: 32px 0;
  border-bottom: 2px solid #eee;
}
.input-box input::-moz-placeholder,
.input-box input::-webkit-placeholder,
.input-box input:-ms-input-placeholder,
.input-box textarea::-moz-placeholder,
.input-box textarea::-webkit-placeholder,
.input-box textarea:-ms-input-placeholder {
  color: #cccccc;
}
.input-box input {
  font-size: 32px;
  color: #333;
  width: 100%;
  padding-right: 40px;
}
.local img {
  width: 23.5px;
  height: 32px;
  margin-right: 40.5px;
  position: relative;
  top: 4px;
}
.textarea {
  border: 0;
  font-size: 32px;
  width: 100%;
  padding-right: 40px;
  height: 130px;
}
.local-popup {
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
.default-add {
  margin-top: 30px;
}
.default-add img {
  width: 30px;
  margin-right: 22px;
  vertical-align: middle;
}
.default-add span {
  font-size: 28px;
  color: #666666;
  vertical-align: middle;
}
.common-btn-box {
  padding-right: 40px;
}
.common-btn {
  background-color: #999;
  width: 100%;
}

</style>
