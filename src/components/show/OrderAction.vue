<template>
	<div class="container catr-cont">
		<Vheader name="订单"></Vheader>
		<!-- 地址开始 -->
		<div class="address" @click="goAdderssList">
			<div class="address-un" v-show="! adderss.id">
				<i class="iconfont on">&#xe639;</i> 选择收货地址
			</div>
			<div class="address-on" v-show="adderss.id">
				<div class="address-on-left">
					<p>
						<strong>{{adderss.consignee}}</strong>
						<span>{{adderss.phone}}</span>
					</p>
					<p>{{adderss.province}} {{adderss.city}} {{adderss.area}} {{adderss.address}}</p>
				</div>
				<div class="address-on-right" v-show="adderss.isDefault == 1">
					<div class="address-on-btn">默认</div>
				</div>
			</div>
			<figure class="address-line">
				<img src="@/assets/line.png" alt="">
			</figure>
		</div>
		<!-- 地址结束 -->

		<!-- 商品列表开始 -->
		<div class="goods-list">
			<ul class="goods-cont">
				<li class="goods-item">
					<div class="goods-item-img">
						<figure class="img">
							<img :src="order.goodsPoster" alt="">
						</figure>
					</div>
					<div class="goods-item-info">
						<h4>{{order.goodsName}}</h4>
						<div class="goods-item-info-spec">
							{{order.venueName}} -- {{order.planName}}
						</div>
						<div class="goods-item-info-cont">
							<div class="on goods-item-info-cont-left priceSpan" v-html="moneyFormat(order.price)">
							</div>
							<div class="goods-item-info-cont-btn">
								x {{order.quantity}}
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<div class="supplement">
			<van-cell-group>
				<van-cell title="商品金额" :value="order.price | moneyFormat" />
			</van-cell-group>
			<van-cell-group>
				<van-cell title="运费" v-if="order.deliverType == '1'" :value="order.freight | moneyFormat" />
			</van-cell-group>
		</div>

		<!-- 购物车控制开始 -->
		<div class="fix-bar">
			<div class="fix-bar-left">
				<div class="fix-bar-info">
					<div class="fix-bar-info-maney">
						<em class="on">¥ <span class="priceSpan" v-html="moneyFormat(order.price + order.freight)"></span></em>
					</div>
				</div>
			</div>
			<div class="fix-bar-right" @click="goNext">
				结算 <small>({{order.quantity}}张)</small>
			</div>
		</div>
		<!-- 购物车控制结束 -->

	</div>
</template>

<script>
	import Vheader from '../HeaderV'
	export default {
		components: {
			Vheader
		},
		data() {
			return {
				order: {}, // 演出订单

				value: '', // 留言
				// 弹出层
				popup: false,
				// 地址
				adderss: {},
			}
		},
		created() {
			// 设置订单
			var showOrder = this.$cookies.get('showOrder');
			if(showOrder) {
				this.order = JSON.parse(showOrder);
			} else {
				this.$router.push('/show/home')
			}

			this.getAddress();
		},
		methods: {
			moneyFormat(value) {
				if(value) {
					var moneyValue = (value / 100).toFixed(2).split('.');

					return '<big>' + moneyValue[0] + '</big>.' + moneyValue[1]
				} else if(value === 0) {
					return '0'
				} else {
					return ''
				}
			},
			// 结算
			goNext() {
				let vm = this
				let postData = vm.order;

				if(!this.adderss.id) {
					this.$toast('请选择地址')
					return false;
				}
				postData.receiverId = vm.adderss.id;

				this.$http.post('/panda-ticket-api/v1/createOrder', postData).then(function(response) {
						if(response.data.code == '1000') {
							vm.$router.push('/show/orderPay/' + response.data.result)
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 选择地址
			goAdderssList() {
				this.$router.push('/show/addressList')
			},
			// 获取地址信息
			getAddress() {
				let vm = this;
				if(this.$init.showCheckAddress) {
					this.adderss = this.$init.showCheckAddress.more;
				} else if(this.$init.showDefaultAdderss) {
					this.adderss = this.$init.showDefaultAdderss;
				} else if(window.sessionStorage.getItem('showDefaultAdderss')) {
					this.adderss = JSON.parse(window.sessionStorage.getItem('showDefaultAdderss'))
				}
				console.log(this.adderss)
			},
			// 返回上一页
			goBack() {
				this.$router.back(-1);
			},
		},
		filters: {
			// 金钱格式化
			moneyFormat(value) {
				if(value) {
					return((value - 0) / 100).toFixed(2)
				} else if(value === 0) {
					return 0
				} else {
					return ''
				}
			}
		}
	}
</script>

<style scoped>
	.catr-cont {
		padding-bottom: 102px;
		background-color: #f8f8f8;
		padding-top: 84px;
	}
	
	header {
		width: 100%;
		font-size: 28px;
		color: #4d4d4d;
		line-height: 84px;
		text-align: center;
		border-bottom: 1px solid #dfdfdf;
		background-color: #fff;
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
	}
	/* 购物车控制条 */
	
	.fix-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100px;
		width: 100%;
		background-color: #fff;
		display: flex;
		font-size: 28px;
		border-top: 1px solid #dfdfdf;
	}
	
	.fix-bar-right {
		height: 100%;
		line-height: 100px;
		color: #fff;
		background-color: #ff5162;
		text-align: center;
		width: 220px;
		font-weight: 700;
		font-size: 32px;
	}
	
	.fix-bar-right small {
		font-size: 20px;
		font-weight: 500;
	}
	
	.fix-bar-left {
		flex: 10;
		display: flex;
	}
	
	.fix-bar-choice {
		width: 100px;
		text-align: center;
		height: 100px;
		line-height: 60px;
	}
	
	.fix-bar-choice-title {
		line-height: 30px;
		font-size: 22px;
	}
	
	.fix-bar-info {
		flex: 10;
		line-height: 100px;
	}
	
	.fix-bar-info-maney {
		padding-right: 20px;
		padding-left: 20px;
		font-size: 32px;
		font-weight: 700;
	}
	
	.fix-bar-info-maney .on {
		font-weight: 700;
	}
	/* 商品列表 */
	
	.goods-list {
		margin-bottom: 20px;
		background-color: #fff;
	}
	
	.business-name {
		line-height: 44px;
		padding: 20px 20px 20px 90px;
		position: relative;
		font-size: 32px;
		font-weight: 700;
	}
	
	.business-name-choice {
		position: absolute;
		left: 20px;
		top: 17px;
	}
	
	.business-name .iconfont {
		font-size: 32px;
	}
	
	.goods-item {
		border-top: 1px solid #dfdfdf;
		display: flex;
		position: relative;
		padding: 20px 20px 20px 20px;
	}
	
	.goods-item-choice {
		position: absolute;
		height: 100%;
		top: 0;
		left: 0;
		width: 90px;
		box-sizing: border-box;
		padding: 0 20px;
		padding-top: 75px;
		color: #999;
	}
	
	.goods-item-choice .van-icon {
		font-size: 20px;
	}
	
	.goods-item-choice .van-icon.van-icon-checked {
		color: #ff5162;
	}
	
	.goods-item-img .img {
		display: block;
		height: 150px;
		width: 150px;
	}
	
	.goods-item-img .img img {
		display: block;
		height: 100%;
		width: 100%;
	}
	
	.goods-item-info {
		flex: 10;
		padding-left: 20px;
	}
	
	.goods-item-info h4 {
		color: #4d4d4d;
		font-size: 24px;
		line-height: 45px;
	}
	
	.goods-item-info-spec {
		color: #818181;
		font-size: 24px;
		line-height: 45px;
	}
	
	.goods-item-info-cont {
		display: flex;
	}
	
	.goods-item-info-cont-left {
		flex: 8;
		line-height: 60px;
		font-size: 28px;
	}
	
	.goods-item-info-cont-btn {
		display: flex;
		border-radius: 8px;
		overflow: hidden;
		line-height: 60px;
		font-size: 28px;
	}
	
	.goods-item-info-cont-btn .btn {
		height: 60px;
		/* line-height: 50px; */
		width: 60px;
		text-align: center;
		font-size: 32px;
		background-color: #f7f7f7;
	}
	
	.goods-item-info-cont-btn .iconfont {
		font-size: 28px;
		line-height: 60px;
	}
	
	.goods-item-info-cont-btn-info {
		line-height: 60px;
		width: 90px;
		text-align: center;
		font-size: 28px;
		margin: 0 2px;
		background-color: #f7f7f7;
	}
	/* 地址选择 */
	
	.address {
		margin-bottom: 20px;
	}
	
	.address-line {
		display: block;
		width: 100%;
	}
	
	.address-line img {
		display: block;
		width: 100%;
	}
	
	.address-un {
		height: 120px;
		box-sizing: border-box;
		background-color: #fff;
		text-align: center;
		font-size: 28px;
		line-height: 120px;
	}
	
	.address-un .iconfont {
		font-size: 28px;
	}
	
	.address-on {
		padding: 20px;
		box-sizing: border-box;
		background-color: #fff;
		font-size: 24px;
		color: #818181;
		line-height: 48px;
		display: flex;
	}
	
	.address-on strong {
		font-size: 28px;
		color: #4d4d4d;
	}
	
	.address-on-left {
		flex: 10;
	}
	
	.address-on-right {
		padding-top: 18px;
	}
	
	.address-on-btn {
		height: 60px;
		line-height: 60px;
		border-radius: 4px;
		width: 100px;
		color: #fff;
		text-align: center;
		background-color: #ff9900;
	}
	
	.supplement {
		margin-bottom: 20px;
	}
</style>

<style>
	.van-radio .van-icon-checked {
		color: #ff5162;
	}
	
	.van-field__control {
		font-size: 14px;
	}
	
	.choice-cont .van-cell__title {
		flex: 2;
	}
	
	.supplement .van-cell__value {
		flex: 2;
	}
</style>