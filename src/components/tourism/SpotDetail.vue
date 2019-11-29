<template>
<div class="container area">
  <Vheader :name="info.name"></Vheader>
  <div style="min-height: 101%;">
    <div class="top-img">
      <figure class="img">
        <img :src="imgIp + info.imageUrl" alt="">
      </figure>
    </div>
    <div class="info">
      <div class="info-name">
        <div class="info-name-left">{{info.name}}</div>
        <div class="info-name-right"></div>
      </div>
      <div class="taps clearfix" v-show="taps.length > 0">
        <div class="tap" v-for="(item, index) in taps" :key="index">{{item}}</div>
      </div>
      <div class="info-deta rich-text" v-html="info.description"></div>
    </div>

    <div class="card-list-name" v-show="strategysList.length > 0">
      <div class="info-name">
        <div class="info-name-left">攻略推荐</div>
        <div class="info-name-right"></div>
      </div>
    </div>
    <div class="card-list clearfix">
      <div class="card-item2" v-for="(item, index) in strategysList" :key="index" @click="openStrategy(item.id)">
        <h2 class="card-item2-header">{{item.name}}</h2>
        <div class="card-item-img">
          <figure class="img">
            <img v-if="item.imageUrl" :src="imgIp + item.imageUrl" alt="">
          </figure>
        </div>
        <div class="card-item2-name">
          <div class="card-item2-name-left">
            <i class="iconfont">&#xe61f;</i> 
            <em>{{item.browseNum}}</em>
          </div>
          <div class="card-item2-name-right">
            <em>{{item.author}}</em>
          </div>
        </div>
      </div>
    </div>
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
      id: this.$route.params.id,
      info: {}, // 景点介绍
      strategysList: [], // 攻略推荐
      taps: [], // 标签列表
    }
  },
  created () {
    this.getSpot();
    this.getStrategys()
  },
  methods: {
    // 打开攻略
    openStrategy (id) {
      this.$router.push('/tourism/strategyDetail/'+id)
    },
    // 获取景点
    getSpot () {
      let vm = this;
      this.$http.get('/panda-travel-api/v1/getScenicSpot/' + this.id, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          vm.info = response.data.result;
          // 标签处理
          if(response.data.result.label){
            vm.taps = response.data.result.label.split(',');
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 获取攻略
    getStrategys () {
      let vm = this;
      var postData = {
        pageSize: '20',
        pageNo: '1',
        channelId: this.$init.channelId,
        travelAreaId: "", // 旅游区域ID
        scenicSpotId: this.id, // 景点ID
        author: '', // 作者
        name: '' // 名称
      }
      this.$http.post('/panda-travel-api/v1/pageTravelStrategy', postData, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            vm.strategysList = response.data.result;
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
  watch: {
    $route () {
      this.id = this.$route.params.id;
      this.getSpot();
      this.getStrategys()
    }
  }
}
</script>

<style scoped>
.container{
  padding-top: 84px;
}
.top-img .img{
  max-height: 450px;
  overflow: hidden;
}
.top-img .img img{
  display: block;
  width: 100%;
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
.card-item{
  width: 50%;
  float: left;
  box-sizing: border-box;
  padding: 0 15px;
  padding-bottom: 30px;
}
.card-item-img .img{
  max-height: 300px;
  width: 100%;
  overflow:  hidden;
  border-radius: 5px;
  margin: 0 auto;
}
.card-item-img .img img{
  display: block;
  width: 100%;
  height: 100%;
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
  padding-top: 8px;
  color: #c1c1c1;
}
.card-item2-name-left{
  flex: 10;
}
.card-item2-name em{
  /* color: #ff5162; */
}
.card-item2-header{
  font-size: 28px;
  font-weight: 700;
  line-height: 38px;
  padding: 20px 0 10px 0;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

/* 标签列表 */
.taps{
  padding: 10px 0 10px 0;
}
.taps .tap{
  float: left;
  font-size: 20px;
  color: #c1c1c1;
  line-height: 38px;
  padding: 0 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>