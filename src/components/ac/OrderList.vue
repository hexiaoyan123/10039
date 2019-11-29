<template>
	<div class="goods-list-out-cont order-goods-list">
		<van-list v-model="falls.loading" :finished="falls.finished" @load="fallsOnLoad">
			<goods-item v-for="(item, index) in list" :key="index" :obj="item" @refreshList="getOrder(true)"></goods-item>
			<div class="noData noOrderContent" v-show="list.length == 0 && ! falls.loading">
				<ul>
					<li><i><img src="@/assets/noThing/order.png" width="100%"/></i></li>
					<li><span>您还没有相关的订单！</span></li>
					<li><i><img src="@/assets/noThing/gwc-button.png" width="100%" @click="goPath('/index')" /></i></li>
				</ul>
			</div>
			<div class="noData" v-show="list.length > 0 && falls.finished">到底了！</div>
		</van-list>
	</div>
</template>

<script>
	import OrderGoodsListItem from './OrderListItem'
	export default {
		name: 'OrderGoodsList',
		components: {
			'goods-item': OrderGoodsListItem
		},
		props: ['dataStatu'],
		data() {
			return {
				list: [],
				pageNum: 1,
				// 瀑布流
				falls: {
					loading: true, // 加载中
					finished: false, // 结束调用
				},
			}
		},
		created() {
			this.getOrder(true);
		},
		methods: {
						// 跳转路径
			goPath(path) {
				this.$router.push(path)
			},
			// 瀑布流加载数据
			fallsOnLoad() {
				this.getOrder();
			},
			// 获取订单列表
			getOrder(clear) {
				// 页码处理
				if(clear) {
					this.list = [];
					this.pageNum = 1;
					this.falls.finished = false;
				} else {
					this.pageNum += 1;
				}
				let vm = this;
				let postData = {
					pageNo: this.pageNum,
					pageSize: 20,
					dataStatus: this.dataStatu,
					channelId: this.$init.channelId
				}
				this.$http.post('/panda-activity-api/v1/pageOrder', postData).then(function(response) {
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
			}
		}
	}
</script>

<style scoped>
	/* 商品列表 */
	
	.goods-list-out-cont {
		/* margin-top: 20px; */
		box-sizing: border-box;
		height: 100%;
		overflow: auto;
	}
	
	.noOrderContent ul {
		margin-top: 80px;
	}
	
	.noOrderContent ul li {
		text-align: center;
	}
	 
	.noOrderContent ul li:nth-child(1) i{
		display: inline-block;
		width: 160px;
		height: 160px;
	}
	
	.noOrderContent ul li:nth-child(2) span {
		font-size: 30px;
		color: #969696;
	}
	
	.noOrderContent ul li:nth-child(3) {
		margin-top: 30px;
	}
	
	.noOrderContent ul li:nth-child(3) i{
		display: inline-block;
		width: 240px;
	}
</style>
<style>
	.order-goods-list .van-tabs {
		height: 100%;
		overflow: auto;
		box-sizing: border-box;
	}
</style>