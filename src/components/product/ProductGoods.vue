<template>
	<div class="product-cont" ref="productGoodsCont" @touchmove="sMove" @touchstart="sStart">

		<!-- 轮播图开始 -->
		<div class="goods-top" v-if="goods.imageUrl">
			<van-swipe>
				<van-swipe-item v-for="(item, index) in goods.imageUrl.split(',')" :key="index">
					<img :src="$init.imgIp + item" @load="imgLoad(index)" />
				</van-swipe-item>
			</van-swipe>
			<!-- 比价开始 -->
			<div v-show="internetPrice.val" class="gradation bijia-cont clearfix" :class="{'bijia-cont-open': showB}" v-swipeleft="openB" v-swiperight="closeB">
				<div class="bijia-logo">
					<figure class="img">
						<img src="@/assets/xb/bijia.png" alt="">
					</figure>
				</div>
				<div class="bijia-link unoverflow" @click="goLink(internetPrice.val)">
					<div class="unoverflow bijia-link-in">{{internetPrice.show}}</div>
				</div>
			</div>
			<!-- 比价结束 -->
		</div>
		<!-- 轮播图结束 -->

		<!-- 商品信息开始 -->
		<div class="goods-info">
			<h3>{{goods.name}}</h3>
			<p v-show="goods.digest">{{goods.digest}}</p>
			<div class="goods-info-many on">
				<div class="goods-info-many-good">
					<figure class="img">
						<img src="@/assets/xb/good.png" alt="">
					</figure>
					优选商城
				</div>

				<small>¥</small>
				<span v-if="specGood.price" class="priceSpan" v-html="moneyFormat(specGood.price)"></span>
				<span v-else-if="goods.resProductSkuList && goods.resProductSkuList[0]" class="priceSpan" v-html="moneyFormat(goods.resProductSkuList[0].salesPrice)"></span>
			</div>
			<div class="goods-info-market">
				<del>￥{{specGood.marketPrice | moneyFormat}}<!--<span class="priceSpan" v-html="moneyFormat(specGood.marketPrice)"></span>-->/ 原价</del>
			</div>
		</div>
		<!-- 商品信息结束 -->

		<!-- 信息块开始 -->
		<div class="base-list">
			<div class="base-list-item">
				<div class="base-list-item-left" v-if="specGood.id">
					已选择： {{specGood.message}}
				</div>
				<div class="base-list-item-left" v-if="! specGood.id">
					请选择
				</div>
				<div class="base-list-item-right" @click="openSelect">
					<i class="icon-more"></i>
				</div>
			</div>
		</div>
		<!-- 信息块结束 -->

		<!-- 服务保障开始 -->
		<div class="base-list" @click="goEv(3)">
			<div class="base-list-item">
				<div class="base-list-item-left" v-if="specGood.id">
					服务保障
				</div>
				<div class="base-list-item-right">
					<i class="icon-more"></i>
				</div>
			</div>
		</div>
		<!-- 服务保障结束 -->

		<div class="base-list">
			<div class="base-list-item">
				<div class="base-list-item-left">
					评价 ({{ev.count}})
				</div>
				<div class="base-list-item-right ping-name-right" @click="goEv(4)">
					more
					<i class="icon-more"></i>
				</div>
			</div>
			<div class="base-list-item" v-for="(item, index) in ev.list" :key="index">
				<div class="base-list-item-left">
					<p class="base-list-item-top">
						<van-rate v-model="item.score" disabled :size="12" disabled-color="#ff5162" />
					</p>
					<p>{{item.content}}</p>
				</div>
				<div class="base-list-item-right">
					{{item.nickname}}
				</div>
			</div>

			<div v-show="ev.list.length == 0" class="noData">暂无数据！</div>
		</div>

		<div class="getmore">
			<i class="iconfont">&#xe66a;</i>
			<span class="getmore-text">上拉查看图文详情</span>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'ProductGoods',
		props: ['info', 'spec'],
		components: {

		},
		data() {
			return {
				// 轮播图
				bannerImages: [],
				channel: this.$route.params.channel, // 商品渠道
				// 评价
				ev: {
					count: '', // 评价条数
					list: [], // 评价列表
				},
				showB: false, // 打开比价
				internetPrice: {}, // 比价

				// 旧的滚动距离
				startScroll: 0,
				touchStart: 0,
				touchCurrent: 0,
			}
		},
		created() {
			this.getReview();
			// 比价配置
			if(this.info.internetPrice) {
				try {
					this.internetPrice = JSON.parse(this.info.internetPrice)[0]
				} catch(err) {
					this.internetPrice = {}
				}
			}
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
			// 首页图片加载完成
			imgLoad(index) {
				if(index == 0) {
					this.$store.commit('ctrlLoader', false)
				}
			},
			// 移动开始
			sStart(e) {
				let vm = this;
				vm.startScroll = vm.$refs.productGoodsCont.scrollTop;
				vm.touchStart = e.targetTouches[0].pageY;
			},
			// 移动结束
			sMove(e) {
				let vm = this;
				vm.touchCurrent = e.targetTouches[0].pageY;

				var touchesDiff = vm.touchCurrent - vm.touchStart;

				var slide = vm.$refs.productGoodsCont;
				var onlyScrolling =
					(slide.scrollHeight > slide.offsetHeight) &&
					(
						(touchesDiff < 0 && vm.startScroll === 0) ||
						(touchesDiff > 0 && vm.startScroll === (slide.scrollHeight - slide.offsetHeight)) ||
						(vm.startScroll > 0 && vm.startScroll < (slide.scrollHeight - slide.offsetHeight))
					);
				if(onlyScrolling) {
					e.stopPropagation();
				}
			},
			// 打开比价
			openB() {
				this.showB = true;
			},
			// 关闭比价
			closeB() {
				this.showB = false;
			},
			// 更多评价
			goEv(num) {
				this.$emit('gotoev', num);
			},
			// 打开选择框
			openSelect() {
				this.$emit('showModu', 3);
			},
			// 获取评价信息
			getReview() {
				let vm = this;
				let postData = {
					"productId": this.$route.params.id,
					pageNo: 1,
					pageSize: 10
				}
				this.$http.post('/panda-shop-api/v1/pageReview', postData).then(function(response) {
						if(response.data.code == '1000') {
							vm.ev = {
								count: response.data.count, // 评价条数
								list: response.data.result ? response.data.result : [] // 评价列表
							}
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 跳转
			goLink(url) {
				if(url) {
					window.location.href = url;
				}
			}
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
			}
		},
		computed: {
			goods() {
				let obj = {};
				if(this.info) {
					obj = this.info;
				}
				return obj;
			},
			specGood() {
				let obj = {};
				return this.spec;
			}
		},
		watch: {
			info() {
				// 比价配置
				if(this.info.internetPrice) {
					try {
						this.internetPrice = JSON.parse(this.info.internetPrice)[0]
					} catch(err) {
						this.internetPrice = {}
					}
				}
			}
		}
	}
</script>

<style scoped>
	.getmore {
		text-align: center;
		font-size: 24px;
		padding: 20px;
		line-height: 40px;
		background-color: #fff;
		color: #818181;
	}
	
	.getmore-text {
		margin-left: 10px;
	}
	
	.product-cont {
		height: 100%;
		overflow: auto;
	}
	
	.goods-top {
		width: 100%;
		position: relative;
		overflow: hidden;
	}
	
	.goods-top img {
		display: block;
		width: 100%;
	}
	
	.goods-top .van-swipe-item img {
		height: 300px;
	}
	
	.goods-info {
		background-color: #ffffff;
		padding: 10px 20px;
		border-top: 1px solid #eee;
		margin-bottom: 20px;
	}
	
	.goods-info h3 {
		font-size: 24px;
		line-height: 38px;
		padding-bottom: 10px;
	}
	
	.goods-info p {
		font-size: 20px;
		color: #c1c1c1;
		line-height: 38px;
	}
	
	.goods-info-many {
		font-size: 36px;
		line-height: 50px;
		position: relative;
		color: #FF5162;
		margin-top: 20px;
	}
	
	.goods-info-many small {
		font-size: 18px;
	}
	
	.goods-info-market {
		font-size: 22px;
		color: #dddddd;
		line-height: 38px;
	}
	
	.base-list {
		background-color: #ffffff;
		margin-bottom: 20px;
	}
	
	.base-list-item {
		display: flex;
		padding: 20px;
		line-height: 44px;
		font-size: 24px;
		color: #818181;
	}
	
	.base-list-item-left {
		flex: 10;
	}
	
	.base-list-item-right .iconfont {
		font-size: 24px;
	}
	
	.ping-name-right {
		padding-right: 30px;
		position: relative;
	}
	
	.ping-name-right .icon-more {
		position: absolute;
		right: 0;
		top: 11px;
	}
	/* 优选商城 */
	
	.goods-info-many-good {
		position: absolute;
		right: 0;
		top: 20px;
		display: flex;
		font-size: 24px;
		height: 38px;
		line-height: 38px;
		padding-left: 38px;
		color: #4d4d4d;
	}
	
	.goods-info-many-good .img {
		height: 28px;
		width: 28px;
		position: absolute;
		left: 0;
		top: 4px;
	}
	
	.goods-info-many-good .img img {
		display: inline-block;
		height: 100%;
	}
	/* 比价 */
	
	.bijia-cont {
		position: absolute;
		right: -0;
		top: 50px;
		height: 76px;
		line-height: 76px;
		border-top-left-radius: 38px;
		border-bottom-left-radius: 38px;
		font-size: 28px;
		color: #fff;
		overflow: hidden;
		transition: all .8s;
		min-width: 132px;
		width: auto;
	}
	
	.bijia-logo {
		float: left;
		width: 132px;
		box-sizing: border-box;
		padding-left: 20px;
		padding-top: 18px;
		margin-right: 10px;
	}
	
	.bijia-logo .img {
		display: block;
		height: 41px;
		width: auto;
		margin: 0 auto;
	}
	
	.bijia-logo .img img {
		display: block;
		width: 100%;
	}
	
	.bijia-cont-open .bijia-link {
		width: 300px;
		text-align: center;
	}
	
	.bijia-link {
		width: 0;
		transition: all .8s;
		box-sizing: border-box;
	}
	
	.bijia-link-in {
		padding-right: 20px;
		padding-left: 20px;
	}
</style>