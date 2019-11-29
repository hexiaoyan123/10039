<template>
	<div class="container">
		<Vheader name="查看订单"></Vheader>
		<div class="adress-content">
			<i><img src="@/assets/zuobiao.png" width="100%"/></i>
			<h4>收件人 : {{order.consignee}} <span>{{order.phone}}</span></h4>
			<label>收货地址 : {{order.address}}</label>
		</div>
		<div class="order-main">
			<div class="order-name"><span class="titleSpan">{{order.storeName}}</span></div>
			<div class="cartContent">
				<div class="crad-cont" v-if="order.dataStatus == 1 || order.dataStatus == 2 || order.dataStatus == 6 || order.dataStatus == 7" v-for="(item, index) in order.resOrderItemList" :key="index">
					<ul class="goods-cont">
						<li>
							<div class="goods-item">
								<div class="goods-item-img">
									<figure class="img">
										<img :src="item.imageUrl.split(',')[0] | imgSpecilize" alt="" @click.stop="goGoods(item)">
									</figure>
								</div>
								<div class="goods-item-info">
									<h4>{{item.name}}</h4>
									<div class="tags">
										<div class="tag" v-if="item.afterSale"><!--{{item.afterSale | afterSaleToStr}}-->  </div>
									</div>
									<span class="guige">{{item.specification}}<small> x </small>{{item.quantity}}</span>
									<div class="many-left">
										<small>￥</small><span class="priceSpan" v-html="moneyFormat(item.salesPrice)"></span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>

				<div class="crad-cont" v-if="order.dataStatus == 3 || order.dataStatus == 4 || order.dataStatus == 5" v-for="(item, index) in order.resOrderItemList" :key="index">
					<ul class="goods-cont">
						<li>
							<div class="goods-item">
								<div class="goods-item-img">
									<figure class="img">
										<img :src="item.imageUrl.split(',')[0] | imgSpecilize" alt="" @click.stop="goGoods(item)">
									</figure>
								</div>
								<div class="goods-item-info">
									<h4>{{item.name}}</h4>
									<div class="tags">
										<div class="tag" v-if="item.afterSale">{{item.afterSale | afterSaleToStr}}</div>
									</div>
									<span class="guige">{{item.specification}}<small> x </small>{{item.quantity}}</span>
									<div class="many-left">
										<small>￥</small><span class="priceSpan" v-html="moneyFormat(item.salesPrice)"></span>
									</div>
									<div class="goods-item-info-ab">
										<span v-show="order.dataStatus != 5 && ! item.logisticCode">待发货</span>
										<span v-show="order.dataStatus != 5 && item.logisticCode">已发货</span>
										<span v-show="order.dataStatus == 5 && item.reviewStatus == 2">已收货</span>
										<span v-show="order.dataStatus == 5 && item.reviewStatus == 1">已评价</span>
										<span v-show="order.dataStatus != 5 && item.logisticCode" class="btn" @click="goLogistics(item)">查看物流</span>
										<span v-show="order.dataStatus == 5 && item.reviewStatus == 2" class="btn" @click="goEV(item)">去评价</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="k-item" style="color: #969696!important">
					<label>商品金额</label>
					<div class="k-item-cont" style="color:#969696!important;">
						<small>￥ </small><span class="priceSpan" style="color:#969696!important;" v-html="moneyFormat(order.productPrice)"></span>
					</div>
				</div>
				<div class="k-item" style="color: #969696!important">
					<label>运费合计</label>
					<div class="k-item-cont" style="color:#969696!important;">
						<small>+ ￥ </small><span class="priceSpan" style="color:#969696!important;" v-html="moneyFormat(order.freight)"></span>
					</div>
				</div>
				<div class="line"></div>
				<div class="zongji">
					<span>共{{order.resOrderItemList.length}}件商品 &nbsp; &nbsp; &nbsp;</span>
					<span>小计 : </span>
					<span style="color:#ff5162;">
						<small>￥ </small><span class="priceSpan" v-html="moneyFormat(order.orderAmount)"></span>
					</span>
				</div>
				<div class="line"></div>
			</div>
			<div class="order-name"><span class="titleSpan">订单信息</span></div>
			<div class="orderContent">
				<div class="k-cont">
					<div class="k-over" v-show="order.dataStatus == 5">
						<img src="@/assets/over.png" alt="">
					</div>
					<div class="k-item">
						<label class="orderTitle">订单编号 : </label>
						<div class="k-item-cont">
							{{order.id}}
							<div class="copy">
								<i><img src="@/assets/copy.png" width="100%"/></i>
								<span v-clipboard:copy="order.id" v-clipboard:success="onCopy">复制</span>
							</div>
						</div>
					</div>
					<div class="k-item">
						<label class="orderTitle">订单时间 : </label>
						<div class="k-item-cont">
							{{order.createTime | dateFormat}}
						</div>
					</div>
					<div class="k-item">
						<label class="orderTitle">备注 : </label>
						<div class="k-item-cont">
							{{order.remark}}
						</div>
					</div>
				</div>
			</div>

		</div>
		<div class="c-cont" v-show="order.dataStatus == 1 || order.dataStatus == 4">
			<span v-show="order.dataStatus == 1" class="btn quxiao" @click.stop="cancelOrder">取消订单</span>
			<!-- <span v-show="order.dataStatus == 5" class="btn" @click="goEV">去评价</span> -->
			<span v-show="order.dataStatus == 1" class="btn" @click="goPay">去支付</span>
			<span v-show="order.dataStatus == 4" class="btn" @click="collect">确认收货</span>
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
			// 复制成功事件
			onCopy() {
				this.$toast('复制成功')
			},
			// 获取订单信息
			getOrder() {
				let vm = this;
				this.$http.get('/panda-shop-api/v2/getOrder/' + this.$route.params.id).then(function (response) {
				   if(response.data.code == '1000'){
				     vm.order = response.data.result;
				     if(response.data.result.resOrderLogList && response.data.result.resOrderLogList.length > 0){
				       vm.resOrderLogList = response.data.result.resOrderLogList;
				       vm.logObj = response.data.result.resOrderLogList[0]
				     }
				     if(response.data.result.resPaymentList && response.data.result.resPaymentList.length > 0){
				       vm.paymentList = response.data.result.resPaymentList
				     }
				   }else{
				     vm.$toast(response.data.msg)
				   }
				 })
				 .catch(function (error) {
				   vm.$toast('请求超时，请稍后再试！')
				 });
			},
			// 返回上一页
			goBack() {
				this.$router.back(-1);
			},
			// 去支付
			goPay() {
				this.$init.order = this.order;
				this.$router.push('/product/orderPayCheck/' + this.order.id)
			},
			// 去查看物流
			goLogistics(obj) {
				this.$init.order = this.order;
				this.$router.push('/product/orderLogistics/' + this.order.id + '?shipperCode=' + obj.shipperCode + '&logisticCode=' + obj.logisticCode + '&goodsId=' + obj.id)
			},
			// 去评价
			goEV(obj) {
				this.$init.order = this.order;
				this.$router.push('/product/orderEvaluate/' + this.order.id + '?goodsId=' + obj.id)
			},
			// 确认收货
			collect() {
				let vm = this;
				vm.$store.commit('ctrlLoader', true)
				this.$http.get('/panda-shop-api/v2/receivedOrder/' + this.$route.params.id).then(function(response) {
						vm.$store.commit('ctrlLoader', false)
						if(response.data.code == '1000') {
							vm.getOrder()
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 日志
			goLog() {
				if(this.resOrderLogList.length > 0) {
					this.$init.order = this.order;
					this.$router.push('/product/orderDetailsLog/' + this.order.id)
				}
			},
			// 查看商品
			goGoods(obj) {
				this.$router.push('/product/' + obj.productId)
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
				this.$http.get('/panda-shop-api/v2/cancelOrder/' + this.order.id).then(function(response) {
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
			moneyFormat(value) {
				if(value) {
					var moneyValue = (value / 100).toFixed(2).split('.');

					return '<big>' + moneyValue[0] + '</big>.' + moneyValue[1]
				} else if(value === 0) {
					return '0'
				} else {
					return ''
				}
			}
		},
		filters: {
			// 标签
			afterSaleToStr(str) {
				var value = ''
				if(str) {
					value = str.split(',')[0]
				}
				if(value == 1) {
					return '不支持退换货和维修服务'
				} else if(value == 2) {
					return '七日包退'
				} else if(value == 3) {
					return '十五日包换'
				} else if(value == 4) {
					return '一年包修'
				} else {
					return ''
				}
			},
			// 时间格式化
			dateFormat(shijianchuo) {
				if(shijianchuo) {
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
				} else {
					return ''
				}
			},
			// 状态转字符串
			typeToStr(value) {
				if(value == 1) {
					return '待付款'
				} else if(value == 2) {
					return '待审核'
				} else if(value == 3) {
					return '待发货'
				} else if(value == 4) {
					return '待收货'
				} else if(value == 5) {
					return '已收货'
				} else if(value == 6) {
					return '已取消'
				} else if(value == 7) {
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
					return '中影现金卡支付'
				} else if(value == 2) {
					return '中影次卡支付'
				} else if(value == 3) {
					return '微信支付'
				} else if(value == 4) {
					return '中影现金卡微信补差支付'
				} else if(value == 5) {
					return '中影次卡微信补差支付'
				} else {
					return ''
				}
			},
		}
	}
</script>

<style scoped>
	.adress-content {
		position: relative;
		padding: 30px 20px 20px 80px;
		background-color: #FFFFFF;
	}
	
	.adress-content i {
		width: 40px;
		position: absolute;
		display: inline-block;
		left: 20px;
		top: calc(50% - 20px);
	}
	
	.adress-content h4 span {
		float: right;
		margin-right: 20px;
	}
	
	.adress-content label {
		color: #969696;
		margin-top: 10px;
		margin-bottom: 20px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.titleSpan {
		display: inline-block;
		position: relative;
		margin-left: 10px;
	}
	
	.titleSpan:before {
		content: " ";
		display: inline-block;
		position: absolute;
		top: 10%;
		height: 80%;
		width: 6px;
		left: -15px;
		background-color: #FF5162;
	}
	
	.order-main {
		height: calc(100% - 175px);
		padding-bottom: 40px;
		background-color: #F5F5F5;
		padding: 0 20px;
	}
	
	.cartContent,
	.orderContent {
		border-radius: 10px;
		box-shadow: 0px 5px 20px #E0E0E0;
		background-color: #FFFFFF;
	}
	
	.orderContent {
		padding: 20px 0;
	}
	
	.zongji {
		text-align: right;
		padding: 25px 30px;
	}
	
	.orderTitle {
		display: inline-block;
		width: 160px;
	}
	
	.container {
		background-color: #F5F5F5;
		padding-top: 84px;
		padding-bottom: 102px;
	}
	
	.order-name {
		line-height: 44px;
		padding: 20px 20px 20px;
		position: relative;
		font-size: 28px;
		border-bottom: 1px solid #f8f8f8;
	}
	
	.copy {
		display: inline-block;
		color: #ff5162;
		float: right;
		position: relative;
	}
	.copy i{
		display: inline-block;
		position: absolute;
		width: 36px;
		right: 50px;
	}
	.crad-cont {
		margin: 0 20px;
		border-radius: 8px;
		margin-bottom: 24px;
	}
	
	.goods-item {
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
		height: 176px;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.goods-item-img .img img {
		display: block;
		height: 100%;
	}
	
	.goods-item-info {
		width: 480px;
		padding-left: 20px;
		font-size: 24px;
		position: relative;
		padding-right: 100px;
	}
	
	.goods-item-info .guige {
		position: absolute;
		bottom: 10px;
		color: #969696;
	}
	
	.goods-item-info h4 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 32px;
		height: 64px;
	}
	
	.goods-item-info p {
		color: #808080;
		line-height: 40px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.goods-item-g {
		color: #808080;
		line-height: 40px;
		display: flex;
	}
	
	.goods-item-info .pull-left {
		flex: 10;
	}
	
	.goods-item-info-ab {
		position: absolute;
		right: 0;
		bottom: 0;
		line-height: 50px;
		background-color: #fff;
	}
	
	.goods-item-info .many {
		display: flex;
	}
	
	.goods-item-info .tags {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}
	
	.goods-item-info .tag {
		display: inline-block;
		font-size: 12px;
		line-height: 28px;
		padding: 0 10px;
		border-radius: 5px;
		color: #fff;
		background: linear-gradient(90deg, #ff9462, #ff3766);
	}
	
	.many small {
		font-size: 18px;
	}
	
	.many-left {
		color: #ff5162;
		position: absolute;
		top: -5px;
		right: 0px;
	}
	
	.many-right {
		line-height: 32px;
		color: #808080;
	}
	
	.k-cont {
		position: relative;
		padding: 0 20px;
		overflow: hidden;
	}
	
	.k-over {
		position: absolute;
		width: 335px;
		right: 40px;
		top: -40px;
	}
	
	.k-over img {
		display: block;
		width: 100%;
	}
	
	.line {
		border-top: 1px solid #ececec;
		margin: 4px 0;
	}
	
	.k-item {
		display: flex;
		line-height: 36px;
		padding: 9px 20px;
	}
	
	.k-item-cont {
		width: calc(100% - 100px);
		color: #808080;
		text-align: left;
	}
	
	.cartContent .k-item-cont {
		text-align: right;
		width: calc(100% - 100px);
	}
	
	.k-item-cont.on {
		color: #ff5162;
	}
	
	.orderContent .k-item {
		line-height: 40px;
	}
	
	.c-cont {
		position: fixed;
		box-sizing: border-box;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 24px 20px 0 20px;
		height: 100px;
		text-align: right;
		border-top: 1px solid #f8f8f8;
	}
	
	.btn {
		display: inline-block;
		font-size: 24px;
		line-height: 50px;
		height: 50px;
		width: 140px;
		border: 1px solid #ff5162;
		color: #ff5162;
		text-align: center;
		border-radius: 25px;
		margin-left: 20px;
	}
	
	.quxiao.quxiao {
		border: 1px solid #D1D1D1;
		color: #000000;
	}
</style>