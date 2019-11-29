<template>
	<div class="container order-pay">

		<Vheader name="支付"></Vheader>

		<!-- 支付提示开始 -->
		<div class="pay-tips">
			<van-icon name="underway" /> 支付剩余时间: {{timer}}
		</div>
		<!-- 支付提示结束 -->

		<!-- 订单简介开始 -->
		<ul class="order-list">
			<li class="order-item">
				<div class="order-item-left">订单商品:</div>
				<div class="order-item-right">商品 {{order.quantity}} 件</div>
			</li>
			<li class="order-item">
				<div class="order-item-left">订单总额:</div>
				<div class="order-item-right">
					<span class="on">
            <em class="on">
              <small>¥</small> 
              <span class="priceSpan" v-html="moneyFormat(order.orderAmount)"></span>
            </em>
          </span>
				</div>
			</li>
		</ul>
		<!-- 订单简介结束 -->
		<!-- 选择支付方式开始 -->
		<div class="ticket-cont">
			<h3>选择支付方式</h3>
			<van-cell-group>
				<template v-for="item in listPayChannel">
					<!-- <van-cell v-if="item.payChannelCategory == 3" @click="goOnceCard(item)" :title="item.name" :value="checkPayCard.payChannel == item.id ? '抵扣:'+ deductible : ''" icon="card" is-link />
            <van-cell v-if="item.payChannelCategory == 1" @click="goCashCard(item)" :title="item.name" :value="checkPayCard.payChannel == item.id ? '抵扣:'+ deductible : ''" icon="debit-pay" is-link /> -->

					<div class="van-cell van-hairline" v-if="item.payChannelCategory == 3" @click="goOnceCard(item)">
						<figure class="van-yinlian-logo">
							<img src="@/assets/icon/2.png">
						</figure>
						<div class="van-cell__title">{{item.name}}</div>
						<div v-show="checkPayCard.payChannel == item.id">抵扣: {{deductible}}</div>
						<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
					</div>
					<div class="van-cell van-hairline" v-if="item.payChannelCategory == 1" @click="goCashCard(item)">
						<figure class="van-yinlian-logo">
							<img src="@/assets/icon/1.png">
						</figure>
						<div class="van-cell__title">{{item.name}}</div>
						<div v-show="checkPayCard.payChannel == item.id">抵扣: {{deductible}}</div>
						<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
					</div>
					<van-cell v-if="item.payChannelCategory == 8" :title="item.name" icon="wechat" @click="checkPayChannel = item.id">
						<van-icon slot="right-icon" name="checked" class="van-cell__right-icon" v-show="checkPayChannel == item.id" />
						<van-icon slot="right-icon" name="check" class="van-cell__right-icon" v-show="checkPayChannel != item.id" />
					</van-cell>
				</template>

			</van-cell-group>
		</div>
		<!-- 选择支付方式结束 -->

		<!-- 购物车控制开始 -->
		<div class="fix-bar">
			<div class="fix-bar-left">
				<div class="fix-bar-info">
					<div class="fix-bar-info-maney">
						需付款 <em class="on"><small>¥</small> {{toBePaid}}</em>
					</div>
				</div>
			</div>
			<div class="fix-bar-right" @click="goWechat" v-if=" toBePaid > 0 && payChannel.indexOf(8) >= 0 && (! $route.query.wechat)" v-show="timer != '00:00'">
				获取微信授权
			</div>
			<div class="fix-bar-right" @click="payOk" v-if="(toBePaid == 0 || payChannel.indexOf(8) < 0 || $route.query.wechat)" v-show="timer != '00:00'">
				确认支付
			</div>
		</div>
		<!-- 购物车控制结束 -->

	</div>
</template>

<script>
	import Vheader from '../HeaderV'
	export default {
		name: 'OrderPayCheck',
		components: {
			Vheader
		},
		data() {
			return {
				order: {}, // 订单
				ticket: {

				},
				seats: [], // 座位
				timer: '00:00', // 倒计时时间
				listPayChannel: [], // 支付渠道列表
				checkPayCard: {
					money: 0
				}, // 选中的卡券

				payChannelObj: {}, // 支付对象
				payChannel: [], // 支付类型集合
				checkPayChannel: '', // 选中补差支付方式 id
				// 支付类型判断
				paymentMethodList: [{
					// 现金卡支付
					channel: '1',
					str: '1'
				}, {
					// 次卡支付
					channel: '3',
					str: '2'
				}, {
					// 微信支付
					channel: '8',
					str: '3'
				}, {
					// 现金卡微信补差支付
					channel: '1,8',
					str: '4'
				}, {
					// 次卡微信补差支付
					channel: '3,8',
					str: '5'
				}],
				deductible: 0, // 抵扣金额(元)
				toBePaid: 0, // 待支付金额(元)
				wxData: {}, // 微信支付信息
				wechatOk: this.$route.query.wechat ? true : false
			}
		},
		created() {
			// 获取选中卡券信息
			if(this.$cookies.get('checkPayCard')) {
				let checkPayCard = JSON.parse(this.$cookies.get('checkPayCard'));
				if(checkPayCard.order == this.$route.params.id) {
					this.checkPayCard = checkPayCard;
				}
			}
			// console.log(this.checkPayCard)

			this.getOrder();
			this.getListPayChannel();
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
			// 计算金额
			amountCalculation() {
				if(this.checkPayCard.money) {
					this.deductible = (this.checkPayCard.money / 100).toFixed(2)
					this.toBePaid = ((this.order.orderAmount - this.checkPayCard.money) / 100).toFixed(2);
				} else {
					this.deductible = 0;
					this.toBePaid = (this.order.orderAmount / 100).toFixed(2);
				}
			},
			// 支付
			payOk() {
				let vm = this;

				let paymentMethod = ''; // 支付类型

				let nextStater = true;

				// 验证微信补差
				if(vm.payChannel.indexOf(8) >= 0 && (vm.checkPayCard.money - 0) < (vm.order.orderAmount - 0)) {
					if(!vm.$route.query.wechat) {
						nextStater = false;
						vm.goWechat()
						return;
					}
					if(!vm.checkPayCard.order) {
						// 单一微信支付
						vm.paymentMethodList.forEach((e, i) => {
							if(e.channel == '8') {
								paymentMethod = e.str;
							}
						})
					} else {
						// 微信补差支付
						vm.paymentMethodList.forEach((e, i) => {
							if(e.channel.indexOf(vm.checkPayCard.payType + '') >= 0 && e.channel.indexOf('8') >= 0) {
								paymentMethod = e.str;
							}
						})
					}
				} else {
					// 不补差情况
					if(!vm.checkPayCard.order) {
						vm.$toast('请选择支付方式')
						return;
					}
					// 支付类型赋值
					vm.paymentMethodList.forEach((e, i) => {
						if(e.channel == vm.checkPayCard.payType) {
							paymentMethod = e.str;
						}
					})
				}

				// 下一步
				if(!nextStater) {
					return
				}
				// 乘法函数
				function numMulti(num1, num2) {
					var baseNum = 0;
					try {
						baseNum += num1.toString().split(".")[1].length;
					} catch(e) {}
					try {
						baseNum += num2.toString().split(".")[1].length;
					} catch(e) {}
					return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
				};

				// 上传参数
				let postData = {
					"paymentMethod": paymentMethod,
					"orderId": this.$route.params.id,
					"voucher": vm.checkPayCard.voucher ? vm.checkPayCard.voucher : '', // 卡号
					"wechatPayPrice": numMulti(Number(vm.toBePaid), 100)
				}
				this.$http.post('/panda-shop-api/v1/paymentOrder', postData).then(function(response) {
						if(response.data.code == '1000') {
							if(response.data.result) {
								vm.wxData = response.data.result;
								vm.wxPlay()
							} else {
								vm.$router.push('/success')
							}
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});

				// if(! this.checkPayCard.order){
				//   vm.$toast('请选择支付方式')
				//   return;
				// }
				// if(this.checkPayCard.payType == 3){
				//   let postData = {
				//     "paymentMethod":"time_card_pay",
				//     "orderId": this.$route.params.id, 
				//     "voucher": this.checkPayCard.voucher
				//   }
				//   this.$http.post('/panda-shop-api/wap/payment', postData).then(function (response) {
				//     if(response.data.code == '1000'){
				//       vm.$router.push('/success')
				//     }else{
				//       vm.$toast(response.data.msg)
				//     }
				//   })
				//   .catch(function (error) {
				//     vm.$toast('请求超时，请稍后再试！')
				//   });
				// }else if(this.checkPayCard.payType == 1){
				//   let postData = {
				//     "paymentMethod": "cash_card_pay",
				//     "orderId": this.$route.params.id, 
				//     "voucher": this.checkPayCard.voucher + '_' + this.order.orderAmount
				//   }
				//   this.$http.post('/panda-shop-api/wap/payment', postData).then(function (response) {
				//     if(response.data.code == '1000'){
				//       vm.$router.push('/success')
				//     }else{
				//       vm.$toast(response.data.msg)
				//     }
				//   })
				//   .catch(function (error) {
				//     vm.$toast('请求超时，请稍后再试！')
				//   });
				// }
			},
			// 次卡支付
			goOnceCard(payChannel) {
				this.$cookies.set('payChannel', JSON.stringify({
					id: payChannel.id,
					params: payChannel.params
				}))
				this.$router.push({
					path: '/orderPayOnceCard/' + this.$route.params.id,
					query: {
						payChannel: payChannel.id,
						money: this.order.orderAmount,
						nums: this.order.quantity,
						full: this.payChannel.indexOf(8) >= 0 ? 1 : 0
					}
				})
			},
			// 现金卡支付
			goCashCard(payChannel) {
				this.$cookies.set('payChannel', JSON.stringify({
					id: payChannel.id,
					params: payChannel.params
				}))
				// this.$router.push('/orderPayCashCard/' + this.$route.params.id)
				this.$router.push({
					path: '/orderPayCashCard/' + this.$route.params.id,
					query: {
						payChannel: payChannel.id,
						money: this.order.orderAmount,
						full: this.payChannel.indexOf(8) >= 0 ? 1 : 0
					}
				})
			},
			// 获取微信授权
			goWechat() {
				let urlStr = window.location.href;
				let backUrl = encodeURIComponent(urlStr + '?wechat=true');
				let nowToken = this.$init.accessToken;
				this.$cookies.set('payBackData', JSON.stringify({
					user: this.$init.user,
					accessToken: this.$init.accessToken,
					refreshToken: this.$init.refreshToken
				}))

				// 获取权限链接
				window.location.href = this.$init.ip + '/panda-payment-api/wap/wechat/authorize?accessToken=' + nowToken + '&state=' + backUrl;
			},
			wxPlay() {
				let vm = this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": vm.wxData.appId, //公众号名称，由商户传入     
						"timeStamp": vm.wxData.timeStamp, //时间戳，自1970年以来的秒数     
						"nonceStr": vm.wxData.nonceStr, //随机串     
						"package": vm.wxData.package,
						"signType": "MD5", //微信签名方式：     
						"paySign": vm.wxData.paySign //微信签名 
					},
					function(res) {
						if(res.err_msg == "get_brand_wcpay_request:ok") {
							vm.$router.push('/success')
						} else if(res.err_msg == "get_brand_wcpay_request:fail") {
							vm.$router.push('/fail')
						} else if(res.err_msg == "get_brand_wcpay_request:cancel") {
							vm.$router.push('/fail')
						}
					}
				);
			},
			// 返回上一页
			goBack() {
				this.$router.back(-1);
			},
			// 获取订单信息
			getOrder() {
				let vm = this;
				this.$http.get('/panda-shop-api/v2/getOrder/' + this.$route.params.id).then(function(response) {
						if(response.data.code == '1000') {
							vm.order = response.data.result;
							vm.resetTime(vm.order.overTime)
							vm.amountCalculation(); // 计算金额
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 获取支付渠道
			getListPayChannel() {
				let vm = this;
				this.$http.get('/panda-shop-api/v1/listPayChannel').then(function(response) {
						if(response.data.code == '1000') {
							vm.listPayChannel = response.data.result;
							if(response.data.result) {
								let payChannelObj = {};
								response.data.result.forEach((e, i) => {
									vm.payChannel.push(e.payChannelCategory);
									if(vm.checkPayChannel == '' && e.payChannelCategory == 8) {
										vm.checkPayChannel = e.id
									}
									payChannelObj['p' + e.payChannelCategory] = e;
								})
								vm.payChannelObj = payChannelObj;
							}
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 倒计时插件
			resetTime(time) {
				let vm = this;
				//获取当前时间
				var date = new Date();
				var now = date.getTime();
				//设置截止时间
				var end = time * 1000;
				if(end <= now) {
					return false;
				}
				//时间差
				var leftTime = end - now;
				var timer = null;
				// 倒计时函数
				function countDown() {
					leftTime -= 1000;
					//定义变量 d,h,m,s保存倒计时的时间
					var d, h, m, s;
					if(leftTime >= 0) {
						d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
						h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
						m = Math.floor(leftTime / 1000 / 60 % 60);
						s = Math.floor(leftTime / 1000 % 60);

						if(m < 10) {
							m = '0' + m
						}
						if(s < 10) {
							s = '0' + s
						}

						vm.timer = m + ":" + s;
					} else {
						vm.timer = "00:00";
						clearInterval(timer);
					}
				}

				timer = setInterval(countDown, 1000);
			},
		},
		filters: {
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
				return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
			}
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
		background-color: #ff5162;
		color: #fff;
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
	/* 支付提示 */
	
	.pay-tips {
		font-size: 24px;
		color: #fff;
		text-align: center;
		background-color: #f1cf64;
		line-height: 70px;
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
		border-top: 1px solid #eee;
	}
	
	.fix-bar-right {
		height: 100%;
		line-height: 100px;
		color: #fff;
		background-color: #ff5162;
		text-align: center;
		width: 280px;
		font-weight: 700;
		font-size: 28px;
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
		font-size: 24px;
		font-weight: 500;
	}
	
	.fix-bar-info-maney .on {
		font-weight: 700;
		font-size: 28px;
	}
	
	.ticket-cont h3 {
		font-size: 24px;
		line-height: 80px;
		padding: 0 20px;
		color: #999;
		background-color: #fff;
	}
	/* 订单信息 */
	
	.order-list {
		background-color: #fff;
		padding: 0 20px;
		margin-bottom: 20px;
	}
	
	.order-item {
		font-size: 24px;
		line-height: 70px;
		display: flex;
	}
	
	.order-item-left {
		text-align: left;
		color: #999;
		flex: 4;
	}
	
	.order-item-right {
		text-align: right;
		color: #000;
		flex: 6;
	}
	
	.van-yinlian-logo {
		height: 24px;
		box-sizing: border-box;
		padding: 3px 0;
		margin-right: 4px;
		width: 26px;
	}
	
	.van-yinlian-logo img {
		display: block;
		height: 100%;
		margin: 0 auto;
	}
</style>

<style>
	.van-popup--right {
		height: 100%;
		width: 100%;
		background-color: #fff;
	}
	
	.van-icon-alipay {
		color: #00bbee;
	}
	
	.van-icon-wechat {
		color: #609700;
	}
	
	.van-icon-card {
		color: #ff5162;
	}
	
	.van-icon-debit-pay {
		color: #ff5162;
	}
	
	.van-cell__right-icon {
		font-size: 14px;
	}
	
	.van-icon-checked {
		color: #ff5162;
	}
	
	.order-pay .van-icon-wechat {
		width: 26px;
		text-align: center;
	}
</style>