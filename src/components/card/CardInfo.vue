<template>
	<div class="container address-list">
		<Vheader name="卡券详情"></Vheader>

		<div class="card">

			<ul class="card-list">
				<li class="card-item">
					<div class="card-item-top">
						<p>卡号: {{info.voucher}}</p>
						<p>类型: {{info.payTypeName}}</p>
						<p>有效期: {{info.expDate}}
							<span class="btn" v-if="actionType == 'del'" @click="delUserVoucher">删除卡券</span>
							<span class="btn" v-if="actionType == 'binding'" @click="saveUserVoucher">绑定卡券</span>
							<span class="btn" v-if="actionType == 'recharge'" @click="goPath('/card/flow/'+info.voucher)">流水</span>
							<span class="btn" v-if="actionType == 'recharge'" @click="goPath('/card/rechargeMoney/'+info.voucher)">充值</span>
						</p>
					</div>
					<div class="card-item-bottom">余额: {{info.balance}}</div>
					<div class="card-item-left"></div>
					<div class="card-item-right"></div>
				</li>
			</ul>
			<ul class="card-operation">
				<!--<li @click="goPath('/card/CardRechargeMoney', 'voucher')">卡劵充值<img :src="imgInto" style="width: 16px;height: 16px;"/></li>-->
				<li @click="goPath('/card/CardSpend', 'voucher')">消费明细<img :src="imgInto" style="width: 14px;height: 14px;margin-top: 3px;"/></li>
				<li @click="goPath('/card/help')">帮助指南<img :src="imgInto" style="width: 14px;height: 14px;margin-top: 3px;"/></li>
				<li @click="goPath('/card/CardEditPW', 'voucher')">修改密码<img :src="imgInto" style="width: 14px;height: 14px;margin-top: 3px;"/></li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Vheader from '../HeaderV'
	export default {
		name: 'CardQuery',
		components: {
			Vheader
		},
		data() {
			return {
				imgInto: require('../../assets/card/jiantou.png'),
				info: {},
				actionType: this.$route.query.actionType
			}
		},
		created() {
			if (!this.$init.nowCard) {
				this.$init.nowCard = JSON.parse(window.sessionStorage.getItem('nowCard'));
			}
			this.getInfo();
		},
		methods: {
			// 跳转
			goPath(path, key) {
				if(key){
					path = path + '?' + key + '=' + this.info[key];
				}
				this.$router.push(path);
			},
			// 获取卡券详情
			getInfo() {
				let vm = this;
				this.$http.get('/panda-payment-api/v1/getUserVoucher/' + this.$init.nowCard.id).then(function(response) {
						if (response.data.code == '1000') {
							vm.info = response.data.result;
							vm.$init.cardRecharge = response.data.result;
							window.sessionStorage.setItem('cardRecharge', JSON.stringify(vm.$init.cardRecharge));
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('网络错误')
					});
			},
			// 绑定卡券
			saveUserVoucher() {
				let vm = this;
				let postData = {
					"voucher": this.$init.nowCard.voucher,
					"voucherPassword": this.$init.nowCard.voucherPassword
				}
				this.$http.post('/panda-payment-api/wap/saveUserVoucher', postData).then(function(response) {
						if (response.data.code == '1000') {
							vm.$toast('绑定成功');
							vm.goBack()
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('网络错误')
					});
			},
			// 返回上一页
			goBack() {
				this.$router.back(-1);
			},
			// 删除卡券
			delUserVoucher() {
				let vm = this;
				this.$http.get('/panda-payment-api/v1/delUserVoucher/' + this.$init.nowCard.id).then(function(response) {
						if (response.data.code == '1000') {
							vm.$toast('删除成功');
							vm.goBack()
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('网络错误')
					});
			},
		}
	}
</script>

<style scoped>
	/* 头 */
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

	.address-list {
		padding-top: 84px;
		background-color: #f8f8f8;
	}

	.class-back {
		position: absolute;
		width: 80px;
		height: 80px;
		line-height: 92px;
		top: 0;
		left: 0;
		text-align: center;
		font-size: 28px;
		color: #fff;
	}

	.card-add {
		background-color: #fff;
		border-bottom: 1px solid #dfdfdf;
		border-top: 1px solid #dfdfdf;
		padding: 0 35px;
	}

	.card-add span {
		color: #bababa;
		font-size: 28px;
		line-height: 76px;
	}

	.card {
		padding: 35px;
	}

	.card-item {
		position: relative;
		border-radius: 8px;
		overflow: hidden;
		color: #fff;
		font-size: 24px;
		background: #ff5162;
		/* For browsers that do not support gradients */
		background: -webkit-linear-gradient(left top, #5fa0f9, #ff5162);
		/* For Safari 5.1 to 6.0 */
		background: -o-linear-gradient(bottom right, #5fa0f9, #ff5162);
		/* For Opera 11.1 to 12.0 */
		background: -moz-linear-gradient(bottom right, #5fa0f9, #ff5162);
		/* For Firefox 3.6 to 15 */
		background: linear-gradient(to bottom right, #5fa0f9, #ff5162);
		/* Standard syntax */
	}

	.card-item-top {
		color: #fff;
		padding: 30px 35px;
	}

	.card-item-top p {
		padding: 12px;
		line-height: 54px;
	}

	.card-item-bottom {
		height: 90px;
		line-height: 90px;
		padding: 0 35px;
		border-top: 1px dashed #ffffff;
	}

	.card-item-left,
	.card-item-right {
		height: 30px;
		width: 30px;
		position: absolute;
		bottom: 75px;
		border-radius: 50%;
		background-color: #f8f8f8;
	}

	.card-item-left {
		left: -15px;
	}

	.card-item-right {
		right: -15px;
	}

	.btn {
		display: block;
		float: right;
		width: 150px;
		height: 50px;
		line-height: 50px;
		border-radius: 25px;
		text-align: center;
		border: 1px solid #ffffff;
	}
	.card-operation{
		border-radius: 10px;
		margin-top: 40px;
		padding: 10px 30px;
		background-color: #FFFFFF;
	}
	.card-operation li{
		padding: 30px 0px;
		color: #797979;
	}
	.card-operation li:not(:last-child){
		border-bottom: 3px solid #F6F6F6;
	}
	.card-operation li img{
		float: right;
	}
</style>
