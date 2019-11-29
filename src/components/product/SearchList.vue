<template>
  <div class="container backScroller" @scroll="scroll">
    <div style="min-height: 100%;">
    <!-- 瀑布流滚动加载开始 -->
    <van-list
      v-model="falls.loading"
      :finished="falls.finished"
      @load="fallsOnLoad"
    >

    <!-- <ul class="list">
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
              <small>￥</small> {{item.productSalesPrice | moneyFormat}}
            </span>
          </div>
        </div>
      </li>
    </ul> -->

    <ul class="list">
      <li class="new-item" v-for="(item, index) in list" :key="index" @click="goGoods(item.productId)">
        <div class="new-item-in clearfix">
          <figure class="new-item-img">
            <div class="hot"></div>
            <img v-if="item.productImageUrl" :src="item.productImageUrl.split(',')[0] | imgSpecilize" alt="">
          </figure>
          <div class="new-item-info">
            <h2 class="new-item-info-name unoverflow">{{item.productName}}</h2>
            <div class="new-item-info-title">{{item.productName}}</div>
            <div class="new-item-info-many">
              <small>￥</small>
              <span class="priceSpan" v-html="moneyFormat(item.productSalesPrice)"></span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- <div class="noData" v-show="list.length == 0">暂无数据！</div> -->
    <h3 v-show="list.length == 0" class="noData">暂无数据！</h3>
    <h3 v-show="falls.finished && list.length > 0" class="noData">
    	<i class="keguan"><img src="../../assets/keguan.png" width="100%"/></i>
    	<span>客官，没有更多了！</span>
    </h3>

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
  	scroll(){
  		this.$emit("cscroll", document.querySelectorAll('.backScroller')[0].scrollTop > 0);   
  		
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
  background-color: #fff;
}
.list{
  background-color: #ffffff;
  padding-top: 10px;
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


/* 新列表 */
.new-item{
  padding: 6px 26px 20px 26px;
}
.new-item-in{
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.new-item-img{
  float: left;
  display: block;
  width: 240px;
  height: 240px;
  border-radius: 10px;
  border: 1px solid #eee;
  overflow: hidden;
  position: relative;
}
.hot{
  position: absolute;
  top: -1px;
  left: -1px;
  height: 85px;
  width: 85px;
  background: url(../../assets/xb/hot.png) no-repeat;
  background-size: 100%;
}
.new-item-img img{
  display: block;
  height: 100%;
  width: 100%;
}
.new-item-info{
  width: 390px;
  float: right;
}
.new-item-info-name{
  font-size: 28px;
  line-height: 54px;
  color: #4d4d4d;
}
.new-item-info-title{
  font-size: 24px;
  color: #808080;
  line-height: 36px;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.new-item-info-many{
  font-size: 36px;
  color: #ff5162;
  line-height: 42px;
  margin-top: 70px;
}
.new-item-info-many small{
  font-size: 18px;
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
