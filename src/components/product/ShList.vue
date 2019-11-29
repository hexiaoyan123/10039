<template>
	<div class="container spots-form">
		<div class="spots-seanch">
			<input @blur="iptBlur" readonly @focus="iptFocus" id="spots-s" type="text" v-model.trim="q" @click="goBack" maxlength="20">
			<span class="spots-seanch-ss">
        <i class="iconfont">&#xe6ac;</i>
      </span>
			<!-- <span class="spots-seanch-clear" v-show="q" @click="clearQ">
        <i class="iconfont">&#xe6e1;</i>
      </span> -->
		</div>

		<!-- 排序开始 （1：综合排序；2：销量排序；3：价格正序；4：价格倒序；）-->
		<div class="sort" v-show="list.length > 0">
			<div class="sort-left" :class="{'on': form.sort == 1}" @click="setSort(1)">
				综合 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i>
			</div>
			<div class="sort-center" :class="{'on': form.sort == 2}" @click="setSort(2)">销量 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i></div>
			<div class="sort-right" v-if="form.sort == 2 || form.sort == 1" @click="setSort(4)">价格 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i></div>
			<div class="sort-right on" v-if="form.sort == 5" @click="setSort(4)">价格<i class="iconfont up"><img src="../../assets/up.png" width="100%"/></i></div>
			<div class="sort-right on" v-if="form.sort == 4" @click="setSort(5)">价格 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i></div>
		</div>
		<!-- 排序结束 -->

		<!-- 无数据开始 -->
		<div class="goods-nodata" v-show="list.length == 0">
			<div class="goods-nodata-img">
				<img src="@/assets/goods/nodata.png" alt="">
			</div>
			<div class="goods-nodata-text">
				<p>没有找到相关商品</p>
				<p>建议更换关键词</p>
			</div>
		</div>
		<!-- 无数据结束 -->

		<!-- 搜索结果开始 -->
		<div class="container backScroller">
			<div style="min-height: 100%;">
				<van-list v-model="falls.loading" :finished="falls.finished" @load="fallsOnLoad">

					<ul class="goods-list clearfix">
						<li class="goods-item" v-for="(item, index) in list" :key="index" @click="goGoods(item.productId)">
							<div class="goods-item-in">
								<div class="hot-icon">
									<img src="@/assets/goods/hot.png">
								</div>
								<div class="goods-item-img">
									<img :src="item.productImageUrl.split(',')[0] | imgSpecilize" alt="">
								</div>
								<div class="goods-item-info">
									<h6 class="goods-item-name">{{item.productName}}</h6>
									<div class="goods-item-title">{{item.productName}}</div>
									<div class="goods-item-price">
										<div class="goods-item-price-left">
											<span class="del-out">
                        <span class="del-in"></span>
											<small>原价¥</small> {{item.marketPrice | moneyFormat}}</span>
										</div>
										<div class="goods-item-price-right">
											<small>¥</small>
											<span class="priceSpan" v-html="moneyFormat(item.productSalesPrice)"></span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>

					<h3 v-show="falls.finished && list.length > 0" class="noData">
			    	<i class="keguan"><img src="../../assets/keguan.png" width="100%"/></i>
			    	<span>客官，没有更多了！</span>
			    </h3>

				</van-list>
			</div>
		</div>
		<!-- 搜索结果结束 -->
	</div>
</template>

<script>
	export default {
		name: 'ShList',
		components: {

		},
		data() {
			return {
				q: this.$route.query.q, // 搜索内容
				list: [],
				noData: false, // 无数据

				list: [],

				flag: false,

				form: {
					name: '',
					sort: 1, // 1：综合排序；2：销量正序；3：销量倒序；4：价格正序；:5：价格倒序
					channelId: this.$init.channelId,
					pageNo: 1,
					pageSize: 20
				},
				// 瀑布流
				falls: {
					loading: false, // 加载中
					finished: false, // 结束调用
				}
			}
		},
		created() {
			// this.search()
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
			// 返回按钮
			goBack() {
				this.$router.back(-1);
			},
			// 查看商品
			goGoods(id) {
				this.$router.push('/product/' + id)
			},
			// 瀑布流加载数据
			fallsOnLoad() {
				if(this.flag) {
					this.form.pageNo += 1;
					this.getList();
				}
				this.flag = true;
			},
			// 获取数据
			getList() {
				let vm = this;
				vm.falls.loading = true;
				let postData = this.form;
				this.$http.post('/panda-shop-api/v2/pageProduct', postData).then(function(response) {
						if(response.data.code == '1000') {
							if(response.data.result && response.data.result.length > 0) {
								vm.list = vm.list.concat(response.data.result);
								if(response.data.result.length < postData.pageSize) {
									vm.falls.finished = true;
								}
								vm.$nextTick(() => {
									vm.falls.loading = false;
								})
							} else {
								vm.falls.loading = false;
								vm.falls.finished = true;
							}
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
			// 清除搜索
			clearQ() {
				this.q = '';
				this.search()
			},
			// 搜索
			search() {
				this.form.name = this.q;
				this.form.pageNo = 1;
				this.falls.finished = false;
				this.list = []
				this.getList()
			},
			// 设置排序
			setSort(num) {
				this.form.sort = num
				this.search()
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
		beforeRouteLeave(to, from, next) {
			if(to.path.indexOf('/product/shList') >= 0) {
				to.meta.isBack = true;
			} else if(to.meta.productInfo) {
				from.meta.isBack = true
				window.localStorage.setItem('productShBackScroller', document.querySelectorAll('.backScroller')[0].scrollTop)
			}
			next()
		},
		beforeRouteEnter(to, from, next) {
			let scrollTop = localStorage.getItem('productShBackScroller')
			if(from.meta.productInfo) {
				next(vm => {
					if(vm && scrollTop) {
						document.querySelectorAll('.backScroller')[0].scrollTo(0, scrollTop)
					}
				})
			} else {
				next(vm => {
					if(vm.$route.query.q) {
						vm.q = vm.$route.query.q.trim();
					} else {
						vm.q = ''
					}
					vm.form.sort = 1;
					vm.search()
				})
			}
		}
	}
</script>

<style scoped>
	.spots-form {
		padding-top: 170px;
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
	}
	
	.spots-seanch {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		box-sizing: border-box;
		padding: 15px 30px;
		background-color: #fff;
	}
	
	.spots-seanch .iconfont {
		font-size: 24px;
		color: #c1c1c1;
	}
	
	.spots-seanch input {
		position: absolute;
		left: 30px;
		width: 690px;
		line-height: 38px;
		padding: 16px 40px 16px 70px;
		box-sizing: border-box;
		font-size: 24px;
		border: none;
		outline: none;
		border-radius: 6px;
		-webkit-appearance: none;
		box-shadow: 0 0 30px #f0f0f0;
	}
	
	.spots-seanch-ss {
		position: absolute;
		line-height: 70px;
		top: 15px;
		left: 30px;
		width: 70px;
		text-align: center;
	}
	
	.spots-seanch-clear {
		position: absolute;
		line-height: 70px;
		top: 15px;
		left: 670px;
		width: 40px;
		text-align: center;
	}
	
	.spots-seanch-close {
		position: absolute;
		line-height: 70px;
		top: 15px;
		right: 30px;
		width: 80px;
		text-align: center;
	}
	/* 排序 */
	
	.sort {
		position: fixed;
		top: 100px;
		left: 0;
		width: 100%;
		height: 70px;
		box-sizing: border-box;
		line-height: 70px;
		display: flex;
		padding: 0 50px;
		background-color: #ffffff;
		z-index: 101;
	}
	
	.sort-left {
		flex: 3;
		text-align: center;
	}
	
	.sort-center {
		flex: 3;
		text-align: center;
	}
	
	.sort-right {
		flex: 3;
		text-align: center;
	}
	
	.sort-comp {
		position: absolute;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100px;
		line-height: 76px;
		padding-top: 156px;
	}
	
	.sort-comp-list {
		background-color: #ffffff;
		padding: 0 20px;
	}
	
	.sort-comp-item {
		display: flex;
	}
	
	.sort-comp-left {
		flex: 6;
	}
	
	.sort-comp-right {
		display: none;
		flex: 2;
		text-align: right;
	}
	
	.on .sort-comp-right {
		display: block;
	}
	/* 商品板块 */
	
	.goods-list {
		padding: 10px;
	}
	
	.goods-item {
		float: left;
		width: 50%;
		margin-bottom: 25px;
		background-color: #fff;
	}
	
	.goods-item-in {
		position: relative;
		width: 336px;
		box-sizing: border-box;
		margin: 0 auto;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		overflow: hidden;
	}
	
	.hot-icon {
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		width: 82px;
	}
	
	.hot-icon img {
		display: block;
		width: 100%;
		z-index: 100;
	}
	
	.goods-item-img {
		display: block;
		width: 100%;
		height: 340px;
	}
	
	.goods-item-img img {
		display: block;
		height: 100%;
		width: 100%;
	}
	
	.goods-item-info {
		padding: 20px 26px 14px 26px;
		position: relative;
	}
	
	.goods-item-info .goods-item-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: absolute;
		height: 70px;
		line-height: 70px;
		width: 100%;
		left: 0;
		top: -70px;
		overflow: hidden;
		color: #fff;
		box-sizing: border-box;
		padding: 0 26px;
		font-size: 24px;
		background: url(../../assets/goods/bg.png) no-repeat;
		background-size: 100%;
	}
	
	.goods-item-title {
		font-size: 20px;
		color: #808080;
		line-height: 30px;
		height: 60px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.goods-item-price {
		display: flex;
		padding-top: 20px;
		line-height: 44px;
		height: 64px;
	}
	
	.del-out {
		display: inline-block;
		max-width: 150px;
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: relative;
	}
	
	.del-in {
		position: absolute;
		height: 1px;
		width: 100%;
		background-color: #e5e5e5;
		left: 0;
		top: 50%;
	}
	
	.goods-item-price-left {
		flex: 10;
		font-size: 26px;
		color: #e5e5e5;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.goods-item-price-right {
		font-size: 36px;
		color: #ff5162;
		overflow: hidden;
		margin-left: 12px;
	}
	
	.goods-item-price small {
		font-size: 20px;
	}
	/* 无数据 */
	
	.goods-nodata-img {
		display: block;
		height: 188px;
		width: 188px;
		margin: 0 auto;
	}
	
	.goods-nodata-img img {
		display: block;
		width: 100%;
	}
	
	.goods-nodata-text {
		padding: 50px 0;
		line-height: 38px;
		text-align: center;
		font-size: 24px;
		color: #d3d3d3;
	}
	
	.priceSpan {
		font-size: 28px
	}
	
	.iconfont.up,
	.iconfont.down {
		width: 20px;
		height: 20px;
		display: inline-block;
	}
	.noData{
	position: relative;
}
.keguan{
	position: absolute;
	top: 15px;
	left: 36%;
	display: inline-block;
	height: 40px;
	width: 40px;
}
.noData span{
	position: absolute;
	top: 5px;
	left: calc(36% + 50px);
}
</style>