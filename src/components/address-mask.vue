<template>
  <div id="address-mask">
    <div id="address-area">
      <div id="address-area-con">
        <ul class="address-area-tit">
          <li :class="showProvince?'active':''" @click="selectedArea('province')">
            {{ province }}</li>
          <li v-if="choiceCity" :class="showCity?'active':''" @click="selectedArea('city')">
            {{ city }}</li>
          <li v-if="choiceArea" :class="showArea?'active':''">
            {{ area }}</li>
        </ul>
        <ul class="address-city" v-if="showProvince">
          <li v-for="(n, i) in provinceList" @click="getProvince(n.id, n.name, i)" :class="i==provinceIndex?'selected-li':''">
            {{ n.name }}</li>
        </ul>
        <ul class="address-city" v-if="showCity">
          <li v-for="(n, i) in cityList" @click="getCity(n.id, n.name, i)" :class="i==cityIndex?'selected-li':''">
            {{ n.name }}</li>
        </ul>
        <ul class="address-city" v-if="showArea">
          <li v-for="(n, i) in areaList" @click="setCityEnd(n.id, n.name, i)" :class="i==areaIndex?'selected-li':''">{{ n.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {

  },
  data() {
    return {
      choiceProvince: false, // 省按钮的显示隐藏
      choiceCity: false, // 市按钮的显示隐藏
      choiceArea: false, // 区按钮的显示隐藏
      province: '请选择', // 选中的省
      city: '请选择', // 选中的市
      area: '请选择', // 选中的区
      showProvince: true, // 省选择的显示隐藏
      showCity: false, // 市选择的显示隐藏
      showArea: false, // 区选择的显示隐藏
      provinceId: '', // 选中的省id
      cityId: '', // 选中的市id
      areaId: '', // 选中的区id
      selected: false, // 选中的那个项
      provinceList: [], // 省列表
      cityList: '', // 市列表
      areaList: '', // 区列表
      provinceIndex: -1, // 选中态索引
      cityIndex: -1,
      areaIndex: -1,
      choiceAreaCon: ''
    }
  },
  created() {
    this.getProvinceList(1, 'province');
  },
  mounted() {

  },
  methods: {
    //获取省数据
    getProvinceList(num, address) {//根据传入列表选择相应展示id下内容
      var params = {
        parentId: num
      }
      this.$http.post('/apis' + 'area/list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (address == "province") {
            this.provinceList = res.data;
          } else if (address == "city") {
            this.cityList = res.data;
          } else {
            this.areaList = res.data;
          }

        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    },
    getProvince(id, name, index) {
      this.city = '请选择', // 选中的市
      this.area = '请选择', // 选中的区
      this.provinceIndex = index;
      this.choiceCity = true;
      this.province = name;
      this.provinceId = id;
      this.showProvince = false;
      this.showCity = true;
      this.showArea = false;
      this.cityList =[];
      this.getProvinceList(id, 'city');
    },
    getCity(id, name, index) { // 获取城市列表
      this.area = '请选择', // 选中的区
      this.cityIndex = index;
      this.choiceArea = true;
      this.city = name;
      this.cityId = id;
      this.showProvince = false;
      this.showCity = false;
      this.showArea = true;
      this.areaList =[];
      this.getProvinceList(id, 'area');
    },
    setCityEnd(id, name, index) { // 区点完以后
      this.isArea = !this.isArea;
      this.area = name;
      this.choiceArea = true;
      this.choiceAreaCon = this.province + this.city + this.area;
      this.areaIndex = index;
      this.area = name;
      this.areaId=id;
      this.$emit('getAddress',this.choiceAreaCon,this.provinceId,this.cityId,this.areaId)
    },
    selectedArea(type) { // 按钮点击
      if (type == "province") {
        this.cityIndex = -1;
        this.areaIndex = -1;
        this.choiceCity = false;
        this.choiceArea = false;
        this.showProvince = true;
        this.showCity = false;
        this.showArea = false;
      } else if (type == "city") {
        this.areaIndex = -1;
        this.choiceArea = false;
        this.showProvince = false;
        this.showCity = true;
        this.showArea = false;
      }
    }
  }
}

</script>
<style scoped>
/*地区样式*/

#address-mask {
  width: 100%;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
}
#address-area {
  width: 100%;
  height: 500px;
  overflow: hidden;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 -4px 7px rgba(255, 255, 255, .6);
}
.address-area-tit {
  border-bottom: 1px solid #ccc;
  line-height: 40px;
  box-shadow: 0px 1px 2px rgba(23, 43, 135, .2);
}
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.address-area-tit {
  padding: 0;
  box-shadow: none;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
}
.address-area-tit li {
  cursor: pointer;
  position: relative;
  left: 0;
  top: 1px;
  width: 32%;
  padding: 20px 10px;
  text-align: center;
  font-size: 30px;
  display: inline-block;
  /* border-bottom: 1px solid #ccc; */
}
.address-area-tit li.active {
  /* border-bottom: 1px solid #FF0000; */
  color: #FF0000;
}
.address-city {
  height: 450px;
  overflow-y: scroll;
  width: calc(100% + 30px);
  padding-left: 40px;
  padding-bottom: 40px;
}
.address-city li {
  padding: 15px 35px;
  padding-left: 0;
  line-height: 40px;
  font-size: 26px;
  cursor: pointer;
  color: #666;
  border-bottom: 1px solid #eee;
}
.address-city li:last-child{
  border: none;
}
.address-city li.selected-li {
  color: #FF0000;
}
</style>
