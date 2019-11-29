<template>
<div class="container strategys">
  <!-- 搜索开始 -->
  <div class="seanch-btn" @click="openS">
    <i class="iconfont">&#xe6ac;</i> 搜索攻略
  </div>
  <!-- 搜索结束 -->
  <StrategysForm v-show="sShow" @close="sShow = false"></StrategysForm>

  <div class="strategys-cont" ref="backScroller">
    <van-list
        v-model="falls.loading"
        :finished="falls.finished"
        @load="fallsOnLoad"
      >
        <div class="card-list clearfix">
          <div class="card-item2" v-for="(item, index) in list" :key="index" @click="openStrategy(item.id)">
            <h2 class="card-item2-header unoverflow">{{item.name}}</h2>
            <div class="card-item-img">
              <figure class="img">
                <img :src="imgIp + item.imageUrl" alt="">
              </figure>
            </div>
            <div class="card-item2-name">
              <div class="card-item2-name-view">
                <i class="iconfont">&#xe61f;</i> 
                <em>{{item.browseNum}}</em>
              </div>
              <div class="card-item2-name-left unoverflow">
                
              </div>
              <div class="card-item2-name-right">
                <em>{{item.author}}</em>
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
import StrategysForm from './StrategysForm'
export default {
  components: {
    StrategysForm
  },
  data () {
    return {
      imgIp: this.$init.imgIp,
      sShow: false, // 搜索窗口
      list: [], // 攻略列表
      pageNum: 1,
      // 瀑布流
      falls: {
        loading: true, // 加载中
        finished: false, // 结束调用
      },
    }
  },
  created () {
    // this.getStrategys(true)
  },
  methods: {
    // 打开搜索框
    openS () {
      this.sShow = true;
      document.querySelector('#spots-s').focus()
    },
    // 打开攻略
    openStrategy (id) {
      this.$router.push('/tourism/strategyDetail/'+id)
    },
    // 瀑布流加载数据
    fallsOnLoad () {
      this.getStrategys();
    },
    // 获取攻略
    getStrategys (clear) {
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
        travelAreaId: '', // 旅游区域ID
        scenicSpotId: '', // 景点ID
        author: '', // 作者
        name: '' // 名称
      }
      this.$http.post('/panda-travel-api/v1/pageTravelStrategy', postData, this.$init.channelId).then(function (response) {
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
  beforeRouteEnter (to,from,next) {
    let scrollTop = sessionStorage.getItem('backScroller')
    if(from.path.indexOf('/tourism/strategyDetail/') >= 0 && scrollTop){
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
      this.getStrategys(true)
    }
  }
}
</script>

<style scoped>
.strategys{
  box-sizing: border-box;
  padding-top: 100px;
  box-sizing: border-box;
  padding-bottom: 88px;
}
.strategys-cont{
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.seanch-btn{
  position: absolute;
  width: 90%;
  height: 70px;
  line-height: 70px;
  box-shadow: 0 0 20px #f0f0f0;
  left: 5%;
  top: 15px;
  border-radius: 6px;
  color: #c1c1c1;
  font-size: 24px;
  box-sizing: border-box;
  padding: 0 46px;
}
.seanch-btn .iconfont{
  font-size: 24px;
}

.card-list-name{
  padding: 10px 30px;
  border-top: 6px solid #eee;
}
.card-list{
  padding: 0 15px;
}
.card-item2{
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  padding-bottom: 30px;
}
.card-item2-header{
  font-size: 28px;
  font-weight: 700;
  line-height: 38px;
  padding: 20px 0 10px 0;
}
.card-item{
  width: 50%;
  float: left;
  box-sizing: border-box;
  padding: 0 15px;
  padding-bottom: 30px;
}
.card-item-img .img{
  width: 100%;
  /* max-height: 414px; */
  max-height: 300px;
  overflow:  hidden;
  border-radius: 5px;
  margin: 0 auto;
}
.card-item-img .img img{
  display: block;
  width: 100%;
}
.card-item-name{
  width: 100%;
  height: 38px;
  line-height: 38px;
}
.card-item2-name{
  width: 100%;
  height: 38px;
  line-height: 38px;
  display: flex;
  font-size: 24px;
  padding-top: 8px;
  color: #c1c1c1;
}
.card-item2-name em{
  /* color: #ff5162; */
}
.card-item2-name-left{
  flex: 10;
}
.card-item2-name-view{
  padding-right: 10px;
}
.card-item2-name-view .iconfont{
  font-size: 24px;
}

.info{
  padding: 30px; 
}
.info-name{
  display: flex;
  padding: 10px 0;
}
.info-name-left{
  font-size: 28px;
  line-height: 30px;
  border-left: 4px solid #ff5162;
  flex: 10;
  padding-left: 12px;
}
.info-name-right{
  font-size: 22px;
  color: #ff9300;
}
.info-deta{
  font-size: 20px;
  color: #c1c1c1;
  line-height: 38px;
}
</style>