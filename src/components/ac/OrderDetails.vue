<template>
	<div class="container">
		<Vheader name="查看订单"></Vheader>

		<div class="kao-list" @click="goGoods">
			<ul class="kao-list-cont">
				<li class="kao-item area-name">
					{{order.activityName}}
				</li>
				<li class="kao-item">
					{{order.activitySkuName}}
				</li>
				<li class="kao-item">
					{{order.activityStartTime | dateFormat}} - {{order.activityEndTime | dateFormat}}
				</li>
				<li class="kao-item">
					{{order.activityAreaName}} {{order.activityAddress}}
				</li>
			</ul>
		</div>

		<div class="kao-list">
			<ul class="kao-list-cont">
				<li class="kao-item area-name">
					报名信息
				</li>
				<li class="kao-item" v-for="(item, index) in order.resOrderItemList" :key="index">
					{{item.name}} :
					<span>{{item.result}}</span>
				</li>
			</ul>
		</div>

		<div class="kao-list" v-if="order.paymentMethod || order.paymentMethodName">
			<ul class="kao-list-cont">
				<li class="kao-item build area-name">
					{{order.paymentMethodName}}
				</li>
				<template v-for="item in order.resPaymentList">
					<li class="kao-item flex" v-if="item.voucherCategory == 3">
						<div class="kao-item-1 on">
							<van-icon name="card" />
						</div>
						<div class="kao-item-2">
							{{item.voucher}}
						</div>
						<div class="kao-item-3">
							<!-- ¥ {{item.price | moneyFormat}} -->
						</div>
						<div class="kao-item-4">
							支付成功
						</div>
					</li>
					<li class="kao-item flex" v-if="item.voucherCategory == 1">
						<div class="kao-item-1 on">
							<van-icon name="debit-pay" />
						</div>
						<div class="kao-item-2">
							{{item.voucher}}
						</div>
						<div class="kao-item-3">
							¥ {{item.price | moneyFormat}}
						</div>
						<div class="kao-item-4">
							支付成功
						</div>
					</li>
					<li class="kao-item flex" v-if="item.voucherCategory == 8">
						<div class="kao-item-1">
							<van-icon name="wechat" />
						</div>
						<div class="kao-item-2">
							微信
						</div>
						<div class="kao-item-3">
							¥ {{item.price | moneyFormat}}
						</div>
						<div class="kao-item-4">
							支付成功
						</div>
					</li>
				</template>
			</ul>
		</div>

		<div class="new-list">
			<ul>
				<li class="new-item">
					<label>订单金额</label>
					<div class="new-item-val on">
						<small>¥</small> {{order.orderAmount | moneyFormat}}
					</div>
				</li>
				<li class="new-item">
					<label>状态</label>
					<div class="new-item-val on">
						{{order.dataStatus | typeToStr}}
					</div>
				</li>
			</ul>
		</div>

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
				order: {},
				logObj: {},
				paymentList: [],
				resOrderLogList: []
			}
		},
		created() {
			this.getOrder()
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
			// 复制成功事件
			onCopy() {
				this.$toast('复制成功')
			},
			// 获取订单信息
			getOrder() {
				let vm = this;
				this.$http.get('/panda-activity-api/v1/getOrder/' + this.$route.params.id).then(function(response) {
						if(response.data.code == '1000') {
							vm.order = response.data.result;
							if(response.data.result.resOrderLogList && response.data.result.resOrderLogList.length > 0) {
								vm.resOrderLogList = response.data.result.resOrderLogList;
								vm.logObj = response.data.result.resOrderLogList[0]
							}
							if(response.data.result.resPaymentList && response.data.result.resPaymentList.length > 0) {
								vm.paymentList = response.data.result.resPaymentList
							}
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 返回上一页
			goBack() {
				this.$router.back(-1);
			},
			// 去支付
			goPay() {
				this.$router.push('/ac/orderPay/' + this.$route.params.id)
			},
			// 查看活动
			goGoods() {
				this.$router.push('/ac/enrollDetail/' + this.order.activityId)
			},
			// 删除订单
			delOrder() {
				let vm = this;
				this.$http.get('/panda-shop-api/wap/delOrder/' + this.order.id).then(function(response) {
						if(response.data.code == '1000') {
							vm.goBack()
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 取消订单
			cancelOrder() {
				let vm = this;
				this.$http.get('/panda-shop-api/wap/cancelOrder/' + this.order.id).then(function(response) {
						if(response.data.code == '1000') {
							vm.goBack()
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
		},
		filters: {
			// 时间格式化
			dateFormat(shijianchuo) {
				function add0(m) {
					return m < 10 ? '0' + m : m
				}
				var time = new Date(shijianchuo * 1000);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
			},
			// 状态转字符串
			typeToStr(value) {
				if(value == 1) {
					return '待付款'
				} else if(value == 3) {
					return '已报名'
				} else if(value == 4) {
					return '已取消'
				} else if(value == 5) {
					return '已失败'
				} else {
					return ''
				}
			},
			// 支付状态转字符串
			payToStr(value) {
				if(value == 1) {
					return '待支付'
				} else if(value == 2) {
					return '已支付'
				} else if(value == 3) {
					return '部分支付'
				} else if(value == 4) {
					return '已退款'
				} else if(value == 5) {
					return '部分退款'
				} else {
					return ''
				}
			},
			// 支付类型转字符串
			paymentMethodStr(value) {
				// 状态（1：中影现金卡支付；2：中影次卡支付；3：微信支付；4：中影现金卡微信补差支付；5：中影次卡微信补差支付；）
				if(value == 1) {
					return '现金卡支付'
				} else if(value == 2) {
					return '次卡支付'
				} else if(value == 3) {
					return '微信支付'
				} else if(value == 4) {
					return '现金卡微信补差支付'
				} else if(value == 5) {
					return '次卡微信补差支付'
				} else {
					return ''
				}
			},
			// 金钱格式化
			moneyFormat(value) {
				if(value) {
					return(value / 100).toFixed(2)
				} else if(value === 0) {
					return 0
				} else {
					return ''
				}
			},
		}
	}
</script>

<style scoped>
	.container {
		background-color: #f8f8f8;
		padding-top: 84px;
	}
	
	.top img {
		display: block;
		width: 100%;
	}
	
	header {
		height: 85px;
		line-height: 85px;
		/* position: absolute; */
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		background-color: #fff;
		color: #4d4d4d;
		z-index: 20;
		text-align: center;
		display: flex;
		font-size: 28px;
		z-index: 101;
	}
	
	.header-back {
		width: 70px;
		text-align: center;
	}
	
	.header-cont {
		flex: 10;
	}
	
	.header-more {
		width: 75px;
		text-align: center;
	}
	
	header .iconfont {
		font-size: 28px;
	}
	
	.list {
		margin-top: 20px;
		border-bottom: 1px solid #eee;
	}
	
	.item {
		border-top: 1px solid #eee;
		padding: 20px;
		line-height: 38px;
		font-size: 24px;
		display: flex;
		background-color: #fff;
	}
	
	.goods-cont .goods-item:first-child {
		border-top: none;
	}
	
	.goods-list-name {
		padding: 20px 20px 20px 20px;
		font-size: 28px;
	}
	
	.item-left {
		flex: 10;
	}
	
	.right {
		float: right;
	}
	
	.goods-list {
		background-color: #fff;
		margin-top: 20px;
	}
	
	.goods-item {
		border-top: 1px solid #eee;
		display: flex;
		position: relative;
		padding: 0px 20px 20px 20px;
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
		color: #c06;
	}
	
	.goods-item-img {
		width: 50%;
	}
	
	.goods-item-img .img {
		display: block;
		height: 150px;
		width: 100%;
		overflow: hidden;
		border-radius: 5px;
	}
	
	.goods-item-img .img img {
		display: block;
		height: 100%;
		width: 100%;
	}
	
	.goods-item-info {
		width: 600px;
		/* flex: 10; */
		padding-left: 20px;
		font-size: 24px;
		line-height: 38px;
		overflow: hidden;
	}
	
	.goods-item-info h4 {
		margin-bottom: 10px;
	}
	
	.goods-bottom {
		padding: 10px 20px;
		line-height: 54px;
		border-top: 1px solid #eee;
		text-align: right;
	}
	
	.goods-bottom span {
		text-align: center;
		display: inline-block;
		padding: 0 20px;
		border: 1px solid #eee;
		border-radius: 6px;
		margin-left: 10px;
	}
	
	.goods-bottom .red {
		color: #ff4403;
		border-color: #ff4403;
	}
	
	.goods-bottom .blue {
		color: #00b202;
		border-color: #00b202;
	}
	
	.area-name {
		font-size: 28px;
		font-weight: 700;
	}
	
	.build {
		font-weight: 700;
	}
	
	.kao-list {
		display: flex;
		font-size: 24px;
		line-height: 38px;
		width: 100%;
		background-color: #fff;
		padding: 20px 20px 20px 20px;
		position: relative;
		box-sizing: border-box;
		margin-top: 20px;
	}
	
	.kao-item {
		padding: 6px 0;
	}
	
	.kao-list-logo {
		width: 50px;
		padding-top: 6px;
	}
	
	.kao-list-logo .iconfont {
		font-size: 28px;
		line-height: 38px;
		font-weight: 700;
	}
	
	.kao-more {
		display: flex;
		justify-content: center;
		align-items: Center;
	}
	
	.kao-more .iconfont {
		font-size: 28px;
	}
	
	.kao-list-cont {
		flex: 8;
	}
	
	.new-list {
		padding: 20px;
		background-color: #fff;
		font-size: 24px;
		line-height: 28px;
		line-height: 38px;
		margin-top: 20px;
	}
	
	.new-item {
		display: flex;
		padding: 6px 0;
	}
	
	.new-item label {
		flex: 10;
		font-weight: 700;
	}
	
	.new-item-val {}
	
	.flex {
		display: flex;
	}
	
	.kao-item-1 {
		width: 50px;
		padding-top: 2px;
		line-height: 38px;
		height: 38px;
		overflow: hidden;
		box-sizing: border-box;
	}
	
	.kao-item-2 {
		width: 320px;
	}
	
	.kao-item-3 {
		width: 120px;
	}
	
	.kao-item-4 {}
	/* .label-justify label{
  display: inline-block;
  width: 130px;
  text-align: justify;
}
.label-justify label:after {
  display: inline-block;
  width: 100%;
  content: '';
} */
	
	.nn-list {
		padding: 20px;
		margin-top: 20px;
		background-color: #fff;
	}
	
	.nn-item {
		display: flex;
		padding: 6px;
		font-size: 24px;
		line-height: 38px;
		height: 38px;
		overflow: hidden;
	}
	
	.nn-item label {
		width: 100px;
		text-align: justify;
		font-weight: 700;
	}
	
	.nn-item label:after {
		display: inline-block;
		width: 100%;
		content: '';
	}
	
	.nn-item>span {
		font-weight: 700;
	}
	
	.nn-item-cont {
		max-width: 550px;
	}
	
	.nn-item-btns {
		padding-left: 30px;
		font-size: 24px;
		font-weight: 700;
	}
	
	.nn-item-btns button {
		display: inline-block;
		padding: 0 20px;
		border: 1px solid #eee;
		outline: none;
		list-style: none;
		line-height: 38px;
		background-color: #fff;
		border-radius: 19px;
		font-size: 20px;
	}
</style>

<style>
	.van-icon-alipay {
		color: #00bbee;
	}
	
	.van-icon-wechat {
		color: #609700;
	}
	
	.van-icon-card {
		color: #c06;
	}
	
	.van-icon-debit-pay {
		color: #c06;
	}
	
	.van-cell__right-icon {
		font-size: 14px;
	}
	
	.van-icon-checked {
		color: #c06;
	}
</style>