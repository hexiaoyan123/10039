<template>
	<div class="container" style="overflow: hidden;">
		<Vheader name="修改密码"></Vheader>
		<div class="EditPW" style="overflow: hidden;">
			<ul style="overflow: hidden;">
				<li class="card-item" style="overflow: hidden;">
					<input @blur="iptBlur" placeholder="请输入原密码" @focus="iptFocus" type="password" v-model="oldPassword" v-show="! showOldPassword">
					<input @blur="iptBlur" placeholder="请输入原密码" @focus="iptFocus" type="text" v-model="oldPassword" v-show="showOldPassword">
					<div class="card-item-ctrl">
					  <van-icon class="card-item-ctrl-password" v-show="! showOldPassword" name="password-not-view" @click="showOldPassword = true" />
					  <van-icon class="card-item-ctrl-password"  v-show="showOldPassword" name="password-view" @click="showOldPassword = false" />
					</div>
				</li>
				<li class="card-item" style="overflow: hidden;">
					<input @blur="iptBlur" placeholder="请输入新密码" @focus="iptFocus" type="password" v-model="newPassword1" v-show="! showNewPassword1">
					<input @blur="iptBlur" placeholder="请输入新密码" @focus="iptFocus" type="text" v-model="newPassword1" v-show="showNewPassword1">
					<div class="card-item-ctrl">
					  <van-icon class="card-item-ctrl-password" v-show="! showNewPassword1" name="password-not-view" @click="showNewPassword1 = true" />
					  <van-icon class="card-item-ctrl-password"  v-show="showNewPassword1" name="password-view" @click="showNewPassword1 = false" />
					</div>
				</li>
				<li class="card-item" style="overflow: hidden;">
					<input @blur="iptBlur" placeholder="请再次输入新密码" @focus="iptFocus" type="password" v-model="newPassword2" v-show="! showNewPassword2">
					<input @blur="iptBlur" placeholder="请再次输入新密码" @focus="iptFocus" type="text" v-model="newPassword2" v-show="showNewPassword2">
					<div class="card-item-ctrl">
					  <van-icon class="card-item-ctrl-password" v-show="! showNewPassword2" name="password-not-view" @click="showNewPassword2 = true" />
					  <van-icon class="card-item-ctrl-password"  v-show="showNewPassword2" name="password-view" @click="showNewPassword2 = false" />
					</div>
				</li>
			</ul>
			<div class="form-btn" @click="updatePwd">提交修改</div>
		</div>
	</div>
</template>

<script>
	import Vheader from '../HeaderV'
	export default {
		name: 'CardHelp',
		components: {
			Vheader
		},
		data() {
			return {
				showOldPassword: false,
				oldPassword: '',
				showNewPassword1: false,
				newPassword1: '',
				showNewPassword2: false,
				newPassword2: '',
				voucher: this.$route.query.voucher
			}
		},
		created(){
			this.initData();
		},
		methods: {
			 //focus
			iptFocus () {
			    this.errorMessage = '';
			    this.inFocus = true;
			},
			//blur
			iptBlur () {
			  let this_ = this;
			  this_.inFocus = false;
			  setTimeout(function () {
			    if(this_.inFocus == false){
			      // 当input 失焦时,滚动一下页面就可以使页面恢复正常
			      this_.checkWxScroll();
			    }
			  },200)
			},
			checkWxScroll(){
			  var ua = navigator.userAgent.toLowerCase();
			  var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			  if(ua.match(/MicroMessenger/i) == 'micromessenger'&&!!u){//在iphone 微信中
			    this.temporaryRepair();
			  }
			},
			temporaryRepair(){
			  var currentPosition,timer;
			  var speed=1;//页面滚动距离
			  timer=setInterval(function(){
			    currentPosition=document.documentElement.scrollTop || document.body.scrollTop;
			    currentPosition-=speed;
			    window.scrollTo(0,0);//页面向上滚动
			    clearInterval(timer);
			  },1);
			},
			updatePwd(){
				var reg = /^([A-Z]|[a-z]|[0-9]){6}$/;     
				if(!this.oldPassword){
					this.$toast('请输入原密码');
				} else if(!this.newPassword1){
					this.$toast('请输入新密码');
				} else if(!this.newPassword1.match(reg)){
					this.$toast('密码只能是字母或者数字组成，长度必须为6位');
				} else if(this.newPassword2 !== this.newPassword1){
					this.$toast('两次新密码输入不一致');
				} else{
					var oldPWD = window.btoa(this.oldPassword);
					var newPWD = window.btoa(this.newPassword1);
					this.$http.get('/panda-payment-api/v1/updateVoucherPassword/' + this.voucher + '/' + oldPWD + '/' + newPWD ).then((response) => {
							if (response.data.code == '1000') {
								this.$toast(response.data.msg);
								this.$router.push('/card/info?actionType=del')
							} else {
								this.$toast(response.data.msg);
							}
						})
						.catch(function(error) {
							this.$toast('网络错误')
						});
				}
			}
		}
	}
</script>
<style>

</style>
<style scoped>
	header {
		/* position: absolute; */
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		font-size: 28px;
		color: #fff;
		line-height: 84px;
		text-align: center;
		border-bottom: 1px solid #dfdfdf;
		background-color: #ff5162;
		z-index: 101;
	}

	.EditPW {
		padding-top: 84px;
	}
	.titleSpan {
		display: inline-block;
		position: relative;
		margin-left: 50px;
		margin-top: 18px;
		margin-bottom: 20px;
		font-size: 28px;
		color: #4D4D4D;
	}

	.titleSpan:before {
		content: " ";
		display: inline-block;
		position: absolute;
		top: 10%;
		height: 80%;
		width: 6px;
		left: -18px;
		background-color: #FF5162;
	}
	.EditPW ul li{
		border-bottom: 1px solid #F0F0F0;
	}
	/* 文本框 */
	.card-item{
	  display: flex;
	  font-size: 24px;
	  color: #818181;
	  line-height: 75px;
	  padding: 12px 20px;
	  border-bottom: 1px solid #eee;
	}
	.card-item input{
	  display: block;
	  height: 75px;
	  border: none;
	  font-size: 28px;
	  line-height: 75px;
	  outline: none;
	  flex: 10;
	  padding: 0 10px;
	  min-width: 10px;
	}
	.card-item-ctrl{
	  position: relative;
	}
	.card-code{
	  display: block;
	  height: 75px;
	  width: 160px;
	  border-radius: 6px;
	  margin-right: 70px;
	}
	.card-item-ctrl .iconfont{
	  position: absolute;
	  display: inline-block;
	  top: 0;
	  right: 0;
	  height: 75px;
	  line-height: 75px;
	  width: 70px;
	  text-align: center;
	  font-size: 48px;
	}
	.form-btn{
	  width: 600px;
	  margin: 0 auto;
	  line-height: 80px;
	  border-radius: 40px;
	  color: #fff;
	  font-size: 28px;
	  text-align: center;
	  background: -webkit-linear-gradient(left, #FF9B4A, #FF8102);
	  /* Safari 5.1 - 6.0 */
	  background: -o-linear-gradient(right, #FF9B4A, #FF8102);
	  /* Opera 11.1 - 12.0 */
	  background: -moz-linear-gradient(right, #FF9B4A, #FF8102);
	  /* Firefox 3.6 - 15 */
	  background: linear-gradient(to right, #FF9B4A, #FF8102);
	  margin-top: 60px;
	}
	.card-item-ctrl-password{
	  display: inline-block;
	  line-height: 75px;
	  width: 75px;
	  text-align: right;
	}
</style>
