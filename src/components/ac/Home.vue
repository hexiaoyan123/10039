<template>
<div class="container ac">
  <Vheader name="活动中心"></Vheader>

  <div class="ac-cont" ref="backScroller">
    <van-list
        v-model="falls.loading"
        :finished="falls.finished"
        @load="fallsOnLoad"
      >
        <div class="card-list clearfix">
          <div class="card-item" v-for="(item, index) in list" :key="index" @click="openAcDetail(item.activityId)">
            <div class="card-item-img">
              <figure class="img">
                <img :src="item.imageUrl | imgSpecilize" alt="">
              </figure>
            </div>
            <div class="card-item-info">
              <h2 class="unoverflow">{{item.name}}</h2>
              <p>{{item.startTime | dateFormat}}</p>
              <p>{{item.areaName}} {{item.address}}</p>
              <div class="more">
                <span class="btn" v-show="noTimestamp < item.startTime - 60*60">马上报名</span>
                <span class="btn2" v-show="noTimestamp >= item.startTime -  60*60 && noTimestamp <= item.endTime">报名截止</span>
                <span class="btn2" v-show="noTimestamp > item.endTime">活动结束</span>
              </div>
            </div>
          </div>
        </div>
      <div class="noData" v-show="list.length == 0 && ! falls.loading">暂无数据！</div>
      <div class="noData" v-show="list.length > 0 && falls.finished">到底了！</div>
    </van-list>
  </div>

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
      imgIp: this.$init.imgIp,
      sShow: false, // 搜索窗口
      list: [], // 活动列表
      pageNum: 1,
      // 瀑布流
      falls: {
        loading: true, // 加载中
        finished: false, // 结束调用
      },
      noTimestamp: Date.parse(new Date()) / 1000
    }
  },
  created () {
    
  },
  methods: {
    // 打开搜索框
    openS () {
      this.sShow = true;
      document.querySelector('#spots-s').focus()
    },
    // 打开活动
    openAcDetail (id) {
      this.$router.push('/ac/enrollDetail/'+id)
    },
    // 瀑布流加载数据
    fallsOnLoad () {
      this.getac();
    },
    // 获取活动
    getac (clear) {
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
        channelId: this.$init.channelId
      }
      this.$http.post('/panda-activity-api/v1/pageActivity', postData).then(function (response) {
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
    },
  },
  filters: {
    // 时间格式化
    dateFormat (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
  },
  beforeRouteEnter (to,from,next) {
    let scrollTop = sessionStorage.getItem('backScroller')
    if(from.path.indexOf('/ac/enrollDetail/') >= 0 && scrollTop){
      next(vm => {
        if(vm && vm.$refs.backScroller){
          vm.$refs.backScroller.scrollTo(0, scrollTop)
        }
      })
    }else{
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    to.meta.isBack = false;
    from.meta.isBack = true;
    window.sessionStorage.setItem('backScroller', this.$refs.backScroller.scrollTop)
    next()
  },
  activated () {
    if(! this.$route.meta.isBack){
      this.getac(true)
    }
  }
}
</script>

<style scoped>
.ac{
  box-sizing: border-box;
  padding-top: 84px;
}
.ac-cont{
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.card-list{
  padding: 0 30px;
}
.card-item{
  padding: 20px 0;
  border-top: 1px solid #eee;
  display: flex;
}
.card-list .card-item:first-child{
  border: none;
}
.card-item-img{
  width: 174px;
  height: 174px;
  border-radius: 5px;
  overflow: hidden;
}
.card-item-img img{
  display: block;
  width: 100%;
}
.card-item-info{
  width: 520px;
  box-sizing: border-box;
  padding-left: 20px;
}
.card-item-info h2{
  font-size: 28px;
  line-height: 28px;
  padding: 10px 0;
  font-weight: 700;
}
.card-item-info p{
  font-size: 24px;
  line-height: 38px;
  border-left: 4px solid #ff5162;
  color: #c1c1c1;
  padding-left: 20px;
}
.card-item-info .more{
  text-align: right;
}
.card-item-info .more .btn{
  display: inline-block;
  padding: 0 16px;
  border-radius: 5px;
  font-size: 24px;
  line-height: 48px;
  color: #fff;
  background-color: #ff5162;
  border: 1px solid #ff5162;
}
.card-item-info .more .btn2{
  display: inline-block;
  padding: 0 16px;
  border-radius: 5px;
  font-size: 24px;
  line-height: 48px;
  color: #c1c1c1;
  background-color: #fff;
  border: 1px solid #c1c1c1;
}
</style>