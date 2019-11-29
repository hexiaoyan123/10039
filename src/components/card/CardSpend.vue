<template>
	<div class="container">
		<Vheader name="消费明细"></Vheader>
		<div class="SpendContent">
			<template v-for="item in data">
				<span class="titleSpan">{{item.serviceTypeName}}</span>
				<div class="oneSpendContent">
					<ul>
						<li>{{item.cash}}元</li>
						<li>时间：{{item.timeStamp}}</li>
					</ul>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import Vheader from '../HeaderV'
	export default {
		name: 'CardHelp',
		components: {
			Vheader
		},
		data() {
			return {
				data:'',
				voucher: this.$route.query.voucher
			}
		},
		created(){
			this.initData();
		},
		methods: {
			initData(){
				this.$http.get('/panda-payment-api/v1/listVoucherJournal/' + this.voucher).then((response) => {
						if (response.data.code == '1000') {
							this.data = response.data.result;
						} else {
							this.$toast(response.data.msg)
						}
					})
					.catch(function(error) {
						this.$toast('网络错误')
					});
			}
		}
	}
</script>
<style>

</style>
<style scoped>
	.oneSpendContent{
		padding: 0 30px;
	}
	.oneSpendContent ul{
		border-radius: 15px;
		padding: 20px 20px;
		box-shadow: 0px 5px 20px #E0E0E0;
	}
	.oneSpendContent ul li{
		padding: 10px;
		color: #808080;
	}
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

	.SpendContent {
		padding-top: 84px;
	}

	.titleSpan {
		display: inline-block;
		position: relative;
		margin-left: 50px;
		margin-top: 18px;
		margin-bottom: 20px;
		font-size: 28px;
		color: #4D4D4D;
	}

	.titleSpan:before {
		content: " ";
		display: inline-block;
		position: absolute;
		top: 10%;
		height: 80%;
		width: 6px;
		left: -18px;
		background-color: #FF5162;
	}
</style>
