<template>
<div class="container">
  <common-title title="我的银行卡" sub-text="支付密码为6位数字" class="title-box"></common-title>
  <div class="loadmore-container card-list items">
    <mt-loadmore :bottom-method="getCard" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'">
      <div class="main item" v-for="(list,index) in cardList">
        <!-- <div @touchstart='touchS' @touchmove='touchM($event,index)' @touchend='touchE($event,index)' :data-index="index" ref="touchdiv" :style="list.txtStyle" @click="editBank(list)" class="inner txt"> -->
          <div :data-index="index" ref="touchdiv" @click="editBank(list)" class="inner txt">
          <img :src="list.logo" alt="" class="card-img">
          <span>{{list.bankName}}</span>
          <img src="../../assets/img/icon-select.png" v-if="list.isDefault=='y'" alt="" class="select">
        </div>
       <!--  <div :data-index="index" @click="delItem(index,list)" class="inner del" ref="delList">解除绑定</div> -->
      </div>
      <div class="footer">
        <router-link to="/wcoin/addBankCard" class="box">
          <img src="../../assets/img/jia.png" alt="">
          <span>添加银行卡账户</span>
        </router-link>
      </div>
    </mt-loadmore>
  </div>

  <mt-popup v-model="togglePopup" popup-transition="popup-fade" position="bottom" class="popup-box">
    <div class="popup-item confirm" @click="confirm">确定</div>
    <div class="popup-item" @click="togglePopup=false;">取消</div>
  </mt-popup>
</div>
</template>
<script>
import commonTitle from '@/components/common-title';
export default {
  data() {
    return {
      cardList: [],
      startX: 0,
      delBtnWidth: 208, //删除按钮宽度单位（rpx）
      togglePopup: false,
      pageNum: 0,
      delId: 0,
      noMoerData: false
    }
  },
  components: {
    commonTitle
  },
  created() {
    this.getCard();
  },
  mounted() {
    this.initEleWidth();
  },
  methods: {
    //获取银行卡列表
    getCard() {
      var params = {
        pageNum: this.pageNum
      }
      if (!this.noMoerData) {
        this.$http.post('/apis' + 'user_bank/list.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            if (res.data.length > 0) {
              this.cardList = this.cardList.concat(res.data);
              this.pageNum += 1; //pageNum++
              if (res.data.length < 10) {
                this.noMoerData = true; //数据为空赋值
                this.$refs.loadmore.onBottomLoaded();
              }
            } else {
              this.$refs.loadmore.onBottomLoaded();
              this.noMoerData = true; //数据为空赋值
              this.$toast({
                message: '没有更多数据',
                duration: 1200,
                className: 'warning'
              });
            }
          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
          }
        })
      } else {
        this.$toast({
          message: '没有更多数据',
          duration: 1200,
          className: 'warning'
        });
      }
    },
    //开始移动
    touchS(e) {
      if (e.touches.length == 1) {
        //设置触摸起始点水平方向位置
        this.startX = e.touches[0].clientX
      }
    },
    touchM(e, index) {
      if (e.touches.length == 1) {
        var list = this.showList;
        var ref = this.$refs["touchdiv"];
        for (var i = 0; i < ref.length; i++) {
          ref[i].style.left = '0px';
        }
        //手指移动时水平方向位置
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        var disX = this.startX - moveX;
        var delBtnWidth = this.delBtnWidth;
        var txtStyle = "";
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
          txtStyle = "0px";
        } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "-" + disX + "px";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "-" + delBtnWidth + "px";
          }
        }
        //获取手指触摸的是哪一项
        // var index = e.currentTarget.dataset.index;
        this.$refs["touchdiv"][index].style.left = txtStyle;
        var list = this.showList;
        //更新列表的状态
        this.showList = list;
      }
    },
    touchE(e, index) {
      if (e.changedTouches.length == 1) {
        var list = this.showList;
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = this.startX - endX;
        var delBtnWidth = this.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth / 2 ? "-" + delBtnWidth + "px" : "0px";
        //获取手指触摸的是哪一项
        // var index = e.currentTarget.dataset.index;
        // list[index].txtStyle = txtStyle;
        this.$refs["touchdiv"][index].style.left = txtStyle;
        //更新列表的状态
        this.showList = list;
      }
    },
    //获取元素自适应后的实际宽度

    getEleWidth(w) {
      var real = 0;
      try {
        var res = window.screen.availWidth;
        var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
        // console.log(scale);
        real = Math.floor(res / scale);
        return real;
      } catch (e) {
        return false;
      }
    },
    initEleWidth() {
      var delBtnWidth = this.getEleWidth(this.delBtnWidth);
      this.delBtnWidth = delBtnWidth;
    },
    // 删除
    delItem(index, item) {
      this.togglePopup = true;
      this.delId = item.id;
      this.listIndex = index;
    },
    // 确定
    confirm() {
      var params = {
        id: this.delId
      }
      var list = this.cardList;
      this.$http.post('/apis' + 'user_bank/delete.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          //移除列表中下标为index的项
          list.splice(this.listIndex, 1);
          var ref = this.$refs["touchdiv"];
          for (var i = 0; i < ref.length; i++) {
            ref[i].style.left = '0px';
          }
          this.cardList = list;
          this.togglePopup = false;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 编辑银行卡
    editBank(item) {
      // 选择银行卡
      if (this.$route.query.selectCard) {
        sessionStorage.setItem('selectedBankCard', JSON.stringify(item));
        this.$router.back(-1);
      } else { // 编辑银行卡
        sessionStorage.setItem('editBankCard', JSON.stringify(item));
        this.$router.push({
          path: '/wcoin/addBankCard',
          query: {
            isEdit: true
          }
        })
      }

    }
  }
}
</script>
<style scoped>
.title-box {
  margin-bottom: 55px;
}

.card-list {
  padding-left: 40px;
}

.card-list .main {
  height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
}

.card-list .card-img {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 40px;
}

.card-list .main span {
  font-size: 32px;
  color: #333333;
  vertical-align: middle;
}

.card-list .select {
  float: right;
  width: 30px;
  height: 30px;
  margin-top: 40px;
  margin-right: 40px;
}

.items {
  width: 100%;
}

.item {
  position: relative;
  height: 110px;
  overflow: hidden;
}

.inner {
  position: absolute;
  top: 0;
  font-size: 30px;
}

.inner.txt {
  background-color: #fff;
  width: 100%;
  height: 110px;
  line-height: 110px;
  z-index: 5;
  transition: left 0.2s ease-in-out;
  overflow: hidden;
}

.inner.del {
  background-color: #e94837;
  width: 208px;
  z-index: 4;
  right: 0;
  color: #fff;
  height: 110px;
  line-height: 110px;
  text-align: center;
  font-size: 32px;
}

.footer {
  padding-right: 40px;
  margin-top: 100px;
  margin-bottom: 100px;
}

.footer .box {
  border: 2px dashed #979797;
  padding: 28.5px 0;
  text-align: center;
}

.box {
  display: block;
}

.box img {
  width: 42.6px;
  margin-right: 39.7px;
  vertical-align: middle;
}

.box span {
  font-size: 32px;
  color: #333333;
  vertical-align: middle;
}

.popup-box {
  width: 100%;
  text-align: center;
}

.popup-item {
  height: 110px;
  line-height: 110px;
  font-size: 36px;
  color: #333;
}

.popup-item.confirm {
  color: #e50026;
  border-bottom: 2px solid #eee;
}
</style>
