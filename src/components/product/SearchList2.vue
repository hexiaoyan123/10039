<template>
  <div class="container backScroller">
    <div style="min-height: 100%;">
    <!-- 瀑布流滚动加载开始 -->
    <van-list
      v-model="falls.loading"
      :finished="falls.finished"
      @load="fallsOnLoad"
    >

    <ul class="list">
      <li class="itme" v-for="(item, index) in list" :key="index" @click="goGoods(item.productId)">
        <div class="item-left">
          <figure class="img">
            <img v-if="item.productImageUrl" :src="item.productImageUrl.split(',')[0] | imgSpecilize" alt="">
          </figure>
        </div>
        <div class="item-right">
          <p class="item-text">{{item.productName}}</p>
          <div class="item-info">
            <span class="on">
              <small>￥</small> <span class="priceSpan" v-html="moneyFormat(item.productSalesPrice)"></span>
            </span>
            <!-- <span class="item-evaluate">{{item.evaluate}}条评价</span> -->
          </div>
        </div>
      </li>
    </ul>
    <!-- <div class="noData" v-show="list.length == 0">暂无数据！</div> -->
    <h3 v-show="list.length == 0" class="noData">暂无数据！</h3>
    <h3 v-show="falls.finished && list.length > 0" class="noData">到底了！</h3>

    </van-list>
    <!-- 瀑布流滚动加载结束 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: ['condition'],
  data () {
    return {
      list: [],
      pageNum: 1,
      // 渠道ID
      channel: this.$init.channelId,
      // 瀑布流
      falls: {
        loading: false, // 加载中
        finished: false, // 结束调用
      }
    }
  },
  created () {
    if(this.$route.query.channel){
      this.channel = this.$route.query.channel
    }
    this.getGoods(true);
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
    // 瀑布流加载数据
    fallsOnLoad () {
      this.getGoods();
    },
    // 获取商品列表
    getGoods (clear) {
      let vm = this;
      if(clear){
        this.list  =[];
        this.pageNum = 1;
        this.falls.finished = false;
      }else{
        this.pageNum += 1;
      }
      vm.falls.loading = true;

      let postData = {};
      for(let key in this.condition){
        postData[key] = this.condition[key]
      }
      postData.pageNo = this.pageNum;
      postData.pageSize = 20;

      this.$http.post('/panda-shop-api/v1/pageProduct', postData).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            if(response.data.result.length > 0){
              vm.list = vm.list.concat(response.data.result);
              if(response.data.result.length < postData.pageSize){
                vm.falls.finished = true;
              }
              vm.$nextTick(() => {
                vm.falls.loading = false;
              })
            }else{
              vm.falls.loading = false;
              vm.falls.finished = true;
            }
          }else{
            vm.falls.loading = false;
            vm.falls.finished = true;
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 查看商品
    goGoods (id) {
      this.$router.push('/product/'+id)
    },
  },
  computed: {
    // 筛选条件
    conditions () {
      if(this.condition){
        return this.condition;
      }else{
        return {}
      }
    },
  },
  filters: {
    // 金钱格式化
    moneyFormat (value) {
      if(value){
        return (value/ 100).toFixed(2)
      }else if(value === 0){
        return 0
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
}
.list{
  background-color: #ffffff;
}
.itme{
  display: flex;
  border-top: 1px solid #eee;
}
.itme:first-child{
  border: none;
}
.item-left{
  padding: 40px;
  height: 166px;
  width: 166px;
}
.item-left .img{
  display: block;
  box-sizing: border-box;
  border-radius: 6px;
  height: 100%;
  width: 100%;
  border: 1px solid #eee;
  overflow: hidden;
}
.item-left .img img{
  display: block;
  height: 100%;
  width: 100%;
}
.item-right{
  flex: 10;
  padding-right: 20px;
}
.item-text{
  padding-top: 38px;
  line-height: 38px;
  font-size: 24px;
  height: 114px;
  overflow: hidden;
}
.item-info{
  font-size: 28px;
}
.item-evaluate{
  font-size: 24px;
  color: #c1c1c1;
}
</style>
