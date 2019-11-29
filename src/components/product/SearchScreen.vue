<template>
	<div class="container screencont">
		<!-- 搜索开始 -->
		<div class="seanch-back" @click="goBack">
			<i class="iconfont">&#xe60d;</i>
		</div>
		<div class="seanch-btn" @click="goForm">
			<i class="iconfont">&#xe6ac;</i> 搜索商品
		</div>
		<!-- 搜索结束 -->

		<!-- 排序开始 （1：综合排序；2：销量排序；3：价格正序；4：价格倒序；）-->
		<div class="sort">
			<div class="sort-left" :class="{'on': screen.condition.sort == 1}" @click="setSort(1)">
				综合 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i>
			</div>
			<div class="sort-center" :class="{'on': screen.condition.sort == 2}" @click="setSort(2)">销量 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i></div>
			<div class="sort-right" v-if="screen.condition.sort == 2 || screen.condition.sort == 1" @click="setSort(3)">价格 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i></div>
			<div class="sort-right on" v-if="screen.condition.sort == 4" @click="setSort(3)">价格 <i class="iconfont up"><img src="../../assets/up.png" width="100%"/></i></div>
			<div class="sort-right on" v-if="screen.condition.sort == 3" @click="setSort(4)">价格 <i class="iconfont down"><img src="../../assets/down.png" width="100%"/></i></div>
		</div>
		<!-- 排序结束 -->

		<van-tabs v-model="classify.active" @click="checkTab">
			<van-tab v-for="(item, index) in classify.list" :key="index" :title="item.name">
				<div class="tabs-incont" v-if="item.id == classify.now.id">
					<!-- 筛选商品列表开始 -->
					<search-list ref="child" :condition="screen.condition" @cscroll="cscroll" ></search-list>
					<!-- 筛选商品列表结束 -->
				</div>
			</van-tab>
		</van-tabs>
		<div class="toTop" v-show="toTopShow" @click="toTop"><img src="../../assets/toTop.png" width="100%"/></div>
	</div>
</template>

<script>
	import SearchList from './SearchList'
	export default {
		name: 'SearchScreen',
		components: {
			'search-list': SearchList
		},
		data() {
			return {
				toTopShow: false,
				form: {
					show: false
				},
				// 渠道ID
				channel: this.$route.query.channel,
				// 筛选
				screen: {
					show: true,
					// 商品筛选条件
					condition: {
						'productCategoryId': this.$route.params.id ? this.$route.params.id : '', // 分类ID
						"q": this.$route.query.q ? this.$route.query.q : '',
						"brandId": "",
						"sort": "1"
					},
				},
				// 品牌
				brand: {
					show: false,
					list: [],
					id: '',
				},
				// 分类
				classify: {
					list: [],
					now: {},
					active: 0, // 标签绑定下标

					show: false,
					list1: [],
					list2: [],
					nowType: 1, // 当前选中标签
					check2: ''
				},
			}
		},
		created() {
			this.getAllClass()
		},
		methods: {
			cscroll(bo){
				this.toTopShow = bo;
			},
			toTop(){
				document.querySelectorAll('.backScroller')[0].scrollTo(0, 0)
			},
			// 刷新子组件列表
			resList() {
				this.$refs.child[0].getGoods(true)
			},
			// 排序
			setSort(type) {
				this.screen.condition.sort = type;
				this.resList()
			},
			// 返回上一页
			goBack() {
				this.$router.push('/product/searchClass');
			},
			// 搜索
			goForm() {
				this.$router.push('/product/shForm')
				// if(this.$route.params.id){
				//   this.$router.push('/product/searchForm?class='+ this.$route.params.id)
				// }else{
				//   this.$router.push('/product/searchForm?class='+ this.screen.condition.productCategoryId)
				// }
			},
			// 选中标签
			checkTab(index) {
				this.classify.now = this.classify.list[index];
				this.screen.condition.productCategoryId = this.classify.now.id
			},
			// 获取所有二级分类
			getAllClass() {
				let vm = this;
				this.$http.get('/panda-shop-api/v1/listProductCategory/' + this.$route.params.id).then(function(response) {
						if(response.data.code == '1000') {
							if(response.data.result) {
								vm.classify.list = response.data.result;
								if(vm.$route.query.check) {
									vm.classify.list.forEach((e, i) => {
										if(e.id == vm.$route.query.check) {
											vm.$nextTick(() => {
												vm.checkTab(i);
												vm.classify.active = i;
											})
										}
									})
								} else {
									vm.checkTab(0);
								}
							}
						} else {
							vm.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						vm.$toast('请求超时，请稍后再试！')
					});
			},
		},
		beforeRouteLeave(to, from, next) {
			if(to.path.indexOf('/product/searchClass') >= 0) {
				to.meta.isBack = true;
			} else if(to.meta.productInfo) {
				from.meta.isBack = true
				window.sessionStorage.setItem('productSBackScroller', document.querySelectorAll('.backScroller')[0].scrollTop)
			}
			next()
		},
		beforeRouteEnter(to, from, next) {
			let scrollTop = sessionStorage.getItem('productSBackScroller')
			if(from.meta.productInfo) {
				next(vm => {
					if(vm && scrollTop) {
						document.querySelectorAll('.backScroller')[0].scrollTo(0, scrollTop)
					}
				})
			} else {
				next(vm => {
					vm.getAllClass()
				})
			}
		}
	}
</script>

<style scoped>
	.toTop {
		position: fixed;
		right: 60px;
		bottom: 40px;
		width: 80px;
	}
	
	.container {
		/* background-color: #f8f8f8; */
	}
	
	.screencont {
		padding-top: 170px;
		overflow: hidden;
	}
	
	header {
		/* position: absolute; */
		position: fixed;
		box-sizing: border-box;
		width: 100%;
		top: 0;
		left: 0;
		height: 88px;
		background-color: #ffffff;
		border-bottom: 1px solid #eee;
		padding: 14px 22px 0 80px;
		border-radius: 2px;
		z-index: 101;
	}
	
	.class-header-s {
		height: 56px;
		line-height: 56px;
		width: 100%;
		background-color: #e4e4e4;
		color: #9f9f9f;
		font-size: 28px;
		text-align: center;
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
	
	.sort {
		position: fixed;
		top: 100px;
		left: 0;
		width: 100%;
		height: 70px;
		box-sizing: border-box;
		line-height: 70px;
		/* border-bottom: 1px solid #eee; */
		display: flex;
		padding: 0 20px;
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
	
	.class {
		position: fixed;
		box-sizing: border-box;
		width: 100%;
		top: 156px;
		left: 0;
		height: 70px;
		line-height: 50px;
		background-color: #ffffff;
		border-bottom: 1px solid #eee;
		padding: 10px 20px 0 20px;
		z-index: 99;
	}
	
	.class-item {
		text-align: center;
		background-color: #dadada;
	}
	
	.class .class-item-on {
		color: #ffffff;
		background-color: #ff5162;
		border-radius: 2px;
	}
	
	.class-window {
		position: fixed;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 98px;
		line-height: 76px;
		padding-top: 226px;
	}
	
	.class-window-btn {
		width: 100%;
		box-sizing: border-box;
		line-height: 80px;
		border-top: 1px solid #eee;
		font-size: 28px;
		text-align: center;
		background-color: #ffffff;
		display: flex;
	}
	
	.class-window-btn-left {
		flex: 5;
	}
	
	.class-window-btn-right {
		flex: 5;
		color: #ffffff;
		background-color: #ff5162;
	}
	
	.class-window-list {
		padding: 20px;
		background-color: #ffffff;
		font-size: 24px;
		line-height: 66px;
		max-height: 330px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	
	.cy-name {
		background-color: #ffffff;
		line-height: 60px;
		padding: 0 20px;
	}
	
	.cy-name span {
		display: inline-block;
		padding: 0 20px;
		border-bottom: 4px solid transparent;
	}
	
	.cy-name .on {
		border-color: #ff5162;
	}
	
	.class-window-list .on {
		background-color: #ff5162;
		color: #ffffff;
		border-radius: 6px;
		padding: 0 20px;
	}
	
	.seanch-btn {
		position: absolute;
		width: 82%;
		height: 70px;
		line-height: 70px;
		box-shadow: 0 0 20px #f0f0f0;
		left: 13%;
		top: 15px;
		border-radius: 6px;
		color: #c1c1c1;
		font-size: 24px;
		box-sizing: border-box;
		padding: 0 46px;
	}
	
	.seanch-btn .iconfont {
		font-size: 24px;
	}
	
	.seanch-back {
		font-size: 24px;
		position: absolute;
		top: 15px;
		left: 15px;
		line-height: 70px;
		width: 70px;
		text-align: center;
	}
	
	.seanch-back .iconfont {
		font-size: 28px;
	}
	
	.iconfont.up,
	.iconfont.down {
		width: 20px;
		height: 20px;
		display: inline-block;
	}
</style>

<style>
	.van-tabs {
		height: 100%;
		box-sizing: border-box;
	}
	
	.tabs-incont {
		height: 100%;
		background-color: #FFFFFF;
		overflow:hidden;
	}
	
	.van-tabs__content {
		height: 100%;
		background-color: #FFFFFF;
		overflow:hidden;
	}
	
	.van-tab__pane {
		height: 100%;
		background-color: #FFFFFF;
		overflow:hidden;
	}
</style>