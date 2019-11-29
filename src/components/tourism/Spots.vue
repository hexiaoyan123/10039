<template>
<div class="container spots">
  <!-- 搜索开始 -->
  <div class="seanch-btn" @click="openS">
    <i class="iconfont">&#xe6ac;</i> 搜索景点
  </div>
  <!-- 搜索结束 -->
  <SpotsForm v-show="sShow" @close="sShow = false"></SpotsForm>


  <div class="spots-nodata noData" v-show="areaList.length == 0">暂无数据！</div>
  <div class="spots-cont" v-show="areaList.length > 0">
    <!-- 区域列表开始 -->
    <div class="spots-left">
      <ul class="area-list unoverflow">
        <li class="area-item unoverflow" @click="clickArea(item)" :class="{'area-item-on': areaNow.id == item.id}" v-for="(item, index) in areaList" :key="index">
          {{item.name}}
        </li>
      </ul>
    </div>
    <!-- 区域列表结束 -->
    <!-- 景点开始 -->
    <div class="spots-right">
      <!-- 城市名片开始 -->
      <div class="aera-card" @click="openArea" v-show="areaNow.id">
        <div class="aera-card-img">
          <figure class="img">
            <img :src="areaNow.imageUrl | imgSpecilize" alt="">
          </figure>
        </div>
        <div class="aera-card-info">
          <div class="aera-card-name">{{areaNow.name}}</div>
          <div class="aera-card-text">城市名片</div>
          <span class="aera-card-more">
            <i class="iconfont">&#xe625;</i>
          </span>
        </div>
      </div>
      <!-- 城市名片结束 -->
      <div class="card-list clearfix">
        <div class="card-item" v-for="(item, index) in spotList" :key="index" @click="openSpot(item.id)">
          <div class="card-item-img">
            <figure class="img">
              <img :src="item.imageUrl | imgSpecilize" alt="">
            </figure>
          </div>
          <div class="card-item-name unoverflow">{{item.name}}</div>
        </div>
      </div>
    </div>
    <!-- 景点结束 -->
  </div>
</div>
</template>

<script>
import SpotsForm from './SpotsForm'
export default {
  components: {
    SpotsForm
  },
  data () {
    return {
      imgIp: this.$init.imgIp, // 图片地址
      sShow: false, // 搜索窗口
      areaList: [], // 区域列表
      areaNow: {}, // 当前区域
      spotList: [], // 景点列表
    }
  },
  created () {
    // this.getAreaList()
  },
  methods: {
    // 打开搜索框
    openS () {
      this.sShow = true;
      document.querySelector('#spots-s').focus()
    },
    // 打开城市
    openArea () {
      this.$router.push('/tourism/area/'+ this.areaNow.id)
    },
    // 打开景点
    openSpot (id) {
      this.$router.push('/tourism/spotDetail/'+ id)
    },
    // 获取景点
    getSports (areaId) {
      let vm = this;
      var postData = {
        channelId: this.$init.channelId,
        pageSize: '100',
        pageNo: '1',
        travelAreaId: areaId,
        name: '',
      }
      vm.spotList = []
      this.$http.post('/panda-travel-api/v1/pageScenicSpot', postData, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            vm.spotList = response.data.result;
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 点击地址
    clickArea (obj) {
      this.areaNow = obj;
      this.getSports(obj.id)
    },
    // 获取区域列表
    getAreaList () {
      let vm = this;
      var postData = {
        channelId: this.$init.channelId,
        parentId: '0',
        name: ''
      }
      this.$http.post('/panda-travel-api/v1/listTravelArea', postData, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            vm.areaList = response.data.result;
            vm.clickArea(response.data.result[0])
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
  beforeRouteLeave (to, from, next) {
    to.meta.isBack = false;
    from.meta.isBack = true;
    next()
  },
  activated () {
    if(! this.$route.meta.isBack){
      this.getAreaList()
    }
  }
}
</script>

<style scoped>
.spots-nodata {
  padding: 100px 0 88px 0;
}
.spots-cont{
  box-sizing: border-box;
  padding: 100px 0 88px 0;
  height: 100%;
  display: flex;
}
.spots-left{
  height: 100%;
  width: 180px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.spots-right{
  height: 100%;
  flex: 10;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.area-list{
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eee;
}
.area-item{
  border-left: 6px solid transparent;
  border-bottom: 1px solid #eeeeee;
  text-align: center;
  overflow: hidden;
  line-height: 96px;
  font-size: 24px;
}
.area-item-on{
  color: #ff5162;
  background-color: #f8f8f8;
  border-left-color: #ff5162;
  font-weight: 700;
}
.aera-card{
  display: flex;
  position: relative;
  padding: 0 30px 30px 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}
.aera-card-img{
  padding-right: 22px;
}
.aera-card-img .img{
  height: 144px;
  width: 240px;
  overflow:  hidden;
  border-radius: 5px;
}
.aera-card-img .img img{
  display: block;
  width: 100%;
  height: 100%;
}
.aera-card-info{
  flex: 10;
  font-size: 24px;
  line-height: 42px;
  padding-top: 32px;
  padding-right: 30px;
}
.aera-card-text{
  color: #c1c1c1;
  font-size: 20px;
  line-height: 38px;
}
.aera-card-more{
  position: absolute;
  right: 30px;
  line-height: 44px;
  top: 50px;
}
.aera-card-more .iconfont{
  font-size: 24px;
}

.card-list{
  padding: 0 15px;
}
.card-item{
  width: 50%;
  float: left;
  margin-bottom: 30px;
}
.card-item-img .img{
  height: 144px;
  width: 240px;
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
  padding-top: 8px;
  width: 240px;
  height: 38px;
  line-height: 38px;
  margin: 0 auto;
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

</style>