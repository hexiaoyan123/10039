<template>
  <div class="goods-list-out-cont produce-cont order-goods-list">
    <Vheader name="活动订单"></Vheader>
    <van-tabs v-model="dataStatu" >
      <van-tab v-for="(item, index) in dataStatus" :key="item.id" :title="item.name">
        <order-goods-list v-if="dataStatu == index" :dataStatu="item.id"></order-goods-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
import OrderGoodsList from './OrderList'
export default {
  name: 'AcOrders',
  components: {
    'order-goods-list': OrderGoodsList,
    Vheader
  },
  data () {
    return {
      // 状态
      dataStatu: '',
     dataStatus: [{
        id: '',
        name: '全部'
      }, {
        id: 1,
        name: '待付款'
      }, {
        id: 3,
        name: '已报名'
      }, {
        id: 4,
        name: '已取消'
      }, {
        id: 5,
        name: '已失败'
      }],
    }
  },
  created () {
    
  },
  methods: {
   
  },
  beforeRouteLeave (to, from, next) {
    if(to.path.indexOf('/ac/orderDetails/') >= 0 || to.path.indexOf('/ac/orderPay/') >= 0 ){
      from.meta.isBack = true;
      to.meta.isBack = false;
      window.sessionStorage.setItem('orderBackScroller1', document.querySelectorAll('.van-tabs__content')[0].scrollTop)
      window.sessionStorage.setItem('orderBackScroller2', document.querySelectorAll('.van-tabs__nav')[0].scrollLeft)
    }else{
      from.meta.isBack = false;
    }
    next()
  },
  beforeRouteEnter (to,from,next) {
    let scrollTop = sessionStorage.getItem('orderBackScroller1');
    let scrollLeft = sessionStorage.getItem('orderBackScroller2');
    next(vm => {
      if(vm && scrollTop && to.meta.isBack){
        document.querySelectorAll('.van-tabs__content')[0].scrollTo(0, scrollTop)
        document.querySelectorAll('.van-tabs__nav')[0].scrollTo(scrollLeft, 0)
      }else{
        // 刷新数据
        vm.dataStatu = 1
        vm.$nextTick(() => {
          vm.dataStatu = 0
        })
      }
    })
  }
}
</script>

<style scoped>
.produce-cont{
  padding-top: 84px;
}
/* 商品列表 */
.goods-list-out-cont{
  /* margin-top: 20px; */
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  background-color: #f8f8f8;
}
</style>
<style>
.order-goods-list .van-tabs{
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.order-goods-list .van-tabs__content{
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.order-goods-list .van-tab__pane{
  height: auto;
}
</style>
