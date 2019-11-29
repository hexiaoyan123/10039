<template>
<div class="container agency">
  <Vheader name="找导游"></Vheader>
  <van-list
      v-model="falls.loading"
      :finished="falls.finished"
      @load="fallsOnLoad"
    >
    <ul class="agency-list">
      <li class="agency-item" v-for="(item, index) in list" :key="index" @click="goPath(item.id)">
        <div class="agency-item-left">
          <figure class="img">
            <img v-show="! item.imageUrl" src="../../assets/user.jpg" alt="">
            <img v-if="item.imageUrl" :src="imgIp + item.imageUrl" alt="">
            <div class="item-next">
              <i class="iconfont">&#xe625;</i>
            </div>
          </figure>
        </div>
        <div class="agency-item-right">
          <div class="item-line">
            <div class="item-name">{{item.name}}</div>
            <div class="item-star">
              <van-rate
                :value="item.starLevel"
                :size="12"
                :count="5"
                color="#2ba"
                void-color="#2db880"
              />
            </div>
          </div>
          <div class="item-code">导游证：{{item.licenseKey}}</div>
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
      imgIp: this.$init.imgIp,
      pageNum: 1,
      // 瀑布流
      falls: {
        loading: true, // 加载中
        finished: false, // 结束调用
      },
      list: []
    }
  },
  created () {
    this.getList(true)
  },
  methods: {
    goPath (id) {
      this.$router.push('/tourism/guideDetail/' + id)
    },
    // 瀑布流加载数据
    fallsOnLoad () {
      this.getList();
    },
    // 获取导游列表
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
        sex: this.$route.query.sex,
        grade: this.$route.query.grade,
        starLevel: this.$route.query.starLevel,
        name: this.$route.query.name
      }
      
      this.$http.post('/panda-travel-api/v1/pageTourGuide', postData, this.$init.channelId).then(function (response) {
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
  padding: 20px 40px 20px 20px;
  border-bottom: 1px solid #ececec;
  display: flex;
  position: relative;
}
.img{
  display: block;
  height: 100px;
  width: 100px;
  border-radius: 50px;
  overflow: hidden;
}
.img img{
  display: block;
  width: 100%;
}
.agency-item-left{
  width: 100px;
}
.agency-item-right{
  flex: 10;
  padding-left: 20px;
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
.item-line{
  display: flex;
  padding-top: 4px;
}
.item-line .item-name{
  width: 120px;
  overflow: hidden;
}
.item-line .item-star{
  line-height: 46px;
}
.item-next{
  position: absolute;
  line-height: 100px;
  top: 20px;
  right: 20px;
  font-size: 36px;
}
</style>