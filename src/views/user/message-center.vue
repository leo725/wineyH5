<template>
    <div class="container">
        <common-title title="消息中心"></common-title>
        <ul class="list">
            <li class="item">
                <img src="../../assets/img/service.png" alt="">
                <div class="right" @click="popupVisible=true">
                    <p>联系我们</p>
                    <span>在线客服咨询时间为09:00–24:00</span>
                </div>
            </li>
            <li class="item">
                <router-link to="/wcoin/transferMessage">
                    <img src="../../assets/img/icon-tz.png" alt="">
                    <div class="right">
                        <p>转账通知</p>
                        <span>收到来自嘿嘿嘿的转账</span>
                    </div>
                </router-link>
            </li>
        </ul>
        <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom" class="pop-box">
            <a class="pop-item">在线客服</a>
            <a href="tel:12345678901" class="pop-item">客服热线</a>
            <div class="cancel" @click="popupVisible=false">取消</div>
        </mt-popup>
    </div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
    data() {
        return {
            popupVisible: false
        }
    },
    components: { commonTitle }
}
</script>

<style scoped>
.list {
  padding-left: 40px;
}
.item {
  border-bottom: 2px solid #eee;
  height: 180px;
  padding-top: 40px;
  padding-bottom: 40px;
  font-size: 0;
}
.item a {
  display: block;
}
.item img {
  width: 100px;
  height: 100px;
  margin-right: 40px;
}
.item div {
  height: 100px;
  display: inline-block;
  vertical-align: top;
}
.item div p {
  font-size: 36px;
  color: #333333;
  margin-bottom: 10px;
}
.item div span {
  font-size: 30px;
  color: #999999;
}
.pop-box {
  width: 100%;
  padding: 30px;
  background-color: transparent;
}
.pop-box .pop-item {
  background-color: #fff;
  display: block;
  text-align: center;
  height: 110px;
  line-height: 110px;
  font-size: 32px;
  color: #000000;
}
.pop-box .pop-item:first-child {
  border-bottom: 2px solid #eee;
}
.pop-box .cancel {
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 32px;
  color: #999999;
  background-color: #fff;
  margin-top: 30px;
}
</style>
