<template>
  <div class="movie-conter">
    <!-- 瀑布流滚动加载开始 -->
    <van-list
      v-model="falls.loading"
      :finished="falls.finished"
      @load="fallsOnLoad"
    >
      <div class="movie-list">
        <show-item v-for="(item, index) in list" :key="index" :obj="item" @refreshList="getOrder"></show-item>

        <div class="noData" v-show="list.length == 0 && ! falls.loading">暂无数据！</div>
        <div class="noData" v-show="list.length > 0 && falls.finished">到底了！</div>
      </div>
    </van-list>
    <!-- 瀑布流滚动加载结束 -->
  </div>
</template>

<script>
import OrderListItem from './OrderListItem'
export default {
  components: {
    'show-item': OrderListItem
  },
  props: ['dataStatu'],
  data () {
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
  created () {
    this.getOrder(true);
  },
  methods: {
    // 瀑布流加载数据
    fallsOnLoad () {
      this.getOrder();
    },
    // 获取订单列表
    getOrder (clear) {
      // 页码处理
      if(clear){
        this.list  =[];
        this.pageNum = 1;
        this.falls.finished = false;
      }else{
        this.pageNum += 1;
      }
      let vm = this;
      let postData = {
        pageNo: this.pageNum,
        pageSize: 20,
        dataStatus: this.dataStatu
      }
      this.$http.post('/panda-ticket-api/v1/pageOrder', postData).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            vm.list = vm.list.concat(response.data.result);
            vm.$nextTick(() => {
              vm.falls.loading = false;
            })
          }else{
            vm.falls.loading = false;
            vm.falls.finished = true;
          }
        }else{
          vm.$toast(response.data.msg);
          vm.falls.loading = false;
          vm.falls.finished = true;
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    }
  }
}
</script>

<style scoped>
.movie-list{
  padding: 20px;
  
}
.movie-conter{
  height: 100%;
  overflow: auto;
}
</style>

