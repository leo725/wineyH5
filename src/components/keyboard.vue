<template>
	<div class="model-close" id="keyboard-model" @click="close($event)">
		<div class="numBoxs">
			<h3 v-if="!otherTitle">{{title}}</h3>
			<h3 v-else class="title-red">{{otherTitle}}</h3>
			<span class="close" >
				<img src="../assets/img/alert-close.png" class="model-close">
			</span>
			<div class="numList">
				<ul class="clearfix">
					<li v-for="(item,index) in 6">

						<p v-if="index<number.length">●</p>
						<p v-else></p>
						<b></b>
					</li>
				</ul>
			</div>
			<div class="keyset">
				<ul class="clearfix">
					<li v-for="(item,index) in numKeyset" @click="funKey(item.num)">
						<span>{{item.num}}</span>
					</li>
					<li class="bg-keyset">
						<span></span>
					</li>
					<li @click="funKey(0)">
						<span>0</span>
					</li>
					<li class="bg-keyset" @click="delNum()">
						<span><img src="../assets/img/backspace.png"></span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: '输入支付密码'
		},
		otherTitle:{
			type: String,
			default: ''
		}
	},
	data() {
		return {
			number: [],
			numKeyset: [{ 'num': 1 }, { 'num': 2 }, { 'num': 3 }, { 'num': 4 }, { 'num': 5 }, { 'num': 6 }, { 'num': 7 }, { 'num': 8 }, { 'num': 9 }],
		}
	},
	methods: {
		funKey(num) {
			if (this.number.length < 5) {
				this.number.push(num);

			} else if (this.number.length == 5) {
				this.number.push(num);
				var number = this.number;
				var num = '';
				for (var i = 0; i < number.length; i++) {
					num += number[i];
				}
				this.$emit('changeNum', num)

				this.$emit('closePwd', this.number.join(''));
				this.number = [];
			}
		},
		//删除输入的支付密码
		delNum() {
			if (this.number.length > 0) {
				this.number.splice(this.number.length - 1, 1);
			}
		},
		close(e) {
			if(e.target.className=='model-close'){
				this.$emit('closePwd', this.number.join(''));
				this.number = [];
			}
			
		}
	}
}

</script>
<style scoped>
#keyboard-model {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100vh;
  z-index: 1999;
}
.numBoxs {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  height: 822px;
}
.close {
  position: absolute;
  top: 40px;
  right: 40px;
}
.close img {
  width: 70px;
}
.numBoxs h3 {
  font-size: 54px;
  color: #000000;
  padding: 40px;
}
.numList {
  margin-top: 10px;
  padding: 0 40px;
}
.numList ul {
}
.numList li {
  width: 68px;
  margin-right: 52px;
  float: left;
}
.numList li:last-child {
  margin-right: 0;
}
.numList p {
  color: #333333;
  font-size: 50px;
  text-align: center;
  width: 100%;
  height: 114px;
  overflow: hidden;
}
.numList b {
  display: block;
  width: 68px;
  height: 4px;
  background-color: #666;
}
.keyset {
  background-color: #d1d2d3;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.keyset ul {
  padding-left: 12px;
  min-height: 438px;
  padding-top: 17px;
}
.keyset li {
  background-color: #fff;
  border-radius: 5px;
  width: 234px;
  height: 94px;
  float: left;
  margin-right: 12px;
  
  margin-bottom: 17px;
  text-align: center;
}
.keyset li span {
  font-size: 45px;
  display: block;
  height: 94px;
  line-height: 94px;
}
.keyset li span:active{
	background-color: #eee;
}
.keyset .bg-keyset {
  background-color: transparent;
}
.keyset li img {
  width: 50px;
}
.title-red{
	color: #e50026 !important;
}
</style>
