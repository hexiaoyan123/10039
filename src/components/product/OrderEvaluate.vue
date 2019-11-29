<template>
	<div class="container address-list">
		<Vheader name="评价"></Vheader>
		<div class="card-out">
			<div class="crad-cont" v-for="(item, index) in goods" :key="index" v-show="goodsId == item.id">
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
								<p class="no">{{item.specification}}</p>
								<div class="tags">
									<div class="tag" v-if="item.afterSale">{{item.afterSale | afterSaleToStr}}</div>
								</div>
								<div class="many">
									<div class="many-left">
										<small>￥</small><span class="priceSpan" v-html="moneyFormat(item.salesPrice)"></span>
									</div>
									<div class="many-right">
										<small>x</small><span class="priceSpan" v-html="moneyFormat(item.quantity)"></span>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<div class="tool-cont">
			实付款（含运费）
			<span class="on">
        <small>￥</small>
       <span class="priceSpan" v-html="moneyFormat(order.orderAmount)"></span>
			</span>
		</div>

		<div class="text-cont">
			<div class="star-cont">
				<div class="star-cont-label">评分：</div>
				<div class="star-cont-s">
					<van-rate :size="18" v-model="score" />
				</div>
			</div>
			<textarea @blur="iptBlur" @focus="iptFocus" rows="6" maxlength="300" v-model="content"></textarea>
			<div class="nums">{{content.length}} / 300</div>
		</div>

		<div class="btn-out">
			<div class="btn-in" @click="onSave">提交评价</div>
		</div>

	</div>
</template>

<script>
	import Vheader from '../HeaderV'
	export default {
		name: 'AddressAdd',
		components: {
			Vheader
		},
		data() {
			return {
				order: {},
				goods: [],
				checkGoods: {},
				goodsId: this.$route.query.goodsId,
				score: 5, // 评分
				content: '', // 评价
			}
		},
		created() {
			this.getOrder();
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
			// 获取订单信息
			getOrder() {
				let vm = this;
				this.$store.commit('ctrlLoader', true)
				this.$http.get('/panda-shop-api/v2/getOrder/' + this.$route.params.id).then(function(response) {
						vm.$store.commit('ctrlLoader', false)
						if(response.data.code == '1000') {
							vm.order = response.data.result;
							vm.goods = vm.order.resOrderItemList;
							vm.checkGoods = {}
							vm.goods.forEach((e, i) => {
								if(e.id == vm.$route.query.goodsId) {
									vm.checkGoods = e;
								}
							})
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 保存
			onSave() {
				let vm = this;
				// 请求参数
				var postData = {
					"productId": vm.checkGoods.productId,
					"score": vm.score,
					"content": vm.content
				}
				vm.$store.commit('ctrlLoader', true)
				var httpUrl = '/panda-shop-api/v2/saveReview'; // 请求地址
				this.$http.post(httpUrl, postData).then(function(response) {
						vm.$store.commit('ctrlLoader', false)
						if(response.data.code == '1000') {
							vm.$router.back(-1);
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			//focus
			iptFocus() {
				this.errorMessage = '';
				this.inFocus = true;
			},
			//blur
			iptBlur() {
				let this_ = this;
				this_.inFocus = false;
				setTimeout(function() {
					if(this_.inFocus == false) {
						// 当input 失焦时,滚动一下页面就可以使页面恢复正常
						this_.checkWxScroll();
					}
				}, 200)
			},
			checkWxScroll() {
				var ua = navigator.userAgent.toLowerCase();
				var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
				if(ua.match(/MicroMessenger/i) == 'micromessenger' && !!u) { //在iphone 微信中
					this.temporaryRepair();
				}
			},
			temporaryRepair() {
				var currentPosition, timer;
				var speed = 1; //页面滚动距离
				timer = setInterval(function() {
					currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
					currentPosition -= speed;
					window.scrollTo(0, 0); //页面向上滚动
					clearInterval(timer);
				}, 1);
			},
			// 返回上一页
			goBack() {
				this.$router.back(-1);
			},
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
		padding-top: 84px;
	}
	
	.on {
		color: #ff5162;
	}
	
	.card-out {
		padding-top: 26px;
	}
	
	.crad-cont {
		margin: 0 20px;
		box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
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
		border-radius: 5px;
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
		flex: 10;
		color: #ff5162;
		font-size: 28px;
		line-height: 32px;
	}
	
	.many-right {
		line-height: 32px;
		color: #808080;
	}
	
	.tool-cont {
		font-size: 26px;
		line-height: 38px;
		text-align: right;
		padding: 0 20px;
	}
	
	.star-cont {
		display: flex;
		margin-bottom: 20px;
	}
	
	.star-cont-label {
		font-size: 28px;
		line-height: 42px;
	}
	
	.star-cont-s {
		flex: 10;
		height: 42px;
	}
	
	.text-cont {
		padding: 20px;
		position: relative;
	}
	
	.nums {
		position: absolute;
		bottom: 40px;
		right: 40px;
		font-size: 20px;
		color: #a9a9a9;
		line-height: 32px;
		background-color: #f4f4f4;
	}
	
	.text-cont textarea {
		display: block;
		line-height: 32px;
		width: 100%;
		box-sizing: border-box;
		padding: 20px;
		border: none;
		background-color: #f4f4f4;
		border-radius: 8px;
	}
	
	.btn-out {
		padding: 22px 0;
	}
	
	.btn-in {
		width: 680px;
		text-align: center;
		line-height: 70px;
		height: 70px;
		text-align: center;
		color: #fff;
		border-radius: 35px;
		font-size: 28px;
		background: linear-gradient(90deg, #ffa54a, #ff8000);
		margin: 0 auto;
	}
</style>