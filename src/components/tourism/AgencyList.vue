<template>
<div class="container agency">
  <Vheader name="找旅行社"></Vheader>
  <van-list
      v-model="falls.loading"
      :finished="falls.finished"
      @load="fallsOnLoad"
    >
    <ul class="agency-list">
      <li class="agency-item" v-for="(item, index) in list" :key="index" @click="goAg(item.id)">
        <div class="item-name">{{item.name}}</div>
        <div class="item-code">许可证：{{item.licenseKey}}</div>
        <div class="item-star">
          <van-rate
            :value="item.starLevel"
            :size="12"
            :count="5"
            color="#2ba"
            void-color="#2db880"
          />
        </div>
      </li>

      <li class="noData" v-show="list.length == 0 && ! falls.loading">暂无数据！</li>
      <li class="noData" v-show="list.length > 0 && falls.finished">到底了！</li>

    </ul>
  </van-list>
</div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  components: {
    Vheader
  },
  data () {
    return {
      pageNum: 1,
      // 瀑布流
      falls: {
        loading: true, // 加载中
        finished: false, // 结束调用
      },
      list: [],
    }
  },
  created () {
    this.getList(true)
  },
  methods: {
    goAg (id) {
      this.$router.push('/tourism/agencyDetail/' + id)
    },
    // 瀑布流加载数据
    fallsOnLoad () {
      this.getList();
    },
    // 获取旅行社列表
    getList (clear) {
      // 页码处理
      if(clear){
        this.list  =[];
        this.pageNum = 1;
        this.falls.finished = false;
      }else{
        this.pageNum += 1;
      }

      let vm = this;
      var postData = {
        pageNo: this.pageNum,
        pageSize: 20,
        channelId: this.$init.channelId,
        travelAreaId: this.$route.query.travelAreaId, // 旅游区域
        starLevel: this.$route.query.starLevel, // 星级
        name: this.$route.query.name
      }
      
      this.$http.post('/panda-travel-api/v1/pageTravelAgency', postData, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
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
          vm.$toast(response.data.msg);
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
.agency{
  /* background-color: #fff; */
  padding-top: 84px;
}
.agency-item{
  padding: 20px 30px;
  border-bottom: 1px solid #ececec;
}
.item-name{
  color: #4d4d4d;
  font-size: 28px;
  line-height: 46px;
}
.item-code{
  font-size: 24px;
  color: #a3a3a3;
  line-height: 46px;
}
</style>